import { useState } from 'react';
import { Search, Plus, Filter, Edit2, Eye, Trash2, Phone, AlertTriangle, X, AlertCircle } from 'lucide-react';
import { Patient } from '../types';
import { usePatients, useCreatePatient, useUpdatePatient, useDeletePatient } from '../src/hooks/usePatients';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const emptyPatient: Omit<Patient, 'id' | 'registrationDate'> = {
  name: '', age: 0, gender: 'Male', phone: '', email: '', address: '',
  bloodGroup: 'O+', dateOfBirth: '', status: 'Active', emergencyContact: '',
  insurance: '', allergies: []
};

export default function Patients() {
  const { data: patients = [], isLoading, error } = usePatients();
  const createMutation = useCreatePatient();
  const updateMutation = useUpdatePatient();
  const deleteMutation = useDeletePatient();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [viewPatient, setViewPatient] = useState<Patient | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Omit<Patient, 'id' | 'registrationDate'>>(emptyPatient);
  const [allergyInput, setAllergyInput] = useState('');

  const filtered = patients.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleAdd = () => {
    setFormData(emptyPatient);
    setEditMode(false);
    setShowModal(true);
  };

  const handleEdit = (p: Patient) => {
    setFormData({ name: p.name, age: p.age, gender: p.gender, phone: p.phone, email: p.email, address: p.address, bloodGroup: p.bloodGroup, dateOfBirth: p.dateOfBirth, status: p.status, emergencyContact: p.emergencyContact, insurance: p.insurance, allergies: [...p.allergies] });
    setEditMode(true);
    setViewPatient(p);
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (!formData.name) return;
    if (editMode && viewPatient) {
      updateMutation.mutate(
        { id: viewPatient.id, data: formData },
        {
          onSuccess: () => {
            setShowModal(false);
            setViewPatient(null);
            setEditMode(false);
          },
        }
      );
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => {
          setShowModal(false);
          setFormData(emptyPatient);
          setEditMode(false);
        },
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this patient?')) {
      deleteMutation.mutate(id);
    }
  };

  const addAllergy = () => {
    if (allergyInput.trim() && !formData.allergies.includes(allergyInput.trim())) {
      setFormData(prev => ({ ...prev, allergies: [...prev.allergies, allergyInput.trim()] }));
      setAllergyInput('');
    }
  };

  const removeAllergy = (a: string) => {
    setFormData(prev => ({ ...prev, allergies: prev.allergies.filter(x => x !== a) }));
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-8 bg-slate-700 rounded w-1/3 animate-pulse" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-700 rounded animate-pulse" />
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
            <p className="font-semibold text-red-700">Error loading patients</p>
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
            <input
              type="text"
              placeholder="Search patients..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="appearance-none pl-4 pr-9 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer"
            >
              {['All', 'Active', 'Inactive', 'Discharged'].map(s => <option key={s}>{s}</option>)}
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-cyan-600 transition-all shadow-lg shadow-blue-500/25 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> Add Patient
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total', value: patients.length, color: 'bg-blue-50 text-blue-700' },
          { label: 'Active', value: patients.filter(p => p.status === 'Active').length, color: 'bg-emerald-50 text-emerald-700' },
          { label: 'Discharged', value: patients.filter(p => p.status === 'Discharged').length, color: 'bg-slate-50 text-slate-700' },
          { label: 'Filtered', value: filtered.length, color: 'bg-violet-50 text-violet-700' },
        ].map(s => (
          <div key={s.label} className={`${s.color} rounded-xl px-4 py-3 text-center`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs font-medium opacity-70">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Patient', 'ID', 'Age/Gender', 'Blood', 'Contact', 'Insurance', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-100 to-violet-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-blue-700">{p.name.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{p.name}</p>
                        <p className="text-xs text-slate-500 truncate max-w-32">{p.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded-lg">{p.id}</span>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">{p.age} / {p.gender}</td>
                  <td className="px-5 py-4">
                    <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-lg">{p.bloodGroup}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Phone className="w-3 h-3" /> {p.phone}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-xs text-slate-600 max-w-28 truncate">{p.insurance}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      p.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                      p.status === 'Discharged' ? 'bg-slate-100 text-slate-600' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setViewPatient(p)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => handleEdit(p)} className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-500 transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-16 text-slate-400">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No patients found</p>
              <p className="text-sm mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      {/* View Modal */}
      {viewPatient && !showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setViewPatient(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-6 rounded-t-2xl text-white">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-bold">
                    {viewPatient.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{viewPatient.name}</h3>
                    <p className="text-blue-100 text-sm">{viewPatient.id} • {viewPatient.status}</p>
                  </div>
                </div>
                <button onClick={() => setViewPatient(null)} className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              {[
                { label: 'Age', value: `${viewPatient.age} years` },
                { label: 'Gender', value: viewPatient.gender },
                { label: 'Blood Group', value: viewPatient.bloodGroup },
                { label: 'Date of Birth', value: viewPatient.dateOfBirth },
                { label: 'Phone', value: viewPatient.phone },
                { label: 'Email', value: viewPatient.email },
                { label: 'Insurance', value: viewPatient.insurance },
                { label: 'Emergency Contact', value: viewPatient.emergencyContact },
              ].map(({ label, value }) => (
                <div key={label} className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-500 mb-1">{label}</p>
                  <p className="text-sm font-semibold text-slate-800">{value}</p>
                </div>
              ))}
              <div className="col-span-2 bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-500 mb-1">Address</p>
                <p className="text-sm font-semibold text-slate-800">{viewPatient.address}</p>
              </div>
              {viewPatient.allergies.length > 0 && (
                <div className="col-span-2 bg-rose-50 rounded-xl p-3">
                  <p className="text-xs text-rose-500 font-semibold mb-2 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Allergies</p>
                  <div className="flex flex-wrap gap-2">
                    {viewPatient.allergies.map(a => (
                      <span key={a} className="text-xs bg-rose-100 text-rose-700 px-2 py-1 rounded-full font-medium">{a}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">{editMode ? 'Edit Patient' : 'Register New Patient'}</h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center">
                <X className="w-4 h-4 text-slate-600" />
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Full Name *', field: 'name', type: 'text', placeholder: 'Ananya Gupta' },
                { label: 'Age', field: 'age', type: 'number', placeholder: '30' },
                { label: 'Phone', field: 'phone', type: 'tel', placeholder: '+91-98765-00000' },
                { label: 'Email', field: 'email', type: 'email', placeholder: 'patient@email.com' },
                { label: 'Date of Birth', field: 'dateOfBirth', type: 'date', placeholder: '' },
                { label: 'Emergency Contact', field: 'emergencyContact', type: 'tel', placeholder: '+91-98765-00001' },
                { label: 'Insurance Provider', field: 'insurance', type: 'text', placeholder: 'Star Health' },
              ].map(({ label, field, type, placeholder }) => (
                <div key={field}>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={(formData as any)[field]}
                    onChange={e => setFormData(prev => ({ ...prev, [field]: type === 'number' ? parseInt(e.target.value) || 0 : e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Gender</label>
                <select value={formData.gender} onChange={e => setFormData(prev => ({ ...prev, gender: e.target.value as any }))}
                  className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30">
                  {['Male', 'Female', 'Other'].map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Blood Group</label>
                <select value={formData.bloodGroup} onChange={e => setFormData(prev => ({ ...prev, bloodGroup: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30">
                  {bloodGroups.map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Status</label>
                <select value={formData.status} onChange={e => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30">
                  {['Active', 'Inactive', 'Discharged'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Address</label>
                <input type="text" placeholder="12 M.G. Road, Bengaluru, Karnataka 560001" value={formData.address}
                  onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Allergies</label>
                <div className="flex gap-2 mb-2">
                  <input type="text" placeholder="Add allergy (press Enter)" value={allergyInput}
                    onChange={e => setAllergyInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addAllergy()}
                    className="flex-1 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
                  <button type="button" onClick={addAllergy} className="px-3 py-2 bg-blue-500 text-white rounded-xl text-sm hover:bg-blue-600">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.allergies.map(a => (
                    <span key={a} className="flex items-center gap-1 text-xs bg-rose-100 text-rose-700 px-2 py-1 rounded-full">
                      {a} <button type="button" onClick={() => removeAllergy(a)}><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 text-sm font-semibold border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors">
                Cancel
              </button>
              <button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending} className="flex-1 py-2.5 text-sm font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl hover:from-blue-700 hover:to-cyan-600 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed">
                {createMutation.isPending || updateMutation.isPending ? (editMode ? 'Saving...' : 'Registering...') : (editMode ? 'Save Changes' : 'Register Patient')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Users({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  );
}
