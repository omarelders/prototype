import React from 'react';
import { useAppState } from '../../../shared/context/AppState';
import { Exam, ExamSubmission } from '../../../shared/types';
import MathRenderer from '../../../shared/components/MathRenderer';
import { 
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface ExamSubmissionViewerProps {
  exam: Exam;
  submission: ExamSubmission;
  onBack: () => void;
}

export default function ExamSubmissionViewer({ exam, submission, onBack }: ExamSubmissionViewerProps) {
  const { currentLanguage, questions } = useAppState();
  const isAr = currentLanguage === 'ar';

  const t = {
    back: isAr ? 'رجوع' : 'Back',
    student: isAr ? 'الطالب' : 'Student',
    score: isAr ? 'الدرجة' : 'Score',
    correctAnswer: isAr ? 'الإجابة الصحيحة:' : 'Correct Answer:',
    studentAnswer: isAr ? 'إجابة الطالب:' : 'Student Answer:',
    noAnswer: isAr ? 'لم يجب' : 'Not Answered',
    teacherFeedback: isAr ? 'تعليق المعلم' : 'Teacher Feedback',
    aiFeedback: isAr ? 'تعليق الذكاء الاصطناعي' : 'AI Feedback',
    essayGrading: isAr ? 'تصحيح المقال' : 'Essay Grading'
  };

  const examQuestions = exam.questionIds.map(id =>
    questions.find(q => q.id === id)
  ).filter(Boolean) as typeof questions;

  return (
    <div className="space-y-6" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center gap-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <button
          onClick={onBack}
          className="p-2 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors shadow-sm text-slate-500 hover:text-indigo-600 flex-shrink-0"
        >
          <ArrowLeft className={`h-5 w-5 ${isAr ? 'rotate-180' : ''}`} />
        </button>
        <div className="flex-1">
          <h2 className="text-lg font-black text-slate-900">{exam.title}</h2>
          <div className="flex items-center gap-3 mt-1 text-xs font-semibold text-slate-500">
            <span>{t.student}: {submission.studentName}</span>
            <span>•</span>
            <span className="text-indigo-600 font-bold">{t.score}: {submission.score !== undefined ? submission.score : '-'}</span>
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {examQuestions.map((q, idx) => {
          const studentAnsString = submission.answers[q.id];
          const isAnswered = studentAnsString !== undefined && studentAnsString !== '';
          const mcqAnsIdx = submission.mcqAnswers ? submission.mcqAnswers[q.id] : parseInt(studentAnsString);

          const isMcq = q.type === 'mcq';
          const isCorrectMcq = isMcq && mcqAnsIdx === q.correctOption;

          return (
            <div key={q.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {isAr ? 'سؤال' : 'Question'} {idx + 1} {isAr ? 'من' : 'of'} {examQuestions.length}
                  </span>
                  {isMcq && (
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold ${
                      !isAnswered ? 'bg-slate-100 text-slate-600' :
                      isCorrectMcq ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                    }`}>
                      {!isAnswered ? <AlertCircle className="h-3.5 w-3.5" /> : 
                       isCorrectMcq ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                      <span>
                        {!isAnswered ? t.noAnswer : 
                         isCorrectMcq ? (isAr ? 'إجابة صحيحة' : 'Correct') : (isAr ? 'إجابة خاطئة' : 'Wrong')}
                      </span>
                    </div>
                  )}
                </div>

                <div className="text-base font-bold text-slate-900 leading-relaxed">
                  <MathRenderer text={q.title} />
                </div>

                {isMcq && q.options && (
                  <div className="grid sm:grid-cols-2 gap-3 mt-4">
                    {q.options.map((opt, optIdx) => {
                      const isStudentAns = mcqAnsIdx === optIdx;
                      const isCorrectOpt = q.correctOption === optIdx;
                      
                      let btnClass = 'border-slate-200 bg-slate-50 opacity-60';
                      if (isCorrectOpt) {
                        btnClass = 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/20 text-emerald-900';
                      } else if (isStudentAns && !isCorrectOpt) {
                        btnClass = 'border-rose-500 bg-rose-50 text-rose-900 ring-2 ring-rose-500/20';
                      }

                      return (
                        <div
                          key={optIdx}
                          className={`p-4 text-left border rounded-xl font-semibold relative ${btnClass}`}
                        >
                          <MathRenderer text={opt} />
                          {isStudentAns && (
                            <span className="absolute top-2 right-2 flex items-center gap-1 text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-white/80 border border-current shadow-sm">
                              {isCorrectOpt ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                              {t.studentAnswer}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {!isMcq && (
                  <div className="mt-4 space-y-4">
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t.studentAnswer}</p>
                      <p className="text-sm font-semibold text-slate-900 whitespace-pre-wrap">
                        {isAnswered ? studentAnsString : <span className="italic text-slate-400">{t.noAnswer}</span>}
                      </p>
                    </div>

                    {q.modelAnswer && (
                      <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-100">
                        <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">{t.correctAnswer}</p>
                        <div className="text-sm font-semibold text-emerald-900 whitespace-pre-wrap">
                          <MathRenderer text={q.modelAnswer} />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Feedback Section */}
                {(submission.aiFeedback?.[q.id] || submission.manualFeedback) && (
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                    {submission.aiFeedback?.[q.id] && (
                      <div className="bg-indigo-50/50 rounded-lg p-3 border border-indigo-100 flex gap-2">
                        <span className="text-indigo-500 flex-shrink-0">🤖</span>
                        <div>
                          <p className="text-[10px] font-bold text-indigo-700 uppercase">{t.aiFeedback}</p>
                          <p className="text-xs text-indigo-900 mt-0.5">{submission.aiFeedback[q.id]}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
