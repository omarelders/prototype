import React, { useState } from 'react';
import { useAppState } from '../../../shared/context/AppState';
import { BookOpen, FileSpreadsheet, Layers, Calendar, Zap, AlertCircle, Clock, CheckCircle2, XCircle } from 'lucide-react';

export default function ActivationManager() {
  const { currentLanguage, lessons: allLessons, exams: allExams, classes: allClasses, academicLevels, updateLesson, updateExam, updateClass } = useAppState();
  const [subTab, setSubTab] = useState<'lessons' | 'exams' | 'classes'>('lessons');

  const [selectedGrade, setSelectedGrade] = useState<string>('all');

  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduleTarget, setScheduleTarget] = useState<{type: 'lesson'|'exam'|'class', id: string, title: string, currentDate: string} | null>(null);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');

  const classes = React.useMemo(() => {
    if (selectedGrade === 'all') return allClasses;
    return allClasses.filter(c => c.academicLevelId === selectedGrade);
  }, [allClasses, selectedGrade]);

  const lessons = React.useMemo(() => {
    if (selectedGrade === 'all') return allLessons;
    return allLessons.filter(l => {
      if (l.academicLevelId === selectedGrade) return true;
      const cls = allClasses.find(c => c.id === l.targetClass);
      return cls?.academicLevelId === selectedGrade;
    });
  }, [allLessons, selectedGrade, allClasses]);

  const exams = React.useMemo(() => {
    if (selectedGrade === 'all') return allExams;
    return allExams.filter(e => {
      if (e.academicLevelId === selectedGrade) return true;
      const cls = allClasses.find(c => c.id === e.targetClass);
      return cls?.academicLevelId === selectedGrade;
    });
  }, [allExams, selectedGrade, allClasses]);

  // Translations
  const dict = {
    en: {
      lessonsTitle: "Lesson Access Controls",
      examsTitle: "Exam Windows",
      classesTitle: "Section Activation",
      colTitle: "Item Name",
      colRelease: "Release Mode",
      colVisibility: "Public Visibility",
      activeNow: "Active",
      draft: "Draft",
      scheduled: "Scheduled",
      scheduleBtn: "Change Schedule",
      saveBtn: "Apply Controls",
      toggleActive: "Publish immediately",
      toggleDraft: "Hide from students"
    },
    ar: {
      lessonsTitle: "تفعيل وجدولة الدروس",
      examsTitle: "فترات تفعيل الامتحانات",
      classesTitle: "تفعيل السكاشن الفصول",
      colTitle: "اسم العنصر الأكاديمي",
      colRelease: "طريقة الجدولة والإطلاق",
      colVisibility: "الظهور للطلاب",
      activeNow: "نشط",
      draft: "مسودة",
      scheduled: "مجدول",
      scheduleBtn: "تعديل الموعد",
      saveBtn: "تطبيق التغييرات",
      toggleActive: "نشر فوراً",
      toggleDraft: "إخفاء عن الطلاب"
    }
  };

  const t = dict[currentLanguage];

  const handleLessonToggle = (lessonId: string, currentStatus: string) => {
    const lesson = allLessons.find(l => l.id === lessonId);
    if (lesson) {
      const newStatus = currentStatus === 'published' ? 'draft' : 'published';
      updateLesson({ ...lesson, status: newStatus });
    }
  };

  const handleExamToggle = (examId: string, currentStatus: string) => {
    const exam = allExams.find(e => e.id === examId);
    if (exam) {
      const newStatus = currentStatus === 'active' ? 'scheduled' : 'active';
      // If it's being toggled to scheduled but has no date, default to tomorrow
      let date = exam.activationDate;
      if (newStatus === 'scheduled' && !date) {
        const tmrw = new Date();
        tmrw.setDate(tmrw.getDate() + 1);
        date = tmrw.toISOString();
      }
      updateExam({ ...exam, status: newStatus, activationDate: date });
    }
  };

  const handleClassToggle = (classId: string, currentStatus: string) => {
    const cls = allClasses.find(c => c.id === classId);
    if (cls) {
      const newStatus = currentStatus === 'active' ? 'scheduled' : 'active';
      let date = cls.activationDate;
      if (newStatus === 'scheduled' && !date) {
        const tmrw = new Date();
        tmrw.setDate(tmrw.getDate() + 1);
        date = tmrw.toISOString();
      }
      updateClass({ ...cls, status: newStatus, activationDate: date });
    }
  };

  const openScheduleModal = (type: 'lesson'|'exam'|'class', item: any) => {
    setScheduleTarget({
      type,
      id: item.id,
      title: item.title,
      currentDate: item.activationDate || ''
    });
    if (item.activationDate) {
      const d = new Date(item.activationDate);
      setScheduleDate(d.toISOString().split('T')[0]);
      setScheduleTime(d.toISOString().substring(11,16));
    } else {
      setScheduleDate('');
      setScheduleTime('');
    }
    setScheduleModalOpen(true);
  };

  const handleSaveSchedule = () => {
    if (!scheduleTarget || !scheduleDate) return;
    const newDate = scheduleTime ? `${scheduleDate}T${scheduleTime}:00Z` : `${scheduleDate}T00:00:00Z`;
    
    if (scheduleTarget.type === 'lesson') {
      const lesson = allLessons.find(l => l.id === scheduleTarget.id);
      if (lesson) {
        updateLesson({ ...lesson, status: 'scheduled', activationDate: newDate });
      }
    } else if (scheduleTarget.type === 'exam') {
      const exam = allExams.find(e => e.id === scheduleTarget.id);
      if (exam) {
        updateExam({ ...exam, status: 'scheduled', activationDate: newDate });
      }
    } else if (scheduleTarget.type === 'class') {
      const cls = allClasses.find(c => c.id === scheduleTarget.id);
      if (cls) {
        updateClass({ ...cls, status: 'scheduled', activationDate: newDate });
      }
    }
    setScheduleModalOpen(false);
  };

  return (
    <div className={`space-y-6 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-indigo-900 mb-2">
          {currentLanguage === 'en' ? 'Content Activation UX Showcase' : 'عرض تجربة المستخدم لتفعيل المحتوى'}
        </h2>
        <p className="text-sm text-indigo-700/80 max-w-3xl leading-relaxed">
          {currentLanguage === 'en' ? 'Great UX for activating content involves clear visual status indicators (colors and icons), immediate toggle actions to publish/unpublish without reloading, and scheduling abilities. It should feel instantaneous and secure.' : 'تجربة المستخدم الجيدة لتفعيل المحتوى تتضمن مؤشرات بصرية واضحة للحالة (ألوان وأيقونات)، وإجراءات تبديل فورية للنشر/الإلغاء دون إعادة تحميل، وقدرات جدولة. يجب أن تبدو فورية وآمنة.'}
        </p>
      </div>

      {/* Sub tabs switcher */}
      <div className="flex gap-4 border-b border-slate-200 pb-3">
        <button 
          onClick={() => setSubTab('lessons')}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold rounded-xl transition-all ${
            subTab === 'lessons' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 scale-105' : 'text-slate-600 hover:bg-slate-100 hover:scale-105'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>{currentLanguage === 'en' ? 'Lessons Activation' : 'تفعيل الدروس'}</span>
        </button>
        
        <button 
          onClick={() => setSubTab('exams')}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold rounded-xl transition-all ${
            subTab === 'exams' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 scale-105' : 'text-slate-600 hover:bg-slate-100 hover:scale-105'
          }`}
        >
          <FileSpreadsheet className="h-4 w-4" />
          <span>{currentLanguage === 'en' ? 'Exams Activation' : 'تفعيل الامتحانات'}</span>
        </button>

        <button 
          onClick={() => setSubTab('classes')}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold rounded-xl transition-all ${
            subTab === 'classes' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 scale-105' : 'text-slate-600 hover:bg-slate-100 hover:scale-105'
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>{currentLanguage === 'en' ? 'Sections Activation' : 'تفعيل السكاشن'}</span>
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden p-6 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <h3 className="font-extrabold text-slate-900 text-base">
            {subTab === 'lessons' && t.lessonsTitle}
            {subTab === 'exams' && t.examsTitle}
            {subTab === 'classes' && t.classesTitle}
          </h3>
          <div className="flex items-center gap-4">
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="text-sm font-semibold border border-slate-200 rounded-xl px-4 py-2 bg-slate-50 text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="all">{currentLanguage === 'ar' ? 'جميع الصفوف' : 'All Grades'}</option>
              {academicLevels.map(level => (
                <option key={level.id} value={level.id}>{level.name}</option>
              ))}
            </select>
            <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md hidden sm:flex">
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              <span>{currentLanguage === 'en' ? 'Real-time Sync' : 'مزامنة فورية'}</span>
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {subTab === 'lessons' && lessons.map(lesson => {
            const isPublished = lesson.status === 'published';
            const isScheduled = lesson.status === 'scheduled';
            return (
            <div key={lesson.id} className={`group flex flex-col sm:flex-row sm:items-center justify-between p-5 border rounded-2xl gap-4 transition-all duration-300 ${isPublished ? 'bg-emerald-50/30 border-emerald-100' : isScheduled ? 'bg-amber-50/30 border-amber-100' : 'bg-slate-50 border-slate-200/60'}`}>
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-800 text-sm">{lesson.title}</h4>
                  {isPublished ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                      <CheckCircle2 className="w-3 h-3" /> {t.activeNow}
                    </span>
                  ) : isScheduled ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                      <Calendar className="w-3 h-3" /> {t.scheduled}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-600">
                      <XCircle className="w-3 h-3" /> {t.draft}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  {currentLanguage === 'en' ? 'Target: Grade 12 - Group A' : 'المستهدف: الصف الثالث الثانوي - مجموعة أ'}
                </p>
                {isScheduled && lesson.activationDate && (
                  <p className="text-[10px] font-bold text-amber-600 flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" />
                    {currentLanguage === 'en' ? 'Will activate on: ' : 'سيتم التفعيل في: '}
                    {new Date(lesson.activationDate).toLocaleDateString()} {new Date(lesson.activationDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                )}
              </div>
              
              <div className="flex items-center gap-6">
                <div className="flex flex-col sm:items-end items-start gap-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={isPublished}
                      onChange={() => handleLessonToggle(lesson.id, lesson.status)}
                    />
                    <div className="relative w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 shadow-inner rtl:peer-checked:after:-translate-x-full"></div>
                    <span className="ms-3 text-xs font-bold text-slate-600">
                      {isPublished ? t.toggleDraft : t.toggleActive}
                    </span>
                  </label>
                  
                  <button onClick={() => openScheduleModal('lesson', lesson)} className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors">
                    <Clock className="w-3 h-3" />
                    {t.scheduleBtn}
                  </button>
                </div>
              </div>
            </div>
          )})}

          {subTab === 'exams' && exams.map(exam => {
            const isActive = exam.status === 'active';
            const isScheduled = exam.status === 'scheduled';
            return (
            <div key={exam.id} className={`group flex flex-col sm:flex-row sm:items-center justify-between p-5 border rounded-2xl gap-4 transition-all duration-300 ${isActive ? 'bg-indigo-50/30 border-indigo-100' : 'bg-amber-50/30 border-amber-100'}`}>
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-800 text-sm">{exam.title}</h4>
                  {isActive ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                      <Zap className="w-3 h-3" /> {t.activeNow}
                    </span>
                  ) : isScheduled ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                      <Calendar className="w-3 h-3" /> {t.scheduled}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-600">
                      <XCircle className="w-3 h-3" /> {t.draft}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  {currentLanguage === 'en' ? `Timer: ${exam.duration} mins` : `المدة: ${exam.duration} دقيقة`}
                </p>
                {isScheduled && exam.activationDate && (
                  <p className="text-[10px] font-bold text-amber-600 flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" />
                    {currentLanguage === 'en' ? 'Will activate on: ' : 'سيتم التفعيل في: '}
                    {new Date(exam.activationDate).toLocaleDateString()} {new Date(exam.activationDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-6">
                <div className="flex flex-col sm:items-end items-start gap-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={isActive}
                      onChange={() => handleExamToggle(exam.id, exam.status)}
                    />
                    <div className="relative w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500 shadow-inner rtl:peer-checked:after:-translate-x-full"></div>
                    <span className="ms-3 text-xs font-bold text-slate-600">
                      {isActive ? t.toggleDraft : t.toggleActive}
                    </span>
                  </label>
                  
                  <button onClick={() => openScheduleModal('exam', exam)} className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors">
                    <Clock className="w-3 h-3" />
                    {t.scheduleBtn}
                  </button>
                </div>
              </div>
            </div>
          )})}

          {subTab === 'classes' && classes.map(cls => {
            const isActive = cls.status === 'active';
            const isScheduled = cls.status === 'scheduled';
            return (
            <div key={cls.id} className={`group flex flex-col sm:flex-row sm:items-center justify-between p-5 border rounded-2xl gap-4 transition-all duration-300 ${isActive ? 'bg-emerald-50/30 border-emerald-100' : isScheduled ? 'bg-amber-50/30 border-amber-100' : 'bg-slate-50 border-slate-200/60'}`}>
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-800 text-sm">{cls.name}</h4>
                  {isActive ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                      <CheckCircle2 className="w-3 h-3" /> {t.activeNow}
                    </span>
                  ) : isScheduled ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                      <Calendar className="w-3 h-3" /> {t.scheduled}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-600">
                      <XCircle className="w-3 h-3" /> {t.draft}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  {cls.description}
                </p>
                {isScheduled && cls.activationDate && (
                  <p className="text-[10px] font-bold text-amber-600 flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" />
                    {currentLanguage === 'en' ? 'Will activate on: ' : 'سيتم التفعيل في: '}
                    {new Date(cls.activationDate).toLocaleDateString()} {new Date(cls.activationDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-6">
                <div className="flex flex-col sm:items-end items-start gap-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={isActive}
                      onChange={() => handleClassToggle(cls.id, cls.status)}
                    />
                    <div className="relative w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 shadow-inner rtl:peer-checked:after:-translate-x-full"></div>
                    <span className="ms-3 text-xs font-bold text-slate-600">
                      {isActive ? t.toggleDraft : t.toggleActive}
                    </span>
                  </label>
                  
                  <button onClick={() => openScheduleModal('class', cls)} className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors">
                    <Clock className="w-3 h-3" />
                    {t.scheduleBtn}
                  </button>
                </div>
              </div>
            </div>
          )})}
        </div>
      </div>

      {/* Scheduling Modal Overlay */}
      {scheduleModalOpen && scheduleTarget && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-indigo-50/50">
              <h3 className="font-extrabold text-indigo-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                {currentLanguage === 'en' ? 'Schedule Publishing' : 'جدولة النشر'}
              </h3>
              <button onClick={() => setScheduleModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <p className="text-xs text-slate-500 font-bold mb-1 uppercase tracking-wide">
                  {currentLanguage === 'en' ? 'Target Content' : 'المحتوى المستهدف'}
                </p>
                <p className="text-sm font-bold text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-100 truncate">
                  {scheduleTarget.title}
                </p>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-1 space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">
                    {currentLanguage === 'en' ? 'Date' : 'التاريخ'}
                  </label>
                  <input 
                    type="date" 
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                  />
                </div>
                <div className="flex-1 space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">
                    {currentLanguage === 'en' ? 'Time' : 'الوقت'}
                  </label>
                  <input 
                    type="time" 
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button 
                onClick={() => setScheduleModalOpen(false)}
                className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-xl transition-colors"
              >
                {currentLanguage === 'en' ? 'Cancel' : 'إلغاء'}
              </button>
              <button 
                onClick={handleSaveSchedule}
                disabled={!scheduleDate}
                className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-md shadow-indigo-200 transition-colors flex items-center gap-2"
              >
                <Clock className="w-4 h-4" />
                {currentLanguage === 'en' ? 'Save Schedule' : 'حفظ الموعد'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
