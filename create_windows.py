import csv
import random
from pathlib import Path

from scheduler import get_block_sections


BASE_DIR = Path(__file__).resolve().parent


def main():
    # Read adjacent station pairs from stations.csv.
    corridors = get_block_sections(BASE_DIR)

    dates = [
        "2026-09-14",
        "2026-09-15",
        "2026-09-16",
        "2026-09-17",
        "2026-09-18",
    ]

    # All windows start and finish on the same date.
    time_windows = [
        ("00:00", "02:00"),
        ("01:00", "03:00"),
        ("02:00", "04:00"),
        ("21:00", "23:00"),  # Corrected: 9 PM to 11 PM
    ]

    possible_windows = [
        (corridor, day, start_time, end_time)
        for corridor in corridors
        for day in dates
        for start_time, end_time in time_windows
    ]

    # Select five unique combinations.
    selected = random.Random(42).sample(
        possible_windows,
        k=5,
    )

    output_path = BASE_DIR / "data" / "windows.csv"

    with output_path.open(
        "w",
        newline="",
        encoding="utf-8",
    ) as file:
        writer = csv.writer(file)

        writer.writerow([
            "window_id",
            "corridor",
            "date",
            "start_time",
            "end_time",
        ])

        for i, window in enumerate(selected, start=1):
            writer.writerow([f"W{i:03d}", *window])

    print(f"windows.csv created successfully: {output_path}")
    print(f"Total windows: {len(selected)}")


if __name__ == "__main__":
    main()