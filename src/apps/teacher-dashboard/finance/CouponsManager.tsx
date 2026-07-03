import React from 'react';
import { useAppState } from '../../../shared/context/AppState';
import { Tag, Plus, Copy, Trash2 } from 'lucide-react';

export default function CouponsManager() {
  const { currentLanguage } = useAppState();

  const dict = {
    en: {
      title: "Coupons & Discounts",
      subtitle: "Create promotional codes for marketing campaigns or special students.",
      btnNew: "Create Coupon",
      table: {
        code: "Promo Code",
        discount: "Discount",
        usage: "Usage Limit",
        expiry: "Expiry Date",
        status: "Status"
      }
    },
    ar: {
      title: "الكوبونات والخصومات",
      subtitle: "إنشاء أكواد ترويجية للحملات التسويقية أو خصومات للطلاب المتميزين.",
      btnNew: "إنشاء كوبون جديد",
      table: {
        code: "كود الخصم",
        discount: "قيمة الخصم",
        usage: "حد الاستخدام",
        expiry: "تاريخ الانتهاء",
        status: "الحالة"
      }
    }
  };

  const t = dict[currentLanguage];

  const coupons = [
    { code: 'VIP2026', discount: '20%', usage: '15 / 50', expiry: '2026-12-31', status: 'active' },
    { code: 'SUMMER50', discount: '50 EGP', usage: '120 / 200', expiry: '2026-08-31', status: 'active' },
    { code: 'FREE100', discount: '100%', usage: '5 / 5', expiry: '2026-06-01', status: 'expired' },
  ];

  return (
    <div className="space-y-6 text-left animate-fade-in max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-lg font-black text-slate-900">{t.title}</h2>
          <p className="text-xs text-slate-500 font-semibold">{t.subtitle}</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-200">
          <Plus className="h-4 w-4" />
          <span>{t.btnNew}</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-extrabold text-slate-500 tracking-wider">
              <tr>
                <th className="px-6 py-4">{t.table.code}</th>
                <th className="px-6 py-4">{t.table.discount}</th>
                <th className="px-6 py-4">{t.table.usage}</th>
                <th className="px-6 py-4">{t.table.expiry}</th>
                <th className="px-6 py-4">{t.table.status}</th>
                <th className="px-6 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {coupons.map((coupon, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-indigo-500" />
                      <span className="font-mono font-black text-slate-900 bg-slate-100 px-2 py-1 rounded border border-slate-200 tracking-widest">{coupon.code}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-black text-indigo-600">{coupon.discount}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500" style={{ width: `${(parseInt(coupon.usage.split(' / ')[0]) / parseInt(coupon.usage.split(' / ')[1])) * 100}%` }}></div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500">{coupon.usage}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[11px] text-slate-500">{coupon.expiry}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider border ${
                      coupon.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}>
                      {coupon.status === 'active' ? (currentLanguage === 'en' ? 'Active' : 'نشط') : (currentLanguage === 'en' ? 'Expired' : 'منتهي')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Copy Code">
                        <Copy className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete Coupon">
                        <Trash2 className="h-4 w-4" />
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
