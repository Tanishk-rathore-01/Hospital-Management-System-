import { TrendingUp, TrendingDown, Users, Calendar, IndianRupee, Pill, Activity, Download } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, RadialBarChart, RadialBar, Legend
} from 'recharts';
import { revenueData, departmentData, appointmentTrendData, patients, appointments, bills, medicines } from '../data/mockData';
import { formatINR2, formatINR, formatINRCompact } from '../utils/money';


const patientGrowthData = [
  { month: 'Jan', new: 18, returning: 106 },
  { month: 'Feb', new: 24, returning: 114 },
  { month: 'Mar', new: 31, returning: 125 },
  { month: 'Apr', new: 22, returning: 120 },
  { month: 'May', new: 38, returning: 130 },
  { month: 'Jun', new: 42, returning: 143 },
  { month: 'Jul', new: 35, returning: 143 },
];

const satisfactionData = [
  { name: 'Excellent', value: 45, fill: '#10b981' },
  { name: 'Good', value: 32, fill: '#3b82f6' },
  { name: 'Average', value: 15, fill: '#f59e0b' },
  { name: 'Poor', value: 8, fill: '#ef4444' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs">
        <p className="font-semibold mb-1">{label}</p>
        {payload.map((entry: any) => (
          <p key={entry.name} style={{ color: entry.color || entry.fill }}>
            {entry.name}: {entry.name?.toLowerCase().includes('revenue') || entry.name?.toLowerCase().includes('expense')
              ? formatINR2(entry.value) : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Reports() {
  const totalRevenue = revenueData.reduce((s, d) => s + d.revenue, 0);
  const totalExpenses = revenueData.reduce((s, d) => s + d.expenses, 0);
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = ((netProfit / totalRevenue) * 100).toFixed(1);

  const collectionRate = ((bills.filter(b => b.status === 'Paid').length / bills.length) * 100).toFixed(0);
  const avgAppointmentFee = Math.round(appointments.reduce((s, a) => s + a.fee, 0) / appointments.length);

  const kpiData = [
    { label: 'Total Revenue (YTD)', value: formatINR(totalRevenue), change: '+14.2%', positive: true, icon: IndianRupee, color: 'from-emerald-500 to-teal-600' },
    { label: 'Net Profit', value: formatINR(netProfit), change: `${profitMargin}% margin`, positive: true, icon: TrendingUp, color: 'from-blue-500 to-indigo-600' },
    { label: 'Total Patients', value: patients.length, change: '+12.5%', positive: true, icon: Users, color: 'from-violet-500 to-purple-600' },
    { label: 'Bill Collection Rate', value: `${collectionRate}%`, change: '-2.1%', positive: false, icon: Activity, color: 'from-amber-500 to-orange-600' },
    { label: 'Avg. Appointment Fee', value: formatINR(avgAppointmentFee), change: '+8.3%', positive: true, icon: Calendar, color: 'from-cyan-500 to-blue-600' },
    { label: 'Low Stock Medicines', value: medicines.filter(m => m.status !== 'In Stock').length, change: 'Action needed', positive: false, icon: Pill, color: 'from-rose-500 to-pink-600' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiData.map(({ label, value, change, positive, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3 shadow-lg`}>
              <Icon className="w-4 h-4 text-white" />
            </div>
            <p className="text-xl font-bold text-slate-800">{value}</p>
            <p className="text-xs text-slate-500 mt-0.5 leading-tight">{label}</p>
            <span className={`mt-1 text-xs font-semibold flex items-center gap-0.5 ${positive ? 'text-emerald-600' : 'text-rose-600'}`}>
              {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {change}
            </span>
          </div>
        ))}
      </div>

      {/* Export Button */}
      <div className="flex justify-end">
        <button className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-700 transition-colors shadow-lg">
          <Download className="w-4 h-4" /> Export Report
        </button>
      </div>

      {/* Revenue & Expenses Chart */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-5">
            <div>
              <h3 className="font-bold text-slate-800">Financial Performance</h3>
              <p className="text-xs text-slate-500">Revenue vs Expenses (Jan-Jul 2026)</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-3 h-1 rounded bg-blue-500 inline-block" /> Revenue</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-1 rounded bg-rose-400 inline-block" /> Expenses</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={revenueData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="gRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => formatINRCompact(v)} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2.5} fill="url(#gRevenue)" name="Revenue" />
              <Area type="monotone" dataKey="expenses" stroke="#f43f5e" strokeWidth={2.5} fill="url(#gExpenses)" name="Expenses" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Department Pie */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-1">Department Distribution</h3>
          <p className="text-xs text-slate-500 mb-4">Patient visits by department</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={departmentData} cx="50%" cy="50%" outerRadius={70} paddingAngle={3} dataKey="value">
                {departmentData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v) => [`${v}%`, 'Share']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5">
            {departmentData.map(d => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                  <span className="text-slate-600">{d.name}</span>
                </span>
                <span className="font-bold text-slate-700">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Patient Growth */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-1">Patient Growth</h3>
          <p className="text-xs text-slate-500 mb-4">New vs returning patients</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={patientGrowthData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="returning" fill="#dbeafe" radius={[0, 0, 0, 0]} name="Returning" stackId="a" />
              <Bar dataKey="new" fill="#3b82f6" radius={[4, 4, 0, 0]} name="New" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2 text-xs">
            <span className="flex items-center gap-1"><span className="w-3 h-1 rounded bg-blue-500" /> New patients</span>
            <span className="flex items-center gap-1"><span className="w-3 h-1 rounded bg-blue-100" /> Returning</span>
          </div>
        </div>

        {/* Appointment Weekly */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-1">Weekly Appointment Analysis</h3>
          <p className="text-xs text-slate-500 mb-4">Completed vs cancelled this week</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={appointmentTrendData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="appointments" stroke="#8b5cf6" strokeWidth={2.5} name="Total" dot={{ fill: '#8b5cf6', r: 3 }} />
              <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} name="Completed" dot={{ fill: '#10b981', r: 3 }} />
              <Line type="monotone" dataKey="cancelled" stroke="#f43f5e" strokeWidth={2} strokeDasharray="4 4" name="Cancelled" dot={{ fill: '#f43f5e', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Satisfaction & Summary */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Satisfaction */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-1">Patient Satisfaction</h3>
          <p className="text-xs text-slate-500 mb-4">Based on 248 responses</p>
          <ResponsiveContainer width="100%" height={180}>
            <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="90%" data={satisfactionData} startAngle={180} endAngle={0}>
              <RadialBar dataKey="value" cornerRadius={4} />
              <Legend iconSize={8} iconType="circle" layout="horizontal" verticalAlign="bottom" align="center"
                formatter={(value) => <span className="text-xs text-slate-600">{value}</span>} />
              <Tooltip formatter={(v) => [`${v}%`, '']} />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Table */}
        <div className="xl:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-4">Monthly Performance Summary</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 rounded-xl">
                  {['Month', 'Revenue', 'Expenses', 'Net Profit', 'Patients', 'Margin'].map(h => (
                    <th key={h} className="text-left px-3 py-2.5 text-xs font-semibold text-slate-500 first:rounded-l-xl last:rounded-r-xl">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {revenueData.map(d => {
                  const profit = d.revenue - d.expenses;
                  const margin = ((profit / d.revenue) * 100).toFixed(1);
                  return (
                    <tr key={d.month} className="hover:bg-slate-50/50">
                      <td className="px-3 py-3 text-sm font-semibold text-slate-700">{d.month}</td>
                      <td className="px-3 py-3 text-sm text-emerald-600 font-semibold">{formatINR2(d.revenue)}</td>
                      <td className="px-3 py-3 text-sm text-rose-500">{formatINR2(d.expenses)}</td>
                      <td className="px-3 py-3 text-sm font-bold text-slate-800">{formatINR2(profit)}</td>
                      <td className="px-3 py-3 text-sm text-slate-600">{d.patients}</td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-slate-100 rounded-full h-1.5 w-16">
                            <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${margin}%` }} />
                          </div>
                          <span className="text-xs font-semibold text-slate-700">{margin}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-slate-900 text-white">
                  <td className="px-3 py-3 text-sm font-bold rounded-l-xl">Total</td>
                  <td className="px-3 py-3 text-sm font-bold text-emerald-400">{formatINR2(totalRevenue)}</td>
                  <td className="px-3 py-3 text-sm font-bold text-rose-400">{formatINR2(totalExpenses)}</td>
                  <td className="px-3 py-3 text-sm font-bold">{formatINR2(netProfit)}</td>
                  <td className="px-3 py-3 text-sm font-bold">{revenueData.reduce((s, d) => s + d.patients, 0)}</td>
                  <td className="px-3 py-3 text-sm font-bold rounded-r-xl">{profitMargin}%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
