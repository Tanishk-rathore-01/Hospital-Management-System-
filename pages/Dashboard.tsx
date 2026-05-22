import {
  Activity, AlertCircle, ArrowRight, Bed, Calendar, CheckCircle, Clock,
  IndianRupee, Pill, ReceiptIndianRupee, UserPlus, Users
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Link } from 'react-router-dom';
import { formatINR, formatINR2, formatINRCompact } from '../utils/money';
import { usePatients } from '../src/hooks/usePatients';
import { useAppointments } from '../src/hooks/useAppointments';
import { useBills } from '../src/hooks/useBills';
import { useMedicines } from '../src/hooks/useMedicines';
import { revenueData, appointmentTrendData, todayIso } from '../data/mockData';

const flowData = [
  { name: 'Registration', value: 142, color: '#2dd4bf' },
  { name: 'Consultation', value: 246, color: '#60a5fa' },
  { name: 'Investigations', value: 98, color: '#38bdf8' },
  { name: 'Pharmacy', value: 76, color: '#f59e0b' },
  { name: 'Billing', value: 50, color: '#a78bfa' },
];

const tooltipStyle = {
  background: '#071214',
  border: '1px solid rgba(148, 163, 184, 0.22)',
  borderRadius: 8,
  color: '#edf7f6',
};

const careHeroSrc = `${import.meta.env.BASE_URL}care-hero.png`;

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-slate-700/70 bg-[#071214] p-3 text-xs text-slate-100 shadow-2xl">
      <p className="mb-1 font-semibold">{label}</p>
      {payload.map((entry: any) => {
        const isMoney = ['revenue', 'expenses'].includes(String(entry.dataKey).toLowerCase());
        return (
          <p key={`${entry.name}-${entry.value}`} style={{ color: entry.color }}>
            {entry.name}: {isMoney ? formatINR2(entry.value) : entry.value}
          </p>
        );
      })}
    </div>
  );
};

function StatusBadge({ status }: { status: string }) {
  const classes =
    status === 'Completed' || status === 'Paid' || status === 'Dispensed'
      ? 'border-emerald-400/30 bg-emerald-400/12 text-emerald-200'
      : status === 'In Progress' || status === 'Partial'
        ? 'border-blue-400/30 bg-blue-400/12 text-blue-200'
        : status === 'Cancelled' || status === 'Overdue' || status === 'Out of Stock'
          ? 'border-rose-400/30 bg-rose-400/12 text-rose-200'
          : 'border-amber-400/30 bg-amber-400/12 text-amber-200';

  return (
    <span className={`inline-flex rounded-md border px-2 py-1 text-xs font-semibold ${classes}`}>
      {status}
    </span>
  );
}

export default function Dashboard() {
  const { data: patients = [], isLoading: patientsLoading } = usePatients();
  const { data: appointments = [], isLoading: appointmentsLoading } = useAppointments();
  const { data: bills = [], isLoading: billsLoading } = useBills();
  const { data: medicines = [], isLoading: medicinesLoading } = useMedicines();

  const isLoading = patientsLoading || appointmentsLoading || billsLoading || medicinesLoading;

  // Calculate stats from fetched data
  const currentRevenue = revenueData[revenueData.length - 1]?.revenue ?? 0;
  const previousRevenue = revenueData[revenueData.length - 2]?.revenue ?? currentRevenue;
  const todayAppointments = appointments.filter((appointment) => appointment.date === todayIso);
  const pendingBills = bills.filter((bill) => bill.status === 'Pending' || bill.status === 'Overdue' || bill.status === 'Partial');
  const stockAlerts = medicines.filter((medicine) => medicine.status === 'Low Stock' || medicine.status === 'Out of Stock' || medicine.status === 'Expired');

  const collected = bills.reduce((sum, bill) => sum + bill.paid, 0);
  const outstanding = pendingBills.reduce((sum, bill) => sum + (bill.total - bill.paid), 0);
  const doctorsAvailable = 4;
  const careSignals = [
    {
      label: 'Triage desk',
      value: `${todayAppointments.filter((appointment) => appointment.status === 'Scheduled').length} waiting`,
      detail: 'Front desk has the next OPD files ready.',
    },
    {
      label: 'Nursing handover',
      value: '12 notes',
      detail: 'Vitals and follow-up reminders are grouped.',
    },
    {
      label: 'Family support',
      value: `${pendingBills.length} billing helps`,
      detail: 'Counsellor can review pending payment cases.',
    },
  ];

  const stats = [
    {
      label: 'OPD Visits',
      value: patients.length * 76,
      icon: Users,
      change: '+14.6%',
      positive: true,
      sub: `${patients.filter((patient) => patient.status === 'Active').length} active records`,
      tone: 'from-teal-400/18 to-emerald-400/10',
    },
    {
      label: 'Appointments',
      value: todayAppointments.length,
      icon: Calendar,
      change: '+8.2%',
      positive: true,
      sub: `${appointments.filter((appointment) => appointment.status === 'In Progress').length} in progress`,
      tone: 'from-sky-400/18 to-blue-400/10',
    },
    {
      label: 'IPD Occupancy',
      value: '76%',
      icon: Bed,
      change: '+3.1%',
      positive: true,
      sub: '109 / 143 beds',
      tone: 'from-blue-400/18 to-cyan-400/10',
    },
    {
      label: 'Monthly Revenue',
      value: formatINR(currentRevenue),
      icon: IndianRupee,
      change: currentRevenue >= previousRevenue ? '+5.8%' : '-3.2%',
      positive: currentRevenue >= previousRevenue,
      sub: `vs ${formatINR(previousRevenue)} last month`,
      tone: 'from-emerald-400/18 to-teal-400/10',
    },
  ];

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-48 bg-slate-700 rounded animate-pulse" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-700 rounded animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 bg-slate-700 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 p-4 sm:p-6">
      <section className="relative overflow-hidden rounded-lg border border-slate-700/70 bg-[#0b171b] shadow-2xl">
        <div className="absolute inset-y-0 right-0 hidden w-1/2 lg:block">
          <img
            src={careHeroSrc}
            alt="Nurse supporting an elderly patient with family in an Indian hospital"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b171b] via-[#0b171b]/44 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b171b] via-transparent to-transparent" />
        </div>

        <div className="relative max-w-3xl px-5 py-7 sm:px-8 sm:py-9">
          <h1 className="max-w-2xl break-words text-2xl font-extrabold leading-tight text-slate-50 sm:text-4xl lg:text-5xl">
            Care that stays close, even when the day is full.
          </h1>
          <div className="mt-4 h-0.5 w-20 rounded-full bg-teal-400" />
          <p className="mt-5 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
            Apex Health Care brings appointments, records, billing, pharmacy, and analytics into one calm workspace for Indian hospitals.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/appointments" className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-teal-500 px-4 py-2.5 text-sm font-semibold text-[#041012] shadow-lg shadow-teal-500/20 hover:bg-teal-400 sm:w-auto">
              <Calendar className="h-4 w-4" />
              New Appointment
            </Link>
            <Link to="/patients" className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-700/80 bg-slate-900/70 px-4 py-2.5 text-sm font-semibold text-slate-200 hover:bg-slate-800 sm:w-auto">
              <UserPlus className="h-4 w-4" />
              Add Patient
            </Link>
            <Link to="/billing" className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-700/80 bg-slate-900/70 px-4 py-2.5 text-sm font-semibold text-slate-200 hover:bg-slate-800 sm:w-auto">
              <ReceiptIndianRupee className="h-4 w-4" />
              Generate Invoice
            </Link>
          </div>

          <div className="mt-6 grid gap-2 text-xs text-slate-300 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ['Live OPD', patients.length * 7],
              ['IPD Occupancy', '76%'],
              ['Collected', formatINR(collected)],
              ['Outstanding', formatINR(outstanding)],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-slate-700/60 bg-[#071214]/70 px-3 py-2">
                <span className="text-slate-500">{label}</span>
                <span className="ml-2 font-bold text-teal-200">{value}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {careSignals.map((signal) => (
              <div key={signal.label} className="rounded-lg border border-slate-700/60 bg-slate-950/35 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{signal.label}</p>
                <p className="mt-1 text-lg font-bold text-slate-50">{signal.value}</p>
                <p className="mt-1 text-xs leading-5 text-slate-400">{signal.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, change, positive, sub, tone }) => (
          <div key={label} className={`rounded-lg border border-slate-700/70 bg-gradient-to-br ${tone} p-5 shadow-sm`}>
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-700/60 bg-[#071214]/70">
                <Icon className="h-5 w-5 text-teal-200" />
              </div>
              <span className={`rounded-md px-2 py-1 text-xs font-semibold ${positive ? 'bg-emerald-400/12 text-emerald-200' : 'bg-rose-400/12 text-rose-200'}`}>
                {change}
              </span>
            </div>
            <p className="mb-1 text-2xl font-bold text-slate-50">{value}</p>
            <p className="text-sm font-medium text-slate-300">{label}</p>
            <p className="mt-1 text-xs text-slate-500">{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <section className="rounded-lg border border-slate-700/70 bg-[#101d21] p-5 shadow-sm xl:col-span-2">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-100">Revenue vs Expenses</h3>
              <p className="text-xs text-slate-500">INR performance across the last seven months</p>
            </div>
            <span className="rounded-md border border-teal-400/20 bg-teal-400/10 px-3 py-1 text-xs font-semibold text-teal-200">2026</span>
          </div>
          <ResponsiveContainer width="100%" height={245}>
            <AreaChart data={revenueData} margin={{ top: 5, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fb7185" stopOpacity={0.24} />
                  <stop offset="95%" stopColor="#fb7185" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.16)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#8fa3ad' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#8fa3ad' }} axisLine={false} tickLine={false} tickFormatter={(value) => formatINRCompact(value)} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#2dd4bf" strokeWidth={2.5} fill="url(#colorRevenue)" name="Revenue" dot={{ fill: '#2dd4bf', r: 3 }} />
              <Area type="monotone" dataKey="expenses" stroke="#fb7185" strokeWidth={2.5} fill="url(#colorExpenses)" name="Expenses" dot={{ fill: '#fb7185', r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </section>

        <section className="rounded-lg border border-slate-700/70 bg-[#101d21] p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="font-bold text-slate-100">Patient Flow</h3>
            <p className="text-xs text-slate-500">Today across registration to billing</p>
          </div>
          <ResponsiveContainer width="100%" height={190}>
            <PieChart>
              <Pie data={flowData} cx="50%" cy="50%" innerRadius={54} outerRadius={80} paddingAngle={3} dataKey="value">
                {flowData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value}`, 'Patients']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-3 space-y-2">
            {flowData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-400">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-semibold text-slate-200">{item.value}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <section className="rounded-lg border border-slate-700/70 bg-[#101d21] p-5 shadow-sm xl:col-span-2">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-100">Appointment Trends</h3>
              <p className="text-xs text-slate-500">Completed and cancelled consultations this week</p>
            </div>
            <span className="hidden rounded-md border border-slate-700/70 px-3 py-1 text-xs text-slate-400 sm:inline-flex">
              {doctorsAvailable} doctors available
            </span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={appointmentTrendData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.16)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#8fa3ad' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#8fa3ad' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="completed" fill="#2dd4bf" radius={[4, 4, 0, 0]} name="Completed" />
              <Bar dataKey="cancelled" fill="#fb7185" radius={[4, 4, 0, 0]} name="Cancelled" />
            </BarChart>
          </ResponsiveContainer>
        </section>

        <section className="rounded-lg border border-slate-700/70 bg-[#101d21] p-5 shadow-sm">
          <h3 className="mb-4 font-bold text-slate-100">Quick Overview</h3>
          <div className="space-y-3">
            {[
              { label: 'Scheduled Today', value: todayAppointments.filter((appointment) => appointment.status === 'Scheduled').length, icon: Clock, color: 'text-sky-300' },
              { label: 'Completed Visits', value: appointments.filter((appointment) => appointment.status === 'Completed').length, icon: CheckCircle, color: 'text-emerald-300' },
              { label: 'Overdue Bills', value: bills.filter((bill) => bill.status === 'Overdue').length, icon: AlertCircle, color: 'text-rose-300' },
              { label: 'Doctors Available', value: doctorsAvailable, icon: Activity, color: 'text-teal-300' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="flex items-center gap-3 rounded-lg border border-slate-700/60 bg-[#071214]/60 p-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-slate-900/90">
                  <Icon className={`h-4 w-4 ${color}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className="text-lg font-bold text-slate-100">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <section className="rounded-lg border border-slate-700/70 bg-[#101d21] p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold text-slate-100">Today's Appointment Queue</h3>
            <Link to="/appointments" className="flex items-center gap-1 text-xs font-semibold text-teal-300 hover:text-teal-200">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {todayAppointments.slice(0, 5).map((appointment) => (
              <div key={appointment.id} className="flex items-center gap-3 rounded-lg border border-slate-700/60 bg-[#071214]/50 p-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-teal-400/12">
                  <span className="text-xs font-bold text-teal-200">{appointment.patientName.split(' ').map((name) => name[0]).join('')}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-100">{appointment.patientName}</p>
                  <p className="truncate text-xs text-slate-500">{appointment.doctorName} | {appointment.time}</p>
                </div>
                <StatusBadge status={appointment.status} />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-slate-700/70 bg-[#101d21] p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold text-slate-100">Billing & Pharmacy Snapshot</h3>
            <Link to="/billing" className="flex items-center gap-1 text-xs font-semibold text-teal-300 hover:text-teal-200">
              Review <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-700/60 bg-[#071214]/50 p-4">
              <div className="mb-3 flex items-center gap-2 text-slate-300">
                <IndianRupee className="h-4 w-4 text-teal-300" />
                <span className="text-sm font-semibold">Collections</span>
              </div>
              <p className="text-2xl font-bold text-slate-50">{formatINR(collected)}</p>
              <p className="mt-1 text-xs text-slate-500">{formatINR(outstanding)} outstanding</p>
            </div>
            <div className="rounded-lg border border-slate-700/60 bg-[#071214]/50 p-4">
              <div className="mb-3 flex items-center gap-2 text-slate-300">
                <Pill className="h-4 w-4 text-amber-300" />
                <span className="text-sm font-semibold">Medicine Alerts</span>
              </div>
              <p className="text-2xl font-bold text-slate-50">{stockAlerts.length}</p>
              <p className="mt-1 text-xs text-slate-500">Low, expired, or out-of-stock items</p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {stockAlerts.slice(0, 4).map((medicine) => (
              <div key={medicine.id} className="flex items-center justify-between gap-3 rounded-lg border border-slate-700/60 px-3 py-2 text-xs">
                <span className="truncate text-slate-300">{medicine.name}</span>
                <StatusBadge status={medicine.status} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
