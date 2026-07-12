import React, { useState } from 'react';
import { useAppState } from '../../shared/context/AppState';
import { DollarSign, Clock, CheckCircle2, MessageCircle, AlertCircle, ChevronRight } from 'lucide-react';

const WHATSAPP_NUMBER = '201001234567'; // Replace with real business number

function getStatusBadge(status: string) {
  if (status === 'paid')
    return <span className="px-2 py-1 rounded border text-[9px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border-emerald-100">Paid</span>;
  if (status === 'processing')
    return <span className="px-2 py-1 rounded border text-[9px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 border-blue-100">Processing</span>;
  return <span className="px-2 py-1 rounded border text-[9px] font-bold uppercase tracking-wider bg-amber-50 text-amber-600 border-amber-100">Pending</span>;
}

export default function EarningsPayouts() {
  const { affiliates, referrals, affiliatePayouts } = useAppState();
  const currentAffiliate = affiliates[0] || { id: 'a-1', name: 'Kareem Mostafa', referralCode: 'KAREEM26', commissionRate: 20 };

  const myReferrals = referrals.filter(r => r.affiliateId === currentAffiliate.id);
  const myPayouts = affiliatePayouts.filter(p => p.affiliateId === currentAffiliate.id);

  const totalPaid = myPayouts.filter(p => p.status === 'paid').reduce((acc, p) => acc + p.amount, 0);
  const pendingEarnings = myReferrals.filter(r => r.status === 'pending').reduce((acc, r) => acc + r.commissionEarned, 0);

  // Mock upcoming payout
  const upcomingPayout = pendingEarnings > 0 ? pendingEarnings : 840;

  const [requested, setRequested] = useState(false);

  const handleRequestPayout = () => {
    const msg = encodeURIComponent(
      `مرحبا، أنا ${currentAffiliate.name} (كود: ${currentAffiliate.referralCode})\n\nأريد طلب صرف عمولتي المستحقة:\n💰 المبلغ: ${upcomingPayout} EGP\n\nشكراً!`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
    setRequested(true);
    setTimeout(() => setRequested(false), 5000);
  };

  // Mock full history if no real payouts
  const mockHistory = [
    { id: 'p1', date: '2026-07-01', amount: 1200, status: 'paid', note: 'June batch' },
    { id: 'p2', date: '2026-06-01', amount: 850, status: 'paid', note: 'May batch' },
    { id: 'p3', date: '2026-05-01', amount: 620, status: 'paid', note: 'April batch' },
  ];
  const displayHistory = myPayouts.length > 0 ? myPayouts : mockHistory;

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Earnings & Payouts</h1>
        <p className="text-slate-500 font-semibold text-sm mt-1">Track your commissions and request your payout via WhatsApp.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Paid Out</p>
              <p className="text-2xl font-black text-slate-800 mt-1">{totalPaid > 0 ? totalPaid : 2670} <span className="text-sm font-semibold text-slate-400">EGP</span></p>
            </div>
            <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <p className="text-[10px] font-semibold text-slate-400 mt-3">All-time earnings received</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pending Balance</p>
              <p className="text-2xl font-black text-slate-800 mt-1">{upcomingPayout} <span className="text-sm font-semibold text-slate-400">EGP</span></p>
            </div>
            <div className="p-2.5 bg-amber-100 text-amber-600 rounded-xl">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <p className="text-[10px] font-semibold text-amber-500 mt-3">Ready to request payout</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Commission Rate</p>
              <p className="text-2xl font-black text-slate-800 mt-1">{currentAffiliate.commissionRate}%</p>
            </div>
            <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-xl">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <p className="text-[10px] font-semibold text-slate-400 mt-3">Silver Tier · Upgrade at 20 referrals</p>
        </div>
      </div>

      {/* Payout Request */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-[#25D366]/10 to-emerald-50 px-6 py-4 border-b border-slate-100">
          <h2 className="font-black text-slate-800 flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-[#25D366]" />
            Request Payout via WhatsApp
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">Payouts are processed manually via our WhatsApp support. Tap below to send a pre-filled message.</p>
        </div>
        <div className="p-6">
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl mb-5">
            <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-amber-700 font-medium leading-relaxed">
              <strong>Minimum payout:</strong> 500 EGP · <strong>Processing time:</strong> 1–3 business days · <strong>Method:</strong> Vodafone Cash / InstaPay
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-5 font-mono text-xs text-slate-600 leading-relaxed whitespace-pre-line">
            {`مرحبا، أنا ${currentAffiliate.name} (كود: ${currentAffiliate.referralCode})
أريد طلب صرف عمولتي المستحقة:
💰 المبلغ: ${upcomingPayout} EGP

شكراً!`}
          </div>

          <button
            onClick={handleRequestPayout}
            className={`w-full flex items-center justify-center gap-3 py-3.5 rounded-xl text-white text-sm font-black transition-all shadow-lg ${
              requested
                ? 'bg-emerald-500 shadow-emerald-200'
                : 'bg-[#25D366] hover:bg-[#20b557] shadow-green-200'
            }`}
          >
            <MessageCircle className="h-5 w-5" />
            {requested ? '✅ WhatsApp Opened — Awaiting Reply' : `Request ${upcomingPayout} EGP Payout on WhatsApp`}
            {!requested && <ChevronRight className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Payout History Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <h3 className="font-black text-slate-800 text-sm">Payout History</h3>
          <span className="text-xs font-bold text-slate-400">{displayHistory.length} records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-white border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <th className="p-4">Date</th>
                <th className="p-4">Note</th>
                <th className="p-4 text-right">Amount</th>
                <th className="p-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {displayHistory.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-400 text-xs font-semibold">
                    No payouts yet — start referring to earn!
                  </td>
                </tr>
              ) : (
                displayHistory.map((p: any) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-slate-500 font-medium text-xs">{p.date}</td>
                    <td className="p-4 text-slate-600 text-xs font-medium">{p.note || 'Affiliate commission batch'}</td>
                    <td className="p-4 text-right font-black text-emerald-600">+{p.amount} EGP</td>
                    <td className="p-4 text-center">{getStatusBadge(p.status)}</td>
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
