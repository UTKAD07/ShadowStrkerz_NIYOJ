# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary operators are **Section Controllers** and **Chief Train Dispatchers** (e.g., Section Board 'A' Line Controllers) stationed in central railway control rooms. They are responsible for real-time corridor monitoring, granting track possessions, managing speed restrictions (TSR), and supervising KAVACH SIL-4 headway safety margins under high cognitive load.

Secondary stakeholders include:
- **Departmental Field Gangs** (Permanent Way, Traction/TRD, and Signalling & Telecom) who submit possession requisitions.
- **Station Masters** who receive interlocking block authorization tokens.

## Product Purpose

IR-BMS (Indian Railways Block Management System) transforms traditional, manual block grant workflows into an intelligent, centralized dispatch environment. Its purpose is to maximize available track maintenance hours while eliminating train delays, punctuality losses, and headway conflicts across dense railway corridors.

Success is measured by:
- Zero safety interlock violations and full KAVACH SIL-4 protocol adherence.
- Maximum maintenance throughput via parallel, multi-departmental bundling.
- Minimized cumulative passenger and freight schedule cascade delays.

## Positioning

Unlike conventional train charting tools that merely display static timetable schedules, IR-BMS integrates an autonomous **AI Block Planner** and **Interlocking Conflict Detection Engine**. It proactively identifies natural traffic valleys between scheduled express trains and bundles overlapping P-Way, TRD, and S&T work into single, unified possessions under unified 25kV traction isolations.

## Operating Context

- **Environment**: High-reliability Section Control Room consoles operating 24/7 (continuous night and day shifts).
- **Physical Corridor**: 100–200 km demonstration route encompassing 25 stations (`STN01 Devgarh` through `STN25 Ratlam Jn`).
- **Telemetry & Infrastructure**: Integration with KAVACH automatic train protection (ATP), RFID balise groups, axle counter wheel detectors, electronic interlocking (EI v3.2), and 25kV AC overhead equipment (OHE).

## Capabilities and Constraints

- **Live Telemetry & Tracking**: Real-time corridor telemetry tracking train positions, actual speeds vs section permissible maximums, OHE contact voltage/amperage, and buffer distances.
- **Dual-View Control Chart**: Seamless switching between time-distance trajectory charts and tactical corridor schematic mimics.
- **Autonomous Bundling Engine**: Heuristic engine clustering isolated departmental requisitions into synchronized parallel blocks.
- **Defect & Maintenance Registry**: Centralized ledger of active defects categorized by department, urgency (Level 1–5), overdue status, and estimated possession hours.
- **Strict Human-in-the-Loop Authority**: The AI generates recommendations and conflict resolutions, but all block grants require explicit Controller authorization before execution.

## Brand Commitments

- **Identity**: Crisp, white precision industrial design language reflecting mission-critical railway engineering standards.
- **Tone**: Pragmatic, authoritative, and high-visibility. Clean typography (Inter, JetBrains Mono) with unambiguous safety color coding (Safety Orange `#EA580C`, Emergency Crimson `#DC2626`, Nominal Emerald `#059669`, High-contrast Slate `#0F172A`).
- **Emblem**: Official Indian Railways BMS crest and SIL-4 security badges.

## Evidence on Hand

- **Data Contract**: Grounded in the official SIH26027 `Final_SCHEMA.md` specification (`stations.csv`, `defects.csv`, `windows.csv`, `trains.csv`).
- **Incumbent Visual Design**: 7 validated Stitch screens (`14306018671519787996`) fully implemented in React 19 + Vite + TailwindCSS v4.

## Product Principles

1. **Safety First, Without Exception**: Every proposed block and timetable modification must satisfy SIL-4 protective headway buffers and interlocking constraints.
2. **Controller Discretion Governs**: AI proposes optimal traffic valleys and bundled possessions; human line controllers retain final operational authority.
3. **Density Without Clutter**: Critical telemetry (speed, TSRs, power cutoffs, train IDs) must be glanceable within milliseconds without visual distraction.
4. **Coordinated Over Fragmented**: Strive to eliminate isolated single-gang possessions whenever multiple departmental tasks can be safely parallelized.

## Accessibility & Inclusion

- High-contrast color differentiation for critical status tags (red/orange/emerald/slate) paired with redundant text labels and distinct geometric iconography.
- Keyboard-friendly navigation and clear font scales designed for long shifts on large multi-monitor workstations.
