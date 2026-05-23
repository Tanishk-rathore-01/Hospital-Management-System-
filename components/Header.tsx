import { useMemo, useState } from 'react';
import {
  Bell,
  Building2,
  CheckCircle,
  ChevronDown,
  LogOut,
  MapPin,
  Search,
  Settings,
  X,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { NavItem } from '../types';
import { doctors } from '../data/mockData';
import { useAppointments } from '../src/hooks/useAppointments';
import { useBills } from '../src/hooks/useBills';
import { useMedicalRecords } from '../src/hooks/useMedicalRecords';
import { useMedicines } from '../src/hooks/useMedicines';
import { usePatients } from '../src/hooks/usePatients';
import { useAuth } from '../src/auth/AuthContext';

const pageTitles: Record<NavItem, { title: string; subtitle: string }> = {
  landing: { title: 'Apex Health Care', subtitle: 'One calm workspace for Indian hospital teams' },
  dashboard: { title: 'Dashboard', subtitle: "Today's care flow, operations, billing, and stock health." },
  patients: { title: 'Patient Management', subtitle: 'Register, search, and maintain patient records' },
  appointments: { title: 'Appointments', subtitle: 'Schedule and track doctor consultations' },
  'medical-records': { title: 'Medical Records', subtitle: 'Review clinical history, labs, prescriptions, and vitals' },
  billing: { title: 'Billing & Payments', subtitle: 'Manage INR invoices, insurance, GST, and collections' },
  pharmacy: { title: 'Pharmacy Management', subtitle: 'Track medicine inventory, batches, and orders' },
  reports: { title: 'Reports & Analytics', subtitle: 'Operational insights for care and finance teams' },
};

const branches = [
  { city: 'Bengaluru, Karnataka', detail: 'Koramangala branch' },
  { city: 'Jaipur, Rajasthan', detail: 'Malviya Nagar branch' },
  { city: 'Delhi NCR', detail: 'Dwarka branch' },
];

const notifications = [
  { title: '3 OPD appointments need check-in', detail: 'Front desk queue for this morning' },
  { title: '2 medicine stock alerts', detail: 'Pharmacy review recommended today' },
  { title: 'Billing follow-up pending', detail: 'One overdue invoice requires attention' },
];

type HeaderPanel = 'notifications' | 'location' | 'user' | 'settings' | 'logout' | null;

function getNavFromPath(pathname: string): NavItem {
  if (pathname.startsWith('/patients')) return 'patients';
  if (pathname.startsWith('/appointments')) return 'appointments';
  if (pathname.startsWith('/medical-records')) return 'medical-records';
  if (pathname.startsWith('/billing')) return 'billing';
  if (pathname.startsWith('/pharmacy')) return 'pharmacy';
  if (pathname.startsWith('/reports')) return 'reports';
  if (pathname === '/' || pathname.startsWith('/landing')) return 'landing';
  return 'dashboard';
}

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { displayName, email, signOut } = useAuth();
  const { data: patients = [] } = usePatients();
  const { data: appointments = [] } = useAppointments();
  const { data: bills = [] } = useBills();
  const { data: medicalRecords = [] } = useMedicalRecords();
  const { data: medicines = [] } = useMedicines();
  const activeNav = getNavFromPath(location.pathname);
  const { title, subtitle } = pageTitles[activeNav];
  const [query, setQuery] = useState('');
  const [activePanel, setActivePanel] = useState<HeaderPanel>(null);
  const [selectedBranch, setSelectedBranch] = useState(branches[0]);
  const [authError, setAuthError] = useState('');
  const [notificationsRead, setNotificationsRead] = useState(false);
  const [workspaceSettings, setWorkspaceSettings] = useState({
    darkComfortMode: true,
    compactTableRows: true,
    lowStockReminders: true,
  });
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'AD';

  const searchIndex = useMemo(() => [
    ...patients.map((patient) => ({
      title: patient.name,
      meta: `${patient.id} | ${patient.phone} | ${patient.insurance}`,
      type: 'Patient',
      path: '/patients',
    })),
    ...doctors.map((doctor) => ({
      title: doctor.name,
      meta: `${doctor.specialization} | ${doctor.status}`,
      type: 'Doctor',
      path: '/appointments',
    })),
    ...appointments.map((appointment) => ({
      title: appointment.patientName,
      meta: `${appointment.id} | ${appointment.doctorName} | ${appointment.status}`,
      type: 'Appointment',
      path: '/appointments',
    })),
    ...medicalRecords.map((record) => ({
      title: record.patientName,
      meta: `${record.id} | ${record.diagnosis}`,
      type: 'Record',
      path: '/medical-records',
    })),
    ...bills.map((bill) => ({
      title: bill.patientName,
      meta: `${bill.id} | ${bill.status} | ${bill.paymentMethod}`,
      type: 'Bill',
      path: '/billing',
    })),
    ...medicines.map((medicine) => ({
      title: medicine.name,
      meta: `${medicine.genericName} | ${medicine.status}`,
      type: 'Medicine',
      path: '/pharmacy',
    })),
  ], [appointments, bills, medicalRecords, medicines, patients]);

  const searchResults = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];

    return searchIndex
      .filter((item) => `${item.title} ${item.meta} ${item.type}`.toLowerCase().includes(trimmed))
      .slice(0, 6);
  }, [query]);

  const togglePanel = (panel: HeaderPanel) => {
    setActivePanel((current) => (current === panel ? null : panel));
  };

  const openResult = (path: string) => {
    navigate(path);
    setQuery('');
    setActivePanel(null);
  };

  const openSettings = () => {
    setActivePanel('settings');
  };

  const openLogout = () => {
    setAuthError('');
    setActivePanel('logout');
  };

  const handleLogout = async () => {
    setAuthError('');
    try {
      await signOut();
      navigate('/login', { replace: true });
      setActivePanel(null);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Unable to log out');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 flex min-h-16 items-center justify-between gap-4 border-b border-slate-700/60 bg-[#071214]/86 px-4 py-3 backdrop-blur-xl sm:px-6">
        <div className="min-w-0">
          <h2 className="truncate text-base font-bold text-slate-100 sm:text-lg">{title}</h2>
          <p className="hidden text-xs text-slate-400 sm:block">{subtitle}</p>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div role="search" aria-label="Site search" className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden />
            <input
              type="text"
              name="q"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onInput={(event) => setQuery(event.currentTarget.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && searchResults[0]) {
                  openResult(searchResults[0].path);
                }
              }}
              aria-label="Search patients, doctors, appointments, bills, and medicines"
              placeholder="Search patients, appointments, invoices..."
              autoComplete="off"
              className="w-72 rounded-lg border border-slate-700/70 bg-slate-900/60 py-2 pl-9 pr-9 text-sm text-slate-100 placeholder:text-slate-500 focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-slate-500 hover:bg-slate-800 hover:text-slate-200"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}

            {query && (
              <div className="absolute right-0 top-11 z-50 w-96 overflow-hidden rounded-lg border border-slate-700/70 bg-[#0b171b] shadow-2xl">
                <div className="border-b border-slate-700/60 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Search results
                </div>
                {searchResults.length > 0 ? (
                  <div className="max-h-80 overflow-y-auto p-1.5">
                    {searchResults.map((item) => (
                      <button
                        key={`${item.type}-${item.title}-${item.meta}`}
                        type="button"
                        onClick={() => openResult(item.path)}
                        className="flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left hover:bg-slate-800/80"
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-semibold text-slate-100">{item.title}</span>
                          <span className="block truncate text-xs text-slate-500">{item.meta}</span>
                        </span>
                        <span className="rounded-md border border-teal-400/20 bg-teal-400/10 px-2 py-1 text-xs text-teal-200">
                          {item.type}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-5 text-sm text-slate-400">No matching record found.</div>
                )}
              </div>
            )}
          </div>

          <span className="hidden rounded-lg border border-slate-700/70 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-400 xl:block">
            {dateStr}
          </span>

          <div className="relative hidden lg:block">
            <button
              type="button"
              onClick={() => togglePanel('location')}
              aria-expanded={activePanel === 'location'}
              aria-label="Choose branch hospital"
              className="flex items-center gap-2 rounded-lg border border-slate-700/70 bg-slate-900/60 px-3 py-2 text-left text-xs text-slate-300 hover:bg-slate-800"
            >
              <Building2 className="h-4 w-4 text-teal-300" />
              <span className="max-w-40 truncate">{selectedBranch.city}</span>
            </button>
            {activePanel === 'location' && (
              <div className="absolute right-0 top-11 z-50 w-64 rounded-lg border border-slate-700/70 bg-[#0b171b] p-2 shadow-2xl">
                {branches.map((branch) => (
                  <button
                    key={branch.city}
                    type="button"
                    onClick={() => {
                      setSelectedBranch(branch);
                      setActivePanel(null);
                    }}
                    className="flex w-full items-start gap-3 rounded-md px-3 py-2 text-left hover:bg-slate-800/80"
                  >
                    <MapPin className="mt-0.5 h-4 w-4 text-teal-300" />
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-slate-100">{branch.city}</span>
                      <span className="block text-xs text-slate-500">{branch.detail}</span>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => togglePanel('notifications')}
              aria-expanded={activePanel === 'notifications'}
              aria-label="View notifications"
              className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700/70 bg-slate-900/60 transition-colors hover:bg-slate-800"
            >
              <Bell className="w-4 h-4 text-slate-300" aria-hidden />
              {!notificationsRead && <span className="absolute right-1 top-1 h-2 w-2 rounded-full border border-[#071214] bg-teal-400" aria-hidden />}
              <span className="sr-only">{notificationsRead ? 'No new notifications' : '3 new notifications'}</span>
            </button>
            {activePanel === 'notifications' && (
              <div className="absolute right-0 top-11 z-50 w-80 rounded-lg border border-slate-700/70 bg-[#0b171b] p-3 shadow-2xl">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-bold text-slate-100">Notifications</p>
                  <span className="rounded-md bg-teal-400/10 px-2 py-1 text-xs font-semibold text-teal-200">
                    {notificationsRead ? 'All read' : '3 new'}
                  </span>
                </div>
                <div className="space-y-2">
                  {notifications.map((notification) => (
                    <div key={notification.title} className="rounded-md border border-slate-700/60 bg-slate-900/50 p-3">
                      <p className="text-sm font-semibold text-slate-100">{notification.title}</p>
                      <p className="mt-1 text-xs text-slate-500">{notification.detail}</p>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setNotificationsRead(true);
                    setActivePanel(null);
                  }}
                  className="mt-3 w-full rounded-lg border border-teal-400/30 bg-teal-400/10 px-4 py-2 text-sm font-semibold text-teal-100 hover:bg-teal-400/15"
                >
                  Mark all as read
                </button>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => togglePanel('user')}
              aria-haspopup="true"
              aria-expanded={activePanel === 'user'}
              aria-controls="user-menu"
              className="flex items-center gap-2 rounded-lg border border-slate-700/70 bg-slate-900/60 py-1.5 pl-1.5 pr-2 transition-colors hover:bg-slate-800 sm:pr-3"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-teal-500/20 text-xs font-bold text-teal-200">
                {initials}
              </div>
              <span className="hidden max-w-24 truncate text-sm font-semibold text-slate-200 md:block">{displayName}</span>
              <ChevronDown className="hidden w-3 h-3 text-slate-400 sm:block" />
            </button>
            {activePanel === 'user' && (
              <div id="user-menu" className="absolute right-0 top-11 z-50 w-64 rounded-lg border border-slate-700/70 bg-[#0b171b] p-2 shadow-2xl">
                <div className="border-b border-slate-700/60 px-3 py-3">
                  <p className="text-sm font-bold text-slate-100">{displayName}</p>
                  <p className="text-xs text-slate-500">{email}</p>
                </div>
                <button
                  type="button"
                  onClick={openSettings}
                  className="mt-2 flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-slate-300 hover:bg-slate-800/80 hover:text-slate-100"
                >
                  <Settings className="h-4 w-4 text-teal-300" />
                  Settings
                </button>
                <button
                  type="button"
                  onClick={openLogout}
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-slate-300 hover:bg-slate-800/80 hover:text-slate-100"
                >
                  <LogOut className="h-4 w-4 text-rose-300" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {activePanel === 'settings' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-lg border border-slate-700/70 bg-[#0b171b] p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-slate-100">Workspace settings</p>
                <p className="text-sm text-slate-500">Quick preferences for this hospital desk.</p>
              </div>
              <button type="button" onClick={() => setActivePanel(null)} aria-label="Close settings" className="rounded-md p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-100">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3">
              {[
                ['darkComfortMode', 'Dark comfort mode'],
                ['compactTableRows', 'Compact table rows'],
                ['lowStockReminders', 'Low stock reminders'],
              ].map(([key, setting]) => {
                const settingKey = key as keyof typeof workspaceSettings;
                const enabled = workspaceSettings[settingKey];

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setWorkspaceSettings((current) => ({ ...current, [settingKey]: !enabled }))}
                    className="flex w-full items-center justify-between rounded-md border border-slate-700/60 bg-slate-900/50 px-3 py-2.5 text-left hover:bg-slate-800/80"
                  >
                    <span className="text-sm font-semibold text-slate-200">{setting}</span>
                    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold ${
                      enabled ? 'bg-emerald-400/10 text-emerald-200' : 'bg-slate-700/60 text-slate-300'
                    }`}>
                      <CheckCircle className="h-3 w-3" />
                      {enabled ? 'On' : 'Off'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activePanel === 'logout' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="w-full max-w-sm rounded-lg border border-slate-700/70 bg-[#0b171b] p-5 shadow-2xl">
            <p className="text-lg font-bold text-slate-100">Logout from this desk?</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              This will sign you out of Supabase and close the protected admin workspace.
            </p>
            {authError && (
              <p className="mt-3 rounded-md border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-sm text-rose-200">{authError}</p>
            )}
            <div className="mt-5 flex gap-3">
              <button type="button" onClick={() => setActivePanel(null)} className="flex-1 rounded-lg border border-slate-700/70 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-800">
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 rounded-lg bg-teal-500 px-4 py-2 text-sm font-semibold text-[#041012] hover:bg-teal-400"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
