/**
 * IR-BMS API Client
 * All calls go to the FastAPI backend at localhost:8000.
 * Vite proxies /api → http://localhost:8000 in dev.
 */

const BASE = '/api';

async function get(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`API ${path} → ${res.status}`);
  return res.json();
}

/** GET /plan?granularity=weekly|monthly */
export const fetchPlan = (granularity = 'weekly') =>
  get(`/plan?granularity=${granularity}`);

/** GET /schedule (alias) */
export const fetchSchedule = (granularity = 'weekly') =>
  get(`/schedule?granularity=${granularity}`);

/** GET /stations */
export const fetchStations = () => get('/stations');

/** GET /trains */
export const fetchTrains = () => get('/trains');

/** GET /windows */
export const fetchWindows = () => get('/windows');

/** GET /login/:controller_id */
export const loginController = (controllerId) =>
  get(`/login/${encodeURIComponent(controllerId)}`);
