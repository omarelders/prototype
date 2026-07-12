import React, { useState } from 'react';
import { useAppState } from '../../../shared/context/AppState';
import { Search, Plus, X, ChevronDown, Ban, CheckCircle2 } from 'lucide-react';
import { Affiliate } from '../../../shared/types';

// ── Tier Badge ───────────────────────────────────────────────────────────────
function TierBadge({ tierId, commissionTiers }: { tierId: string; commissionTiers: any[] }) {
  const tier = commissionTiers.find(t => t.id === tierId);
  const styles: Record<string, string> = {
    Bronze: 'bg-orange-100 text-orange-700 border-orange-200',
    Silver: 'bg-slate-100 text-slate-600 border-slate-200',
    Gold: 'bg-amber-100 text-amber-700 border-amber-200',
  };
  if (!tier) return null;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${styles[tier.name] ?? 'bg-slate-100 text-slate-600'}`}>
      {tier.name} · {tier.commissionPercent}%
    </span>
  );
}

// ── Add Affiliate Modal ──────────────────────────────────────────────────────
function AddAffiliateModal({ onClose }: { onClose: () => void }) {
  const { addAffiliate, commissionTiers } = useAppState();
  const [form, setForm] = useState({
    name: '',
    email: '',
    type: 'teacher' as Affiliate['type'],
    tierId: commissionTiers[0]?.id ?? '',
  });
  const [saving, setSaving] = useState(false);

  const generateCode = (name: string) =>
    name.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 8) + Math.floor(10 + Math.random() * 89);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setSaving(true);
    setTimeout(() => {
      addAffiliate({
        id: `af-${Date.now()}`,
        name: form.name,
        email: form.email,
        type: form.type,
        referralCode: generateCode(form.name),
        status: 'active',
        tierId: form.tierId,
        joinDate: new Date().toISOString().split('T')[0],
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
          <h2 className="font-black text-slate-800 text-base">New Affiliate</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Sara Mostafa"
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Email *</label>
            <input
              type="email"
              required
              placeholder="affiliate@email.com"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Type</label>
              <div className="relative">
                <select
                  value={form.type}
                  onChange={e => setForm(p => ({ ...p, type: e.target.value as Affiliate['type'] }))}
                  className="w-full appearance-none px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white pr-8"
                >
                  <option value="teacher">Teacher</option>
                  <option value="influencer">Influencer</option>
                  <option value="student">Student</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Commission Tier</label>
              <div className="relative">
                <select
                  value={form.tierId}
                  onChange={e => setForm(p => ({ ...p, tierId: e.target.value }))}
                  className="w-full appearance-none px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white pr-8"
                >
                  {commissionTiers.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.commissionPercent}%)</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-400">
            A referral code will be auto-generated from the name (e.g. <strong>{form.name ? generateCode(form.name) : 'SARAMO27'}</strong>).
          </p>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {saving ? <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Plus className="h-4 w-4" />}
              {saving ? 'Saving...' : 'Add Affiliate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function AffiliatesManager() {
  const { affiliates, commissionTiers, updateAffiliate } = useAppState();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredAffiliates = affiliates.filter(a =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.referralCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleStatus = (affiliate: Affiliate) => {
    updateAffiliate({ ...affiliate, status: affiliate.status === 'active' ? 'suspended' : 'active' });
  };

  return (
    <div className="space-y-6">
      {showAddModal && <AddAffiliateModal onClose={() => setShowAddModal(false)} />}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Affiliates Directory</h1>
          <p className="text-slate-500 font-semibold text-sm mt-1">Manage partner accounts and their commission tiers.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-emerald-100 transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus className="h-4 w-4" />
          New Affiliate
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-wrap gap-3 items-center justify-between">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search affiliates..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <span className="text-xs text-slate-400 font-semibold ml-auto">{filteredAffiliates.length} affiliate{filteredAffiliates.length !== 1 ? 's' : ''}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-4">Affiliate Info</th>
                <th className="p-4 text-center">Type</th>
                <th className="p-4 text-center">Referral Code</th>
                <th className="p-4 text-center">Commission Tier</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Joined</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredAffiliates.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-slate-400 font-medium">
                    No affiliates found.
                  </td>
                </tr>
              ) : filteredAffiliates.map(affiliate => (
                <tr key={affiliate.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-black flex-shrink-0">
                        {affiliate.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">{affiliate.name}</div>
                        <div className="text-xs text-slate-500">{affiliate.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider capitalize">
                      {affiliate.type}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <code className="bg-emerald-50 text-emerald-800 font-mono px-2 py-1 rounded border border-emerald-200 text-xs font-bold">
                      {affiliate.referralCode}
                    </code>
                  </td>
                  <td className="p-4 text-center">
                    <TierBadge tierId={affiliate.tierId} commissionTiers={commissionTiers} />
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      affiliate.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {affiliate.status}
                    </span>
                  </td>
                  <td className="p-4 text-center text-slate-500 font-medium text-xs">{affiliate.joinDate}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => toggleStatus(affiliate)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all border ${
                        affiliate.status === 'active'
                          ? 'border-rose-200 text-rose-600 hover:bg-rose-50'
                          : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                      }`}
                    >
                      {affiliate.status === 'active' ? (
                        <span className="flex items-center gap-1"><Ban className="h-3 w-3" /> Suspend</span>
                      ) : (
                        <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Activate</span>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
