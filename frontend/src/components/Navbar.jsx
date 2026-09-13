import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  const navItems = [
    { name: 'Command Centre', path: '/command-centre', icon: 'dashboard' },
    { name: 'Control Chart', path: '/control-chart', icon: 'schema' },
    { name: 'AI Block Planner', path: '/ai-block-planner', icon: 'bolt' },
    { name: 'Maintenance', path: '/maintenance', icon: 'build' },
    { name: 'Weekly/Monthly Planner', path: '/weekly-planner', icon: 'calendar_month' },
    { name: 'Alerts & Conflicts', path: '/alerts-conflicts', icon: 'warning', alert: true },
  ];

  return (
    <div className="py-2.5 flex justify-center items-center">
      <nav className="inline-flex p-1 bg-white rounded-2xl border border-[#CBD5E1] shadow-sm gap-1 max-w-full overflow-x-auto no-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `px-3.5 py-1.5 rounded-xl font-mono text-[12px] tracking-wider uppercase flex items-center gap-1.5 transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-[#EA580C] text-white font-bold shadow-sm'
                  : item.alert
                  ? 'text-[#475569] hover:text-[#DC2626] hover:bg-[#F8FAFC] font-semibold'
                  : 'text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC] font-semibold'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`material-symbols-outlined text-[17px] ${
                    isActive
                      ? 'text-white'
                      : item.alert
                      ? 'text-[#DC2626]'
                      : 'text-[#64748B]'
                  }`}
                >
                  {item.icon}
                </span>
                <span>{item.name}</span>
                {item.alert && !isActive && (
                  <span className="w-2 h-2 rounded-full bg-[#DC2626] animate-ping ml-0.5"></span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
