import { useState } from 'react';
import { Search, Eye, Plus, FileText, X, Activity, Thermometer, Heart, Droplets } from 'lucide-react';
import { medicalRecords } from '../data/mockData';
import { MedicalRecord } from '../types';

export default function MedicalRecords() {
  const [records] = useState<MedicalRecord[]>(medicalRecords);
  const [search, setSearch] = useState('');
  const [viewRecord, setViewRecord] = useState<MedicalRecord | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'prescriptions' | 'labs' | 'vitals'>('overview');

  const filtered = records.filter(r =>
    r.patientName.toLowerCase().includes(search.toLowerCase()) ||
    r.diagnosis.toLowerCase().includes(search.toLowerCase()) ||
    r.doctorName.toLowerCase().includes(search.toLowerCase())
  );

  const openRecord = (r: MedicalRecord) => {
    setViewRecord(r);
    setActiveTab('overview');
  };

  return (
    <div className="p-6 space-y-5">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search records, diagnosis..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/30" />
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-teal-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:from-cyan-700 hover:to-teal-600 transition-all shadow-lg shadow-cyan-500/25">
          <Plus className="w-4 h-4" /> New Record
        </button>
      </div>

      {/* Records Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(record => (
          <div key={record.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-100 to-teal-100 flex items-center justify-center text-sm font-bold text-cyan-700">
                  {record.patientName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{record.patientName}</p>
                  <p className="text-xs text-slate-500">{record.doctorName}</p>
                </div>
              </div>
              <span className="text-xs font-mono bg-slate-100 text-slate-500 px-2 py-1 rounded-lg">{record.id}</span>
            </div>

            <div className="bg-cyan-50 rounded-xl p-3 mb-3">
              <p className="text-xs text-cyan-600 font-semibold mb-1">Diagnosis</p>
              <p className="text-sm font-bold text-slate-800">{record.diagnosis}</p>
            </div>

            <div className="mb-3">
              <p className="text-xs text-slate-500 font-semibold mb-2">Symptoms</p>
              <div className="flex flex-wrap gap-1">
                {record.symptoms.slice(0, 3).map(s => (
                  <span key={s} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{s}</span>
                ))}
                {record.symptoms.length > 3 && (
                  <span className="text-xs text-slate-400">+{record.symptoms.length - 3} more</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-slate-50 rounded-lg p-2">
                <p className="text-xs text-slate-400">Visit Date</p>
                <p className="text-xs font-semibold text-slate-700">{record.date}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-2">
                <p className="text-xs text-slate-400">Follow Up</p>
                <p className="text-xs font-semibold text-slate-700">{record.followUpDate}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  {record.prescriptions.length} Rx
                </span>
                <span className="flex items-center gap-1">
                  <Activity className="w-3 h-3" />
                  {record.labResults.length} Labs
                </span>
              </div>
              <button onClick={() => openRecord(record)}
                className="flex items-center gap-1.5 text-xs font-semibold text-cyan-600 hover:text-cyan-700 bg-cyan-50 hover:bg-cyan-100 px-3 py-1.5 rounded-lg transition-colors">
                <Eye className="w-3 h-3" /> View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No records found</p>
        </div>
      )}

      {/* Detail Modal */}
      {viewRecord && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setViewRecord(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-600 to-teal-500 p-6 rounded-t-2xl text-white">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold">Medical Record - {viewRecord.id}</h3>
                  <p className="text-cyan-100 text-sm mt-1">{viewRecord.patientName} • {viewRecord.date}</p>
                </div>
                <button onClick={() => setViewRecord(null)} className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <X className="w-4 h-4" />
                </button>
              </div>
              {/* Tabs */}
              <div className="flex gap-2 mt-4">
                {(['overview', 'prescriptions', 'labs', 'vitals'] as const).map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold capitalize transition-colors ${activeTab === tab ? 'bg-white text-cyan-700' : 'bg-white/20 text-white hover:bg-white/30'}`}>
                    {tab === 'overview' ? 'Overview' : tab === 'prescriptions' ? 'Prescriptions' : tab === 'labs' ? 'Lab Results' : 'Vitals'}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 rounded-xl p-3">
                      <p className="text-xs text-slate-500">Patient</p>
                      <p className="text-sm font-bold text-slate-800">{viewRecord.patientName}</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3">
                      <p className="text-xs text-slate-500">Doctor</p>
                      <p className="text-sm font-bold text-slate-800">{viewRecord.doctorName}</p>
                    </div>
                  </div>
                  <div className="bg-cyan-50 border border-cyan-100 rounded-xl p-4">
                    <p className="text-xs text-cyan-600 font-semibold mb-1">Diagnosis</p>
                    <p className="text-base font-bold text-slate-800">{viewRecord.diagnosis}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold mb-2 uppercase tracking-wider">Symptoms</p>
                    <div className="flex flex-wrap gap-2">
                      {viewRecord.symptoms.map(s => (
                        <span key={s} className="text-sm bg-slate-100 text-slate-700 px-3 py-1 rounded-full">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs text-slate-500 font-semibold mb-1 uppercase tracking-wider">Treatment Plan</p>
                    <p className="text-sm text-slate-700">{viewRecord.treatment}</p>
                  </div>
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                    <p className="text-xs text-amber-600 font-semibold mb-1">Doctor's Notes</p>
                    <p className="text-sm text-slate-700">{viewRecord.notes}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-emerald-50 rounded-xl p-3">
                      <p className="text-xs text-emerald-600">Visit Date</p>
                      <p className="text-sm font-bold text-slate-800">{viewRecord.date}</p>
                    </div>
                    <div className="bg-violet-50 rounded-xl p-3">
                      <p className="text-xs text-violet-600">Follow-up Date</p>
                      <p className="text-sm font-bold text-slate-800">{viewRecord.followUpDate}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Prescriptions Tab */}
              {activeTab === 'prescriptions' && (
                <div className="space-y-3">
                  {viewRecord.prescriptions.map((rx, i) => (
                    <div key={i} className="bg-slate-50 rounded-xl p-4 border-l-4 border-cyan-400">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-bold text-slate-800">{rx.medication}</p>
                        <span className="text-xs bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded-full font-semibold">{rx.dosage}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs text-slate-600">
                        <div><span className="text-slate-400">Frequency:</span> {rx.frequency}</div>
                        <div><span className="text-slate-400">Duration:</span> {rx.duration}</div>
                      </div>
                      <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-2 py-1 mt-2">💊 {rx.instructions}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Lab Results Tab */}
              {activeTab === 'labs' && (
                <div className="space-y-3">
                  {viewRecord.labResults.map((lab, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div>
                        <p className="text-sm font-bold text-slate-800">{lab.test}</p>
                        <p className="text-xs text-slate-500">Normal: {lab.normalRange}</p>
                        <p className="text-xs text-slate-400">Date: {lab.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-700">{lab.result}</p>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block ${
                          lab.status === 'Normal' ? 'bg-emerald-100 text-emerald-700' :
                          lab.status === 'Critical' ? 'bg-red-100 text-red-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>{lab.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Vitals Tab */}
              {activeTab === 'vitals' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    { label: 'Blood Pressure', value: `${viewRecord.vitals.bloodPressure} mmHg`, icon: Heart, color: 'text-rose-500 bg-rose-50' },
                    { label: 'Heart Rate', value: `${viewRecord.vitals.heartRate} bpm`, icon: Activity, color: 'text-red-500 bg-red-50' },
                    { label: 'Temperature', value: `${viewRecord.vitals.temperature}°C`, icon: Thermometer, color: 'text-orange-500 bg-orange-50' },
                    { label: 'Weight', value: `${viewRecord.vitals.weight} kg`, icon: Activity, color: 'text-blue-500 bg-blue-50' },
                    { label: 'Height', value: `${viewRecord.vitals.height} cm`, icon: Activity, color: 'text-indigo-500 bg-indigo-50' },
                    { label: 'O₂ Saturation', value: `${viewRecord.vitals.oxygenSaturation}%`, icon: Droplets, color: 'text-cyan-500 bg-cyan-50' },
                  ].map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="bg-slate-50 rounded-xl p-4 text-center">
                      <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mx-auto mb-2`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <p className="text-xl font-bold text-slate-800">{value}</p>
                      <p className="text-xs text-slate-500 mt-1">{label}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
