import { Search, Bell, ChevronDown } from 'lucide-react';
import { NavItem } from '../types';

interface HeaderProps {
  activeNav: NavItem;
}

const pageTitles: Record<NavItem, { title: string; subtitle: string }> = {
  landing: { title: 'Welcome', subtitle: 'Apex Health Care dashboard and overview' },
  dashboard: { title: 'Dashboard', subtitle: 'Welcome back, Admin! Here\'s what\'s happening today.' },
  patients: { title: 'Patient Management', subtitle: 'Register and manage patient records' },
  appointments: { title: 'Appointments', subtitle: 'Schedule and track doctor appointments' },
  'medical-records': { title: 'Medical Records', subtitle: 'View and manage patient medical history' },
  billing: { title: 'Billing & Payments', subtitle: 'Manage invoices and financial transactions' },
  pharmacy: { title: 'Pharmacy Management', subtitle: 'Track medicine inventory and orders' },
  reports: { title: 'Reports & Analytics', subtitle: 'Insights and performance metrics' },
};

export default function Header({ activeNav }: HeaderProps) {
  const { title, subtitle } = pageTitles[activeNav];
  const now = new Date();
const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <header className="h-16 bg-white/80 backdrop-blur border-b border-slate-200/60 flex items-center justify-between px-6 sticky top-0 z-40">
      <div>
        <h2 className="text-lg font-bold text-slate-800">{title}</h2>
        <p className="text-xs text-slate-500">{subtitle}</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div role="search" aria-label="Site search" className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden />
          <input
            type="text"
            name="q"
            aria-label="Search patients and doctors"
            placeholder="Search patients, doctors..."
            autoComplete="off"
            className="w-64 pl-9 pr-4 py-2 text-sm bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white transition-all"
          />
        </div>

        {/* Date */}
        <span className="hidden lg:block text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
          {dateStr}
        </span>

        {/* Notifications */}
        <button aria-label="View notifications" className="relative w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
          <Bell className="w-4 h-4 text-slate-600" aria-hidden />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white" aria-hidden />
          <span className="sr-only">3 new notifications</span>
        </button>

        {/* User */}
        <button aria-haspopup="true" aria-expanded="false" aria-controls="user-menu" className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
            AD
          </div>
          <span className="text-sm font-semibold text-slate-700 hidden md:block">Admin</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>
      </div>
    </header>
  );
}
