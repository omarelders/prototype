import React, { useState } from 'react';
import { useAppState } from '../../../shared/context/AppState';
import { Plus, Pencil, BarChart2, Trash2 } from 'lucide-react';
import ExamBuilder from './ExamBuilder';

export default function ExamsManager({ gradeId }: { gradeId: string }) {
  const { currentLanguage, exams, deleteExam, classes } = useAppState();
  const filteredExams = exams.filter(e => e.academicLevelId === gradeId);
  
  const [view, setView] = useState<'list' | 'builder'>('list');
  const [editingExamId, setEditingExamId] = useState<string | null>(null);
  const [initialBuilderTab, setInitialBuilderTab] = useState<'questions' | 'responses' | 'settings'>('questions');

  const t = {
    colTitle: currentLanguage === 'en' ? 'Exam Name' : 'اسم الاختبار',
    colClass: currentLanguage === 'en' ? 'Class' : 'المجموعة',
    colQuestions: currentLanguage === 'en' ? 'Questions' : 'عدد الأسئلة',
    colStatus: currentLanguage === 'en' ? 'Status' : 'الحالة',
    colActions: currentLanguage === 'en' ? 'Actions' : 'إجراءات',
    createBtn: currentLanguage === 'en' ? 'Create New Exam' : 'إنشاء امتحان جديد',
    active: currentLanguage === 'en' ? 'Active' : 'نشط حالياً',
    scheduled: currentLanguage === 'en' ? 'Scheduled' : 'مجدول للبدء',
    completed: currentLanguage === 'en' ? 'Completed' : 'مكتمل ومغلق',
    noExams: currentLanguage === 'en' ? 'No exams created yet. Click "Create New Exam" to get started.' : 'لم يتم إنشاء أي امتحانات بعد.',
    edit: currentLanguage === 'en' ? 'Edit' : 'تعديل',
    responses: currentLanguage === 'en' ? 'Responses' : 'الإجابات',
    delete: currentLanguage === 'en' ? 'Delete' : 'حذف',
  };

  const openBuilder = (examId: string | null = null, tab: 'questions' | 'responses' | 'settings' = 'questions') => {
    setEditingExamId(examId);
    setInitialBuilderTab(tab);
    setView('builder');
  };

  const getClassName = (classId: string) => {
    const cls = classes.find(c => c.id === classId);
    return cls ? cls.name : classId;
  };

  if (view === 'builder') {
    return (
      <ExamBuilder 
        examId={editingExamId} 
        onBack={() => setView('list')} 
        initialTab={initialBuilderTab}
        gradeId={gradeId}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-4 gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">
            {currentLanguage === 'en' ? 'Exams & Quizzes' : 'الامتحانات والاختبارات'}
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {filteredExams.length} exam{filteredExams.length !== 1 ? 's' : ''} in this grade
          </p>
        </div>
        <button 
          onClick={() => openBuilder()}
          className="bg-indigo-600 text-white px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-1.5 hover:bg-indigo-700 shadow-md transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>{t.createBtn}</span>
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden text-left">
        <table className="w-full text-sm text-slate-500">
          <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-left">{t.colTitle}</th>
              <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-left">{t.colClass}</th>
              <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-left">{t.colQuestions}</th>
              <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-left">{t.colStatus}</th>
              <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-left">{t.colActions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-semibold text-slate-600">
            {filteredExams.map(exam => (
              <tr key={exam.id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4 text-slate-900 font-bold max-w-xs truncate">
                  <button 
                    onClick={() => openBuilder(exam.id, 'questions')}
                    className="hover:text-indigo-700 transition-colors text-left"
                  >
                    {exam.title}
                  </button>
                </td>
                <td className="px-6 py-4 text-xs text-slate-500 max-w-[180px] truncate">
                  {getClassName(exam.targetClass)}
                </td>
                <td className="px-6 py-4">
                  <span className="font-bold text-slate-700">{exam.questionIds.length}</span>
                  <span className="text-slate-400 ml-1">Q</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${
                    exam.status === 'active' 
                      ? 'bg-emerald-50 text-emerald-700' 
                      : exam.status === 'scheduled' 
                        ? 'bg-amber-50 text-amber-700' 
                        : 'bg-slate-100 text-slate-600'
                  }`}>
                    {exam.status === 'active' && t.active}
                    {exam.status === 'scheduled' && t.scheduled}
                    {exam.status === 'completed' && t.completed}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => openBuilder(exam.id, 'questions')}
                      className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-bold text-xs px-2.5 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      {t.edit}
                    </button>
                    <button 
                      onClick={() => openBuilder(exam.id, 'responses')}
                      className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-bold text-xs px-2.5 py-1.5 rounded-lg hover:bg-emerald-50 transition-colors"
                    >
                      <BarChart2 className="h-3.5 w-3.5" />
                      {t.responses}
                    </button>
                    <button 
                      onClick={() => {
                        if (window.confirm(`Delete "${exam.title}"? This cannot be undone.`)) {
                          deleteExam(exam.id);
                        }
                      }}
                      className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-700 font-bold text-xs px-2.5 py-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      {t.delete}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredExams.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center">
                  <div className="text-4xl mb-3">📋</div>
                  <p className="font-bold text-slate-700 mb-1">No exams yet</p>
                  <p className="text-slate-400 text-sm">{t.noExams}</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
