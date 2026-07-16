import React from 'react';
import { useAppState } from '../../../shared/context/AppState';
import { 
  Users, 
  BookOpen, 
  FileSpreadsheet, 
  DollarSign, 
  Bell, 
  Calendar as CalendarIcon, 
  ArrowRight, 
  Plus,
  ShieldAlert
} from 'lucide-react';

interface DashboardHomeProps {
  onNavigate: (tab: string) => void;
}

export default function DashboardHome({ onNavigate }: DashboardHomeProps) {
  const { currentLanguage, students, lessons, exams, submissions, events, classes } = useAppState();

  const dict = {
    en: {
      title: "Dashboard Overview",
      stats: {
        students: "Total Students",
        lessons: "Total Lessons",
        chapters: "Total Chapters",
        exams: "Total Exams",
        revenue: "Monthly Revenue",
        pendingAlert: "pending activation"
      },
      hoverStats: {
        students: { active: "Active", inactive: "Inactive", pending: "Requests" },
        lessons: { published: "Published", editing: "Editing", scheduled: "Scheduled" },
        chapters: { active: "Active", editing: "Draft", scheduled: "Scheduled" },
        exams: { active: "Active", completed: "Completed", scheduled: "Scheduled" },
        finance: { revenue: "Revenue", expenses: "Expenses" }
      },
      notifications: "Urgent Actions Needed",
      noNotifications: "No urgent actions. All caught up!",
      todaySchedule: "Today's Schedule & Events",
      viewAll: "View All",
      eventTypes: {
        lesson: "Lesson release",
        exam: "Exam window open",
        announcement: "Announcement published"
      },
      alerts: {
        payment: "Awaiting payment verification for",
        grading: "Essay response grading required for"
      },
      egp: "EGP",
      noEvents: "No events scheduled for today."
    },
    ar: {
      title: "لوحة التحكم الرئيسية",
      stats: {
        students: "إجمالي الطلاب",
        lessons: "إجمالي الدروس",
        chapters: "إجمالي الفصول",
        exams: "إجمالي الامتحانات",
        revenue: "الملخص المالي",
        pendingAlert: "بانتظار التفعيل"
      },
      hoverStats: {
        students: { active: "الطلاب المفعلين", inactive: "الطلاب غير المفعلين", pending: "طلبات التفعيل" },
        lessons: { published: "درس منشور", editing: "درس تحت التعديل", scheduled: "درس مجدول" },
        chapters: { active: "فصل مفعل", editing: "فصل تحت التعديل", scheduled: "فصل مجدول" },
        exams: { active: "امتحان نشط", completed: "امتحان مكتمل", scheduled: "امتحان مجدول" },
        finance: { revenue: "إيرادات", expenses: "مصروفات" }
      },
      notifications: "إجراءات عاجلة مطلوبة",
      noNotifications: "لا توجد تنبيهات عاجلة حالياً.",
      todaySchedule: "جدول حصص وأنشطة اليوم",
      viewAll: "عرض الكل",
      eventTypes: {
        lesson: "إطلاق درس جديد",
        exam: "فترة اختبار نشط",
        announcement: "إعلان عام للطلاب"
      },
      alerts: {
        payment: "بانتظار تأكيد إيصال دفع الطالب:",
        grading: "يتطلب تقييم وتصحيح سؤال مقالي للطالب:"
      },
      egp: "ج.م",
      noEvents: "لا توجد حصص أو امتحانات مجدولة لليوم."
    }
  };

  const t = dict[currentLanguage];

  // Derived counts
  const activeStudents = students.filter(s => s.status === 'active').length;
  const pendingStudents = students.filter(s => s.status === 'pending').length;
  const inactiveStudents = students.length - activeStudents - pendingStudents;

  const publishedLessons = lessons.filter(l => l.status === 'published').length;
  const editingLessons = lessons.filter(l => l.status === 'draft').length;
  const scheduledLessons = lessons.filter(l => l.status === 'scheduled').length;

  const activeExams = exams.filter(e => e.status === 'active').length;
  const completedExams = exams.filter(e => e.status === 'completed').length;
  const scheduledExams = exams.filter(e => e.status === 'scheduled').length;

  const activeChapters = classes.filter(c => c.status === 'active').length;
  const editingChapters = classes.filter(c => c.status === 'draft').length;
  const scheduledChapters = classes.filter(c => c.status === 'scheduled').length;
  
  // Calculate total monthly revenue based on active students
  const teacherMonthlyFee = 150; // default EGP
  const monthlyRevenue = activeStudents * teacherMonthlyFee;
  const estimatedExpenses = Math.round(monthlyRevenue * 0.1); // Placeholder 10%

  // Build dynamic notifications
  const notifications: { id: string; type: 'payment' | 'grading'; text: string; dataId: string; tab: string }[] = [];
  
  students.forEach(s => {
    if (s.status === 'pending') {
      notifications.push({
        id: `notif-p-${s.id}`,
        type: 'payment',
        text: `${t.alerts.payment} ${s.name} (${s.paymentAmount} ${t.egp})`,
        dataId: s.id,
        tab: 'students'
      });
    }
  });

  submissions.forEach(sub => {
    if (sub.status === 'submitted') {
      notifications.push({
        id: `notif-g-${sub.id}`,
        type: 'grading',
        text: `${t.alerts.grading} ${sub.studentName}`,
        dataId: sub.id,
        tab: 'exams'
      });
    }
  });

  // Get calendar events for "today" (simulated as 2026-06-30 to match date contexts)
  const todayStr = new Date().toISOString().split('T')[0];
  const todayEvents = events.filter(e => e.date === todayStr);

  return (
    <div className="space-y-8">
      {/* Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-black text-slate-900">{t.title}</h1>
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          <button onClick={() => onNavigate('content')} className="whitespace-nowrap px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors">
            <Plus className="h-4 w-4" />
            <span>{currentLanguage === 'en' ? 'New Lesson' : 'درس جديد'}</span>
          </button>
          <button onClick={() => onNavigate('exams')} className="whitespace-nowrap px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors">
            <Plus className="h-4 w-4" />
            <span>{currentLanguage === 'en' ? 'New Exam' : 'اختبار جديد'}</span>
          </button>

        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard 
          title={t.stats.students} 
          value={students.length} 
          colorClass="bg-indigo-50 text-indigo-600" 
          icon={Users} 
          extraNode={pendingStudents > 0 && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full mt-1">
              {pendingStudents} {t.stats.pendingAlert}
            </span>
          )} 
          hoverStats={[
            { label: t.hoverStats.students.active, value: activeStudents, colorClass: 'text-emerald-600' },
            { label: t.hoverStats.students.inactive, value: inactiveStudents, colorClass: 'text-slate-500' },
            { label: t.hoverStats.students.pending, value: pendingStudents, colorClass: 'text-amber-500' }
          ]}
        />
        <StatCard 
          title={t.stats.chapters} 
          value={classes.length} 
          colorClass="bg-sky-50 text-sky-600" 
          icon={BookOpen} 
          hoverStats={[
            { label: t.hoverStats.chapters.active, value: activeChapters, colorClass: 'text-emerald-600' },
            { label: t.hoverStats.chapters.editing, value: editingChapters, colorClass: 'text-amber-500' },
            { label: t.hoverStats.chapters.scheduled, value: scheduledChapters, colorClass: 'text-sky-600' }
          ]}
        />
        <StatCard 
          title={t.stats.lessons} 
          value={lessons.length} 
          colorClass="bg-blue-50 text-blue-600" 
          icon={BookOpen} 
          hoverStats={[
            { label: t.hoverStats.lessons.published, value: publishedLessons, colorClass: 'text-emerald-600' },
            { label: t.hoverStats.lessons.editing, value: editingLessons, colorClass: 'text-amber-500' },
            { label: t.hoverStats.lessons.scheduled, value: scheduledLessons, colorClass: 'text-blue-600' }
          ]}
          emptyStateAction={
            lessons.length === 0 && (
            <button onClick={() => onNavigate('content')} className="text-[10px] bg-blue-100 text-blue-700 hover:bg-blue-200 px-2.5 py-1 rounded-md font-bold transition-colors">
              {currentLanguage === 'en' ? 'Create first lesson →' : 'إنشاء الدرس الأول ←'}
            </button>
            )
          }
        />
        <StatCard 
          title={t.stats.exams} 
          value={exams.length} 
          colorClass="bg-emerald-50 text-emerald-600" 
          icon={FileSpreadsheet} 
          hoverStats={[
            { label: t.hoverStats.exams.active, value: activeExams, colorClass: 'text-emerald-600' },
            { label: t.hoverStats.exams.completed, value: completedExams, colorClass: 'text-slate-500' },
            { label: t.hoverStats.exams.scheduled, value: scheduledExams, colorClass: 'text-amber-500' }
          ]}
          emptyStateAction={
            exams.length === 0 && (
            <button onClick={() => onNavigate('exams')} className="text-[10px] bg-emerald-100 text-emerald-700 hover:bg-emerald-200 px-2.5 py-1 rounded-md font-bold transition-colors">
              {currentLanguage === 'en' ? 'Create first exam →' : 'إنشاء أول اختبار ←'}
            </button>
            )
          }
        />
        <StatCard 
          title={t.stats.revenue} 
          value={`${monthlyRevenue - estimatedExpenses} ${t.egp}`} 
          colorClass="bg-purple-50 text-purple-600" 
          icon={DollarSign} 
          hoverStats={[
            { label: t.hoverStats.finance.revenue, value: `${monthlyRevenue} ${t.egp}`, colorClass: 'text-emerald-600' },
            { label: t.hoverStats.finance.expenses, value: `${estimatedExpenses} ${t.egp}`, colorClass: 'text-rose-500' }
          ]}
        />
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Notifications list */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
              <Bell className="h-5 w-5 text-indigo-600" />
              <span>{t.notifications}</span>
            </h3>
            {notifications.length > 0 && (
              <span className="h-5 w-5 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                {notifications.length}
              </span>
            )}
          </div>

          <div className="space-y-3">
            {notifications.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-6 font-medium">{t.noNotifications}</p>
            ) : (
              notifications.map(notif => (
                <div 
                  key={notif.id}
                  onClick={() => onNavigate(notif.tab)}
                  className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 flex items-center justify-between hover:bg-slate-100/50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${notif.type === 'payment' ? 'bg-amber-50 text-amber-600' : 'bg-indigo-50 text-indigo-600'}`}>
                      <ShieldAlert className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-semibold text-slate-800 leading-snug">{notif.text}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400 flex-shrink-0" />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Schedule grid */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-indigo-600" />
              <span>{t.todaySchedule}</span>
            </h3>
            <button 
              onClick={() => onNavigate('calendar')} 
              className="text-xs font-bold text-indigo-600 hover:underline"
            >
              {t.viewAll}
            </button>
          </div>

          <div className="space-y-4">
            {todayEvents.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-6 font-medium">{t.noEvents}</p>
            ) : (
              todayEvents.map(event => (
                <div key={event.id} className="flex gap-4">
                  {/* Color bar indicator */}
                  <div className={`w-1.5 rounded-full flex-shrink-0 ${
                    event.type === 'lesson' ? 'bg-blue-500' : event.type === 'exam' ? 'bg-emerald-500' : 'bg-purple-500'
                  }`} />
                  
                  <div className="space-y-1 py-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {event.type === 'lesson' && t.eventTypes.lesson}
                      {event.type === 'exam' && t.eventTypes.exam}
                      {event.type === 'announcement' && t.eventTypes.announcement}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">{event.title}</h4>
                    {event.details && <p className="text-xs text-slate-500">{event.details}</p>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, colorClass, icon: Icon, extraNode, emptyStateAction, hoverStats }: any) {
  return (
    <div className="group relative bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
      <div className="space-y-1.5">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</span>
        <p className="text-2xl font-black text-slate-900 leading-none">{value}</p>
        {extraNode}
        {emptyStateAction && <div className="pt-1.5">{emptyStateAction}</div>}
      </div>
      <div className={`p-3 rounded-xl flex-shrink-0 ${colorClass}`}>
        <Icon className="h-6 w-6" />
      </div>

      {/* Hover Dropdown */}
      {hoverStats && hoverStats.length > 0 && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white border border-slate-100 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 translate-y-2 group-hover:translate-y-0 p-3 space-y-2">
          {hoverStats.map((stat: any, idx: number) => (
            <div key={idx} className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">{stat.label}</span>
              <span className={`text-xs font-black ${stat.colorClass}`}>{stat.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
