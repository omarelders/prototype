import React, { useMemo } from 'react';
import { useAppState } from '../../shared/context/AppState';
import { TrendingUp, Link as LinkIcon, DollarSign, Users, MousePointerClick, ArrowUpRight, BarChart3, Copy, CheckCircle2 } from 'lucide-react';

export default function AffiliateDashboard() {
  const { affiliates, referrals, affiliatePayouts } = useAppState();
  const [copied, setCopied] = React.useState(false);
  
  // Fake current affiliate for demo
  const currentAffiliate = affiliates[0] || { id: 'a-1', name: 'Demo Affiliate', referralCode: 'DEMO2026', commissionRate: 20 };

  const myReferrals = referrals.filter(r => r.affiliateId === currentAffiliate.id);
  const myPayouts = affiliatePayouts.filter(p => p.affiliateId === currentAffiliate.id);

  const totalEarnings = myPayouts.reduce((acc, p) => acc + p.amount, 0);
  const pendingEarnings = myReferrals.reduce((acc, r) => r.status === 'pending' ? acc + r.commissionEarned : acc, 0);

  // Mock funnel data
  const totalClicks = myReferrals.length * 15; // Fake a 1:15 conversion rate
  const signups = myReferrals.length;
  const conversionRate = totalClicks > 0 ? ((signups / totalClicks) * 100).toFixed(1) : '0';

  // Mock chart data (last 7 days earnings)
  const chartData = useMemo(() => {
    return [
      { day: 'Mon', amount: 150 },
      { day: 'Tue', amount: 320 },
      { day: 'Wed', amount: 210 },
      { day: 'Thu', amount: 0 },
      { day: 'Fri', amount: 480 },
      { day: 'Sat', amount: 650 },
      { day: 'Sun', amount: 290 },
    ];
  }, []);
  const maxChartVal = Math.max(...chartData.map(d => d.amount), 1);

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://amalbila.com/signup?ref=${currentAffiliate.referralCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header & Link */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Welcome back, {currentAffiliate.name}</h1>
          <p className="text-slate-500 font-semibold text-sm mt-1">Here's what's happening with your affiliate campaigns today.</p>
        </div>

        <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2 max-w-md w-full lg:w-auto">
          <div className="bg-emerald-50 text-emerald-600 p-2 rounded-lg">
            <LinkIcon className="h-4 w-4" />
          </div>
          <code className="text-xs font-mono font-bold text-slate-700 flex-1 px-2 truncate">
            amalbila.com/?ref={currentAffiliate.referralCode}
          </code>
          <button 
            onClick={handleCopy}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              copied ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {copied ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Earnings</p>
              <h3 className="text-2xl font-black text-slate-800 mt-1">{totalEarnings} <span className="text-sm">EGP</span></h3>
            </div>
            <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-emerald-600">
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span>+12.5% from last month</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pending Payouts</p>
              <h3 className="text-2xl font-black text-slate-800 mt-1">{pendingEarnings} <span className="text-sm">EGP</span></h3>
            </div>
            <div className="p-2.5 bg-amber-100 text-amber-600 rounded-xl">
              <BarChart3 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-slate-400">
            <span>Next payout in 5 days</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Signups</p>
              <h3 className="text-2xl font-black text-slate-800 mt-1">{signups}</h3>
            </div>
            <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-xl">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-emerald-600">
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span>+3 new this week</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Conversion Rate</p>
              <h3 className="text-2xl font-black text-slate-800 mt-1">{conversionRate}%</h3>
            </div>
            <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl">
              <MousePointerClick className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-slate-400">
            <span>{totalClicks} total link clicks</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Earnings Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-black text-slate-800 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              Earnings Over Time
            </h3>
            <select className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600 rounded-lg px-2 py-1">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          
          <div className="flex-1 flex items-end gap-2 sm:gap-4 mt-auto min-h-[200px]">
            {chartData.map((d, i) => {
              const heightPct = maxChartVal > 0 ? (d.amount / maxChartVal) * 100 : 0;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                    {d.amount}
                  </div>
                  <div className="w-full relative flex items-end h-full min-h-[140px] bg-slate-50 rounded-t-lg border-b-2 border-emerald-100">
                    <div 
                      className="w-full bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t-sm transition-all duration-700 ease-out"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Commission Tier Progress */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="font-black text-slate-800 mb-1">Your Commission Tier</h3>
          <p className="text-[11px] font-semibold text-slate-400 mb-6">Unlock higher rates by referring more users.</p>
          
          <div className="flex-1 flex flex-col justify-center items-center py-4">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="#10b981" strokeWidth="8" strokeDasharray="282.7" strokeDashoffset={282.7 * (1 - 0.75)} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-slate-800">{currentAffiliate.commissionRate}%</span>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Rate</span>
              </div>
            </div>
            <p className="text-xs font-bold text-slate-600 mt-6 text-center">
              Silver Tier <span className="text-slate-400 font-normal">·</span> 75% to Gold
            </p>
            <p className="text-[10px] text-slate-400 font-medium text-center mt-2 px-4">
              Refer 5 more teachers to upgrade to Gold (25% commission).
            </p>
          </div>
        </div>
      </div>

      {/* Recent Referrals Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-black text-slate-800 text-sm">Recent Referrals</h3>
          <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-white border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <th className="p-4">Referred User</th>
                <th className="p-4 text-center">Date</th>
                <th className="p-4 text-center">Amount</th>
                <th className="p-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {myReferrals.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-400 text-xs font-semibold">
                    No referrals yet. Share your link to get started!
                  </td>
                </tr>
              ) : (
                myReferrals.map(ref => (
                  <tr key={ref.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-800">{ref.referredUserId}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">Subscription Signup</div>
                    </td>
                    <td className="p-4 text-center text-slate-500 font-medium text-xs">{ref.date}</td>
                    <td className="p-4 text-center font-bold text-emerald-600">+{ref.commissionEarned} EGP</td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-1 rounded border text-[9px] font-bold uppercase tracking-wider ${
                        ref.status === 'paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                      }`}>
                        {ref.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
