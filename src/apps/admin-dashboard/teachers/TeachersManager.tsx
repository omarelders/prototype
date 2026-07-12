import React, { useState } from 'react';
import { useAppState } from '../../../shared/context/AppState';
import { Search, Plus, X, ChevronDown, Shield, Star, Zap, Users, DollarSign, Calendar, ExternalLink, Ban, CheckCircle2 } from 'lucide-react';
import { TeacherAccount } from '../../../shared/types';

// ── Tier styling helper ──────────────────────────────────────────────────────
function TierBadge({ tier }: { tier: string }) {
  const styles: Record<string, string> = {
    basic: 'bg-slate-100 text-slate-600 border-slate-200',
    pro: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    enterprise: 'bg-amber-100 text-amber-700 border-amber-200',
  };
  const icons: Record<string, React.ReactNode> = {
    basic: <Shield className="h-3 w-3" />,
    pro: <Star className="h-3 w-3" />,
    enterprise: <Zap className="h-3 w-3" />,
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${styles[tier] || styles.basic}`}>
      {icons[tier] || icons.basic}
      {tier}
    </span>
  );
}

// ── Add Teacher Modal ────────────────────────────────────────────────────────
function AddTeacherModal({ onClose }: { onClose: () => void }) {
  const { addGlobalTeacher } = useAppState();
  const [form, setForm] = useState({ name: '', email: '', specialty: '', subscriptionTier: 'basic' as TeacherAccount['subscriptionTier'] });
  const [saving, setSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setSaving(true);
    setTimeout(() => {
      addGlobalTeacher({
        id: `t-${Date.now()}`,
        name: form.name,
        email: form.email,
        specialty: form.specialty,
        subscriptionTier: form.subscriptionTier,
        status: 'active',
        studentCount: 0,
        revenueGenerated: 0,
        joinDate: new Date().toISOString().split('T')[0],
      });
      setSaving(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-fade-in">
        <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50">
          <h2 className="font-black text-slate-800 text-base">Add New Teacher</h2>
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
              placeholder="e.g. Dr. Ahmed Ibrahim"
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Email Address *</label>
            <input
              type="email"
              required
              placeholder="teacher@email.com"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Specialty / Subject</label>
            <input
              type="text"
              placeholder="e.g. Mathematics"
              value={form.specialty}
              onChange={e => setForm(p => ({ ...p, specialty: e.target.value }))}
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Subscription Tier</label>
            <div className="relative">
              <select
                value={form.subscriptionTier}
                onChange={e => setForm(p => ({ ...p, subscriptionTier: e.target.value as TeacherAccount['subscriptionTier'] }))}
                className="w-full appearance-none px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white pr-8"
              >
                <option value="basic">Basic</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
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
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {saving ? <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Plus className="h-4 w-4" />}
              {saving ? 'Saving...' : 'Add Teacher'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Teacher Drawer ───────────────────────────────────────────────────────────
function TeacherDrawer({ teacher, onClose }: { teacher: TeacherAccount; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col animate-slide-in-right overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50 sticky top-0">
          <h2 className="font-black text-slate-800">Teacher Profile</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-5 flex-1 space-y-5">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xl font-black flex-shrink-0">
              {teacher.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-black text-slate-800 text-base">{teacher.name}</h3>
              <p className="text-sm text-slate-500">{teacher.email}</p>
              <TierBadge tier={teacher.subscriptionTier} />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Students', value: teacher.studentCount, icon: Users, color: 'text-indigo-600 bg-indigo-50' },
              { label: 'Revenue', value: `${(teacher.revenueGenerated / 1000).toFixed(1)}K EGP`, icon: DollarSign, color: 'text-emerald-600 bg-emerald-50' },
              { label: 'Status', value: teacher.status, icon: CheckCircle2, color: 'text-amber-600 bg-amber-50' },
              { label: 'Joined', value: teacher.joinDate, icon: Calendar, color: 'text-rose-600 bg-rose-50' },
            ].map(item => (
              <div key={item.label} className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                <div className={`p-1.5 rounded-lg ${item.color} w-fit mb-2`}>
                  <item.icon className="h-3.5 w-3.5" />
                </div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{item.label}</p>
                <p className="text-sm font-black text-slate-800 capitalize">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Specialty</p>
            <p className="text-sm font-semibold text-slate-700">{teacher.specialty || 'Not specified'}</p>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <button className="w-full flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors">
              <ExternalLink className="h-4 w-4" />
              View Full Teacher Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function TeachersManager() {
  const { globalTeachers, updateGlobalTeacher } = useAppState();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [drawerTeacher, setDrawerTeacher] = useState<TeacherAccount | null>(null);

  const filtered = globalTeachers.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleStatus = (teacher: TeacherAccount) => {
    updateGlobalTeacher({
      ...teacher,
      status: teacher.status === 'active' ? 'suspended' : 'active',
    });
  };

  return (
    <div className="space-y-6">
      {showAddModal && <AddTeacherModal onClose={() => setShowAddModal(false)} />}
      {drawerTeacher && <TeacherDrawer teacher={drawerTeacher} onClose={() => setDrawerTeacher(null)} />}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Teachers Directory</h1>
          <p className="text-slate-500 font-semibold text-sm mt-1">Manage all teacher accounts across the platform.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-indigo-100 transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus className="h-4 w-4" />
          Add New Teacher
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-wrap gap-3 items-center justify-between">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search teachers..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1">
            {(['all', 'active', 'suspended'] as const).map(f => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${statusFilter === f ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                {f}
              </button>
            ))}
          </div>
          <span className="text-xs text-slate-400 font-semibold ml-auto">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-4">Name & Email</th>
                <th className="p-4">Specialty</th>
                <th className="p-4 text-center">Tier</th>
                <th className="p-4 text-center">Students</th>
                <th className="p-4 text-center">Revenue</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-slate-400 font-medium">
                    No teachers match your filters.
                  </td>
                </tr>
              ) : filtered.map(teacher => (
                <tr key={teacher.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-xs font-black flex-shrink-0">
                        {teacher.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">{teacher.name}</div>
                        <div className="text-xs text-slate-500">{teacher.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-slate-600">{teacher.specialty || '—'}</td>
                  <td className="p-4 text-center">
                    <TierBadge tier={teacher.subscriptionTier} />
                  </td>
                  <td className="p-4 text-center font-bold text-slate-700">{teacher.studentCount}</td>
                  <td className="p-4 text-center font-bold text-slate-700">
                    {teacher.revenueGenerated ? `${(teacher.revenueGenerated / 1000).toFixed(1)}K` : '—'}
                    <span className="text-xs text-slate-400 font-semibold ml-1">EGP</span>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      teacher.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                      teacher.status === 'suspended' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {teacher.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setDrawerTeacher(teacher)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors text-xs font-bold"
                        title="View Details"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => toggleStatus(teacher)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all border ${
                          teacher.status === 'active'
                            ? 'border-rose-200 text-rose-600 hover:bg-rose-50'
                            : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                        }`}
                      >
                        {teacher.status === 'active' ? (
                          <span className="flex items-center gap-1"><Ban className="h-3 w-3" /> Suspend</span>
                        ) : (
                          <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Reactivate</span>
                        )}
                      </button>
                    </div>
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
