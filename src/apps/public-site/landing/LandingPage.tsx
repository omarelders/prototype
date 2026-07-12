import React, { useState } from 'react';
import { useAppState } from '../../../shared/context/AppState';
import { 
  BookOpen, 
  Cpu, 
  Shield, 
  CreditCard, 
  TrendingUp, 
  Globe, 
  ChevronDown, 
  ArrowRight, 
  Check, 
  Layers 
} from 'lucide-react';

export default function LandingPage() {
  const { currentLanguage, setLanguage, setRole } = useAppState();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Translations dictionary
  const dict = {
    en: {
      brand: "AmalBila",
      tagline: "Educational Platform for Egyptian Teachers",
      heroTitle: "Build Your Independent Digital Academy",
      heroSubtitle: "AmalBila provides Egyptian high school teachers with the tools to construct interactive lessons, run exams securely, host videos safely, and manage manual payments (Vodafone Cash & Instapay) easily.",
      ctaGetStarted: "Create Your Platform",
      ctaLogin: "Teacher Login",
      features: "Features",
      pricing: "Pricing",
      faq: "FAQ",
      testimonials: "Success Stories",
      featuresTitle: "Everything you need to run your teaching business",
      feature1: "Drag & Drop Lesson Builder",
      feature1Desc: "Easily build modules containing videos, reading content, and inline practice sets.",
      feature2: "Question Bank Manager",
      feature2Desc: "Organize MCQ or essay questions into structured folders based on your topics and syllabus.",
      feature3: "Detailed Exam Analytics",
      feature3Desc: "Gain insights into student performance with automatic statistics and score breakdowns.",
      feature4: "Manual Payments Ledger",
      feature4Desc: "Accept Vodafone Cash, Instapay, or bank transfers and approve students in one click.",
      feature5: "Secure Video Hosting",
      feature5Desc: "Embed secure lessons powered by Bunny Stream, preventing unauthorized downloads.",
      feature6: "RTL Arabic Support",
      feature6Desc: "Full support for Arabic language layouts, math LaTeX formulas, and chemistry symbols.",
      plansTitle: "Transparent Pricing Built for Scale",
      plansSubtitle: "Choose the tier that matches your student numbers and feature requirements.",
      free: "Basic Starter",
      pro: "Pro Educator",
      premium: "Premium Academy",
      freePrice: "Free",
      proPrice: "350 EGP",
      premiumPrice: "900 EGP",
      perMonth: "/ month",
      popular: "Most Popular",
      selectPlan: "Choose Plan",
      faqTitle: "Frequently Asked Questions",
      faqSubtitle: "Got questions? We have answers to help you get started.",
      testiTitle: "Trusted by Top Educators in Egypt",
      testiSubtitle: "See how high school teachers have transformed their Thanaweya Amma classes."
    },
    ar: {
      brand: "أمل بلا حدود",
      tagline: "المنصة التعليمية الشاملة للمعلمين في مصر",
      heroTitle: "أنشئ أكاديميتك الرقمية الخاصة والمستقلة",
      heroSubtitle: "توفر منصة أمل بلا حدود لمعلمي الثانوية العامة في مصر الأدوات اللازمة لبناء دروس تفاعلية، إجراء اختبارات مدعومة بالذكاء الاصطناعي، استضافة الفيديوهات بشكل آمن، وإدارة المدفوعات اليدوية (فودافون كاش وإنستاباي) بكل سهولة.",
      ctaGetStarted: "ابدأ مجاناً وأنشئ منصتك",
      ctaLogin: "تسجيل دخول المعلمين",
      features: "المميزات",
      pricing: "الباقات والأسعار",
      faq: "الأسئلة الشائعة",
      testimonials: "آراء شركاء النجاح",
      featuresTitle: "كل ما تحتاجه لإدارة وتطوير عملك التعليمي",
      feature1: "منشئ دروس مرن ومبسط",
      feature1Desc: "أنشئ فصولاً ودروساً تحتوي على فيديوهات ومقالات وأسئلة تفاعلية بسحب وإفلات العناصر.",
      feature2: "توليد الأسئلة بالذكاء الاصطناعي",
      feature2Desc: "أنشئ أسئلة اختيار من متعدد ومقالية فوراً بناءً على مواضيع الدروس والمنهج.",
      feature3: "تحليلات واحصائيات الامتحانات",
      feature3Desc: "احصل على تقارير تفصيلية عن درجات الطلاب ومستوى أدائهم الفردي والجماعي تلقائياً.",
      feature4: "إدارة الاشتراكات وفودافون كاش",
      feature4Desc: "استقبل المدفوعات عبر المحافظ الإلكترونية وإنستاباي ووافق على طلبات التفعيل بنقرة واحدة.",
      feature5: "استضافة فيديو فائقة الأمان",
      feature5Desc: "حماية المحتوى التعليمي باستخدام خوادم Bunny Stream المشفرة لمنع تسريب الفيديوهات.",
      feature6: "دعم كامل للغة العربية والرموز",
      feature6Desc: "تنسيق متكامل باللغة العربية مع دعم فني لكتابة معادلات الرياضيات والكيمياء بكل دقة.",
      plansTitle: "باقات أسعار مرنة ومناسبة لجميع المستويات",
      plansSubtitle: "اختر الباقة المناسبة لعدد طلابك والخصائص التي تحتاجها لإدارة أكاديميتك.",
      free: "الباقة الأساسية",
      pro: "الباقة الاحترافية (Pro)",
      premium: "الباقة الأكاديمية الممتازة",
      freePrice: "مجاناً",
      proPrice: "350 ج.م",
      premiumPrice: "900 ج.م",
      perMonth: "/ شهرياً",
      popular: "الأكثر مبيعاً",
      selectPlan: "اختر الباقة",
      faqTitle: "الأسئلة الشائعة",
      faqSubtitle: "كل ما تريد معرفته عن المنصة وكيفية البدء والاستخدام.",
      testiTitle: "ثقة كبار معلمي الثانوية العامة بمصر",
      testiSubtitle: "اكتشف كيف ساهمت المنصة في تنظيم حصص المراجعة والامتحانات وزيادة تفاعل الطلاب."
    }
  };

  const t = dict[currentLanguage];

  // Mock FAQS
  const faqs = [
    {
      q: currentLanguage === 'en' ? "How do students pay and join my platform?" : "كيف يقوم الطلاب بالدفع والانضمام إلى منصتي؟",
      a: currentLanguage === 'en' 
        ? "Students submit a screenshot of their transfer via Vodafone Cash or Instapay. You review their request in your Dashboard and activate their access in one click."
        : "يقوم الطالب بتحويل قيمة الاشتراك للمحفظة الإلكترونية الخاصة بك، ثم يرفع صورة الإيصال بالمنصة. يظهر لك الإشعار فوراً في لوحة التحكم للموافقة وتفعيل الطالب فوراً."
    },
    {
      q: currentLanguage === 'en' ? "Is my video content protected from piracy?" : "هل محتوى الفيديوهات محمي من السرقة والتحميل؟",
      a: currentLanguage === 'en'
        ? "Yes! We integrate with Bunny Stream which restricts video playback only to your platform, uses dynamic signed URLs, and blocks unauthorized download tools."
        : "نعم تماماً، يتم تشغيل الفيديوهات عبر مشغل Bunny Stream الآمن الذي يمنع تنزيل الفيديوهات أو نسخ الروابط المشفرة، مع تقييد النطاق ليعمل فقط داخل حساب طالبك."
    },
    {
      q: currentLanguage === 'en' ? "Can I manage my own question bank?" : "هل يمكنني إدارة بنك الأسئلة الخاص بي؟",
      a: currentLanguage === 'en'
        ? "Absolutely. Our platform provides a powerful Question Bank where you can organize, categorize, and store your custom questions for easy exam assembly."
        : "بالتأكيد، توفر المنصة بنك أسئلة متكامل لتنظيم أسئلتك في مجلدات حسب الوحدات، مما يسهل عليك بناء الاختبارات."
    }
  ];

  const faqToggles = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const startOnboarding = () => {
    setRole('onboarding');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <Layers className="h-6 w-6" />
          </div>
          <span className="font-extrabold text-2xl text-slate-900 tracking-tight">{t.brand}</span>
        </div>

        <nav className="hidden md:flex items-center gap-8 font-semibold text-slate-600">
          <a href="#features" className="hover:text-indigo-600 transition-colors">{t.features}</a>
          <a href="#pricing" className="hover:text-indigo-600 transition-colors">{t.pricing}</a>
          <a href="#testimonials" className="hover:text-indigo-600 transition-colors">{t.testimonials}</a>
          <a href="#faq" className="hover:text-indigo-600 transition-colors">{t.faq}</a>
        </nav>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setLanguage(currentLanguage === 'en' ? 'ar' : 'en')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Globe className="h-4 w-4" />
            <span>{currentLanguage === 'en' ? 'العربية' : 'English'}</span>
          </button>
          
          <button 
            onClick={() => setRole('teacher')}
            className="hidden sm:inline-flex px-4 py-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            {t.ctaLogin}
          </button>

          <button 
            onClick={startOnboarding}
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            {t.ctaGetStarted}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white py-20 lg:py-28 px-4 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 flex flex-col items-start space-y-6">
            <span className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase">
              {t.tagline}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              {t.heroTitle}
            </h1>
            <p className="text-lg text-slate-300 font-medium leading-relaxed max-w-xl">
              {t.heroSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-2">
              <button 
                onClick={startOnboarding}
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 group transition-all"
              >
                <span>{t.ctaGetStarted}</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => setRole('teacher')}
                className="bg-slate-800/80 hover:bg-slate-800 text-slate-200 font-bold px-8 py-4 rounded-xl border border-slate-700/60 hover:border-slate-600 transition-all flex items-center justify-center"
              >
                {t.ctaLogin}
              </button>
            </div>
          </div>
          
          <div className="lg:col-span-5 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-3xl blur-2xl opacity-30 animate-pulse pointer-events-none" />
            <div className="relative border border-slate-700/60 bg-slate-900/90 rounded-2xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="h-3.5 w-3.5 rounded-full bg-rose-500" />
                  <div className="h-3.5 w-3.5 rounded-full bg-amber-500" />
                  <div className="h-3.5 w-3.5 rounded-full bg-emerald-500" />
                </div>
                <span className="text-xs font-mono text-slate-500">teacher.amalbila.com</span>
              </div>
              
              {/* Fake dashboard snippet */}
              <div className="space-y-4" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                <div className="grid grid-cols-2 gap-3 text-left">
                  <div className={`bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/30 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      {currentLanguage === 'en' ? 'Total Students' : 'إجمالي الطلاب'}
                    </span>
                    <p className="text-xl font-bold text-white mt-1">1,248</p>
                  </div>
                  <div className={`bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/30 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      {currentLanguage === 'en' ? 'Pending Payments' : 'بانتظار الدفع'}
                    </span>
                    <p className="text-xl font-bold text-emerald-400 mt-1">
                      12 {currentLanguage === 'en' ? 'Awaiting' : 'طالب'}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/30 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-300">
                      {currentLanguage === 'en' ? 'Organic Chemistry Quiz - Exam Active' : 'امتحان الكيمياء العضوية - نشط'}
                    </span>
                    <span className="text-emerald-400 font-mono">● LIVE</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-1.5">
                    <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '65%' }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 pt-1">
                    <span>
                      {currentLanguage === 'en' ? 'Attempts: 204/350' : 'المحاولات: 204/350'}
                    </span>
                    <span>
                      {currentLanguage === 'en' ? 'Auto-Grading: ON' : 'التصحيح التلقائي: مفعل'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 lg:py-28 px-4 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t.featuresTitle}
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* F1 */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
            <div className="bg-indigo-50 p-3 rounded-xl w-fit text-indigo-600 mb-6">
              <BookOpen className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{t.feature1}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{t.feature1Desc}</p>
          </div>
          {/* F2 */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
            <div className="bg-violet-50 p-3 rounded-xl w-fit text-violet-600 mb-6">
              <Cpu className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{t.feature2}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{t.feature2Desc}</p>
          </div>
          {/* F3 */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
            <div className="bg-emerald-50 p-3 rounded-xl w-fit text-emerald-600 mb-6">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{t.feature3}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{t.feature3Desc}</p>
          </div>
          {/* F4 */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
            <div className="bg-amber-50 p-3 rounded-xl w-fit text-amber-600 mb-6">
              <CreditCard className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{t.feature4}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{t.feature4Desc}</p>
          </div>
          {/* F5 */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
            <div className="bg-blue-50 p-3 rounded-xl w-fit text-blue-600 mb-6">
              <TrendingUp className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{t.feature5}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{t.feature5Desc}</p>
          </div>
          {/* F6 */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
            <div className="bg-rose-50 p-3 rounded-xl w-fit text-rose-600 mb-6">
              <Globe className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{t.feature6}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{t.feature6Desc}</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-slate-100 py-20 lg:py-28 px-4 lg:px-8 border-y border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              {t.plansTitle}
            </h2>
            <p className="text-slate-600 leading-relaxed font-medium">
              {t.plansSubtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            {/* Free / Basic */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 flex flex-col justify-between shadow-sm relative">
              <div>
                <h3 className="text-xl font-bold text-slate-950 mb-1">{t.free}</h3>
                <div className="my-6 flex items-baseline">
                  <span className="text-4xl font-extrabold text-slate-900">{currentLanguage === 'en' ? '500 EGP' : '500 ج.م'}</span>
                  <span className="text-slate-500 text-sm ml-1.5">{t.perMonth}</span>
                </div>
                <div className="border-t border-slate-100 my-6" />
                <ul className="space-y-4 text-sm text-slate-600">
                  <li className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                    <span>{currentLanguage === 'en' ? 'Up to 200 active students' : 'حتى 200 طالب نشط'}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                    <span>{currentLanguage === 'en' ? '50 GB Video Bandwidth' : '50 جيجابايت سعة رفع الفيديوهات'}</span>
                  </li>

                  <li className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                    <span>{currentLanguage === 'en' ? 'Standard student portal' : 'بوابة الطالب الأساسية'}</span>
                  </li>
                </ul>
              </div>
              <button 
                onClick={startOnboarding}
                className="mt-8 w-full border border-slate-200 text-slate-800 py-3 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
              >
                {t.selectPlan}
              </button>
            </div>

            {/* Pro */}
            <div className="bg-white rounded-2xl border-2 border-indigo-600 p-8 flex flex-col justify-between shadow-lg relative ring-4 ring-indigo-50">
              <span className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {t.popular}
              </span>
              <div>
                <h3 className="text-xl font-bold text-slate-950 mb-1">{t.pro}</h3>
                <div className="my-6 flex items-baseline">
                  <span className="text-4xl font-extrabold text-slate-900">{currentLanguage === 'en' ? '950 EGP' : '950 ج.م'}</span>
                  <span className="text-slate-500 text-sm ml-1.5">{t.perMonth}</span>
                </div>
                <div className="border-t border-slate-100 my-6" />
                <ul className="space-y-4 text-sm text-slate-600">
                  <li className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-indigo-600 flex-shrink-0" />
                    <span className="font-semibold text-slate-800">{currentLanguage === 'en' ? 'Up to 1,000 active students' : 'حتى 1,000 طالب نشط'}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-indigo-600 flex-shrink-0" />
                    <span>{currentLanguage === 'en' ? '250 GB Video Bandwidth' : '250 جيجابايت سعة رفع الفيديوهات'}</span>
                  </li>

                  <li className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-indigo-600 flex-shrink-0" />
                    <span>{currentLanguage === 'en' ? 'Detailed student performance stats' : 'إحصائيات أداء تفصيلية للطلاب'}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-indigo-600 flex-shrink-0" />
                    <span>{currentLanguage === 'en' ? 'Customizable domain name' : 'رابط منصة مخصص'}</span>
                  </li>
                </ul>
              </div>
              <button 
                onClick={startOnboarding}
                className="mt-8 w-full bg-indigo-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-colors"
              >
                {t.selectPlan}
              </button>
            </div>

            {/* Premium */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 flex flex-col justify-between shadow-sm relative">
              <div>
                <h3 className="text-xl font-bold text-slate-950 mb-1">{t.premium}</h3>
                <div className="my-6 flex items-baseline">
                  <span className="text-4xl font-extrabold text-slate-900">{currentLanguage === 'en' ? '1,900 EGP' : '1,900 ج.م'}</span>
                  <span className="text-slate-500 text-sm ml-1.5">{t.perMonth}</span>
                </div>
                <div className="border-t border-slate-100 my-6" />
                <ul className="space-y-4 text-sm text-slate-600">
                  <li className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                    <span className="font-semibold text-slate-800">{currentLanguage === 'en' ? 'Unlimited active students' : 'عدد غير محدود من الطلاب'}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                    <span>{currentLanguage === 'en' ? 'Unlimited Video Bandwidth' : 'سعة رفع فيديوهات غير محدودة'}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                    <span>{currentLanguage === 'en' ? '24/7 dedicated local support & training' : 'دعم فني وتدريب مخصص على مدار الساعة'}</span>
                  </li>
                </ul>
              </div>
              <button 
                onClick={startOnboarding}
                className="mt-8 w-full bg-slate-900 text-white py-3 rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors"
              >
                {t.selectPlan}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 lg:py-28 px-4 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t.testiTitle}
          </h2>
          <p className="text-slate-600 leading-relaxed font-medium">
            {t.testiSubtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative">
            <span className="absolute top-6 right-8 text-6xl font-serif text-slate-200 leading-none">“</span>
            <p className="text-slate-700 italic text-sm leading-relaxed mb-6 relative z-10">
              {currentLanguage === 'en' 
                ? "Switching to AmalBila saved me hours of administrative work. I no longer verify payments via WhatsApp; the manual payment receipts tool handles it. My science lectures are safely hosted, and the digital system on midterm tests makes grading transparent."
                : "أفضل منصة لتنظيم المجموعات. لم أعد بحاجة لمراجعة التحويلات على الواتساب، نظام التحقق من الدفع يفعل كل شيء تلقائياً. فيديوهات الشرح مؤمنة تماماً، وامتحانات الفيزياء تعطي انطباعاً جاداً لأولياء الأمور."}
            </p>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-slate-200 flex-shrink-0 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&auto=format&fit=crop&q=60" alt="Prof" className="h-full w-full object-cover" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Mr. Ahmed Hegazi</h4>
                <p className="text-xs text-slate-500">{currentLanguage === 'en' ? "Physics Teacher, Giza" : "مدرس الفيزياء، الجيزة"}</p>
              </div>
            </div>
          </div>

          <div className="bg-indigo-600 p-8 rounded-2xl border border-indigo-500 shadow-md relative">
            <span className="absolute top-6 right-8 text-6xl font-serif text-indigo-400/30 leading-none">“</span>
            <p className="text-indigo-50 italic text-sm leading-relaxed mb-6 relative z-10">
              {currentLanguage === 'en' 
                ? "The Exam Builder is incredibly intuitive. I just organize my questions by topic, e.g., Benzene or Alcohols, and it allows me to build custom, calibrated chemistry exams. My students love the immediate feedback portal."
                : "برنامج بناء الاختبارات مذهل، أنظم أسئلتي حسب الدرس مثل الكيمياء العضوية وأركب امتحاناتي بدقائق. الطلاب يتفاعلون بحماس مع الواجهة والنتائج الفورية."}
            </p>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-indigo-400 flex-shrink-0 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=60" alt="Prof" className="h-full w-full object-cover" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Dr. Rania Mahmoud</h4>
                <p className="text-xs text-indigo-200">{currentLanguage === 'en' ? "Chemistry Teacher, Cairo" : "معلمة الكيمياء، القاهرة"}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="bg-slate-100 py-20 lg:py-28 px-4 lg:px-8 border-t border-slate-200">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              {t.faqTitle}
            </h2>
            <p className="text-slate-600 leading-relaxed font-medium">
              {t.faqSubtitle}
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <button 
                  onClick={() => faqToggles(idx)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left font-bold text-slate-900 hover:bg-slate-50/50 transition-colors"
                >
                  <span className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>{faq.q}</span>
                  <ChevronDown className={`h-5 w-5 text-slate-500 transition-transform ${activeFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {activeFaq === idx && (
                  <div className="px-6 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    <p className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-4 lg:px-8 border-t border-slate-800 text-sm mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500 p-1.5 rounded-lg text-white">
              <Layers className="h-5 w-5" />
            </div>
            <span className="font-extrabold text-white text-lg">{t.brand}</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8">
            <a href="#features" className="hover:text-white transition-colors">{t.features}</a>
            <a href="#pricing" className="hover:text-white transition-colors">{t.pricing}</a>
            <a href="#testimonials" className="hover:text-white transition-colors">{t.testimonials}</a>
            <a href="#faq" className="hover:text-white transition-colors">{t.faq}</a>
          </div>

          <p>© {new Date().getFullYear()} AmalBila Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
