import React, { useState } from 'react';
import { useAppState } from '../../shared/context/AppState';
import {
  Home,
  Users,
  GraduationCap,
  Briefcase,
  Layers,
  LogOut,
  Menu,
  X,
  DollarSign,
  BarChart3,
  Settings,
  Bell,
  ChevronRight
} from 'lucide-react';

interface LayoutProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  children: React.ReactNode;
}

function SidebarContent({ activeTab, setActiveTab, onClose, setRole, currentLanguage }: any) {
  const { globalTeachers, affiliatePayouts, affiliates } = useAppState();

  const suspendedTeachers = globalTeachers.filter(t => t.status === 'suspended').length;
  const pendingPayouts = affiliatePayouts.filter(p => p.status !== 'paid').length;
  const totalBadge = suspendedTeachers + pendingPayouts;

  const platformNav = [
    { id: 'dashboard', label: 'Platform Home', icon: Home },
    { id: 'teachers', label: 'Teachers Directory', icon: Briefcase, badge: suspendedTeachers > 0 ? suspendedTeachers : undefined },
    { id: 'students', label: 'Global Students', icon: GraduationCap },
  ];

  const affiliateNav = [
    { id: 'affiliates', label: 'Affiliate Overview', icon: BarChart3 },
    { id: 'affiliates-list', label: 'Manage Affiliates', icon: Users },
    { id: 'affiliates-payouts', label: 'Payouts Processing', icon: DollarSign, badge: pendingPayouts > 0 ? pendingPayouts : undefined },
  ];

  const NavItem = ({ item }: { item: typeof platformNav[0] }) => {
    const Icon = item.icon;
    const isSelected = activeTab === item.id;
    return (
      <button
        key={item.id}
        onClick={() => {
          setActiveTab(item.id);
          if (onClose) onClose();
        }}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all group ${
          isSelected
            ? 'bg-rose-600 text-white shadow-md shadow-rose-900/30'
            : 'hover:bg-slate-800/60 hover:text-slate-200 text-slate-400'
        }`}
      >
        <Icon className="h-4 w-4 flex-shrink-0" />
        <span className="truncate flex-1 text-left">{item.label}</span>
        {(item as any).badge && (
          <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full flex-shrink-0 ${
            isSelected ? 'bg-white/20 text-white' : 'bg-rose-500 text-white'
          }`}>
            {(item as any).badge}
          </span>
        )}
        {isSelected && <ChevronRight className="h-3.5 w-3.5 flex-shrink-0 opacity-60" />}
      </button>
    );
  };

  return (
    <>
      {onClose && (
        <div className="absolute top-4 right-4 lg:hidden">
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>
      )}

      {/* Brand */}
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="bg-rose-500 p-2 rounded-xl text-white shadow-lg shadow-rose-900/50">
          <Layers className="h-5 w-5" />
        </div>
        <div>
          <span className="font-extrabold text-white text-base tracking-tight block">Admin Portal</span>
          <span className="text-[10px] text-rose-400 font-bold uppercase tracking-widest">Superadmin</span>
        </div>
        {totalBadge > 0 && (
          <div className="ml-auto flex-shrink-0">
            <span className="flex items-center justify-center h-5 w-5 bg-rose-500 text-white text-[10px] font-black rounded-full">
              {totalBadge}
            </span>
          </div>
        )}
      </div>

      {/* Admin identity */}
      <div className="px-5 py-3 border-b border-slate-800/60 flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white text-xs font-black flex-shrink-0">
          PM
        </div>
        <div className="min-w-0">
          <h4 className="text-xs font-bold text-white truncate">Platform Manager</h4>
          <p className="text-[10px] text-slate-500 font-mono">Level 0 Access</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-5 space-y-4 overflow-y-auto">
        {/* Platform section */}
        <div>
          <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest px-3 mb-2">Platform</p>
          <div className="space-y-1">
            {platformNav.map(item => <NavItem key={item.id} item={item} />)}
          </div>
        </div>

        {/* Affiliate section */}
        <div>
          <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest px-3 mb-2">Affiliate Program</p>
          <div className="space-y-1">
            {affiliateNav.map(item => <NavItem key={item.id} item={item} />)}
          </div>
        </div>

        {/* System */}
        <div>
          <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest px-3 mb-2">System</p>
          <div className="space-y-1">
            <button
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-800/60 hover:text-slate-200 text-slate-500 transition-all opacity-60 cursor-not-allowed"
              disabled
            >
              <Settings className="h-4 w-4 flex-shrink-0" />
              <span className="truncate flex-1 text-left">Settings</span>
              <span className="text-[9px] font-bold bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded">Soon</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={() => {
            setRole('visitor');
            if (onClose) onClose();
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold hover:bg-rose-900/40 hover:text-rose-400 transition-all text-left text-slate-400"
        >
          <LogOut className="h-4 w-4" />
          <span>Log Out</span>
        </button>
      </div>
    </>
  );
}

export default function AdminDashboardLayout({ activeTab, setActiveTab, children }: LayoutProps) {
  const { currentLanguage, setRole, affiliatePayouts, globalTeachers } = useAppState();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const suspendedTeachers = globalTeachers.filter(t => t.status === 'suspended').length;
  const pendingPayouts = affiliatePayouts.filter(p => p.status !== 'paid').length;
  const totalBadge = suspendedTeachers + pendingPayouts;

  const tabTitles: Record<string, string> = {
    dashboard: 'Platform Home',
    teachers: 'Teachers Directory',
    students: 'Global Students',
    affiliates: 'Affiliate Overview',
    'affiliates-list': 'Manage Affiliates',
    'affiliates-payouts': 'Payouts Processing',
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-slate-400 border-r border-slate-800 flex-shrink-0">
        <SidebarContent
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setRole={setRole}
          currentLanguage={currentLanguage}
        />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative flex flex-col w-64 bg-slate-900 text-slate-400 border-r border-slate-800 h-full max-w-xs">
            <SidebarContent
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onClose={() => setSidebarOpen(false)}
              setRole={setRole}
              currentLanguage={currentLanguage}
            />
          </aside>
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top header */}
        <header className="bg-white border-b border-slate-200 px-4 lg:px-8 py-3 flex items-center justify-between flex-shrink-0 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h2 className="font-black text-slate-700 text-sm">{tabTitles[activeTab] ?? 'Admin Portal'}</h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span className="bg-rose-50 text-rose-700 px-2.5 py-1 rounded-md font-bold border border-rose-200">
                Internal Level 0 Access
              </span>
            </div>
            {/* Notification bell */}
            <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
              <Bell className="h-4 w-4" />
              {totalBadge > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 bg-rose-500 rounded-full" />
              )}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-slate-50 relative">
          {children}
        </main>
      </div>
    </div>
  );
}
