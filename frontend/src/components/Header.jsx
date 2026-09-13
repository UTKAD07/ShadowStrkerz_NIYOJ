import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hrs = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      const secs = String(now.getSeconds()).padStart(2, '0');
      setTime(`${hrs}:${mins}:${secs}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-white border-b border-[#E2E8F0]">
      <div className="max-w-[1720px] mx-auto px-4 lg:px-8">
        <div className="py-2 px-2 flex items-center justify-between gap-6 border-b border-[#E2E8F0] w-full whitespace-nowrap overflow-x-auto no-scrollbar">
          {/* Brand Logo & Name */}
          <Link to="/command-centre" className="flex items-center gap-2.5 shrink-0 hover:opacity-90 transition-opacity">
            <div className="w-9 h-9 rounded-xl border border-[#EA580C]/40 bg-[#FFF7ED] flex items-center justify-center p-1 shadow-sm">
              <svg className="w-5 h-5 text-[#EA580C]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"></circle>
                <polygon points="12 5 19 17 5 17"></polygon>
                <line x1="8" x2="16" y1="19" y2="19"></line>
                <line x1="10" x2="14" y1="21" y2="21"></line>
                <circle cx="12" cy="13" fill="currentColor" r="1.5"></circle>
              </svg>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-black text-[17px] tracking-tight text-[#0F172A]">IR-BMS</span>
              <span className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 text-slate-700 font-mono text-[9px] font-bold uppercase tracking-wider rounded">BETA</span>
              <span className="text-slate-300 font-light">|</span>
              <span className="font-mono text-[10px] text-slate-500 font-bold uppercase tracking-wider">NZ</span>
            </div>
          </Link>

          {/* Visual Controller & Corridor Pill */}
          <div className="hidden xl:flex items-center bg-[#F1F5F9]/80 px-3.5 py-1 rounded-full border border-[#CBD5E1] shadow-inner gap-2.5 text-[11px] font-mono shrink-0">
            <div className="flex items-center gap-1.5 text-[#0F172A] font-bold">
              <span className="material-symbols-outlined text-[15px] text-slate-500">badge</span>
              <span>A. Sharma</span>
              <span className="px-1.5 py-0.2 bg-white text-slate-600 rounded text-[9px] border border-slate-200">BD-A</span>
            </div>
            <span className="text-slate-300">/</span>
            <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
              <span className="material-symbols-outlined text-[15px] text-orange-600">alt_route</span>
              <span>STN01</span>
              <span className="text-slate-400">➔</span>
              <span>STN25</span>
              <span className="text-[10px] text-slate-500 font-normal">(202 km)</span>
            </div>
            <span className="text-slate-300">/</span>
            <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 border border-slate-300 rounded-full text-slate-700 font-bold text-[9px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              CONFLICT ENGINE
            </div>
          </div>

          {/* Telemetry & Time status */}
          <div className="flex items-center gap-3 shrink-0 font-mono text-[11px]">
            <div className="flex items-center gap-2.5 text-right">
              <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-50 border border-emerald-200 rounded text-[#059669] text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
                NOMINAL
              </div>
              <span className="text-slate-300">|</span>
              <div className="flex items-baseline gap-1">
                <span className="font-extrabold text-[#EA580C] text-[13px] tracking-wider">{time || '03:24:18'}</span>
                <span className="text-slate-400 text-[9px] font-bold">IST</span>
              </div>
            </div>
            <Link to="/" title="Logout / Switch Profile" className="w-8 h-8 rounded-full bg-[#0F172A] text-white flex items-center justify-center shadow-xs shrink-0 hover:bg-[#1E293B] transition-colors">
              <span className="material-symbols-outlined text-[17px]">person</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
