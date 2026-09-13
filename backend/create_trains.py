import csv

trains = [
    ["17318", "SSS Hubballi Express", "Express", "UP", "STN01-STN02", "2026-09-14", "00:06", "10:45"],
    ["11005", "Puducherry Express", "Express", "UP", "STN01-STN02", "2026-09-14", "00:00", "12:00"],
    ["16209", "Ajmer-Mysuru Express", "Express", "UP", "STN01-STN02", "2026-09-14", "01:50", "14:40"],
    ["12630", "Karnataka Sampark Kranti", "Express", "UP", "STN01-STN02", "2026-09-14", "11:20", "21:40"],
    ["20670", "SSS Hubballi Vande Bharat", "Express", "UP", "STN01-STN02", "2026-09-14", "14:15", "22:45"],
    ["17367", "SSS Hubballi Weekly Express", "Express", "UP", "STN01-STN02", "2026-09-14", "18:40", "06:30"],
    ["17306", "Yeshvantpur AC Express", "Express", "UP", "STN01-STN02", "2026-09-14", "19:00", "07:50"]
]

with open("trains.csv", "w", newline="", encoding="utf-8") as file:
    writer = csv.writer(file)

    writer.writerow([
        "train_id",
        "name",
        "type",
        "direction",
        "corridor",
        "date",
        "entry_time",
        "exit_time"
    ])

    writer.writerows(trains)

print("✅ trains.csv created successfully!")
print("✅ Total trains:", len(trains))