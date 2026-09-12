import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [controllerId, setControllerId] = useState('IR-CTRL-A-SHARMA-08');
  const [clock, setClock] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hrs = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      const secs = String(now.getSeconds()).padStart(2, '0');
      setClock(`${hrs}:${mins}:${secs} IST`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/command-centre');
  };

  return (
    <div className="bg-[#F8FAFC] text-slate-800 font-sans min-h-screen flex flex-col justify-between selection:bg-[#EA580C] selection:text-white relative overflow-hidden">
      {/* Light Precision Engineering Grid Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-70 pointer-events-none"></div>
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Minimalist Top Classification Bar */}
      <div className="w-full px-8 py-3.5 border-b border-slate-200/90 flex items-center justify-between z-10 backdrop-blur-md bg-white/80 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-7 h-7 flex items-center justify-center p-0.5 rounded-full bg-orange-50 border border-orange-200/60 shadow-xs">
            <img
              alt="Indian Railways Crest"
              className="w-6 h-6 object-contain"
              src="https://lh3.googleusercontent.com/aida/AEtjO1Uv-WNL3-wzrhXjaO4L58TtecRpMS_mzlVGIKbi-Q7dUZQ9v_aQ3JE9mYRTiM5uQ3LfbAuhq6wqd7pTgOLz_aPkeg36oPOr9UqDvxLOrVMY1II3fuLO23ultN-TVoZTcQmobsWez7czq90mcMGhhg7oI57Shih-i3UWEnxQogX2tDC8oROERqVD44JrAz8wxQVGuTYD26KC_nwlyw9tDH9OhFpCXUjGzYEZAdaGVwJctSft0goS1qMoklSq"
            />
          </div>
          <div className="flex items-center space-x-2 font-mono text-xs">
            <span className="text-[#EA580C] font-bold tracking-wider">INDIAN RAILWAYS</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 font-semibold tracking-wide">CENTRAL DISPATCH CONSOLE</span>
          </div>
        </div>

        <div className="flex items-center space-x-4 font-mono text-xs text-slate-600">
          <span className="inline-flex items-center px-2.5 py-1 rounded bg-slate-100 border border-slate-300 text-slate-700 font-medium shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1.5 shadow-sm"></span>
            DISPATCH CONSOLE BETA
          </span>
          <span className="text-slate-400 hidden sm:inline">|</span>
          <span className="text-slate-500 hidden md:inline">ZONE: NORTHERN RAILWAY</span>
          <span className="text-slate-400 hidden md:inline">|</span>
          <span className="text-slate-900 font-semibold">{clock || '03:41:09 IST'}</span>
        </div>
      </div>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center px-4 z-10 my-8">
        <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-xl p-8 shadow-xl shadow-slate-200/60 relative">
          {/* Top orange accent precision indicator bar */}
          <div className="absolute -top-[1px] left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#EA580C] to-transparent"></div>

          {/* Header Section */}
          <div className="mb-8 text-center">
            <div className="inline-flex p-3 rounded-2xl bg-orange-50/70 border border-orange-200/80 mb-4 shadow-sm ring-4 ring-orange-50/40">
              <img
                alt="BMS Crest"
                className="w-11 h-11 object-contain"
                src="https://lh3.googleusercontent.com/aida/AEtjO1Uv-WNL3-wzrhXjaO4L58TtecRpMS_mzlVGIKbi-Q7dUZQ9v_aQ3JE9mYRTiM5uQ3LfbAuhq6wqd7pTgOLz_aPkeg36oPOr9UqDvxLOrVMY1II3fuLO23ultN-TVoZTcQmobsWez7czq90mcMGhhg7oI57Shih-i3UWEnxQogX2tDC8oROERqVD44JrAz8wxQVGuTYD26KC_nwlyw9tDH9OhFpCXUjGzYEZAdaGVwJctSft0goS1qMoklSq"
              />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center justify-center space-x-2">
              <span>Railway Block Management System</span>
            </h1>
            <p className="font-mono text-[11px] text-slate-500 mt-2 tracking-wider uppercase font-medium">
              CONFLICT DETECTION & CORRIDOR DISPATCH STATION
            </p>
          </div>

          {/* Authentication Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Controller ID Field */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-700" htmlFor="controller-id">
                  Controller ID
                </label>
                <span className="text-[11px] font-mono text-slate-400 font-medium">STN-CTRLR-AUTH</span>
              </div>
              <div className="relative">
                <input
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 text-slate-900 font-mono text-sm placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#EA580C] focus:ring-2 focus:ring-[#EA580C]/20 transition-all shadow-xs"
                  id="controller-id"
                  name="controllerId"
                  placeholder="e.g. IR-NDLS-7842"
                  required
                  type="text"
                  value={controllerId}
                  onChange={(e) => setControllerId(e.target.value)}
                />
                <div className="absolute right-3.5 top-3.5 text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                </div>
              </div>
              <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>Jurisdiction: Section STN01–STN25</span>
                <span className="text-emerald-700 font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> SmartCard Ready
                </span>
              </div>
            </div>

            {/* Visual Security Trust Badges */}
            <div className="grid grid-cols-3 gap-2 py-0.5">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 flex flex-col items-center text-center">
                <span className="material-symbols-outlined text-emerald-600 text-[18px]">verified_user</span>
                <span className="font-mono text-[9px] font-bold text-slate-800 uppercase mt-0.5">AUDIT TRAIL</span>
                <span className="font-mono text-[8px] text-slate-400">LEDGER LOGGED</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 flex flex-col items-center text-center">
                <span className="material-symbols-outlined text-orange-600 text-[18px]">shield</span>
                <span className="font-mono text-[9px] font-bold text-slate-800 uppercase mt-0.5">CONFLICT AI</span>
                <span className="font-mono text-[8px] text-slate-400">FAIL-SAFE LINK</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 flex flex-col items-center text-center">
                <span className="material-symbols-outlined text-blue-600 text-[18px]">badge</span>
                <span className="font-mono text-[9px] font-bold text-slate-800 uppercase mt-0.5">SMARTCARD</span>
                <span className="font-mono text-[8px] text-slate-400">PKI TOKEN READY</span>
              </div>
            </div>

            {/* Log in Button */}
            <button
              className="w-full bg-[#EA580C] hover:bg-[#C2410C] text-white font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center space-x-2 shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/30 text-sm tracking-wide group cursor-pointer"
              type="submit"
            >
              <span>LOG IN TO DISPATCH CONSOLE</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
            </button>
          </form>

          {/* Terminal Diagnostics */}
          <div className="mt-6 pt-4 border-t border-slate-200/90 flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span>BOARD: SECTION A</span>
            <span className="text-slate-700 font-medium">IR-BMS DISPATCH CORE</span>
            <span>LATENCY: 4ms</span>
          </div>
        </div>
      </main>

      {/* Control Room Footer Classification */}
      <footer className="w-full px-8 py-3 border-t border-slate-200/90 text-center font-mono text-[11px] text-slate-500 bg-white/80 backdrop-blur-sm z-10 flex flex-col sm:flex-row items-center justify-between">
        <div>INDIAN RAILWAYS CENTRE FOR RAILWAY INFORMATION SYSTEMS (CRIS)</div>
        <div className="text-slate-400 mt-1 sm:mt-0">STATION CONTROL ROOM WORKSTATION // ENCRYPTED DEDICATED LEASED LINE</div>
      </footer>
    </div>
  );
}
