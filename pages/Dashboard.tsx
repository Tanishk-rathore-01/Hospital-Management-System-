import { Users, Calendar, DollarSign, Pill, TrendingUp, TrendingDown, Activity, Clock, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { patients, appointments, bills, medicines, revenueData, departmentData, appointmentTrendData } from '../data/mockData';
import { formatINR2, formatINR } from '../utils/money';


const stats = [
  {
    label: 'Total Patients', value: patients.length, icon: Users,
    change: '+12%', positive: true,
    bg: 'from-blue-500 to-blue-600',
    sub: `${patients.filter(p => p.status === 'Active').length} active`
  },
  {
    label: "Today's Appointments", value: appointments.filter(a => a.date === '2025-07-15').length, icon: Calendar,
    change: '+5%', positive: true,
    bg: 'from-violet-500 to-violet-600',
    sub: `${appointments.filter(a => a.status === 'In Progress').length} in progress`
  },
  {
    label: 'Monthly Revenue', value: formatINR(69800), icon: DollarSign,
    change: '-3.2%', positive: false,
    bg: 'from-emerald-500 to-emerald-600',
    sub: `vs ${formatINR(72100)} last month`
  },
  {
    label: 'Low Stock Medicines', value: medicines.filter(m => m.status === 'Low Stock' || m.status === 'Out of Stock').length, icon: Pill,
    change: '+2', positive: false,
    bg: 'from-rose-500 to-rose-600',
    sub: `${medicines.filter(m => m.status === 'Out of Stock').length} out of stock`
  },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs">
        <p className="font-semibold mb-1">{label}</p>
        {payload.map((entry: any) => (
          <p key={entry.name} style={{ color: entry.color }}>
            {entry.name}: {typeof entry.value === 'number' && entry.name.includes('Revenue') || entry.name.includes('Expense') 
              ? `₹${entry.value.toLocaleString('en-IN')}` : entry.value}

          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const pendingBills = bills.filter(b => b.status === 'Pending' || b.status === 'Overdue');
  const todayAppts = appointments.filter(a => a.date === '2025-07-15').slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map(({ label, value, icon: Icon, change, positive, bg, sub }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${bg} flex items-center justify-center shadow-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${positive ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'}`}>
                {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {change}
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-800 mb-1">{value}</p>
            <p className="text-sm font-medium text-slate-600">{label}</p>
            <p className="text-xs text-slate-400 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Revenue Chart */}
        <div className="xl:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-slate-800">Revenue vs Expenses</h3>
              <p className="text-xs text-slate-500">Last 7 months overview</p>
            </div>
            <span className="text-xs bg-blue-50 text-blue-600 font-semibold px-3 py-1 rounded-full">2025</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${Math.round(v / 1000)}k`} />

              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2.5} fill="url(#colorRevenue)" name="Revenue" dot={{ fill: '#3b82f6', r: 3 }} />
              <Area type="monotone" dataKey="expenses" stroke="#f43f5e" strokeWidth={2.5} fill="url(#colorExpenses)" name="Expenses" dot={{ fill: '#f43f5e', r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Department Distribution */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="mb-4">
            <h3 className="font-bold text-slate-800">Patients by Department</h3>
            <p className="text-xs text-slate-500">Current distribution</p>
          </div>
          <ResponsiveContainer width="100%" height={170}>
            <PieChart>
              <Pie data={departmentData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                {departmentData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, 'Share']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {departmentData.slice(0, 4).map((d) => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                  <span className="text-slate-600">{d.name}</span>
                </div>
                <span className="font-semibold text-slate-700">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Appointment Trends */}
        <div className="xl:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-slate-800">Appointment Trends</h3>
              <p className="text-xs text-slate-500">This week's appointments</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={appointmentTrendData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} name="Completed" />
              <Bar dataKey="cancelled" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Cancelled" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-4">Quick Overview</h3>
          <div className="space-y-3">
            {[
              { label: 'Scheduled Today', value: appointments.filter(a => a.status === 'Scheduled' && a.date === '2025-07-15').length, icon: Clock, color: 'text-blue-500 bg-blue-50' },
              { label: 'Completed Today', value: appointments.filter(a => a.status === 'Completed').length, icon: CheckCircle, color: 'text-emerald-500 bg-emerald-50' },
              { label: 'Overdue Bills', value: bills.filter(b => b.status === 'Overdue').length, icon: AlertCircle, color: 'text-rose-500 bg-rose-50' },
              { label: 'Doctors Available', value: 4, icon: Activity, color: 'text-violet-500 bg-violet-50' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className="text-lg font-bold text-slate-800">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Recent Appointments */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800">Today's Appointments</h3>
            <button className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-semibold">
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {todayAppts.map((appt) => (
              <div key={appt.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-100 to-violet-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-blue-700">{appt.patientName.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-700 truncate">{appt.patientName}</p>
                  <p className="text-xs text-slate-500 truncate">{appt.doctorName} • {appt.time}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0 ${
                  appt.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                  appt.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                  appt.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                  'bg-amber-100 text-amber-700'
                }`}>
                  {appt.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Bills */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800">Pending Bills</h3>
            <button className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-semibold">
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {pendingBills.map((bill) => (
              <div key={bill.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-100 to-rose-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-amber-700">{bill.patientName.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-700 truncate">{bill.patientName}</p>
                  <p className="text-xs text-slate-500">Due: {bill.dueDate}</p>
                </div>
                <div className="text-right flex-shrink-0">
              <p className="text-sm font-bold text-slate-800">{formatINR2(bill.total)}</p>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    bill.status === 'Overdue' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {bill.status}
                  </span>
                </div>
              </div>
            ))}
            {/* Medicine Alerts */}
            <div className="pt-2 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-500 mb-2">⚠ Medicine Alerts</p>
              {medicines.filter(m => m.status === 'Low Stock' || m.status === 'Out of Stock').map((m) => (
                <div key={m.id} className="flex items-center justify-between py-1.5">
                  <span className="text-xs text-slate-700">{m.name}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    m.status === 'Out of Stock' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {m.stock} {m.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
