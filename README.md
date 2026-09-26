# README(SCHEMA).md — SIH26027 shared data contract

This is the one file everyone treats as ground truth. If a column needs to change, message the group before you change it — don't let it drift silently.

Demo scope: **one Control Board**, one route of **100–200 km**, **20–30 stations**. Use real railway terminology: the stretch between two *adjacent* stations is a **block section** — that's your `corridor` unit everywhere below, not an arbitrary Km range.

---

## 1. `stations.csv` — written by Sanjana/Shilpa (real-sounding names), read by everyone

| column | type | example | notes |
|---|---|---|---|
| `station_id` | string | `STN01` | unique |
| `name` | string | `Rampur` | |
| `km_marker` | float | `12.5` | distance from route start |
| `sequence` | int | `1` | order along the route, 1 to ~25 |

A **block section** is any two adjacent stations by `sequence`: `STN01`–`STN02`, `STN02`–`STN03`, etc. Write `corridor` as `"STN04-STN05"` (or `"Rampur-Sitapur"` if you want it human-readable — pick one, use it everywhere). Generate this list once from `stations.csv` (e.g. a `getBlockSections()` helper both sides import from) — not a separate hand-typed constant.

> **Control-chart orientation:** `sequence` drives station placement along the chart's **horizontal (X) axis**, left → right, not top-to-bottom. (An earlier draft described this as the Y-axis / vertical — that's been corrected here.)

### Example

```csv
station_id,name,km_marker,sequence
STN01,Rampur,0,1
STN02,Sitapur,8.2,2
STN03,Devgarh,15.6,3
STN04,Narayanpur,23.1,4
STN05,Kishanganj,31.4,5
```

---

## 2. `defects.csv` — written by Aditya, read by Utkarsh

| column | type | example | notes |
|---|---|---|---|
| `task_id` | string | `T001` | unique |
| `corridor` | string | `STN04-STN05` | must be an adjacent pair from `stations.csv` |
| `department` | enum | `Track` \| `Signal` \| `Power` | |
| `description` | string | `Rail crack repair` | |
| `urgency` | int (1–5) | `4` | 5 = most urgent |
| `overdue_days` | int | `12` | 0 if not overdue |
| `estimated_hours` | float | `1.5` | how long the repair takes |

### Example

```csv
task_id,corridor,department,description,urgency,overdue_days,estimated_hours
T001,STN04-STN05,Track,Rail crack repair,4,12,1.5
T002,STN10-STN11,Signal,Signal relay fault,5,3,2
T003,STN18-STN19,Power,OHE insulator damage,3,0,1
```

---

## 3. `windows.csv` — written by Aditya, read by Utkarsh

| column | type | example | notes |
|---|---|---|---|
| `window_id` | string | `W014` | unique |
| `corridor` | string | `STN04-STN05` | must be an adjacent pair from `stations.csv` |
| `date` | string | `2026-09-14` | `YYYY-MM-DD` |
| `start_time` | string | `00:00` | 24hr `HH:MM` |
| `end_time` | string | `03:00` | 24hr `HH:MM` |

### Example

```csv
window_id,corridor,date,start_time,end_time
W014,STN04-STN05,2026-09-14,00:00,03:00
W015,STN10-STN11,2026-09-14,01:00,02:30
W016,STN18-STN19,2026-09-15,00:00,01:30
```

---

## 4. `trains.csv` — written by Aditya/Sanjana, read only by Saif's control-chart (not by the scheduler)

This is presentation data only — it never touches `scheduler.py`. It exists purely to draw trains on the control chart and to make the "why is this window free" story visible.

| column | type | example | notes |
|---|---|---|---|
| `train_id` | string | `12301` | |
| `name` | string | `Rajdhani Express` | optional, for tooltips |
| `type` | enum | `Express` \| `Passenger` \| `Freight` | Freight per the problem statement's "goods forecast" |
| `direction` | enum | `UP` \| `DOWN` | pick one convention (e.g. UP = increasing `sequence`) and note it in the legend |
| `corridor` | string | `STN04-STN05` | which block section |
| `date` | string | `2026-09-14` | |
| `entry_time` | string | `05:40` | when it enters this block section |
| `exit_time` | string | `05:52` | when it clears this block section |

### Example

```csv
train_id,name,type,direction,corridor,date,entry_time,exit_time
12301,Rajdhani Express,Express,UP,STN04-STN05,2026-09-14,05:40,05:52
54211,Local Passenger,Passenger,DOWN,STN10-STN11,2026-09-14,06:10,06:19
```

---

## 5. `controllers.csv` — small lookup used for the mock "login", not a real auth table

| column | type | example | notes |
|---|---|---|---|
| `controller_id` | string | `CTRL01` | what they type in to "log in" — no password needed |
| `name` | string | `A. Sharma` | |
| `control_board` | string | `Board A` | |
| `start_station` / `end_station` | string | `STN01` / `STN25` | the fixed route this controller owns |

On "login," look up the ID, load their `start_station`–`end_station` range, and route straight into the control-chart pre-scoped to it. There's no picker to browse other boards — the scope comes from who logged in, same as the real system. One row is enough for your demo; add a second only if you want to visibly prove two controllers never see each other's territory.

### Example

```csv
controller_id,name,control_board,start_station,end_station
CTRL01,A. Sharma,Board A,STN01,STN25
```

---

## 6. `weekly_plan` — written by Utkarsh's `scheduler.py`, served by `GET /plan`, read by Saif + Raghavendra

Returned as JSON, wrapped in an envelope so the frontend always knows what it's looking at:

```json
{
  "granularity": "weekly",
  "generated_at": "2026-09-14T06:00:00Z",
  "plan": [
    {
      "task_id": "T001",
      "corridor": "STN04-STN05",
      "department": "Track",
      "date": "2026-09-14",
      "assigned_start": "00:00",
      "assigned_end": "01:15",
      "window_id": "W014",
      "priority_score": 0.87,
      "status": "scheduled"
    }
  ],
  "unscheduled": [
    { "task_id": "T009", "corridor": "STN18-STN19", "department": "Signal", "reason": "no compatible window" }
  ]
}
```

| field | type | notes |
|---|---|---|
| `task_id` | string | matches `defects.csv` |
| `corridor` | string | an adjacent station pair from `stations.csv` |
| `department` | enum | `Track` \| `Signal` \| `Power` |
| `date` | string | `YYYY-MM-DD` |
| `assigned_start` / `assigned_end` | string | `HH:MM`, within the matched window |
| `window_id` | string | which window it landed in, matches `windows.csv` |
| `priority_score` | float (0–1) | output of the scoring formula |
| `status` | enum | `scheduled` \| `unscheduled` |

**Monthly plan uses the exact same row shape** — just set `"granularity": "monthly"` and group/aggregate at render time in the frontend (e.g. by week instead of by exact time). Don't build a second schema for it.

**`GET /plan` query params (optional, only add if you need them):** `?corridor=STN04-STN05&department=Track&granularity=weekly`. For the demo dataset size, client-side filtering of one full response is enough — skip these unless you have time to spare.

### Complete example (multiple tasks, one scheduled and one unscheduled)

```json
{
  "granularity": "weekly",
  "generated_at": "2026-09-14T06:00:00Z",
  "plan": [
    {
      "task_id": "T001",
      "corridor": "STN04-STN05",
      "department": "Track",
      "date": "2026-09-14",
      "assigned_start": "00:00",
      "assigned_end": "01:15",
      "window_id": "W014",
      "priority_score": 0.87,
      "status": "scheduled"
    },
    {
      "task_id": "T002",
      "corridor": "STN10-STN11",
      "department": "Signal",
      "date": "2026-09-14",
      "assigned_start": "01:00",
      "assigned_end": "02:15",
      "window_id": "W015",
      "priority_score": 0.76,
      "status": "scheduled"
    }
  ],
  "unscheduled": [
    {
      "task_id": "T009",
      "corridor": "STN18-STN19",
      "department": "Signal",
      "reason": "no compatible window"
    }
  ]
}
```

---

## 7. API Response

The backend `GET /plan` endpoint returns exactly the envelope shown above — same field names, no renaming, no unwrapping the `plan` array.

```http
GET /plan
```

Response: identical shape to the "Complete example" in section 6. The React frontend reads `response.plan` for the row list and `response.unscheduled` for the leftover-tasks panel — it should not need to reshape either array before rendering.

---

## 8. Priority Score

`priority_score` is a float between `0` and `1`.

```text
0 = lowest priority
1 = highest priority
```

The exact priority formula belongs to Utkarsh's `scheduler.py`. The frontend only **displays** the score — it never calculates or re-derives it.

---

## 9. Data Flow

```text
stations.csv ──────────────┐
                            ├──► defects.csv + windows.csv ──► scheduler.py ──► weekly_plan (envelope) ──► GET /plan ──► React control-chart / dashboard
trains.csv ─────────────────┘        (presentation only — feeds the control-chart directly, never touches scheduler.py)

controllers.csv ──► mock login ──► scopes which stretch of the control-chart a controller sees
```

---

## 10. Team Rules

1. This file is the **single source of truth** for the data structure.
2. Do not rename fields without discussing it with the team first — a two-minute heads-up, not a silent commit.
3. Do not change field types without updating this file.
4. Backend and frontend must use the same field names — no renaming on either side.
5. `corridor` is always an adjacent station pair generated from `stations.csv`, never a hand-typed Km range.
6. Fake/demo data must follow this schema.
7. `scheduler.py` produces the final `weekly_plan` envelope; the frontend consumes it and does not decide scheduling logic.
8. `trains.csv` is presentation-only and never feeds into `scheduler.py`.

---

## 11. MVP Scope

For the first working prototype, the system needs:

```text
stations.csv
      ↓ (generates the block-section list)
defects.csv + windows.csv
      ↓
scheduler.py
      ↓
weekly_plan (envelope)
      ↓
GET /plan
      ↓
React control-chart / dashboard
```

`trains.csv` and `controllers.csv` can be layered on once the core scheduling loop works — they're not required for the first scheduling demo. A database is **not required** for the initial MVP; CSV/JSON files on disk are enough.

---

*Changing a field name or type here is a two-minute heads-up to the group, not a silent commit.*
