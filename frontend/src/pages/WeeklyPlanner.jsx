import React, { useState, useEffect } from 'react';
import { fetchPlan } from '../api';

export default function WeeklyPlanner() {
  const [tabMode, setTabMode] = useState('weekly'); // 'weekly' | 'monthly'
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [planData, setPlanData] = useState(null);
  const [planError, setPlanError] = useState(null);

  useEffect(() => {
    fetchPlan(tabMode)
      .then((data) => setPlanData({ ...data, total_scheduled: (data.plan ?? data.scheduled_blocks ?? []).length }))
      .catch(() => setPlanError('Backend offline – showing cached data'));
  }, [tabMode]);

  const blockEvents = [
    {
      id: 'BLK-01',
      corridor: 'STN01-STN05',
      day: 'MON 15',
      time: '01:30–04:00 (150m)',
      dept: 'TRACK',
      desc: 'Thermite weld grind & ultrasonic scan',
      crew: 'DEL-PW-14',
      type: 'track',
    },
    {
      id: 'BLK-02',
      corridor: 'STN01-STN05',
      day: 'WED 17',
      time: '02:00–04:30 (150m)',
      dept: 'BUNDLE',
      desc: 'Weld Repair + 25kV Feeder Patrol',
      crew: 'Joint Gang TW-09 & 14',
      type: 'bundle',
    },
    {
      id: 'BLK-03',
      corridor: 'STN06-STN10',
      day: 'TUE 16',
      time: '00:30–03:00 (150m)',
      dept: 'POWER',
      desc: 'Mast 192 insulator renewal',
      crew: 'Tower Wagon TW-09',
      type: 'power',
    },
    {
      id: 'BLK-04',
      corridor: 'STN11-STN15',
      day: 'THU 18',
      time: '03:00–05:00 (120m)',
      dept: 'SIGNAL',
      desc: 'Axle counter sensor dualization',
      crew: 'S&T Division',
      type: 'signal',
    },
    {
      id: 'BLK-05',
      corridor: 'STN16-STN20',
      day: 'FRI 19',
      time: '01:00–03:30 (150m)',
      dept: 'TRACK',
      desc: 'Yard East Turnout renewal',
      crew: 'Gang 22',
      type: 'track',
    },
    {
      id: 'BLK-06',
      corridor: 'STN21-STN25',
      day: 'SUN 21',
      time: '02:15–05:15 (180m)',
      dept: 'BUNDLE',
      desc: 'Girder Bridge + OHE Droppers',
      crew: 'Bridge Gang BG-03',
      type: 'bundle',
    },
  ];

  const corridorRows = [
    { id: 'STN01-STN05', name: 'Devgarh — Kishanganj', tracks: 'UP/DN' },
    { id: 'STN06-STN10', name: 'Anand Vihar — Hathras', tracks: 'TRIPLE' },
    { id: 'STN11-STN15', name: 'Tundla — Bharthana', tracks: 'DOUBLE' },
    { id: 'STN16-STN20', name: 'Phaphund — Kanpur', tracks: 'QUAD' },
    { id: 'STN21-STN25', name: 'Unnao — Ratlam Jn', tracks: '160 KM/H' },
  ];

  const daysOfWeek = ['MON 15', 'TUE 16', 'WED 17', 'THU 18', 'FRI 19', 'SAT 20', 'SUN 21'];

  return (
    <main className="max-w-[1720px] mx-auto w-full px-4 lg:px-8 py-4 flex flex-col gap-4 flex-1">
      {/* Backend Connection Status */}
      {planError && (
        <div className="w-full bg-amber-50 border border-amber-200 text-amber-800 font-mono text-[11px] px-3 py-1.5 rounded-lg flex items-center gap-2">
          <span className="material-symbols-outlined text-[14px]">wifi_off</span>
          {planError}
        </div>
      )}
      {planData && !planError && (
        <div className="w-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-[11px] px-3 py-1.5 rounded-lg flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          LIVE DATA — Backend connected · {planData.total_scheduled ?? 0} blocks scheduled this {tabMode === 'weekly' ? 'week' : 'month'}
        </div>
      )}
      {/* Top Planner Controls */}
      <div className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setTabMode('weekly')}
              className={`px-3 py-1 font-mono text-[11px] uppercase tracking-wider rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
                tabMode === 'weekly' ? 'bg-[#ea580c] text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">calendar_view_week</span>
              Weekly Matrix
            </button>
            <button
              onClick={() => setTabMode('monthly')}
              className={`px-3 py-1 font-mono text-[11px] uppercase tracking-wider rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
                tabMode === 'monthly' ? 'bg-[#ea580c] text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">calendar_view_month</span>
              Monthly Capacity
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 font-mono text-[10px]">
          <span className="flex items-center gap-1 text-slate-600">
            <span className="w-2 h-2 rounded-xs bg-rose-500"></span> Track
          </span>
          <span className="flex items-center gap-1 text-slate-600">
            <span className="w-2 h-2 rounded-xs bg-emerald-500"></span> Traction
          </span>
          <span className="flex items-center gap-1 text-slate-600">
            <span className="w-2 h-2 rounded-xs bg-blue-500"></span> Signal
          </span>
          <span className="flex items-center gap-1 text-orange-600 font-bold">
            <span className="w-2 h-2 rounded-xs bg-[#ea580c]"></span> AI Bundle
          </span>
        </div>
      </div>

      {/* WEEKLY TIMELINE MATRIX */}
      {tabMode === 'weekly' && (
        <div className="w-full flex flex-col gap-3">
          <div className="w-full bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col">
            {/* Header */}
            <div className="grid grid-cols-8 bg-slate-50 border-b border-slate-200 font-mono text-[11px] py-2">
              <div className="px-3 font-bold text-slate-700 uppercase border-r border-slate-200">
                CORRIDOR
              </div>
              {daysOfWeek.map((d, i) => (
                <div key={d} className="text-center font-bold text-slate-800 border-r last:border-r-0 border-slate-200">
                  <span className={i === 2 ? 'text-orange-600 font-black' : ''}>{d}</span>
                </div>
              ))}
            </div>

            {/* Matrix */}
            <div className="divide-y divide-slate-100 font-mono text-xs">
              {corridorRows.map((corr) => (
                <div key={corr.id} className="grid grid-cols-8 min-h-[76px] hover:bg-slate-50/40 transition-colors">
                  <div className="p-2.5 bg-slate-50/50 border-r border-slate-200 flex flex-col justify-center">
                    <span className="font-bold text-slate-900 text-[10px]">{corr.id}</span>
                    <span className="text-[9px] text-slate-500 truncate">{corr.name}</span>
                  </div>

                  {daysOfWeek.map((day) => {
                    const blocks = blockEvents.filter((b) => b.corridor === corr.id && b.day === day);
                    return (
                      <div key={day} className="p-1 border-r last:border-r-0 border-slate-200 flex flex-col justify-center gap-1">
                        {blocks.map((b) => {
                          let style = 'bg-rose-50 border-rose-300 text-rose-900';
                          if (b.type === 'power') style = 'bg-emerald-50 border-emerald-300 text-emerald-900';
                          if (b.type === 'signal') style = 'bg-blue-50 border-blue-300 text-blue-900';
                          if (b.type === 'bundle') style = 'bg-orange-50 border-orange-300 text-orange-900 ring-1 ring-orange-300';

                          return (
                            <button
                              key={b.id}
                              onClick={() => setSelectedBlock(b)}
                              className={`w-full p-1.5 rounded border text-left flex flex-col gap-0.5 cursor-pointer shadow-xs ${style}`}
                            >
                              <div className="flex items-center justify-between text-[8px] font-bold">
                                <span>{b.dept}</span>
                                <span>{b.time.split(' ')[0]}</span>
                              </div>
                              <span className="text-[9px] font-sans font-semibold truncate leading-tight">{b.desc}</span>
                            </button>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MONTHLY OVERVIEW */}
      {tabMode === 'monthly' && (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { corr: 'STN01–05 Devgarh', allocated: 42, cap: 60, score: 92, risk: 'LOW' },
            { corr: 'STN06–10 Anand Vihar', allocated: 54, cap: 60, score: 76, risk: 'ELEVATED' },
            { corr: 'STN11–15 Tundla', allocated: 38, cap: 50, score: 88, risk: 'LOW' },
            { corr: 'STN16–20 Kanpur Central', allocated: 58, cap: 60, score: 68, risk: 'HIGH OCCUPANCY' },
            { corr: 'STN21–25 Ratlam Jn', allocated: 46, cap: 60, score: 84, risk: 'MODERATE' },
          ].map((item) => (
            <div key={item.corr} className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col gap-2 font-mono">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-900">{item.corr}</span>
                <span className={`px-1.5 py-0.2 rounded text-[9px] ${item.risk === 'LOW' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'}`}>
                  {item.risk}
                </span>
              </div>
              <div className="flex items-baseline justify-between text-xs">
                <span className="text-lg font-black text-slate-900">{item.allocated}h</span>
                <span className="text-slate-500 text-[10px]">Max {item.cap}h</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${item.allocated / item.cap > 0.85 ? 'bg-red-600' : 'bg-emerald-500'}`}
                  style={{ width: `${(item.allocated / item.cap) * 100}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                <span>AI Bundle Score: <strong className="text-orange-600">{item.score}/100</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Block Details Modal */}
      {selectedBlock && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 max-w-sm w-full shadow-2xl space-y-2.5 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="px-2 py-0.5 bg-[#ea580c] text-white rounded text-[10px] font-bold">{selectedBlock.id}</span>
              <button onClick={() => setSelectedBlock(null)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 uppercase font-bold">{selectedBlock.corridor}</span>
              <h3 className="font-heading font-bold text-sm text-slate-900 font-sans">{selectedBlock.desc}</h3>
            </div>
            <div className="bg-slate-50 p-2.5 rounded text-[11px] space-y-1">
              <div><span className="text-slate-400 text-[9px]">TIME:</span> <span className="font-bold">{selectedBlock.day} • {selectedBlock.time}</span></div>
              <div><span className="text-slate-400 text-[9px]">GANG:</span> <span className="font-bold">{selectedBlock.crew}</span></div>
            </div>
            <div className="flex justify-end pt-1">
              <button onClick={() => setSelectedBlock(null)} className="px-3 py-1 bg-slate-100 rounded text-[10px] uppercase cursor-pointer">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
