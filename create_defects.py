import csv
import random

corridors = [
    "STN01-STN02",
    "STN02-STN03",
    "STN03-STN04",
    "STN04-STN05"
]

defects_by_department = {
    "Track": [
        "Rail crack repair",
        "Sleeper replacement",
        "Track alignment correction"
    ],
    "Signal": [
        "Signal relay fault",
        "Track circuit fault",
        "Signal cable inspection"
    ],
    "Power": [
        "OHE insulator damage",
        "OHE wire inspection",
        "Traction power cable fault"
    ]
}

defects = []

# Generate only 5 defects
for i in range(1, 6):

    department = random.choice(["Track", "Signal", "Power"])
    description = random.choice(defects_by_department[department])
    corridor = random.choice(corridors)
    urgency = random.randint(1, 5)
    overdue_days = random.choice([0, 1, 2, 3, 5, 7, 10])
    estimated_hours = random.choice([0.5, 1, 1.5, 2, 2.5, 3])

    defects.append([
        f"T{i:03d}",
        corridor,
        department,
        description,
        urgency,
        overdue_days,
        estimated_hours
    ])

# Create defects.csv
with open("defects.csv", "w", newline="", encoding="utf-8") as file:

    writer = csv.writer(file)

    writer.writerow([
        "task_id",
        "corridor",
        "department",
        "description",
        "urgency",
        "overdue_days",
        "estimated_hours"
    ])

    writer.writerows(defects)

print("✅ defects.csv created successfully!")
print("✅ Total defects:", len(defects))