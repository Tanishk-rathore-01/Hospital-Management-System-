import { Suspense, lazy } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';

// Lazy load pages for code splitting
const Landing = lazy(() => import('./pages/Landing'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Patients = lazy(() => import('./pages/Patients'));
const Appointments = lazy(() => import('./pages/Appointments'));
const MedicalRecords = lazy(() => import('./pages/MedicalRecords'));
const Billing = lazy(() => import('./pages/Billing'));
const Pharmacy = lazy(() => import('./pages/Pharmacy'));
const Reports = lazy(() => import('./pages/Reports'));

// Simple loading skeleton
function PageLoader() {
  return (
    <div className="p-6 space-y-4">
      <div className="h-8 bg-slate-700 rounded w-1/3 animate-pulse" />
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-slate-700 rounded animate-pulse" />
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#071214] text-slate-100" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <div
        className={`flex min-h-screen min-w-0 flex-col overflow-hidden transition-all duration-300 ${
          sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        }`}
      >
        <Header />
        <main id="main" tabIndex={-1} className="flex-1 overflow-y-auto pb-24 lg:pb-0">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/landing" element={<Landing />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/patients" element={<Patients />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/medical-records" element={<MedicalRecords />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/pharmacy" element={<Pharmacy />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </div>
  );
}
