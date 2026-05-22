import { useState } from 'react';
import { Plus, Search, Calendar, Clock, X, Check, Filter, Eye, AlertCircle } from 'lucide-react';
import { doctors } from '../data/mockData';
import { formatINR2 } from '../utils/money';
import { Appointment } from '../types';
import { useAppointments, useCreateAppointment, useUpdateAppointmentStatus, useDeleteAppointment } from '../src/hooks/useAppointments';
import { usePatients } from '../src/hooks/usePatients';

const statusColors: Record<string, string> = {
  'Scheduled': 'bg-blue-100 text-blue-700',
  'In Progress': 'bg-amber-100 text-amber-700',
  'Completed': 'bg-emerald-100 text-emerald-700',
  'Cancelled': 'bg-red-100 text-red-700',
};

const typeColors: Record<string, string> = {
  'Consultation': 'bg-violet-100 text-violet-700',
  'Follow-up': 'bg-cyan-100 text-cyan-700',
  'Emergency': 'bg-red-100 text-red-700',
  'Surgery': 'bg-orange-100 text-orange-700',
  'Checkup': 'bg-teal-100 text-teal-700',
};

const timeSlots = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'];

const emptyForm = {
  patientId: '', patientName: '', doctorId: 'D001', doctorName: 'Dr. Amit Sharma', department: 'Cardiology',
  date: '', time: '09:00 AM', type: 'Consultation' as Appointment['type'], notes: '', fee: 1200
};

export default function Appointments() {
  const { data: appointments = [], isLoading, error } = useAppointments();
  const { data: patients = [] } = usePatients();
  const createMutation = useCreateAppointment();
  const updateStatusMutation = useUpdateAppointmentStatus();
  const deleteMutation = useDeleteAppointment();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [viewAppt, setViewAppt] = useState<Appointment | null>(null);
  const [form, setForm] = useState(emptyForm);

  const filtered = appointments.filter(a => {
    const matchSearch = a.patientName.toLowerCase().includes(search.toLowerCase()) ||
      a.doctorName.toLowerCase().includes(search.toLowerCase()) ||
      a.department.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleAdd = () => { setForm(emptyForm); setShowModal(true); };

  const handleSubmit = () => {
    if (!form.patientId || !form.patientName || !form.date) return;
    const selectedDoctor = doctors.find(d => d.id === form.doctorId);
    const newAppt: Omit<Appointment, 'id'> = {
      patientId: form.patientId,
      patientName: form.patientName,
      doctorId: form.doctorId,
      doctorName: selectedDoctor?.name || form.doctorName,
      department: selectedDoctor?.department || form.department,
      date: form.date,
      time: form.time,
      type: form.type,
      status: 'Scheduled',
      notes: form.notes,
      fee: form.fee,
    };
    createMutation.mutate(newAppt, {
      onSuccess: () => {
        setShowModal(false);
        setForm(emptyForm);
      },
    });
  };

  const handleDoctorChange = (doctorId: string) => {
    const doc = doctors.find(d => d.id === doctorId);
    if (doc) setForm(prev => ({ ...prev, doctorId, doctorName: doc.name, department: doc.department }));
  };

  const handleDeleteAppointment = (id: string) => {
    if (confirm('Delete this appointment?')) {
      deleteMutation.mutate(id);
    }
  };

  const statsData = [
    { label: 'Total', count: appointments.length, color: 'bg-slate-100 text-slate-700' },
    { label: 'Scheduled', count: appointments.filter(a => a.status === 'Scheduled').length, color: 'bg-blue-100 text-blue-700' },
    { label: 'In Progress', count: appointments.filter(a => a.status === 'In Progress').length, color: 'bg-amber-100 text-amber-700' },
    { label: 'Completed', count: appointments.filter(a => a.status === 'Completed').length, color: 'bg-emerald-100 text-emerald-700' },
    { label: 'Cancelled', count: appointments.filter(a => a.status === 'Cancelled').length, color: 'bg-red-100 text-red-700' },
  ];

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-8 bg-slate-700 rounded w-1/3 animate-pulse" />
        <div className="grid grid-cols-5 gap-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-slate-700 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <div>
            <p className="font-semibold text-red-700">Error loading appointments</p>
            <p className="text-sm text-red-600">{(error as Error).message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-5">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-3 flex-1 w-full sm:w-auto">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search appointments..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
          </div>
          <div className="relative">
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="appearance-none pl-4 pr-9 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30">
              {['All', 'Scheduled', 'In Progress', 'Completed', 'Cancelled'].map(s => <option key={s}>{s}</option>)}
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
        <button onClick={handleAdd}
          className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:from-violet-700 hover:to-purple-600 transition-all shadow-lg shadow-violet-500/25 whitespace-nowrap">
          <Plus className="w-4 h-4" /> Schedule Appointment
        </button>
      </div>

      {/* Stats */}
      <div className="flex gap-3 flex-wrap">
        {statsData.map(s => (
          <div key={s.label} className={`${s.color} rounded-xl px-4 py-2 text-center min-w-16`}>
            <p className="text-xl font-bold">{s.count}</p>
            <p className="text-xs font-medium opacity-70">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Doctor Cards */}
      <div>
        <h3 className="text-sm font-bold text-slate-700 mb-3">Doctor Availability</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {doctors.map(d => (
            <div key={d.id} className="bg-white rounded-xl p-3 shadow-sm border border-slate-100 text-center">
              <div className={`w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center text-sm font-bold ${
                d.status === 'Available' ? 'bg-emerald-100 text-emerald-700' :
                d.status === 'Busy' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
              }`}>{d.avatar}</div>
              <p className="text-xs font-semibold text-slate-700 truncate">{d.name.replace('Dr. ', '')}</p>
              <p className="text-xs text-slate-400 truncate">{d.specialization}</p>
              <span className={`mt-1 inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${
                d.status === 'Available' ? 'bg-emerald-100 text-emerald-600' :
                d.status === 'Busy' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'
              }`}>{d.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">All Appointments ({filtered.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Patient', 'Doctor', 'Department', 'Date & Time', 'Type', 'Fee', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(appt => (
                <tr key={appt.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center text-xs font-bold text-violet-700 flex-shrink-0">
                        {appt.patientName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm font-semibold text-slate-700">{appt.patientName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600 whitespace-nowrap">{appt.doctorName}</td>
                  <td className="px-5 py-4 text-sm text-slate-500">{appt.department}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1 text-xs text-slate-600">
                      <Calendar className="w-3 h-3 text-slate-400" /> {appt.date}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                      <Clock className="w-3 h-3" /> {appt.time}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${typeColors[appt.type] || 'bg-slate-100 text-slate-600'}`}>
                      {appt.type}
                    </span>
                  </td>
<td className="px-5 py-4 text-sm font-bold text-slate-700">{formatINR2(appt.fee)}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColors[appt.status]}`}>
                      {appt.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setViewAppt(appt)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      {appt.status === 'Scheduled' && (
                        <>
                          <button onClick={() => updateStatusMutation.mutate({ id: appt.id, status: 'In Progress' })} className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-500 transition-colors" title="Start">
                            <Clock className="w-4 h-4" />
                          </button>
                          <button onClick={() => updateStatusMutation.mutate({ id: appt.id, status: 'Cancelled' })} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Cancel">
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {appt.status === 'In Progress' && (
                        <button onClick={() => updateStatusMutation.mutate({ id: appt.id, status: 'Completed' })} className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-500 transition-colors" title="Complete">
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button onClick={() => handleDeleteAppointment(appt.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition-colors" title="Delete">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No appointments found</p>
            </div>
          )}
        </div>
      </div>

      {/* View Modal */}
      {viewAppt && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setViewAppt(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-violet-600 to-purple-500 p-5 rounded-t-2xl text-white">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">Appointment Details</h3>
                <button onClick={() => setViewAppt(null)} className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center"><X className="w-4 h-4" /></button>
              </div>
              <p className="text-violet-200 text-sm mt-1">{viewAppt.id}</p>
            </div>
            <div className="p-5 grid grid-cols-2 gap-3">
              {[
                { label: 'Patient', value: viewAppt.patientName },
                { label: 'Doctor', value: viewAppt.doctorName },
                { label: 'Department', value: viewAppt.department },
                { label: 'Type', value: viewAppt.type },
                { label: 'Date', value: viewAppt.date },
                { label: 'Time', value: viewAppt.time },
{ label: 'Fee', value: formatINR2(viewAppt.fee) },
                { label: 'Status', value: viewAppt.status },
              ].map(({ label, value }) => (
                <div key={label} className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">{value}</p>
                </div>
              ))}
              {viewAppt.notes && (
                <div className="col-span-2 bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-500">Notes</p>
                  <p className="text-sm text-slate-700 mt-0.5">{viewAppt.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">Schedule Appointment</h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center"><X className="w-4 h-4 text-slate-600" /></button>
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Patient *</label>
                <select value={form.patientId} onChange={e => {
                  const patient = patients.find(p => p.id === e.target.value);
                  if (patient) setForm(prev => ({ ...prev, patientId: patient.id, patientName: patient.name }));
                }}
                  className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/30">
                  <option value="">Select a patient...</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Doctor</label>
                <select value={form.doctorId} onChange={e => handleDoctorChange(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/30">
                  {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Type</label>
                <select value={form.type} onChange={e => setForm(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/30">
                  {['Consultation', 'Follow-up', 'Emergency', 'Surgery', 'Checkup'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Date *</label>
                <input type="date" value={form.date} onChange={e => setForm(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/30" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Time</label>
                <select value={form.time} onChange={e => setForm(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/30">
                  {timeSlots.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
<label className="block text-xs font-semibold text-slate-600 mb-1.5">Fee (₹)</label>
                <input type="number" value={form.fee} onChange={e => setForm(prev => ({ ...prev, fee: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/30" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Notes</label>
                <textarea rows={2} placeholder="Additional notes..." value={form.notes} onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/30 resize-none" />
              </div>
            </div>
            <div className="flex gap-3 px-5 pb-5">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 text-sm font-semibold border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600">Cancel</button>
              <button onClick={handleSubmit} disabled={createMutation.isPending} className="flex-1 py-2.5 text-sm font-semibold bg-gradient-to-r from-violet-600 to-purple-500 text-white rounded-xl hover:from-violet-700 hover:to-purple-600 shadow-lg shadow-violet-500/25 disabled:opacity-50">
                {createMutation.isPending ? 'Scheduling...' : 'Schedule'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
