import React, { useState } from 'react';

export default function AIBlockPlanner() {
  const [acceptedRecs, setAcceptedRecs] = useState({});
  const [toastMessage, setToastMessage] = useState(null);

  const handleAction = (recId, actionName) => {
    setAcceptedRecs((prev) => ({ ...prev, [recId]: actionName }));
    setToastMessage(`${actionName}: ${recId}`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <main className="max-w-[1720px] mx-auto w-full px-4 lg:px-8 py-4 flex flex-col gap-4 flex-1">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F172A] text-white border-2 border-[#10B981] px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2.5 font-mono text-xs animate-bounce">
          <span className="material-symbols-outlined text-[#10B981] text-[20px]">verified</span>
          <div>
            <div className="font-bold text-emerald-400 text-[10px] uppercase">SCHEDULE OPTIMIZED</div>
            <div className="text-slate-300 text-[11px]">{toastMessage}</div>
          </div>
        </div>
      )}

      {/* Top Status Bar */}
      <div className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between text-[11px] font-mono shadow-xs gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>
            ML-CORRIDOR-V9
          </div>
          <span className="text-slate-500">
            CORRIDOR: <strong className="text-slate-800">STN01 – STN25</strong>
          </span>
          <span className="text-slate-500">
            ACTIVE REQUESTS: <strong className="text-orange-600 font-bold">7</strong>
          </span>
        </div>
        <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-300 font-bold uppercase rounded text-[10px]">
          ZERO-PUNCTUALITY-LOSS
        </span>
      </div>

      {/* Page Title & KPI Cards */}
      <div className="w-full flex flex-col xl:flex-row xl:items-end justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight uppercase">
            AI Block Planner
          </h1>
          <p className="text-[12px] text-slate-600 font-mono mt-0.5">
            Autonomous multi-gang bundling in natural traffic valleys.
          </p>
        </div>

        {/* Metric Pills */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="px-3 py-2 bg-white border border-slate-200 rounded-xl shadow-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600 text-[18px]">trending_up</span>
            <div className="flex flex-col font-mono leading-tight">
              <span className="text-[9px] text-slate-500 uppercase font-semibold">EFFICIENCY</span>
              <span className="text-sm font-bold text-emerald-600">+68.4%</span>
            </div>
          </div>
          <div className="px-3 py-2 bg-white border border-slate-200 rounded-xl shadow-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-slate-700 text-[18px]">timer</span>
            <div className="flex flex-col font-mono leading-tight">
              <span className="text-[9px] text-slate-500 uppercase font-semibold">TIME SAVED</span>
              <span className="text-sm font-bold text-slate-900">07H 40M</span>
            </div>
          </div>
          <div className="px-3 py-2 bg-white border border-slate-200 rounded-xl shadow-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600 text-[18px]">lock_reset</span>
            <div className="flex flex-col font-mono leading-tight">
              <span className="text-[9px] text-slate-500 uppercase font-semibold">RESOLVED</span>
              <span className="text-sm font-bold text-blue-600">12 INTERLOCKS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="w-full flex flex-col gap-4">
        {/* BEFORE vs AFTER VISUAL COMPARISON */}
        <div className="w-full bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col">
          <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between font-mono text-[11px]">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-orange-600 text-[16px]">compare_arrows</span>
              OCCUPANCY AUDIT: STN04–STN05 UP-LINE
            </span>
            <span className="text-slate-500 font-semibold">IR-OPT-094</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 p-3">
            {/* LEFT: Fragmented (Visual Bars) */}
            <div className="bg-red-50/70 border border-red-200 rounded-lg p-3 flex flex-col justify-between gap-2.5">
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="font-bold text-red-900 uppercase flex items-center gap-1">
                  <span className="w-2 h-2 rounded-xs bg-red-600"></span>
                  Uncoordinated Single Requests
                </span>
                <span className="px-1.5 py-0.2 bg-red-200/80 text-red-800 text-[9px] font-bold rounded">
                  3 BLOCKS
                </span>
              </div>

              {/* Visual Fragmented Timeline */}
              <div className="space-y-1.5 font-mono text-[10px]">
                <div className="flex items-center justify-between p-1.5 bg-white border border-red-100 rounded">
                  <span className="font-bold text-slate-800">1. P-Way Weld Grinding</span>
                  <span className="text-red-700 font-bold">03:30–05:00 (90m)</span>
                </div>
                <div className="flex items-center justify-between p-1.5 bg-white border border-red-100 rounded">
                  <span className="font-bold text-slate-800">2. TRD OHE Cantilever</span>
                  <span className="text-red-700 font-bold">06:00–07:30 (90m)</span>
                </div>
                <div className="flex items-center justify-between p-1.5 bg-white border border-red-100 rounded">
                  <span className="font-bold text-slate-800">3. S&amp;T Axle Counter</span>
                  <span className="text-red-700 font-bold">08:00–09:00 (60m)</span>
                </div>
              </div>

              {/* Visual Metric Pill */}
              <div className="grid grid-cols-3 gap-1.5 p-2 bg-red-600 text-white rounded font-mono text-center text-[10px]">
                <div>
                  <span className="text-red-200 block text-[8px]">TOTAL DOWNTIME</span>
                  <span className="font-bold text-xs">5H 00M</span>
                </div>
                <div>
                  <span className="text-red-200 block text-[8px]">TRAIN DELAY</span>
                  <span className="font-bold text-xs">+142 MIN</span>
                </div>
                <div>
                  <span className="text-red-200 block text-[8px]">HAZARD</span>
                  <span className="font-bold text-xs">CONFLICT</span>
                </div>
              </div>
            </div>

            {/* RIGHT: AI Unified Plan (Visual Parallel Gantt) */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-3 flex flex-col justify-between gap-2.5">
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="font-bold text-emerald-950 uppercase flex items-center gap-1">
                  <span className="w-2 h-2 rounded-xs bg-emerald-600 animate-pulse"></span>
                  AI Coordinated Parallel Schedule
                </span>
                <span className="px-1.5 py-0.2 bg-emerald-200/80 text-emerald-900 text-[9px] font-bold rounded">
                  1 BUNDLED BLOCK
                </span>
              </div>

              {/* Visual Gantt Bar */}
              <div className="bg-white border border-emerald-200 rounded p-2 flex flex-col gap-1 font-mono text-[10px]">
                <div className="flex items-center justify-between font-bold text-emerald-900 pb-1 border-b border-slate-100">
                  <span>UNIFIED WINDOW: 03:45 – 05:45 IST</span>
                  <span>120 MIN (2H 00M)</span>
                </div>

                <div className="space-y-1 pt-1">
                  <div className="flex items-center gap-2">
                    <span className="w-14 text-right text-[9px] text-slate-500 font-bold">TRACK</span>
                    <div className="flex-1 h-3 bg-rose-400 rounded text-white text-[8px] flex items-center px-2 font-bold">
                      Crew P-44 (105m)
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-14 text-right text-[9px] text-slate-500 font-bold">OHE</span>
                    <div className="flex-1 h-3 bg-emerald-500 rounded text-white text-[8px] flex items-center px-2 font-bold">
                      TRD Feeder 12 (120m)
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-14 text-right text-[9px] text-slate-500 font-bold">SIGNAL</span>
                    <div className="w-3/4 h-3 bg-blue-500 rounded text-white text-[8px] flex items-center px-2 font-bold ml-6">
                      S&amp;T Gang (60m)
                    </div>
                  </div>
                </div>
              </div>

              {/* Visual Metric Pill */}
              <div className="grid grid-cols-3 gap-1.5 p-2 bg-emerald-600 text-white rounded font-mono text-center text-[10px]">
                <div>
                  <span className="text-emerald-100 block text-[8px]">DOWNTIME SAVED</span>
                  <span className="font-bold text-xs">03H 00M</span>
                </div>
                <div>
                  <span className="text-emerald-100 block text-[8px]">TRAIN DELAY</span>
                  <span className="font-bold text-xs">00 MIN</span>
                </div>
                <div>
                  <span className="text-emerald-100 block text-[8px]">SAFETY</span>
                  <span className="font-bold text-xs">SAFE BUFFER ✓</span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center justify-between font-mono text-[11px]">
            <span className="text-emerald-700 font-bold">99.8% Simulation Confidence</span>
            <button
              onClick={() => handleAction('STN04-05', 'Approve STN04-05 Bundle')}
              className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded font-bold uppercase transition-colors shadow-xs cursor-pointer text-[10px]"
            >
              Approve &amp; Propagate Bundle
            </button>
          </div>
        </div>

        {/* ACTIVE PROPOSALS (Compact & Visual) */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 font-mono uppercase flex items-center gap-1.5">
              <span className="material-symbols-outlined text-orange-600 text-[18px]">hub</span>
              Active Proposals (3)
            </h2>
          </div>

          {/* Proposal 1 */}
          <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 shadow-xs">
            <div className="flex flex-col gap-1.5 font-mono text-xs flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-1.5 py-0.2 bg-red-600 text-white text-[9px] font-black rounded uppercase">
                  REC #01
                </span>
                <span className="font-bold text-slate-900 font-sans">STN04–STN05 Up-Line</span>
                <span className="text-slate-400">|</span>
                <span className="text-orange-600 font-bold">03:45–05:45 (120m)</span>
              </div>

              {/* Visual Task Chips */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="px-2 py-0.5 bg-rose-50 border border-rose-200 text-rose-800 rounded font-bold text-[10px]">
                  Track: Weld Repair
                </span>
                <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded font-bold text-[10px]">
                  Power: OHE Patrol
                </span>
                <span className="px-2 py-0.5 bg-blue-50 border border-blue-200 text-blue-800 rounded font-bold text-[10px]">
                  Signal: Pt 102
                </span>
              </div>
            </div>

            {/* Visual Gauges & Actions */}
            <div className="flex items-center gap-3 font-mono">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded text-[10px]">
                <span className="text-emerald-700 font-bold">+65% Eff</span>
                <span className="text-slate-300">|</span>
                <span className="text-orange-600 font-bold">Score 94</span>
              </div>

              <button
                onClick={() => handleAction('REC-01', 'Accept')}
                className={`px-3 py-1.5 rounded font-bold uppercase text-[10px] transition-colors cursor-pointer shadow-xs ${
                  acceptedRecs['REC-01'] ? 'bg-emerald-600 text-white' : 'bg-orange-600 hover:bg-orange-700 text-white'
                }`}
              >
                {acceptedRecs['REC-01'] ? 'Dispatched' : 'Grant'}
              </button>
            </div>
          </div>

          {/* Proposal 2 */}
          <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 shadow-xs">
            <div className="flex flex-col gap-1.5 font-mono text-xs flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-1.5 py-0.2 bg-orange-600 text-white text-[9px] font-black rounded uppercase">
                  REC #02
                </span>
                <span className="font-bold text-slate-900 font-sans">STN08–STN09 Sahibabad</span>
                <span className="text-slate-400">|</span>
                <span className="text-orange-600 font-bold">03:30–05:00 (90m)</span>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded font-bold text-[10px]">
                  Power: Mast 192 Insulator
                </span>
                <span className="px-2 py-0.5 bg-rose-50 border border-rose-200 text-rose-800 rounded font-bold text-[10px]">
                  Track: Ballast Shoulder
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 font-mono">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded text-[10px]">
                <span className="text-emerald-700 font-bold">+52% Eff</span>
                <span className="text-slate-300">|</span>
                <span className="text-orange-600 font-bold">Score 82</span>
              </div>

              <button
                onClick={() => handleAction('REC-02', 'Accept')}
                className={`px-3 py-1.5 rounded font-bold uppercase text-[10px] transition-colors cursor-pointer shadow-xs ${
                  acceptedRecs['REC-02'] ? 'bg-emerald-600 text-white' : 'bg-orange-600 hover:bg-orange-700 text-white'
                }`}
              >
                {acceptedRecs['REC-02'] ? 'Dispatched' : 'Grant'}
              </button>
            </div>
          </div>

          {/* Proposal 3 */}
          <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 shadow-xs">
            <div className="flex flex-col gap-1.5 font-mono text-xs flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-1.5 py-0.2 bg-emerald-600 text-white text-[9px] font-black rounded uppercase">
                  REC #03
                </span>
                <span className="font-bold text-slate-900 font-sans">STN12–STN13 Firozabad</span>
                <span className="text-slate-400">|</span>
                <span className="text-orange-600 font-bold">07:00–08:30 (90m)</span>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="px-2 py-0.5 bg-blue-50 border border-blue-200 text-blue-800 rounded font-bold text-[10px]">
                  Signal: Axle Counter Sensor
                </span>
                <span className="px-2 py-0.5 bg-rose-50 border border-rose-200 text-rose-800 rounded font-bold text-[10px]">
                  Track: IRJ Joint Cleanse
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 font-mono">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded text-[10px]">
                <span className="text-emerald-700 font-bold">+48% Eff</span>
                <span className="text-slate-300">|</span>
                <span className="text-orange-600 font-bold">Score 87</span>
              </div>

              <button
                onClick={() => handleAction('REC-03', 'Accept')}
                className={`px-3 py-1.5 rounded font-bold uppercase text-[10px] transition-colors cursor-pointer shadow-xs ${
                  acceptedRecs['REC-03'] ? 'bg-emerald-600 text-white' : 'bg-orange-600 hover:bg-orange-700 text-white'
                }`}
              >
                {acceptedRecs['REC-03'] ? 'Dispatched' : 'Grant'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
