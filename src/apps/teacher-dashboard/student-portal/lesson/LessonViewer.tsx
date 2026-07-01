import React, { useState } from 'react';
import { useAppState } from '../../../../shared/context/AppState';
import { Lesson } from '../../../../shared/types';
import MathRenderer from '../../../../shared/components/MathRenderer';
import { 
  Play, 
  Pause, 
  Maximize, 
  RotateCcw, 
  ArrowLeft, 
  BookOpen, 
  Video, 
  FileText,
  CheckCircle, 
  HelpCircle, 
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  MessageCircleHeart,
  CheckCheck
} from 'lucide-react';

interface LessonViewerProps {
  lesson: Lesson;
  onBack: () => void;
}

export default function LessonViewer({ lesson, onBack }: LessonViewerProps) {
  const { currentLanguage, questions } = useAppState();

  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState('1.0x');
  const [isCompleted, setIsCompleted] = useState(false);
  const [progress, setProgress] = useState(35);
  const [showResumeAlert, setShowResumeAlert] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [essayAnswer, setEssayAnswer] = useState('');
  const [essaySubmitted, setEssaySubmitted] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState<'up' | 'down' | null>(null);

  const t = {
    backBtn: currentLanguage === 'en' ? 'Back to Dashboard' : 'الرجوع للرئيسية',
    resumeMsg: currentLanguage === 'en' ? 'Resume from 12:45?' : 'هل تريد الاستمرار من 12:45؟',
    resumeBtn: currentLanguage === 'en' ? 'Resume' : 'استمرار',
    videoTab: currentLanguage === 'en' ? 'Video Lecture' : 'الشرح بالفيديو',
    readingTab: currentLanguage === 'en' ? 'Reading Material' : 'المادة المقروءة',
    exercisesTab: currentLanguage === 'en' ? 'Practice Problems' : 'تمارين الدرس',
    mcqCorrect: currentLanguage === 'en' ? 'Correct! Well done.' : 'صحيح! أحسنت.',
    mcqIncorrect: currentLanguage === 'en' ? 'Incorrect. Try again.' : 'خاطئ. حاول مرة أخرى.',
    essaySubmit: currentLanguage === 'en' ? 'Submit Answer' : 'تقديم الإجابة',
    essayStatus: currentLanguage === 'en' ? 'Answer submitted for review.' : 'تم تقديم الإجابة للمراجعة.',
    markComplete: currentLanguage === 'en' ? 'Mark Complete' : 'تعليم كمكتمل',
    completedMsg: currentLanguage === 'en' ? 'Lesson completed!' : 'تم إكمال الدرس!',
    understand: currentLanguage === 'en' ? 'Did you understand?' : 'هل فهمت المحتوى؟',
    feedbackThanks: currentLanguage === 'en' ? 'Thank you for your feedback!' : 'شكرًا لتقييمك!',
    startTimeOver: currentLanguage === 'en' ? 'Start from beginning' : 'البدء من البداية',
  };

  const handleMCQSelect = (questionId: string, optionIdx: number) => {
    setSelectedAnswers({ ...selectedAnswers, [questionId]: optionIdx });
  };

  const videoSection = lesson.sections.find(s => s.type === 'video');
  const readingSection = lesson.sections.find(s => s.type === 'reading');
  const exercisesSection = lesson.sections.find(s => s.type === 'exercises');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 font-medium text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t.backBtn}</span>
        </button>
        <h2 className="font-extrabold text-slate-900 text-lg hidden md:block">{lesson.title}</h2>
      </div>

      {/* Video Player */}
      {videoSection && (
        <div className="bg-slate-950 rounded-2xl overflow-hidden aspect-video relative">
          <div className="absolute top-4 left-4 bg-indigo-600/90 text-white px-3 py-1 rounded-lg text-xs font-mono">
            BUNNY STREAM
          </div>

          {!playing && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={() => { setPlaying(true); setShowResumeAlert(false); }}
                className="bg-white/90 hover:bg-white text-indigo-600 rounded-full p-6 transition-all"
              >
                <Play className="h-10 w-10 ml-1" />
              </button>
            </div>
          )}

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const percent = (clickX / rect.width) * 100;
                setProgress(percent);
              }}
              className="w-full bg-slate-800 h-2 rounded-full cursor-pointer mb-3"
            >
              <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${progress}%` }} />
            </div>

            <div className="flex justify-between items-center text-white text-xs">
              <div className="flex items-center gap-3">
                <button onClick={() => setPlaying(!playing)}>
                  {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </button>
                <span className="font-mono">12:45 / 35:00</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSpeed(speed === '1.0x' ? '1.25x' : speed === '1.25x' ? '1.5x' : '1.0x')}
                  className="px-2 py-1 rounded border border-slate-700 hover:bg-slate-800"
                >
                  {speed}
                </button>
                <button><Maximize className="h-4 w-4" /></button>
              </div>
            </div>
          </div>

          {/* Resume Alert */}
          {showResumeAlert && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 space-y-4">
              <AlertCircle className="h-12 w-12 text-indigo-500" />
              <div className="text-center">
                <h3 className="text-white font-bold text-lg mb-1">{t.resumeMsg}</h3>
                <p className="text-slate-400 text-xs">You watched 35% of this video previously.</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => { setPlaying(true); setShowResumeAlert(false); }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm"
                >
                  {t.resumeBtn}
                </button>
                <button
                  onClick={() => setShowResumeAlert(false)}
                  className="border border-slate-700 text-slate-300 px-6 py-2.5 rounded-xl font-medium text-sm"
                >
                  {t.startTimeOver}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Reading Content */}
      {readingSection && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <div className="bg-amber-100 p-2 rounded-lg">
              <BookOpen className="h-5 w-5 text-amber-600" />
            </div>
            <h3 className="font-extrabold text-slate-900">{t.readingTab}</h3>
          </div>

          <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed">
            <MathRenderer text={readingSection.readingContent || ''} />
          </div>

          {/* Feedback */}
          <div className="mt-8 bg-slate-50 rounded-2xl p-6 flex flex-col items-center">
            <div className="bg-indigo-100 p-3 rounded-full mb-4">
              <MessageCircleHeart className="h-6 w-6 text-indigo-600" />
            </div>
            <h4 className="font-bold text-slate-900 mb-1">{t.understand}</h4>
            <p className="text-slate-500 text-xs mb-4 text-center">
              {currentLanguage === 'en' 
                ? 'Your feedback helps improve lesson quality' 
                : 'تقييمك يساعد على تحسين جودة الدروس'
              }
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setFeedbackGiven('up')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  feedbackGiven === 'up'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-emerald-300'
                }`}
              >
                <ThumbsUp className="h-4 w-4" />
                <span>{currentLanguage === 'en' ? 'Yes!' : 'نعم!'}</span>
              </button>
              <button
                onClick={() => setFeedbackGiven('down')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  feedbackGiven === 'down'
                    ? 'bg-rose-500 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-rose-300'
                }`}
              >
                <ThumbsDown className="h-4 w-4" />
                <span>{currentLanguage === 'en' ? 'Need Help' : 'أحتاج مساعدة'}</span>
              </button>
            </div>
            {feedbackGiven && (
              <p className="text-indigo-600 text-xs font-semibold mt-3">{t.feedbackThanks}</p>
            )}
          </div>
        </div>
      )}

      {/* Exercises */}
      {exercisesSection && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-6 pb-3 border-b border-slate-100">
            <div className="bg-emerald-100 p-2 rounded-lg">
              <HelpCircle className="h-5 w-5 text-emerald-600" />
            </div>
            <h3 className="font-extrabold text-slate-900">{t.exercisesTab}</h3>
          </div>

          <div className="space-y-6">
            {exercisesSection.exerciseQuestionIds?.map((qId, idx) => {
              const q = questions.find(item => item.id === qId) || {
                id: qId,
                title: "Sample question text?",
                type: 'mcq' as const,
                options: ["Option A", "Option B", "Option C", "Option D"],
                correctOption: 0
              };

              const studentSelectedIdx = selectedAnswers[q.id];
              const isSubmitted = studentSelectedIdx !== undefined;

              return (
                <div key={q.id} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                  <h4 className="font-bold text-slate-900 mb-4">
                    <span className="text-indigo-600">{idx + 1}.</span>{' '}
                    <MathRenderer text={q.title} className="inline" />
                  </h4>

                  {q.type === 'mcq' && (
                    <div className="grid sm:grid-cols-2 gap-3">
                      {q.options?.map((opt, optIdx) => {
                        const isCorrect = optIdx === q.correctOption;
                        const isChosen = studentSelectedIdx === optIdx;

                        return (
                          <button
                            key={optIdx}
                            onClick={() => !isSubmitted && handleMCQSelect(q.id, optIdx)}
                            className={`p-4 rounded-xl border text-left font-semibold transition-all ${
                              isSubmitted
                                ? isCorrect
                                  ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                                  : isChosen
                                    ? 'bg-rose-50 border-rose-500 text-rose-900'
                                    : 'border-slate-200 opacity-60'
                                : 'border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/50'
                            }`}
                          >
                            <MathRenderer text={opt} />
                          </button>
                        );
                      })}

                      {isSubmitted && (
                        <div className={`col-span-full mt-2 p-3 rounded-lg border text-xs font-semibold flex items-center gap-2 ${
                          studentSelectedIdx === q.correctOption
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            : 'bg-rose-50 border-rose-200 text-rose-700'
                        }`}>
                          {studentSelectedIdx === q.correctOption ? (
                            <>
                              <CheckCircle className="h-4 w-4" />
                              <span>{t.mcqCorrect}</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="h-4 w-4" />
                              <span>{t.mcqIncorrect}</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Essay Exercise */}
            {exercisesSection.exerciseQuestionIds?.includes('q-3') && (
              <div className="border-t border-slate-200 pt-6">
                <h4 className="font-bold text-slate-900 mb-3">
                  {currentLanguage === 'en' 
                    ? "Newton's Second Law - Written Response" 
                    : 'قانون نيوتن الثاني - إجابة مقالية'
                  }
                </h4>

                {essaySubmitted ? (
                  <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-center gap-2">
                    <CheckCheck className="h-5 w-5 text-emerald-600" />
                    <span className="font-semibold text-emerald-700">{t.essayStatus}</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <textarea
                      rows={4}
                      value={essayAnswer}
                      onChange={e => setEssayAnswer(e.target.value)}
                      placeholder={currentLanguage === 'en' 
                        ? 'Write your explanation here...' 
                        : 'اكتب إجابتك هنا...'
                      }
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:bg-white focus:border-indigo-600 resize-none"
                    />
                    <button
                      onClick={() => setEssaySubmitted(true)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm"
                    >
                      {t.essaySubmit}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Complete Button */}
      <div className="flex justify-center pt-6">
        {isCompleted ? (
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 px-6 py-3 rounded-xl font-semibold">
            <CheckCheck className="h-5 w-5" />
            <span>{t.completedMsg}</span>
          </div>
        ) : (
          <button
            onClick={() => setIsCompleted(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl font-semibold flex items-center gap-2 shadow-md"
          >
            <CheckCircle className="h-5 w-5" />
            <span>{t.markComplete}</span>
          </button>
        )}
      </div>
    </div>
  );
}