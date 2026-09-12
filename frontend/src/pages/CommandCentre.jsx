import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LIVE_TRAINS } from '../data/mockData';

export default function CommandCentre() {
  const [grantedBlocks, setGrantedBlocks] = useState({});
  const [activeAlert, setActiveAlert] = useState(null);

  const handleGrantBlock = (id, title) => {
    setGrantedBlocks((prev) => ({ ...prev, [id]: true }));
    setActiveAlert(`Block granted: ${title}`);
    setTimeout(() => setActiveAlert(null), 3500);
  };

  const primeTrain = LIVE_TRAINS[0];

  return (
    <main className="max-w-[1720px] mx-auto px-4 lg:px-8 py-4 flex flex-col gap-5 w-full">
      {/* Dynamic Notification Toast */}
      {activeAlert && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F172A] text-white border-2 border-[#10B981] px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2.5 font-mono text-xs animate-bounce">
          <span className="material-symbols-outlined text-[#10B981] text-[20px]">verified</span>
          <div>
            <div className="font-bold text-emerald-400 text-[10px] uppercase">DISPATCH CONFIRMED</div>
            <div className="text-slate-300 text-[11px]">{activeAlert}</div>
          </div>
        </div>
      )}

      {/* QUICK STATUS BAR & DISPATCH ACTIONS */}
      <div className="flex items-center justify-between gap-4 py-0.5 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-[#EA580C] rounded-full animate-pulse"></span>
          <span className="font-mono text-[11px] text-[#475569] font-bold tracking-wider uppercase flex items-center gap-1.5">
            <span>LIVE CORRIDOR FEED</span>
            <span className="text-slate-300">/</span>
            <span className="text-[#059669] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
              25 STATIONS ACTIVE
            </span>
          </span>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            to="/control-chart"
            className="px-3.5 py-1.5 bg-white hover:bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] font-mono text-[11px] font-bold uppercase tracking-wider rounded-lg shadow-xs flex items-center gap-1.5 transition-all"
          >
            <span className="material-symbols-outlined text-[16px] text-slate-500">schema</span>
            <span>Control Chart</span>
          </Link>
          <Link
            to="/ai-block-planner"
            className="px-3.5 py-1.5 bg-[#EA580C] hover:bg-[#C2410C] text-white font-mono text-[11px] font-bold uppercase tracking-wider rounded-lg shadow-sm transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">bolt</span>
            <span>AI Block Planner</span>
            <span className="px-1.5 py-0.2 bg-white text-[#EA580C] font-mono text-[10px] font-black rounded ml-0.5">
              4
            </span>
          </Link>
        </div>
      </div>

      {/* THE TRAIN HERO STAGE (Directly on mesh-grid background) */}
      <div className="relative w-full h-[220px] sm:h-[250px] lg:h-[270px] flex items-center justify-center px-4">
        {/* Ground Rail Bed directly on background */}
        <div className="absolute bottom-4 left-0 right-0 h-1 bg-slate-300/80 pointer-events-none"></div>
        <div className="absolute bottom-2 left-0 right-0 h-0.5 bg-slate-200/90 pointer-events-none"></div>

        {/* Main Train Visual */}
        <div className="relative w-full max-w-3xl flex items-center justify-center z-10">
          <img
            alt="Vande Bharat Express Flagship Model"
            className="w-full max-w-lg sm:max-w-xl lg:max-w-2xl object-contain translate-x-5 -translate-y-[26px] drop-shadow-[0_16px_22px_rgba(15,23,42,0.12)] select-none"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyk3QXdd2HIhl4IHF48MqF1HDQtvCoaUSQsE2O4A5t8NpynO9-HUB1sNzk2SSuoZbztKrkprcUCATXeVuUmmica77yViBSZNvbboPevqOmlOJMCN7WPuITch9beObjCccrdeDyC5Z7GSpA7DI5_rB9nnuo-KWpElfVqJFFir5l5BZ8kXbqZskTHgbsbXckdtXGRrE6u6H5fukEfPFb_eynaNk7V47AdB9Cp1RmT31_7xpZ-YKfGfrR0Iwqlrdo0SttNAY"
          />
        </div>

        {/* Top-Left: Train Identity & Speed */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-4 z-20 flex flex-col gap-1.5">
          <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md border border-[#E2E8F0] px-3 py-1.5 rounded-lg shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
            <span className="font-mono text-[11px] text-[#0F172A] font-black uppercase tracking-wider">
              VB-22436 · UP-MAIN
            </span>
            <span className="text-slate-300">|</span>
            <span className="font-mono text-[11px] text-[#EA580C] font-black">
              {primeTrain.speed} KM/H
            </span>
          </div>
          <div className="hidden sm:flex bg-white/90 backdrop-blur-md border border-[#E2E8F0] px-2.5 py-1 rounded-md font-mono text-[11px] text-slate-600 shadow-xs items-center gap-1.5">
            <span>Section STN06 (Anand Vihar) ➔ STN07 (Ghaziabad)</span>
          </div>
        </div>

        {/* Top-Right: Section Status */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-4 z-20 hidden sm:flex items-center gap-2">
          <div className="bg-white/90 backdrop-blur-md border border-[#E2E8F0] px-3 py-1.5 rounded-lg text-slate-700 shadow-xs flex items-center gap-2 font-mono text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>25kV OHE: 24.6 kV</span>
          </div>
          <div className="bg-white/90 backdrop-blur-md border border-[#E2E8F0] px-3 py-1.5 rounded-lg text-slate-700 shadow-xs flex items-center gap-1.5 font-mono text-[11px]">
            <span className="material-symbols-outlined text-[15px] text-emerald-600">verified</span>
            <span>ON-TIME</span>
          </div>
        </div>
      </div>

      {/* 4 STAT CARDS (Directly on mesh-grid background) */}
      <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-4 -mt-8 relative z-20">
        {/* Card 1: Total Defects (defects.csv) -> Slate accent */}
        <div className="bg-white rounded-xl border border-slate-200 border-l-4 border-l-slate-700 p-4 flex flex-col gap-2 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 font-mono text-[11px] font-bold uppercase">
            <span>DEFECT REGISTRY</span>
            <span className="material-symbols-outlined text-slate-600 text-[18px]">build_circle</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-heading font-black text-2xl text-slate-900">14</span>
            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-mono text-[10px] font-bold rounded-md">
              defects.csv
            </span>
          </div>
          <div className="text-[11px] font-mono text-slate-500">Across 25 Block Sections</div>
        </div>

        {/* Card 2: Critical Urgency 5 (defects.csv) -> Red accent */}
        <div className="bg-white rounded-xl border border-slate-200 border-l-4 border-l-red-600 p-4 flex flex-col gap-2 shadow-xs">
          <div className="flex items-center justify-between text-red-700 font-mono text-[11px] font-bold uppercase">
            <span>CRITICAL DEFECTS</span>
            <span className="material-symbols-outlined text-red-600 text-[18px]">warning</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-heading font-black text-2xl text-red-600">02</span>
            <span className="px-2 py-0.5 bg-red-50 text-red-700 border border-red-200 font-mono text-[10px] font-black rounded-md uppercase">
              URGENCY L5
            </span>
          </div>
          <div className="text-[11px] font-mono text-red-600 font-semibold">Overdue Possession Reqd</div>
        </div>

        {/* Card 3: Unscheduled Requisitions (plan status) -> Amber accent */}
        <div className="bg-white rounded-xl border border-slate-200 border-l-4 border-l-amber-500 p-4 flex flex-col gap-2 shadow-xs">
          <div className="flex items-center justify-between text-amber-800 font-mono text-[11px] font-bold uppercase">
            <span>UNSCHEDULED</span>
            <span className="material-symbols-outlined text-amber-600 text-[18px]">pending_actions</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-heading font-black text-2xl text-amber-800">08</span>
            <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 font-mono text-[10px] font-bold rounded-md">
              Awaiting Slot
            </span>
          </div>
          <div className="text-[11px] font-mono text-slate-500">Pending AI Optimization</div>
        </div>

        {/* Card 4: Scheduled Windows (windows.csv / plan_output) -> Emerald accent */}
        <div className="bg-white rounded-xl border border-slate-200 border-l-4 border-l-emerald-600 p-4 flex flex-col gap-2 shadow-xs">
          <div className="flex items-center justify-between text-emerald-800 font-mono text-[11px] font-bold uppercase">
            <span>PLANNED WINDOWS</span>
            <span className="material-symbols-outlined text-emerald-600 text-[18px]">event_available</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-heading font-black text-2xl text-emerald-700">05</span>
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-[10px] font-bold rounded-md">
              windows.csv
            </span>
          </div>
          <div className="text-[11px] font-mono text-emerald-700 font-semibold">Next 12h Execution</div>
        </div>
      </div>

      {/* OPERATIONAL CORE: 2-COLUMN BALANCED COCKPIT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start pb-4">
        {/* Left Column (8 cols): Prioritized Attention Ledger */}
        <div className="lg:col-span-8 flex flex-col gap-3">
          <div className="bg-white px-4 py-3 rounded-xl border border-[#E2E8F0] flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#EA580C] text-[18px]">priority_high</span>
              <h2 className="font-heading font-bold text-[15px] text-[#0F172A] uppercase tracking-wide">
                Prioritized Attention (3)
              </h2>
            </div>
            <span className="font-mono text-[10px] text-[#64748B] font-bold uppercase">
              DEFECTS.CSV REQUIRING CORRIDOR POSSESSION
            </span>
          </div>

          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden flex flex-col divide-y divide-slate-100">
            {/* Defect 1 */}
            <div className="p-4 border-l-4 border-l-[#DC2626] hover:bg-[#F8FAFC] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 flex-wrap font-mono text-xs">
                  <span className="font-bold text-slate-900">T001</span>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-bold rounded text-[10px] uppercase border border-slate-200">
                    Track
                  </span>
                  <span className="font-bold text-slate-800">STN04–STN05</span>
                  <span className="text-slate-300">·</span>
                  <span className="font-bold text-red-600">+4 days overdue</span>
                </div>
                <h3 className="font-heading font-bold text-sm text-[#0F172A]">
                  Weld failure on up-line rail joint near Devgarh
                </h3>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="px-2.5 py-1 bg-red-50 text-red-700 border border-red-200 rounded font-mono text-xs font-bold">
                  Urgency L5
                </span>
                <Link
                  to="/ai-block-planner"
                  className="px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 hover:text-orange-600 font-mono text-xs font-bold uppercase rounded-lg shadow-xs transition-all"
                >
                  Plan Slot ➔
                </Link>
              </div>
            </div>

            {/* Defect 2 */}
            <div className="p-4 border-l-4 border-l-[#EA580C] hover:bg-[#F8FAFC] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 flex-wrap font-mono text-xs">
                  <span className="font-bold text-slate-900">T002</span>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-bold rounded text-[10px] uppercase border border-slate-200">
                    Power
                  </span>
                  <span className="font-bold text-slate-800">STN08–STN09</span>
                  <span className="text-slate-300">·</span>
                  <span className="font-bold text-orange-600">+2 days overdue</span>
                </div>
                <h3 className="font-heading font-bold text-sm text-[#0F172A]">
                  OHE mast insulator cracked
                </h3>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="px-2.5 py-1 bg-orange-50 text-orange-700 border border-orange-200 rounded font-mono text-xs font-bold">
                  Urgency L5
                </span>
                <Link
                  to="/ai-block-planner"
                  className="px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 hover:text-orange-600 font-mono text-xs font-bold uppercase rounded-lg shadow-xs transition-all"
                >
                  Plan Slot ➔
                </Link>
              </div>
            </div>

            {/* Defect 3 */}
            <div className="p-4 border-l-4 border-l-[#D97706] hover:bg-[#F8FAFC] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 flex-wrap font-mono text-xs">
                  <span className="font-bold text-slate-900">T003</span>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-bold rounded text-[10px] uppercase border border-slate-200">
                    Signal
                  </span>
                  <span className="font-bold text-slate-800">STN16–STN17</span>
                  <span className="text-slate-300">·</span>
                  <span className="font-bold text-slate-600">+1 day overdue</span>
                </div>
                <h3 className="font-heading font-bold text-sm text-[#0F172A]">
                  Point machine 24B feedback delayed
                </h3>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded font-mono text-xs font-bold">
                  Urgency L4
                </span>
                <Link
                  to="/ai-block-planner"
                  className="px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 hover:text-orange-600 font-mono text-xs font-bold uppercase rounded-lg shadow-xs transition-all"
                >
                  Plan Slot ➔
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): AI Proposals Queue & Live Corridor Telemetry */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          {/* AI Block Planner Quick Capsule */}
          <div className="bg-white rounded-xl border border-[#CBD5E1] p-4 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-900">
                <span className="w-2 h-2 rounded-full bg-[#EA580C] animate-pulse"></span>
                <span className="material-symbols-outlined text-[#EA580C] text-[18px]">smart_toy</span>
                <span>AI OPTIMIZER QUEUE</span>
              </div>
              <span className="px-2 py-0.5 bg-orange-100 text-orange-800 font-mono text-[10px] font-black rounded">
                3 PROPOSALS
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex flex-col gap-2 font-mono text-xs">
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>BUNDLE CANDIDATE</span>
                <span className="text-emerald-700 font-bold">+68.4% SAVINGS</span>
              </div>
              <div className="font-bold text-slate-900 text-[12px] leading-snug">
                STN12–STN13 Up-Line Parallel Possession
              </div>
              <div className="text-[11px] text-slate-600">
                Bundles Track Tamping + OHE Patrol into a single 120m corridor slot.
              </div>
            </div>

            <Link
              to="/ai-block-planner"
              className="w-full py-2.5 bg-[#EA580C] hover:bg-[#C2410C] text-white font-mono text-xs font-bold uppercase tracking-wider rounded-lg shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <span>Review in AI Block Planner</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>

          {/* Corridor Live Snapshot */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs flex flex-col gap-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-bold text-slate-800 uppercase text-[11px]">CORRIDOR HEALTH</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                25 SECTIONS CLEAR
              </span>
            </div>

            <div className="space-y-2 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Jurisdiction:</span>
                <span className="text-slate-800 font-bold">STN01–STN25 (202 km)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Active Rakes:</span>
                <span className="text-slate-800 font-bold">9 Running / 0 Stalled</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Next Scheduled Window:</span>
                <span className="text-orange-600 font-bold">MW-879 @ STN08 (01h 22m)</span>
              </div>
            </div>

            <Link
              to="/control-chart"
              className="mt-1 w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-mono text-[11px] font-bold uppercase tracking-wider rounded-lg text-center transition-colors flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[15px]">schema</span>
              <span>Open Control Chart</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
