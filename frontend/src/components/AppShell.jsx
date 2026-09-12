import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Navbar from './Navbar';
import Footer from './Footer';
import GridBackground from './GridBackground';

export default function AppShell() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A] selection:bg-[#EA580C] selection:text-white">
      {/* Top Header & Navbar Zone */}
      <header className="w-full bg-white border-b border-[#E2E8F0] shadow-sm sticky top-0 z-50">
        <Header />
        <Navbar />
      </header>

      {/* Main Page Content with Shared Grid-Mesh Background */}
      <GridBackground>
        <div className="max-w-[1720px] mx-auto px-4 lg:px-8 py-4 flex flex-col gap-4 flex-1">
          <Outlet />
        </div>
      </GridBackground>

      {/* Industrial Footer */}
      <Footer />
    </div>
  );
}
