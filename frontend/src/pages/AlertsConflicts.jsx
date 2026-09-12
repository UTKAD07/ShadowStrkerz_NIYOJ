import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CONFLICTS, DEFECTS } from '../data/mockData';

export default function AlertsConflicts() {
  const [filterType, setFilterType] = useState('all'); // 'all' | 'conflicts' | 'overdue' | 'unscheduled'
  const [searchTerm, setSearchTerm] = useState('');
  const [ackedItems, setAckedItems] = useState({});
  const [toast, setToast] = useState(null);

  const unscheduledList = [
    {
      id: 'REQ-2025-0901',
      dept: 'Track',
      corridor: 'STN02-STN03',
      corridorName: 'Sitapur — Rampur',
      reqBy: 'Sr. DEN (Track) North',
      hours: '2.5 hrs',
      notes: 'Turnout tie tamp requiring continuous slow speed block.',
      status: 'Pending Corridor Slot',
    },
    {
      id: 'REQ-2025-0902',
      dept: 'Power',
      corridor: 'STN14-STN15',
      corridorName: 'Etawah — Bharthana',
      reqBy: 'DEE (TRD) Division',
      hours: '1.5 hrs',
      notes: 'Substation switchgear routine annual calibration.',
      status: 'Awaiting Traction Window',
    },
    {
      id: 'REQ-2025-0903',
      dept: 'Signal',
      corridor: 'STN20-STN21',
      corridorName: 'Kanpur Central — Unnao',
      reqBy: 'DSTE (Signal) South',
      hours: '2.0 hrs',
      notes: 'Interlocking cabin route relay re-wiring.',
      status: 'Under Review',
    },
  ];

  const handleAckAll = () => {
    setAckedItems({ all: true });
    setToast('All 13 telemetry alerts acknowledged by Controller A. Sharma.');
    setTimeout(() => setToast(null), 4000);
  };

  const handleAckItem = (id) => {
    setAckedItems((prev) => ({ ...prev, [id]: true }));
    setToast(`Alert ${id} acknowledged.`);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <main className="w-full pb-12 flex-1 flex flex-col">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F172A] text-white border-2 border-[#10B981] px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 font-mono text-xs animate-bounce">
          <span className="material-symbols-outlined text-[#10B981] text-[22px]">verified</span>
          <div>
            <div className="font-bold text-emerald-400 uppercase">SAFETY ACTION RECORDED</div>
            <div className="text-slate-300">{toast}</div>
          </div>
        </div>
      )}

      <div className="max-w-[1720px] mx-auto px-4 lg:px-8 space-y-6 w-full pt-4">
        {/* TOP SUB-HEADER & LIVE ALERT STRIP */}
        <div className="flex flex-col space-y-3 pt-1">
          {/* Telemetry Feed Strip */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2 font-mono text-[11px] uppercase tracking-widest text-slate-500 flex-wrap">
              <span className="text-emerald-700 font-bold">LIVE TELEMETRY FEED</span>
              <span className="text-slate-300">/</span>
              <span className="text-slate-700 font-semibold">DEVGARH - RATLAM SECTION</span>
              <span className="text-slate-300">/</span>
              <span className="text-orange-600 font-bold">ACTIVE CONFLICT DETECTION (BETA)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 bg-red-50 border border-red-200 text-red-700 font-mono text-[11px] font-bold uppercase tracking-wider rounded">
                <span className="w-2 h-2 bg-red-600 mr-1.5 rounded-full animate-ping"></span>
                INTERLOCKING HAZARDS DETECTED
              </span>
              <span className="px-2 py-0.5 bg-white border border-slate-200 text-slate-600 font-mono text-[10px] uppercase rounded">
                REFRESH: REAL-TIME (0.2S)
              </span>
            </div>
          </div>

          {/* Title & Action Items Summary */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div>
              <h1 className="font-sans text-[26px] md:text-[28px] font-extrabold text-[#0f172a] tracking-tight uppercase leading-none">
                Alerts &amp; Operational Conflicts
              </h1>
              {/* Visual telemetry pills instead of long paragraph */}
              <div className="flex flex-wrap items-center gap-2 mt-2 font-mono text-[11px]">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-red-50 border border-red-200 text-red-700 rounded font-bold">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                  4 CONFLICTS
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-50 border border-amber-200 text-amber-800 rounded font-bold">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  6 OVERDUE
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-blue-50 border border-blue-200 text-blue-700 rounded font-bold">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  3 UNSCHEDULED
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-slate-100 border border-slate-300 text-slate-700 rounded font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  SAFETY ENGINE BETA
                </span>
              </div>
            </div>
            {/* Elevated Callout Card */}
            <div className="flex items-center space-x-3 bg-white border border-red-200 rounded-lg px-3.5 py-2 shadow-xs self-start lg:self-auto">
              <span className="material-symbols-outlined text-red-600 text-[24px]">warning</span>
              <div className="flex flex-col leading-tight font-mono">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">UNACKNOWLEDGED</span>
                <span className="text-[15px] text-red-600 font-extrabold tracking-tight">
                  {ackedItems['all'] ? '0 ACTION ITEMS' : '13 ACTION ITEMS'}
                </span>
              </div>
            </div>
          </div>

          {/* Live Status Ticker Banner */}
          <div className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 flex flex-col md:flex-row md:items-center justify-between gap-2 shadow-xs">
            <div className="flex items-center space-x-2 overflow-hidden text-[12px]">
              <span className="inline-block w-2 h-2 bg-red-600 rounded-full animate-pulse shrink-0"></span>
              <span className="font-mono text-red-600 font-bold uppercase tracking-wider whitespace-nowrap shrink-0">
                LIVE SURVEILLANCE FEED:
              </span>
              <span className="font-mono text-slate-700 truncate">
                4 ACTIVE CONFLICTS &nbsp;//&nbsp; 6 CRITICAL OVERDUE &nbsp;//&nbsp; 3 UNSCHEDULED REQUISITIONS &nbsp;//&nbsp; OHE GRID FEED 25kV MONITORED &nbsp;//&nbsp; AXLE-COUNTER POLLING NOMINAL
              </span>
            </div>
            <div className="flex items-center space-x-3 shrink-0 text-[11px] font-mono">
              <span className="text-slate-500">
                AUTO-RESOLVE ENGINE: <strong className="text-emerald-700 font-bold">ARMED</strong>
              </span>
              <span className="text-slate-300">|</span>
              <button
                onClick={handleAckAll}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-bold uppercase transition-colors rounded cursor-pointer"
              >
                ACK ALL NOTIFICATIONS
              </button>
            </div>
          </div>

          {/* Filter Chips & Search Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-1">
            {/* Filter Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px]">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 font-bold uppercase rounded transition-colors shadow-xs cursor-pointer ${
                  filterType === 'all'
                    ? 'bg-[#0f172a] text-white'
                    : 'bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-semibold'
                }`}
              >
                All (13)
              </button>
              <button
                onClick={() => setFilterType('conflicts')}
                className={`px-3 py-1.5 font-bold uppercase rounded transition-colors shadow-xs cursor-pointer ${
                  filterType === 'conflicts'
                    ? 'bg-[#0f172a] text-white'
                    : 'bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-semibold'
                }`}
              >
                Corridor Conflicts (4)
              </button>
              <button
                onClick={() => setFilterType('overdue')}
                className={`px-3 py-1.5 font-bold uppercase rounded transition-colors shadow-xs cursor-pointer ${
                  filterType === 'overdue'
                    ? 'bg-[#0f172a] text-white'
                    : 'bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-semibold'
                }`}
              >
                Critical Overdue (6)
              </button>
              <button
                onClick={() => setFilterType('unscheduled')}
                className={`px-3 py-1.5 font-bold uppercase rounded transition-colors shadow-xs cursor-pointer ${
                  filterType === 'unscheduled'
                    ? 'bg-[#0f172a] text-white'
                    : 'bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-semibold'
                }`}
              >
                Unscheduled Requests (3)
              </button>
            </div>

            {/* Search Box */}
            <div className="relative min-w-[300px] lg:min-w-[420px]">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                search
              </span>
              <input
                className="w-full bg-white border border-slate-300 rounded text-slate-900 pl-9 pr-24 py-1.5 font-mono text-[12px] placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 shadow-xs"
                placeholder="Search alert ID, station, asset code, or department..."
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 font-mono text-[9px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 uppercase cursor-pointer"
                >
                  CLEAR
                </button>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 1: ACTIVE CORRIDOR CONFLICTS */}
        {(filterType === 'all' || filterType === 'conflicts') && (
          <section className="flex flex-col space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-600 rounded-sm"></div>
                <h2 className="font-sans text-[16px] md:text-[18px] font-bold text-slate-900 uppercase tracking-tight">
                  Active Corridor Conflicts &amp; Interlocking Hazards
                </h2>
                <span className="px-2 py-0.5 bg-red-100 border border-red-300 text-red-800 font-mono text-[11px] font-extrabold uppercase rounded">
                  3 SHOWN OF 4 ACTIVE
                </span>
              </div>
              <span className="font-mono text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                CASCADE RISK PROTOCOL ENFORCED
              </span>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              {/* CARD 1: TEMPORAL OVERLAP */}
              <div className="bg-white border border-slate-200 border-l-4 border-l-red-500 rounded-lg flex flex-col justify-between p-4 shadow-sm hover:shadow-md transition-shadow relative">
                <div className="flex flex-col space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2 py-0.5 bg-red-50 border border-red-200 text-red-700 font-mono text-[10px] font-extrabold uppercase tracking-wider rounded">
                      CRITICAL TRACTION CONFLICT
                    </span>
                    <span className="font-mono text-[10px] text-slate-500 font-semibold">CF-2025-0819</span>
                  </div>

                  <div>
                    <h3 className="font-sans text-[14px] font-bold text-slate-900 uppercase leading-snug">
                      #12952 Rajdhani ⚔️ P-Way Weld #MW-882
                    </h3>
                    <div className="flex items-center space-x-1 mt-0.5 font-mono text-[11px] text-slate-600 font-bold uppercase">
                      <span className="material-symbols-outlined text-[15px] text-red-600">location_on</span>
                      <span>STN04–STN05 • KM 144/22 UP-FAST</span>
                    </div>
                  </div>

                  {/* VISUAL COLLISION SCHEMATIC */}
                  <div className="bg-slate-50 border border-slate-200 rounded p-2.5 space-y-2 font-mono text-xs">
                    <div className="space-y-1 text-[10px]">
                      <div className="flex items-center justify-between text-slate-500 font-semibold">
                        <span>04:00</span>
                        <span className="text-red-600 font-bold">04:42 COLLISION</span>
                        <span>05:30</span>
                      </div>
                      <div className="h-4 bg-slate-200 rounded relative overflow-hidden flex items-center">
                        <div className="absolute left-[15%] w-[75%] h-full bg-orange-200 border border-orange-400 flex items-center justify-center text-[9px] font-bold text-orange-900">
                          P-Way Possession (04:15–05:30)
                        </div>
                        <div className="absolute left-[50%] -top-1 -bottom-1 w-1.5 bg-red-600 z-10 animate-pulse shadow-sm"></div>
                      </div>
                      <div className="flex items-center justify-between text-[10px] pt-0.5">
                        <span className="text-red-700 font-bold">#12952 ETA: 04:42</span>
                        <span className="text-slate-600">T-18m Margin</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-slate-200 text-[10px]">
                      <div className="bg-red-50 border border-red-200 rounded px-2 py-1 text-red-700 font-bold text-center">
                        +18m CASCADE DELAY
                      </div>
                      <div className="bg-slate-100 border border-slate-200 rounded px-2 py-1 text-slate-700 font-bold text-center">
                        3 TRAILING RAKES
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 mt-3 pt-2 border-t border-slate-100 font-mono text-xs">
                  <Link
                    to="/control-chart"
                    className="flex-1 py-1.5 px-3 bg-[#ea580c] hover:bg-orange-700 text-white font-bold uppercase text-center transition-colors rounded shadow-xs"
                  >
                    Resolve in Chart ➔
                  </Link>
                  <Link
                    to="/ai-block-planner"
                    className="py-1.5 px-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold uppercase text-center transition-colors rounded shadow-xs"
                  >
                    Auto-Bundle
                  </Link>
                </div>
              </div>

              {/* CARD 2: TRACTION ISOLATION CASCADE */}
              <div className="bg-white border border-slate-200 border-l-4 border-l-orange-500 rounded-lg flex flex-col justify-between p-4 shadow-sm hover:shadow-md transition-shadow relative">
                <div className="flex flex-col space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2 py-0.5 bg-orange-50 border border-orange-200 text-orange-800 font-mono text-[10px] font-extrabold uppercase tracking-wider rounded">
                      HIGH TRACTION CONFLICT
                    </span>
                    <span className="font-mono text-[10px] text-slate-500 font-semibold">CF-2025-0822</span>
                  </div>

                  <div>
                    <h3 className="font-sans text-[14px] font-bold text-slate-900 uppercase leading-snug">
                      ⚡ 25kV Feeder Cut ⚔️ Down Freight FP-901
                    </h3>
                    <div className="flex items-center space-x-1 mt-0.5 font-mono text-[11px] text-slate-600 font-bold uppercase">
                      <span className="material-symbols-outlined text-[15px] text-orange-600">location_on</span>
                      <span>STN08–STN10 • MAST 192/14</span>
                    </div>
                  </div>

                  {/* VISUAL POWER CUTOUT SCHEMATIC */}
                  <div className="bg-slate-50 border border-slate-200 rounded p-2.5 space-y-2 font-mono text-xs">
                    <div className="space-y-1 text-[10px]">
                      <div className="flex items-center justify-between text-slate-600 font-semibold">
                        <span className="text-orange-700 font-bold">25kV OUTAGE: 90 MIN</span>
                        <span className="text-slate-500">03:30 ➔ 05:00</span>
                      </div>
                      <div className="h-4 bg-slate-200 rounded flex overflow-hidden border border-slate-300">
                        <div className="w-1/4 bg-emerald-500 flex items-center justify-center text-[9px] text-white font-bold">
                          LIVE
                        </div>
                        <div className="w-2/4 bg-red-600 flex items-center justify-center text-[9px] text-white font-bold animate-pulse">
                          ⚡ DEAD (2 BLOCKS)
                        </div>
                        <div className="w-1/4 bg-emerald-500 flex items-center justify-center text-[9px] text-white font-bold">
                          LIVE
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[10px] pt-0.5">
                        <span className="text-slate-600">STN08</span>
                        <span className="text-red-600 font-bold">FP-901 STALLED</span>
                        <span className="text-slate-600">STN10</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-slate-200 text-[10px]">
                      <div className="bg-orange-50 border border-orange-200 rounded px-2 py-1 text-orange-800 font-bold text-center">
                        DIESEL BANKER REQ
                      </div>
                      <div className="bg-slate-100 border border-slate-200 rounded px-2 py-1 text-slate-700 font-bold text-center">
                        INSULATOR REPAIR
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 mt-3 pt-2 border-t border-slate-100 font-mono text-xs">
                  <Link
                    to="/ai-block-planner"
                    className="flex-1 py-1.5 px-3 bg-[#ea580c] hover:bg-orange-700 text-white font-bold uppercase text-center transition-colors rounded shadow-xs"
                  >
                    Grant Power Bundle
                  </Link>
                  <button
                    onClick={() => handleAckItem('CF-2025-0822')}
                    className="py-1.5 px-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold uppercase text-center transition-colors rounded shadow-xs cursor-pointer"
                  >
                    Ack
                  </button>
                </div>
              </div>

              {/* CARD 3: HEADWAY BUFFER BREACH */}
              <div className="bg-white border border-slate-200 border-l-4 border-l-amber-500 rounded-lg flex flex-col justify-between p-4 shadow-sm hover:shadow-md transition-shadow relative">
                <div className="flex flex-col space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-800 font-mono text-[10px] font-extrabold uppercase tracking-wider rounded">
                      HEADWAY MARGIN WARNING
                    </span>
                    <span className="font-mono text-[10px] text-slate-500 font-semibold">CF-2025-0825</span>
                  </div>

                  <div>
                    <h3 className="font-sans text-[14px] font-bold text-slate-900 uppercase leading-snug">
                      ⏱️ Headway Breach: TSR 30 vs #12004
                    </h3>
                    <div className="flex items-center space-x-1 mt-0.5 font-mono text-[11px] text-slate-600 font-bold uppercase">
                      <span className="material-symbols-outlined text-[15px] text-amber-600">location_on</span>
                      <span>STN12–STN13 • KM 94/18 DOWN-TRACK</span>
                    </div>
                  </div>

                  {/* VISUAL HEADWAY METER */}
                  <div className="bg-slate-50 border border-slate-200 rounded p-2.5 space-y-2 font-mono text-xs">
                    <div className="space-y-1 text-[10px]">
                      <div className="flex items-center justify-between text-slate-600 font-semibold">
                        <span className="text-red-600 font-bold">ACTUAL: 8 MIN</span>
                        <span className="text-slate-500">STATUTORY MIN: 10 MIN</span>
                      </div>
                      <div className="h-4 bg-slate-200 rounded relative overflow-hidden flex items-center">
                        <div className="w-[80%] h-full bg-amber-500 flex items-center justify-end pr-2 text-[9px] text-white font-bold">
                          8m MARGIN (-2m DEFICIT)
                        </div>
                        <div className="w-[20%] h-full bg-red-100 flex items-center justify-center text-[8px] text-red-700 font-bold">
                          BUFFER
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[10px] pt-0.5">
                        <span className="text-slate-600">#22436 @ 30 km/h</span>
                        <span className="text-amber-700 font-bold">HOLD STN11: +4m</span>
                        <span className="text-slate-600">#12004 Trailing</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-slate-200 text-[10px]">
                      <div className="bg-amber-50 border border-amber-200 rounded px-2 py-1 text-amber-800 font-bold text-center">
                        STN11 HOLD RECOVERY
                      </div>
                      <div className="bg-emerald-50 border border-emerald-200 rounded px-2 py-1 text-emerald-700 font-bold text-center">
                        12 MIN RESTORED
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 mt-3 pt-2 border-t border-slate-100 font-mono text-xs">
                  <button
                    onClick={() => handleAckItem('CF-2025-0825')}
                    className="flex-1 py-1.5 px-3 bg-[#ea580c] hover:bg-orange-700 text-white font-bold uppercase text-center transition-colors rounded shadow-xs cursor-pointer"
                  >
                    Hold @ STN11 (+4m)
                  </button>
                  <Link
                    to="/control-chart"
                    className="py-1.5 px-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold uppercase text-center transition-colors rounded shadow-xs"
                  >
                    Chart
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 2: CRITICAL OVERDUE DEFECTS */}
        {(filterType === 'all' || filterType === 'overdue') && (
          <section className="flex flex-col space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-600 rounded-sm"></div>
                <h2 className="font-sans text-[15px] md:text-[17px] font-bold text-slate-900 uppercase tracking-tight">
                  Critical Overdue Defects
                </h2>
                <span className="px-2 py-0.5 bg-orange-100 border border-orange-300 text-orange-800 font-mono text-[10px] font-extrabold uppercase rounded">
                  6 OVERDUE
                </span>
              </div>
              <Link to="/maintenance" className="font-mono text-xs text-orange-600 hover:underline font-bold">
                Full Ledger ➔
              </Link>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] uppercase">
                    <tr>
                      <th className="py-2 px-4">TASK ID</th>
                      <th className="py-2 px-4">CORRIDOR</th>
                      <th className="py-2 px-4">DEPT</th>
                      <th className="py-2 px-4">DEFECT &amp; RESTRICTION</th>
                      <th className="py-2 px-4 text-center">SEVERITY</th>
                      <th className="py-2 px-4 text-center">OVERDUE METER</th>
                      <th className="py-2 px-4 text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {DEFECTS.filter((d) => d.overdueDays > 0).map((d) => (
                      <tr key={d.taskId} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 px-4 font-bold text-slate-900">{d.taskId}</td>
                        <td className="py-2.5 px-4 font-semibold text-slate-700">{d.corridor}</td>
                        <td className="py-2.5 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                            d.department === 'ENG' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                            d.department === 'TRD' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                            'bg-purple-50 text-purple-800 border-purple-200'
                          }`}>
                            {d.department}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 font-sans max-w-xs truncate">
                          <span className="font-semibold text-slate-800">{d.title}</span>
                          {d.speedRestriction && (
                            <span className="ml-2 px-1.5 py-0.5 bg-red-100 text-red-700 border border-red-200 rounded font-mono text-[9px] font-bold">
                              TSR {d.speedRestriction}
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <span className={`px-2 py-0.5 font-bold rounded text-[10px] ${
                            d.urgency === 1 ? 'bg-red-100 text-red-700 border border-red-200' :
                            d.urgency === 2 ? 'bg-orange-100 text-orange-800 border border-orange-200' :
                            'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}>
                            L{d.urgency}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          {/* Visual Overdue Progress Meter */}
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-red-600 rounded-full"
                                style={{ width: `${Math.min(100, d.overdueDays * 15)}%` }}
                              ></div>
                            </div>
                            <span className="font-bold text-red-600 text-[11px]">+{d.overdueDays}d</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <Link
                            to="/ai-block-planner"
                            className="px-2.5 py-1 bg-orange-600 hover:bg-orange-700 text-white font-bold uppercase text-[10px] rounded shadow-xs"
                          >
                            Resolve
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 3: UNSCHEDULED REQUISITIONS */}
        {(filterType === 'all' || filterType === 'unscheduled') && (
          <section className="flex flex-col space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-600 rounded-sm"></div>
                <h2 className="font-sans text-[15px] md:text-[17px] font-bold text-slate-900 uppercase tracking-tight">
                  Unscheduled Track Requisitions
                </h2>
                <span className="px-2 py-0.5 bg-blue-100 border border-blue-300 text-blue-800 font-mono text-[10px] font-extrabold uppercase rounded">
                  3 QUEUED
                </span>
              </div>
              <span className="font-mono text-[10px] text-slate-500 font-semibold uppercase">
                AWAITING CORRIDOR SLOT
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {unscheduledList.map((req) => (
                <div key={req.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col justify-between gap-3 hover:border-slate-300 transition-colors">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="font-bold text-slate-900">{req.id}</span>
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded font-bold text-[10px] uppercase">
                        {req.dept}
                      </span>
                    </div>
                    <div>
                      <div className="font-mono text-xs font-bold text-slate-800">{req.corridor} ({req.corridorName})</div>
                      {/* Visual tags instead of narrative text */}
                      <div className="flex flex-wrap gap-1.5 mt-2 font-mono text-[10px]">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 rounded font-semibold">
                          ⏱️ Slot: {req.hours}
                        </span>
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded font-semibold">
                          ⚠️ Slow Speed Block
                        </span>
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-semibold">
                          🔍 Slot Available T-14h
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between font-mono text-xs">
                    <span className="text-[10px] text-slate-500 font-semibold uppercase">{req.reqBy}</span>
                    <Link
                      to="/ai-block-planner"
                      className="px-3 py-1 bg-white hover:bg-slate-50 border border-slate-300 text-orange-600 font-bold uppercase text-[10px] rounded shadow-xs"
                    >
                      Slot in AI ➔
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
