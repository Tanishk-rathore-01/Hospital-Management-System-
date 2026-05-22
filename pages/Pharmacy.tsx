import { useState } from 'react';
import { Search, Plus, Filter, AlertTriangle, Package, ShoppingCart, Eye, X, Edit2, AlertCircle } from 'lucide-react';
import { formatINR2 } from '../utils/money';
import { Medicine } from '../types';
import { useMedicines, useMedicineLowStockAlerts } from '../src/hooks/useMedicines';
import { usePharmacyOrders, useDispensePharmacyOrder } from '../src/hooks/usePharmacy';

const statusColors: Record<string, string> = {
  'In Stock': 'bg-emerald-100 text-emerald-700',
  'Low Stock': 'bg-amber-100 text-amber-700',
  'Out of Stock': 'bg-red-100 text-red-700',
  'Expired': 'bg-slate-100 text-slate-600',
};

const orderStatusColors: Record<string, string> = {
  'Pending': 'bg-amber-100 text-amber-700',
  'Dispensed': 'bg-emerald-100 text-emerald-700',
  'Cancelled': 'bg-red-100 text-red-700',
};

export default function Pharmacy() {
  const { data: medicines = [], isLoading: medsLoading, error: medsError } = useMedicines();
  const { data: orders = [], isLoading: ordersLoading, error: ordersError } = usePharmacyOrders();
  const { data: stockAlerts = [], isLoading: alertsLoading } = useMedicineLowStockAlerts();
  const dispenseMutation = useDispensePharmacyOrder();
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders'>('inventory');
  const [viewMed, setViewMed] = useState<Medicine | null>(null);

  const filteredMeds = medicines.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.genericName.toLowerCase().includes(search.toLowerCase()) ||
      m.category.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || m.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const filteredOrders = orders.filter(o =>
    o.patientName.toLowerCase().includes(search.toLowerCase()) ||
    o.id.toLowerCase().includes(search.toLowerCase())
  );

  const dispenseOrder = (id: string) => {
    dispenseMutation.mutate(id);
  };

  const isLoading = medsLoading || ordersLoading || alertsLoading;
  const error = medsError || ordersError;

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-slate-700 rounded animate-pulse" />
          ))}
        </div>
        <div className="h-64 bg-slate-700 rounded animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <div>
            <p className="font-semibold text-red-700">Error loading pharmacy data</p>
            <p className="text-sm text-red-600">{(error as Error).message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-5">
      {/* Alert Banner */}
      {stockAlerts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
          <div>
            <p className="text-sm font-bold text-amber-700">Stock Alert</p>
            <p className="text-xs text-amber-600">
              {stockAlerts.filter(m => m.status === 'Out of Stock').length} medicines out of stock, {' '}
              {stockAlerts.filter(m => m.status === 'Low Stock').length} with low stock, {' '}
              {stockAlerts.filter(m => m.status === 'Expired').length} expired
            </p>
          </div>
          <div className="ml-auto flex gap-2">
            {stockAlerts.map(m => (
              <span key={m.id} className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColors[m.status]}`}>
                {m.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Medicines', value: medicines.length, icon: Package, color: 'from-rose-500 to-pink-600' },
          { label: 'In Stock', value: medicines.filter(m => m.status === 'In Stock').length, icon: Package, color: 'from-emerald-500 to-teal-600' },
          { label: 'Low / Out of Stock', value: medicines.filter(m => m.status === 'Low Stock' || m.status === 'Out of Stock').length, icon: AlertTriangle, color: 'from-amber-500 to-orange-600' },
          { label: 'Total Orders', value: orders.length, icon: ShoppingCart, color: 'from-blue-500 to-indigo-600' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3 shadow-lg`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Tabs & Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
          {(['inventory', 'orders'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-colors ${activeTab === tab ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              {tab === 'inventory' ? '📦 Inventory' : '📋 Orders'}
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-52 pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30" />
          </div>
          {activeTab === 'inventory' && (
            <div className="relative">
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                className="appearance-none pl-4 pr-8 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none">
                {['All', 'In Stock', 'Low Stock', 'Out of Stock', 'Expired'].map(s => <option key={s}>{s}</option>)}
              </select>
              <Filter className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          )}
          <button className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:from-rose-600 hover:to-pink-600 transition-all shadow-lg shadow-rose-500/25 whitespace-nowrap">
            <Plus className="w-4 h-4" /> {activeTab === 'inventory' ? 'Add Medicine' : 'New Order'}
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Medicine', 'Generic Name', 'Category', 'Stock', 'Min Stock', 'Price', 'Expiry', 'Location', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredMeds.map(med => (
                  <tr key={med.id} className={`hover:bg-slate-50/50 transition-colors ${med.status === 'Expired' ? 'opacity-60' : ''}`}>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center text-xs font-bold text-rose-700 flex-shrink-0">
                          Rx
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{med.name}</p>
                          <p className="text-xs text-slate-400">{med.manufacturer}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600">{med.genericName}</td>
                    <td className="px-4 py-4">
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{med.category}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-200 rounded-full h-1.5 w-20">
                          <div
                            className={`h-1.5 rounded-full ${med.stock === 0 ? 'bg-red-500' : med.stock <= med.minStock ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            style={{ width: `${Math.min((med.stock / (med.minStock * 3)) * 100, 100)}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold text-slate-700 whitespace-nowrap">{med.stock} {med.unit}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-500">{med.minStock}</td>
<td className="px-4 py-4 text-sm font-semibold text-slate-700">{formatINR2(med.price)}</td>
                    <td className="px-4 py-4">
                      <span className={`text-xs font-medium ${new Date(med.expiryDate) < new Date() ? 'text-red-600 font-bold' : 'text-slate-600'}`}>
                        {med.expiryDate}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-500">{med.location}</td>
                    <td className="px-4 py-4">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColors[med.status]}`}>
                        {med.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-1">
                        <button onClick={() => setViewMed(med)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors"><Eye className="w-4 h-4" /></button>
                        <button className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-500 transition-colors"><Edit2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orders Table */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Order ID', 'Patient', 'Doctor', 'Date', 'Medicines', 'Total', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded-lg">{order.id}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center text-xs font-bold text-rose-700 flex-shrink-0">
                          {order.patientName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-sm font-semibold text-slate-700">{order.patientName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">{order.doctorName}</td>
                    <td className="px-5 py-4 text-sm text-slate-600">{order.date}</td>
                    <td className="px-5 py-4">
                      <div className="space-y-0.5">
                        {order.medicines.map((m, i) => (
                          <p key={i} className="text-xs text-slate-600">
                            {m.medicineName} × {m.quantity}
                          </p>
                        ))}
                      </div>
                    </td>
<td className="px-5 py-4 text-sm font-bold text-slate-800">{formatINR2(order.total)}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${orderStatusColors[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {order.status === 'Pending' && (
                        <button onClick={() => dispenseOrder(order.id)} disabled={dispenseMutation.isPending}
                          className="px-3 py-1.5 bg-emerald-500 text-white text-xs font-semibold rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                          {dispenseMutation.isPending ? 'Dispensing...' : 'Dispense'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Medicine Detail Modal */}
      {viewMed && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setViewMed(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-5 rounded-t-2xl text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold">{viewMed.name}</h3>
                  <p className="text-rose-200 text-sm">{viewMed.genericName}</p>
                </div>
                <button onClick={() => setViewMed(null)} className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-5 grid grid-cols-2 gap-3">
              {[
                { label: 'Category', value: viewMed.category },
                { label: 'Manufacturer', value: viewMed.manufacturer },
                { label: 'Batch No.', value: viewMed.batchNumber },
{ label: 'Unit Price', value: formatINR2(viewMed.price) },
                { label: 'Current Stock', value: `${viewMed.stock} ${viewMed.unit}` },
                { label: 'Min. Stock', value: `${viewMed.minStock} ${viewMed.unit}` },
                { label: 'Expiry Date', value: viewMed.expiryDate },
                { label: 'Location', value: viewMed.location },
              ].map(({ label, value }) => (
                <div key={label} className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">{value}</p>
                </div>
              ))}
              <div className="col-span-2">
                <span className={`text-sm font-bold px-3 py-1.5 rounded-full ${statusColors[viewMed.status]}`}>
                  {viewMed.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
