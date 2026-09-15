import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchStations, fetchTrains, fetchWindows } from '../api';

export default function ControlChart() {
  const [chartMode, setChartMode] = useState('time'); // 'time' | 'corridor'
  const [showConflictPanel, setShowConflictPanel] = useState(true);
  const [stations, setStations] = useState([
    { id: 'STN01', name: 'DEVGARH', km: '0.0' },
    { id: 'STN02', name: 'SITAPUR', km: '8.2' },
    { id: 'STN03', name: 'RAMPUR', km: '16.5' },
    { id: 'STN04', name: 'NARAYANPUR', km: '24.1' },
    { id: 'STN05', name: 'KISHANGANJ', km: '32.8' },
    { id: 'STN06', name: 'ANAND VIHAR', km: '41.0' },
    { id: 'STN07', name: 'GHAZIABAD', km: '49.5' },
    { id: 'STN08', name: 'SAHIBABAD', km: '57.2' },
    { id: 'STN09', name: 'ALIGARH', km: '66.4' },
    { id: 'STN10', name: 'HATHRAS', km: '74.8' },
  ]);
  const [trains, setTrains] = useState([]);
  const [windows, setWindows] = useState([]);

  useEffect(() => {
    fetchStations()
      .then((data) =>
        setStations(
          data.map((s) => ({
            id: s.station_id ?? s.id,
            name: (s.name ?? s.station_name ?? '').toUpperCase(),
            km: String(s.km ?? s.distance_km ?? ''),
          }))
        )
      )
      .catch(() => {/* keep static fallback */});

    fetchTrains()
      .then(setTrains)
      .catch(() => {/* keep empty */});

    fetchWindows()
      .then(setWindows)
      .catch(() => {/* keep empty */});
  }, []);

  return (
    <main className="max-w-[1720px] mx-auto w-full px-4 lg:px-8 py-4 flex flex-col gap-4 flex-1">
      {/* Secondary Control Strip & Telemetry Key */}
      <div className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        {/* Left: View Toggle & Resolution Pill */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setChartMode('time')}
              className={`px-3 py-1 font-mono text-[11px] uppercase tracking-wider rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
                chartMode === 'time'
                  ? 'bg-orange-600 text-white font-bold shadow-xs'
                  : 'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">show_chart</span>
              Time–Distance
            </button>
            <button
              onClick={() => setChartMode('corridor')}
              className={`px-3 py-1 font-mono text-[11px] uppercase tracking-wider rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
                chartMode === 'corridor'
                  ? 'bg-orange-600 text-white font-bold shadow-xs'
                  : 'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">linear_scale</span>
              Corridor Mimic
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2 font-mono text-[10px] text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md">
            <span className="text-slate-700 font-bold">SEC:</span>
            <span className="text-slate-800 font-bold">{stations[0].id}–{stations[stations.length - 1].id}</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-600 font-medium">CONFLICT DETECTION BETA</span>
            <span className="text-slate-300">/</span>
            <span className="text-emerald-600 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              LIVE
            </span>
          </div>
        </div>

        {/* Right: Visual Train Legend & Conflict Badge */}
        <div className="flex items-center flex-wrap gap-2 font-mono text-[10px]">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded text-slate-700">
            <span className="inline-block w-3 h-1 bg-orange-500 rounded-full"></span>
            <span>22436 VB</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded text-slate-700">
            <span className="inline-block w-3 h-1 bg-slate-800 rounded-full"></span>
            <span>12952 RAJ</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded text-slate-700">
            <span className="inline-block w-3 h-0.5 border-t border-dashed border-amber-600"></span>
            <span>BCN-E FRT</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded text-slate-700">
            <span className="inline-block w-2 h-2 bg-red-100 border border-red-500 rounded-xs"></span>
            <span className="text-red-700 font-bold">BLOCK</span>
          </div>
          <button
            onClick={() => setShowConflictPanel(!showConflictPanel)}
            className="bg-red-600 hover:bg-red-700 text-white px-2.5 py-1 rounded-md font-mono font-bold tracking-wider flex items-center gap-1 shadow-xs transition-colors cursor-pointer text-[10px]"
          >
            <span className="material-symbols-outlined text-[14px] animate-bounce">warning</span>
            <span>1 CONFLICT</span>
          </button>
        </div>
      </div>

      {/* Visual Conflict Banner (Diagram instead of dense text) */}
      {showConflictPanel && (
        <div className="w-full bg-red-50/95 border border-red-200 rounded-xl px-4 py-3 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center text-white shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[17px]">priority_high</span>
            </div>

            {/* Visual Collision Diagram */}
            <div className="flex items-center gap-2 font-mono text-xs flex-wrap">
              <span className="px-2 py-0.5 bg-slate-800 text-white font-bold rounded text-[10px]">
                #12952 RAJDHANI (04:42)
              </span>
              <span className="text-red-600 font-black">💥 COLLISION ➔</span>
              <span className="px-2 py-0.5 bg-red-100 border border-red-300 text-red-800 font-bold rounded text-[10px]">
                MW-882 WELD POSSESSION (04:15–05:30)
              </span>
              <span className="px-2 py-0.5 bg-white border border-red-200 text-slate-700 font-semibold text-[10px]">
                STN04–STN05 UP-LINE
              </span>
              <span className="text-red-700 font-extrabold text-[11px]">+18m Cascade Delay</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 font-mono text-[10px]">
            <button
              onClick={() => setShowConflictPanel(false)}
              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-2.5 py-1 rounded uppercase font-semibold transition-colors cursor-pointer"
            >
              Dismiss
            </button>
            <Link
              to="/ai-block-planner"
              className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded uppercase font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <span>Review in AI Planner</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      )}

      {/* VIEW 1: TIME–DISTANCE GRAPH SCREEN */}
      {chartMode === 'time' && (
        <div className="w-full bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col">
          {/* Top Time Ticks (00:00 to 07:00 IST) */}
          <div className="flex w-full bg-slate-100 border-b border-slate-200 py-1.5">
            <div className="w-56 shrink-0 px-3 flex items-center justify-between font-mono text-[11px] text-slate-600 uppercase font-bold tracking-wider border-r border-slate-200">
              <span>STATION</span>
              <span>KM</span>
            </div>
            <div className="grid grid-cols-8 flex-1 font-mono text-[11px] text-slate-600">
              <div className="text-center font-bold text-slate-900">00:00</div>
              <div className="text-center font-bold text-slate-900">01:00</div>
              <div className="text-center font-bold text-slate-900">02:00</div>
              <div className="text-center font-bold text-orange-600">• 03:00</div>
              <div className="text-center font-bold text-slate-900">04:00</div>
              <div className="text-center font-bold text-slate-900">05:00</div>
              <div className="text-center font-bold text-slate-900">06:00</div>
              <div className="text-center font-bold text-slate-900">07:00</div>
            </div>
          </div>

          {/* Main Plot Area */}
          <div className="relative w-full flex overflow-x-auto">
            {/* Station Y-Axis */}
            <div className="w-56 shrink-0 bg-slate-50 border-r border-slate-200 flex flex-col divide-y divide-slate-200 font-mono text-[11px] select-none">
              {[
                { id: 'STN01', name: 'DEVGARH', km: '0.0' },
                { id: 'STN02', name: 'SITAPUR', km: '8.2' },
                { id: 'STN03', name: 'RAMPUR', km: '16.5' },
                { id: 'STN04', name: 'NARAYANPUR', km: '24.1' },
                { id: 'STN05', name: 'KISHANGANJ', km: '32.8' },
                { id: 'STN06', name: 'ANAND VIHAR', km: '41.0' },
                { id: 'STN07', name: 'GHAZIABAD', km: '49.5' },
                { id: 'STN08', name: 'SAHIBABAD', km: '57.2' },
                { id: 'STN09', name: 'ALIGARH', km: '66.4' },
                { id: 'STN10', name: 'HATHRAS', km: '74.8' },
              ].map((stn, idx) => (
                <div key={stn.id} className={`h-12 px-2.5 flex items-center justify-between ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}`}>
                  <span className="text-slate-900 font-bold">{stn.id} {stn.name}</span>
                  <span className="text-slate-500 font-semibold">{stn.km}</span>
                </div>
              ))}
            </div>

            {/* Time Graph SVG Canvas */}
            <div className="relative flex-1 min-w-[850px] h-[480px] bg-slate-50/30">
              <svg className="w-full h-full" viewBox="0 0 1000 480" preserveAspectRatio="none">
                <defs>
                  <pattern id="workHatchSlate" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="0" x2="0" y2="8" stroke="#cbd5e1" strokeWidth="1.5" />
                  </pattern>
                  <pattern id="maintHatchRed" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="0" x2="0" y2="8" stroke="#fca5a5" strokeWidth="1.5" />
                  </pattern>
                </defs>

                {/* Horizontal Grid */}
                {[0, 48, 96, 144, 192, 240, 288, 336, 384, 432].map((y, i) => (
                  <line key={i} x1="0" y1={y} x2="1000" y2={y} stroke="#e2e8f0" strokeWidth="1" />
                ))}

                {/* Vertical Hourly Grid */}
                {[0, 125, 250, 375, 500, 625, 750, 875].map((x, i) => (
                  <line key={i} x1={x} y1="0" x2={x} y2="480" stroke="#e2e8f0" strokeDasharray="3,3" strokeWidth="1" />
                ))}

                {/* Actual Time Cursor */}
                <line x1="425" y1="0" x2="425" y2="480" stroke="#ea580c" strokeWidth="2" strokeDasharray="4,2" />
                <rect x="415" y="0" width="20" height="12" fill="#ea580c" rx="2" />
                <text x="425" y="9" fill="#ffffff" fontSize="7" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="middle">NOW</text>

                {/* MAINTENANCE WINDOW 1 */}
                <rect x="130" y="384" width="150" height="48" fill="url(#workHatchSlate)" />
                <rect x="130" y="384" width="150" height="48" fill="#f8fafc" fillOpacity="0.3" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3,3" />
                <text x="138" y="412" fill="#334155" fontSize="9" fontFamily="JetBrains Mono" fontWeight="700">MW-879: TAMPING (STN08-09)</text>

                {/* CONFLICT ZONE */}
                <rect x="531" y="144" width="150" height="48" fill="url(#maintHatchRed)" />
                <rect x="531" y="144" width="150" height="48" fill="#fee2e2" fillOpacity="0.4" stroke="#dc2626" strokeWidth="1.8" />
                <text x="540" y="172" fill="#b91c1c" fontSize="9" fontFamily="JetBrains Mono" fontWeight="700">MW-882: WELD BLOCK (STN04-05)</text>

                {/* TRAIN 1: 22436 VANDE BHARAT */}
                <path d="M 62 0 L 150 96 L 230 192 L 320 336 L 406 480" fill="none" stroke="#ea580c" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
                <circle cx="406" cy="480" r="4" fill="#ea580c" stroke="#ffffff" strokeWidth="1.5" />

                {/* TRAIN 2: FREIGHT */}
                <path d="M 125 480 L 250 336 L 350 336 L 550 192 L 812 0" fill="none" stroke="#d97706" strokeDasharray="5,3" strokeWidth="2" />

                {/* TRAIN 3: 12952 RAJDHANI */}
                <path d="M 343 0 L 460 144 L 583 192 L 720 336 L 860 480" fill="none" stroke="#0f172a" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />

                {/* CONFLICT SPOT MARKER */}
                <circle cx="583" cy="192" r="14" fill="#ef4444" fillOpacity="0.4" className="animate-ping" />
                <circle cx="583" cy="192" r="8" fill="#fee2e2" stroke="#dc2626" strokeWidth="1.8" />
                <circle cx="583" cy="192" r="3" fill="#b91c1c" />
              </svg>

              {/* Trajectory Badges */}
              <div className="absolute top-[68px] left-[100px] bg-white border border-orange-300 text-orange-700 px-1.5 py-0.2 rounded font-mono text-[10px] font-bold shadow-xs">
                22436 VB · 130 km/h
              </div>
              <div className="absolute top-[315px] left-[260px] bg-white border border-amber-300 text-amber-900 px-1.5 py-0.2 rounded font-mono text-[10px] font-bold shadow-xs">
                BCN-E · Loop 3
              </div>
              <div className="absolute top-[102px] left-[380px] bg-slate-900 text-white px-1.5 py-0.2 rounded font-mono text-[10px] font-bold shadow-xs">
                12952 RAJ · 120 km/h
              </div>

              {/* Pulsing Conflict Callout Box */}
              <div className="absolute top-[140px] left-[600px] z-30 bg-white border border-red-400 rounded-lg p-2.5 shadow-md flex flex-col gap-1 max-w-[210px]">
                <div className="flex items-center justify-between text-red-600 font-mono text-[10px] font-bold">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">bolt</span>
                    +18m DELAY
                  </span>
                  <span className="text-slate-400">#C-904</span>
                </div>
                <p className="text-[10px] text-slate-700 leading-tight">
                  Rajdhani enters STN04-05 during MW-882.
                </p>
                <Link
                  to="/ai-block-planner"
                  className="mt-0.5 bg-red-600 hover:bg-red-700 text-white py-1 px-2 text-center rounded font-mono text-[9px] uppercase font-bold tracking-wider flex items-center justify-center gap-1"
                >
                  <span>Review in AI Planner</span>
                  <span className="material-symbols-outlined text-[11px]">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Section Metrics Footer */}
          <div className="w-full bg-slate-50 border-t border-slate-200 px-4 py-2 flex flex-wrap items-center justify-between font-mono text-[10px] text-slate-600">
            <div className="flex items-center gap-3">
              <span className="text-slate-900 font-bold">144.0 KM</span>
              <span className="text-slate-300">|</span>
              <span>25kV DOUBLE TRACK</span>
              <span className="text-slate-300">|</span>
              <span>MAX 130 KM/H</span>
            </div>
            <div className="flex items-center gap-3">
              <span>9 ACTIVE TRAINS</span>
              <span className="text-slate-300">|</span>
              <span>2 WINDOWS</span>
              <span className="text-slate-300">|</span>
              <span className="text-red-600 font-bold">1 CONFLICT</span>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: CORRIDOR MIMIC */}
      {chartMode === 'corridor' && (
        <div className="w-full bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-200 gap-2">
  <h2 className="w-full text-center font-bold text-slate-900 text-lg mb-2">Corridor Mimic</h2>
  <div className="flex items-center gap-2 font-mono text-xs">
    <span className="w-2 h-5 bg-orange-600 rounded-xs"></span>
    <span className="font-bold text-slate-900">DEVGARH – RATLAM TACTICAL MIMIC</span>
  </div>
  <div className="flex items-center gap-2 font-mono text-[11px]">
    <span className="bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-emerald-800 font-bold rounded-md flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
      ABS NORMAL
    </span>
    <span className="bg-red-50 border border-red-200 px-2.5 py-1 text-red-800 font-bold rounded-md flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
      1 RESTRICTED BLOCK
    </span>
  </div>
</div>

          {/* Track diagram */}
          <div className="w-full overflow-x-auto py-2">
            <div className="min-w-[900px] flex flex-col gap-4">
              {/* UP LINE */}
              <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-mono">
                <span className="w-20 font-bold text-slate-800 text-center text-[11px] uppercase tracking-wider bg-slate-200/80 py-1.5 rounded">UP-LINE</span>
{/* Dynamically render UP line stations */}
                {stations.map((st) => (
                  <React.Fragment key={st.id}>
                    <span className="px-3 py-1.5 bg-white border border-slate-300 rounded font-mono font-bold text-[11px] text-slate-800 shadow-xs">{st.id}</span>
                    {/* Placeholder occupancy status */}
                    <span className="flex-1 h-7 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded flex items-center justify-center text-[10px] font-mono font-bold tracking-wider">CLEAR</span>
                  </React.Fragment>
                ))}
              </div>

              {/* DN LINE */}
              <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-mono">
                <span className="w-20 font-bold text-slate-800 text-center text-[11px] uppercase tracking-wider bg-slate-200/80 py-1.5 rounded">DN-LINE</span>
                {/* Dynamically render DN line stations */}
                {stations.map((st) => (
                  <React.Fragment key={st.id}>
                    <span className="px-3 py-1.5 bg-white border border-slate-300 rounded font-mono font-bold text-[11px] text-slate-800 shadow-xs">{st.id}</span>
                    {/* Placeholder occupancy status */}
                    <span className="flex-1 h-7 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded flex items-center justify-center text-[10px] font-mono font-bold tracking-wider">CLEAR</span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Visual Train Describer Cards */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-3.5 pb-2">
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex flex-col gap-1.5 border-l-4 border-l-orange-500">
          <div className="flex items-center justify-between font-mono text-[10px]">
            <span className="font-bold text-orange-600">22436 VANDE BHARAT</span>
            <span className="text-emerald-700 font-bold">ON TIME</span>
          </div>
          <div className="flex items-baseline justify-between font-mono">
            <span className="text-xs font-bold text-slate-900">STN04 ➔ STN05</span>
            <span className="text-xs font-bold text-orange-600">128 km/h</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-0.5">
            <div className="bg-orange-500 h-full w-[80%] rounded-full"></div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex flex-col gap-1.5 border-l-4 border-l-red-500">
          <div className="flex items-center justify-between font-mono text-[10px]">
            <span className="font-bold text-slate-900">12952 RAJDHANI</span>
            <span className="text-red-600 font-bold">+18m Delay Risk</span>
          </div>
          <div className="flex items-baseline justify-between font-mono">
            <span className="text-xs font-bold text-slate-900">Approaching STN03</span>
            <span className="text-xs font-bold text-slate-700">118 km/h</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-0.5">
            <div className="bg-red-500 h-full w-[70%] rounded-full"></div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex flex-col gap-1.5 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between font-mono text-[10px]">
            <span className="font-bold text-amber-800">BCN-E CONTAINER</span>
            <span className="text-amber-700 font-bold">Regulated Loop 3</span>
          </div>
          <div className="flex items-baseline justify-between font-mono">
            <span className="text-xs font-bold text-slate-900">Held @ STN06</span>
            <span className="text-xs font-bold text-slate-500">0 km/h</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-0.5">
            <div className="bg-amber-400 h-full w-[100%] rounded-full"></div>
          </div>
        </div>
      </div>
    </main>
  );
}
