import { Search, Bell, ChevronDown, Building2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { NavItem } from '../types';

const pageTitles: Record<NavItem, { title: string; subtitle: string }> = {
  landing: { title: 'Apex Health Care', subtitle: 'One calm workspace for Indian hospital teams' },
  dashboard: { title: 'Dashboard', subtitle: 'Today\'s care flow, operations, billing, and stock health.' },
  patients: { title: 'Patient Management', subtitle: 'Register, search, and maintain patient records' },
  appointments: { title: 'Appointments', subtitle: 'Schedule and track doctor consultations' },
  'medical-records': { title: 'Medical Records', subtitle: 'Review clinical history, labs, prescriptions, and vitals' },
  billing: { title: 'Billing & Payments', subtitle: 'Manage INR invoices, insurance, GST, and collections' },
  pharmacy: { title: 'Pharmacy Management', subtitle: 'Track medicine inventory, batches, and orders' },
  reports: { title: 'Reports & Analytics', subtitle: 'Operational insights for care and finance teams' },
};

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
  const activeNav = getNavFromPath(location.pathname);
  const { title, subtitle } = pageTitles[activeNav];
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
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
            aria-label="Search patients and doctors"
            placeholder="Search patients, appointments, invoices..."
            autoComplete="off"
            className="w-72 rounded-lg border border-slate-700/70 bg-slate-900/60 py-2 pl-9 pr-4 text-sm text-slate-100 placeholder:text-slate-500 focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
          />
        </div>

        <span className="hidden rounded-lg border border-slate-700/70 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-400 xl:block">
          {dateStr}
        </span>

        <button aria-label="Current branch hospital" className="hidden items-center gap-2 rounded-lg border border-slate-700/70 bg-slate-900/60 px-3 py-2 text-left text-xs text-slate-300 lg:flex">
          <Building2 className="h-4 w-4 text-teal-300" />
          <span className="max-w-40 truncate">Bengaluru, Karnataka</span>
        </button>

        <button aria-label="View notifications" className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700/70 bg-slate-900/60 transition-colors hover:bg-slate-800">
          <Bell className="w-4 h-4 text-slate-300" aria-hidden />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full border border-[#071214] bg-teal-400" aria-hidden />
          <span className="sr-only">3 new notifications</span>
        </button>

        <button aria-haspopup="true" aria-expanded="false" aria-controls="user-menu" className="flex items-center gap-2 rounded-lg border border-slate-700/70 bg-slate-900/60 py-1.5 pl-1.5 pr-3 transition-colors hover:bg-slate-800">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-teal-500/20 text-xs font-bold text-teal-200">
            RS
          </div>
          <span className="hidden text-sm font-semibold text-slate-200 md:block">Admin</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>
      </div>
    </header>
  );
}
