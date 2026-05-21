import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import Patients from './pages/Patients';
import Appointments from './pages/Appointments';
import MedicalRecords from './pages/MedicalRecords';
import Billing from './pages/Billing';
import Pharmacy from './pages/Pharmacy';
import Reports from './pages/Reports';
import { NavItem } from './types';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';

export default function App() {
  const [activeNav, setActiveNav] = useState<NavItem>('landing');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const pathByNav: Record<NavItem, string> = {
    landing: '/',
    dashboard: '/dashboard',
    patients: '/patients',
    appointments: '/appointments',
    'medical-records': '/medical-records',
    billing: '/billing',
    pharmacy: '/pharmacy',
    reports: '/reports',
  };

  function navFromPath(pathname: string): NavItem {
    if (pathname.startsWith('/patients')) return 'patients';
    if (pathname.startsWith('/appointments')) return 'appointments';
    if (pathname.startsWith('/medical-records')) return 'medical-records';
    if (pathname.startsWith('/billing')) return 'billing';
    if (pathname.startsWith('/pharmacy')) return 'pharmacy';
    if (pathname.startsWith('/reports')) return 'reports';
    if (pathname === '/' || pathname.startsWith('/landing')) return 'landing';
    return 'dashboard';
  }

  useEffect(() => {
    setActiveNav(navFromPath(location.pathname));
  }, [location.pathname]);

  const setNav = (nav: NavItem) => {
    setActiveNav(nav);
    const to = pathByNav[nav] ?? '/dashboard';
    navigate(to);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Sidebar
        activeNav={activeNav}
        setActiveNav={setNav}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />
      <div
        className="flex-1 flex flex-col min-h-screen overflow-hidden transition-all duration-300"
        style={{ marginLeft: sidebarCollapsed ? '80px' : '256px' }}
      >
        <Header activeNav={activeNav} />
        <main id="main" tabIndex={-1} className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Landing onGetStarted={() => setNav('dashboard')} />} />
            <Route path="/landing" element={<Landing onGetStarted={() => setNav('dashboard')} />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/medical-records" element={<MedicalRecords />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/pharmacy" element={<Pharmacy />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
