
import {
  LayoutDashboard, Users, Calendar, FileText, Receipt,
  Pill, BarChart3, ChevronLeft, ChevronRight, Heart, LogOut,
  Settings, Bell
} from 'lucide-react';
import { NavItem } from '../types';
import { NavLink } from 'react-router-dom';

interface SidebarProps {
  activeNav: NavItem;
  setActiveNav: (nav: NavItem) => void;
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}

const navItems = [
  { id: 'dashboard' as NavItem, label: 'Dashboard', icon: LayoutDashboard, color: 'text-blue-400', path: '/dashboard' },
  { id: 'patients' as NavItem, label: 'Patients', icon: Users, color: 'text-emerald-400', path: '/patients' },
  { id: 'appointments' as NavItem, label: 'Appointments', icon: Calendar, color: 'text-violet-400', path: '/appointments' },
  { id: 'medical-records' as NavItem, label: 'Medical Records', icon: FileText, color: 'text-cyan-400', path: '/medical-records' },
  { id: 'billing' as NavItem, label: 'Billing', icon: Receipt, color: 'text-amber-400', path: '/billing' },
  { id: 'pharmacy' as NavItem, label: 'Pharmacy', icon: Pill, color: 'text-rose-400', path: '/pharmacy' },
  { id: 'reports' as NavItem, label: 'Reports', icon: BarChart3, color: 'text-indigo-400', path: '/reports' },
];

export default function Sidebar({ activeNav, setActiveNav, collapsed, setCollapsed }: SidebarProps) {
  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-slate-900 text-white flex flex-col transition-all duration-300 z-50 shadow-2xl ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-slate-700/60 ${collapsed ? 'justify-center' : ''}`}>
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30">
          <Heart className="w-5 h-5 text-white fill-white" />
        </div>
        {!collapsed && (
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-tight">Apex Health Care</h1>
            <p className="text-slate-400 text-xs">Hospital Management</p>
          </div>
        )}
      </div>

      {/* Collapse Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="absolute -right-3 top-7 w-6 h-6 rounded-full bg-blue-500 hover:bg-blue-400 flex items-center justify-center shadow-lg transition-colors z-10"
      >
        {collapsed ? <ChevronRight className="w-3 h-3 text-white" /> : <ChevronLeft className="w-3 h-3 text-white" />}
      </button>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {!collapsed && (
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest px-3 mb-3">
            Main Menu
          </p>
        )}
        {navItems.map(({ id, label, icon: Icon, color, path }) => (
          <NavLink
            key={id}
            to={path}
            aria-label={label}
            title={collapsed ? label : ''}
            className={({ isActive }) => `w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative ${
              isActive
                ? 'bg-gradient-to-r from-blue-600/20 to-cyan-600/10 border border-blue-500/30'
                : 'hover:bg-slate-800/80'
            } ${collapsed ? 'justify-center' : ''}`}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-blue-400 to-cyan-400 rounded-r-full" aria-hidden />
                )}
                <Icon className={`w-5 h-5 shrink-0 transition-colors ${isActive ? 'text-blue-400' : `${color} opacity-60 group-hover:opacity-100`}`} aria-hidden />
                {!collapsed && (
                  <span className={`text-sm font-medium transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                    {label}
                  </span>
                )}
                {!collapsed && isActive && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-blue-400 animate-pulse" aria-hidden />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="px-3 py-4 border-t border-slate-700/60 space-y-1">
        {[
          { icon: Bell, label: 'Notifications', badge: '3' },
          { icon: Settings, label: 'Settings' },
          { icon: LogOut, label: 'Logout' },
        ].map(({ icon: Icon, label, badge }) => (
          <button
            key={label}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-all group ${
              collapsed ? 'justify-center' : ''
            }`}
            title={collapsed ? label : ''}
          >
            <div className="relative flex-shrink-0">
              <Icon className="w-5 h-5" />
              {badge && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-bold">
                  {badge}
                </span>
              )}
            </div>
            {!collapsed && <span className="text-sm font-medium">{label}</span>}
          </button>
        ))}

        {/* User Profile */}
        <div className={`flex items-center gap-3 mt-3 pt-3 border-t border-slate-700/60 px-1 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
            AH
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">Admin User</p>
              <p className="text-xs text-slate-400 truncate">admin@apexhealthcare.com</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
