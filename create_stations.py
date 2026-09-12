import csv

# Real station data taken from the route screenshots
# Format:
# station_id, name, km_marker, sequence

stations = [
    ["STN01", "Gokak Road", 0.0, 1],
    ["STN02", "Parkanhatti", 9.0, 2],
    ["STN03", "Pachhapur", 16.0, 3],
    ["STN04", "Suldhal", 25.0, 4],
    ["STN05", "Sulebhavi", 36.0, 5],
    ["STN06", "Sambre", 43.0, 6],
    ["STN07", "Belagavi", 52.0, 7],
    ["STN08", "Desur", 62.0, 8],
    ["STN09", "Khanapur", 78.0, 9],
    ["STN10", "Gunji", 90.0, 10],
    ["STN11", "Londa Junction", 103.0, 11],
    ["STN12", "Devarayi", 116.0, 12],
    ["STN13", "Tavargatti", 128.0, 13],

    # Add the missing stations between Tavargatti and Hubballi here

    ["STN14", "SSS Hubballi Junction", 194.0, 14]
]

# Create stations.csv
with open("stations.csv", "w", newline="", encoding="utf-8") as file:

    writer = csv.writer(file)

    writer.writerow([
        "station_id",
        "name",
        "km_marker",
        "sequence"
    ])

    writer.writerows(stations)

print("✅ stations.csv created successfully!")
print("✅ Total stations:", len(stations))

print("\nStations:")
for station in stations:
    print(
        station[0],
        "-",
        station[1],
        "-",
        station[2],
        "km"
    )