import React, { useState, useMemo } from 'react';
import { useAppState } from '../../../shared/context/AppState';
import { 
  CheckSquare, 
  Search, 
    CheckCircle2,
  Clock,
  ChevronRight,
  Inbox
} from 'lucide-react';
import ExamSubmissionViewer from '../students/ExamSubmissionViewer';

export default function GradingManager() {
  const { currentLanguage, submissions, exams } = useAppState();
  const isAr = currentLanguage === 'ar';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'submitted' | 'graded'>('all');
  const [viewingSubmissionId, setViewingSubmissionId] = useState<string | null>(null);

  const t = {
    title: isAr ? 'التصحيح والمراجعة' : 'Grading & Review',
    subtitle: isAr ? 'مراجعة إجابات الطلاب وتقييمها' : 'Review and grade student submissions',
    search: isAr ? 'ابحث عن طالب أو امتحان...' : 'Search student or exam...',
    all: isAr ? 'الكل' : 'All',
    pending: isAr ? 'قيد المراجعة' : 'Pending',
    graded: isAr ? 'تم التصحيح' : 'Graded',
    student: isAr ? 'الطالب' : 'Student',
    exam: isAr ? 'الامتحان' : 'Exam',
    date: isAr ? 'التاريخ' : 'Date',
    score: isAr ? 'الدرجة' : 'Score',
    status: isAr ? 'الحالة' : 'Status',
    action: isAr ? 'الإجراء' : 'Action',
    reviewBtn: isAr ? 'مراجعة' : 'Review',
    viewBtn: isAr ? 'عرض' : 'View',
    noData: isAr ? 'لا توجد إجابات للمراجعة حالياً' : 'No submissions to review at the moment.'
  };

  const filteredSubmissions = useMemo(() => {
    return submissions.filter(sub => {
      const matchesStatus = filterStatus === 'all' || sub.status === filterStatus;
      const exam = exams.find(e => e.id === sub.examId);
      const searchStr = searchQuery.toLowerCase();
      const matchesSearch = 
        sub.studentName.toLowerCase().includes(searchStr) ||
        (exam && exam.title.toLowerCase().includes(searchStr));
      return matchesStatus && matchesSearch;
    }).sort((a, b) => {
      // Sort pending first, then by date
      if (a.status === 'submitted' && b.status === 'graded') return -1;
      if (a.status === 'graded' && b.status === 'submitted') return 1;
      return (b.submittedAt || '').localeCompare(a.submittedAt || '');
    });
  }, [submissions, exams, filterStatus, searchQuery]);

  if (viewingSubmissionId) {
    const sub = submissions.find(s => s.id === viewingSubmissionId);
    const exam = exams.find(e => e.id === sub?.examId);
    if (sub && exam) {
      return (
        <div className="animate-fade-in" dir={isAr ? 'rtl' : 'ltr'}>
          <div className="mb-6">
            <h1 className="text-2xl font-black text-slate-900">{t.title}</h1>
            <p className="text-sm font-semibold text-slate-500">{t.subtitle}</p>
          </div>
          <ExamSubmissionViewer exam={exam} submission={sub} onBack={() => setViewingSubmissionId(null)} />
        </div>
      );
    }
  }

  return (
    <div className="space-y-6 animate-fade-in" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3">
            <div className="bg-indigo-600 text-white p-2 rounded-xl shadow-md shadow-indigo-200">
              <CheckSquare className="h-6 w-6" />
            </div>
            {t.title}
          </h1>
          <p className="text-sm font-semibold text-slate-500 mt-1">{t.subtitle}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        {/* Filters */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50">
          <div className="relative w-full sm:max-w-md">
            <Search className={`absolute ${isAr ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400`} />
            <input
              type="text"
              placeholder={t.search}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className={`w-full ${isAr ? 'pr-9 pl-4' : 'pl-9 pr-4'} py-2 text-sm font-semibold bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all`}
            />
          </div>
          <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200/60 self-start sm:self-auto w-full sm:w-auto">
            {(['all', 'submitted', 'graded'] as const).map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filterStatus === status 
                    ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200/50' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                }`}
              >
                {status === 'all' ? t.all : status === 'submitted' ? t.pending : t.graded}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="overflow-x-auto">
          {filteredSubmissions.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-3">
              <Inbox className="h-12 w-12 mx-auto opacity-20" />
              <p className="font-semibold">{t.noData}</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <th className={`py-4 ${isAr ? 'pr-6 text-right' : 'pl-6 text-left'}`}>{t.student}</th>
                  <th className={`py-4 ${isAr ? 'text-right' : 'text-left'}`}>{t.exam}</th>
                  <th className={`py-4 ${isAr ? 'text-right' : 'text-left'}`}>{t.date}</th>
                  <th className={`py-4 ${isAr ? 'text-right' : 'text-left'}`}>{t.status}</th>
                  <th className={`py-4 ${isAr ? 'text-right' : 'text-left'}`}>{t.score}</th>
                  <th className={`py-4 ${isAr ? 'pl-6 text-left' : 'pr-6 text-right'}`}>{t.action}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSubmissions.map(sub => {
                  const exam = exams.find(e => e.id === sub.examId);
                  const isPending = sub.status === 'submitted';
                  const dateStr = sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';
                  
                  return (
                    <tr key={sub.id} className="hover:bg-slate-50 transition-colors group">
                      <td className={`py-4 ${isAr ? 'pr-6 text-right' : 'pl-6 text-left'}`}>
                        <div className="font-bold text-slate-900 text-sm">{sub.studentName}</div>
                      </td>
                      <td className={`py-4 ${isAr ? 'text-right' : 'text-left'}`}>
                        <div className="font-semibold text-slate-700 text-xs max-w-[200px] truncate" title={exam?.title}>
                          {exam?.title ?? 'Unknown Exam'}
                        </div>
                      </td>
                      <td className={`py-4 ${isAr ? 'text-right' : 'text-left'}`}>
                        <div className="text-xs font-semibold text-slate-500">{dateStr}</div>
                      </td>
                      <td className={`py-4 ${isAr ? 'text-right' : 'text-left'}`}>
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold ${
                          isPending ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {isPending ? <Clock className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
                          {isPending ? t.pending : t.graded}
                        </div>
                      </td>
                      <td className={`py-4 ${isAr ? 'text-right' : 'text-left'}`}>
                        <div className="font-bold text-slate-900 text-sm">
                          {sub.score !== undefined ? sub.score : '—'}
                        </div>
                      </td>
                      <td className={`py-4 ${isAr ? 'pl-6 text-left' : 'pr-6 text-right'}`}>
                        <button
                          onClick={() => setViewingSubmissionId(sub.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            isPending 
                              ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200' 
                              : 'bg-white text-indigo-600 border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50 shadow-sm'
                          }`}
                        >
                          {isPending ? t.reviewBtn : t.viewBtn}
                          <ChevronRight className={`h-3 w-3 ${isAr ? 'rotate-180' : ''}`} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
