import React, { useState, useEffect } from 'react';
import { useAppState } from '../../../../shared/context/AppState';
import { Exam, Question, ExamSubmission } from '../../../../shared/types';
import MathRenderer from '../../../../shared/components/MathRenderer';
import { 
  Clock, 
  ArrowRight, 
  ArrowLeft, 
  Send, 
  Eye,
  EyeOff
} from 'lucide-react';

interface ExamTakerProps {
  exam: Exam;
  onSubmit: (submission: ExamSubmission) => void;
}

export default function ExamTaker({ exam, onSubmit }: ExamTakerProps) {
  const { currentLanguage, questions, addSubmission } = useAppState();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(exam.duration * 60);

  const [hideTimer, setHideTimer] = useState(false);
  const [confirmSubmit, setConfirmSubmit] = useState(false);

  const t = {
    timer: currentLanguage === 'en' ? 'Time Remaining' : 'الوقت المتبقي',
    startBtn: currentLanguage === 'en' ? 'Start Exam' : 'بدء الاختبار',
    prevBtn: currentLanguage === 'en' ? 'Previous' : 'السابق',
    nextBtn: currentLanguage === 'en' ? 'Next' : 'التالي',
    submitBtn: currentLanguage === 'en' ? 'Submit Exam' : 'تقديم الاختبار',
    questionNav: currentLanguage === 'en' ? 'Questions' : 'الأسئلة',
    duration: currentLanguage === 'en' ? 'Duration' : 'المدة',
    attempts: currentLanguage === 'en' ? 'Attempts' : 'المحاولات',
    rules: currentLanguage === 'en' ? 'Ensure you have a stable internet connection and submit before the timer runs out.' : 'تأكد من استقرار اتصال الإنترنت وتقديم الإجابات قبل انتهاء الوقت المتاح.',
    answered: currentLanguage === 'en' ? 'answered' : 'تمت الإجابة',
    unanswered: currentLanguage === 'en' ? 'Remaining' : 'متبقي',
    showTimer: currentLanguage === 'en' ? 'Show Timer' : 'إظهار المؤقت',
    hideTimerLabel: currentLanguage === 'en' ? 'Hide Timer' : 'إخفاء المؤقت',
  };

  const examQuestions = exam.questionIds.map(id =>
    questions.find(q => q.id === id) || {
      id,
      title: 'Sample Question',
      type: 'mcq' as const,
      difficulty: 'medium' as const,
      options: ['A', 'B', 'C', 'D']
    }
  );

  useEffect(() => {
    if (isFullscreen && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      handleFinalSubmit();
    }
  }, [isFullscreen, timeLeft]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };



  const unansweredCount = examQuestions.filter(q => answers[q.id] === undefined).length;

  const handleFinalSubmit = () => {
    if (unansweredCount > 0 && !confirmSubmit) {
      setConfirmSubmit(true);
      return;
    }
    const sub: ExamSubmission = {
      id: `sub-${Date.now()}`,
      examId: exam.id,
      studentId: 'st-student',
      studentName: 'Test Student',
      answers,
      status: 'submitted'
    };
    addSubmission(sub);
    onSubmit(sub);
  };

  const currentQ = examQuestions[currentQIdx];
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {!isFullscreen ? (
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center max-w-md mx-auto space-y-6">
          <div className="bg-indigo-50 p-4 rounded-full w-fit mx-auto border border-indigo-100 text-indigo-600">
            <Clock className="h-12 w-12" />
          </div>
          
          <div>
            <h3 className="font-extrabold text-slate-900 text-xl">{exam.title}</h3>
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-2 text-sm text-slate-500">
            <div className="flex justify-between px-4 py-2 bg-slate-50 rounded-lg">
              <span className="font-medium">{t.duration}</span>
              <span className="font-bold text-slate-900">{exam.duration} min</span>
            </div>
            <div className="flex justify-between px-4 py-2 bg-slate-50 rounded-lg">
              <span className="font-medium">{t.attempts}</span>
              <span className="font-bold text-slate-900">1/{exam.attempts}</span>
            </div>
            <p className="text-xs text-slate-400 pt-2">{t.rules}</p>
          </div>

          <button
            onClick={() => setIsFullscreen(true)}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-md"
          >
            <span>{t.startBtn}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          {/* Question Area */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Timer Bar */}
            <div className="bg-slate-900 text-white px-5 py-3 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setHideTimer(!hideTimer)}
                  className="hover:bg-slate-800 p-1.5 rounded-lg transition-colors"
                  title={hideTimer ? t.showTimer : t.hideTimerLabel}
                >
                  {hideTimer ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                <span className="text-xs font-medium">{t.timer}:</span>
                {!hideTimer ? (
                  <span className={`font-mono text-sm font-bold ${
                    timeLeft < 60 ? 'text-rose-400 animate-pulse' :
                    timeLeft < 300 ? 'text-amber-300' : 'text-indigo-300'
                  }`}>
                    {formatTime(timeLeft)}
                  </span>
                ) : (
                  <span className="text-xs text-slate-500 italic">--:--</span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">
                  {answeredCount}/{examQuestions.length} {t.answered}
                </span>
              </div>
            </div>

            {/* Question Content */}
            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {currentLanguage === 'en' ? 'Question' : 'سؤال'} {currentQIdx + 1} {currentLanguage === 'en' ? 'of' : 'من'} {examQuestions.length}
                </span>
                {currentQ.difficulty && (
                  <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-lg ${
                    currentQ.difficulty === 'hard' ? 'bg-rose-50 text-rose-600' :
                    currentQ.difficulty === 'medium' ? 'bg-amber-50 text-amber-600' :
                    'bg-emerald-50 text-emerald-600'
                  }`}>
                    {currentQ.difficulty}
                  </span>
                )}
              </div>

              <div className="text-base font-bold text-slate-900 leading-relaxed">
                <MathRenderer text={currentQ.title} />
              </div>

              {currentQ.type === 'mcq' && currentQ.options && (
                <div className="grid sm:grid-cols-2 gap-3">
                  {currentQ.options.map((opt, optIdx) => {
                    const isSelected = answers[currentQ.id] === optIdx.toString();
                    return (
                      <button
                        key={optIdx}
                        onClick={() => setAnswers({ ...answers, [currentQ.id]: optIdx.toString() })}
                        className={`p-4 text-left border rounded-xl font-semibold transition-all ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-500/10'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <MathRenderer text={opt} />
                      </button>
                    );
                  })}
                </div>
              )}

              {currentQ.type === 'essay' && (
                <textarea
                  rows={6}
                  value={answers[currentQ.id] || ''}
                  onChange={e => setAnswers({ ...answers, [currentQ.id]: e.target.value })}
                  placeholder={currentLanguage === 'en' ? 'Type your answer here...' : 'اكتب إجابتك هنا...'}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600"
                />
              )}
            </div>

            {/* Navigation Footer */}
            <div className="flex justify-between items-center border-t border-slate-100 px-6 py-4">
              <button
                disabled={currentQIdx === 0}
                onClick={() => setCurrentQIdx(currentQIdx - 1)}
                className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>{t.prevBtn}</span>
              </button>

              {currentQIdx < examQuestions.length - 1 ? (
                <button
                  onClick={() => setCurrentQIdx(currentQIdx + 1)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-xl text-xs hover:bg-indigo-700"
                >
                  <span>{t.nextBtn}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={handleFinalSubmit}
                  className={`font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 ${
                    confirmSubmit ? 'bg-rose-600 hover:bg-rose-700 animate-pulse' : 'bg-emerald-600 hover:bg-emerald-700'
                  } text-white`}
                >
                  <Send className="h-4 w-4" />
                  <span>
                    {confirmSubmit
                      ? (currentLanguage === 'en' ? `Submit Anyway (${unansweredCount} unanswered)` : `تقديم رغم ذلك (${unansweredCount} بدون إجابة)`)
                      : t.submitBtn
                    }
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Question Navigator */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Clock className="h-4 w-4 text-indigo-600" />
              <span>{t.questionNav}</span>
            </h3>

            <div className="grid grid-cols-4 gap-2">
              {examQuestions.map((q, idx) => {
                const isActive = currentQIdx === idx;
                const isAnswered = answers[q.id] !== undefined;

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQIdx(idx)}
                    className={`h-10 rounded-xl font-mono text-xs font-bold flex items-center justify-center transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md'
                        : isAnswered
                          ? 'bg-emerald-50 border border-emerald-300 text-emerald-700'
                          : 'bg-slate-50 border border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="border-t border-slate-100 pt-3 space-y-2 text-xs text-slate-500">
              <div className="flex justify-between">
                <span>{t.answered}:</span>
                <span className="font-bold text-emerald-600">{answeredCount}</span>
              </div>
              <div className="flex justify-between">
                <span>{t.unanswered}:</span>
                <span className="font-bold text-amber-600">{unansweredCount}</span>
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}