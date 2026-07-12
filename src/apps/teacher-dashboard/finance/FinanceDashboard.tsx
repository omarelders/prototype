import React, { useState } from 'react';
import { useAppState } from '../../../shared/context/AppState';
import { 
  LineChart, 
  ReceiptText, 
  TicketPercent, 
  PackageSearch 
} from 'lucide-react';

// Import sub-pages
import FinanceStats from './FinanceStats';
import FinancialRecord from './FinancialRecord';
import CouponsManager from './CouponsManager';
import PricingPlans from './PricingPlans';

export default function FinanceDashboard() {
  const { currentLanguage } = useAppState();
  
  // Local state for inner tab routing
  const [activeTab, setActiveTab] = useState<'stats' | 'record' | 'coupons' | 'plans'>('stats');

  const dict = {
    en: {
      tabs: {
        stats: "Financial Statistics",
        record: "Financial Record",
        coupons: "Coupons",
        plans: "Pricing Plans"
      }
    },
    ar: {
      tabs: {
        stats: "الإحصائيات المالية",
        record: "السجل المالي",
        coupons: "الكوبونات",
        plans: "خطط الأسعار"
      }
    }
  };

  const t = dict[currentLanguage].tabs;

  const tabs = [
    { id: 'stats', label: t.stats, icon: LineChart },
    { id: 'record', label: t.record, icon: ReceiptText },
    { id: 'coupons', label: t.coupons, icon: TicketPercent },
    { id: 'plans', label: t.plans, icon: PackageSearch },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Inner Navigation Tabs */}
      <div className="bg-white border border-slate-200 rounded-xl p-1.5 shadow-sm overflow-x-auto no-scrollbar max-w-fit flex">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                isActive 
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200/50' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Renderer */}
      <div className="mt-6">
        {activeTab === 'stats' && <FinanceStats />}
        {activeTab === 'record' && <FinancialRecord />}
        {activeTab === 'coupons' && <CouponsManager />}
        {activeTab === 'plans' && <PricingPlans />}
      </div>
    </div>
  );
}
