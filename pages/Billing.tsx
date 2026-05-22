import { useState } from 'react';
import { Search, Eye, Plus, Download, X, IndianRupee, CreditCard, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { formatINR2, formatINR } from '../utils/money';
import { Bill } from '../types';
import { useBills, useMarkBillPaid } from '../src/hooks/useBills';

const statusIcons = {
  'Paid': CheckCircle,
  'Pending': Clock,
  'Overdue': AlertCircle,
  'Partial': CreditCard,
};

const statusColors: Record<string, string> = {
  'Paid': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Pending': 'bg-amber-100 text-amber-700 border-amber-200',
  'Overdue': 'bg-red-100 text-red-700 border-red-200',
  'Partial': 'bg-blue-100 text-blue-700 border-blue-200',
};

export default function Billing() {
  const { data: bills = [], isLoading, error } = useBills();
  const markPaidMutation = useMarkBillPaid();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewBill, setViewBill] = useState<Bill | null>(null);

  const filtered = bills.filter(b => {
    const matchSearch = b.patientName.toLowerCase().includes(search.toLowerCase()) || b.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalRevenue = bills.reduce((sum, b) => sum + b.paid, 0);
  const totalPending = bills.filter(b => b.status !== 'Paid').reduce((sum, b) => sum + (b.total - b.paid), 0);
  const totalBilled = bills.reduce((sum, b) => sum + b.total, 0);

  const markPaid = (id: string) => {
    markPaidMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-700 rounded animate-pulse" />
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
            <p className="font-semibold text-red-700">Error loading bills</p>
            <p className="text-sm text-red-600">{(error as Error).message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-5">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Billed', value: formatINR(totalBilled), icon: IndianRupee, color: 'from-slate-500 to-slate-600', sub: `${bills.length} invoices` },
          { label: 'Total Collected', value: formatINR(totalRevenue), icon: CheckCircle, color: 'from-emerald-500 to-emerald-600', sub: `${bills.filter(b => b.status === 'Paid').length} paid` },
          { label: 'Pending Amount', value: formatINR(totalPending), icon: Clock, color: 'from-amber-500 to-amber-600', sub: `${bills.filter(b => b.status === 'Pending').length} pending` },
          { label: 'Overdue', value: `${bills.filter(b => b.status === 'Overdue').length}`, icon: AlertCircle, color: 'from-rose-500 to-rose-600', sub: 'Overdue invoices' },
        ].map(({ label, value, icon: Icon, color, sub }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-800">{value}</p>
                <p className="text-xs text-slate-500">{label}</p>
              </div>
            </div>
            <p className="text-xs text-slate-400">{sub}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-3 flex-1 w-full sm:w-auto">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search bills..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30" />
          </div>
          <div className="flex gap-2">
            {['All', 'Paid', 'Pending', 'Overdue', 'Partial'].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-3 py-2 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap ${statusFilter === s ? 'bg-amber-500 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-amber-500/25">
          <Plus className="w-4 h-4" /> New Invoice
        </button>
      </div>

      {/* Bills Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Invoice', 'Patient', 'Date', 'Due Date', 'Amount', 'Paid', 'Balance', 'Insurance', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(bill => {
                const balance = bill.total - bill.paid;
                const StatusIcon = statusIcons[bill.status];
                return (
                  <tr key={bill.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded-lg">{bill.id}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-xs font-bold text-amber-700 flex-shrink-0">
                          {bill.patientName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-sm font-semibold text-slate-700 whitespace-nowrap">{bill.patientName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600 whitespace-nowrap">{bill.date}</td>
                    <td className="px-5 py-4 text-sm text-slate-600 whitespace-nowrap">{bill.dueDate}</td>
<td className="px-5 py-4 text-sm font-bold text-slate-800">{formatINR2(bill.total)}</td>
                    <td className="px-5 py-4 text-sm text-emerald-600 font-semibold">{formatINR2(bill.paid)}</td>
                    <td className="px-5 py-4">
                      <span className={`text-sm font-bold ${balance > 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                        {formatINR2(balance)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {bill.insuranceCoverage > 0 ? (
                        <div>
                          <p className="text-xs text-slate-600 truncate max-w-24">{bill.insurance}</p>
<p className="text-xs text-emerald-600 font-semibold">{formatINR2(bill.insuranceCoverage)}</p>
                        </div>
                      ) : <span className="text-xs text-slate-400">—</span>}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full border w-fit ${statusColors[bill.status]}`}>
                        <StatusIcon className="w-3 h-3" />
                        {bill.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setViewBill(bill)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors" title="View">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors" title="Download">
                          <Download className="w-4 h-4" />
                        </button>
                        {bill.status !== 'Paid' && (
                          <button onClick={() => markPaid(bill.id)} disabled={markPaidMutation.isPending} className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-semibold hover:bg-emerald-100 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed">
                            {markPaidMutation.isPending ? 'Marking...' : 'Mark Paid'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <IndianRupee className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No bills found</p>
            </div>
          )}
        </div>
      </div>

      {/* Bill Detail Modal */}
      {viewBill && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setViewBill(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            {/* Invoice Header */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-6 rounded-t-2xl text-white">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                      <IndianRupee className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-lg font-bold">Apex Health Care</span>
                  </div>
                  <p className="text-slate-400 text-sm">Hospital Management System</p>
                </div>
                <button onClick={() => setViewBill(null)} className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex justify-between items-end mt-4">
                <div>
                  <p className="text-slate-400 text-xs uppercase tracking-wider">Invoice</p>
                  <p className="text-2xl font-bold">{viewBill.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-400 text-xs">Bill Date: {viewBill.date}</p>
                  <p className="text-slate-400 text-xs">Due Date: {viewBill.dueDate}</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Patient & Insurance */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Bill To</p>
                  <p className="text-sm font-bold text-slate-800">{viewBill.patientName}</p>
                  <p className="text-xs text-slate-500">{viewBill.insurance}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Insurance Coverage</p>
<p className="text-sm font-bold text-emerald-600">{formatINR2(viewBill.insuranceCoverage)}</p>
                  <p className="text-xs text-slate-500">{viewBill.paymentMethod}</p>
                </div>
              </div>

              {/* Items */}
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase mb-2">Services & Items</p>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Description</th>
                        <th className="text-right px-4 py-2 text-xs font-semibold text-slate-500">Qty</th>
                        <th className="text-right px-4 py-2 text-xs font-semibold text-slate-500">Price</th>
                        <th className="text-right px-4 py-2 text-xs font-semibold text-slate-500">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {viewBill.items.map((item, i) => (
                        <tr key={i}>
                          <td className="px-4 py-2.5">
                            <p className="text-slate-800">{item.description}</p>
                            <span className="text-xs text-slate-400">{item.category}</span>
                          </td>
                          <td className="px-4 py-2.5 text-right text-slate-600">{item.quantity}</td>
<td className="px-4 py-2.5 text-right text-slate-600">{formatINR2(item.unitPrice)}</td>
                          <td className="px-4 py-2.5 text-right font-semibold text-slate-800">{formatINR2(item.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totals */}
              <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                {[
                  { label: 'Subtotal', value: viewBill.subtotal },
                  { label: 'GST / Tax', value: viewBill.tax },
                  { label: 'Discount', value: -viewBill.discount, negative: true },
                ].map(({ label, value, negative }) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-slate-600">{label}</span>
                    <span className={`font-semibold ${negative ? 'text-emerald-600' : 'text-slate-800'}`}>
{negative ? '-' : ''}{formatINR2(Math.abs(value))}
                    </span>
                  </div>
                ))}
                <div className="border-t border-slate-200 pt-2 flex justify-between">
                  <span className="font-bold text-slate-800">Total</span>
<span className="font-bold text-lg text-slate-900">{formatINR2(viewBill.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 text-sm">Amount Paid</span>
<span className="font-semibold text-emerald-600">{formatINR2(viewBill.paid)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-700">Balance Due</span>
                  <span className={`font-bold text-lg ${viewBill.total - viewBill.paid > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
{formatINR2(viewBill.total - viewBill.paid)}
                  </span>
                </div>
              </div>

              <span className={`inline-flex items-center gap-1 text-sm font-bold px-3 py-1.5 rounded-full border ${statusColors[viewBill.status]}`}>
                {viewBill.status}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
