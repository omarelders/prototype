import React, { useState, useMemo } from 'react';
import { useAppState } from '../../../shared/context/AppState';
import { Question } from '../../../shared/types';
import MathRenderer from '../../../shared/components/MathRenderer';
import { 
  Users, Target, TrendingUp, BarChart3, ChevronLeft, ChevronRight, CheckCircle2, XCircle
} from 'lucide-react';

interface ExamAnalyticsProps {
  examId: string;
}

export default function ExamAnalytics({ examId }: ExamAnalyticsProps) {
  const { exams, submissions, questions, updateSubmission } = useAppState();
  
  const [activeTab, setActiveTab] = useState<'summary' | 'question' | 'individual'>('summary');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [currentSubmissionIdx, setCurrentSubmissionIdx] = useState(0);

  // Filter exam and submissions
  const exam = exams.find(e => e.id === examId);
  const examSubmissions = submissions.filter(s => s.examId === examId);
  const examQuestions = useMemo(() => {
    if (!exam) return [];
    return exam.questionIds.map(id => questions.find(q => q.id === id)).filter(Boolean) as Question[];
  }, [exam, questions]);

  // Derived Summary Stats
  const totalResponses = examSubmissions.length;
  
  const scores = examSubmissions.map(s => s.score || 0).sort((a, b) => a - b);
  const avgScore = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : '0';
  const medianScore = scores.length > 0 ? scores[Math.floor(scores.length / 2)] : 0;
  const rangeStr = scores.length > 0 ? `${scores[0]} - ${scores[scores.length - 1]}` : '0 - 0';
  
  // Calculate max possible score
  const maxPossibleScore = examQuestions.reduce((sum, q) => sum + (q.points || 1), 0) || 1;

  // Histogram buckets (0-20%, 20-40%, 40-60%, 60-80%, 80-100%)
  const buckets = [0, 0, 0, 0, 0];
  scores.forEach(s => {
    const percent = s / maxPossibleScore;
    if (percent < 0.2) buckets[0]++;
    else if (percent < 0.4) buckets[1]++;
    else if (percent < 0.6) buckets[2]++;
    else if (percent < 0.8) buckets[3]++;
    else buckets[4]++;
  });

  const maxBucket = Math.max(...buckets, 1);



  const _handleSaveIndividualGrade = (subId: string, qId: string, score: number) => {
    // In a real app we'd save per-question scores. Here we just update total score for demo
    const sub = examSubmissions.find(s => s.id === subId);
    if (sub) {
      updateSubmission({
        ...sub,
        score: (sub.score || 0) + score,
        status: 'graded'
      });
    }
  };

  if (!exam) return <div>Exam not found</div>;

  if (totalResponses === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
        <div className="bg-indigo-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <BarChart3 className="h-10 w-10 text-indigo-300" />
        </div>
        <h3 className="text-xl font-bold text-slate-800">Waiting for responses</h3>
        <p className="text-slate-500 mt-2">No students have submitted this exam yet. Analytics will appear here automatically.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sub-tabs */}
      <div className="flex bg-white rounded-xl shadow-sm border border-slate-200 p-1 w-fit mx-auto">
        <button 
          onClick={() => setActiveTab('summary')}
          className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'summary' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          Summary
        </button>
        <button 
          onClick={() => setActiveTab('question')}
          className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'question' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          Question
        </button>
        <button 
          onClick={() => setActiveTab('individual')}
          className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'individual' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          Individual
        </button>
      </div>

      {/* Summary Tab */}
      {activeTab === 'summary' && (
        <div className="space-y-6 animate-fade-in">
          {/* Key Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 text-center">
              <Users className="h-6 w-6 text-indigo-500 mx-auto mb-2" />
              <div className="text-3xl font-extrabold text-slate-800">{totalResponses}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Responses</div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 text-center">
              <Target className="h-6 w-6 text-emerald-500 mx-auto mb-2" />
              <div className="text-3xl font-extrabold text-slate-800">{avgScore} <span className="text-sm text-slate-400">/ {maxPossibleScore}</span></div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Average</div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 text-center">
              <BarChart3 className="h-6 w-6 text-amber-500 mx-auto mb-2" />
              <div className="text-3xl font-extrabold text-slate-800">{medianScore}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Median</div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 text-center">
              <TrendingUp className="h-6 w-6 text-purple-500 mx-auto mb-2" />
              <div className="text-3xl font-extrabold text-slate-800">{rangeStr}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Range</div>
            </div>
          </div>

          {/* Score Distribution */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-sm font-bold text-slate-800 mb-6 uppercase tracking-wider">Score Distribution</h3>
            <div className="flex items-end h-48 gap-2 mt-4 pb-2 border-b border-slate-200">
              {buckets.map((count, i) => (
                <div key={i} className="flex-1 flex flex-col items-center justify-end group">
                  <div className="opacity-0 group-hover:opacity-100 text-xs font-bold text-slate-600 mb-2 transition-opacity">{count}</div>
                  <div 
                    className="w-full max-w-[40px] rounded-t-md transition-all duration-500"
                    style={{ 
                      height: `${(count / maxBucket) * 100}%`,
                      background: `linear-gradient(to top, ${i < 2 ? '#f43f5e' : i === 2 ? '#f59e0b' : '#10b981'}, ${i < 2 ? '#fb7185' : i === 2 ? '#fbbf24' : '#34d399'})`
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-2">
              <div className="flex-1 text-center">0-20%</div>
              <div className="flex-1 text-center">20-40%</div>
              <div className="flex-1 text-center">40-60%</div>
              <div className="flex-1 text-center">60-80%</div>
              <div className="flex-1 text-center">80-100%</div>
            </div>
          </div>

          {/* Per-question Breakdown */}
          {examQuestions.map((q, idx) => {
            if (q.type === 'mcq') {
              const optionCounts = (q.options || []).map(() => 0);
              examSubmissions.forEach(sub => {
                const ans = sub.answers[q.id];
                if (ans !== undefined) {
                  const oIdx = parseInt(ans, 10);
                  if (!isNaN(oIdx) && oIdx >= 0 && oIdx < optionCounts.length) {
                    optionCounts[oIdx]++;
                  }
                }
              });

              return (
                <div key={q.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <div className="flex justify-between items-start mb-6">
                    <h4 className="font-bold text-slate-800"><span className="text-indigo-600 mr-2">{idx + 1}.</span> <MathRenderer text={q.title} className="inline" /></h4>
                    <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded">{totalResponses} responses</span>
                  </div>
                  <div className="space-y-3">
                    {q.options?.map((opt, oIdx) => {
                      const count = optionCounts[oIdx];
                      const pct = totalResponses > 0 ? (count / totalResponses) * 100 : 0;
                      const isCorrect = oIdx === q.correctOption;
                      return (
                        <div key={oIdx} className="relative">
                          <div className="flex justify-between text-xs font-semibold mb-1 relative z-10 px-3 py-2 text-slate-800">
                            <div className="flex items-center gap-2">
                              {isCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                              <span>{opt}</span>
                            </div>
                            <span>{count} ({pct.toFixed(0)}%)</span>
                          </div>
                          <div 
                            className={`absolute top-0 left-0 bottom-0 rounded-lg opacity-20 ${isCorrect ? 'bg-emerald-500' : 'bg-slate-400'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            } else {
              // Essay Question Summary
              const gradedCount = examSubmissions.filter(s => s.status === 'graded').length;
              return (
                <div key={q.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <div className="flex justify-between items-start mb-6">
                    <h4 className="font-bold text-slate-800"><span className="text-indigo-600 mr-2">{idx + 1}.</span> <MathRenderer text={q.title} className="inline" /></h4>
                    <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded">{totalResponses} responses</span>
                  </div>
                  <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-indigo-900">Essay/Paragraph Response</div>
                      <div className="text-xs text-indigo-700 mt-1">{gradedCount} graded, {totalResponses - gradedCount} pending review</div>
                    </div>
                    <button onClick={() => { setActiveTab('individual'); setCurrentQuestionIdx(idx); }} className="text-xs font-bold bg-indigo-600 text-white px-3 py-1.5 rounded-lg shadow-sm hover:bg-indigo-700">
                      Grade Essays
                    </button>
                  </div>
                </div>
              );
            }
          })}
        </div>
      )}

      {/* Question Tab */}
      {activeTab === 'question' && examQuestions.length > 0 && (
        <div className="animate-fade-in space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 flex items-center justify-between">
            <button 
              onClick={() => setCurrentQuestionIdx(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIdx === 0}
              className="p-2 hover:bg-slate-100 rounded-lg disabled:opacity-30"
            >
              <ChevronLeft className="h-5 w-5 text-slate-600" />
            </button>
            <div className="font-bold text-sm text-slate-800">
              Question {currentQuestionIdx + 1} of {examQuestions.length}
            </div>
            <button 
              onClick={() => setCurrentQuestionIdx(prev => Math.min(examQuestions.length - 1, prev + 1))}
              disabled={currentQuestionIdx === examQuestions.length - 1}
              className="p-2 hover:bg-slate-100 rounded-lg disabled:opacity-30"
            >
              <ChevronRight className="h-5 w-5 text-slate-600" />
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <h3 className="text-lg font-bold text-slate-900 mb-6">
              <MathRenderer text={examQuestions[currentQuestionIdx].title} />
            </h3>

            {examQuestions[currentQuestionIdx].type === 'mcq' ? (
              <div className="space-y-4">
                {examQuestions[currentQuestionIdx].options?.map((opt, oIdx) => {
                  const count = examSubmissions.filter(s => parseInt(s.answers[examQuestions[currentQuestionIdx].id]) === oIdx).length;
                  const isCorrect = oIdx === examQuestions[currentQuestionIdx].correctOption;
                  return (
                    <div key={oIdx} className="flex items-center gap-4 border border-slate-100 rounded-xl p-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                        {count}
                      </div>
                      <div className="flex-1 font-semibold text-sm text-slate-800">{opt}</div>
                      {isCorrect && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-4">
                {examSubmissions.map((sub, i) => (
                  <div key={i} className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                    <div className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Response {i + 1}</div>
                    <p className="text-sm text-slate-800">{sub.answers[examQuestions[currentQuestionIdx].id] || <span className="italic text-slate-400">No response</span>}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Individual Tab */}
      {activeTab === 'individual' && examSubmissions.length > 0 && (
        <div className="animate-fade-in grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 bg-white rounded-2xl shadow-sm border border-slate-200 p-4 h-fit sticky top-24">
            <h3 className="font-bold text-slate-800 mb-4 uppercase tracking-wider text-xs px-2">Submissions</h3>
            <div className="space-y-1">
              {examSubmissions.map((sub, i) => (
                <button
                  key={sub.id}
                  onClick={() => setCurrentSubmissionIdx(i)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold flex justify-between items-center transition-colors ${currentSubmissionIdx === i ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50 text-slate-700'}`}
                >
                  <span className="truncate">{sub.studentName}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${sub.status === 'graded' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {sub.score !== undefined ? sub.score : '-'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">{examSubmissions[currentSubmissionIdx].studentName}</h2>
                <div className="text-sm font-semibold text-slate-500 mt-1 flex items-center gap-4">
                  <span>Total Score: {examSubmissions[currentSubmissionIdx].score ?? 'Ungraded'} / {maxPossibleScore}</span>
                  <span className="text-slate-300">•</span>
                  <span className={examSubmissions[currentSubmissionIdx].status === 'graded' ? 'text-emerald-600' : 'text-amber-600'}>
                    {examSubmissions[currentSubmissionIdx].status === 'graded' ? 'Graded' : 'Pending Review'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                 <button 
                  onClick={() => setCurrentSubmissionIdx(prev => Math.max(0, prev - 1))}
                  disabled={currentSubmissionIdx === 0}
                  className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-30"
                 >
                   <ChevronLeft className="h-4 w-4" />
                 </button>
                 <span className="text-xs font-bold text-slate-400 w-12 text-center">{currentSubmissionIdx + 1} / {examSubmissions.length}</span>
                 <button 
                  onClick={() => setCurrentSubmissionIdx(prev => Math.min(examSubmissions.length - 1, prev + 1))}
                  disabled={currentSubmissionIdx === examSubmissions.length - 1}
                  className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-30"
                 >
                   <ChevronRight className="h-4 w-4" />
                 </button>
              </div>
            </div>

            {/* Render student's answers */}
            <div className="space-y-6">
              {examQuestions.map((q, idx) => {
                const ans = examSubmissions[currentSubmissionIdx].answers[q.id];
                const isMCQ = q.type === 'mcq';
                const isCorrect = isMCQ && ans === q.correctOption?.toString();
                
                return (
                  <div key={q.id} className={`bg-white rounded-2xl shadow-sm border p-6 ${isMCQ ? (isCorrect ? 'border-emerald-200' : 'border-rose-200') : 'border-slate-200'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-bold text-slate-900"><span className="text-indigo-600 mr-2">{idx + 1}.</span> <MathRenderer text={q.title} className="inline" /></h4>
                      {isMCQ && (
                        <div className="shrink-0 flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-500">{q.points || 1} pt</span>
                          {isCorrect ? <CheckCircle2 className="h-6 w-6 text-emerald-500" /> : <XCircle className="h-6 w-6 text-rose-500" />}
                        </div>
                      )}
                    </div>

                    {isMCQ ? (
                      <div className="space-y-2">
                        {q.options?.map((opt, oIdx) => {
                          const isSelected = ans === oIdx.toString();
                          const isActualCorrect = oIdx === q.correctOption;
                          return (
                            <div key={oIdx} className={`p-3 rounded-xl border flex items-center gap-3 text-sm font-semibold ${
                              isSelected && isActualCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-800' :
                              isSelected && !isActualCorrect ? 'bg-rose-50 border-rose-300 text-rose-800' :
                              !isSelected && isActualCorrect ? 'bg-slate-50 border-emerald-300 text-slate-800' :
                              'bg-white border-slate-200 text-slate-600'
                            }`}>
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                isSelected ? (isActualCorrect ? 'border-emerald-500 bg-emerald-500' : 'border-rose-500 bg-rose-500') : 'border-slate-300'
                              }`}>
                                {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                              </div>
                              <div className="flex-1">{opt}</div>
                              {isActualCorrect && !isSelected && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">Student Answer</span>
                          <p className="text-sm text-slate-800"><MathRenderer text={ans || ''} /></p>
                        </div>
                        
                        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block mb-2">Rubric / Model Answer</span>
                          <p className="text-sm text-slate-800"><MathRenderer text={q.modelAnswer || 'No model answer provided'} /></p>
                        </div>


                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
