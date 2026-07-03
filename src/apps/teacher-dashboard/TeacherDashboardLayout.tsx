import React, { useState, useEffect } from 'react';
import { useAppState } from '../../shared/context/AppState';
import {
  Home,
  BookOpen,
  HelpCircle,
  FileSpreadsheet,
  Users,
  Zap,
  Calendar,
  MessageSquare,
  DollarSign,
  BarChart3,
  Settings,
  Globe,
  LogOut,
  Layers,
  ExternalLink,
  Menu,
  X,
  MessageCircleQuestion,
  ChevronRight,
  Wallet,
  CreditCard,
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  Coins,
  PlusCircle
} from 'lucide-react';

interface LayoutProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  children: React.ReactNode;
}

function SidebarContent({ activeTab, setActiveTab, onClose, t, currentLanguage, teacherProfile, navGroups, setRole }: any) {
  return (
    <>
      {onClose && (
        <div className="absolute top-4 right-4 lg:hidden">
          <button onClick={onClose} className="text-slate-400 hover:text-white" aria-label="Close sidebar menu">
            <X className="h-6 w-6" />
          </button>
        </div>
      )}

      {/* Brand */}
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="bg-indigo-500 p-2 rounded-lg text-white">
          <Layers className="h-5 w-5" />
        </div>
        <span className="font-extrabold text-white text-lg tracking-tight">
          {currentLanguage === 'en' ? 'AmalBila' : 'أمل بلا حدود'}
        </span>
      </div>

      {/* Profile info */}
      <div className="px-6 py-4 border-b border-slate-800">
        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{teacherProfile.specialty}</p>
        <h4 className="text-sm font-bold text-white mt-1 truncate">{teacherProfile.name}</h4>
        <span className="text-[10px] text-indigo-400 font-semibold font-mono block mt-1 hover:underline cursor-pointer">
          {teacherProfile.subdomain}.amalbila.com
        </span>
      </div>

      {/* Navigation list */}
      <nav className="flex-1 px-4 py-4 space-y-6 overflow-y-auto">
        {navGroups.map((group: any, idx: number) => (
          <div key={idx} className="space-y-1.5">
            <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">{group.group}</h5>
            {group.items.map((item: any) => {
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
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/30'
                      : 'hover:bg-slate-800/60 hover:text-slate-200'
                    }`}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer actions */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <button
          onClick={() => {
            setRole('student-landing');
            if (onClose) onClose();
          }}
          className="w-full flex items-center justify-center gap-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 hover:text-white px-3 py-2 rounded-lg text-xs font-bold transition-all"
        >
          <span>{t.previewStudent}</span>
          <ExternalLink className="h-3 w-3" />
        </button>

        <button
          onClick={() => {
            setRole('visitor');
            if (onClose) onClose();
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-800/60 hover:text-rose-400 transition-all text-left"
        >
          <LogOut className="h-4 w-4" />
          <span>{t.logout}</span>
        </button>
      </div>
    </>
  );
}

export default function TeacherDashboardLayout({ activeTab, setActiveTab, children }: LayoutProps) {
  const { currentLanguage, setLanguage, setRole, teacherProfile, walletBalance, walletTransactions, depositToWallet } = useAppState();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Wallet Modal states
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'select' | 'payment' | 'success'>('select');
  const [topUpAmount, setTopUpAmount] = useState(500);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'vodafone' | 'fawry' | 'instapay'>('card');
  const [isProcessing, setIsProcessing] = useState(false);

  // Payment form states
  const [cardNumber, setCardNumber] = useState('4000 1234 5678 9010');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('123');
  const [cardHolder, setCardHolder] = useState('Dr. Mohamed Shaker');
  const [phoneWallet, setPhoneWallet] = useState('01012345678');
  const [otpCode, setOtpCode] = useState('123456');
  const [instapayAddress, setInstapayAddress] = useState('shaker@instapay');

  useEffect(() => {
    const handleOpenWallet = () => {
      setShowWalletModal(true);
      setCheckoutStep('select');
    };
    window.addEventListener('open-wallet-modal', handleOpenWallet);
    return () => window.removeEventListener('open-wallet-modal', handleOpenWallet);
  }, []);

  const dict = {
    en: {
      subdomainLabel: "Live Academy:",
      previewStudent: "Student Portal",
      logout: "Log Out",
      menu: {
        dashboard: "Home / Dashboard",
        content: "Content Management",
        questionBank: "Question Bank",
        exams: "Exams Lifecycle",
        students: "Student Accounts",
        activation: "Access Activation",
        calendar: "Schedule Calendar",
        finance: "Finance & Profits",
        analytics: "Advanced Analytics",
        settings: "Platform Settings"
      },
      wallet: {
        badge: "Wallet Balance",
        title: "Teacher Prepaid Wallet",
        topUp: "Top Up Wallet",
        transactions: "Transaction History",
        quickSelect: "Select Amount",
        method: "Payment Method",
        depositBtn: "Proceed to Payment",
        cardNumber: "Card Number",
        expiry: "Expiry Date",
        cvv: "CVV",
        cardHolder: "Cardholder Name",
        payNow: "Pay and Deposit",
        phoneWallet: "Vodafone Cash Number",
        otp: "OTP Code",
        instapayLabel: "Instapay Username / Address",
        fawryLabel: "Fawry Reference Code",
        fawryInstruction: "Please visit any Fawry retail outlet and provide this reference number to complete the payment.",
        successMsg: "Payment Successful! Your wallet has been topped up.",
        recentTx: "Recent Activity",
        depositTx: "Deposit via",
        activationTx: "Activated student",
        noTransactions: "No wallet activity recorded yet.",
        fawrySimulate: "Simulate Cash Payment Receipt"
      }
    },
    ar: {
      subdomainLabel: "الأكاديمية النشطة:",
      previewStudent: "بوابة الطالب",
      logout: "تسجيل الخروج",
      menu: {
        dashboard: "الرئيسية / الإحصائيات",
        content: "إدارة المحتوى والدروس",
        questionBank: "بنك الأسئلة والمحاور",
        exams: "الامتحانات والنتائج",
        students: "إدارة حسابات الطلاب",
        activation: "تفعيل وجدولة المحتوى",
        calendar: "جدول المواعيد والأنشطة",
        finance: "المالية والأرباح",
        analytics: "التحليلات ومستوى الطلاب",
        settings: "إعدادات المنصة"
      },
      wallet: {
        badge: "رصيد المحفظة",
        title: "المحفظة الرقمية مسبقة الدفع",
        topUp: "شحن رصيد المحفظة",
        transactions: "سجل حركات المحفظة",
        quickSelect: "اختر قيمة الشحن",
        method: "طريقة الدفع للشحن",
        depositBtn: "الذهاب لصفحة الدفع",
        cardNumber: "رقم البطاقة الائتمانية",
        expiry: "تاريخ الانتهاء",
        cvv: "الرمز السري (CVV)",
        cardHolder: "اسم صاحب البطاقة",
        payNow: "تأكيد الدفع والإيداع",
        phoneWallet: "رقم محفظة فودافون كاش",
        otp: "رمز التحقق المرسل (OTP)",
        instapayLabel: "عنوان أو اسم حساب إنستاباي",
        fawryLabel: "رقم مرجع فوري الموحد",
        fawryInstruction: "يرجى التوجه لأي منفذ بيع فوري وإعطاؤه الرقم المرجعي لإتمام عملية الإيداع في محفظتك.",
        successMsg: "تم الشحن بنجاح! تم إضافة المبلغ لرصيدك.",
        recentTx: "أحدث العمليات",
        depositTx: "إيداع عبر",
        activationTx: "تفعيل اشتراك الطالب",
        noTransactions: "لا توجد عمليات مسجلة في المحفظة بعد.",
        fawrySimulate: "محاكاة دفع الفاتورة نقدًا"
      }
    }
  };

  const t = dict[currentLanguage];

  // Map tabs to icons and names, with groups
  const navGroups = [
    {
      group: currentLanguage === 'en' ? 'Core' : 'الأساسية',
      items: [
        { id: 'dashboard', label: t.menu.dashboard, icon: Home },
        { id: 'content', label: t.menu.content, icon: BookOpen },
        { id: 'question-bank', label: t.menu.questionBank, icon: HelpCircle },
        { id: 'exams', label: t.menu.exams, icon: FileSpreadsheet },
      ]
    },
    {
      group: currentLanguage === 'en' ? 'Operations' : 'العمليات',
      items: [
        { id: 'students', label: t.menu.students, icon: Users },
        { id: 'activation', label: t.menu.activation, icon: Zap },
        { id: 'calendar', label: t.menu.calendar, icon: Calendar },
      ]
    },
    {
      group: currentLanguage === 'en' ? 'Business' : 'الإدارة',
      items: [
        { id: 'finance', label: t.menu.finance, icon: DollarSign },
        { id: 'analytics', label: t.menu.analytics, icon: BarChart3 },
        { id: 'settings', label: t.menu.settings, icon: Settings }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-slate-400 border-r border-slate-800 flex-shrink-0">
        <SidebarContent 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          t={t} 
          currentLanguage={currentLanguage} 
          teacherProfile={teacherProfile} 
          navGroups={navGroups} 
          setRole={setRole} 
        />
      </aside>

      {/* Sidebar - Mobile drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />

          <aside className="relative flex flex-col w-64 bg-slate-900 text-slate-400 border-r border-slate-800 h-full max-w-xs animate-slide-in">
            <SidebarContent 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              onClose={() => setSidebarOpen(false)} 
              t={t} 
              currentLanguage={currentLanguage} 
              teacherProfile={teacherProfile} 
              navGroups={navGroups} 
              setRole={setRole} 
            />
          </aside>
        </div>
      )}

      {/* Main content viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-4 lg:px-8 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg"
              aria-label="Open sidebar menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span>{t.subdomainLabel}</span>
              <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-mono border border-slate-200 shadow-sm">
                https://{teacherProfile.subdomain}.amalbila.com
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Wallet Balance Badge */}
            <button
              onClick={() => {
                setCheckoutStep('select');
                setShowWalletModal(true);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50/50 text-xs font-bold text-indigo-700 hover:bg-indigo-50 transition-all hover:scale-105 active:scale-100 shadow-sm"
            >
              <Wallet className="h-4 w-4 text-indigo-600 animate-pulse" />
              <span className="hidden sm:inline">{t.wallet.badge}:</span>
              <span className="font-mono">{walletBalance} EGP</span>
            </button>

            {/* Direct toggle language */}
            <button
              onClick={() => setLanguage(currentLanguage === 'en' ? 'ar' : 'en')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              aria-label={currentLanguage === 'en' ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية'}
            >
              <Globe className="h-3.5 w-3.5" />
              <span>{currentLanguage === 'en' ? 'العربية' : 'English'}</span>
            </button>

            <button
              onClick={() => setRole('student-landing')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-100 transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>{t.previewStudent}</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
          </div>
        </header>

        {/* View content container */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-slate-50 relative">
          {children}
        </main>
      </div>

      {/* Contextual Help FAB Widget */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {showHelp && (
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-80 mb-4 overflow-hidden animate-fade-in origin-bottom-right">
            <div className="bg-indigo-600 p-4 text-white flex justify-between items-center">
              <div>
                <h4 className="font-extrabold text-sm flex items-center gap-2">
                  <MessageCircleQuestion className="h-4 w-4" />
                  {currentLanguage === 'en' ? 'AmalBila Help Center' : 'مركز مساعدة أمل بلا حدود'}
                </h4>
                <p className="text-[10px] text-indigo-200 mt-1">
                  {currentLanguage === 'en' ? 'Contextual guide and tutorials' : 'دليل إرشادي ودروس تعليمية'}
                </p>
              </div>
              <button onClick={() => setShowHelp(false)} className="text-indigo-200 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-4 space-y-3 max-h-72 overflow-y-auto text-left">
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs">
                <span className="font-bold text-slate-800 block mb-1">
                  {currentLanguage === 'en' ? 'Current Module: ' : 'الوحدة الحالية: '}
                  <span className="text-indigo-600 uppercase tracking-wider">{activeTab}</span>
                </span>
                <p className="text-slate-500 leading-relaxed font-semibold">
                  {currentLanguage === 'en' 
                    ? "Welcome to this section! Need help configuring your settings or managing content? Check out our quick guides below."
                    : "مرحباً بك في هذا القسم! هل تحتاج إلى مساعدة في ضبط إعداداتك أو إدارة المحتوى؟ اطلع على الأدلة السريعة أدناه."}
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <h5 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider pl-1">
                  {currentLanguage === 'en' ? 'Quick Guides' : 'أدلة سريعة'}
                </h5>
                <button className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-xs font-bold text-slate-700 transition-all flex justify-between items-center">
                  <span>{currentLanguage === 'en' ? 'How to create a new exam' : 'كيفية إنشاء امتحان جديد'}</span>
                  <ChevronRight className="h-3 w-3 text-slate-400" />
                </button>
                <button className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-xs font-bold text-slate-700 transition-all flex justify-between items-center">
                  <span>{currentLanguage === 'en' ? 'Managing student payments' : 'إدارة مدفوعات الطلاب'}</span>
                  <ChevronRight className="h-3 w-3 text-slate-400" />
                </button>
                <button className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-xs font-bold text-slate-700 transition-all flex justify-between items-center">
                  <span>{currentLanguage === 'en' ? 'Contact Support' : 'تواصل مع الدعم الفني'}</span>
                  <ChevronRight className="h-3 w-3 text-slate-400" />
                </button>
              </div>
            </div>
          </div>
        )}
        
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="h-14 w-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center shadow-lg shadow-indigo-900/20 transition-transform hover:scale-105 focus:outline-none focus:ring-4 ring-indigo-500/30"
          title={currentLanguage === 'en' ? 'Help & Support' : 'المساعدة والدعم'}
        >
          {showHelp ? <X className="h-6 w-6" /> : <MessageCircleQuestion className="h-6 w-6" />}
        </button>
      </div>

      {/* Wallet Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-sm z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={t.wallet.title}>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh] text-left animate-scale-up">
            
            {/* Modal Header */}
            <div className="bg-slate-900 p-5 text-white flex justify-between items-center border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="bg-indigo-600 p-2 rounded-lg text-white">
                  <Wallet className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm tracking-tight">{t.wallet.title}</h3>
                  <p className="text-[10px] text-slate-400 font-semibold">{t.wallet.badge}: {walletBalance} EGP</p>
                </div>
              </div>
              <button 
                onClick={() => setShowWalletModal(false)} 
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Close wallet modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Mesh Gradient Wallet Card */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-700 via-purple-700 to-indigo-900 p-6 text-white shadow-xl shadow-indigo-900/20">
                <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-200">{t.wallet.badge}</span>
                    <h2 className="text-3xl font-black tracking-tight">{walletBalance} <span className="text-lg font-bold">EGP</span></h2>
                  </div>
                  <Coins className="h-10 w-10 text-indigo-300 opacity-80" />
                </div>

                <div className="mt-6 flex justify-between items-end border-t border-white/10 pt-4 text-[10px] font-semibold text-indigo-200">
                  <span>{teacherProfile.name}</span>
                  <span className="font-mono">ID: T-{teacherProfile.subdomain.toUpperCase()}</span>
                </div>
              </div>

              {/* Checkout Steps Switcher */}
              {checkoutStep === 'select' && (
                <div className="space-y-5">
                  <h4 className="font-bold text-slate-800 text-xs border-b border-slate-100 pb-2 flex items-center gap-1.5">
                    <PlusCircle className="h-4 w-4 text-indigo-600" />
                    <span>{t.wallet.topUp}</span>
                  </h4>
                  
                  {/* Amount Selector */}
                  <div className="space-y-3">
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500">{t.wallet.quickSelect}</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[100, 500, 1000, 2000].map(amt => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setTopUpAmount(amt)}
                          className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                            topUpAmount === amt 
                              ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100' 
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          +{amt}
                        </button>
                      ))}
                    </div>

                    <div className="relative mt-2">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold text-xs">EGP</span>
                      <input
                        type="number"
                        min="10"
                        value={topUpAmount}
                        onChange={e => setTopUpAmount(Math.max(0, Number(e.target.value)))}
                        className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all"
                      />
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="space-y-2.5">
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500">{t.wallet.method}</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: 'card', name: currentLanguage === 'en' ? 'Credit Card' : 'بطاقة ائتمانية', desc: 'Visa / MasterCard' },
                        { id: 'vodafone', name: 'Vodafone Cash', desc: '010 Mobile Wallet' },
                        { id: 'fawry', name: 'Fawry Pay', desc: 'Reference Code Bill' },
                        { id: 'instapay', name: 'Instapay', desc: 'Instant Bank Transfer' }
                      ].map(method => (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setPaymentMethod(method.id as any)}
                          className={`p-3 rounded-xl border text-left flex flex-col transition-all ${
                            paymentMethod === method.id 
                              ? 'bg-indigo-50/70 border-indigo-500 text-indigo-900 ring-2 ring-indigo-500/10' 
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <span className="text-xs font-bold flex items-center gap-1.5">
                            {method.id === 'card' && <CreditCard className="h-3.5 w-3.5 text-slate-500" />}
                            {method.id === 'vodafone' && <span className="h-2 w-2 rounded-full bg-red-600" />}
                            {method.id === 'fawry' && <span className="h-2 w-2 rounded-full bg-amber-500" />}
                            {method.id === 'instapay' && <span className="h-2 w-2 rounded-full bg-emerald-500" />}
                            <span>{method.name}</span>
                          </span>
                          <span className="text-[9px] text-slate-400 font-medium mt-1">{method.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setCheckoutStep('payment')}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-3.5 rounded-xl text-xs shadow-md shadow-indigo-100 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>{t.wallet.depositBtn}</span>
                    <span>({topUpAmount} EGP)</span>
                  </button>
                </div>
              )}

              {checkoutStep === 'payment' && (
                <div className="space-y-5">
                  <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex justify-between items-center">
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Deposit Amount</span>
                      <p className="text-sm font-black text-slate-900">{topUpAmount} EGP</p>
                    </div>
                    <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-md uppercase border border-indigo-100">
                      {paymentMethod.toUpperCase()}
                    </span>
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="space-y-4 text-xs font-bold text-slate-700">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 uppercase tracking-wider">{t.wallet.cardNumber}</label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={e => setCardNumber(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-500 uppercase tracking-wider">{t.wallet.expiry}</label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            value={cardExpiry}
                            onChange={e => setCardExpiry(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 outline-none focus:bg-white transition-all text-center"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-500 uppercase tracking-wider">{t.wallet.cvv}</label>
                          <input
                            type="password"
                            placeholder="***"
                            value={cardCvv}
                            onChange={e => setCardCvv(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 outline-none focus:bg-white transition-all text-center"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 uppercase tracking-wider">{t.wallet.cardHolder}</label>
                        <input
                          type="text"
                          value={cardHolder}
                          onChange={e => setCardHolder(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:bg-white transition-all"
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'vodafone' && (
                    <div className="space-y-4 text-xs font-bold text-slate-700">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 uppercase tracking-wider">{t.wallet.phoneWallet}</label>
                        <input
                          type="text"
                          value={phoneWallet}
                          onChange={e => setPhoneWallet(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 outline-none focus:bg-white transition-all"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 uppercase tracking-wider">{t.wallet.otp}</label>
                        <input
                          type="text"
                          value={otpCode}
                          onChange={e => setOtpCode(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 outline-none focus:bg-white transition-all text-center tracking-widest font-black"
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'instapay' && (
                    <div className="space-y-4 text-xs font-bold text-slate-700">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 uppercase tracking-wider">{t.wallet.instapayLabel}</label>
                        <input
                          type="text"
                          value={instapayAddress}
                          onChange={e => setInstapayAddress(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 outline-none focus:bg-white transition-all"
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'fawry' && (
                    <div className="space-y-4 text-xs font-semibold text-slate-600 bg-amber-50/50 border border-amber-200/50 p-5 rounded-xl">
                      <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                        <span>{t.wallet.fawryLabel}</span>
                      </p>
                      
                      <div className="my-3 text-center bg-slate-900 text-amber-400 font-mono py-3 rounded-lg text-lg font-black tracking-widest border border-slate-800 select-all cursor-pointer">
                        982736183
                      </div>

                      <p className="text-[11px] leading-relaxed text-slate-500">{t.wallet.fawryInstruction}</p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setCheckoutStep('select')}
                      className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3 rounded-xl text-xs transition-all"
                    >
                      {currentLanguage === 'en' ? 'Back' : 'رجوع'}
                    </button>
                    
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => {
                        setIsProcessing(true);
                        setTimeout(() => {
                          setIsProcessing(false);
                          const methodNames = { card: 'Credit Card', vodafone: 'Vodafone Cash', fawry: 'Fawry Pay', instapay: 'Instapay' };
                          depositToWallet(topUpAmount, methodNames[paymentMethod]);
                          setCheckoutStep('success');
                        }, 1500);
                      }}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                    >
                      {isProcessing ? (
                        <div className="h-4.5 w-4.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <span>{paymentMethod === 'fawry' ? t.wallet.fawrySimulate : t.wallet.payNow}</span>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {checkoutStep === 'success' && (
                <div className="py-8 flex flex-col items-center justify-center text-center space-y-4 animate-scale-up">
                  <div className="bg-emerald-100 p-3 rounded-full text-emerald-600">
                    <CheckCircle2 className="h-10 w-10 animate-bounce" />
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-sm">{currentLanguage === 'en' ? 'Deposit Received!' : 'تم الإيداع بنجاح!'}</h4>
                  <p className="text-xs text-slate-500 font-semibold px-12 leading-relaxed">{t.wallet.successMsg}</p>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setCheckoutStep('select');
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-colors"
                  >
                    {currentLanguage === 'en' ? 'Done' : 'تم'}
                  </button>
                </div>
              )}

              {/* Transactions Log Section */}
              <div className="border-t border-slate-100 pt-5 space-y-3">
                <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                  <span>{t.wallet.transactions}</span>
                </h4>
                
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                  {walletTransactions.length === 0 ? (
                    <div className="text-center text-slate-400 py-6 text-[10px] font-semibold">
                      {t.wallet.noTransactions}
                    </div>
                  ) : (
                    walletTransactions.map(tx => (
                      <div key={tx.id} className="bg-slate-50 border border-slate-200/50 rounded-xl p-3 flex justify-between items-center text-xs font-semibold">
                        <div className="flex items-center gap-2.5">
                          <div className={`p-2 rounded-lg ${
                            tx.type === 'deposit' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                          }`}>
                            {tx.type === 'deposit' ? (
                              <ArrowDownLeft className="h-4 w-4" />
                            ) : (
                              <ArrowUpRight className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <p className="text-slate-800 font-bold text-xs">
                              {tx.type === 'deposit' 
                                ? `${t.wallet.depositTx} ${tx.paymentMethod}`
                                : `${t.wallet.activationTx}: ${tx.studentName}`
                              }
                            </p>
                            <span className="text-[9px] text-slate-400 font-medium block mt-0.5">{tx.date}</span>
                          </div>
                        </div>
                        <span className={`font-mono font-bold ${
                          tx.type === 'deposit' ? 'text-emerald-600' : 'text-rose-600'
                        }`}>
                          {tx.type === 'deposit' ? '+' : '-'}{tx.amount} EGP
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
      
      {/* Coins & PlusCircle icons referenced inside */}
      </div>
  );
}
