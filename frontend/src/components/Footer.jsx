import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-[#E2E8F0] py-3 text-[#64748B] font-mono text-[11px] mt-auto">
      <div className="max-w-[1720px] mx-auto px-4 lg:px-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="font-bold text-[#0F172A]">BOARD BD-A</span>
          <span className="text-[#CBD5E1]">|</span>
          <span className="text-slate-700 font-semibold">SECTION: STN01 (DEVGARH) ➔ STN25 (RATLAM JN)</span>
          <span className="text-[#CBD5E1]">|</span>
          <span>SPAN: 202 KM (25 STATIONS)</span>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <span>CONTROLLER: <strong className="text-[#0F172A]">CTRL01 (A. SHARMA)</strong></span>
          <span className="text-[#CBD5E1]">|</span>
          <span>SHIFT: 06:00–14:00 IST</span>
          <span className="text-[#CBD5E1]">|</span>
          <span className="text-slate-700 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            CONFLICT DETECTION BETA
          </span>
        </div>
      </div>
    </footer>
  );
}
