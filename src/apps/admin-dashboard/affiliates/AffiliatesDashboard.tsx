import React from 'react';
import { useAppState } from '../../../shared/context/AppState';
import { Users, TrendingUp, DollarSign, Award, Crown, Zap } from 'lucide-react';

const tierStyles: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  Bronze: { bg: 'bg-orange-50 border-orange-200', text: 'text-orange-700', icon: <Award className="h-4 w-4 text-orange-500" /> },
  Silver: { bg: 'bg-slate-50 border-slate-200', text: 'text-slate-600', icon: <Zap className="h-4 w-4 text-slate-500" /> },
  Gold: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', icon: <Crown className="h-4 w-4 text-amber-500" /> },
};

export default function AffiliatesDashboard() {
  const { affiliates, referrals, affiliatePayouts, commissionTiers } = useAppState();

  const totalEarnings = affiliatePayouts.reduce((acc, p) => acc + p.amount, 0);
  const pendingPayouts = affiliatePayouts.filter(p => p.status !== 'paid').length;

  const chartData = [
    { month: 'Jan', amount: 4500 },
    { month: 'Feb', amount: 5200 },
    { month: 'Mar', amount: 3800 },
    { month: 'Apr', amount: 7100 },
    { month: 'May', amount: 6500 },
    { month: 'Jun', amount: 8900 },
  ];
  const maxChartVal = Math.max(...chartData.map(d => d.amount));

  // Build leaderboard - sort affiliates by referral count
  const affiliateStats = affiliates.map(aff => {
    const refCount = referrals.filter(r => r.affiliateId === aff.id).length;
    const earnings = affiliatePayouts.filter(p => p.affiliateId === aff.id).reduce((acc, p) => acc + p.amount, 0);
    return { ...aff, refCount, earnings };
  }).sort((a, b) => b.refCount - a.refCount);

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Affiliate Program Overview</h1>
        <p className="text-slate-500 font-semibold text-sm mt-1">Monitor the performance of your affiliate partners.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-emerald-100 p-2.5 rounded-xl text-emerald-600"><Users className="h-5 w-5" /></div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Affiliates</p>
          </div>
          <h3 className="text-3xl font-black text-slate-800">{affiliates.filter(a => a.status === 'active').length}</h3>
          <p className="text-xs text-slate-400 font-semibold mt-1">{affiliates.length} total</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-indigo-100 p-2.5 rounded-xl text-indigo-600"><TrendingUp className="h-5 w-5" /></div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Referrals</p>
          </div>
          <h3 className="text-3xl font-black text-slate-800">{referrals.length}</h3>
          <p className="text-xs text-slate-400 font-semibold mt-1">All time</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-rose-100 p-2.5 rounded-xl text-rose-600"><DollarSign className="h-5 w-5" /></div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Paid Commissions</p>
          </div>
          <h3 className="text-3xl font-black text-slate-800">{(totalEarnings / 1000).toFixed(1)}K</h3>
          <p className="text-xs text-slate-400 font-semibold mt-1">EGP total</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-amber-100 p-2.5 rounded-xl text-amber-600"><Award className="h-5 w-5" /></div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Payouts</p>
          </div>
          <h3 className="text-3xl font-black text-slate-800">{pendingPayouts}</h3>
          <p className="text-xs text-slate-400 font-semibold mt-1">Awaiting processing</p>
        </div>
      </div>

      {/* Chart + Commission Tiers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-black text-slate-800 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              Total Commissions Paid Out
            </h3>
            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">Last 6 Months</span>
          </div>
          <div className="flex-1 flex items-end gap-2 sm:gap-6 h-52">
            {chartData.map((d, i) => {
              const heightPct = maxChartVal > 0 ? (d.amount / maxChartVal) * 100 : 0;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded whitespace-nowrap">
                    {d.amount.toLocaleString()} EGP
                  </div>
                  <div className="w-full relative flex items-end h-full bg-slate-50 rounded-t-lg border-b-2 border-emerald-100">
                    <div
                      className="w-full bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t-sm transition-all duration-700 ease-out"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{d.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Commission Tiers Table */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2">
            <Crown className="h-4 w-4 text-amber-500" />
            Commission Tiers
          </h3>
          <div className="space-y-3">
            {commissionTiers.map(tier => {
              const style = tierStyles[tier.name] ?? tierStyles.Bronze;
              return (
                <div key={tier.id} className={`p-3 rounded-xl border ${style.bg} flex items-center gap-3`}>
                  <div>{style.icon}</div>
                  <div className="flex-1">
                    <div className={`font-black text-sm ${style.text}`}>{tier.name}</div>
                    <div className="text-xs text-slate-500">
                      {tier.minReferrals}–{tier.maxReferrals ?? '∞'} referrals
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-black text-lg ${style.text}`}>{tier.commissionPercent}%</div>
                    <div className="text-[10px] text-slate-400">{tier.durationMonths} months</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Affiliates Leaderboard */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-black text-slate-800 flex items-center gap-2">
            <Crown className="h-4 w-4 text-amber-400" />
            Affiliate Leaderboard
          </h3>
          <span className="text-xs text-slate-400 font-semibold">Ranked by referrals</span>
        </div>
        {affiliateStats.length === 0 ? (
          <div className="p-8 text-center text-slate-400 font-medium">No affiliates yet.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {affiliateStats.map((aff, idx) => (
              <div key={aff.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0 ${
                  idx === 0 ? 'bg-amber-100 text-amber-700' :
                  idx === 1 ? 'bg-slate-100 text-slate-600' :
                  idx === 2 ? 'bg-orange-100 text-orange-700' :
                  'bg-slate-50 text-slate-500'
                }`}>
                  {idx + 1}
                </div>
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-black flex-shrink-0">
                  {aff.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-800 truncate">{aff.name}</div>
                  <code className="text-[10px] font-mono text-slate-400">{aff.referralCode}</code>
                </div>
                <div className="text-center">
                  <div className="font-black text-slate-700">{aff.refCount}</div>
                  <div className="text-[10px] text-slate-400 font-semibold">Referrals</div>
                </div>
                <div className="text-right">
                  <div className="font-black text-emerald-600">{aff.earnings.toLocaleString()}</div>
                  <div className="text-[10px] text-slate-400 font-semibold">EGP Earned</div>
                </div>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                  aff.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                }`}>
                  {aff.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
