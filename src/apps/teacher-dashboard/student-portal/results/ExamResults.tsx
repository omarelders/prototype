import React, { useState } from 'react';
import { useAppState } from '../../../../shared/context/AppState';
import { ExamSubmission } from '../../../../shared/types';
import MathRenderer from '../../../../shared/components/MathRenderer';
import { 
  Award, 
  ChevronRight, 
  CheckCircle2, 
  XCircle,  
  X, 
  Users, 
  TrendingUp,
  FileText,
  BarChart3,
  Calendar,
  Clock
} from 'lucide-react';

interface ExamResultsProps {
  submission?: ExamSubmission;
  onNavigate: (tab: string) => void;
}

export default function ExamResults({ submission, onNavigate }: ExamResultsProps) {
  const { currentLanguage, questions, submissions } = useAppState();
  const [activeSub, setActiveSub] = useState<ExamSubmission | null>(submission || submissions[0] || null);


  const t = {
    title: currentLanguage === 'en' ? 'Exam Results & Review' : 'نتائج الاختبار',
    score: currentLanguage === 'en' ? 'Score' : 'الدرجة',
    percentage: currentLanguage === 'en' ? 'Percentage' : 'النسبة',
    status: currentLanguage === 'en' ? 'Status' : 'الحالة',
    graded: currentLanguage === 'en' ? 'Graded' : 'تم التصحيح',
    pending: currentLanguage === 'en' ? 'Pending Review' : 'بانتظار التصحيح',
    classAvg: currentLanguage === 'en' ? 'Class Average' : 'متوسط الصف',
    percentile: currentLanguage === 'en' ? 'Your Rank' : 'ترتيبك',
    reviewTitle: currentLanguage === 'en' ? 'Question Review' : 'مراجعة الأسئلة',
    correctAns: currentLanguage === 'en' ? 'Correct Answer' : 'الإجابة الصحيحة',
    yourAns: currentLanguage === 'en' ? 'Your Answer' : 'إجابتك',
    archiveHeader: currentLanguage === 'en' ? 'Exam Archive' : 'أرشيف الاختبارات',
    noSubmission: currentLanguage === 'en' ? 'No submissions yet' : 'لا توجد إجابات مقدمة',
  };


  return (
    <div className="space-y-8">
      {activeSub ? (
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            {/* Score Cards */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="grid sm:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-indigo-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Award className="h-8 w-8 text-indigo-600" />
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">{t.score}</span>
                  <p className="text-3xl font-extrabold text-slate-900">{activeSub.score ? `${activeSub.score}/12` : '--'}</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-emerald-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <BarChart3 className="h-8 w-8 text-emerald-600" />
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">{t.percentage}</span>
                  <p className="text-3xl font-extrabold text-slate-900">{activeSub.score ? `${Math.round((activeSub.score/12)*100)}%` : '--'}</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-amber-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Clock className="h-8 w-8 text-amber-600" />
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">{t.status}</span>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-2 ${
                    activeSub.status === 'graded' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {activeSub.status === 'graded' ? t.graded : t.pending}
                  </span>
                </div>
              </div>
            </div>

            {/* Performance Comparison */}
            {activeSub.status === 'graded' && (
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-10">
                  <TrendingUp className="h-32 w-32" />
                </div>
                
                <div className="relative z-10 grid sm:grid-cols-2 gap-6">
                  <div className="border-s-4 border-emerald-400 ps-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-5 w-5 text-emerald-200" />
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">{t.classAvg}</span>
                    </div>
                    <p className="text-3xl font-extrabold">68%</p>
                    <p className="text-xs text-indigo-200 mt-1">
                      {currentLanguage === 'en' 
                        ? `You scored ${Math.round((activeSub.score!/12)*100) - 68}% higher than average`
                        : `حصلت على ${Math.round((activeSub.score!/12)*100) - 68}% أعلى من المتوسط`
                      }
                    </p>
                  </div>

                  <div className="border-s-4 border-amber-400 ps-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="h-5 w-5 text-amber-200" />
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-200">{t.percentile}</span>
                    </div>
                    <p className="text-3xl font-extrabold">Top 15%</p>
                    <p className="text-xs text-indigo-200 mt-1">
                      {currentLanguage === 'en' ? 'Excellent performance!' : 'أداء ممتاز!'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Question Review */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h3 className="font-extrabold text-slate-900 text-lg mb-5 flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-600" />
                <span>{t.reviewTitle}</span>
              </h3>

              <div className="space-y-5">
                {Object.entries(activeSub.answers).map(([qId, ans], idx) => {
                  const q = questions.find(item => item.id === qId);
                  if (!q) return null;

                  const isMCQ = q.type === 'mcq';
                  const isCorrect = isMCQ && ans === q.correctOption?.toString();

                  return (
                    <div key={qId} className="border-b border-slate-100 pb-5 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start gap-4 mb-3">
                        <h4 className="font-bold text-slate-900 flex-1">
                          <span className="text-indigo-600">{idx + 1}.</span>{' '}
                          <MathRenderer text={q.title} className="inline" />
                        </h4>
                        {isMCQ && (
                          <div className="shrink-0">
                            {isCorrect ? (
                              <div className="bg-emerald-50 p-1.5 rounded-lg">
                                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                              </div>
                            ) : (
                              <div className="bg-rose-50 p-1.5 rounded-lg">
                                <XCircle className="h-5 w-5 text-rose-600" />
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {isMCQ && q.options && (
                        <div className="grid sm:grid-cols-2 gap-3">
                          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">{t.yourAns}</span>
                            <div className="text-sm font-semibold">
                              <MathRenderer text={q.options[Number(ans)]} />
                            </div>
                          </div>
                          
                          <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-200">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block mb-2">{t.correctAns}</span>
                            <div className="text-sm font-semibold">
                              <MathRenderer text={q.options[q.correctOption || 0]} />
                            </div>
                          </div>
                        </div>
                      )}

                      {q.type === 'essay' && (
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">{t.yourAns}</span>
                          <div className="text-sm font-semibold">
                            <MathRenderer text={ans} />
                          </div>

                          {activeSub.manualFeedback && (
                            <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-200 mt-3">
                              <span className="text-[10px] font-bold text-indigo-700 uppercase block mb-2">
                                {currentLanguage === 'en' ? 'Teacher Feedback' : 'تعليق المعلم'}
                              </span>
                              <div className="text-sm text-slate-700">
                                <MathRenderer text={activeSub.manualFeedback} />
                              </div>
                            </div>
                          )}
                        </div>
                      )}


                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Exam Archive */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h3 className="font-extrabold text-slate-900 text-lg mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-indigo-600" />
                <span>{t.archiveHeader}</span>
              </h3>

              <div className="space-y-3">
                {submissions.map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => setActiveSub(sub)}
                    className={`w-full p-4 rounded-xl border text-left transition-all ${
                      activeSub?.id === sub.id
                        ? 'bg-indigo-50 border-indigo-200'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-sm text-slate-900">
                        {currentLanguage === 'en' ? 'Circuits & Benzene Exam' : 'امتحان الدوائر والبنزين'}
                      </span>
                      <span className="font-mono text-xs font-bold text-slate-600">
                        {sub.score ? `${sub.score}/12` : t.pending}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <Award className="h-16 w-16 mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500 font-medium">{t.noSubmission}</p>
        </div>
      )}


    </div>
  );
}