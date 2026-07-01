import React, { useState } from 'react';
import { useAppState } from '../../../shared/context/AppState';
import { Exam, Question, ExamSubmission } from '../../../shared/types';
import MathRenderer from '../../../shared/components/MathRenderer';
import QuestionFormModal from '../../../shared/components/QuestionFormModal';
import AIGeneratorModal from '../../../shared/components/AIGeneratorModal';
import { 
  FileSpreadsheet, 
  Plus, 
  Settings as SettingsIcon, 
  Check, 
  Calendar, 
  Clock, 
  UserCheck, 
  FileCheck2, 
  Sparkles,
  ChevronRight,
  HelpCircle,
  X,
  CheckCircle2,
  Folder,
  ChevronDown
} from 'lucide-react';

export default function ExamsManager() {
  const { 
    currentLanguage, 
    exams, 
    addExam, 
    deleteExam, 
    questions, 
    addQuestion,
    folders,
    classes,
    submissions,
    updateSubmission
  } = useAppState();

  const [activeTab, setActiveTab] = useState<'exams' | 'results'>('exams');

  // Multi-step exam creation state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [examStep, setExamStep] = useState(1);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [qModalType, setQModalType] = useState<'mcq' | 'essay'>('mcq');
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);
  
  // Form values
  const [title, setTitle] = useState('');
  const [selectedQIds, setSelectedQIds] = useState<string[]>([]);
  const [duration, setDuration] = useState(30);
  const [attempts, setAttempts] = useState(1);
  const [targetClass, setTargetClass] = useState('c-1');
  const [targetGrade, setTargetGrade] = useState('Grade 1');
  const [activationDate, setActivationDate] = useState('2026-07-01T10:00');

  // Grading state details
  const [selectedSub, setSelectedSub] = useState<ExamSubmission | null>(null);
  const [gradingScores, setGradingScores] = useState<Record<string, number>>({});
  const [aiLoading, setAiLoading] = useState<string | null>(null); // questionId loading

  // Translations
  const dict = {
    en: {
      examsTab: "Exams List",
      resultsTab: "Grades & Results",
      createBtn: "Create New Exam",
      colTitle: "Exam Name",
      colClass: "Class Section",
      colDuration: "Duration",
      colStatus: "Status",
      colActions: "Actions",
      active: "Active",
      scheduled: "Scheduled",
      completed: "Completed",
      step1: "Details",
      step2: "Select Questions",
      step3: "Rules & Settings",
      step4: "Preview & Publish",
      next: "Continue",
      back: "Back",
      finish: "Publish Exam",
      durationLabel: "Duration Limit (Minutes)",
      attemptsLabel: "Attempts Allowed (1-5)",
      resultsTable: {
        student: "Student Name",
        score: "Score",
        status: "Grading Status",
        action: "Grade/Review"
      },
      gradingTitle: "Essay Correction Center",
      studentAns: "Student's Written Answer",
      modelAns: "Rubric Model Answer",
      aiCorrectBtn: "Auto-Correct with AI",
      aiSuccess: "AI feedback generated successfully!",
      submitGrades: "Submit Final Grades",
      graded: "Graded",
      submitted: "Ungraded Essay"
    },
    ar: {
      examsTab: "قائمة الامتحانات",
      resultsTab: "درجات ونتائج الطلاب",
      createBtn: "إنشاء امتحان جديد",
      colTitle: "اسم الاختبار",
      colClass: "المجموعة الدراسية",
      colDuration: "المدة الزمنية",
      colStatus: "الحالة",
      colActions: "إجراءات",
      active: "نشط حالياً",
      scheduled: "مجدول للبدء",
      completed: "مكتمل ومغلق",
      step1: "التفاصيل الأساسية",
      step2: "اختر الأسئلة",
      step3: "إعدادات وقواعد الامتحان",
      step4: "مراجعة ونشر",
      next: "الخطوة التالية",
      back: "رجوع",
      finish: "نشر الاختبار للطلاب",
      durationLabel: "المدة المتاحة للاختبار (بالدقائق)",
      attemptsLabel: "عدد المحاولات المسموحة (1-5)",
      resultsTable: {
        student: "اسم الطالب",
        score: "الدرجة الكلية",
        status: "حالة التصحيح",
        action: "تصحيح / مراجعة"
      },
      gradingTitle: "مركز تصحيح وتقييم الإجابات المقالية",
      studentAns: "إجابة الطالب المكتوبة",
      modelAns: "الإجابة النموذجية المرجعية للمعلم",
      aiCorrectBtn: "تصحيح فوري بالذكاء الاصطناعي",
      aiSuccess: "تم توليد تقييم الذكاء الاصطناعي بنجاح!",
      submitGrades: "اعتماد وحفظ الدرجات النهائية",
      graded: "تم تصحيحه",
      submitted: "يتطلب تصحيحاً"
    }
  };

  const t = dict[currentLanguage];

  const handleToggleQuestion = (qId: string) => {
    if (selectedQIds.includes(qId)) {
      setSelectedQIds(selectedQIds.filter(id => id !== qId));
    } else {
      setSelectedQIds([...selectedQIds, qId]);
    }
  };

  const handleCreateExam = () => {
    if (!title || selectedQIds.length === 0) return;
    
    const newExam: Exam = {
      id: `e-${Date.now()}`,
      title,
      questionIds: selectedQIds,
      duration,
      attempts,
      targetClass,
      targetGrade,
      activationDate,
      status: new Date(activationDate) > new Date() ? 'scheduled' : 'active'
    };

    addExam(newExam);
    setShowCreateModal(false);
    setExamStep(1);
    setTitle('');
    setSelectedQIds([]);
  };



  // Simulated AI Correction
  const handleAISimulateCorrect = (questionId: string, studentAnswer: string) => {
    setAiLoading(questionId);
    
    setTimeout(() => {
      setAiLoading(null);
      const aiFeedback = currentLanguage === 'en'
        ? "AI EVALUATION: The student demonstrates complete understanding of Newton's formulation. Mentions $F = dp/dt$ and correctly details rocket fuel mass expenditure variables. Score recommendation: 4/4."
        : "تقييم الذكاء الاصطناعي: الطالب يذكر صيغة نيوتن لحساب كمية التحرك $F = dp/dt$ بشكل ممتاز. الاستدلال بكتلة الصاروخ المتغيرة صحيح علمياً. التقييم المقترح: 4 درجات من 4.";

      if (selectedSub) {
        const updatedSub: ExamSubmission = {
          ...selectedSub,
          aiFeedback: {
            ...(selectedSub.aiFeedback || {}),
            [questionId]: aiFeedback
          }
        };
        setSelectedSub(updatedSub);
      }
    }, 1500);
  };

  const handleSaveGrades = () => {
    if (!selectedSub) return;
    
    // Sum final scores or set mock total
    const updatedSub: ExamSubmission = {
      ...selectedSub,
      score: 9.5, // Mock graded total score
      status: 'graded',
      gradedDate: new Date().toISOString()
    };

    updateSubmission(updatedSub);
    setSelectedSub(null);
  };

  return (
    <div className="space-y-6">
      {/* Tab select */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-4 gap-4">
        <div className="flex gap-4">
          <button 
            onClick={() => setActiveTab('exams')}
            className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'exams' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t.examsTab}
          </button>
          <button 
            onClick={() => setActiveTab('results')}
            className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'results' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t.resultsTab}
          </button>
        </div>

        {activeTab === 'exams' && (
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-indigo-600 text-white px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-1.5 hover:bg-indigo-700 shadow-md transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>{t.createBtn}</span>
          </button>
        )}
      </div>

      {/* 1. Exams List Tab */}
      {activeTab === 'exams' && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden text-left">
          <table className="w-full text-sm text-slate-500">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">{t.colTitle}</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">{t.colClass}</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">{t.colDuration}</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">{t.colStatus}</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">{t.colActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-600">
              {exams.map(exam => (
                <tr key={exam.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 text-slate-900 font-bold max-w-xs truncate">{exam.title}</td>
                  <td className="px-6 py-4">Grade 12 - Group A</td>
                  <td className="px-6 py-4">{exam.duration} Min</td>
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
                    <button 
                      onClick={() => deleteExam(exam.id)}
                      className="text-rose-600 hover:text-rose-700 font-bold text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 2. Results List Tab */}
      {activeTab === 'results' && (
        <div className="grid lg:grid-cols-12 gap-8 text-left">
          {/* Submissions Table */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-sm text-slate-500">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">{t.resultsTable.student}</th>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Exam Title</th>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">{t.resultsTable.score}</th>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">{t.resultsTable.status}</th>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">{t.resultsTable.action}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-600">
                {submissions.map(sub => (
                  <tr key={sub.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 text-slate-900 font-bold">{sub.studentName}</td>
                    <td className="px-6 py-4 text-slate-500 truncate max-w-[150px]">Circuits & Benzene</td>
                    <td className="px-6 py-4 font-bold">{sub.score ? `${sub.score}/12` : '--'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        sub.status === 'graded' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700 animate-pulse'
                      }`}>
                        {sub.status === 'graded' ? t.graded : t.submitted}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedSub(sub)}
                        className="text-indigo-600 hover:text-indigo-700 text-xs font-bold flex items-center gap-1"
                      >
                        <span>{t.resultsTable.action}</span>
                        <ChevronRight className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Correcting / Grading Drawer on Right side */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[400px]">
            {selectedSub ? (
              <div className="space-y-5">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h3 className="font-extrabold text-slate-900 text-sm">{t.gradingTitle}</h3>
                  <button onClick={() => setSelectedSub(null)} className="text-slate-400 hover:text-slate-600">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1 text-xs">
                  {/* Find Essay Question from Submission */}
                  {Object.entries(selectedSub.answers).map(([qId, ans]) => {
                    const q = questions.find(item => item.id === qId);
                    if (q?.type !== 'essay') return null;
                    return (
                      <div key={qId} className="space-y-3 border-b border-slate-100 pb-4">
                        <h4 className="font-bold text-slate-800 leading-normal">{q.title}</h4>
                        
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1">
                          <span className="font-bold text-[9px] uppercase tracking-wider text-slate-400">{t.studentAns}</span>
                          <p className="text-slate-700 leading-relaxed">{ans}</p>
                        </div>

                        <div className="bg-indigo-50/30 border border-indigo-100 rounded-lg p-3 space-y-1">
                          <span className="font-bold text-[9px] uppercase tracking-wider text-indigo-400">{t.modelAns}</span>
                          <p className="text-slate-700 leading-relaxed">{q.modelAnswer}</p>
                        </div>

                        {/* AI correction simulation block */}
                        {selectedSub.aiFeedback && selectedSub.aiFeedback[qId] ? (
                          <div className="bg-indigo-950 text-indigo-300 rounded-lg p-3.5 space-y-1 text-[11px] leading-relaxed border border-indigo-900">
                            <span className="font-bold uppercase tracking-wider text-indigo-400 block mb-1">AmalBila AI Assistant</span>
                            <p>{selectedSub.aiFeedback[qId]}</p>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleAISimulateCorrect(qId, ans)}
                            disabled={!!aiLoading}
                            className="bg-indigo-600 text-white font-bold px-3 py-2 rounded-lg w-full flex items-center justify-center gap-1.5 shadow-sm hover:bg-indigo-700 transition-colors"
                          >
                            {aiLoading === qId ? (
                              <span className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Sparkles className="h-3.5 w-3.5" />
                            )}
                            <span>{t.aiCorrectBtn}</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-slate-100 pt-4 flex flex-col gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Assign final grade</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 9.5 / 12" 
                      className="w-1/2 px-3 py-2 border border-slate-200 bg-slate-50 rounded-lg text-xs font-mono font-bold focus:bg-white outline-none"
                    />
                  </div>
                  <button
                    onClick={handleSaveGrades}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl w-full text-xs transition-colors shadow-md shadow-indigo-100"
                  >
                    {t.submitGrades}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center flex-1 text-slate-400 text-center space-y-3">
                <FileCheck2 className="h-10 w-10 text-slate-300" />
                <p className="text-xs font-semibold px-6 leading-normal">Select a student exam response from the list to begin grading essays.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3-Step Exam Creation Modal */}
      {/* 4-Step Exam Creation Wizard */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto text-left">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-2xl w-full p-8 space-y-8 my-8 flex flex-col">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-extrabold text-slate-900 text-xl">Build New Exam</h3>
                <p className="text-xs font-semibold text-slate-500 mt-1">Configure and publish an exam for your students</p>
              </div>
              <button onClick={() => { setShowCreateModal(false); setExamStep(1); }} className="text-slate-400 hover:text-slate-600 bg-slate-50 p-2 rounded-full transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Stepper tracking */}
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-slate-100 -z-10" />
              {([1, 2, 3, 4] as const).map((step) => {
                const isActive = examStep === step;
                const isPast = examStep > step;
                const labels = [t.step1, t.step2, t.step3, t.step4];
                return (
                  <div key={step} className="flex flex-col items-center gap-2 bg-white px-2">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-extrabold transition-all ${
                      isActive ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 ring-4 ring-indigo-50' : 
                      isPast ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {isPast ? <Check className="h-4 w-4" /> : step}
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-indigo-600' : isPast ? 'text-slate-700' : 'text-slate-400'}`}>
                      {labels[step - 1]}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex-1 overflow-y-auto pr-2" style={{ minHeight: '300px' }}>
              {/* Step 1: Details */}
              {examStep === 1 && (
                <div className="space-y-5 animate-fade-in">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Exam Title</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      placeholder="e.g. Aromatic Benzene Quiz"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none font-bold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Target Grade Level</label>
                    <select 
                      value={targetGrade}
                      onChange={e => setTargetGrade(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-indigo-600 font-semibold text-slate-700 cursor-pointer"
                    >
                      <option value="Grade 1">Grade 1</option>
                      <option value="Grade 2">Grade 2</option>
                      <option value="Grade 3">Grade 3</option>
                      <option value="All Grades">All Grades</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Target Study Group</label>
                    <select 
                      value={targetClass}
                      onChange={e => setTargetClass(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-indigo-600 font-semibold text-slate-700 cursor-pointer"
                    >
                      {classes.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Step 2: Select Questions */}
              {examStep === 2 && (
                <div className="space-y-4 animate-fade-in h-full flex flex-col">
                  <div className="flex justify-between items-end">
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Select Questions</label>
                    <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md">{selectedQIds.length} Selected</span>
                  </div>

                  <div className="flex gap-4">
                     <button
                        onClick={() => setShowAIGenerator(true)}
                        className="flex-[2] py-2.5 rounded-xl font-bold text-xs transition-all border bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm flex items-center justify-center gap-2"
                     >
                       <Sparkles className="h-4 w-4" />
                       Generate with AI
                     </button>
                     <button
                        onClick={() => {
                          setQModalType('mcq');
                          setShowQuestionModal(true);
                        }}
                        className="flex-1 py-2.5 rounded-xl font-bold text-xs transition-all border bg-white text-slate-600 border-slate-200 hover:bg-slate-50 shadow-sm"
                     >
                       + Create MCQ
                     </button>
                     <button
                        onClick={() => {
                          setQModalType('essay');
                          setShowQuestionModal(true);
                        }}
                        className="flex-1 py-2.5 rounded-xl font-bold text-xs transition-all border bg-white text-slate-600 border-slate-200 hover:bg-slate-50 shadow-sm"
                     >
                       + Create Essay
                     </button>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-3 border border-slate-200 p-3 rounded-xl bg-slate-50 min-h-[220px]">
                    {(() => {
                      const filteredBankQuestions = questions.filter(q => targetGrade === 'All Grades' || q.grade === targetGrade || !q.grade);
                      if (filteredBankQuestions.length === 0) {
                        return (
                          <div className="text-center py-10 text-slate-400 font-semibold text-sm">
                            No questions found for {targetGrade}.
                          </div>
                        );
                      }

                      const questionsByFolder: Record<string, Question[]> = {};
                      filteredBankQuestions.forEach(q => {
                        const fId = q.folderId || 'unassigned';
                        if (!questionsByFolder[fId]) questionsByFolder[fId] = [];
                        questionsByFolder[fId].push(q);
                      });

                      return Object.entries(questionsByFolder).map(([folderId, folderQuestions]) => {
                        const folder = folders.find(f => f.id === folderId);
                        const folderName = folder ? folder.name : 'Uncategorized';
                        const isExpanded = expandedFolders.includes(folderId);

                        return (
                          <div key={folderId} className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm transition-all">
                            <button
                              type="button"
                              onClick={() => {
                                if (isExpanded) {
                                  setExpandedFolders(expandedFolders.filter(id => id !== folderId));
                                } else {
                                  setExpandedFolders([...expandedFolders, folderId]);
                                }
                              }}
                              className="w-full flex items-center justify-between p-3 bg-white hover:bg-slate-50 transition-colors text-left border-b border-slate-100 last:border-b-0"
                            >
                              <div className="flex items-center gap-2.5">
                                <Folder className="h-4.5 w-4.5 text-indigo-500" />
                                <span className="font-extrabold text-sm text-slate-800">{folderName}</span>
                                <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md">{folderQuestions.length} Questions</span>
                              </div>
                              <ChevronDown className={`h-4.5 w-4.5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                            </button>
                            
                            {isExpanded && (
                              <div className="p-2 space-y-2 bg-slate-50 border-t border-slate-100">
                                {folderQuestions.map(q => (
                                  <label key={q.id} className={`flex items-start gap-3 text-xs font-bold cursor-pointer p-3 rounded-xl border transition-all ${
                                    selectedQIds.includes(q.id) ? 'border-indigo-500 bg-white shadow-sm ring-1 ring-indigo-500/20' : 'border-slate-200 bg-white hover:border-slate-300'
                                  }`}>
                                    <input
                                      type="checkbox"
                                      checked={selectedQIds.includes(q.id)}
                                      onChange={() => handleToggleQuestion(q.id)}
                                      className="h-4.5 w-4.5 text-indigo-600 focus:ring-indigo-500 rounded border-slate-300 mt-0.5"
                                    />
                                    <div className="flex-1">
                                      <span className="text-slate-800 text-sm line-clamp-2 leading-relaxed" dangerouslySetInnerHTML={{ __html: q.title }} />
                                      <div className="flex items-center gap-2 mt-2">
                                        <span className={`px-2 py-0.5 rounded text-[9px] uppercase tracking-wider font-extrabold ${q.type === 'mcq' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                          {q.type}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded text-[9px] uppercase tracking-wider font-extrabold ${q.difficulty === 'easy' ? 'text-emerald-600' : q.difficulty === 'medium' ? 'text-amber-600' : 'text-rose-600'}`}>
                                          {q.difficulty}
                                        </span>
                                      </div>
                                    </div>
                                  </label>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      });
                    })()}
                  </div>

                  {showQuestionModal && (
                    <QuestionFormModal
                      defaultType={qModalType}
                      defaultGrade={targetGrade === 'All Grades' ? 'Grade 3' : targetGrade}
                      onSave={(savedQ) => {
                        const newQ: Question = {
                          id: `q-${Date.now()}`,
                          ...savedQ,
                          folderId: folders.length > 0 ? folders[0].id : 'unassigned',
                        } as Question;
                        addQuestion(newQ);
                        handleToggleQuestion(newQ.id);
                        setShowQuestionModal(false);
                      }}
                      onClose={() => setShowQuestionModal(false)}
                    />
                  )}
                </div>
              )}


              {/* Step 3: Configure Rules */}
              {examStep === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">{t.durationLabel}</label>
                      <div className="relative">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input 
                          type="number"
                          value={duration}
                          onChange={e => setDuration(Math.max(1, Number(e.target.value)))}
                          min="1"
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-indigo-600 font-bold text-slate-800"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">{t.attemptsLabel}</label>
                      <div className="relative">
                        <UserCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <select 
                          value={attempts}
                          onChange={e => setAttempts(Number(e.target.value))}
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-indigo-600 font-bold text-slate-800 cursor-pointer appearance-none"
                        >
                          <option value={1}>1 Attempt</option>
                          <option value={2}>2 Attempts</option>
                          <option value={3}>3 Attempts</option>
                          <option value={5}>5 Attempts</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Scheduled Launch Date & Time</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input 
                        type="datetime-local"
                        value={activationDate}
                        onChange={e => setActivationDate(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-indigo-600 font-bold text-slate-800"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Preview & Publish */}
              {examStep === 4 && (
                <div className="space-y-6 animate-fade-in text-slate-800">
                  <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-4">
                    <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                      <div className="bg-indigo-100 p-2.5 rounded-xl text-indigo-700">
                        <FileSpreadsheet className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-lg">{title || 'Untitled Exam'}</h4>
                        <p className="text-xs font-bold text-slate-500 mt-0.5">Will be published on {new Date(activationDate).toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm font-semibold pt-2">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-1">Target Group</span>
                        <span className="text-slate-800">{classes.find(c => c.id === targetClass)?.name || 'Unknown Class'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-1">Questions Included</span>
                        <span className="text-slate-800">{selectedQIds.length} Questions</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-1">Duration & Attempts</span>
                        <span className="text-slate-800">{duration} Minutes, {attempts} {attempts === 1 ? 'Attempt' : 'Attempts'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl p-4 text-sm font-bold flex gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                    <p>Exam is ready to be scheduled. It will automatically unlock for students in the specified class at the activation date.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Actions buttons */}
            <div className="flex justify-between items-center border-t border-slate-100 pt-6 mt-4">
              <button
                type="button"
                onClick={() => {
                  if (examStep > 1) setExamStep(examStep - 1);
                }}
                disabled={examStep === 1}
                className="px-5 py-2.5 border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 font-bold rounded-xl text-sm disabled:opacity-30 transition-all flex items-center gap-2"
              >
                {t.back}
              </button>

              <button
                type="button"
                onClick={() => {
                  if (examStep === 1 && !title) return; // Basic validation
                  if (examStep === 2 && selectedQIds.length === 0) return;
                  if (examStep < 4) setExamStep(examStep + 1);
                  else handleCreateExam();
                }}
                disabled={(examStep === 1 && !title) || (examStep === 2 && selectedQIds.length === 0)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow-md shadow-indigo-100 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{examStep === 4 ? t.finish : t.next}</span>
                {examStep < 4 && <ChevronRight className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Generate with AI Modal */}
      {showAIGenerator && (
        <AIGeneratorModal
          onClose={() => setShowAIGenerator(false)}
          onGenerate={(data) => {
            const generatedQ: Question = {
              id: `q-${Date.now()}`,
              title: data.title,
              type: data.type,
              difficulty: data.difficulty,
              grade: data.grade,
              options: data.options,
              correctOption: data.correctOption,
              modelAnswer: data.modelAnswer
            };
            addQuestion(generatedQ);
            setSelectedQIds(prev => [...prev, generatedQ.id]);
            setShowAIGenerator(false);
          }}
        />
      )}
    </div>
  );
}
