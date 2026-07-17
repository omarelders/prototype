import React from 'react';
import { useAppState } from '../../../shared/context/AppState';
import { Users, DollarSign, Activity, GraduationCap, TrendingUp, ArrowRight, UserCheck, Link2 } from 'lucide-react';

export default function AdminHome({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const { globalTeachers, students, affiliates, affiliatePayouts } = useAppState();

  const totalRevenue = globalTeachers.reduce((acc, t) => acc + (t.revenueGenerated ?? 0), 0);
  const activeTeachers = globalTeachers.filter(t => t.status === 'active').length;
  const activeStudents = students.filter(s => s.status === 'active').length;
  const pendingPayouts = affiliatePayouts.filter(p => p.status !== 'paid').length;

  const chartData = [
    { day: 'Mon', amount: 1200 },
    { day: 'Tue', amount: 2100 },
    { day: 'Wed', amount: 800 },
    { day: 'Thu', amount: 1500 },
    { day: 'Fri', amount: 3200 },
    { day: 'Sat', amount: 4100 },
    { day: 'Sun', amount: 2800 },
  ];
  const maxChartVal = Math.max(...chartData.map(d => d.amount));

  const recentActivity = [
    { icon: UserCheck, color: 'text-indigo-500 bg-indigo-50', label: 'New teacher registered', sub: 'Dr. Mohamed Shaker joined', time: '2h ago' },
    { icon: Users, color: 'text-emerald-500 bg-emerald-50', label: 'New affiliate onboarded', sub: 'Kareem Mostafa (KAREEM26)', time: '5h ago' },
    { icon: DollarSign, color: 'text-amber-500 bg-amber-50', label: 'Payout processed', sub: '1,200 EGP sent to affiliate', time: '1d ago' },
    { icon: GraduationCap, color: 'text-rose-500 bg-rose-50', label: 'Student milestone', sub: '14 students now active', time: '1d ago' },
    { icon: Link2, color: 'text-violet-500 bg-violet-50', label: 'Referral conversion', sub: 'Referral code KAREEM26 used', time: '2d ago' },
  ];

  const quickActions = [
    { label: 'Manage Teachers', tab: 'teachers', color: 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100' },
    { label: 'View Students', tab: 'students', color: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100' },
    { label: 'Affiliate Program', tab: 'affiliates', color: 'bg-rose-600 hover:bg-rose-700 shadow-rose-100' },
    { label: 'Process Payouts', tab: 'affiliates-payouts', color: 'bg-amber-600 hover:bg-amber-700 shadow-amber-100' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Platform Overview</h1>
          <p className="text-slate-500 font-semibold text-sm mt-1">Key metrics and recent activity across the entire platform.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          {quickActions.map(a => (
            <button
              key={a.tab}
              onClick={() => onNavigate(a.tab)}
              className={`${a.color} text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-md transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-1.5`}
            >
              {a.label}
              <ArrowRight className="h-3 w-3" />
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-indigo-100 p-2.5 rounded-xl text-indigo-600">
              <Users className="h-5 w-5" />
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Teachers</p>
          </div>
          <h3 className="text-3xl font-black text-slate-800">{globalTeachers.length}</h3>
          <p className="text-xs text-emerald-600 font-bold mt-1">{activeTeachers} active</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-emerald-100 p-2.5 rounded-xl text-emerald-600">
              <GraduationCap className="h-5 w-5" />
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Students</p>
          </div>
          <h3 className="text-3xl font-black text-slate-800">{students.length}</h3>
          <p className="text-xs text-emerald-600 font-bold mt-1">{activeStudents} active</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-amber-100 p-2.5 rounded-xl text-amber-600">
              <DollarSign className="h-5 w-5" />
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Revenue</p>
          </div>
          <h3 className="text-3xl font-black text-slate-800">{(totalRevenue / 1000).toFixed(0)}K</h3>
          <p className="text-xs text-slate-400 font-bold mt-1">EGP generated</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-rose-100 p-2.5 rounded-xl text-rose-600">
              <TrendingUp className="h-5 w-5" />
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Affiliates</p>
          </div>
          <h3 className="text-3xl font-black text-slate-800">{affiliates.length}</h3>
          <p className={`text-xs font-bold mt-1 ${pendingPayouts > 0 ? 'text-amber-500' : 'text-slate-400'}`}>
            {pendingPayouts > 0 ? `${pendingPayouts} payout(s) pending` : 'No pending payouts'}
          </p>
        </div>
      </div>

      {/* Chart + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-black text-slate-800 flex items-center gap-2">
              <Activity className="h-4 w-4 text-rose-500" />
              Platform Revenue (7 Days)
            </h3>
            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">Last 7 Days</span>
          </div>
          <div className="flex-1 flex items-end gap-2 sm:gap-4 h-52">
            {chartData.map((d, i) => {
              const heightPct = maxChartVal > 0 ? (d.amount / maxChartVal) * 100 : 0;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded whitespace-nowrap">
                    {d.amount.toLocaleString()} EGP
                  </div>
                  <div className="w-full relative flex items-end h-full bg-slate-50 rounded-t-lg border-b-2 border-rose-100">
                    <div
                      className="w-full bg-gradient-to-t from-rose-500 to-pink-400 rounded-t-sm transition-all duration-700 ease-out"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            {recentActivity.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl flex-shrink-0 ${item.color}`}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-700 truncate">{item.label}</p>
                    <p className="text-[11px] text-slate-400 truncate">{item.sub}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold flex-shrink-0 mt-0.5">{item.time}</span>
                </div>
              );
            })}
          </div>

          {/* Quick actions (mobile) */}
          <div className="sm:hidden mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
            {quickActions.map(a => (
              <button
                key={a.tab}
                onClick={() => onNavigate(a.tab)}
                className={`${a.color} text-white px-2 py-1.5 rounded-lg text-[11px] font-bold shadow-sm transition-all`}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
