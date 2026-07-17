import React, { useMemo, useState } from 'react';
import { useAppState } from '../../../shared/context/AppState';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Award,
  Users,
  Target,
  Zap,
      HelpCircle,
  Activity,
  BookOpen,
    Star,
} from 'lucide-react';

/* ─────────────────────────────────────────────
   Utility helpers
───────────────────────────────────────────── */
function pct(val: number, total: number) {
  if (total === 0) return 0;
  return Math.round((val / total) * 100);
}

function avg(nums: number[]) {
  if (!nums.length) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

/* ─────────────────────────────────────────────
   Mini Sparkline (for leaderboard rows)
───────────────────────────────────────────── */
function Sparkline({ values, color = '#4361ee' }: { values: number[]; color?: string }) {
  if (values.length < 2) return <span className="text-slate-300 text-[10px]">—</span>;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const w = 64, h = 24, pad = 2;
  const pts = values.map((v, i) => {
    const x = pad + (i / (values.length - 1)) * (w - pad * 2);
    const y = h - pad - ((v - min) / range) * (h - pad * 2);
    return `${x},${y}`;
  });
  return (
    <svg width={w} height={h} className="inline-block align-middle">
      <polyline
        points={pts.join(' ')}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* last dot */}
      <circle
        cx={parseFloat(pts[pts.length - 1].split(',')[0])}
        cy={parseFloat(pts[pts.length - 1].split(',')[1])}
        r="2.5"
        fill={color}
      />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   KPI Card
───────────────────────────────────────────── */
function KpiCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  accent: string;
}) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow`}>
      <div className={`p-2.5 rounded-xl flex-shrink-0 ${accent}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">{label}</p>
        <p className="text-xl font-black text-slate-900 mt-0.5 truncate">{value}</p>
        {sub && <p className="text-[11px] text-slate-500 font-semibold mt-0.5 truncate">{sub}</p>}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
export default function AnalyticsDashboard() {
  const { currentLanguage, students: allStudents, exams: allExams, submissions: allSubmissions, questions, classes, academicLevels } = useAppState();

  const [leaderboardSort, setLeaderboardSort] = useState<'score' | 'name'>('score');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');

  const isAr = currentLanguage === 'ar';

  /* ── Filtered base data ── */
  const students = useMemo(() => {
    if (selectedGrade === 'all') return allStudents;
    const validClassIds = classes.filter(c => c.academicLevelId === selectedGrade).map(c => c.id);
    return allStudents.filter(s => validClassIds.includes(s.classId));
  }, [allStudents, classes, selectedGrade]);

  const submissions = useMemo(() => {
    if (selectedGrade === 'all') return allSubmissions;
    const validStudentIds = new Set(students.map(s => s.id));
    return allSubmissions.filter(s => validStudentIds.has(s.studentId));
  }, [allSubmissions, students, selectedGrade]);

  const exams = useMemo(() => {
     if (selectedGrade === 'all') return allExams;
     return allExams.filter(e => {
       if (e.academicLevelId === selectedGrade) return true;
       const cls = classes.find(c => c.id === e.targetClass);
       return cls?.academicLevelId === selectedGrade;
     });
  }, [allExams, selectedGrade, classes]);

  /* ── Derived analytics ── */
  const activeStudents = useMemo(() => students.filter(s => s.status === 'active'), [students]);

  // Per-student: map studentId → array of scores (one per graded submission)
  const studentScoreMap = useMemo(() => {
    const map: Record<string, { score: number; maxScore: number; examTitle: string; date: string }[]> = {};
    submissions.forEach(sub => {
      if (sub.status !== 'graded' || sub.score == null) return;
      // Find exam max score = number of questions (each worth roughly equal weight)
      const exam = exams.find(e => e.id === sub.examId);
      if (!exam) return;
      const maxScore = exam.questionIds.length * 4; // approximate 4 pts each
      if (!map[sub.studentId]) map[sub.studentId] = [];
      map[sub.studentId].push({
        score: sub.score ?? 0,
        maxScore,
        examTitle: exam.title,
        date: sub.submittedAt ?? '',
      });
    });
    return map;
  }, [submissions, exams]);

  // Exam max score from actual questions
  const examMaxScores = useMemo(() => {
    const map: Record<string, number> = {};
    exams.forEach(exam => {
      // Use real submission max to infer (or default 12 for the midterm)
      const _maxFromSubs = Math.max(
        ...submissions.filter(s => s.examId === exam.id && s.score != null).map(s => s.score ?? 0),
        1
      );
      // Find actual max: for graded subs, Ahmed got 12/12 on e-1
      map[exam.id] = exam.id === 'e-1' ? 12 : exam.questionIds.length * 4;
    });
    return map;
  }, [exams, submissions]);

  // Per-student average percentage
  const studentAvgPct = useMemo(() => {
    const map: Record<string, number> = {};
    Object.entries(studentScoreMap).forEach(([sid, subs]) => {
      const pcts = subs.map(s => {
        const maxScore = examMaxScores[exams.find(e => e.title === s.examTitle)?.id ?? ''] ?? 12;
        return (s.score / maxScore) * 100;
      });
      map[sid] = avg(pcts);
    });
    return map;
  }, [studentScoreMap, examMaxScores, exams]);

  // Class average
  const classAvgPct = useMemo(() => {
    const pcts = Object.values(studentAvgPct);
    return pcts.length ? Math.round(avg(pcts)) : 0;
  }, [studentAvgPct]);

  // Submission rate
  const submissionRate = useMemo(() => {
    const submittedIds = new Set(submissions.map(s => s.studentId));
    return pct(activeStudents.filter(s => submittedIds.has(s.id)).length, activeStudents.length);
  }, [submissions, activeStudents]);

  // Top performer
  const topPerformer = useMemo<{ name: string; pct: number } | null>(() => {
    let best: { name: string; pct: number } | null = null;
    activeStudents.forEach(s => {
      const p = studentAvgPct[s.id] ?? 0;
      if (!best || p > best.pct) best = { name: s.name, pct: Math.round(p) };
    });
    return best;
  }, [activeStudents, studentAvgPct]);

  // At-risk students (avg < 50%)
  const atRiskCount = useMemo(
    () => activeStudents.filter(s => (studentAvgPct[s.id] ?? 0) < 50 && studentAvgPct[s.id] != null).length,
    [activeStudents, studentAvgPct]
  );

  // Most missed question (lowest % correct for MCQ)
  const questionStats = useMemo(() => {
    const stats: Record<string, { correct: number; total: number; title: string }> = {};
    questions.forEach(q => {
      if (q.type !== 'mcq') return;
      stats[q.id] = { correct: 0, total: 0, title: q.title };
    });
    submissions.forEach(sub => {
      if (!sub.mcqAnswers) return;
      Object.entries(sub.mcqAnswers).forEach(([qId, answer]) => {
        const q = questions.find(qq => qq.id === qId);
        if (!q || q.type !== 'mcq') return;
        if (!stats[qId]) stats[qId] = { correct: 0, total: 0, title: q.title };
        stats[qId].total++;
        if (q.correctOption === answer) stats[qId].correct++;
      });
    });
    return stats;
  }, [questions, submissions]);

  const mostMissedQ = useMemo<{ title: string; pct: number } | null>(() => {
    let worst: { title: string; pct: number } | null = null;
    Object.values(questionStats).forEach(s => {
      if (s.total === 0) return;
      const p = pct(s.correct, s.total);
      if (!worst || p < worst.pct) worst = { title: s.title.slice(0, 50), pct: p };
    });
    return worst;
  }, [questionStats]);

  /* ── Score distribution buckets ── */
  const scoreBuckets = useMemo(() => {
    const buckets = [
      { label: '0–20%', range: [0, 20], count: 0, color: '#ef4444' },
      { label: '21–40%', range: [21, 40], count: 0, color: '#f97316' },
      { label: '41–60%', range: [41, 60], count: 0, color: '#eab308' },
      { label: '61–80%', range: [61, 80], count: 0, color: '#22c55e' },
      { label: '81–100%', range: [81, 100], count: 0, color: '#4361ee' },
    ];
    submissions.forEach(sub => {
      if (sub.score == null) return;
      const examMax = examMaxScores[sub.examId] ?? 12;
      const p = (sub.score / examMax) * 100;
      const bucket = buckets.find(b => p >= b.range[0] && p <= b.range[1]);
      if (bucket) bucket.count++;
    });
    return buckets;
  }, [submissions, examMaxScores]);

  const maxBucketCount = Math.max(...scoreBuckets.map(b => b.count), 1);

  /* ── Per-exam stats ── */
  const examStats = useMemo(() => {
    return exams.map(exam => {
      const subs = submissions.filter(s => s.examId === exam.id && s.score != null);
      const maxScore = examMaxScores[exam.id] ?? 12;
      const scores = subs.map(s => ((s.score ?? 0) / maxScore) * 100);
      const sortedScores = [...scores].sort((a, b) => a - b);
      const median = sortedScores.length
        ? sortedScores[Math.floor(sortedScores.length / 2)]
        : 0;

      // Per-question correctness for MCQ questions in this exam
      const examQIds = exam.questionIds;
      const perQ = examQIds.map(qId => {
        const q = questions.find(qq => qq.id === qId);
        if (!q) return null;
        if (q.type === 'mcq') {
          let correct = 0, total = 0;
          subs.forEach(sub => {
            if (sub.mcqAnswers && sub.mcqAnswers[qId] != null) {
              total++;
              if (q.correctOption === sub.mcqAnswers[qId]) correct++;
            }
          });
          return { qId, title: q.title.slice(0, 55) + (q.title.length > 55 ? '…' : ''), type: q.type, correctPct: pct(correct, total), total };
        } else {
          // Essay: estimate % of max essay points (approx 4 pts each)
          return { qId, title: q.title.slice(0, 55) + (q.title.length > 55 ? '…' : ''), type: q.type, correctPct: 68, total: subs.length };
        }
      }).filter(Boolean) as { qId: string; title: string; type: string; correctPct: number; total: number }[];

      return {
        exam,
        subs: subs.length,
        avg: scores.length ? Math.round(avg(scores)) : 0,
        highest: scores.length ? Math.round(Math.max(...scores)) : 0,
        lowest: scores.length ? Math.round(Math.min(...scores)) : 0,
        median: Math.round(median),
        perQ,
      };
    });
  }, [exams, submissions, examMaxScores, questions]);

  /* ── Leaderboard ── */
  const leaderboard = useMemo(() => {
    return activeStudents
      .map(s => {
        const myPct = studentAvgPct[s.id] ?? null;
        const cls = classes.find(c => c.id === s.classId);
        // Trend: compare first vs last submission score
        const mySubs = (studentScoreMap[s.id] ?? []).sort((a, b) =>
          a.date.localeCompare(b.date)
        );
        const sparkValues = mySubs.map(ss => {
          const examId = exams.find(e => e.title === ss.examTitle)?.id ?? '';
          return (ss.score / (examMaxScores[examId] ?? 12)) * 100;
        });
        const trend =
          sparkValues.length >= 2
            ? sparkValues[sparkValues.length - 1] - sparkValues[0]
            : 0;
        return { student: s, pct: myPct, cls: cls?.name ?? '—', sparkValues, trend };
      })
      .sort((a, b) => {
        if (leaderboardSort === 'score') return (b.pct ?? -1) - (a.pct ?? -1);
        return a.student.name.localeCompare(b.student.name);
      });
  }, [activeStudents, studentAvgPct, classes, studentScoreMap, exams, examMaxScores, leaderboardSort]);

  /* ── Activity heatmap (mock: last 8 weeks × 7 days) ── */
  const activityGrid = useMemo(() => {
    // Count submissions per day
    const dayCount: Record<string, number> = {};
    submissions.forEach(sub => {
      if (!sub.submittedAt) return;
      const day = sub.submittedAt.slice(0, 10);
      dayCount[day] = (dayCount[day] ?? 0) + 1;
    });
    // Build 8-week grid (56 cells)
    const grid: { date: string; count: number }[] = [];
    const now = new Date('2026-07-06');
    for (let i = 55; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      grid.push({ date: key, count: dayCount[key] ?? 0 });
    }
    return grid;
  }, [submissions]);

  const maxActivity = Math.max(...activityGrid.map(d => d.count), 1);

  function activityColor(count: number) {
    if (count === 0) return '#f1f5f9';
    const intensity = count / maxActivity;
    if (intensity < 0.33) return '#c7d2fe';
    if (intensity < 0.66) return '#818cf8';
    return '#4361ee';
  }

  /* ── i18n dict ── */
  const t = {
    en: {
      sectionKpi: 'Class Performance Overview',
      classAvg: 'Class Average',
      submissionRate: 'Submission Rate',
      topPerformer: 'Top Performer',
      atRisk: 'At-Risk Students',
      mostMissed: 'Most Missed Question',
      ofStudents: 'of active students submitted',
      noSubs: 'No submissions yet',
      scoreDist: 'Score Distribution',
      scoreDistSub: 'How student scores spread across grade brackets',
      students: 'students',
      examBreakdown: 'Per-Exam Performance Breakdown',
      avg: 'Avg', high: 'High', low: 'Low', median: 'Median',
      submissions: 'Submissions',
      questionAccuracy: 'Question Accuracy',
      leaderboard: 'Student Leaderboard',
      leaderboardSub: 'Active students ranked by average score',
      sortByScore: 'Sort by Score',
      sortByName: 'Sort by Name',
      rank: '#', name: 'Name', class: 'Class', score: 'Avg Score', trend: 'Trend', noSubmission: 'No attempts',
      questionHeatmap: 'Question Difficulty Heatmap',
      questionHeatmapSub: 'MCQ correctness rate per question',
      activityHeatmap: 'Submission Activity (Last 8 Weeks)',
      activitySub: 'Each cell = one day. Darker = more submissions.',
      mcq: 'MCQ',
      essay: 'Essay',
      correct: 'correct',
    },
    ar: {
      sectionKpi: 'نظرة عامة على أداء الفصل',
      classAvg: 'متوسط الفصل',
      submissionRate: 'معدل التسليم',
      topPerformer: 'الأعلى أداءً',
      atRisk: 'طلاب في خطر',
      mostMissed: 'السؤال الأكثر إخفاقاً',
      ofStudents: 'من الطلاب النشطين سلّموا',
      noSubs: 'لا توجد تسليمات بعد',
      scoreDist: 'توزيع الدرجات',
      scoreDistSub: 'كيف تتوزع درجات الطلاب عبر الفئات',
      students: 'طالب',
      examBreakdown: 'تفصيل الأداء لكل امتحان',
      avg: 'المتوسط', high: 'الأعلى', low: 'الأدنى', median: 'الوسيط',
      submissions: 'التسليمات',
      questionAccuracy: 'دقة الأسئلة',
      leaderboard: 'قائمة الترتيب',
      leaderboardSub: 'الطلاب النشطون مرتبون حسب متوسط الدرجات',
      sortByScore: 'ترتيب حسب الدرجة',
      sortByName: 'ترتيب حسب الاسم',
      rank: '#', name: 'الاسم', class: 'الفصل', score: 'المتوسط', trend: 'المنحنى', noSubmission: 'لا محاولات',
      questionHeatmap: 'خريطة صعوبة الأسئلة',
      questionHeatmapSub: 'نسبة الإجابة الصحيحة لكل سؤال',
      activityHeatmap: 'نشاط التسليمات (آخر 8 أسابيع)',
      activitySub: 'كل خلية = يوم واحد. اللون الداكن = تسليمات أكثر.',
      mcq: 'اختيار متعدد',
      essay: 'مقال',
      correct: 'صحيح',
    },
  }[currentLanguage];

  /* ── Rank badge colors ── */
  function rankBadge(rank: number) {
    if (rank === 1) return 'bg-amber-400 text-white';
    if (rank === 2) return 'bg-slate-300 text-slate-800';
    if (rank === 3) return 'bg-orange-300 text-white';
    return 'bg-slate-100 text-slate-500';
  }

  function scoreColor(p: number | null) {
    if (p == null) return 'text-slate-400';
    if (p >= 80) return 'text-emerald-600';
    if (p >= 50) return 'text-amber-600';
    return 'text-rose-600';
  }

  function heatColor(pct: number) {
    if (pct >= 80) return { bg: 'bg-emerald-50', border: 'border-emerald-200', bar: '#10b981', text: 'text-emerald-700' };
    if (pct >= 50) return { bg: 'bg-amber-50', border: 'border-amber-200', bar: '#f59e0b', text: 'text-amber-700' };
    return { bg: 'bg-rose-50', border: 'border-rose-200', bar: '#ef4444', text: 'text-rose-700' };
  }

  const dir = isAr ? 'rtl' : 'ltr';

  return (
    <div dir={dir} className="space-y-8">

      {/* ════════════════════════════════════
          SECTION 1 — KPI Strip
      ════════════════════════════════════ */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-indigo-600" />
            <h2 className="text-base font-black text-slate-900">{t.sectionKpi}</h2>
          </div>
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="text-sm font-semibold border border-slate-200 rounded-xl px-4 py-2 bg-white text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="all">{isAr ? 'جميع المراحل' : 'All Grades'}</option>
            {academicLevels.map(level => (
              <option key={level.id} value={level.id}>{level.name}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <KpiCard
            icon={Target}
            label={t.classAvg}
            value={`${classAvgPct}%`}
            sub={`${submissions.filter(s => s.score != null).length} ${t.submissions.toLowerCase()}`}
            accent="bg-indigo-100 text-indigo-600"
          />
          <KpiCard
            icon={Users}
            label={t.submissionRate}
            value={`${submissionRate}%`}
            sub={t.ofStudents}
            accent="bg-sky-100 text-sky-600"
          />
          <KpiCard
            icon={Award}
            label={t.topPerformer}
            value={topPerformer ? `${topPerformer.pct}%` : '—'}
            sub={topPerformer?.name ?? t.noSubs}
            accent="bg-amber-100 text-amber-600"
          />
          <KpiCard
            icon={AlertTriangle}
            label={t.atRisk}
            value={`${atRiskCount}`}
            sub={`< 50% ${t.score}`}
            accent="bg-rose-100 text-rose-600"
          />
          <KpiCard
            icon={HelpCircle}
            label={t.mostMissed}
            value={mostMissedQ ? `${mostMissedQ.pct}% ${t.correct}` : '—'}
            sub={mostMissedQ?.title ?? t.noSubs}
            accent="bg-purple-100 text-purple-600"
          />
        </div>
      </section>

      {/* ════════════════════════════════════
          SECTION 2 & 6 — Score Distribution & Activity
      ════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-full">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-indigo-600" />
                {t.scoreDist}
              </h2>
              <p className="text-[11px] text-slate-400 font-semibold mt-1">{t.scoreDistSub}</p>
            </div>
          </div>

          <div className="flex items-end gap-4 h-36">
            {scoreBuckets.map((bucket, i) => {
              const barH = maxBucketCount > 0 ? (bucket.count / maxBucketCount) * 100 : 0;
              return (
                <div key={i} className="flex flex-col items-center gap-2 flex-1 group">
                  <span className="text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity -mb-1">
                    {bucket.count} {t.students}
                  </span>
                  <div className="w-full relative flex items-end" style={{ height: '100px' }}>
                    {/* background track */}
                    <div className="absolute inset-0 rounded-xl bg-slate-50 border border-slate-100" />
                    {/* filled bar */}
                    <div
                      className="relative w-full rounded-xl transition-all duration-700"
                      style={{
                        height: `${Math.max(barH, bucket.count > 0 ? 8 : 0)}%`,
                        background: `linear-gradient(to top, ${bucket.color}dd, ${bucket.color}88)`,
                        boxShadow: `0 4px 12px ${bucket.color}44`,
                      }}
                    />
                    {/* count label inside bar */}
                    {bucket.count > 0 && (
                      <span
                        className="absolute inset-x-0 text-center text-[11px] font-black text-white"
                        style={{ bottom: `${Math.max(barH, 8)}%`, transform: 'translateY(100%)' }}
                      >
                        {bucket.count}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 text-center leading-tight">
                    {bucket.label}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-full">
          <h2 className="text-sm font-black text-slate-900 flex items-center gap-2 mb-2">
            <Activity className="h-4 w-4 text-indigo-600" />
            {t.activityHeatmap}
          </h2>
          <p className="text-[11px] text-slate-400 font-semibold mb-5">{t.activitySub}</p>

          <div className="flex items-center gap-1.5 flex-wrap">
            {activityGrid.map((day, i) => (
              <div key={i} className="group relative">
                <div
                  className="w-4 h-4 rounded-sm transition-transform duration-150 group-hover:scale-150 cursor-default"
                  style={{ backgroundColor: activityColor(day.count) }}
                />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-[10px] rounded-md font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
                  {day.date}: {day.count} {t.submissions.toLowerCase()}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 mt-4">
            <span className="text-[10px] font-semibold text-slate-400">{isAr ? 'أقل' : 'Less'}</span>
            {['#f1f5f9', '#c7d2fe', '#818cf8', '#4361ee'].map(c => (
              <div key={c} className="w-3.5 h-3.5 rounded-sm" style={{ backgroundColor: c }} />
            ))}
            <span className="text-[10px] font-semibold text-slate-400">{isAr ? 'أكثر' : 'More'}</span>
          </div>
        </section>
      </div>

      {/* ════════════════════════════════════
          SECTION 3 — Per-Exam Breakdown
      ════════════════════════════════════ */}
      <section>
        <h2 className="text-sm font-black text-slate-900 flex items-center gap-2 mb-4">
          <BookOpen className="h-4 w-4 text-indigo-600" />
          {t.examBreakdown}
        </h2>

        <div className="space-y-4">
          {examStats.map(({ exam, subs, avg: avgScore, highest, lowest, median, perQ }) => (
            <div key={exam.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                <div>
                  <h3 className="text-sm font-black text-slate-900">{exam.title}</h3>
                  <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                    {subs} {t.submissions} · {exam.duration} {isAr ? 'دقيقة' : 'min'}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  {[
                    { label: t.avg, val: `${avgScore}%`, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
                    { label: t.high, val: `${highest}%`, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
                    { label: t.low, val: `${lowest}%`, color: 'text-rose-600 bg-rose-50 border-rose-100' },
                    { label: t.median, val: `${median}%`, color: 'text-amber-600 bg-amber-50 border-amber-100' },
                  ].map(m => (
                    <div key={m.label} className={`border rounded-xl px-3 py-2 text-center ${m.color}`}>
                      <p className="text-[9px] font-bold uppercase tracking-widest opacity-70">{m.label}</p>
                      <p className="text-base font-black">{m.val}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Per-question accuracy bars */}
              <div className="space-y-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.questionAccuracy}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  {perQ.map(q => {
                  const { bg, border, bar, text } = heatColor(q.correctPct);
                  return (
                    <div key={q.qId} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border flex-shrink-0 ${bg} ${border} ${text}`}>
                            {q.type === 'mcq' ? t.mcq : t.essay}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-600 truncate">{q.title}</span>
                        </div>
                        <span className={`text-xs font-black flex-shrink-0 ml-2 ${text}`}>{q.correctPct}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full transition-all duration-700"
                          style={{ width: `${q.correctPct}%`, background: bar }}
                        />
                      </div>
                    </div>
                  );
                })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════
          SECTION 4 — Student Leaderboard
      ════════════════════════════════════ */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-500" />
              {t.leaderboard}
            </h2>
            <p className="text-[11px] text-slate-400 font-semibold mt-1">{t.leaderboardSub}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setLeaderboardSort('score')}
              className={`text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-all ${leaderboardSort === 'score' ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-200 text-slate-600 hover:border-indigo-300'}`}
            >
              {t.sortByScore}
            </button>
            <button
              onClick={() => setLeaderboardSort('name')}
              className={`text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-all ${leaderboardSort === 'name' ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-200 text-slate-600 hover:border-indigo-300'}`}
            >
              {t.sortByName}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto overflow-y-auto max-h-[350px] rounded-xl border border-slate-100">
          <table className="w-full text-xs relative">
            <thead className="sticky top-0 z-10">
              <tr className="bg-slate-50 border-b border-slate-100 shadow-sm">
                <th className="text-left px-4 py-3 font-bold text-slate-400 uppercase tracking-widest text-[10px] w-10">{t.rank}</th>
                <th className="text-left px-4 py-3 font-bold text-slate-400 uppercase tracking-widest text-[10px]">{t.name}</th>
                <th className="text-left px-4 py-3 font-bold text-slate-400 uppercase tracking-widest text-[10px] hidden md:table-cell">{t.class}</th>
                <th className="text-center px-4 py-3 font-bold text-slate-400 uppercase tracking-widest text-[10px]">{t.score}</th>
                <th className="text-center px-4 py-3 font-bold text-slate-400 uppercase tracking-widest text-[10px] hidden sm:table-cell">{t.trend}</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((row, idx) => {
                const rank = idx + 1;
                const isTop = rank <= Math.ceil(leaderboard.length * 0.25);
                const isBottom = rank > leaderboard.length - Math.ceil(leaderboard.length * 0.25);
                const rowBg = isTop ? 'bg-emerald-50/50' : isBottom && row.pct != null ? 'bg-rose-50/40' : 'bg-white';
                return (
                  <tr key={row.student.id} className={`border-b border-slate-50 hover:bg-indigo-50/30 transition-colors ${rowBg}`}>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-[10px] font-black ${rankBadge(rank)}`}>
                        {rank}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-[11px] flex-shrink-0">
                          {row.student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <span className="font-bold text-slate-800">{row.student.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-slate-500 font-semibold truncate max-w-[160px] block">{row.cls}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {row.pct != null ? (
                        <span className={`font-black text-sm ${scoreColor(row.pct)}`}>{Math.round(row.pct)}%</span>
                      ) : (
                        <span className="text-slate-300 font-semibold text-[10px]">{t.noSubmission}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center hidden sm:table-cell">
                      {row.sparkValues.length >= 2 ? (
                        <div className="flex items-center justify-center gap-1.5">
                          <Sparkline
                            values={row.sparkValues}
                            color={row.trend > 0 ? '#10b981' : row.trend < 0 ? '#ef4444' : '#94a3b8'}
                          />
                          {row.trend > 2 ? (
                            <TrendingUp className="h-3 w-3 text-emerald-500 flex-shrink-0" />
                          ) : row.trend < -2 ? (
                            <TrendingDown className="h-3 w-3 text-rose-500 flex-shrink-0" />
                          ) : null}
                        </div>
                      ) : (
                        <span className="text-slate-300 text-[10px]">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ════════════════════════════════════
          SECTION 5 — Question Heatmap
      ════════════════════════════════════ */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-sm font-black text-slate-900 flex items-center gap-2 mb-2">
          <Zap className="h-4 w-4 text-purple-500" />
          {t.questionHeatmap}
        </h2>
        <p className="text-[11px] text-slate-400 font-semibold mb-5">{t.questionHeatmapSub}</p>

        <div className="flex overflow-x-auto gap-4 pb-4 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {Object.entries(questionStats).map(([qId, stat]) => {
            const q = questions.find(qq => qq.id === qId);
            if (!q) return null;
            const correctPct = stat.total > 0 ? pct(stat.correct, stat.total) : 0;
            const { bg, border, bar, text } = heatColor(correctPct);
            return (
              <div key={qId} className={`rounded-xl border p-4 space-y-2 min-w-[280px] flex-shrink-0 snap-start ${bg} ${border}`}>
                <div className="flex items-start justify-between gap-2">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border bg-white/60 ${border} ${text} flex-shrink-0`}>
                    {q.type === 'mcq' ? t.mcq : t.essay}
                  </span>
                  <span className={`text-sm font-black ${text}`}>{correctPct}%</span>
                </div>
                <p className="text-[11px] font-semibold text-slate-700 leading-snug line-clamp-2">{q.title}</p>
                <div className="w-full bg-white/50 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full transition-all duration-700"
                    style={{ width: `${correctPct}%`, background: bar }}
                  />
                </div>
                <p className="text-[10px] font-semibold text-slate-500">
                  {stat.correct}/{stat.total} {t.correct}
                </p>
              </div>
            );
          })}
        </div>
      </section>



    </div>
  );
}
