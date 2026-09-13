import csv

controllers = [
    [
        "CTRL01",
        "A. Sharma",
        "Board A",
        "STN01",
        "STN15"
    ]
]

with open("controllers.csv", "w", newline="", encoding="utf-8") as file:

    writer = csv.writer(file)

    writer.writerow([
        "controller_id",
        "name",
        "control_board",
        "start_station",
        "end_station"
    ])

    writer.writerows(controllers)

print("✅ controllers.csv created successfully!")
print("✅ Total controllers:", len(controllers))