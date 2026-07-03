import React from 'react';
import { useAppState } from '../../../shared/context/AppState';
import { Package, Plus, Check, MoreVertical, Zap } from 'lucide-react';

export default function PricingPlans() {
  const { currentLanguage } = useAppState();

  const dict = {
    en: {
      title: "Platform Subscription",
      subtitle: "Manage your platform subscription tier to unlock more AI credits and bandwidth.",
      monthly: "/month",
      active: "Current Plan",
      features: "Included Features:",
      btnUpgrade: "Upgrade Plan"
    },
    ar: {
      title: "اشتراك المنصة",
      subtitle: "إدارة اشتراكك في المنصة للحصول على المزيد من رصيد الذكاء الاصطناعي وسعة الرفع.",
      monthly: "/شهر",
      active: "الخطة الحالية",
      features: "المميزات المشمولة:",
      btnUpgrade: "ترقية الخطة"
    }
  };

  const t = dict[currentLanguage];

  const plans = [
    {
      name: currentLanguage === 'en' ? 'Basic Plan' : 'الباقة الأساسية',
      price: 2000,
      period: t.monthly,
      popular: false,
      isActive: true,
      features: [
        currentLanguage === 'en' ? 'Up to 200 active students' : 'حتى 200 طالب نشط',
        currentLanguage === 'en' ? '20 GB Video Bandwidth' : '20 جيجابايت سعة رفع الفيديوهات',
        currentLanguage === 'en' ? '1000 AI Generation Credits' : '1000 رصيد للذكاء الاصطناعي',
        currentLanguage === 'en' ? 'Standard student portal' : 'بوابة الطالب الأساسية'
      ]
    },
    {
      name: currentLanguage === 'en' ? 'Pro Plan' : 'الباقة الاحترافية',
      price: 3000,
      period: t.monthly,
      popular: true,
      isActive: false,
      features: [
        currentLanguage === 'en' ? 'Up to 500 active students' : 'حتى 500 طالب نشط',
        currentLanguage === 'en' ? '50 GB Video Bandwidth' : '50 جيجابايت سعة رفع الفيديوهات',
        currentLanguage === 'en' ? '2000 AI Generation Credits' : '2000 رصيد للذكاء الاصطناعي',
        currentLanguage === 'en' ? 'Detailed performance stats' : 'إحصائيات أداء تفصيلية'
      ]
    },
    {
      name: currentLanguage === 'en' ? 'Premium Academy' : 'الأكاديمية الممتازة',
      price: 4000,
      period: t.monthly,
      popular: false,
      isActive: false,
      features: [
        currentLanguage === 'en' ? 'Up to 1000 active students' : 'حتى 1000 طالب نشط',
        currentLanguage === 'en' ? '200 GB Video Bandwidth' : '200 جيجابايت سعة رفع الفيديوهات',
        currentLanguage === 'en' ? '5000 AI Generation Credits' : '5000 رصيد للذكاء الاصطناعي',
        currentLanguage === 'en' ? 'Priority Support' : 'دعم فني مخصص'
      ]
    }
  ];

  return (
    <div className="space-y-6 text-left animate-fade-in max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-lg font-black text-slate-900">{t.title}</h2>
          <p className="text-xs text-slate-500 font-semibold">{t.subtitle}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {plans.map((plan, idx) => (
          <div key={idx} className={`relative bg-white rounded-2xl border ${plan.popular ? 'border-indigo-500 shadow-xl shadow-indigo-100' : 'border-slate-200 shadow-sm'} p-6 flex flex-col`}>
            {plan.popular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white text-[9px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full">
                {currentLanguage === 'en' ? 'Most Popular' : 'الأكثر مبيعاً'}
              </div>
            )}

            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${plan.popular ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-600'}`}>
                {plan.popular ? <Zap className="h-6 w-6" /> : <Package className="h-6 w-6" />}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-extrabold text-lg text-slate-900 mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900">{plan.price}</span>
                <span className="text-sm font-bold text-slate-400">ج.م{plan.period}</span>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t.features}</p>
              <ul className="space-y-3">
                {plan.features.map((feature, fidx) => (
                  <li key={fidx} className="flex items-start gap-2.5 text-xs font-medium text-slate-600">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
              {plan.isActive ? (
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-md w-full justify-center border border-emerald-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  {t.active}
                </span>
              ) : (
                <button className={`w-full text-xs font-bold py-2.5 rounded-lg transition-colors ${plan.popular ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                  {t.btnUpgrade}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
