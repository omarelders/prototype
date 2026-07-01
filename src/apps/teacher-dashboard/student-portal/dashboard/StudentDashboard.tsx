import React from 'react';
import { useAppState } from '../../../../shared/context/AppState';
import { Lesson, Exam } from '../../../../shared/types';
import { BookOpen, Calendar, Clock, PlayCircle, ArrowRight, Award, BarChart3, FileSpreadsheet } from 'lucide-react';

interface StudentDashProps {
  onOpenLesson: (lesson: Lesson) => void;
  onOpenExam: (exam: Exam) => void;
  onNavigate: (tab: string) => void;
}

export default function StudentDashboard({ onOpenLesson, onOpenExam, onNavigate }: StudentDashProps) {
  const { currentLanguage, lessons, exams } = useAppState();

  const t = {
    progressTitle: currentLanguage === 'en' ? 'Learning Progress' : 'التقدم الدراسي',
    progressSub: currentLanguage === 'en' ? 'Complete lessons and assessments to track your achievement' : 'أكمل الدروس والامتحانات لتتبع تقدمك',
    lessonsHeader: currentLanguage === 'en' ? 'Available Lessons' : 'الدروس المتاحة',
    examsHeader: currentLanguage === 'en' ? 'Active Exams' : 'الامتحانات النشطة',
    openLesson: currentLanguage === 'en' ? 'Start Learning' : 'ابدأ الدرس',
    openExam: currentLanguage === 'en' ? 'Take Exam' : 'دخول الامتحان',
    duration: currentLanguage === 'en' ? 'min' : 'دقيقة',
    completed: currentLanguage === 'en' ? 'Completed' : 'مكتمل',
    active: currentLanguage === 'en' ? 'Active' : 'نشط',
    viewAllLessons: currentLanguage === 'en' ? 'View All Lessons' : 'عرض كل الدروس',
    noLessons: currentLanguage === 'en' ? 'No lessons available yet.' : 'لا توجد دروس متاحة حالياً',
    noExams: currentLanguage === 'en' ? 'No active exams available.' : 'لا توجد امتحانات نشطة حالياً',
  };

  const activeExams = exams.filter(e => e.status === 'active');
  const progressPercentage = 65;

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Progress Hero Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-700 rounded-3xl p-6 lg:p-8 text-white shadow-2xl shadow-indigo-500/20">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-48 h-48 bg-fuchsia-400/20 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/20 p-2 rounded-xl">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl lg:text-2xl font-extrabold">{t.progressTitle}</h2>
              <p className="text-sm text-indigo-100 font-medium">{t.progressSub}</p>
            </div>
          </div>

          <div className="flex items-end justify-between mt-6">
            <div>
              <div className="flex items-end gap-2">
                <span className="text-4xl lg:text-5xl font-black">{progressPercentage}%</span>
                <span className="text-indigo-200 text-sm font-semibold mb-2">{currentLanguage === 'en' ? 'Complete' : 'مكتمل'}</span>
              </div>
              <div className="mt-2">
                <span className="text-2xl font-bold text-emerald-300">10/12</span>
                <span className="text-indigo-200 text-sm font-medium ml-2">{currentLanguage === 'en' ? 'Quiz Score' : 'درجة الاختبار'}</span>
              </div>
            </div>

            <div className="hidden sm:block animate-float">
              <BarChart3 className="h-20 w-20 text-white/20 drop-shadow-lg" />
            </div>
          </div>

          <div className="mt-6 bg-white/10 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-emerald-400 to-amber-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid sm:grid-cols-3 gap-4" style={{ animationDelay: '0.1s' }}>
        <div className="glass-panel bg-white/80 rounded-2xl p-5 border border-white/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-br from-indigo-100 to-indigo-50 p-2 rounded-lg shadow-inner">
              <BookOpen className="h-5 w-5 text-indigo-600" />
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.lessonsHeader}</span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{lessons.length}</p>
          <p className="text-xs text-slate-400 mt-1">{currentLanguage === 'en' ? 'Available modules' : 'وحدات متاحة'}</p>
        </div>

        <div className="glass-panel bg-white/80 rounded-2xl p-5 border border-white/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-br from-emerald-100 to-emerald-50 p-2 rounded-lg shadow-inner">
              <FileSpreadsheet className="h-5 w-5 text-emerald-600" />
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.examsHeader}</span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{activeExams.length}</p>
          <p className="text-xs text-slate-400 mt-1">{currentLanguage === 'en' ? 'Ready to attempt' : 'جاهزة للإجراء'}</p>
        </div>

        <div className="glass-panel bg-white/80 rounded-2xl p-5 border border-white/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-br from-amber-100 to-amber-50 p-2 rounded-lg shadow-inner">
              <Calendar className="h-5 w-5 text-amber-600" />
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{currentLanguage === 'en' ? 'Upcoming' : 'قادمة'}</span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">3</p>
          <p className="text-xs text-slate-400 mt-1">{currentLanguage === 'en' ? 'Scheduled items' : 'عناصر مجدولة'}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Lessons Section */}
        <div className="lg:col-span-8 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-indigo-600" />
              <span>{t.lessonsHeader}</span>
            </h3>
            {lessons.length > 2 && (
              <button 
                onClick={() => onNavigate('lessons')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <span>{t.viewAllLessons}</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            )}
          </div>

          {lessons.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-5">
              {lessons.map(lesson => (
                <div 
                  key={lesson.id} 
                  className="group glass-panel bg-white/80 rounded-2xl overflow-hidden border border-white/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  {lesson.thumbnailUrl && (
                    <div className="h-40 overflow-hidden relative">
                      <img 
                        src={lesson.thumbnailUrl} 
                        alt={lesson.title} 
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <button
                        onClick={() => onOpenLesson(lesson)}
                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <div className="bg-white/90 text-indigo-600 rounded-full p-3">
                          <PlayCircle className="h-8 w-8" />
                        </div>
                      </button>
                    </div>
                  )}
                  
                  <div className="p-5 space-y-3">
                    <h4 className="font-extrabold text-slate-900 text-sm leading-tight line-clamp-2">
                      {lesson.title}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium line-clamp-2">
                      {lesson.description}
                    </p>

                    <button
                      onClick={() => onOpenLesson(lesson)}
                      className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
                    >
                      <PlayCircle className="h-4 w-4" />
                      <span>{t.openLesson}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
              <BookOpen className="h-12 w-12 mx-auto text-slate-300 mb-3" />
              <p className="text-sm text-slate-500 font-medium">{t.noLessons}</p>
            </div>
          )}
        </div>

        {/* Exams Sidebar */}
        <div className="lg:col-span-4 space-y-5">
          <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-indigo-600" />
            <span>{t.examsHeader}</span>
          </h3>

          {activeExams.length > 0 ? (
            <div className="space-y-4">
              {activeExams.map(exam => (
                <div 
                  key={exam.id} 
                  className="glass-panel bg-white/80 border border-white/60 rounded-2xl p-5 shadow-sm space-y-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-extrabold text-slate-900 text-sm leading-tight flex-1">
                      {exam.title}
                    </h4>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs font-medium">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Clock className="h-4 w-4" />
                      <span>{exam.duration} {t.duration}</span>
                    </div>
                    <div className="text-slate-500">
                      <span>{currentLanguage === 'en' ? 'Attempts' : 'محاولات'}: 1/{exam.attempts}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenExam(exam)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <span>{t.openExam}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
              <Calendar className="h-10 w-10 mx-auto text-slate-300 mb-2" />
              <p className="text-sm text-slate-500 font-medium">{t.noExams}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}