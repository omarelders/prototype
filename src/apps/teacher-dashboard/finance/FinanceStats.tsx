import React from 'react';
import { useAppState } from '../../../shared/context/AppState';
import { TrendingUp, Users, DollarSign, Wallet, ArrowUpRight, ArrowDownLeft, FileText } from 'lucide-react';

export default function FinanceStats() {
  const { currentLanguage, students, walletBalance, walletTransactions } = useAppState();

  // Translations
  const dict = {
    en: {
      stats: {
        balance: "Current Net Profit",
        activeSubs: "Paid Subscriptions"
      },
      chartTitle: "Revenue History (June 2026)",
      prepaidWallet: "Prepaid Wallet",
      manageTopUp: "Manage & Top Up",
      egp: "EGP",
      recentTransactions: "Recent Payments (Who Paid What)",
      noTransactions: "No payments recorded yet.",
      tableHeaders: {
        user: "Student / User",
        amount: "Amount",
        reason: "Reason / Service",
        date: "Date"
      }
    },
    ar: {
      stats: {
        balance: "صافي الأرباح الحالية",
        activeSubs: "الاشتراكات المدفوعة"
      },
      chartTitle: "مؤشر حركة الأرباح (يونيو 2026)",
      prepaidWallet: "المحفظة مسبقة الدفع",
      manageTopUp: "إدارة وشحن الرصيد",
      egp: "ج.م",
      recentTransactions: "أحدث المدفوعات",
      noTransactions: "لا توجد مدفوعات مسجلة بعد.",
      tableHeaders: {
        user: "الطالب / المستخدم",
        amount: "المبلغ",
        reason: "السبب / الخدمة",
        date: "التاريخ"
      }
    }
  };

  const t = dict[currentLanguage];

  // Derived calculations
  const activeStudents = students.filter(s => s.status === 'active').length;
  const teacherMonthlyFee = 150;
  const totalProfit = activeStudents * teacherMonthlyFee;

  // Mock revenue chart coordinates for SVG drawing
  const chartPoints = [
    { x: 30, y: 150, val: currentLanguage === 'en' ? "Week 1" : "الأسبوع 1", rev: 1200 },
    { x: 130, y: 120, val: currentLanguage === 'en' ? "Week 2" : "الأسبوع 2", rev: 3500 },
    { x: 230, y: 90, val: currentLanguage === 'en' ? "Week 3" : "الأسبوع 3", rev: 6200 },
    { x: 330, y: 60, val: currentLanguage === 'en' ? "Week 4" : "الأسبوع 4", rev: 9800 },
    { x: 450, y: 30, val: currentLanguage === 'en' ? "Week 5" : "الأسبوع 5", rev: 12480 }
  ];

  // Compile coordinates string for SVG line/area
  const pathD = `M ${chartPoints.map(p => `${p.x} ${p.y}`).join(' L ')}`;
  const areaD = `${pathD} L ${chartPoints[chartPoints.length - 1].x} 170 L ${chartPoints[0].x} 170 Z`;

  // Mock student transactions if walletTransactions is empty
  const defaultTransactions = [
    { id: '1', type: 'activation', amount: 150, studentName: 'أحمد محمود', date: '2026-06-25', method: 'Vodafone Cash', service: 'اشتراك شهري (فيزياء)' },
    { id: '2', type: 'activation', amount: 300, studentName: 'سارة خالد', date: '2026-06-26', method: 'Credit Card', service: 'باقة شهرين (كيمياء)' },
    { id: '3', type: 'activation', amount: 150, studentName: 'محمد علي', date: '2026-06-27', method: 'Instapay', service: 'اشتراك شهري (فيزياء)' },
    { id: '4', type: 'activation', amount: 450, studentName: 'ياسين عمر', date: '2026-06-28', method: 'Fawry', service: 'باقة الترم الأول' },
  ];

  const transactionsList = walletTransactions && walletTransactions.length > 0
    ? walletTransactions.map(tx => ({
      id: tx.id,
      type: tx.type,
      amount: tx.amount,
      studentName: tx.type === 'activation' ? tx.studentName : 'المعلم',
      date: tx.date,
      method: tx.paymentMethod || 'Wallet',
      service: tx.type === 'activation' ? 'تفعيل اشتراك' : 'إيداع محفظة'
    }))
    : defaultTransactions;

  return (
    <div className="space-y-6 text-left animate-fade-in">
      {/* Overview Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between transition-transform hover:scale-105 cursor-default">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.stats.balance}</span>
            <p className="text-2xl font-black text-slate-900">{totalProfit} {t.egp}</p>
          </div>
          <div className="bg-emerald-50 p-3.5 rounded-xl text-emerald-600">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between transition-transform hover:scale-105 cursor-default">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.stats.activeSubs}</span>
            <p className="text-2xl font-black text-slate-900">{activeStudents}</p>
          </div>
          <div className="bg-indigo-50 p-3.5 rounded-xl text-indigo-600">
            <Users className="h-5 w-5" />
          </div>
        </div>

        {/* Teacher Wallet Balance Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between transition-transform hover:scale-105 cursor-default">
          <div className="space-y-1 flex-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t.prepaidWallet}
            </span>
            <p className="text-2xl font-black text-indigo-600 font-mono">{walletBalance} {t.egp}</p>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-wallet-modal'))}
              className="text-[10px] font-extrabold text-indigo-500 hover:text-indigo-700 hover:underline flex items-center gap-1 mt-1 transition-all"
            >
              <span>{t.manageTopUp}</span>
            </button>
          </div>
          <div className="bg-indigo-50 p-3.5 rounded-xl text-indigo-600">
            <Wallet className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Custom SVG Line Chart representation */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 lg:col-span-2">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4 text-indigo-600" />
            <span>{t.chartTitle}</span>
          </h3>

          <div className="w-full bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center justify-center">
            {/* Native SVG Chart */}
            <svg viewBox="0 0 500 200" className="w-full max-h-[250px]">
              {/* Background grids */}
              <line x1="30" y1="30" x2="450" y2="30" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="30" y1="70" x2="450" y2="70" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="30" y1="110" x2="450" y2="110" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="30" y1="150" x2="450" y2="150" stroke="#f1f5f9" strokeWidth="1" />

              {/* Area filled gradient */}
              <path d={areaD} fill="rgba(99, 102, 241, 0.08)" />

              {/* Sparkline curve */}
              <path d={pathD} fill="none" stroke="#4361ee" strokeWidth="2.5" strokeLinecap="round" />

              {/* Plot points circles & labels */}
              {chartPoints.map((pt, index) => (
                <g key={index}>
                  <circle cx={pt.x} cy={pt.y} r="4" fill="#ffffff" stroke="#4361ee" strokeWidth="2.5" />
                  <text x={pt.x} y="185" fontSize="8" textAnchor="middle" fill="#94a3b8" className="font-sans font-bold">
                    {pt.val}
                  </text>
                  <text x={pt.x} y={pt.y - 10} fontSize="7.5" textAnchor="middle" fill="#475569" className="font-mono font-bold">
                    {pt.rev} {t.egp}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Recent Transactions List */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 lg:col-span-1 flex flex-col">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
            <FileText className="h-4 w-4 text-indigo-600" />
            <span>{t.recentTransactions}</span>
          </h3>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {transactionsList.length === 0 ? (
              <div className="text-center text-slate-400 py-6 text-[10px] font-semibold">
                {t.noTransactions}
              </div>
            ) : (
              transactionsList.map((tx, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200/50 rounded-xl p-3 flex justify-between items-center text-xs transition-colors hover:bg-slate-100">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${tx.type === 'deposit' ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'
                      }`}>
                      {tx.type === 'deposit' ? (
                        <ArrowDownLeft className="h-4 w-4" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-slate-800 font-bold text-xs truncate max-w-[120px]">
                        {tx.studentName}
                      </p>
                      <span className="text-[9px] text-slate-500 font-medium block mt-0.5 truncate max-w-[120px]">
                        {tx.service}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`font-mono font-black ${tx.type === 'deposit' ? 'text-emerald-600' : 'text-slate-800'
                      }`}>
                      {tx.type === 'deposit' ? '+' : ''}{tx.amount} {t.egp}
                    </span>
                    <span className="text-[9px] text-slate-400 font-medium block mt-0.5">{tx.date}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
