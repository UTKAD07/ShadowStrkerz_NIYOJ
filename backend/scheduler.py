"""Build the weekly_plan envelope from stations.csv, defects.csv, and windows.csv.

trains.csv is presentation-only and is never read here.
controllers.csv is for mock login and is never read here.

Outputs:
    data/plan.json       weekly_plan JSON envelope (GET /plan)
    data/scheduler.csv   plan[] rows, one per scheduled task (for eyeballing)

Run:
    python scheduler.py
"""

from __future__ import annotations

import argparse
import csv
import json
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any


BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
ALLOWED_DEPARTMENTS = {"Track", "Signal", "Power"}
PLAN_COLUMNS = (
    "task_id",
    "corridor",
    "department",
    "date",
    "assigned_start",
    "assigned_end",
    "window_id",
    "priority_score",
    "status",
)
OPTIONAL_PLAN_FIELDS = (
    "km_marker",
    "speed_restriction_kmph",
    "reported_by",
    "external_ref",
    "safety_notes",
)
NUMERIC_OPTIONAL_FIELDS = {
    "km_marker": float,
    "speed_restriction_kmph": float,
}


def read_csv(path: Path) -> list[dict[str, str]]:
    if not path.exists():
        raise FileNotFoundError(f"File not found: {path}")

    with path.open("r", encoding="utf-8-sig", newline="") as file:
        reader = csv.DictReader(file)
        if not reader.fieldnames:
            raise ValueError(f"{path.name} has no header row")

        return [
            {str(key).strip(): (value or "").strip() for key, value in row.items()}
            for row in reader
            if any((value or "").strip() for value in row.values())
        ]


def require_columns(rows: list[dict[str, str]], required: set[str], filename: str) -> None:
    if not rows:
        raise ValueError(f"{filename} contains no data rows")

    missing = required - set(rows[0])
    if missing:
        raise ValueError(
            f"{filename} is missing column(s): {', '.join(sorted(missing))}"
        )


def get_block_sections(base_dir: Path = BASE_DIR) -> list[str]:
    """Adjacent station pairs from stations.csv, e.g. STN01-STN02."""
    stations_path = Path(base_dir) / "data" / "stations.csv"
    if not stations_path.exists():
        stations_path = Path(base_dir) / "stations.csv"

    station_rows = read_csv(stations_path)
    require_columns(station_rows, {"station_id", "sequence"}, "stations.csv")

    try:
        station_rows.sort(key=lambda station: int(station["sequence"]))
    except ValueError as error:
        raise ValueError("Every stations.csv sequence must be an integer") from error

    if len(station_rows) < 2:
        raise ValueError("stations.csv must contain at least two stations")

    return [
        f"{station_rows[index]['station_id']}-{station_rows[index + 1]['station_id']}"
        for index in range(len(station_rows) - 1)
    ]


def clamp(value: float, minimum: float = 0.0, maximum: float = 1.0) -> float:
    return max(minimum, min(maximum, value))


def calculate_priority(row: dict[str, str]) -> float:
    """0-1 score: 70% urgency, 30% overdue_days (capped at 10 days)."""
    try:
        urgency = int(row["urgency"])
        overdue_days = int(row["overdue_days"])
    except ValueError as error:
        raise ValueError(
            f"Invalid urgency/overdue_days for task {row.get('task_id', '')}"
        ) from error

    if urgency < 1 or urgency > 5:
        raise ValueError(
            f"urgency must be between 1 and 5 for task {row.get('task_id', '')}"
        )
    if overdue_days < 0:
        raise ValueError(
            f"overdue_days cannot be negative for task {row.get('task_id', '')}"
        )

    urgency_score = urgency / 5
    overdue_score = min(overdue_days / 10, 1)
    return round(clamp((urgency_score * 0.70) + (overdue_score * 0.30)), 2)


def task_duration_minutes(row: dict[str, str]) -> int:
    try:
        minutes = round(float(row["estimated_hours"]) * 60)
    except ValueError as error:
        raise ValueError(
            f"Invalid estimated_hours for task {row.get('task_id', '')}"
        ) from error

    if minutes <= 0:
        raise ValueError(
            f"Task {row.get('task_id', '')} duration must be greater than zero"
        )
    return minutes


def parse_window(row: dict[str, str]) -> dict[str, Any]:
    try:
        start = datetime.fromisoformat(f"{row['date']}T{row['start_time']}")
        end = datetime.fromisoformat(f"{row['date']}T{row['end_time']}")
    except ValueError as error:
        raise ValueError(
            f"Invalid date/time in window {row.get('window_id', '')}: {error}"
        ) from error

    if end <= start:
        end += timedelta(days=1)

    return {
        "window_id": row["window_id"],
        "corridor": row["corridor"],
        "date": row["date"],
        "start": start,
        "end": end,
        "next_free": start,
    }


def compatible_windows(
    task: dict[str, str], windows: list[dict[str, Any]]
) -> list[dict[str, Any]]:
    return [window for window in windows if window["corridor"] == task["corridor"]]


def optional_defect_fields(task: dict[str, Any]) -> dict[str, Any]:
    """Copy filled optional defect columns onto a plan row; skip blanks."""
    extras: dict[str, Any] = {}
    for name in OPTIONAL_PLAN_FIELDS:
        raw = str(task.get(name, "") or "").strip()
        if not raw:
            continue
        converter = NUMERIC_OPTIONAL_FIELDS.get(name)
        if converter is not None:
            try:
                number = converter(raw)
            except ValueError as error:
                raise ValueError(
                    f"Invalid {name} for task {task.get('task_id', '')}"
                ) from error
            extras[name] = int(number) if number.is_integer() else number
        else:
            extras[name] = raw
    return extras


def load_scheduler_inputs(data_dir: Path = DATA_DIR) -> tuple[list[str], list[dict[str, str]], list[dict[str, str]]]:
    """Read the three CSVs the scheduler is allowed to use."""
    block_sections = get_block_sections(data_dir.parent)
    defects = read_csv(data_dir / "defects.csv")
    windows = read_csv(data_dir / "windows.csv")
    return block_sections, defects, windows


def build_plan(
    defect_rows: list[dict[str, str]],
    window_rows: list[dict[str, str]],
    granularity: str = "weekly",
    block_sections: list[str] | None = None,
) -> dict[str, Any]:
    """Highest-priority tasks into the earliest window that still fits."""
    require_columns(
        defect_rows,
        {
            "task_id",
            "corridor",
            "department",
            "description",
            "urgency",
            "overdue_days",
            "estimated_hours",
        },
        "defects.csv",
    )
    require_columns(
        window_rows,
        {"window_id", "corridor", "date", "start_time", "end_time"},
        "windows.csv",
    )

    if granularity not in {"weekly", "monthly"}:
        raise ValueError("granularity must be 'weekly' or 'monthly'")

    allowed_corridors = set(block_sections or [])

    windows = sorted(
        (parse_window(row) for row in window_rows),
        key=lambda item: (item["start"], item["window_id"]),
    )
    if not windows:
        raise ValueError("windows.csv contains no usable windows")

    if allowed_corridors:
        invalid = [row["corridor"] for row in window_rows if row["corridor"] not in allowed_corridors]
        if invalid:
            raise ValueError(
                "windows.csv corridor(s) are not adjacent station pairs: "
                + ", ".join(sorted(set(invalid)))
            )

    prepared_tasks: list[dict[str, Any]] = []
    for row in defect_rows:
        department = row["department"].title()
        if department not in ALLOWED_DEPARTMENTS:
            raise ValueError(
                f"Invalid department for task {row['task_id']}: {row['department']!r}. "
                "Use Track, Signal, or Power."
            )

        clean_row = dict(row)
        clean_row["department"] = department
        clean_row["duration"] = task_duration_minutes(clean_row)
        clean_row["score"] = calculate_priority(clean_row)
        prepared_tasks.append(clean_row)

    prepared_tasks.sort(key=lambda item: (-item["score"], item["task_id"]))

    scheduled: list[dict[str, Any]] = []
    unscheduled: list[dict[str, str]] = []

    for task in prepared_tasks:
        if allowed_corridors and task["corridor"] not in allowed_corridors:
            leftover = {
                "task_id": task["task_id"],
                "corridor": task["corridor"],
                "department": task["department"],
                "reason": "corridor is not an adjacent station pair",
            }
            leftover.update(optional_defect_fields(task))
            unscheduled.append(leftover)
            continue

        chosen: dict[str, Any] | None = None
        assigned_end: datetime | None = None

        for window in compatible_windows(task, windows):
            possible_end = window["next_free"] + timedelta(minutes=task["duration"])
            if possible_end <= window["end"]:
                chosen = window
                assigned_end = possible_end
                break

        if chosen is None or assigned_end is None:
            leftover = {
                "task_id": task["task_id"],
                "corridor": task["corridor"],
                "department": task["department"],
                "reason": "no compatible window",
            }
            leftover.update(optional_defect_fields(task))
            unscheduled.append(leftover)
            continue

        assigned_start = chosen["next_free"]
        chosen["next_free"] = assigned_end

        plan_row: dict[str, Any] = {
            "task_id": task["task_id"],
            "corridor": task["corridor"],
            "department": task["department"],
            "date": chosen["date"],
            "assigned_start": assigned_start.strftime("%H:%M"),
            "assigned_end": assigned_end.strftime("%H:%M"),
            "window_id": chosen["window_id"],
            "priority_score": task["score"],
            "status": "scheduled",
        }
        plan_row.update(optional_defect_fields(task))
        scheduled.append(plan_row)

    return {
        "granularity": granularity,
        "generated_at": datetime.now(timezone.utc)
        .replace(microsecond=0)
        .isoformat()
        .replace("+00:00", "Z"),
        "plan": scheduled,
        "unscheduled": unscheduled,
    }


def write_scheduler_csv(plan_rows: list[dict[str, Any]], path: Path) -> None:
    with path.open("w", encoding="utf-8", newline="") as file:
        writer = csv.DictWriter(file, fieldnames=list(PLAN_COLUMNS))
        writer.writeheader()
        for row in plan_rows:
            writer.writerow({column: row[column] for column in PLAN_COLUMNS})


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate the railway weekly plan")
    parser.add_argument("--data-dir", default=str(DATA_DIR), help="Folder with stations/defects/windows CSVs")
    parser.add_argument("--output-json", default=str(DATA_DIR / "plan.json"), help="weekly_plan JSON path")
    parser.add_argument("--output-csv", default=str(DATA_DIR / "scheduler.csv"), help="plan[] CSV path")
    parser.add_argument(
        "--granularity",
        choices=("weekly", "monthly"),
        default="weekly",
        help="Plan granularity; row shape stays the same",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    data_dir = Path(args.data_dir)
    block_sections, defects, windows = load_scheduler_inputs(data_dir)
    result = build_plan(defects, windows, args.granularity, block_sections)

    json_path = Path(args.output_json)
    json_path.parent.mkdir(parents=True, exist_ok=True)
    with json_path.open("w", encoding="utf-8") as file:
        json.dump(result, file, indent=2, ensure_ascii=False)
        file.write("\n")

    csv_path = Path(args.output_csv)
    write_scheduler_csv(result["plan"], csv_path)

    print(f"stations.csv block sections: {len(block_sections)}")
    print(f"defects.csv tasks: {len(defects)}")
    print(f"windows.csv windows: {len(windows)}")
    print(f"Created {json_path}")
    print(f"Created {csv_path}")
    print(f"scheduled: {len(result['plan'])} | unscheduled: {len(result['unscheduled'])}")
    if result["unscheduled"]:
        print("unscheduled:")
        for item in result["unscheduled"]:
            print(f"  {item['task_id']} {item['corridor']} {item['department']} — {item['reason']}")


if __name__ == "__main__":
    main()
