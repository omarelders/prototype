import React, { useState } from 'react';
import { useAppState } from '../../../shared/context/AppState';
import { CreditCard, Smartphone, CheckCircle2, Zap, Building2, Store } from 'lucide-react';

export default function PaymentGateways() {
  const { currentLanguage } = useAppState();

  const dict = {
    en: {
      title: "Payment Gateways Configuration",
      subtitle: "Enable and manage the payment methods available for your students to purchase subscriptions.",
      gateways: {
        vodafone: "Vodafone Cash",
        vodafoneDesc: "Mobile wallet transfers via 010 numbers",
        card: "Credit / Debit Cards",
        cardDesc: "Accept Visa, Mastercard, and Meeza",
        instapay: "Instapay",
        instapayDesc: "Instant bank transfers using mobile or UPI",
        fawry: "Fawry Pay",
        fawryDesc: "Cash payments via Fawry retail outlets"
      },
      status: {
        active: "Active",
        inactive: "Inactive",
        setup: "Setup Required"
      },
      btnSave: "Save Configuration"
    },
    ar: {
      title: "إعدادات بوابات الدفع",
      subtitle: "قم بتفعيل وإدارة طرق الدفع المتاحة للطلاب لشراء الاشتراكات والملازم.",
      gateways: {
        vodafone: "فودافون كاش",
        vodafoneDesc: "تحويلات المحافظ الإلكترونية للأرقام",
        card: "البطاقات البنكية",
        cardDesc: "قبول مدفوعات فيزا، ماستركارد وميزة",
        instapay: "إنستاباي Instapay",
        instapayDesc: "التحويل البنكي اللحظي المباشر",
        fawry: "فوري Fawry",
        fawryDesc: "الدفع النقدي عبر منافذ فوري وماكينات POS"
      },
      status: {
        active: "مفعل",
        inactive: "معطل",
        setup: "يحتاج إعداد"
      },
      btnSave: "حفظ الإعدادات"
    }
  };

  const t = dict[currentLanguage];

  const [gateways, setGateways] = useState([
    { id: 'vodafone', active: true, icon: Smartphone, color: 'text-red-500', bg: 'bg-red-50', name: t.gateways.vodafone, desc: t.gateways.vodafoneDesc, status: t.status.active },
    { id: 'card', active: true, icon: CreditCard, color: 'text-indigo-600', bg: 'bg-indigo-50', name: t.gateways.card, desc: t.gateways.cardDesc, status: t.status.active },
    { id: 'instapay', active: false, icon: Zap, color: 'text-emerald-500', bg: 'bg-emerald-50', name: t.gateways.instapay, desc: t.gateways.instapayDesc, status: t.status.inactive },
    { id: 'fawry', active: true, icon: Store, color: 'text-amber-500', bg: 'bg-amber-50', name: t.gateways.fawry, desc: t.gateways.fawryDesc, status: t.status.active },
  ]);

  const toggleGateway = (id: string) => {
    setGateways(prev => prev.map(g => g.id === id ? { ...g, active: !g.active, status: !g.active ? t.status.active : t.status.inactive } : g));
  };

  return (
    <div className="space-y-6 text-left animate-fade-in max-w-5xl">
      <div className="space-y-1">
        <h2 className="text-lg font-black text-slate-900">{t.title}</h2>
        <p className="text-xs text-slate-500 font-semibold">{t.subtitle}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {gateways.map((gateway) => {
          const Icon = gateway.icon;
          return (
            <div key={gateway.id} className={`p-5 rounded-2xl border transition-all ${gateway.active ? 'border-indigo-500 bg-indigo-50/30 shadow-md shadow-indigo-100' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className={`p-3 rounded-xl ${gateway.bg} ${gateway.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">{gateway.name}</h3>
                    <p className="text-[11px] text-slate-500 font-medium mt-1 leading-relaxed max-w-[200px]">{gateway.desc}</p>
                    
                    {gateway.active && (
                      <div className="flex items-center gap-1.5 mt-3 text-[10px] font-bold text-emerald-600 bg-emerald-50 w-max px-2 py-1 rounded-md">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>{gateway.status}</span>
                      </div>
                    )}
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={gateway.active} onChange={() => toggleGateway(gateway.id)} />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              {gateway.active && (
                <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end">
                  <button className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors bg-white border border-indigo-100 px-3 py-1.5 rounded-lg shadow-sm">
                    {currentLanguage === 'en' ? 'Configure API Keys' : 'إعداد بيانات الربط'}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="pt-4 flex justify-end">
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-md shadow-indigo-200 transition-all">
          {t.btnSave}
        </button>
      </div>
    </div>
  );
}
