import React, { useState } from 'react';
import { useAppState } from '../../../shared/context/AppState';
import { Search, CreditCard, CheckCircle2, Plus, X, ChevronDown, AlertTriangle } from 'lucide-react';
import { AffiliatePayout } from '../../../shared/types';

// ── Create Payout Modal ──────────────────────────────────────────────────────
function CreatePayoutModal({ onClose }: { onClose: () => void }) {
  const { affiliates, addAffiliatePayout } = useAppState();
  const [form, setForm] = useState({
    affiliateId: affiliates[0]?.id ?? '',
    amount: '',
    method: 'Bank Transfer',
    period: new Date().toISOString().slice(0, 7), // YYYY-MM
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.affiliateId || !form.amount) return;
    setSaving(true);
    setTimeout(() => {
      addAffiliatePayout({
        id: `pay-${Date.now()}`,
        affiliateId: form.affiliateId,
        amount: Number(form.amount),
        period: form.period,
        method: form.method,
        status: 'pending',
      });
      setSaving(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50">
          <h2 className="font-black text-slate-800 text-base">Create Payout</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Affiliate *</label>
            <div className="relative">
              <select
                value={form.affiliateId}
                onChange={e => setForm(p => ({ ...p, affiliateId: e.target.value }))}
                className="w-full appearance-none px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white pr-8"
                required
              >
                {affiliates.map(a => (
                  <option key={a.id} value={a.id}>{a.name} ({a.referralCode})</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Amount (EGP) *</label>
              <input
                type="number"
                min="1"
                required
                placeholder="0"
                value={form.amount}
                onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Period</label>
              <input
                type="month"
                value={form.period}
                onChange={e => setForm(p => ({ ...p, period: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Payment Method</label>
            <div className="relative">
              <select
                value={form.method}
                onChange={e => setForm(p => ({ ...p, method: e.target.value }))}
                className="w-full appearance-none px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white pr-8"
              >
                <option>Bank Transfer</option>
                <option>Vodafone Cash</option>
                <option>InstaPay</option>
                <option>PayPal</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {saving ? <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Plus className="h-4 w-4" />}
              {saving ? 'Creating...' : 'Create Payout'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function PayoutsManager() {
  const { affiliatePayouts, affiliates, updateAffiliatePayout } = useAppState();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'processing' | 'paid'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredPayouts = affiliatePayouts.filter(p => {
    const affiliate = affiliates.find(a => a.id === p.affiliateId);
    const matchesSearch = affiliate?.name.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingTotal = affiliatePayouts
    .filter(p => p.status !== 'paid')
    .reduce((acc, p) => acc + p.amount, 0);

  const markAsPaid = (payout: AffiliatePayout) => {
    updateAffiliatePayout({ ...payout, status: 'paid' });
  };

  return (
    <div className="space-y-6">
      {showCreateModal && <CreatePayoutModal onClose={() => setShowCreateModal(false)} />}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Payouts Management</h1>
          <p className="text-slate-500 font-semibold text-sm mt-1">Review and process commission payouts for affiliates.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-rose-100 transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus className="h-4 w-4" />
          Create Payout
        </button>
      </div>

      {/* Pending banner */}
      {pendingTotal > 0 && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
          <div>
            <p className="text-sm font-bold text-amber-800">
              {affiliatePayouts.filter(p => p.status !== 'paid').length} payout(s) pending — total <strong>{pendingTotal.toLocaleString()} EGP</strong> awaiting processing.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-wrap gap-3 items-center justify-between">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by affiliate name..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1">
            {(['all', 'pending', 'processing', 'paid'] as const).map(f => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${statusFilter === f ? 'bg-rose-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                {f}
              </button>
            ))}
          </div>
          <button
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg text-xs font-bold transition-colors border border-slate-200"
          >
            <CreditCard className="h-4 w-4" />
            Export Bank Format
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-4">Affiliate</th>
                <th className="p-4 text-center">Period</th>
                <th className="p-4 text-center">Amount</th>
                <th className="p-4 text-center">Method</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredPayouts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-slate-400 font-medium">
                    No payouts found. {affiliates.length === 0 ? 'Add an affiliate first.' : 'Create one using the button above.'}
                  </td>
                </tr>
              ) : (
                filteredPayouts.map(payout => {
                  const affiliate = affiliates.find(a => a.id === payout.affiliateId);
                  return (
                    <tr key={payout.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white text-xs font-black flex-shrink-0">
                            {affiliate?.name.charAt(0) ?? '?'}
                          </div>
                          <div>
                            <div className="font-bold text-slate-800">{affiliate?.name ?? 'Unknown'}</div>
                            <div className="text-[10px] font-mono text-slate-400">{affiliate?.referralCode}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center font-semibold text-slate-600">{payout.period}</td>
                      <td className="p-4 text-center">
                        <span className="font-black text-slate-800">{payout.amount.toLocaleString()}</span>
                        <span className="text-xs text-slate-400 ml-1">EGP</span>
                      </td>
                      <td className="p-4 text-center text-slate-600 text-xs font-semibold">{payout.method}</td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          payout.status === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                          payout.status === 'processing' ? 'bg-amber-100 text-amber-700' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {payout.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {payout.status !== 'paid' && (
                          <button
                            onClick={() => markAsPaid(payout)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                            title="Mark as Paid"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Mark Paid
                          </button>
                        )}
                        {payout.status === 'paid' && (
                          <span className="text-xs text-slate-400 font-semibold">Completed</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
