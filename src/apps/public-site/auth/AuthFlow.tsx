import React, { useState } from 'react';
import { useAppState } from '../../../shared/context/AppState';
import { Mail, Lock, User, ShieldAlert, ArrowLeft, ArrowRight, Loader2, KeyRound, Eye, EyeOff } from 'lucide-react';

export default function AuthFlow() {
  const { currentLanguage, setRole, setLanguage } = useAppState();
  
  // Auth state: 'login' | 'register' | 'verify' | 'forgot'
  const [view, setView] = useState<'login' | 'register' | 'verify' | 'forgot'>('login');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Translations
  const dict = {
    en: {
      loginTitle: "Welcome Back",
      loginSub: "Access your teacher dashboard & classes",
      registerTitle: "Create Teacher Account",
      registerSub: "Launch your own digital academy in minutes",
      forgotTitle: "Recover Password",
      forgotSub: "Enter your email to receive recovery link",
      verifyTitle: "Verify Your Email",
      verifySub: "We sent a 6-digit OTP code to your email",
      emailLabel: "Email Address",
      passwordLabel: "Password",
      nameLabel: "Full Name",
      rememberMe: "Remember me",
      forgotBtn: "Forgot password?",
      loginBtn: "Sign In",
      registerBtn: "Create Account",
      resetBtn: "Send Reset Link",
      verifyBtn: "Verify & Continue",
      noAccount: "Don't have an account?",
      hasAccount: "Already have an account?",
      studentPortalToggle: "Are you a student? Login via Student Portal",
      verificationCode: "Verification Code",
      backToLogin: "Back to Login",
      resendOtp: "Resend Code",
      termsText: "I agree to the Terms of Use and Privacy Policy",
      invalidEmail: "Please enter a valid email address.",
      invalidFields: "Please fill all required fields.",
      wrongOtp: "Invalid code. Try using: 123456",
      successReset: "A reset link has been sent to your email address.",
      successVerify: "Email verified successfully!",
      otpResent: "A new code has been sent to your email."
    },
    ar: {
      loginTitle: "مرحباً بك مجدداً",
      loginSub: "سجل الدخول لإدارة فصولك ودروسك بسهولة",
      registerTitle: "إنشاء حساب معلم جديد",
      registerSub: "أنشئ منصتك التعليمية وابدأ في دقائق",
      forgotTitle: "استعادة كلمة المرور",
      forgotSub: "أدخل بريدك الإلكتروني لإرسال رابط إعادة التعيين",
      verifyTitle: "تأكيد البريد الإلكتروني",
      verifySub: "تم إرسال رمز التحقق المكون من 6 أرقام لبريدك",
      emailLabel: "البريد الإلكتروني",
      passwordLabel: "كلمة المرور",
      nameLabel: "الاسم الكامل",
      rememberMe: "تذكرني",
      forgotBtn: "نسيت كلمة المرور؟",
      loginBtn: "تسجيل الدخول",
      registerBtn: "إنشاء الحساب",
      resetBtn: "إرسال رابط استعادة المرور",
      verifyBtn: "تأكيد ومتابعة",
      noAccount: "ليس لديك حساب؟",
      hasAccount: "لديك حساب بالفعل؟",
      studentPortalToggle: "هل أنت طالب؟ سجل دخولك كطالب من هنا",
      verificationCode: "رمز التحقق",
      backToLogin: "العودة لتسجيل الدخول",
      resendOtp: "إعادة إرسال الرمز",
      termsText: "أوافق على شروط الاستخدام وسياسة الخصوصية",
      invalidEmail: "يرجى إدخال بريد إلكتروني صالح.",
      invalidFields: "يرجى ملء جميع الحقول المطلوبة.",
      wrongOtp: "رمز غير صحيح. جرب الرمز: 123456",
      successReset: "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.",
      successVerify: "تم تأكيد بريدك الإلكتروني بنجاح!",
      otpResent: "تم إعادة إرسال الرمز إلى بريدك الإلكتروني."
    }
  };

  const t = dict[currentLanguage];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError(t.invalidFields);
      return;
    }

    setLoading(true);
    // Simulate network latency
    setTimeout(() => {
      setLoading(false);
      if (email.toLowerCase().includes('student')) {
        setRole('student');
      } else {
        setRole('teacher');
      }
    }, 1200);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError(t.invalidFields);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setView('verify'); // Forward to verification code step
    }, 1200);
  };

  const handleOtpChange = (value: string, idx: number) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[idx] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && idx < 5) {
      const nextInput = document.getElementById(`otp-${idx + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      const prevInput = document.getElementById(`otp-${idx - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const code = otp.join('');
    if (code.length < 6) {
      setError(t.invalidFields);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (code === '123456') {
        setSuccess(t.successVerify);
        setTimeout(() => {
          setRole('onboarding'); // Forward to Onboarding Step 1
        }, 1000);
      } else {
        setError(t.wrongOtp);
      }
    }, 1200);
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError(t.invalidFields);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(t.successReset);
      setTimeout(() => {
        setSuccess('');
        setView('login');
      }, 3000);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl" />

      {/* Language Toggle in Top corner */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <button 
          onClick={() => setLanguage(currentLanguage === 'en' ? 'ar' : 'en')}
          className="bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors"
        >
          {currentLanguage === 'en' ? 'العربية' : 'English'}
        </button>
        <button 
          onClick={() => setRole('visitor')}
          className="bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors"
        >
          {currentLanguage === 'en' ? 'Landing' : 'الرئيسية'}
        </button>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl p-8 relative z-10">
        <div className="text-center mb-8">
          <div className="h-12 w-12 bg-indigo-50 rounded-xl flex items-center justify-center mx-auto text-indigo-600 mb-4 font-black text-2xl">
            أ
          </div>
          
          {view === 'login' && (
            <>
              <h2 className="text-2xl font-black text-slate-900">{t.loginTitle}</h2>
              <p className="text-sm text-slate-500 mt-1 font-medium">{t.loginSub}</p>
            </>
          )}
          {view === 'register' && (
            <>
              <h2 className="text-2xl font-black text-slate-900">{t.registerTitle}</h2>
              <p className="text-sm text-slate-500 mt-1 font-medium">{t.registerSub}</p>
            </>
          )}
          {view === 'verify' && (
            <>
              <h2 className="text-2xl font-black text-slate-900">{t.verifyTitle}</h2>
              <p className="text-sm text-slate-500 mt-1 font-medium">{t.verifySub}</p>
            </>
          )}
          {view === 'forgot' && (
            <>
              <h2 className="text-2xl font-black text-slate-900">{t.forgotTitle}</h2>
              <p className="text-sm text-slate-500 mt-1 font-medium">{t.forgotSub}</p>
            </>
          )}
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-lg text-sm flex items-center gap-2 mb-6 font-medium animate-shake">
            <ShieldAlert className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3 rounded-lg text-sm flex items-center gap-2 mb-6 font-medium">
            <KeyRound className="h-4 w-4 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {view === 'login' && (
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">{t.emailLabel}</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Mail className="h-4 w-4" />
                </span>
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">{t.passwordLabel}</label>
                <button 
                  type="button" 
                  onClick={() => setView('forgot')}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
                >
                  {t.forgotBtn}
                </button>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Lock className="h-4 w-4" />
                </span>
                <input 
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all outline-none"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                <input type="checkbox" className="h-4 w-4 border-slate-300 text-indigo-600 focus:ring-indigo-500 rounded" />
                <span>{t.rememberMe}</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-md shadow-indigo-100"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>{t.loginBtn}</span>
            </button>

            <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-xl text-center text-[11px] font-semibold text-indigo-700">
              <span className="block font-bold mb-1">💡 Prototype Testing Hint:</span>
              Use an email containing <span className="font-mono bg-indigo-200/50 px-1 py-0.5 rounded">student</span> to log into the Student Portal.<br/>
              Any other email logs into the Teacher Dashboard.
            </div>

            <p className="text-center text-sm text-slate-500 font-medium">
              {t.noAccount}{' '}
              <button 
                type="button" 
                onClick={() => setView('register')} 
                className="text-indigo-600 font-bold hover:text-indigo-700"
              >
                {t.registerBtn}
              </button>
            </p>
          </form>
        )}

        {view === 'register' && (
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">{t.nameLabel}</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <User className="h-4 w-4" />
                </span>
                <input 
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Dr. Mohamed Shaker"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">{t.emailLabel}</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Mail className="h-4 w-4" />
                </span>
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">{t.passwordLabel}</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Lock className="h-4 w-4" />
                </span>
                <input 
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all outline-none"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <label className="flex items-start gap-2 text-xs text-slate-500 cursor-pointer pt-1">
              <input type="checkbox" required className="h-4 w-4 border-slate-300 text-indigo-600 focus:ring-indigo-500 rounded mt-0.5" />
              <span>{t.termsText}</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-md shadow-indigo-100"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>{t.registerBtn}</span>
            </button>

            <p className="text-center text-sm text-slate-500 font-medium">
              {t.hasAccount}{' '}
              <button 
                type="button" 
                onClick={() => setView('login')} 
                className="text-indigo-600 font-bold hover:text-indigo-700"
              >
                {t.loginBtn}
              </button>
            </p>
          </form>
        )}

        {view === 'verify' && (
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="flex justify-center gap-2.5" dir="ltr">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(e.target.value, idx)}
                  onKeyDown={e => handleOtpKeyDown(e, idx)}
                  aria-label={currentLanguage === 'en' ? `OTP digit ${idx + 1}` : `رمز التحقق الرقم ${idx + 1}`}
                  className="h-12 w-12 text-center text-lg font-bold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all outline-none"
                />
              ))}
            </div>

            <div className="text-center text-xs text-indigo-500 bg-indigo-50/50 p-2 rounded-lg font-mono">
              Demo OTP code: 123456
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-md shadow-indigo-100"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>{t.verifyBtn}</span>
            </button>

            <div className="text-center text-sm font-semibold">
              <button type="button" onClick={() => { setOtp(['', '', '', '', '', '']); setError(''); setSuccess(t.otpResent); }} className="text-slate-500 hover:text-slate-600 mr-4">
                {t.resendOtp}
              </button>
              <button 
                type="button" 
                onClick={() => setView('login')}
                className="text-indigo-600 hover:text-indigo-700"
              >
                {t.backToLogin}
              </button>
            </div>
          </form>
        )}

        {view === 'forgot' && (
          <form onSubmit={handleForgot} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">{t.emailLabel}</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Mail className="h-4 w-4" />
                </span>
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-md shadow-indigo-100"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>{t.resetBtn}</span>
            </button>

            <div className="text-center text-sm font-bold">
              <button 
                type="button" 
                onClick={() => setView('login')}
                className="text-indigo-600 hover:text-indigo-700"
              >
                {t.backToLogin}
              </button>
            </div>
          </form>
        )}

        {/* Portal Login shortcut (very important for prototype navigation) */}
        <div className="border-t border-slate-100 mt-8 pt-6 text-center">
          <button
            onClick={() => setRole('student')}
            className="text-xs text-indigo-600 font-bold hover:underline flex items-center justify-center gap-1.5 mx-auto"
          >
            <span>{t.studentPortalToggle}</span>
            {currentLanguage === 'en' ? <ArrowRight className="h-3 w-3" /> : <ArrowLeft className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
