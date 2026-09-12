import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/AppShell';
import Login from './pages/Login';
import CommandCentre from './pages/CommandCentre';
import ControlChart from './pages/ControlChart';
import AIBlockPlanner from './pages/AIBlockPlanner';
import Maintenance from './pages/Maintenance';
import WeeklyPlanner from './pages/WeeklyPlanner';
import AlertsConflicts from './pages/AlertsConflicts';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Full-Page Login */}
        <Route path="/" element={<Login />} />

        {/* Console Layout with AppShell (Header + Centered Floating Navbar + Footer) */}
        <Route element={<AppShell />}>
          <Route path="/command-centre" element={<CommandCentre />} />
          <Route path="/control-chart" element={<ControlChart />} />
          <Route path="/ai-block-planner" element={<AIBlockPlanner />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/weekly-planner" element={<WeeklyPlanner />} />
          <Route path="/alerts-conflicts" element={<AlertsConflicts />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
