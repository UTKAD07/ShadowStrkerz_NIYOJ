<img width="2061" height="404" alt="NIYOJ Logo" src="https://github.com/user-attachments/assets/88266ac2-e60f-498b-ab40-253698bc16b1" />

# NIYOJ

### The decision layer beneath every block.

**AI-Powered Automatic Railway Block Planning · SIH26027 · Team ShadowStrikerz**

NIYOJ is a railway maintenance planning project designed to help a Section Controller answer a practical question: **which maintenance work should receive a block, when should it happen, and why?**

A maintenance block reserves access to railway infrastructure for work. Granting it affects train operations; deferring necessary work can increase asset risk. NIYOJ's goal is to make that trade-off visible through coordinated schedules and explainable recommendations.

This repository develops the prototype toward that goal. The current prototype contract and the expanded NIYOJ design are described separately below. Detailed field definitions are in [SCHEMA.md](SCHEMA.md).

## The problem

Engineering, Signal & Telecommunication, and Traction Distribution teams need access to shared infrastructure. Planning their requests separately can lead to repeated possessions, competing requests, and urgent work remaining unscheduled.

A useful planning system must do more than fill empty slots. It should help controllers understand maintenance urgency, available capacity, departmental compatibility, and the operational consequences of a decision.

## 🎯 Our approach

NIYOJ is designed around four stages:

1. **Bring demand together:** represent maintenance tasks, their source departments, and the infrastructure they affect.
2. **Identify usable windows:** start with supplied block-section windows, then extend toward timetable-based availability for individual physical tracks.
3. **Prioritise and schedule:** rank tasks, place feasible work, and make unscheduled work visible with a reason.
4. **Explain the recommendation:** show the maintenance need, estimated operational impact, constraints checked, and the context for controller review.

The intended deployment is a decision-support panel within an existing controller workflow, with COA integration as a future integration target. The prototype does not establish a live connection to COA or other railway systems.

## 🧩 Prototype foundation

The prototype is based on a deliberately small, shared data contract:

| Component | Role in the prototype contract |
|---|---|
| `stations.csv` | Ordered stations defining adjacent block sections |
| `defects.csv` | Maintenance tasks, departments, urgency, overdue days, and duration |
| `windows.csv` | Supplied maintenance windows for each block section |
| `scheduler.py` | Produces priorities and task-to-window assignments |
| `GET /plan` | Returns scheduled tasks and unscheduled tasks in one JSON envelope |
| React control chart / dashboard | Displays the plan and its remaining tasks |
| `trains.csv` | Train movements for visualisation; not a scheduling input in the baseline contract |
| `controllers.csv` | Demo controller-to-route lookup; not production authentication |

The baseline scope is **one control board, one route of approximately 100–200 km, and 20–30 stations**. In this contract, `corridor` means the block section between two adjacent stations.

These are the prototype's documented interfaces, not a claim that every feature in the NIYOJ blueprint has been implemented or validated. The repository code and runnable demonstration establish implementation status.

## 🚀 What NIYOJ adds to the plan

The following are **planned extensions**, to be treated as implemented only when their code, data, and demonstration are available:

| Extension | Intended behaviour |
|---|---|
| ML-based prioritisation | A Gradient Boosting Regressor estimates an urgency score; a labelled deterministic fallback remains available |
| Track-level availability | Model individual physical tracks within each existing block section and derive candidate windows from occupancy and constraints |
| Better scheduling | Use a feasible greedy baseline, with CP-SAT optimisation when available and validated |
| Shared possessions | Group compatible departmental work into one possession after checking work and isolation requirements |
| Risk and delay comparison | Present estimated downtime if deferred alongside estimated train-delay impact, with assumptions and units |
| Shared decision record | Reuse one explanation across the priority display, justification log, and controller review |
| Replanning | Recompute affected recommendations after an injected disruption or new urgent task |
| Constraint validation | Check configured constraints and explain rejected assignments or overrides |
| Weekly and monthly horizons | Use one scheduling engine and row structure over different date ranges |

An urgency score is not automatically a calibrated failure probability. Delay and downtime estimates require additional inputs and validation; they must not be inferred from a score alone. Synthetic training data and simulated track assignments will be labelled as such.

## Controller experience

The intended flow is to open a pending request, inspect its priority and explanation, compare candidate windows, and record a grant, defer, or override decision. If the underlying data is stale, the controller should be able to record a correction and trigger review.

A recommendation and a slot marked `scheduled` are planning outputs. They do not constitute operational permission to take a block. Actual sanction, isolation, and railway authorisation remain outside the prototype.

## ⚙️ Architecture and compatibility

The baseline keeps CSV inputs, Python scheduling, a JSON API, and the React interface. The NIYOJ target architecture proposes FastAPI, SQLite, scikit-learn, OR-Tools, and short-interval polling. These are design targets, not requirements to rewrite the existing backend before extending the prototype.

**Existing column names, department values, and the `/plan` envelope remain stable.** Proposed NIYOJ metadata is defined separately in [SCHEMA.md](SCHEMA.md), allowing the current prototype to continue using its original inputs.

## 🔍 How to evaluate the demonstration

Trace a task from `defects.csv` to its matching window and its `/plan` result. Check that its assigned duration fits the task, that the assignment stays within the window, and that unscheduled work includes a reason. Use the control chart to inspect the result.

For later NIYOJ features, inspect the model or fallback used, the data provenance, the constraints evaluated, and the explanation behind each recommendation. A replayed or cached scenario should be identified as a replay.

Evaluation targets include scheduled workload, window utilisation, urgent work left pending, constraint violations, and solve time. Train-delay and asset-uptime improvements are targets to measure against a stated baseline—not measured results claimed by this README.

## Scope and data

Sample data illustrates the contract and is not presented as an authorised operational railway feed. External-system adapters, production authentication, full railway-rule validation, and real COA integration require further work and access. Section-wide disaster rescheduling remains outside the current build scope.

**Team ShadowStrikerz** · Smart India Hackathon 2026 · **SIH26027**
