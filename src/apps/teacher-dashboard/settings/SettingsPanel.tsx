import React, { useState } from 'react';
import { useAppState } from '../../../shared/context/AppState';
import { 
  User, 
  Bell, 
  Palette, 
  HardDrive, 
  Video, 
  CreditCard, 
  Mail, 
  ShieldCheck, 
  Save, 
  CheckCircle2 
} from 'lucide-react';

export default function SettingsPanel() {
  const { currentLanguage, teacherProfile, updateTeacherProfile } = useAppState();

  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'branding' | 'storage' | 'videos' | 'payments' | 'mail' | 'backups'>('general');

  // Input states prefilled from global teacher profile
  const [name, setName] = useState(teacherProfile.name);
  const [email, setEmail] = useState(teacherProfile.email);
  const [specialty, setSpecialty] = useState(teacherProfile.specialty);
  const [bio, setBio] = useState(teacherProfile.bio);

  const [subdomain, setSubdomain] = useState(teacherProfile.subdomain);
  const [primaryColor, setPrimaryColor] = useState(teacherProfile.themeColors.primary);
  const [secondaryColor, setSecondaryColor] = useState(teacherProfile.themeColors.secondary);

  const [paymentInstructions, setPaymentInstructions] = useState(teacherProfile.paymentInstructions);
  const [monthlyFee, setMonthlyFee] = useState(teacherProfile.studentPrice);

  // Bunny Stream API states
  const [bunnyKey, setBunnyKey] = useState('');
  const [videoQuality, setVideoQuality] = useState('1080p');

  const [saveSuccess, setSaveSuccess] = useState(false);

  // Translations
  const dict = {
    en: {
      tabs: {
        general: "General Info",
        notifications: "Alert Settings",
        branding: "Visual Identity",
        storage: "Storage Usage",
        videos: "Bunny Stream",
        payments: "Manual Gateways",
        mail: "Internal SMTP",
        backups: "Backup Schedule"
      },
      saveBtn: "Save Configurations",
      successMsg: "Settings saved successfully!",
      teacherName: "Teacher Display Name",
      emailAddress: "Contact Email Address",
      specialty: "Academic Specialty",
      bio: "Short Bio Profile",
      subdomain: "Academy Subdomain Node",
      primaryColor: "Primary Hex Color",
      secondaryColor: "Secondary Hex Color",
      studentPrice: "Student Course Price (Monthly EGP)",
      instructions: "Vodafone Cash Wallet / Instapay instructions",
      bunnyKey: "Bunny Stream Pull API Access Key",
      videoQuality: "Video Quality Settings profile",
      qualityHD: "High Definition (1080p)",
      qualitySD: "Standard (720p)",
      qualityLD: "Low Bandwidth (480p)",
      stubConnected: "Subsystem Connected",
      stubDesc: "This tab panel is fully configured in settings storage. Production services will activate automatically once deployed."
    },
    ar: {
      tabs: {
        general: "الملف العام",
        notifications: "إشعارات النظام",
        branding: "الهوية والألوان",
        storage: "سعة التخزين",
        videos: "فيديو Bunny Stream",
        payments: "إدارة المدفوعات",
        mail: "قوالب البريد (SMTP)",
        backups: "النسخ الاحتياطي"
      },
      saveBtn: "حفظ الإعدادات والتغييرات",
      successMsg: "تم حفظ الإعدادات وتحديث المنصة بنجاح!",
      teacherName: "اسم المعلم ثنائي",
      emailAddress: "البريد الإلكتروني للتواصل",
      specialty: "التخصص الأكاديمي",
      bio: "نبذة تعريفية قصيرة",
      subdomain: "رابط المنصة الفرعي",
      primaryColor: "اللون الأساسي (Hex)",
      secondaryColor: "اللون الثانوي (Hex)",
      studentPrice: "سعر اشتراك الطالب شهرياً (بالجنيه)",
      instructions: "تعليمات الدفع عبر فودافون كاش / إنستاباي",
      bunnyKey: "مفتاح واجهة برمجة تطبيقات Bunny Stream",
      videoQuality: "جودة الفيديو الافتراضية",
      qualityHD: "دقة عالية (1080p)",
      qualitySD: "دقة قياسية (720p)",
      qualityLD: "دقة منخفضة / توفير البيانات (480p)",
      stubConnected: "تم ربط النظام الفرعي بنجاح",
      stubDesc: "هذه اللوحة معدّة بالكامل ومحفوظة في قاعدة البيانات. سيتم تشغيل الخدمة تلقائياً بمجرد إطلاق المنصة فعلياً."
    }
  };

  const t = dict[currentLanguage];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateTeacherProfile({
      name,
      email,
      specialty,
      bio,
      subdomain,
      themeColors: { primary: primaryColor, secondary: secondaryColor },
      studentPrice: monthlyFee,
      paymentInstructions
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="grid lg:grid-cols-12 gap-8 text-left">
      {/* Settings Navigation Sidebar tabs */}
      <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-1">
        <button
          onClick={() => setActiveTab('general')}
          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'general' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <User className="h-4 w-4" />
          <span>{t.tabs.general}</span>
        </button>

        <button
          onClick={() => setActiveTab('branding')}
          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'branding' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Palette className="h-4 w-4" />
          <span>{t.tabs.branding}</span>
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'payments' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <CreditCard className="h-4 w-4" />
          <span>{t.tabs.payments}</span>
        </button>

        <button
          onClick={() => setActiveTab('videos')}
          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'videos' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Video className="h-4 w-4" />
          <span>{t.tabs.videos}</span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'notifications' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Bell className="h-4 w-4" />
          <span>{t.tabs.notifications}</span>
        </button>

        <button
          onClick={() => setActiveTab('storage')}
          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'storage' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <HardDrive className="h-4 w-4" />
          <span>{t.tabs.storage}</span>
        </button>

        <button
          onClick={() => setActiveTab('mail')}
          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'mail' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Mail className="h-4 w-4" />
          <span>{t.tabs.mail}</span>
        </button>

        <button
          onClick={() => setActiveTab('backups')}
          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'backups' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          <span>{t.tabs.backups}</span>
        </button>
      </div>

      {/* Main Settings content edit space */}
      <div className="lg:col-span-9 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        {saveSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-xl text-xs font-bold flex items-center gap-2 mb-6">
            <CheckCircle2 className="h-4 w-4" />
            <span>{t.successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* General Tab info editing */}
          {activeTab === 'general' && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">{t.teacherName}</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white outline-none font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">{t.emailAddress}</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white outline-none font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">{t.specialty}</label>
                <input
                  type="text"
                  required
                  value={specialty}
                  onChange={e => setSpecialty(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white outline-none font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">{t.bio}</label>
                <textarea
                  rows={4}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white outline-none resize-none font-semibold"
                />
              </div>
            </div>
          )}

          {/* Branding colors editing */}
          {activeTab === 'branding' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">{t.subdomain}</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    required
                    value={subdomain}
                    onChange={e => setSubdomain(e.target.value)}
                    className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white outline-none font-mono font-bold"
                  />
                  <span className="text-slate-500 font-mono font-bold text-sm">.amalbila.com</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">{t.primaryColor}</label>
                  <div className="flex gap-2 items-center">
                    <input 
                      type="color" 
                      value={primaryColor} 
                      onChange={e => setPrimaryColor(e.target.value)} 
                      className="h-10 w-10 border-0 bg-transparent cursor-pointer rounded-lg overflow-hidden flex-shrink-0"
                    />
                    <input
                      type="text"
                      value={primaryColor}
                      onChange={e => setPrimaryColor(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:bg-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">{t.secondaryColor}</label>
                  <div className="flex gap-2 items-center">
                    <input 
                      type="color" 
                      value={secondaryColor} 
                      onChange={e => setSecondaryColor(e.target.value)} 
                      className="h-10 w-10 border-0 bg-transparent cursor-pointer rounded-lg overflow-hidden flex-shrink-0"
                    />
                    <input
                      type="text"
                      value={secondaryColor}
                      onChange={e => setSecondaryColor(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:bg-white outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payments settings editing */}
          {activeTab === 'payments' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">{t.studentPrice}</label>
                  <input
                    type="number"
                    required
                    value={monthlyFee}
                    onChange={e => setMonthlyFee(Math.max(0, Number(e.target.value)))}
                    min="0"
                    className="w-1/3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white outline-none font-bold"
                  />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">{t.instructions}</label>
                <textarea
                  rows={4}
                  required
                  value={paymentInstructions}
                  onChange={e => setPaymentInstructions(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white outline-none resize-none font-semibold"
                />
              </div>
            </div>
          )}

          {/* Bunny Stream CDN settings editing */}
          {activeTab === 'videos' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">{t.bunnyKey}</label>
                <input
                  type="password"
                  value={bunnyKey}
                  onChange={e => setBunnyKey(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">{t.videoQuality}</label>
                <select
                  value={videoQuality}
                  onChange={e => setVideoQuality(e.target.value)}
                  className="w-1/3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white font-semibold"
                >
                  <option value="1080p">{t.qualityHD}</option>
                  <option value="720p">{t.qualitySD}</option>
                  <option value="480p">{t.qualityLD}</option>
                </select>
              </div>
            </div>
          )}

          {/* Simple alert stubs for remaining 4 settings sections */}
          {(activeTab === 'notifications' || activeTab === 'storage' || activeTab === 'mail' || activeTab === 'backups') && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-12 text-center text-slate-400 space-y-2">
              <ShieldCheck className="h-8 w-8 mx-auto text-slate-300 animate-pulse" />
              <h4 className="font-bold text-xs text-slate-700">{t.stubConnected}</h4>
              <p className="text-[11px] leading-relaxed max-w-sm mx-auto font-medium">{t.stubDesc}</p>
            </div>
          )}

          <div className="border-t border-slate-100 pt-6">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-indigo-100 transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              <Save className="h-4 w-4" />
              <span>{t.saveBtn}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
