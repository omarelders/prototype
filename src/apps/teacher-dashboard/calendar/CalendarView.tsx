import React, { useState } from 'react';
import { useAppState } from '../../../shared/context/AppState';
import { CalendarEvent } from '../../../shared/types';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';

export default function CalendarView() {
  const { currentLanguage, events, addEvent } = useAppState();

  const dict = {
    en: {
      scheduleTitle: "Daily Schedule",
      emptyDaysMsg: "Select a day on the monthly grid to manage scheduled events.",
      noEventsMsg: "No items scheduled for this day.",
      lessonsTag: "Lessons",
      examsTag: "Exams",
      announceTag: "Announce",
      modalTitle: "Add Calendar Activity",
      labelTitle: "Activity Title",
      labelType: "Activity Type",
      labelDetails: "Description Details",
      placeholderTitle: "e.g. Electric Resistance Revision",
      placeholderDetails: "Include link references or study guidelines...",
      optLesson: "Lesson Launch (🎥 Blue)",
      optExam: "Exam Window Open (🧪 Green)",
      optAnnounce: "Announcement (📢 Purple)",
      submitBtn: "Confirm and Schedule"
    },
    ar: {
      scheduleTitle: "مواعيد وفعاليات اليوم",
      emptyDaysMsg: "اختر يوماً من جدول التقويم الشهري لإدارة وعرض الفعاليات المجدولة.",
      noEventsMsg: "لا توجد فعاليات أو حصص مجدولة لهذا اليوم.",
      lessonsTag: "الدروس والشروحات",
      examsTag: "الامتحانات والنتائج",
      announceTag: "التنبيهات والإعلانات",
      modalTitle: "إضافة نشاط للجدول الدراسي",
      labelTitle: "عنوان الفعالية / النشاط",
      labelType: "نوع النشاط",
      labelDetails: "تفاصيل النشاط",
      placeholderTitle: "مثال: مراجعة الدوائر والمقاومات الكهربائية",
      placeholderDetails: "أدخل هنا تفاصيل أو تعليمات المذاكرة للطلاب...",
      optLesson: "إطلاق درس جديد (🎥 أزرق)",
      optExam: "بدء فترة اختبار (🧪 أخضر)",
      optAnnounce: "تنبيه هام للطلاب (📢 بنفسجي)",
      submitBtn: "تأكيد وجدولة النشاط"
    }
  };

  const t = dict[currentLanguage];
  
  // Base state centered in June 2026 to align with other pre-seeded mocks
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(5); // June (0-indexed)

  const [selectedDayEvents, setSelectedDayEvents] = useState<CalendarEvent[]>([]);
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);

  // Event modal creation state
  const [showEventModal, setShowEventModal] = useState(false);
  const [eTitle, setETitle] = useState('');
  const [eType, setEType] = useState<'lesson' | 'exam' | 'announcement'>('lesson');
  const [eDetails, setEDetails] = useState('');

  const months = currentLanguage === 'en' 
    ? ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    : ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

  const daysOfWeek = currentLanguage === 'en'
    ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    : ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

  // Helper date lists
  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayIndex = getFirstDayOfMonth(currentYear, currentMonth);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDayEvents([]);
    setSelectedDateStr(null);
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDayEvents([]);
    setSelectedDateStr(null);
  };

  const handleDayClick = (day: number) => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const dateStr = `${currentYear}-${pad(currentMonth + 1)}-${pad(day)}`;
    setSelectedDateStr(dateStr);

    const dayEvs = events.filter(e => e.date === dateStr);
    setSelectedDayEvents(dayEvs);
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eTitle || !selectedDateStr) return;

    const newEv: CalendarEvent = {
      id: `ev-${Date.now()}`,
      title: eTitle,
      type: eType,
      date: selectedDateStr,
      details: eDetails
    };

    addEvent(newEv);
    setSelectedDayEvents([...selectedDayEvents, newEv]);
    setShowEventModal(false);
    setETitle('');
    setEDetails('');
  };

  // Calendar cells render arrays
  const blanks = Array(firstDayIndex).fill(null);
  const dayNumbers = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const cells = [...blanks, ...dayNumbers];

  return (
    <div className="grid lg:grid-cols-12 gap-8 text-left">
      {/* Month Grid View */}
      <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <h3 className="font-extrabold text-slate-900 text-lg">
            {months[currentMonth]} {currentYear}
          </h3>

          <div className="flex items-center gap-3">
            <button onClick={prevMonth} className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button onClick={nextMonth} className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
          {daysOfWeek.map(d => <div key={d} className="py-1">{d}</div>)}
        </div>

        {/* Calendar Cells Grid */}
        <div className="grid grid-cols-7 gap-2">
          {cells.map((cell, idx) => {
            if (cell === null) {
              return <div key={`blank-${idx}`} className="h-20 bg-slate-50/50 rounded-xl" />;
            }

            const pad = (n: number) => n.toString().padStart(2, '0');
            const cellDateStr = `${currentYear}-${pad(currentMonth + 1)}-${pad(cell)}`;
            const cellEvents = events.filter(e => e.date === cellDateStr);

            const isSelected = selectedDateStr === cellDateStr;

            return (
              <button 
                key={`day-${cell}`}
                onClick={() => handleDayClick(cell)}
                className={`h-20 border rounded-xl p-2 flex flex-col justify-between cursor-pointer transition-all text-left ${
                  isSelected 
                    ? 'border-indigo-600 bg-indigo-50/20 shadow-sm ring-2 ring-indigo-500/10' 
                    : 'border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/20'
                }`}
                aria-label={currentLanguage === 'en' ? `Select date ${cellDateStr}` : `اختيار تاريخ ${cellDateStr}`}
              >
                <span className={`text-xs font-bold ${isSelected ? 'text-indigo-700' : 'text-slate-800'}`}>{cell}</span>
                
                {/* Event micro tags */}
                <div className="flex flex-wrap gap-1 overflow-hidden h-7" aria-hidden="true">
                  {cellEvents.map(ev => (
                    <div 
                      key={ev.id}
                      className={`h-2 w-2 rounded-full ${
                        ev.type === 'lesson' ? 'bg-blue-500' : ev.type === 'exam' ? 'bg-emerald-500' : 'bg-purple-500'
                      }`}
                      title={ev.title}
                    />
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day details & Add Event Popup */}
      <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[400px]">
        <div>
          <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">
                {t.scheduleTitle}
              </h3>
              {selectedDateStr && <span className="text-[10px] font-bold text-slate-400 block mt-0.5 font-mono">{selectedDateStr}</span>}
            </div>
            {selectedDateStr && (
              <button 
                onClick={() => setShowEventModal(true)}
                className="bg-indigo-50 text-indigo-600 border border-indigo-200/50 hover:bg-indigo-100 p-2 rounded-xl text-xs font-bold transition-colors"
                title="Create event"
              >
                <Plus className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
            {!selectedDateStr ? (
              <p className="text-xs text-slate-400 text-center py-12 font-semibold">{t.emptyDaysMsg}</p>
            ) : selectedDayEvents.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-12 font-semibold">{t.noEventsMsg}</p>
            ) : (
              selectedDayEvents.map(ev => (
                <div key={ev.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                      ev.type === 'lesson' ? 'bg-blue-50 text-blue-700' : ev.type === 'exam' ? 'bg-emerald-50 text-emerald-700' : 'bg-purple-50 text-purple-700'
                    }`}>
                      {ev.type === 'lesson' ? t.lessonsTag : ev.type === 'exam' ? t.examsTag : t.announceTag}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 leading-normal">{ev.title}</h4>
                  {ev.details && (
                    <p className="text-slate-500 font-medium leading-relaxed border-t border-slate-200/60 pt-1.5 mt-1.5">{ev.details}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4 mt-4 text-[10px] font-bold text-slate-400 flex flex-wrap gap-4">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-blue-500" aria-hidden="true" />
            <span>{t.lessonsTag}</span>
            <span aria-hidden="true">🎥</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" aria-hidden="true" />
            <span>{t.examsTag}</span>
            <span aria-hidden="true">🧪</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-purple-500" aria-hidden="true" />
            <span>{t.announceTag}</span>
            <span aria-hidden="true">📢</span>
          </div>
        </div>
      </div>

      {/* Modal Event creation */}
      {showEventModal && (
        <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateEvent} className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-sm w-full p-8 space-y-5 text-left">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900">{t.modalTitle}</h3>
              <button type="button" onClick={() => setShowEventModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">{t.labelTitle}</label>
              <input
                type="text"
                required
                value={eTitle}
                onChange={e => setETitle(e.target.value)}
                placeholder={t.placeholderTitle}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">{t.labelType}</label>
              <select
                value={eType}
                onChange={e => setEType(e.target.value as any)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white font-semibold"
              >
                <option value="lesson">{t.optLesson}</option>
                <option value="exam">{t.optExam}</option>
                <option value="announcement">{t.optAnnounce}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">{t.labelDetails}</label>
              <textarea
                rows={2}
                value={eDetails}
                onChange={e => setEDetails(e.target.value)}
                placeholder={t.placeholderDetails}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-100"
            >
              {t.submitBtn}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
