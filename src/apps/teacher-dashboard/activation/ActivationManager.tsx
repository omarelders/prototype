import React, { useState } from 'react';
import { useAppState } from '../../../shared/context/AppState';
import { BookOpen, FileSpreadsheet, Layers, Calendar, Zap, AlertCircle } from 'lucide-react';

export default function ActivationManager() {
  const { currentLanguage, lessons, exams } = useAppState();
  const [subTab, setSubTab] = useState<'lessons' | 'exams'>('lessons');

  // Translations
  const dict = {
    en: {
      lessonsTitle: "Lesson Access Controls",
      examsTitle: "Exam Windows",
      colTitle: "Item Name",
      colRelease: "Release Mode",
      colVisibility: "Public Visibility",
      activeNow: "Active / Released",
      scheduled: "Scheduled for",
      scheduleBtn: "Change Schedule",
      saveBtn: "Apply Controls"
    },
    ar: {
      lessonsTitle: "تفعيل وجدولة الدروس",
      examsTitle: "فترات تفعيل الامتحانات",
      colTitle: "اسم العنصر الأكاديمي",
      colRelease: "طريقة الجدولة والإطلاق",
      colVisibility: "الظهور للطلاب",
      activeNow: "نشط ومعروض للطلاب",
      scheduled: "مجدول للإطلاق بتاريخ",
      scheduleBtn: "تعديل موعد الإطلاق",
      saveBtn: "تطبيق التغييرات"
    }
  };

  const t = dict[currentLanguage];

  return (
    <div className="space-y-6 text-left">
      {/* Sub tabs switcher */}
      <div className="flex gap-4 border-b border-slate-200 pb-3">
        <button 
          onClick={() => setSubTab('lessons')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
            subTab === 'lessons' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>{currentLanguage === 'en' ? 'Lessons Activation' : 'تفعيل الدروس'}</span>
        </button>
        
        <button 
          onClick={() => setSubTab('exams')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
            subTab === 'exams' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileSpreadsheet className="h-4 w-4" />
          <span>{currentLanguage === 'en' ? 'Exams Activation' : 'تفعيل الامتحانات'}</span>
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-6 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <h3 className="font-extrabold text-slate-900 text-sm">
            {subTab === 'lessons' && t.lessonsTitle}
            {subTab === 'exams' && t.examsTitle}
          </h3>
          <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
            <Zap className="h-3.5 w-3.5 text-indigo-600" />
            <span>{currentLanguage === 'en' ? 'Real-time Sync' : 'مزامنة فورية'}</span>
          </span>
        </div>

        <div className="space-y-4">
          {subTab === 'lessons' && lessons.map(lesson => (
            <div key={lesson.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 border border-slate-200/60 rounded-xl gap-4">
              <div className="space-y-0.5">
                <h4 className="font-bold text-slate-800 text-xs">{lesson.title}</h4>
                <p className="text-[10px] text-slate-500 font-medium">
                  {currentLanguage === 'en' ? 'Target: Grade 12 - Group A' : 'المستهدف: الصف الثالث الثانوي - مجموعة أ'}
                </p>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-xs font-bold">
                <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                  <Check className="h-3.5 w-3.5" />
                  <span>{t.activeNow}</span>
                </div>
                
                <button className="text-indigo-600 hover:underline">{t.scheduleBtn}</button>
              </div>
            </div>
          ))}

          {subTab === 'exams' && exams.map(exam => (
            <div key={exam.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 border border-slate-200/60 rounded-xl gap-4">
              <div className="space-y-0.5">
                <h4 className="font-bold text-slate-800 text-xs">{exam.title}</h4>
                <p className="text-[10px] text-slate-500 font-medium">
                  {currentLanguage === 'en' ? `Timer: ${exam.duration} mins` : `المدة: ${exam.duration} دقيقة`}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs font-bold">
                {exam.status === 'active' ? (
                  <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                    <Check className="h-3.5 w-3.5" />
                    <span>{t.activeNow}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md font-mono">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{t.scheduled} {exam.activationDate.split('T')[0]}</span>
                  </div>
                )}

                <button className="text-indigo-600 hover:underline">{t.scheduleBtn}</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Inline Check Icon helper to prevent import issue
function Check(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
