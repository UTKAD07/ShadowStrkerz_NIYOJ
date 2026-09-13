"""Serve the weekly_plan envelope from Final_SCHEMA.md.

GET /plan is the schema contract. GET /schedule is the same payload
so older notes that used that path still work.
"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path

from scheduler import DATA_DIR, build_plan, load_scheduler_inputs, read_csv

app = FastAPI(title="SIH26027 Block Planner")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "OPTIONS"],
    allow_headers=["*"],
)


def weekly_plan(granularity: str) -> dict:
    block_sections, defects, windows = load_scheduler_inputs(DATA_DIR)
    return build_plan(defects, windows, granularity, block_sections)


@app.get("/plan")
def get_plan(granularity: str = Query("weekly", pattern="^(weekly|monthly)$")):
    return weekly_plan(granularity)


@app.get("/schedule")
def get_schedule(granularity: str = Query("weekly", pattern="^(weekly|monthly)$")):
    return weekly_plan(granularity)


@app.get("/stations")
def get_stations():
    """Return all stations from stations.csv as a JSON list."""
    return read_csv(DATA_DIR / "stations.csv")


@app.get("/trains")
def get_trains():
    """Return all trains from trains.csv as a JSON list."""
    return read_csv(DATA_DIR / "trains.csv")


@app.get("/windows")
def get_windows():
    """Return all windows from windows.csv as a JSON list."""
    return read_csv(DATA_DIR / "windows.csv")


@app.get("/login/{controller_id}")
def get_login(controller_id: str):
    """Return the matching controller from controllers.csv, or 404 if not found."""
    controllers = read_csv(DATA_DIR / "controllers.csv")
    for controller in controllers:
        if controller.get("controller_id") == controller_id:
            return controller
    raise HTTPException(status_code=404, detail=f"Controller {controller_id} not found")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=False)
