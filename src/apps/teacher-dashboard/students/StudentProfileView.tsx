import React, { useMemo } from 'react';
import { Student } from '../../../shared/types';
import { useAppState } from '../../../shared/context/AppState';
import {
  ArrowLeft,
  BarChart3,
  Award,
  FileText,
  Mail,
  BookOpen,
  Calendar,
  Target,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  XCircle,
  Minus,
  PlayCircle,
  CheckSquare,
  Eye
} from 'lucide-react';

interface StudentProfileViewProps {
  student: Student;
  onBack: () => void;
}

import ExamSubmissionViewer from './ExamSubmissionViewer';

/* ─── Sparkline ─────────────────────────── */
function Sparkline({ values, color = '#4361ee' }: { values: number[]; color?: string }) {
  if (values.length < 2) return null;
  const max = Math.max(...values, 100);
  const min = 0;
  const range = max - min || 1;
  const w = 160, h = 40, pad = 4;
  const pts = values.map((v, i) => {
    const x = pad + (i / (values.length - 1)) * (w - pad * 2);
    const y = h - pad - ((v - min) / range) * (h - pad * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const lastX = parseFloat(pts[pts.length - 1].split(',')[0]);
  const lastY = parseFloat(pts[pts.length - 1].split(',')[1]);

  // Area fill path
  const area = `M ${pts[0]} ${pts.slice(1).map(p => `L ${p}`).join(' ')} L ${(w - pad).toFixed(1)},${(h - pad).toFixed(1)} L ${pad},${(h - pad).toFixed(1)} Z`;

  return (
    <svg width={w} height={h} className="overflow-visible">
      <defs>
        <linearGradient id={`sg-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#sg-${color.replace('#', '')})`} />
      <polyline
        points={pts.join(' ')}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={lastX} cy={lastY} r="4" fill={color} stroke="white" strokeWidth="2" />
    </svg>
  );
}

/* ─── Relative time helper ─────────────── */
function relativeTime(dateStr: string, isAr: boolean): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (isAr) {
    if (days > 1) return `منذ ${days} أيام`;
    if (days === 1) return 'منذ يوم';
    if (hours > 1) return `منذ ${hours} ساعات`;
    if (hours === 1) return 'منذ ساعة';
    return `منذ ${mins} دقيقة`;
  } else {
    if (days > 1) return `${days} days ago`;
    if (days === 1) return 'Yesterday';
    if (hours > 1) return `${hours} hours ago`;
    if (hours === 1) return '1 hour ago';
    return `${mins} min ago`;
  }
}

/* ─── Main Component ────────────────────── */
export default function StudentProfileView({ student, onBack }: StudentProfileViewProps) {
  const { currentLanguage, classes, exams, submissions, questions } = useAppState();
  const isAr = currentLanguage === 'ar';
  const [viewingSubmissionId, setViewingSubmissionId] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState<'overview' | 'exams'>('overview');

  if (viewingSubmissionId) {
    const sub = submissions.find(s => s.id === viewingSubmissionId);
    const exam = exams.find(e => e.id === sub?.examId);
    if (sub && exam) {
      return <ExamSubmissionViewer exam={exam} submission={sub} onBack={() => setViewingSubmissionId(null)} />;
    }
  }

  const t = {
    en: {
      back: 'Back',
      lastSeen: 'Last seen',
      performance: 'Performance Overview',
      examsTaken: 'Exams Taken',
      avgScore: 'Avg Score',
      bestScore: 'Best Score',
      worstScore: 'Worst Score',
      noExams: 'No exams attempted yet.',
      scoreTrend: 'Score Trend',
      noTrend: 'Not enough data for trend',
      examBreakdown: 'Exam History & Breakdown',
      percentile: 'Percentile vs. class',
      questionLevel: 'Question-Level Accuracy',
      correct: 'Correct',
      wrong: 'Wrong',
      essay: 'Essay',
      mcq: 'MCQ',
      engagement: 'Engagement & Progress',
      overallProgress: 'Overall Progress',
      courseProgress: 'Course Progress',
      notes: 'Private Notes',
      notesPlaceholder: 'Write a private note about this student…',
      submitted: 'Submitted',
      graded: 'Graded',
      score: 'Score',
      noAttempts: 'No attempts recorded',
      rank: 'Rank in class',
      active: 'Active',
      monthly: 'Monthly',
      yearly: 'Yearly',
      free: 'Free',
    },
    ar: {
      back: 'رجوع',
      lastSeen: 'آخر ظهور',
      performance: 'نظرة عامة على الأداء',
      examsTaken: 'الامتحانات المُجراة',
      avgScore: 'المتوسط',
      bestScore: 'أفضل درجة',
      worstScore: 'أضعف درجة',
      noExams: 'لم يُجرِ الطالب أي امتحانات بعد.',
      scoreTrend: 'منحنى الدرجات',
      noTrend: 'لا توجد بيانات كافية للمنحنى',
      examBreakdown: 'سجل الامتحانات والتفاصيل',
      percentile: 'المئينية مقارنة بالفصل',
      questionLevel: 'دقة الأسئلة',
      correct: 'صحيح',
      wrong: 'خطأ',
      essay: 'مقال',
      mcq: 'اختيار متعدد',
      engagement: 'التفاعل والتقدم',
      overallProgress: 'التقدم العام',
      courseProgress: 'تقدم الدورة',
      notes: 'ملاحظات خاصة',
      notesPlaceholder: 'اكتب ملاحظة خاصة عن هذا الطالب…',
      submitted: 'مُسلَّم',
      graded: 'مُصحَّح',
      score: 'الدرجة',
      noAttempts: 'لا توجد محاولات مسجلة',
      rank: 'الترتيب في الفصل',
      active: 'نشط',
      monthly: 'شهري',
      yearly: 'سنوي',
      free: 'مجاني',
      videoWatched: 'مشاهدة الفيديو',
      contentRead: 'قراءة المحتوى',
      homework: 'الواجب',
      viewExam: 'عرض الإجابات',
    },
  }[currentLanguage];

  const studentClass = classes.find(c => c.id === student.classId);

  /* ── All student submissions ── */
  const mySubmissions = useMemo(
    () =>
      submissions
        .filter(s => s.studentId === student.id && s.status === 'graded' && s.score != null)
        .sort((a, b) => (a.submittedAt ?? '').localeCompare(b.submittedAt ?? '')),
    [submissions, student.id]
  );

  /* ── Exam max scores ── */
  const examMaxScores: Record<string, number> = useMemo(() => {
    const map: Record<string, number> = {};
    exams.forEach(e => { map[e.id] = e.id === 'e-1' ? 12 : e.questionIds.length * 4; });
    return map;
  }, [exams]);

  /* ── Score percentages per submission ── */
  const scorePcts = useMemo(
    () => mySubmissions.map(s => Math.round(((s.score ?? 0) / (examMaxScores[s.examId] ?? 12)) * 100)),
    [mySubmissions, examMaxScores]
  );

  const avgPct = scorePcts.length ? Math.round(scorePcts.reduce((a, b) => a + b, 0) / scorePcts.length) : null;
  const bestPct = scorePcts.length ? Math.max(...scorePcts) : null;
  const worstPct = scorePcts.length ? Math.min(...scorePcts) : null;

  /* ── Class percentile per exam ── */
  const classPercentile = useMemo(() => {
    const result: Record<string, number> = {};
    mySubmissions.forEach(mySub => {
      const examMax = examMaxScores[mySub.examId] ?? 12;
      const myPct = ((mySub.score ?? 0) / examMax) * 100;
      const allForExam = submissions
        .filter(s => s.examId === mySub.examId && s.score != null)
        .map(s => ((s.score ?? 0) / examMax) * 100);
      const below = allForExam.filter(p => p < myPct).length;
      result[mySub.id] = allForExam.length > 1 ? Math.round((below / (allForExam.length - 1)) * 100) : 100;
    });
    return result;
  }, [mySubmissions, submissions, examMaxScores]);

  /* ── Question-level accuracy per submission ── */
  function getQuestionResults(sub: typeof mySubmissions[0]) {
    const exam = exams.find(e => e.id === sub.examId);
    if (!exam) return [];
    return exam.questionIds.map(qId => {
      const q = questions.find(qq => qq.id === qId);
      if (!q) return null;
      if (q.type === 'mcq') {
        const answered = sub.mcqAnswers?.[qId];
        const isCorrect = answered != null && q.correctOption === answered;
        return { qId, title: q.title.slice(0, 60) + (q.title.length > 60 ? '…' : ''), type: 'mcq', isCorrect };
      } else {
        // Essay: approximate correctness by score/max
        const examMax = examMaxScores[sub.examId] ?? 12;
        const mcqQIds = exam.questionIds.filter(id => questions.find(qq => qq.id === id)?.type === 'mcq');
        const essayMaxPts = examMax - mcqQIds.length * 4;
        const essayScore = (sub.score ?? 0) - (sub.mcqAnswers ? Object.keys(sub.mcqAnswers).filter(id => {
          const qq = questions.find(q => q.id === id);
          return qq?.type === 'mcq' && qq.correctOption === sub.mcqAnswers![id];
        }).length * 4 : 0);
        return { qId, title: q.title.slice(0, 60) + (q.title.length > 60 ? '…' : ''), type: 'essay', essayScore: Math.max(0, essayScore), essayMax: essayMaxPts };
      }
    }).filter(Boolean) as { qId: string; title: string; type: string; isCorrect?: boolean; essayScore?: number; essayMax?: number }[];
  }

  /* ── Trend ── */
  const trend = scorePcts.length >= 2 ? scorePcts[scorePcts.length - 1] - scorePcts[0] : 0;

  function scoreColor(p: number) {
    if (p >= 80) return 'text-emerald-600';
    if (p >= 50) return 'text-amber-600';
    return 'text-rose-600';
  }

  function scoreBg(p: number) {
    if (p >= 80) return 'bg-emerald-50 border-emerald-200 text-emerald-700';
    if (p >= 50) return 'bg-amber-50 border-amber-200 text-amber-700';
    return 'bg-rose-50 border-rose-200 text-rose-700';
  }

  function percentileColor(p: number) {
    if (p >= 75) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (p >= 40) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  }

  const dir = isAr ? 'rtl' : 'ltr';

  return (
    <div dir={dir} className={`space-y-6 animate-fade-in`}>

      {/* ── Header ── */}
      <div className="flex items-center gap-4 border-b border-slate-200 pb-5">
        <button
          onClick={onBack}
          className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm text-slate-500 hover:text-indigo-600 flex-shrink-0"
          aria-label={t.back}
        >
          <ArrowLeft className={`h-5 w-5 ${isAr ? 'rotate-180' : ''}`} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-sm flex-shrink-0">
              {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                {student.name}
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  student.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {student.status === 'active' ? t.active : 'Pending'}
                </span>
              </h2>
              <div className="flex flex-wrap items-center gap-3 mt-1 text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />{student.email}</span>
                <span className="flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5" />{studentClass?.name ?? 'Unassigned'}</span>
                <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{t.lastSeen}: {relativeTime(student.lastSeen, isAr)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex border-b border-slate-100 mb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-6 py-3 text-xs font-bold transition-all border-b-2 ${
            activeTab === 'overview' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          {isAr ? 'نظرة عامة' : 'Overview'}
        </button>
        <button
          onClick={() => setActiveTab('exams')}
          className={`px-6 py-3 text-xs font-bold transition-all border-b-2 ${
            activeTab === 'exams' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          {isAr ? 'الامتحانات' : 'Exams'}
        </button>
      </div>

      {activeTab === 'overview' && (
        <>
          {/* ── Section 1: Performance KPI ── */}
          <section>
        <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 mb-4">
          <Target className="h-4 w-4 text-indigo-600" />
          {t.performance}
        </h3>
        {mySubmissions.length === 0 ? (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center text-sm text-slate-400 font-semibold">
            {t.noExams}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: t.examsTaken, value: mySubmissions.length.toString(), sub: `${isAr ? 'امتحانات' : 'exams'}`, accent: 'bg-indigo-100 text-indigo-600' },
              { label: t.avgScore, value: avgPct != null ? `${avgPct}%` : '—', sub: '', accent: `${avgPct != null && avgPct >= 80 ? 'bg-emerald-100 text-emerald-600' : avgPct != null && avgPct >= 50 ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'}` },
              { label: t.bestScore, value: bestPct != null ? `${bestPct}%` : '—', sub: '', accent: 'bg-emerald-100 text-emerald-600' },
              { label: t.worstScore, value: worstPct != null ? `${worstPct}%` : '—', sub: '', accent: 'bg-rose-100 text-rose-600' },
            ].map(card => (
              <div key={card.label} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-start gap-3">
                <div className={`p-2 rounded-xl flex-shrink-0 ${card.accent}`}>
                  <BarChart3 className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{card.label}</p>
                  <p className="text-xl font-black text-slate-900 mt-0.5">{card.value}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Section 2: Score Trend Sparkline ── */}
      {scorePcts.length >= 2 && (
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-indigo-600" />
              {t.scoreTrend}
            </h3>
            <div className="flex items-center gap-1.5">
              {trend > 2 ? (
                <><TrendingUp className="h-4 w-4 text-emerald-500" /><span className="text-xs font-bold text-emerald-600">+{Math.round(trend)}%</span></>
              ) : trend < -2 ? (
                <><TrendingDown className="h-4 w-4 text-rose-500" /><span className="text-xs font-bold text-rose-600">{Math.round(trend)}%</span></>
              ) : (
                <><Minus className="h-4 w-4 text-slate-400" /><span className="text-xs font-bold text-slate-500">{isAr ? 'مستقر' : 'Stable'}</span></>
              )}
            </div>
          </div>
          <div className="flex items-end gap-6">
            <div className="flex-1">
              {/* Main sparkline */}
              <div className="w-full" style={{ height: 64 }}>
                <svg viewBox="0 0 300 64" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="trend-fill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4361ee" stopOpacity="0.18" />
                      <stop offset="100%" stopColor="#4361ee" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Grid lines */}
                  {[25, 50, 75, 100].map(v => {
                    const y = 60 - (v / 100) * 56;
                    return (
                      <g key={v}>
                        <line x1="0" y1={y} x2="300" y2={y} stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth="1" />
                        <text x="302" y={y + 3} fontSize="8" fill="#94a3b8" fontWeight="bold">{v}%</text>
                      </g>
                    );
                  })}
                  {/* Area */}
                  {(() => {
                    const pts = scorePcts.map((v, i) => {
                      const x = 4 + (i / (scorePcts.length - 1)) * 292;
                      const y = 60 - (v / 100) * 56;
                      return `${x.toFixed(1)},${y.toFixed(1)}`;
                    });
                    const areaPath = `M ${pts[0]} ${pts.slice(1).map(p => `L ${p}`).join(' ')} L 296,60 L 4,60 Z`;
                    const linePath = `M ${pts[0]} ${pts.slice(1).map(p => `L ${p}`).join(' ')}`;
                    return (
                      <>
                        <path d={areaPath} fill="url(#trend-fill)" />
                        <path d={linePath} fill="none" stroke="#4361ee" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        {pts.map((pt, i) => {
                          const [x, y] = pt.split(',').map(Number);
                          return (
                            <g key={i}>
                              <circle cx={x} cy={y} r="5" fill="white" stroke="#4361ee" strokeWidth="2.5" />
                              <text x={x} y={y - 8} fontSize="9" fontWeight="bold" textAnchor="middle" fill="#4361ee">{scorePcts[i]}%</text>
                            </g>
                          );
                        })}
                      </>
                    );
                  })()}
                </svg>
              </div>
              {/* X-axis labels */}
              <div className="flex justify-between mt-1 px-1">
                {mySubmissions.map((sub, i) => {
                  const exam = exams.find(e => e.id === sub.examId);
                  return (
                    <span key={i} className="text-[9px] text-slate-400 font-semibold truncate max-w-[80px] text-center">
                      {exam?.title.split(' ').slice(0, 2).join(' ') ?? `Exam ${i + 1}`}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}
        </>
      )}

      {/* ── Section 3: Exam History ── */}
      {activeTab === 'exams' && (
        <div className="animate-fade-in space-y-4">
          {mySubmissions.length === 0 ? (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center text-sm text-slate-400 font-semibold">
              {t.noExams}
            </div>
          ) : (
            <section>
              <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 mb-4">
            <Award className="h-4 w-4 text-amber-500" />
            {t.examBreakdown}
          </h3>
          <div className="space-y-4">
            {mySubmissions.map((sub, idx) => {
              const exam = exams.find(e => e.id === sub.examId);
              const examMax = examMaxScores[sub.examId] ?? 12;
              const pctScore = scorePcts[idx];
              const percentile = classPercentile[sub.id];
              const qResults = getQuestionResults(sub);

              return (
                <div key={sub.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                  {/* Exam header */}
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-black text-slate-900">{exam?.title ?? 'Exam'}</h4>
                      <div className="flex items-center gap-3 mt-1 text-[10px] font-semibold text-slate-400 flex-wrap">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString() : '—'}</span>
                        <span className={`px-1.5 py-0.5 rounded-md border text-[9px] font-bold uppercase ${sub.status === 'graded' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
                          {sub.status === 'graded' ? t.graded : t.submitted}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setViewingSubmissionId(sub.id)} 
                        className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors border border-indigo-100 shadow-sm flex items-center justify-center gap-1.5"
                        aria-label={t.viewExam}
                        title={t.viewExam}
                      >
                         <Eye className="h-4 w-4" />
                         <span className="text-[10px] font-bold hidden sm:inline">{t.viewExam}</span>
                      </button>
                      {/* Score badge */}
                      <div className={`rounded-2xl border px-4 py-2 text-center ${scoreBg(pctScore)}`}>
                        <p className="text-[9px] font-bold uppercase tracking-widest opacity-70">{t.score}</p>
                        <p className="text-lg font-black">{sub.score}/{examMax}</p>
                        <p className="text-[10px] font-bold">{pctScore}%</p>
                      </div>
                      {/* Percentile badge */}
                      {percentile != null && (
                        <div className={`rounded-2xl border px-3 py-2 text-center ${percentileColor(percentile)}`}>
                          <p className="text-[9px] font-bold uppercase tracking-widest opacity-70">{t.rank}</p>
                          <p className="text-lg font-black">{percentile}th</p>
                          <p className="text-[10px] font-bold">{t.percentile}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Question-level accuracy */}
                  {qResults.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.questionLevel}</p>
                      <div className="space-y-1.5">
                        {qResults.map(qr => (
                          <div key={qr.qId} className="flex items-center gap-2.5">
                            {qr.type === 'mcq' ? (
                              qr.isCorrect ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                              ) : (
                                <XCircle className="h-4 w-4 text-rose-500 flex-shrink-0" />
                              )
                            ) : (
                              <div className="h-4 w-4 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                <span className="text-[7px] font-black text-indigo-600">E</span>
                              </div>
                            )}
                            <span className="text-[11px] font-semibold text-slate-600 flex-1 truncate">{qr.title}</span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border flex-shrink-0 ${
                              qr.type === 'mcq'
                                ? qr.isCorrect
                                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                  : 'bg-rose-50 border-rose-200 text-rose-700'
                                : 'bg-indigo-50 border-indigo-200 text-indigo-700'
                            }`}>
                              {qr.type === 'mcq' ? (qr.isCorrect ? t.correct : t.wrong) : `${t.essay}`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Feedback */}
                  {(sub.manualFeedback || (sub.aiFeedback && Object.keys(sub.aiFeedback).length > 0)) && (
                    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 text-xs font-semibold text-indigo-800 space-y-1">
                      {sub.manualFeedback && <p>💬 {sub.manualFeedback}</p>}
                      {sub.aiFeedback && Object.values(sub.aiFeedback).map((fb, i) => (
                        <p key={i} className="text-indigo-600">🤖 {fb}</p>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
            </section>
          )}
        </div>
      )}

      {activeTab === 'overview' && (
        <>
          {/* ── Section 4: Engagement / Progress ── */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 mb-5">
          <BarChart3 className="h-4 w-4 text-indigo-600" />
          {t.engagement}
        </h3>
        <div className="space-y-4">
          {/* Overall progress */}
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <span className="text-xs font-bold text-slate-600">{t.overallProgress}</span>
              <span className={`font-black text-sm ${scoreColor(student.progress)}`}>{student.progress}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 relative overflow-hidden">
              <div
                className="h-3 rounded-full transition-all duration-1000"
                style={{
                  width: `${student.progress}%`,
                  background: student.progress >= 80 ? 'linear-gradient(90deg, #10b981, #34d399)' : student.progress >= 50 ? 'linear-gradient(90deg, #f59e0b, #fcd34d)' : 'linear-gradient(90deg, #ef4444, #f87171)',
                }}
              />
            </div>
          </div>

          {/* Lesson Breakdown */}
          {studentClass?.lessonIds && studentClass.lessonIds.length > 0 && (
            <div className="mt-6 space-y-3 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-800 mb-3">{t.courseProgress}</h4>
              {studentClass.lessonIds.map(lessonId => {
                const lesson = useAppState().lessons.find(l => l.id === lessonId);
                if (!lesson) return null;
                const prog = student.lessonProgress?.[lessonId];
                
                return (
                  <div key={lessonId} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-700 truncate">{lesson.title}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-[10px] font-semibold text-slate-500">
                      <div className="flex items-center gap-1.5">
                        {prog?.videoWatched ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <PlayCircle className="h-4 w-4 text-slate-300" />}
                        <span className={prog?.videoWatched ? 'text-emerald-700' : ''}>{t.videoWatched || 'Video'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {prog?.contentRead ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <FileText className="h-4 w-4 text-slate-300" />}
                        <span className={prog?.contentRead ? 'text-emerald-700' : ''}>{t.contentRead || 'Content'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {prog?.homeworkScore !== undefined ? (
                          <div className="px-1.5 py-0.5 rounded-md bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold">
                            {prog.homeworkScore}/10
                          </div>
                        ) : (
                          <CheckSquare className="h-4 w-4 text-slate-300" />
                        )}
                        <span className={prog?.homeworkScore !== undefined ? 'text-indigo-700' : ''}>{t.homework || 'Homework'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          {/* Subscription type chip */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs font-semibold text-slate-500">{isAr ? 'نوع الاشتراك:' : 'Subscription:'}</span>
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
              student.subscriptionType === 'monthly' ? 'bg-sky-50 border-sky-200 text-sky-700' :
              student.subscriptionType === 'yearly' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' :
              'bg-slate-50 border-slate-200 text-slate-600'
            }`}>
              {student.subscriptionType === 'monthly' ? t.monthly : student.subscriptionType === 'yearly' ? t.yearly : t.free}
            </span>
          </div>
        </div>
      </section>

      {/* ── Section 5: Private Notes ── */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-indigo-600" />
          {t.notes}
        </h3>
        <textarea
          rows={4}
          placeholder={t.notesPlaceholder}
          className="w-full p-4 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 outline-none rounded-xl text-xs font-semibold resize-none transition-colors"
          dir={dir}
        />
      </section>
        </>
      )}
    </div>
  );
}
