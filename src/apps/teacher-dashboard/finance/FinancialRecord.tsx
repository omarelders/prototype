import React, { useState } from 'react';
import { useAppState } from '../../../shared/context/AppState';
import { Search, Filter, Download, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export default function FinancialRecord() {
  const { currentLanguage } = useAppState();

  const dict = {
    en: {
      title: "Financial Record & Ledger",
      subtitle: "Complete transaction history of all payments, withdrawals, and platform fees.",
      searchPlaceholder: "Search transactions by ID or student name...",
      filter: "Filter",
      export: "Export CSV",
      table: {
        id: "Txn ID",
        date: "Date & Time",
        type: "Type",
        method: "Method",
        amount: "Amount",
        status: "Status",
        student: "Student"
      },
      status: {
        completed: "Completed",
        pending: "Pending",
        failed: "Failed"
      }
    },
    ar: {
      title: "السجل المالي والمعاملات",
      subtitle: "سجل كامل لجميع حركات الدفع، السحوبات، ورسوم المنصة.",
      searchPlaceholder: "ابحث برقم العملية أو اسم الطالب...",
      filter: "تصفية",
      export: "تصدير CSV",
      table: {
        id: "رقم العملية",
        date: "التاريخ والوقت",
        type: "النوع",
        method: "وسيلة الدفع",
        amount: "المبلغ",
        status: "الحالة",
        student: "الطالب"
      },
      status: {
        completed: "مكتمل",
        pending: "قيد الانتظار",
        failed: "مرفوض"
      }
    }
  };

  const t = dict[currentLanguage];

  // Mock transactions
  const transactions = [
    { id: 'TXN-98231', date: '2026-06-28 14:30', type: 'income', method: 'Vodafone Cash', amount: 150, status: 'completed', student: 'أحمد محمود' },
    { id: 'TXN-98230', date: '2026-06-28 10:15', type: 'income', method: 'Credit Card', amount: 300, status: 'completed', student: 'سارة خالد' },
    { id: 'TXN-98229', date: '2026-06-27 18:45', type: 'income', method: 'Fawry', amount: 450, status: 'pending', student: 'ياسين عمر' },
    { id: 'TXN-98228', date: '2026-06-26 09:20', type: 'withdrawal', method: 'Bank Transfer', amount: -2500, status: 'completed', student: 'N/A' },
    { id: 'TXN-98227', date: '2026-06-25 16:00', type: 'income', method: 'Instapay', amount: 150, status: 'failed', student: 'محمد علي' },
    { id: 'TXN-98226', date: '2026-06-24 11:30', type: 'fee', method: 'System', amount: -15, status: 'completed', student: 'Platform Fee' },
  ];

  return (
    <div className="space-y-6 text-left animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-lg font-black text-slate-900">{t.title}</h2>
          <p className="text-xs text-slate-500 font-semibold">{t.subtitle}</p>
        </div>
        <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md">
          <Download className="h-4 w-4" />
          <span>{t.export}</span>
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder={t.searchPlaceholder}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
          />
        </div>
        <button className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all shadow-sm whitespace-nowrap">
          <Filter className="h-4 w-4" />
          <span>{t.filter}</span>
        </button>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-extrabold text-slate-500 tracking-wider">
              <tr>
                <th className="px-6 py-4">{t.table.id}</th>
                <th className="px-6 py-4">{t.table.date}</th>
                <th className="px-6 py-4">{t.table.student}</th>
                <th className="px-6 py-4">{t.table.method}</th>
                <th className="px-6 py-4 text-right">{t.table.amount}</th>
                <th className="px-6 py-4 text-center">{t.table.status}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {transactions.map((txn, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-[11px] font-bold text-slate-900">{txn.id}</td>
                  <td className="px-6 py-4 text-[11px] text-slate-500">{txn.date}</td>
                  <td className="px-6 py-4 font-bold">{txn.student}</td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-[10px] font-bold border border-slate-200">
                      {txn.method}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-right font-black font-mono ${
                    txn.amount > 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {txn.amount > 0 ? '+' : ''}{txn.amount} ج.م
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
                      txn.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 
                      txn.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                      'bg-rose-100 text-rose-700'
                    }`}>
                      {t.status[txn.status as keyof typeof t.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination mock */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex justify-between items-center text-[10px] font-bold text-slate-500">
          <span>Showing 1 to 6 of 124 transactions</span>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-white transition-colors bg-slate-100 text-slate-400 cursor-not-allowed">Previous</button>
            <button className="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-white transition-colors bg-white shadow-sm text-slate-700">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
