import React from 'react';
import { useAppState } from '../../../shared/context/AppState';
import { BarChart3, PieChart, AlertCircle, Play, CheckCircle, TrendingUp } from 'lucide-react';

export default function AnalyticsDashboard() {
  const { currentLanguage } = useAppState();

  const dict = {
    en: {
      performance: "Quiz Averages Distribution",
      difficulty: "Question Difficulty Stats",
      completion: "Lecture Completion Rates",
      hardest: "Hardest Question (Lowest Pass)",
      easiest: "Easiest Question (Highest Pass)",
      watchTime: "Avg Student Watch-Time",
      noData: "Data synchronized successfully"
    },
    ar: {
      performance: "توزيع متوسط درجات الاختبارات",
      difficulty: "إحصائيات مستوى صعوبة الأسئلة",
      completion: "نسب اكتمال مشاهدة الدروس",
      hardest: "الأسئلة الأكثر صعوبة (الأقل إجابة)",
      easiest: "الأسئلة الأكثر سهولة (الأعلى إجابة)",
      watchTime: "متوسط وقت المشاهدة الفعلي",
      noData: "تم تحديث البيانات والتحليلات بنجاح"
    }
  };

  const t = dict[currentLanguage];

  // SVG Mock Bar Chart Coordinates
  const barData = [
    { label: currentLanguage === 'en' ? "Benzene" : "بنزين", score: 85, x: 50 },
    { label: currentLanguage === 'en' ? "Circuits" : "دوائر كهربائية", score: 62, x: 150 },
    { label: currentLanguage === 'en' ? "Ohm Law" : "قانون أوم", score: 78, x: 250 },
    { label: currentLanguage === 'en' ? "Grammar" : "النحو", score: 92, x: 350 }
  ];

  return (
    <div className="space-y-6 text-left">
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* SVG Score bar chart */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
            <BarChart3 className="h-4 w-4 text-indigo-600" />
            <span>{t.performance}</span>
          </h3>

          <div className="w-full bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center justify-center">
            {/* Custom SVG Bar Chart */}
            <svg viewBox="0 0 450 180" className="w-full max-h-[180px]">
              {/* Grid lines */}
              <line x1="30" y1="20" x2="420" y2="20" stroke="#e2e8f0" strokeDasharray="3" />
              <line x1="30" y1="70" x2="420" y2="70" stroke="#e2e8f0" strokeDasharray="3" />
              <line x1="30" y1="120" x2="420" y2="120" stroke="#e2e8f0" strokeDasharray="3" />

              {barData.map((bar, idx) => {
                const height = (bar.score / 100) * 120;
                const y = 140 - height;
                return (
                  <g key={idx}>
                    {/* Bar Background shadow */}
                    <rect x={bar.x} y="20" width="35" height="120" rx="4" fill="#f1f5f9" />
                    {/* Active Bar */}
                    <rect x={bar.x} y={y} width="35" height={height} rx="4" fill="#4361ee" />
                    
                    {/* Score Label inside bar */}
                    <text x={bar.x + 17.5} y={y - 8} fontSize="9" fontWeight="bold" textAnchor="middle" fill="#1e293b" className="font-mono">
                      {bar.score}%
                    </text>

                    {/* Subject label under X axis */}
                    <text x={bar.x + 17.5} y="158" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#64748b">
                      {bar.label}
                    </text>
                  </g>
                );
              })}
              <line x1="30" y1="140" x2="420" y2="140" stroke="#94a3b8" strokeWidth="1.5" />
            </svg>
          </div>
        </div>

        {/* Completion analytics lists */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
            <PieChart className="h-4 w-4 text-indigo-600" />
            <span>{t.completion}</span>
          </h3>

          <div className="space-y-4 text-xs font-semibold text-slate-600">
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span>{currentLanguage === 'en' ? "Lecture 1: Organic Basics" : "المحاضرة ١: أساسيات العضوية"}</span>
                <span className="text-slate-800">{currentLanguage === 'en' ? "88% completion" : "نسبة اكتمال 88%"}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5">
                <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: '88%' }} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span>{currentLanguage === 'en' ? "Lecture 2: Resistor Currents" : "المحاضرة ٢: تيارات المقاومة"}</span>
                <span className="text-slate-800">{currentLanguage === 'en' ? "65% completion" : "نسبة اكتمال 65%"}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5">
                <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: '65%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Difficulty statistics details */}
      <div className="grid sm:grid-cols-2 gap-6 text-xs font-semibold text-slate-700">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3 flex items-start gap-4">
          <div className="bg-rose-50 text-rose-600 p-2.5 rounded-xl flex-shrink-0">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{t.hardest}</span>
            <h4 className="font-bold text-slate-900 leading-normal">
              {currentLanguage === 'en' ? "Resistor circuits parallel value calculations (Q-2)" : "حساب قيم مقاومات التوازي (س-٢)"}
            </h4>
            <p className="text-slate-500 text-[11px] font-medium leading-relaxed mt-1">
              {currentLanguage === 'en' 
                ? "Only 31% of students selected the correct options on their first attempt."
                : "31% فقط من الطلاب اختاروا الإجابة الصحيحة من المحاولة الأولى."
              }
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3 flex items-start gap-4">
          <div className="bg-emerald-50 text-emerald-600 p-2.5 rounded-xl flex-shrink-0">
            <CheckCircle className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{t.easiest}</span>
            <h4 className="font-bold text-slate-900 leading-normal">
              {currentLanguage === 'en' ? "Arabic Grammar name classification (Q-4)" : "إعراب الأسماء في النحو العربي (س-٤)"}
            </h4>
            <p className="text-slate-500 text-[11px] font-medium leading-relaxed mt-1">
              {currentLanguage === 'en'
                ? "94% of student submissions correctly parsed the syntax statement."
                : "94% من إجابات الطلاب أعربت الجملة النحوية بشكل صحيح."
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
