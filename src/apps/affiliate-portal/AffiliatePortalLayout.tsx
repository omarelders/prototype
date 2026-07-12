import React, { useState } from 'react';
import { useAppState } from '../../shared/context/AppState';
import {
  Home,
  DollarSign,
  TrendingUp,
  Image,
  LogOut,
  Menu,
  X,
  Link as LinkIcon
} from 'lucide-react';

interface LayoutProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  children: React.ReactNode;
}

function SidebarContent({ activeTab, setActiveTab, onClose, setRole }: any) {
  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: Home },
    { id: 'links', label: 'Referral Links', icon: LinkIcon },
    { id: 'earnings', label: 'Earnings & Payouts', icon: DollarSign },
    { id: 'marketing', label: 'Marketing Assets', icon: Image },
  ];

  return (
    <>
      {onClose && (
        <div className="absolute top-4 right-4 lg:hidden">
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="h-6 w-6" />
          </button>
        </div>
      )}

      {/* Brand */}
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="bg-emerald-500 p-2 rounded-lg text-white">
          <TrendingUp className="h-5 w-5" />
        </div>
        <span className="font-extrabold text-white text-lg tracking-tight">
          Affiliate Portal
        </span>
      </div>

      <div className="px-6 py-4 border-b border-slate-800">
        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Influencer</p>
        <h4 className="text-sm font-bold text-white mt-1 truncate">Kareem Mostafa</h4>
      </div>

      {/* Navigation list */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const isSelected = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (onClose) onClose();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${isSelected
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                  : 'hover:bg-slate-800/60 hover:text-slate-200'
                }`}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer actions */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <button
          onClick={() => {
            setRole('visitor');
            if (onClose) onClose();
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-800/60 hover:text-rose-400 transition-all text-left"
        >
          <LogOut className="h-4 w-4" />
          <span>Log Out</span>
        </button>
      </div>
    </>
  );
}

export default function AffiliatePortalLayout({ activeTab, setActiveTab, children }: LayoutProps) {
  const { setRole } = useAppState();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-slate-400 border-r border-slate-800 flex-shrink-0">
        <SidebarContent 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          setRole={setRole} 
        />
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative flex flex-col w-64 bg-slate-900 text-slate-400 border-r border-slate-800 h-full max-w-xs animate-slide-in">
            <SidebarContent 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              onClose={() => setSidebarOpen(false)} 
              setRole={setRole} 
            />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-slate-200 px-4 lg:px-8 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-mono border border-slate-200 shadow-sm">
                Partner Dashboard
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-slate-50 relative">
          {children}
        </main>
      </div>
    </div>
  );
}
