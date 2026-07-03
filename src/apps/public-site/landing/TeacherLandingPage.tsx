import React, { useEffect, useRef, useState } from 'react';
import { useAppState } from "../../../shared/context/AppState";
import {
  BookOpen,
  Play,
  TrendingUp,
  Target,
  Headphones,
  Users,
  Award,
  Video,
  Star,
  ChevronLeft,
  GraduationCap,
  Sparkles,
  BarChart3,
  Zap,
  ArrowLeft,
  Menu,
  X,
} from "lucide-react";

/* ─────────────────── helpers ─────────────────── */
function useCountUp(end: number, duration = 1200) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const listener = (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting) {
        let start: number | null = null;
        const step = (timestamp: number) => {
          if (!start) start = timestamp;
          const progress = Math.min((timestamp - start) / duration, 1);
          setCount(Math.floor(end * progress));
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    };
    const observer = new IntersectionObserver(listener, { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);
  return { ref, count };
}

function AnimatedStat({ end, suffix, label }: { end: number; suffix: string; label: string }) {
  const { ref, count } = useCountUp(end);
  return (
    <div ref={ref} className="flex-1 px-4 min-w-[140px] py-4">
      <p className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-1">
        +{count.toLocaleString()}<span className="text-indigo-600 mr-0.5">{suffix}</span>
      </p>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
    </div>
  );
}

/* ─────────────────── component ─────────────────── */
export default function TeacherLandingPage() {
  const { teacherProfile, setRole } = useAppState();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleLogin = () => setRole("student");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="min-h-screen bg-slate-50 flex flex-col font-arabic text-slate-900 overflow-x-hidden"
      dir="rtl"
    >
      {/* ───────── Header ───────── */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-xl shadow-sm border-b border-slate-200/50"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-black text-xl tracking-tight text-slate-900 leading-none">
                {teacherProfile.name}
              </h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                {teacherProfile.specialty}
              </p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 font-bold text-slate-500 text-sm">
            {[
              ["عن المستر", "#mentor"],
              ["المميزات", "#features"],
              ["المراحل", "#grades"],
              ["المراجعات", "#testimonials"],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="relative py-1 hover:text-indigo-600 transition-colors group"
              >
                {label}
                <span className="absolute bottom-0 right-0 h-0.5 bg-indigo-600 w-0 group-hover:w-full transition-all duration-300 rounded-full" />
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleLogin}
              className="hidden sm:inline-flex px-5 py-2 text-sm font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors active:scale-95"
            >
              تسجيل الدخول
            </button>
            <button
              onClick={handleLogin}
              className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:shadow-xl hover:shadow-indigo-600/20 transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
            >
              إنشاء حساب مجاني
            </button>
            <button
              onClick={() => setMobileNavOpen(true)}
              className="md:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <Menu className="h-5 w-5 text-slate-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-[60] bg-white/95 backdrop-blur-xl flex flex-col p-6">
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white">
                <GraduationCap className="h-6 w-6" />
              </div>
              <span className="font-black text-lg">{teacherProfile.name}</span>
            </div>
            <button
              onClick={() => setMobileNavOpen(false)}
              className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex flex-col gap-6 text-2xl font-black">
            {["عن المستر", "المميزات", "المراحل", "المراجعات"].map((label) => (
              <a
                key={label}
                href="#"
                onClick={() => setMobileNavOpen(false)}
                className="hover:text-indigo-600 transition-colors py-2"
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="mt-auto space-y-3">
            <button
              onClick={handleLogin}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-lg shadow-lg"
            >
              إنشاء حساب مجاني
            </button>
            <button
              onClick={handleLogin}
              className="w-full py-4 rounded-2xl bg-slate-100 text-slate-700 font-bold text-lg"
            >
              تسجيل الدخول
            </button>
          </div>
        </div>
      )}

      {/* ───────── Hero ───────── */}
      <section className="relative overflow-hidden pt-8 pb-32 lg:pt-16 lg:pb-44 px-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgb(79,70,229,0.08)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgb(139,92,246,0.06)_0%,transparent_40%)]" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Text */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100/80 text-indigo-700 text-xs font-bold shadow-sm">
              <Sparkles className="h-4 w-4 text-indigo-500" />
              <span>منصة تعليمية متكاملة</span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.15] tracking-tighter">
              تعلم بذكاء،
              <br />
              <span className="bg-gradient-to-l from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                من مكان واحد
              </span>
            </h2>

            <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed max-w-xl">
              آلاف الطلاب مقفلين المادة. أحد أبرز معلمي الثانوية العامة في مصر،
              منهج معتمد على التبسيط، التحليل، والتدريب العملي لضمان أعلى درجات
              الفهم والثقة.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-2">
              <button
                onClick={handleLogin}
                className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold px-8 py-4 rounded-xl shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2 group transition-all hover:-translate-y-1 active:scale-95"
              >
                <span>ابدأ التعلم الآن</span>
                <ChevronLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              </button>
              <button className="bg-white hover:bg-slate-50 text-slate-800 font-bold px-8 py-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-center gap-2 transition-all hover:-translate-y-1 active:scale-95 group">
                <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                  <Play className="h-3 w-3 text-indigo-600 fill-indigo-600 ml-0.5" />
                </div>
                <span>شاهد فيديو تعريفي</span>
              </button>
            </div>

            {/* Trust row */}
            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-2">
                {['male-1', 'female-1', 'male-2'].map((id, i) => (
                  <div
                    key={id}
                    className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden"
                    style={{ marginRight: i > 0 ? '-12px' : undefined }}
                  >
                    <img
                      src={`https://images.unsplash.com/photo-${
                        i === 0
                          ? '1560250097-0b93528c311a'
                          : i === 1
                          ? '1573496359142-b8d87734a5a2'
                          : '1472099645785-5658abdc9467'
                      }?w=80&auto=format&fit=crop&q=60`}
                      alt="Student"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className="h-4 w-4 text-amber-400 fill-amber-400"
                    />
                  ))}
                </div>
                <p className="text-xs font-bold text-slate-400 mt-0.5">
                  10,000+ طالب سعيد بثقة 4.9/5
                </p>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="lg:col-span-5 relative h-[420px] lg:h-[520px] w-full flex items-center justify-center">
            {/* Blobs */}
            <div
              className="absolute inset-0 bg-indigo-200/40 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] animate-spin-slow opacity-80 blur-2xl scale-110"
              style={{ animationDuration: '18s' }}
            />
            <div
              className="absolute inset-0 bg-purple-200/30 rounded-[30%_70%_70%_30%/30%_30%_70%_70%] animate-spin-reverse opacity-80 blur-2xl scale-90"
              style={{ animationDuration: '22s' }}
            />

            <div className="relative z-10 w-full max-w-[340px] lg:max-w-sm aspect-[3/4] rounded-[2.5rem] overflow-hidden border-[5px] border-white/80 shadow-2xl shadow-slate-300/30 bg-slate-200">
              <img
                src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=800&auto=format&fit=crop&q=80"
                alt="Teacher"
                className="w-full h-full object-cover object-top"
              />
            </div>

            {/* Floating Badges */}
            <div className="absolute top-10 -right-4 lg:-right-8 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl shadow-slate-200/40 border border-white/50 flex items-center gap-3 animate-float z-20">
              <div className="h-10 w-10 bg-gradient-to-br from-amber-400 to-orange-400 rounded-xl flex items-center justify-center shadow-lg shadow-amber-400/20">
                <Award className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">تقييم الطلاب</p>
                <p className="text-lg font-black text-slate-900">4.9/5</p>
              </div>
            </div>

            <div className="absolute bottom-14 -left-4 lg:-left-10 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl shadow-slate-200/40 border border-white/50 flex items-center gap-3 animate-float-delayed z-20">
              <div className="h-10 w-10 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-400/20">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">طلابنا</p>
                <p className="text-lg font-black text-slate-900">+10,000</p>
              </div>
            </div>

            <div className="absolute top-24 -left-6 lg:-left-14 bg-gradient-to-r from-indigo-600 to-violet-600 text-white p-3 rounded-2xl shadow-xl shadow-indigo-600/20 z-20 animate-float">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                <span className="text-xs font-bold">نسبة نجاح 95%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── Stats ───────── */}
      <section className="relative z-20 px-6 max-w-6xl mx-auto -mt-16 w-full" id="mentor">
        <div className="relative bg-white/80 backdrop-blur-xl border border-slate-100 shadow-2xl shadow-slate-200/40 rounded-3xl p-8 flex flex-wrap items-center justify-between gap-4">
          <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
          <AnimatedStat end={10000} suffix="" label="طالب مسجل" />
          <div className="w-px h-12 bg-slate-100 hidden md:block" />
          <AnimatedStat end={500} suffix="" label="فيديو تعليمي" />
          <div className="w-px h-12 bg-slate-100 hidden md:block" />
          <AnimatedStat end={15} suffix="" label="سنة خبرة" />
          <div className="w-px h-12 bg-slate-100 hidden md:block" />
          <div className="flex-1 px-4 min-w-[140px] py-4 text-center">
            <div className="flex items-center justify-center gap-1 text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-1">
              <span>4.9</span>
              <Star className="h-6 w-6 md:h-7 md:w-7 text-amber-400 fill-amber-400" />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              تقييم الطلاب
            </p>
          </div>
        </div>
      </section>

      {/* ───────── Features Bento ───────── */}
      <section id="features" className="py-24 lg:py-32 bg-slate-50 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">
              <Zap className="h-4 w-4" />
              <span>المميزات</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              لماذا تختار منصتنا؟
            </h2>
            <p className="text-slate-500 font-medium text-lg leading-relaxed">
              نقدم تجربة تعليمية متكاملة تساعدك على النجاح بأسلوب احترافي.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 auto-rows-fr">
            {/* Feature 1 — Large */}
            <div className="md:col-span-2 relative bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-2xl hover:shadow-indigo-600/5 transition-all duration-500 flex flex-col justify-between overflow-hidden group">
              <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="h-14 w-14 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-3">محتوى منظم وشامل</h3>
                <p className="text-slate-500 leading-relaxed max-w-md">
                  شرح وافٍ، أسئلة متنوعة، وتجارب عملية مسجلة. نظام بحث متقدم يتيح لك الوصول للسؤال ورقمه في ثانية واحدة.
                </p>
              </div>
              {/* Progress bar */}
              <div className="relative z-10 mt-8 bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center gap-4">
                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="w-3/4 h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full" />
                </div>
                <span className="text-xs font-bold text-slate-400">نسبة الإنجاز %75</span>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-2xl hover:shadow-purple-600/5 transition-all duration-500 group">
              <div className="h-14 w-14 bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                <Video className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">فيديوهات عالية الجودة</h3>
              <p className="text-slate-500 leading-relaxed text-sm">
                وضوح مثالي للصوت والصورة، مع تجارب مصورة لضمان فهم أعمق للمادة العلمية.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-2xl hover:shadow-emerald-600/5 transition-all duration-500 group">
              <div className="h-14 w-14 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">متابعة تقدم الطالب</h3>
              <p className="text-slate-500 leading-relaxed text-sm">
                قياس دقيق للأداء والنتائج أونلاين، لمعرفة نقاط القوة والضعف ومعالجتها فوراً.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-2xl hover:shadow-amber-600/5 transition-all duration-500 group">
              <div className="h-14 w-14 bg-gradient-to-br from-amber-100 to-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                <Target className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">اختبارات تفاعلية</h3>
              <p className="text-slate-500 leading-relaxed text-sm">
                أسئلة تدريبية بعد كل جزء من الدرس للتأكد من استيعاب المعلومة وتثبيتها بقوة.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-2xl hover:shadow-blue-600/5 transition-all duration-500 group">
              <div className="h-14 w-14 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                <Headphones className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">دعم مستمر وأكاديمي</h3>
              <p className="text-slate-500 leading-relaxed text-sm">
                رد فوري على أسئلة الطلاب من فريق أكاديمي متخصص على مدار الساعة.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── Grades ───────── */}
      <section id="grades" className="py-24 lg:py-32 bg-white px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider">
              <BarChart3 className="h-4 w-4" />
              <span>المراحل الدراسية</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              بندرس للمراحل
            </h2>
            <p className="text-slate-500 font-medium text-lg">
              اختر صفك الدراسي لتبدأ مسيرتك نحو التفوق
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Grade 2 */}
            <div className="group relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-600 to-cyan-500 p-10 text-white shadow-2xl shadow-blue-500/20 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/40 cursor-pointer md:-translate-y-6">
              <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/10 blur-3xl group-hover:scale-110 transition-transform duration-700" />
              <div className="relative z-10 flex flex-col items-start space-y-6">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm text-4xl font-black tracking-tighter">
                  ٢
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-black mb-2">الصف الثاني الثانوي</h3>
                  <p className="text-blue-100/90 font-medium leading-relaxed">
                    منهج متكامل وتأسيس قوي لمرحلة الثانوية العامة بأحدث أساليب الشرح.
                  </p>
                </div>
                <button
                  onClick={handleLogin}
                  className="mt-2 bg-white text-blue-700 px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-black/10 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                  <span>استكشف المحتوى</span>
                  <ChevronLeft className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Grade 3 */}
            <div className="group relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-700 to-purple-800 p-10 text-white shadow-2xl shadow-indigo-500/20 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/40 cursor-pointer md:translate-y-6">
              <div className="absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-white/10 blur-3xl group-hover:scale-110 transition-transform duration-700" />
              <div className="relative z-10 flex flex-col items-start space-y-6">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm text-4xl font-black tracking-tighter">
                  ٣
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-black mb-2">الصف الثالث الثانوي</h3>
                  <p className="text-indigo-200/90 font-medium leading-relaxed">
                    طريقك للتميز والدرجة النهائية مع خطة مراجعة شاملة ومكثفة.
                  </p>
                </div>
                <button
                  onClick={handleLogin}
                  className="mt-2 bg-white text-indigo-700 px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-black/10 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                  <span>استكشف المحتوى</span>
                  <ChevronLeft className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── Testimonials ───────── */}
      <section id="testimonials" className="py-24 lg:py-32 bg-slate-50 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider">
              <Star className="h-4 w-4" />
              <span>المراجعات</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              ماذا يقول طلابنا؟
            </h2>
            <p className="text-slate-500 font-medium text-lg">
              تجارب حقيقية من طلاب حققوا أهدافهم معنا
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "أحمد محمود",
                review:
                  "المنصة رائعة والفيديوهات عالية الجودة. ساعدتني كثيراً في فهم المادة وتحقيق التفوق بفضل الشرح المبسط والتطبيقات العملية.",
                grade: "الصف الثالث الثانوي",
              },
              {
                name: "سارة مصطفى",
                review:
                  "شرح واضح ومبسط، والدعم سريع الاستجابة. أنصح أي طالب يريد التميز بالانضمام لأن الامتحانات هنا تعكس مستوى الامتحان الحقيقي.",
                grade: "الصف الثالث الثانوي",
              },
              {
                name: "محمد علي",
                review:
                  "دورات متنوعة ومفيدة جداً، ونظام الامتحانات ممتاز ويجعلك في جو الامتحان الحقيقي. متابعة المستر وفرق الدعم لا مثيل لها.",
                grade: "الصف الثاني الثانوي",
              },
            ].map((t, i) => (
              <div
                key={i}
                className={`bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-500 relative group ${
                  i === 1 ? "md:-translate-y-4" : ""
                }`}
              >
                <div className="absolute top-6 left-6 text-6xl text-indigo-50 font-serif leading-none group-hover:text-indigo-100 transition-colors duration-300">
                  "
                </div>
                <div className="flex gap-1 mb-5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className="h-4 w-4 text-amber-400 fill-amber-400"
                    />
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-loose mb-8 relative z-10 font-medium">
                  {t.review}
                </p>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 text-indigo-600 flex items-center justify-center font-black text-lg border border-indigo-100">
                    {t.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{t.name}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {t.grade}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── CTA ───────── */}
      <section className="py-24 lg:py-32 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-[2.5rem] blur opacity-20" />
          <div className="relative bg-slate-900 rounded-[2.5rem] p-12 md:p-20 text-center text-white shadow-2xl shadow-indigo-900/20 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgb(99,102,241,0.15)_0%,transparent_50%)]" />
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-500 rounded-full blur-[120px] opacity-30" />
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-violet-500 rounded-full blur-[120px] opacity-20" />

            <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
                جاهز تبدأ رحلتك التعليمية؟
              </h2>
              <p className="text-slate-400 font-medium text-lg md:text-xl leading-relaxed">
                انضم لأكثر من 10,000 طالب وابدأ مسيرتك نحو التفوق والنجاح اليوم.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                <button
                  onClick={handleLogin}
                  className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white px-10 py-4 rounded-2xl text-base font-bold shadow-xl shadow-indigo-500/20 transition-all hover:-translate-y-1 active:scale-95"
                >
                  إنشاء حساب مجاني
                </button>
                <button
                  onClick={handleLogin}
                  className="bg-slate-800 text-white px-10 py-4 rounded-2xl text-base font-bold border border-slate-700 hover:bg-slate-700 hover:border-slate-600 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>تسجيل الدخول</span>
                  <ArrowLeft className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── Footer ───────── */}
      <footer className="bg-white border-t border-slate-100 py-12 px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/10">
              <GraduationCap className="h-6 w-6" />
            </div>
            <span className="font-black text-lg text-slate-900 tracking-tight">
              {teacherProfile.name}
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-sm font-bold text-slate-400">
            {["عن المنصة", "الشروط والأحكام", "سياسة الخصوصية", "تواصل معنا"].map((item) => (
              <a key={item} href="#" className="hover:text-indigo-600 transition-colors">
                {item}
              </a>
            ))}
          </div>
          <p className="text-xs text-slate-300 font-bold">
            © {new Date().getFullYear()} جميع الحقوق محفوظة.
          </p>
        </div>
      </footer>
    </div>
  );
}
