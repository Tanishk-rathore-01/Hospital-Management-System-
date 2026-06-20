
import {
  LayoutDashboard, Users, Calendar, FileText, Receipt,
  Pill, BarChart3, ChevronLeft, ChevronRight, Heart, LogOut,
  Settings, Bell, ShieldCheck, X, CheckCircle
} from 'lucide-react';
import { NavItem } from '../types';
import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../src/auth/AuthContext';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}

const navItems = [
  { id: 'dashboard' as NavItem, label: 'Dashboard', icon: LayoutDashboard, color: 'text-blue-400', path: '/dashboard', roles: ['owner', 'admin', 'doctor', 'nurse', 'receptionist', 'pharmacist', 'billing_staff'] },
  { id: 'patients' as NavItem, label: 'Patients', icon: Users, color: 'text-emerald-400', path: '/patients', roles: ['owner', 'admin', 'doctor', 'nurse', 'receptionist'] },
  { id: 'appointments' as NavItem, label: 'Appointments', icon: Calendar, color: 'text-sky-400', path: '/appointments', roles: ['owner', 'admin', 'doctor', 'nurse', 'receptionist'] },
  { id: 'medical-records' as NavItem, label: 'Medical Records', icon: FileText, color: 'text-cyan-400', path: '/medical-records', roles: ['owner', 'admin', 'doctor', 'nurse'] },
  { id: 'billing' as NavItem, label: 'Billing', icon: Receipt, color: 'text-amber-400', path: '/billing', roles: ['owner', 'admin', 'receptionist', 'billing_staff'] },
  { id: 'pharmacy' as NavItem, label: 'Pharmacy', icon: Pill, color: 'text-rose-400', path: '/pharmacy', roles: ['owner', 'admin', 'pharmacist'] },
  { id: 'reports' as NavItem, label: 'Reports', icon: BarChart3, color: 'text-blue-400', path: '/reports', roles: ['owner', 'admin'] },
];

type SidebarPanel = 'notifications' | 'settings' | 'logout' | null;

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const navigate = useNavigate();
  const { displayName, email, signOut, role } = useAuth();
  const [activePanel, setActivePanel] = useState<SidebarPanel>(null);
  const [authError, setAuthError] = useState('');
  const [notificationsRead, setNotificationsRead] = useState(false);
  const [workspaceSettings, setWorkspaceSettings] = useState({
    darkComfortMode: true,
    compactNavigation: true,
    careAlerts: true,
  });

  const filteredNavItems = navItems.filter((item) => !role || item.roles.includes(role));

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
      <aside
        className={`fixed left-0 top-0 hidden h-screen flex-col border-r border-slate-700/60 bg-[#061012]/95 text-white shadow-2xl backdrop-blur-xl transition-all duration-300 lg:flex ${
          collapsed ? 'w-20' : 'w-64'
        } z-50`}
      >
        <div className={`flex items-center gap-3 px-4 py-5 border-b border-slate-700/60 ${collapsed ? 'justify-center' : ''}`}>
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-500/20">
            <Heart className="w-5 h-5 text-[#061012] fill-[#061012]" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-bold text-lg leading-tight tracking-tight">Apex Health Care</h1>
              <p className="text-slate-400 text-xs">Hospital Management</p>
            </div>
          )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="absolute -right-3 top-7 w-6 h-6 rounded-full bg-teal-500 hover:bg-teal-400 flex items-center justify-center shadow-lg transition-colors z-10"
        >
          {collapsed ? <ChevronRight className="w-3 h-3 text-[#061012]" /> : <ChevronLeft className="w-3 h-3 text-[#061012]" />}
        </button>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {!collapsed && (
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest px-3 mb-3">
              Core Modules
            </p>
          )}
          {filteredNavItems.map(({ id, label, icon: Icon, color, path }) => (
            <NavLink
              key={id}
              to={path}
              aria-label={label}
              title={collapsed ? label : ''}
              className={({ isActive }) => `w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group relative ${
                isActive
                  ? 'bg-teal-500/18 border border-teal-400/30 text-white'
                  : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
              } ${collapsed ? 'justify-center' : ''}`}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-teal-300 to-emerald-400 rounded-r-full" aria-hidden />
                  )}
                  <Icon className={`w-5 h-5 shrink-0 transition-colors ${isActive ? 'text-teal-300' : `${color} opacity-70 group-hover:opacity-100`}`} aria-hidden />
                  {!collapsed && (
                    <span className={`text-sm font-medium transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                      {label}
                    </span>
                  )}
                  {!collapsed && isActive && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-teal-300" aria-hidden />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-slate-700/60 space-y-1">
          {[
            { icon: Bell, label: 'Notifications', badge: notificationsRead ? undefined : '3', panel: 'notifications' as const },
            { icon: Settings, label: 'Settings', panel: 'settings' as const },
            { icon: LogOut, label: 'Logout', panel: 'logout' as const },
          ].map(({ icon: Icon, label, badge, panel }) => (
            <button
              key={label}
              type="button"
              onClick={() => {
                setAuthError('');
                setActivePanel((current) => (current === panel ? null : panel));
              }}
              aria-label={label}
              aria-expanded={activePanel === panel}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-all group ${
                collapsed ? 'justify-center' : ''
              }`}
              title={collapsed ? label : ''}
            >
              <div className="relative flex-shrink-0">
                <Icon className="w-5 h-5" />
                {badge && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full text-xs text-white flex items-center justify-center font-bold">
                    {badge}
                  </span>
                )}
              </div>
              {!collapsed && <span className="text-sm font-medium">{label}</span>}
            </button>
          ))}

          <div className={`flex items-center gap-3 mt-3 pt-3 border-t border-slate-700/60 px-1 ${collapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-400/20 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-4 h-4 text-teal-300" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">{displayName}</p>
                <p className="text-xs text-slate-400 truncate">{email}</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      <nav className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-5 gap-1 rounded-lg border border-slate-700/60 bg-[#071214]/95 p-1.5 shadow-2xl backdrop-blur-xl lg:hidden">
        {filteredNavItems.slice(0, 5).map(({ label, icon: Icon, path }) => (
          <NavLink
            key={label}
            to={path}
            aria-label={label}
            className={({ isActive }) => `flex min-h-12 items-center justify-center rounded-md ${
              isActive ? 'bg-teal-500/18 text-teal-200' : 'text-slate-400'
            }`}
          >
            <Icon className="h-5 w-5" />
          </NavLink>
        ))}
      </nav>

      {activePanel && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-lg border border-slate-700/70 bg-[#0b171b] p-5 text-slate-100 shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-bold">
                  {activePanel === 'notifications' && 'Notifications'}
                  {activePanel === 'settings' && 'Settings'}
                  {activePanel === 'logout' && 'Logout'}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {activePanel === 'notifications' && 'Important hospital desk updates.'}
                  {activePanel === 'settings' && 'Current workspace preferences.'}
                  {activePanel === 'logout' && 'Sign out of the protected workspace.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActivePanel(null)}
                aria-label="Close panel"
                className="rounded-md p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {activePanel === 'notifications' && (
              <div className="space-y-3">
                {[
                  ['Appointment desk', '3 patients are ready for check-in.'],
                  ['Pharmacy stock', 'Review low stock before evening rounds.'],
                  ['Billing', 'One overdue invoice needs follow-up.'],
                ].map(([title, detail]) => (
                  <div key={title} className="rounded-md border border-slate-700/60 bg-slate-900/50 p-3">
                    <p className="text-sm font-semibold text-slate-100">{title}</p>
                    <p className="mt-1 text-xs text-slate-500">{detail}</p>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setNotificationsRead(true);
                    setActivePanel(null);
                  }}
                  className="w-full rounded-lg border border-teal-400/30 bg-teal-400/10 px-4 py-2 text-sm font-semibold text-teal-100 hover:bg-teal-400/15"
                >
                  Mark all as read
                </button>
              </div>
            )}

            {activePanel === 'settings' && (
              <div className="space-y-3">
                {[
                  ['darkComfortMode', 'Dark comfort mode'],
                  ['compactNavigation', 'Compact navigation'],
                  ['careAlerts', 'Care alerts'],
                ].map(([key, label]) => {
                  const settingKey = key as keyof typeof workspaceSettings;
                  const enabled = workspaceSettings[settingKey];

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setWorkspaceSettings((current) => ({ ...current, [settingKey]: !enabled }))}
                      className="flex w-full items-center justify-between rounded-md border border-slate-700/60 bg-slate-900/50 px-3 py-2.5 text-left hover:bg-slate-800/80"
                    >
                      <span className="text-sm font-semibold text-slate-200">{label}</span>
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
            )}

            {activePanel === 'logout' && (
              <>
                <p className="text-sm leading-6 text-slate-400">
                  This will sign you out of Supabase and close the protected admin workspace.
                </p>
                {authError && (
                  <p className="mt-3 rounded-md border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-sm text-rose-200">{authError}</p>
                )}
                <div className="mt-5 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setActivePanel(null)}
                    className="flex-1 rounded-lg border border-slate-700/70 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-800"
                  >
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
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
