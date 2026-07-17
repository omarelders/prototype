import React, { useState } from 'react';
import { useAppState } from '../../../shared/context/AppState';
import { 
  LayoutDashboard, 
  BookOpen, 
  FileSpreadsheet, 
  Globe, 
  ArrowLeft,
  GraduationCap,
  Menu,
  X,

} from 'lucide-react';

interface PortalLayoutProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  children: React.ReactNode;
}

const navTabs = [
  { id: 'dashboard', label: { en: 'Dashboard', ar: 'الرئيسية' }, icon: LayoutDashboard },
  { id: 'lessons', label: { en: 'My Lessons', ar: 'دروسي' }, icon: BookOpen },
  { id: 'exams', label: { en: 'Exams & Results', ar: 'الاختبارات' }, icon: FileSpreadsheet },
];

export default function StudentPortalLayout({ activeTab, setActiveTab, children }: PortalLayoutProps) {
  const { currentLanguage, setLanguage, setRole, teacherProfile } = useAppState();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const t = {
    brand: currentLanguage === 'en' ? `${teacherProfile.name} Academy` : `أكاديمية ${teacherProfile.name}`,
    backTeacher: currentLanguage === 'en' ? 'Back to Teacher Dashboard' : 'العودة للوحة تحكم المعلم',
    logout: currentLanguage === 'en' ? 'Log Out' : 'تسجيل الخروج',
    languageToggle: currentLanguage === 'en' ? 'العربية' : 'English',
  };

  return (
    <div className="min-h-screen bg-slate-50/80 flex relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-300/30 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-violet-300/30 blur-[100px] pointer-events-none" />
      
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 glass-panel bg-white/70 backdrop-blur-xl border-r border-white/40 flex-shrink-0 z-20">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl text-white">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 text-lg">{teacherProfile.name}</h2>
              <p className="text-xs text-slate-500 font-medium">{t.brand}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  isActive 
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200 hover:shadow-indigo-300' 
                    : 'text-slate-600 hover:bg-white hover:shadow-sm hover:-translate-y-0.5'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.label[currentLanguage]}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200/50 space-y-2">
          <button
            onClick={() => setLanguage(currentLanguage === 'en' ? 'ar' : 'en')}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-white hover:shadow-sm hover:-translate-y-0.5 transition-all"
          >
            <Globe className="h-5 w-5 text-indigo-500" />
            <span>{t.languageToggle}</span>
          </button>

          <button
            onClick={() => setRole('teacher')}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-white hover:shadow-sm hover:-translate-y-0.5 transition-all"
          >
            <ArrowLeft className="h-5 w-5 text-violet-500" />
            <span>{t.backTeacher}</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          
          <aside className="relative flex flex-col w-64 bg-white h-full max-w-xs shadow-xl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-600 p-2 rounded-xl text-white">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <span className="font-extrabold text-slate-900">{teacherProfile.name}</span>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-500 hover:text-slate-800"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
              {navTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                    <button
                      key={tab.id}
                      onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                        isActive 
                          ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg' 
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label[currentLanguage]}</span>
                  </button>
                );
              })}
            </nav>

            <div className="p-4 border-t border-slate-100 space-y-2">
              <button
            onClick={() => setLanguage(currentLanguage === 'en' ? 'ar' : 'en')}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100"
            aria-label={currentLanguage === 'en' ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية'}
          >
            <Globe className="h-5 w-5" />
            <span>{t.languageToggle}</span>
          </button>

          <button
            onClick={() => setRole('teacher')}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100"
            aria-label={t.backTeacher}
          >
                <ArrowLeft className="h-5 w-5" />
                <span>{t.backTeacher}</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        {/* Top Header */}
        <header className="glass-panel sticky top-0 z-30 bg-white/70 backdrop-blur-xl border-b border-white/50 px-4 lg:px-8 py-4 flex items-center justify-between flex-shrink-0 shadow-sm shadow-slate-200/20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-500">
              <span>{currentLanguage === 'en' ? 'Learning Portal' : 'بوابة التعلم'}</span>
              <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-mono border border-slate-200">
                {teacherProfile.subdomain}.amalbila.com
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setLanguage(currentLanguage === 'en' ? 'ar' : 'en')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              <Globe className="h-4 w-4" />
              <span>{t.languageToggle}</span>
            </button>

            <button
              onClick={() => setRole('teacher')}
              className="hidden sm:flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-md transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{t.backTeacher}</span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 pb-20 lg:pb-8" id="main-content">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-2 z-40">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                aria-label={tab.label[currentLanguage]}
                aria-current={isActive ? 'page' : undefined}
                className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-all duration-300 ${
                  isActive 
                    ? 'text-indigo-600 scale-110' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px] font-semibold">{tab.label[currentLanguage]}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}