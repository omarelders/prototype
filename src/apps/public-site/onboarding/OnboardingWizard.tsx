import React, { useState } from 'react';
import { useAppState } from '../../../shared/context/AppState';
import { ArrowRight, ArrowLeft, Loader2, Sparkles, Check, CheckCircle2 } from 'lucide-react';

export default function OnboardingWizard() {
  const { currentLanguage, setRole, teacherProfile, updateTeacherProfile, onboardingStep, setOnboardingStep } = useAppState();
  const [loading, setLoading] = useState(false);

  // Steps state maps locally
  const [name, setName] = useState(teacherProfile.name);
  const [specialty, setSpecialty] = useState(teacherProfile.specialty);
  const [bio, setBio] = useState(teacherProfile.bio);
  
  const [subdomain, setSubdomain] = useState(teacherProfile.subdomain);
  const [primaryColor, setPrimaryColor] = useState(teacherProfile.themeColors.primary);
  const [secondaryColor, setSecondaryColor] = useState(teacherProfile.themeColors.secondary);
  
  const [facebook, setFacebook] = useState('https://facebook.com/shaker.physics');
  const [youtube, setYoutube] = useState('https://youtube.com/c/shaker-physics');
  const [whatsapp, setWhatsapp] = useState('01012345678');
  
  const [price, setPrice] = useState(teacherProfile.studentPrice);
  const [instructions, setInstructions] = useState(teacherProfile.paymentInstructions);

  const dict = {
    en: {
      steps: ["Profile Details", "Subdomain & Branding", "Social & Contact", "Pricing & Payment"],
      stepTitle1: "Tell us about yourself",
      stepDesc1: "This information will be displayed on your public profile page.",
      stepTitle2: "Customize your academy branding",
      stepDesc2: "Establish your custom subdomain URL and dashboard accent colors.",
      stepTitle3: "Connect with your students",
      stepDesc3: "Provide social channels where students can reach out and follow your lectures.",
      stepTitle4: "Set up student access pricing",
      stepDesc4: "Define your monthly subscription price and payment receipts collection accounts.",
      nameLabel: "Teacher Name",
      specialtyLabel: "Academic Specialty",
      bioLabel: "Short Bio / Description",
      subdomainLabel: "Desired Subdomain URL",
      subdomainHelper: "Your portal will be accessible at: .amalbila.com",
      themeLabel: "Theme Accent Color",
      themeDesc: "Choose your primary brand color representing your teaching business.",
      socialFacebook: "Facebook Page URL",
      socialYoutube: "YouTube Channel URL",
      socialWhatsapp: "WhatsApp Business Number",
      priceLabel: "Monthly Student Subscription Fee",
      egp: "EGP / month",
      paymentLabel: "Manual Payment Instructions",
      paymentHelper: "Tell students how to transfer payments (e.g. Vodafone Cash mobile number or Instapay handle) to activate their course access.",
      next: "Next Step",
      back: "Back",
      finish: "Launch My Platform",
      launching: "Configuring Academy..."
    },
    ar: {
      steps: ["بيانات المعلم", "رابط المنصة والهوية", "قنوات التواصل", "الاشتراكات والدفع"],
      stepTitle1: "أخبرنا عن نفسك وهويتك الأكاديمية",
      stepDesc1: "هذه التفاصيل ستعرض للطلاب في صفحتك التعريفية العامة.",
      stepTitle2: "خصص هوية منصتك الخاصة",
      stepDesc2: "حدد رابط النطاق الفرعي لمنصتك واختر ألوان العرض المفضلة.",
      stepTitle3: "اربط حسابات التواصل لطلابك",
      stepDesc3: "أضف روابط فيسبوك ويوتيوب والواتساب لتسهيل دعم طلاب الثانوية العامة.",
      stepTitle4: "حدد باقة اشتراك الطلاب وتفاصيل الدفع",
      stepDesc4: "اكتب سعر التفعيل الشهري للدروس وكيفية استقبال التحويلات الإلكترونية.",
      nameLabel: "اسم المعلم الثنائي",
      specialtyLabel: "التخصص الدراسي / المادة",
      bioLabel: "نبذة تعريفية قصيرة",
      subdomainLabel: "رابط المنصة الفرعي المطلوبة",
      subdomainHelper: "سيكون رابط منصتك الفرعي هو: .amalbila.com",
      themeLabel: "لون هوية المنصة الرئيسي",
      themeDesc: "اختر ألوان الواجهة التي تظهر لطلابك في لوحة دراستهم الخاصة.",
      socialFacebook: "رابط صفحة الفيسبوك",
      socialYoutube: "رابط قناة اليوتيوب",
      socialWhatsapp: "رقم الواتساب للتواصل والتحويل",
      priceLabel: "قيمة الاشتراك الشهري للدروس والاختبارات",
      egp: "جنيه مصري / شهرياً",
      paymentLabel: "تعليمات تحويل الأموال يدوياً",
      paymentHelper: "اكتب تعليمات واضحة للطلاب (مثال: أرسل المبلغ فودافون كاش على رقم 010.. ثم ارفع صورة إيصال التحويل لتفعيل حسابك).",
      next: "الخطوة التالية",
      back: "الرجوع للوراء",
      finish: "أطلق أكاديميتي الآن",
      launching: "جاري إعداد الأكاديمية..."
    }
  };

  const t = dict[currentLanguage];

  const handleNext = () => {
    if (onboardingStep < 4) {
      setOnboardingStep(onboardingStep + 1);
    } else {
      setLoading(true);
      // Save setup values to context
      updateTeacherProfile({
        name,
        specialty,
        bio,
        subdomain,
        themeColors: { primary: primaryColor, secondary: secondaryColor },
        studentPrice: price,
        paymentInstructions: instructions
      });

      // Add a success timer to simulate setup compilation
      setTimeout(() => {
        setLoading(false);
        setOnboardingStep(1);
        setRole('teacher'); // Go to dashboard
      }, 2000);
    }
  };

  const handleBack = () => {
    if (onboardingStep > 1) {
      setOnboardingStep(onboardingStep - 1);
    } else {
      setRole('visitor'); // Go back to landing
    }
  };

  // Color preset options
  const colorPresets = [
    { primary: '#16213e', secondary: '#4361ee', label: currentLanguage === 'en' ? 'Trustworthy Navy' : 'الأزرق الرصين' },
    { primary: '#0f172a', secondary: '#0ea5e9', label: currentLanguage === 'en' ? 'Sleek Cyber' : 'الأزرق الفضائي' },
    { primary: '#064e3b', secondary: '#10b981', label: currentLanguage === 'en' ? 'Emerald Academy' : 'الأخضر التعليمي' },
    { primary: '#4c1d95', secondary: '#8b5cf6', label: currentLanguage === 'en' ? 'Royal Violet' : 'البنفسجي الملكي' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 flex flex-col justify-center items-center">
      {/* Top logo */}
      <div className="flex items-center gap-2 mb-8">
        <div className="bg-indigo-600 p-1.5 rounded-lg text-white font-black text-lg">أ</div>
        <span className="font-extrabold text-xl text-slate-900 tracking-tight">
          {currentLanguage === 'en' ? 'AmalBila Platform' : 'منصة أمل بلا حدود'}
        </span>
      </div>

      <div className="w-full max-w-2xl bg-white border border-slate-200 shadow-xl rounded-2xl p-8">
        {/* Progress Tracker */}
        <div className="flex items-center w-full mb-10 border-b border-slate-100 pb-6 relative">
          {t.steps.map((stepName, idx) => {
            const stepNum = idx + 1;
            const isActive = onboardingStep === stepNum;
            const isCompleted = onboardingStep > stepNum;
            return (
              <React.Fragment key={idx}>
                <div className="flex flex-col sm:flex-row items-center gap-2 z-10">
                  <div className={`h-8 w-8 rounded-full flex flex-shrink-0 items-center justify-center font-bold text-sm transition-all ${
                    isActive 
                      ? 'bg-indigo-600 text-white ring-4 ring-indigo-50' 
                      : isCompleted 
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-slate-100 text-slate-400'
                  }`}>
                    {isCompleted ? <Check className="h-4 w-4" /> : stepNum}
                  </div>
                  <span className={`text-[10px] sm:text-xs font-bold whitespace-nowrap hidden sm:block ${isActive ? 'text-slate-900' : isCompleted ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {stepName}
                  </span>
                </div>
                {idx < 3 && (
                  <div className={`flex-1 h-0.5 mx-2 sm:mx-4 ${onboardingStep > stepNum ? 'bg-emerald-500' : 'bg-slate-100'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Wizard Header */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-950">
            {onboardingStep === 1 && t.stepTitle1}
            {onboardingStep === 2 && t.stepTitle2}
            {onboardingStep === 3 && t.stepTitle3}
            {onboardingStep === 4 && t.stepTitle4}
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            {onboardingStep === 1 && t.stepDesc1}
            {onboardingStep === 2 && t.stepDesc2}
            {onboardingStep === 3 && t.stepDesc3}
            {onboardingStep === 4 && t.stepDesc4}
          </p>
        </div>

        {/* Step Contents */}
        <div className="space-y-6 min-h-[250px]">
          {onboardingStep === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">{t.nameLabel}</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">{t.specialtyLabel}</label>
                <select 
                  value={specialty}
                  onChange={e => setSpecialty(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all outline-none"
                >
                  <option value="Physics & Chemistry">Physics & Chemistry (الفيزياء والكيمياء)</option>
                  <option value="Mathematics">Mathematics (الرياضيات)</option>
                  <option value="Arabic Grammar & Literature">Arabic Grammar & Literature (اللغة العربية)</option>
                  <option value="Biology & Geology">Biology & Geology (الأحياء والجيولوجيا)</option>
                  <option value="English Language">English Language (اللغة الإنجليزية)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">{t.bioLabel}</label>
                <textarea 
                  rows={4}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all outline-none resize-none"
                />
              </div>
            </div>
          )}

          {onboardingStep === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">{t.subdomainLabel}</label>
                <div className="flex gap-2 items-center">
                  <input 
                    type="text" 
                    value={subdomain}
                    onChange={e => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    className="w-1/2 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all outline-none text-right font-mono font-bold"
                  />
                  <span className="text-slate-500 font-mono text-sm font-semibold">.amalbila.com</span>
                </div>
                <p className="text-xs text-slate-400 mt-2 font-medium">{t.subdomainHelper}</p>
                {subdomain !== subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '') && (
                  <p className="text-xs text-amber-600 mt-1 font-medium">
                    {currentLanguage === 'en' ? 'Special characters were removed' : 'تمت إزالة الحروف الخاصة والرموز تلقائياً'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">{t.themeLabel}</label>
                <div className="grid grid-cols-2 gap-3">
                  {colorPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setPrimaryColor(preset.primary);
                        setSecondaryColor(preset.secondary);
                      }}
                      className={`p-3 rounded-xl border-2 flex items-center justify-between text-left transition-all ${
                        primaryColor === preset.primary ? 'border-indigo-600 bg-indigo-50/20' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="h-6 w-6 rounded-full border border-white flex overflow-hidden">
                          <div className="w-1/2 h-full" style={{ backgroundColor: preset.primary }} />
                          <div className="w-1/2 h-full" style={{ backgroundColor: preset.secondary }} />
                        </div>
                        <span className="text-xs font-bold text-slate-700">{preset.label}</span>
                      </div>
                      {primaryColor === preset.primary && <CheckCircle2 className="h-4 w-4 text-indigo-600 flex-shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {onboardingStep === 3 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">{t.socialFacebook}</label>
                <input 
                  type="url" 
                  value={facebook}
                  onChange={e => setFacebook(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">{t.socialYoutube}</label>
                <input 
                  type="url" 
                  value={youtube}
                  onChange={e => setYoutube(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">{t.socialWhatsapp}</label>
                <input 
                  type="text" 
                  value={whatsapp}
                  onChange={e => setWhatsapp(e.target.value)}
                  placeholder="01012345678"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all outline-none"
                />
              </div>
            </div>
          )}

          {onboardingStep === 4 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">{t.priceLabel}</label>
                <div className="relative w-1/2">
                  <input 
                    type="number" 
                    value={price}
                    onChange={e => setPrice(Math.max(0, Number(e.target.value)))}
                    min="0"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all outline-none font-bold"
                  />
                  <span className="absolute inset-y-0 right-4 flex items-center text-xs font-bold text-slate-400">{t.egp}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">{t.paymentLabel}</label>
                <textarea 
                  rows={4}
                  value={instructions}
                  onChange={e => setInstructions(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all outline-none resize-none"
                />
                <p className="text-xs text-slate-400 mt-2 font-medium">{t.paymentHelper}</p>
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex justify-between items-center border-t border-slate-100 pt-6 mt-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 px-5 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            {currentLanguage === 'en' ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
            <span>{t.back}</span>
          </button>

          <button
            onClick={handleNext}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{t.launching}</span>
              </>
            ) : (
              <>
                <span>{onboardingStep === 4 ? t.finish : t.next}</span>
                {onboardingStep < 4 ? (
                  currentLanguage === 'en' ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
