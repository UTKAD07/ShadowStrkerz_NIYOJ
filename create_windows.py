import csv
import random

corridors = [
    "STN01-STN02",
    "STN02-STN03",
    "STN03-STN04",
    "STN04-STN05"
]

dates = [
    "2026-09-14",
    "2026-09-15",
    "2026-09-16",
    "2026-09-17",
    "2026-09-18"
]

time_windows = [
    ("00:00", "02:00"),
    ("01:00", "03:00"),
    ("02:00", "04:00"),
    ("23:00", "01:00"),
]

windows = []

# Generate 5 random windows
for i in range(1, 6):

    corridor = random.choice(corridors)
    date = random.choice(dates)
    start_time, end_time = random.choice(time_windows)

    windows.append([
        f"W{i:03d}",
        corridor,
        date,
        start_time,
        end_time
    ])

# Create windows.csv
with open("windows.csv", "w", newline="", encoding="utf-8") as file:

    writer = csv.writer(file)

    writer.writerow([
        "window_id",
        "corridor",
        "date",
        "start_time",
        "end_time"
    ])

    writer.writerows(windows)

print("✅ windows.csv created successfully!")
print("✅ Total windows:", len(windows))