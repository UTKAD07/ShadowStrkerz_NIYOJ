import React, { useState, useMemo, useEffect } from 'react';
import { DEFECTS, STATIONS } from '../data/mockData';
import { Link } from 'react-router-dom';
import { fetchPlan } from '../api';

export default function Maintenance() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedCorridor, setSelectedCorridor] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [sortBy, setSortBy] = useState('urgency-desc');
  const [selectedDefect, setSelectedDefect] = useState(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [defectsList, setDefectsList] = useState(DEFECTS);
  const [toast, setToast] = useState(null);

  // Hydrate with backend plan data - merge real scheduled defects into the list
  useEffect(() => {
    fetchPlan('weekly')
      .then((plan) => {
        const blocks = plan?.plan ?? plan?.scheduled_blocks ?? [];
        if (!blocks.length) return;
        const backendDefects = blocks.map((blk, idx) => ({
          taskId: blk.task_id ?? `API-${idx + 1}`,
          corridor: blk.corridor ?? blk.block_section ?? '',
          corridorName: blk.corridor_name ?? blk.corridor ?? '',
          department: blk.department ?? blk.dept ?? 'Track',
          title: blk.description ?? blk.title ?? blk.task_type ?? 'Scheduled Maintenance',
          description: blk.notes ?? '',
          urgency: blk.urgency ?? blk.priority ?? 3,
          overdueDays: blk.overdue_days ?? 0,
          estimatedHours: blk.estimated_hours ?? blk.duration_hours ?? 1.5,
          status: 'Scheduled',
          linesAffected: blk.line ?? 'UP-MAIN',
          speedRestriction: blk.speed_restriction ? `${blk.speed_restriction} KM/H` : 'NONE',
          recommendedWindow: blk.assigned_start ? `${blk.assigned_start}–${blk.assigned_end} (${blk.date})` : '',
        }));
        setDefectsList((prev) => {
          const ids = new Set(backendDefects.map((d) => d.taskId));
          return [...backendDefects, ...prev.filter((d) => !ids.has(d.taskId))];
        });
      })
      .catch(() => {/* keep DEFECTS fallback */});
  }, []);


  const [newDefect, setNewDefect] = useState({
    taskId: `T00${defectsList.length + 1}`,
    corridor: 'STN04-STN05',
    corridorName: 'Narayanpur — Kishanganj',
    department: 'Track',
    title: '',
    description: '',
    urgency: 4,
    overdueDays: 0,
    estimatedHours: 1.5,
    status: 'Unscheduled',
    linesAffected: 'UP-MAIN',
    speedRestriction: '30 KM/H PSR',
  });

  const handleCreateDefect = (e) => {
    e.preventDefault();
    if (!newDefect.title) return;
    setDefectsList([newDefect, ...defectsList]);
    setShowNewModal(false);
    setToast(`Defect ${newDefect.taskId} logged`);
    setTimeout(() => setToast(null), 3000);
  };

  const filteredDefects = useMemo(() => {
    return defectsList
      .filter((d) => {
        const matchesSearch =
          d.taskId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.corridor.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDept = selectedDept === 'ALL' || d.department === selectedDept;
        const matchesStatus =
          selectedStatus === 'ALL' ||
          (selectedStatus === 'Overdue' && d.overdueDays > 0) ||
          d.status.toLowerCase() === selectedStatus.toLowerCase();
        return matchesSearch && matchesDept && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'urgency-desc') return b.urgency - a.urgency;
        if (sortBy === 'overdue-desc') return b.overdueDays - a.overdueDays;
        return a.estimatedHours - b.estimatedHours;
      });
  }, [defectsList, searchTerm, selectedDept, selectedStatus, sortBy]);

  const totalCount = defectsList.length;
  const trackCount = defectsList.filter((d) => d.department === 'Track').length;
  const signalCount = defectsList.filter((d) => d.department === 'Signal').length;
  const powerCount = defectsList.filter((d) => d.department === 'Power').length;
  const critCount = defectsList.filter((d) => d.urgency === 5).length;

  return (
    <main className="max-w-[1720px] mx-auto w-full px-4 lg:px-8 py-4 flex flex-col gap-4 flex-1">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F172A] text-white border-2 border-[#10B981] px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 font-mono text-xs animate-bounce">
          <span className="material-symbols-outlined text-[#10B981] text-[18px]">verified</span>
          <div>
            <div className="font-bold text-emerald-400 text-[10px] uppercase">MAINTENANCE UPDATE</div>
            <div className="text-slate-300 text-[11px]">{toast}</div>
          </div>
        </div>
      )}

      {/* Title Bar & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#ea580c] rounded-xs"></span>
            <h1 className="font-sans text-xl md:text-2xl font-black text-slate-900 tracking-tight uppercase">
              Defect Registry &amp; Maintenance
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowNewModal(true)}
              className="bg-[#ea580c] hover:bg-orange-700 text-white px-3 py-1.5 flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase rounded-lg shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">add_alert</span>
              Log Defect
            </button>
          </div>
        </div>

        {/* 5 KPI Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="flex flex-col font-mono leading-tight">
              <span className="text-[9px] text-slate-500 uppercase font-semibold">TOTAL DEFECTS</span>
              <span className="text-2xl font-bold text-slate-900 mt-0.5">{totalCount}</span>
            </div>
            <span className="material-symbols-outlined text-slate-400 text-[20px]">assignment_late</span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="flex flex-col font-mono leading-tight">
              <span className="text-[9px] text-slate-500 uppercase font-semibold">TRACK (P-WAY)</span>
              <span className="text-2xl font-bold text-orange-600 mt-0.5">{trackCount}</span>
            </div>
            <span className="material-symbols-outlined text-orange-500 text-[20px]">railway_alert</span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="flex flex-col font-mono leading-tight">
              <span className="text-[9px] text-slate-500 uppercase font-semibold">SIGNAL (S&amp;T)</span>
              <span className="text-2xl font-bold text-blue-600 mt-0.5">{signalCount}</span>
            </div>
            <span className="material-symbols-outlined text-blue-500 text-[20px]">cell_tower</span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="flex flex-col font-mono leading-tight">
              <span className="text-[9px] text-slate-500 uppercase font-semibold">POWER (OHE)</span>
              <span className="text-2xl font-bold text-emerald-600 mt-0.5">{powerCount}</span>
            </div>
            <span className="material-symbols-outlined text-emerald-500 text-[20px]">electric_bolt</span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-red-200 shadow-xs flex items-center justify-between col-span-2 md:col-span-1 bg-red-50/40">
            <div className="flex flex-col font-mono leading-tight">
              <span className="text-[9px] text-red-600 uppercase font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></span>
                CRITICAL L5
              </span>
              <span className="text-2xl font-bold text-red-600 mt-0.5">{critCount}</span>
            </div>
            <span className="material-symbols-outlined text-red-600 text-[20px]">emergency</span>
          </div>
        </div>

        {/* 25-Station Visual Corridor Bar */}
        <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs flex flex-col gap-1.5">
          <div className="flex items-center justify-between font-mono text-[10px] text-slate-500">
            <span className="font-bold text-slate-800 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-emerald-600">timeline</span>
              STN01 ➔ STN25 POSSESSION OCCUPANCY
            </span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-red-600 rounded-xs"></span> L5 Block</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-orange-500 rounded-xs"></span> L4 PSR</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-slate-200 rounded-xs"></span> Clear</span>
            </div>
          </div>

          <div className="w-full overflow-x-auto py-0.5">
            <div className="min-w-[900px] flex items-center gap-1">
              {STATIONS.slice(0, -1).map((stn, i) => {
                const corrId = `${stn.id}-${STATIONS[i + 1].id}`;
                const defect = defectsList.find((d) => d.corridor === corrId);
                let colorClass = 'bg-slate-100 hover:bg-slate-200 text-slate-600';
                if (defect?.urgency === 5) colorClass = 'bg-red-600 text-white animate-pulse';
                else if (defect?.urgency === 4) colorClass = 'bg-orange-500 text-white';
                else if (defect) colorClass = 'bg-emerald-500 text-white';

                return (
                  <button
                    key={corrId}
                    onClick={() => defect && setSelectedDefect(defect)}
                    title={`${corrId}: ${defect ? defect.title : 'Nominal'}`}
                    className={`flex-1 h-6 rounded flex items-center justify-center font-mono text-[8px] font-bold cursor-pointer transition-all ${colorClass}`}
                  >
                    {stn.id}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-2 font-mono text-[11px]">
          <div className="relative flex-1 min-w-[200px]">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[16px]">
              search
            </span>
            <input
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1 text-slate-800 text-xs focus:outline-none focus:border-orange-500"
              placeholder="Search defects or stations..."
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-800 font-bold uppercase cursor-pointer"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
            >
              <option value="ALL">All Depts</option>
              <option value="Track">Track</option>
              <option value="Signal">Signal</option>
              <option value="Power">Power</option>
            </select>

            <select
              className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-orange-600 font-bold uppercase cursor-pointer"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="urgency-desc">Urgency (High → Low)</option>
              <option value="overdue-desc">Overdue Days</option>
            </select>
          </div>
        </div>

        {/* Compact Defect Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase">
                <tr>
                  <th className="py-2.5 px-3">ID</th>
                  <th className="py-2.5 px-3">CORRIDOR</th>
                  <th className="py-2.5 px-3">DEPT</th>
                  <th className="py-2.5 px-3">TITLE / RESTRICTION</th>
                  <th className="py-2.5 px-3 text-center">SEVERITY</th>
                  <th className="py-2.5 px-3 text-center">OVERDUE</th>
                  <th className="py-2.5 px-3 text-center">WINDOW</th>
                  <th className="py-2.5 px-3 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDefects.map((d) => (
                  <tr
                    key={d.taskId}
                    onClick={() => setSelectedDefect(d)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                  >
                    <td className="py-2.5 px-3 font-bold text-slate-900">
                      <span className="flex items-center gap-1.5">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            d.urgency === 5 ? 'bg-red-600 animate-ping' : d.urgency === 4 ? 'bg-orange-500' : 'bg-emerald-500'
                          }`}
                        ></span>
                        {d.taskId}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-800">{d.corridor}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${
                          d.department === 'Track'
                            ? 'bg-orange-50 text-orange-700 border border-orange-200'
                            : d.department === 'Signal'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {d.department}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 max-w-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 truncate font-sans text-xs">{d.title}</span>
                        {d.speedRestriction && d.speedRestriction !== 'NONE' && (
                          <span className="px-1.5 py-0.2 bg-red-50 text-red-700 text-[9px] font-bold rounded shrink-0">
                            {d.speedRestriction.split(' ')[0]} {d.speedRestriction.split(' ')[1]}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <div className="inline-flex items-center gap-1">
                        <span className={`w-2 h-2 rounded-full ${d.urgency >= 4 ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
                        <span className="font-black text-[10px]">L{d.urgency}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {d.overdueDays > 0 ? (
                        <span className="text-red-600 font-bold text-[10px]">+{d.overdueDays}d</span>
                      ) : (
                        <span className="text-slate-400 text-[10px]">0d</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-slate-700">{d.estimatedHours}h</td>
                    <td className="py-2.5 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <Link
                        to="/ai-block-planner"
                        className="px-2 py-1 bg-white hover:bg-slate-50 text-orange-600 border border-orange-300 rounded font-bold text-[9px] uppercase shadow-xs transition-colors"
                      >
                        Bundle
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      {/* Defect Modal */}
      {selectedDefect && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 max-w-md w-full shadow-2xl space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-orange-100 text-orange-800 rounded font-bold">{selectedDefect.taskId}</span>
                <span className="text-slate-500 font-bold">{selectedDefect.corridor}</span>
              </div>
              <button onClick={() => setSelectedDefect(null)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div>
              <h3 className="font-heading font-bold text-sm text-slate-900">{selectedDefect.title}</h3>
              <p className="text-slate-600 mt-1 leading-relaxed text-[11px]">{selectedDefect.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-lg text-[11px]">
              <div><span className="text-slate-400 text-[9px]">DEPT:</span> <div className="font-bold">{selectedDefect.department}</div></div>
              <div><span className="text-slate-400 text-[9px]">SEVERITY:</span> <div className="font-bold text-red-600">Level {selectedDefect.urgency}</div></div>
              <div><span className="text-slate-400 text-[9px]">OVERDUE:</span> <div className="font-bold">{selectedDefect.overdueDays}d</div></div>
              <div><span className="text-slate-400 text-[9px]">WINDOW:</span> <div className="font-bold">{selectedDefect.estimatedHours}h</div></div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button onClick={() => setSelectedDefect(null)} className="px-3 py-1.5 bg-slate-100 rounded text-[10px] uppercase cursor-pointer">
                Close
              </button>
              <Link to="/ai-block-planner" className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded text-[10px] uppercase font-bold">
                Auto-Bundle in AI
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Log Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleCreateDefect} className="bg-white rounded-2xl border border-slate-200 p-5 max-w-md w-full shadow-2xl space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-heading font-bold text-sm text-slate-900 uppercase">Log New Defect</h3>
              <button type="button" onClick={() => setShowNewModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="space-y-2.5">
              <input
                required
                type="text"
                placeholder="Defect summary..."
                value={newDefect.title}
                onChange={(e) => setNewDefect({ ...newDefect, title: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-slate-900"
              />

              <div className="grid grid-cols-2 gap-2">
                <select
                  value={newDefect.department}
                  onChange={(e) => setNewDefect({ ...newDefect, department: e.target.value })}
                  className="bg-slate-50 border border-slate-300 rounded px-2 py-1.5"
                >
                  <option value="Track">Track</option>
                  <option value="Signal">Signal</option>
                  <option value="Power">Power</option>
                </select>

                <select
                  value={newDefect.corridor}
                  onChange={(e) => setNewDefect({ ...newDefect, corridor: e.target.value })}
                  className="bg-slate-50 border border-slate-300 rounded px-2 py-1.5"
                >
                  {STATIONS.slice(0, 5).map((s, idx) => (
                    <option key={s.id} value={`${s.id}-${STATIONS[idx + 1].id}`}>{s.id}-{STATIONS[idx + 1].id}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button type="button" onClick={() => setShowNewModal(false)} className="px-3 py-1.5 bg-slate-100 rounded text-[10px] uppercase">
                Cancel
              </button>
              <button type="submit" className="px-3 py-1.5 bg-[#ea580c] text-white font-bold rounded text-[10px] uppercase">
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
