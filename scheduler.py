"""Create plan.json from defects.csv and windows.csv.

The JSON output follows the plan contract in SCHEMA.md:
granularity, generated_at, plan, and unscheduled.

Run:
    python scheduler.py

Optional:
    python scheduler.py --granularity monthly
    python scheduler.py --defects data/defects.csv --windows data/windows.csv
"""

from __future__ import annotations

import argparse
import csv
import json
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any


BASE_DIR = Path(__file__).resolve().parent
ALLOWED_DEPARTMENTS = {"Track", "Signal", "Power"}

DURATION_COLUMNS = (
    "estimated_hours",
    "duration_minutes",
    "duration_min",
    "estimated_duration_minutes",
    "estimated_duration_min",
    "required_duration_minutes",
    "required_duration_min",
)

def read_csv(path: Path) -> list[dict[str, str]]:
    """Read a CSV file and remove whitespace around every value."""
    if not path.exists():
        raise FileNotFoundError(f"File not found: {path}")

    with path.open("r", encoding="utf-8-sig", newline="") as file:
        reader = csv.DictReader(file)
        if not reader.fieldnames:
            raise ValueError(f"{path.name} has no header row")

        return [
            {str(key).strip(): (value or "").strip() for key, value in row.items()}
            for row in reader
        ]


def require_columns(rows: list[dict[str, str]], required: set[str], filename: str) -> None:
    """Raise a clear error when a required CSV column is missing."""
    if not rows:
        raise ValueError(f"{filename} contains no data rows")

    missing = required - set(rows[0])
    if missing:
        raise ValueError(
            f"{filename} is missing column(s): {', '.join(sorted(missing))}"
        )


def get_block_sections(base_dir: Path = BASE_DIR) -> list[str]:
    """Read stations.csv and return adjacent pairs such as STN01-STN02.

    This is the function imported by windows.py.
    """
    station_rows = read_csv(Path(base_dir) / "stations.csv")
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


def first_value(row: dict[str, str], names: tuple[str, ...]) -> str:
    """Return the first non-empty value among alternative column names."""
    for name in names:
        value = row.get(name, "").strip()
        if value:
            return value
    return ""


def clamp(value: float, minimum: float = 0.0, maximum: float = 1.0) -> float:
    return max(minimum, min(maximum, value))


def calculate_priority(row: dict[str, str]) -> float:
    """Calculate a 0-1 score from urgency and overdue_days.

    urgency contributes 70%, while overdue_days contributes 30%.
    Ten or more overdue days receives the maximum overdue score.
    """
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
    """Read task duration from the schema column or a supported short alias."""
    value = first_value(row, DURATION_COLUMNS)

    if row.get("estimated_hours", "").strip():
        try:
            minutes = round(float(row["estimated_hours"]) * 60)
        except ValueError as error:
            raise ValueError(
                f"Invalid estimated_hours for task {row.get('task_id', '')}"
            ) from error
    elif not value and row.get("duration_hours", "").strip():
        try:
            minutes = round(float(row["duration_hours"]) * 60)
        except ValueError as error:
            raise ValueError(
                f"Invalid duration_hours for task {row.get('task_id', '')}"
            ) from error
    else:
        try:
            minutes = round(float(value))
        except ValueError as error:
            raise ValueError(
                f"Task {row.get('task_id', '')} needs a valid duration_minutes value"
            ) from error

    if minutes <= 0:
        raise ValueError(
            f"Task {row.get('task_id', '')} duration must be greater than zero"
        )
    return minutes


def parse_window(row: dict[str, str]) -> dict[str, Any]:
    """Convert a window row to datetimes, including windows crossing midnight."""
    try:
        start = datetime.fromisoformat(f"{row['date']}T{row['start_time']}")
        end = datetime.fromisoformat(f"{row['date']}T{row['end_time']}")
    except ValueError as error:
        raise ValueError(
            f"Invalid date/time in window {row.get('window_id', '')}: {error}"
        ) from error

    # Example: 23:00-01:00 means 23:00 today until 01:00 tomorrow.
    if end <= start:
        end += timedelta(days=1)

    departments_text = first_value(row, ("department", "departments"))
    departments = {
        item.strip().title()
        for item in departments_text.replace("|", ",").split(",")
        if item.strip()
    }

    return {
        "window_id": row["window_id"],
        "corridor": row["corridor"],
        "date": row["date"],
        "start": start,
        "end": end,
        "next_free": start,
        "departments": departments,
    }


def department_is_allowed(window: dict[str, Any], department: str) -> bool:
    allowed = window["departments"]
    return not allowed or "All" in allowed or department in allowed


def compatible_windows(
    task: dict[str, str], windows: list[dict[str, Any]]
) -> list[dict[str, Any]]:
    """Find corridor/date/department-compatible windows for one task."""
    requested_date = first_value(task, ("date", "preferred_date"))

    return [
        window
        for window in windows
        if window["corridor"] == task["corridor"]
        and (not requested_date or window["date"] == requested_date)
        and department_is_allowed(window, task["department"])
    ]


def build_plan(
    defect_rows: list[dict[str, str]],
    window_rows: list[dict[str, str]],
    granularity: str = "weekly",
) -> dict[str, Any]:
    """Schedule highest-priority tasks into the earliest compatible windows."""
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

    windows = sorted(
        (parse_window(row) for row in window_rows),
        key=lambda item: (item["start"], item["window_id"]),
    )
    if not windows:
        raise ValueError("windows.csv contains no usable windows")

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

    # Higher score first. task_id makes equal scores deterministic.
    prepared_tasks.sort(key=lambda item: (-item["score"], item["task_id"]))

    scheduled: list[dict[str, Any]] = []
    unscheduled: list[dict[str, str]] = []

    for task in prepared_tasks:
        candidates = compatible_windows(task, windows)
        chosen: dict[str, Any] | None = None
        assigned_end: datetime | None = None

        for window in candidates:
            possible_end = window["next_free"] + timedelta(minutes=task["duration"])
            if possible_end <= window["end"]:
                chosen = window
                assigned_end = possible_end
                break

        if chosen is None or assigned_end is None:
            unscheduled.append(
                {
                    "task_id": task["task_id"],
                    "corridor": task["corridor"],
                    "department": task["department"],
                    "reason": "no compatible window",
                }
            )
            continue

        assigned_start = chosen["next_free"]
        chosen["next_free"] = assigned_end

        scheduled.append(
            {
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
        )

    return {
        "granularity": granularity,
        "generated_at": datetime.now(timezone.utc)
        .replace(microsecond=0)
        .isoformat()
        .replace("+00:00", "Z"),
        "plan": scheduled,
        "unscheduled": unscheduled,
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate the railway block plan")
    parser.add_argument(
        "--defects", default=str(BASE_DIR / "defects.csv"), help="Defects CSV path"
    )
    parser.add_argument(
        "--windows", default=str(BASE_DIR / "windows.csv"), help="Windows CSV path"
    )
    parser.add_argument(
        "--output", default=str(BASE_DIR / "plan.json"), help="Output JSON path"
    )
    parser.add_argument(
        "--granularity",
        choices=("weekly", "monthly"),
        default="weekly",
        help="Plan granularity; the plan row structure stays unchanged",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    result = build_plan(
        read_csv(Path(args.defects)),
        read_csv(Path(args.windows)),
        args.granularity,
    )

    output_path = Path(args.output)
    with output_path.open("w", encoding="utf-8") as file:
        json.dump(result, file, indent=2, ensure_ascii=False)
        file.write("\n")

    print(
        f"Created {output_path} | "
        f"scheduled: {len(result['plan'])} | "
        f"unscheduled: {len(result['unscheduled'])}"
    )


if __name__ == "__main__":
    main()
