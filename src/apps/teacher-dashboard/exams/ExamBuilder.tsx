import React, { useState, useEffect } from 'react';
import { useAppState } from '../../../shared/context/AppState';
import { Exam, Question } from '../../../shared/types';
import MathRenderer from '../../../shared/components/MathRenderer';
import { 
  ArrowLeft, Plus, Trash2,
  Copy, CheckCircle2, Sparkles, Folder
} from 'lucide-react';
import ExamAnalytics from './ExamAnalytics';

interface ExamBuilderProps {
  examId: string | null;
  onBack: () => void;
  initialTab?: 'questions' | 'responses' | 'settings';
}

export default function ExamBuilder({ examId, onBack, initialTab = 'questions' }: ExamBuilderProps) {
  const { currentLanguage, exams, addExam, updateExam, questions, addQuestion, updateQuestion, deleteQuestion, folders, classes } = useAppState();
  
  const [activeTab, setActiveTab] = useState<'questions' | 'responses' | 'settings'>(initialTab);
  const [showBankModal, setShowBankModal] = useState(false);
  const [bankSearch, setBankSearch] = useState('');
  const [publishSuccess, setPublishSuccess] = useState(false);

  // Local state for the exam being edited
  const [exam, setExam] = useState<Exam>(() => {
    if (examId) {
      return exams.find(e => e.id === examId) || {
        id: `e-${Date.now()}`,
        title: 'Untitled Exam',
        description: '',
        questionIds: [],
        duration: 30,
        attempts: 1,
        targetClass: classes[0]?.id || 'c-1',
        activationDate: new Date().toISOString(),
        status: 'scheduled' as const,
      };
    }
    return {
      id: `e-${Date.now()}`,
      title: 'Untitled Exam',
      description: '',
      questionIds: [],
      duration: 30,
      attempts: 1,
      targetClass: classes[0]?.id || 'c-1',
      activationDate: new Date().toISOString(),
      status: 'scheduled' as const,
    };
  });

  // Track whether this exam has been saved to the global store
  const [isSavedToStore, setIsSavedToStore] = useState(() => {
    return examId ? exams.some(e => e.id === examId) : false;
  });

  const saveExam = (updatedExam: Exam) => {
    setExam(updatedExam);
    if (!isSavedToStore) {
      addExam(updatedExam);
      setIsSavedToStore(true);
    } else {
      updateExam(updatedExam);
    }
  };

  // Derived list of question objects for this exam
  const examQuestions: Question[] = exam.questionIds
    .map(id => questions.find(q => q.id === id))
    .filter(Boolean) as Question[];

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newExam = { ...exam, title: e.target.value };
    saveExam(newExam);
  };

  const handleDescChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newExam = { ...exam, description: e.target.value };
    saveExam(newExam);
  };

  const addEmptyQuestion = (type: 'mcq' | 'essay' = 'mcq') => {
    const newQ: Question = {
      id: `q-tmp-${Date.now()}`,
      title: '',
      type,
      difficulty: 'medium',
      folderId: folders[0]?.id || 'unassigned',
      options: type === 'mcq' ? ['Option 1', 'Option 2', 'Option 3', 'Option 4'] : undefined,
      correctOption: type === 'mcq' ? 0 : undefined,
      points: 1,
      required: false,
    };
    
    addQuestion(newQ);
    const newExam = { ...exam, questionIds: [...exam.questionIds, newQ.id] };
    saveExam(newExam);
  };

  const handleUpdateQuestion = (id: string, updates: Partial<Question>) => {
    const q = questions.find(q => q.id === id);
    if (q) {
      updateQuestion({ ...q, ...updates });
    }
  };

  const handleDeleteQuestion = (id: string) => {
    // Remove from exam's question list
    const newExam = { ...exam, questionIds: exam.questionIds.filter(qid => qid !== id) };
    saveExam(newExam);
    // If this is an inline-created question (temp id), also remove from global bank
    if (id.startsWith('q-tmp-')) {
      deleteQuestion(id);
    }
  };

  const handleDuplicateQuestion = (id: string) => {
    const q = questions.find(q => q.id === id);
    if (!q) return;
    const newQ: Question = {
      ...q,
      id: `q-tmp-${Date.now()}`,
      title: q.title + ' (Copy)',
    };
    addQuestion(newQ);
    // Insert duplicate right after the original
    const idx = exam.questionIds.indexOf(id);
    const newIds = [...exam.questionIds];
    newIds.splice(idx + 1, 0, newQ.id);
    saveExam({ ...exam, questionIds: newIds });
  };

  const importFromBank = (qId: string) => {
    if (!exam.questionIds.includes(qId)) {
      const newExam = { ...exam, questionIds: [...exam.questionIds, qId] };
      saveExam(newExam);
    }
  };

  const handleOptionChange = (qId: string, index: number, value: string) => {
    const q = questions.find(q => q.id === qId);
    if (q && q.options) {
      const newOptions = [...q.options];
      newOptions[index] = value;
      handleUpdateQuestion(qId, { options: newOptions });
    }
  };

  const addOption = (qId: string) => {
    const q = questions.find(q => q.id === qId);
    if (q && q.options) {
      handleUpdateQuestion(qId, { options: [...q.options, `Option ${q.options.length + 1}`] });
    }
  };

  const removeOption = (qId: string, index: number) => {
    const q = questions.find(q => q.id === qId);
    if (q && q.options && q.options.length > 1) {
      const newOptions = q.options.filter((_, i) => i !== index);
      let newCorrect = q.correctOption;
      if (newCorrect === index) newCorrect = 0;
      else if (newCorrect !== undefined && newCorrect > index) newCorrect--;
      handleUpdateQuestion(qId, { options: newOptions, correctOption: newCorrect });
    }
  };

  const handlePublish = () => {
    const publishedExam = { ...exam, status: 'active' as const };
    saveExam(publishedExam);
    setPublishSuccess(true);
    setTimeout(() => setPublishSuccess(false), 3000);
  };

  // Filtered questions for bank modal (exclude already added, and apply search)
  const bankQuestions = questions.filter(q => {
    const searchLower = bankSearch.toLowerCase();
    const matchesSearch = !bankSearch || q.title.toLowerCase().includes(searchLower);
    return matchesSearch;
  });

  const statusColors: Record<string, string> = {
    active: 'bg-emerald-100 text-emerald-700',
    scheduled: 'bg-amber-100 text-amber-700',
    completed: 'bg-slate-100 text-slate-600',
  };

  const statusLabels: Record<string, string> = {
    active: currentLanguage === 'en' ? 'Active' : 'نشط',
    scheduled: currentLanguage === 'en' ? 'Scheduled' : 'مجدول',
    completed: currentLanguage === 'en' ? 'Completed' : 'مكتمل',
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] bg-slate-50 -m-6 p-6">
      {/* Top Nav */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-40 rounded-xl shadow-sm mb-6">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-slate-500 hover:text-slate-800 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <input 
            type="text" 
            value={exam.title} 
            onChange={handleTitleChange}
            className="text-lg font-bold text-slate-800 bg-transparent border-none outline-none hover:bg-slate-50 px-2 py-1 rounded focus:bg-white focus:ring-2 focus:ring-indigo-100"
            placeholder="Exam Title"
          />
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusColors[exam.status]}`}>
            {statusLabels[exam.status]}
          </span>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('questions')}
            className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${activeTab === 'questions' ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-600 hover:text-slate-800'}`}
          >
            Questions
          </button>
          <button 
            onClick={() => setActiveTab('responses')}
            className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${activeTab === 'responses' ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-600 hover:text-slate-800'}`}
          >
            Responses
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${activeTab === 'settings' ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-600 hover:text-slate-800'}`}
          >
            Settings
          </button>
        </div>

        <div className="flex items-center gap-3">
          {publishSuccess && (
            <span className="text-sm font-semibold text-emerald-600 flex items-center gap-1.5 animate-fade-in">
              <CheckCircle2 className="h-4 w-4" />
              Published!
            </span>
          )}
          <button 
            onClick={handlePublish}
            disabled={exam.status === 'active'}
            className={`px-5 py-2 rounded-lg text-sm font-bold shadow-md transition-colors ${
              exam.status === 'active' 
                ? 'bg-emerald-100 text-emerald-700 cursor-default' 
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {exam.status === 'active' ? '✓ Published' : 'Publish Exam'}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-4xl mx-auto w-full relative">
        
        {activeTab === 'questions' && (
          <div className="space-y-6 pb-12">
            {/* Title Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col gap-4">
              <input 
                type="text" 
                value={exam.title}
                onChange={handleTitleChange}
                className="text-2xl font-extrabold text-slate-900 border border-transparent hover:border-slate-200 focus:border-indigo-600 outline-none p-2 rounded-lg transition-colors"
                placeholder="Exam Title"
              />
              <textarea 
                value={exam.description || ''}
                onChange={handleDescChange}
                placeholder="Add a description or instructions for the students..."
                className="text-sm text-slate-600 border border-transparent hover:border-slate-200 focus:border-indigo-600 outline-none p-2 rounded-lg resize-none transition-colors min-h-[60px]"
              />
            </div>

            {/* Question Cards */}
            {examQuestions.map((q, qIndex) => {
              // Always get fresh question data from global store
              const freshQ = questions.find(gq => gq.id === q.id) || q;
              return (
                <div 
                  key={freshQ.id} 
                  className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col"
                >
                  <div className="p-6 border-b border-slate-100">
                    <div className="flex justify-between items-start gap-4 mb-6">
                      <div className="flex-1 flex gap-3">
                        <div className="bg-slate-100 text-slate-500 font-bold w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm">
                          {qIndex + 1}
                        </div>
                        <textarea
                          value={freshQ.title}
                          onChange={(e) => handleUpdateQuestion(freshQ.id, { title: e.target.value })}
                          placeholder="Type your question here..."
                          className="w-full text-base font-bold text-slate-800 bg-slate-50 border border-transparent hover:border-slate-200 focus:border-indigo-300 focus:bg-white outline-none rounded-lg p-3 resize-none min-h-[60px]"
                        />
                      </div>
                      <div className="w-48 shrink-0 flex flex-col gap-3">
                        <select 
                          value={freshQ.type}
                          onChange={(e) => handleUpdateQuestion(freshQ.id, { type: e.target.value as 'mcq' | 'essay' })}
                          className="w-full border border-slate-200 bg-white rounded-lg p-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-indigo-600"
                        >
                          <option value="mcq">Multiple Choice</option>
                          <option value="essay">Essay / Paragraph</option>
                        </select>
                        <div className="flex items-center gap-2">
                          <label className="text-xs font-bold text-slate-500">Points:</label>
                          <input 
                            type="number" 
                            value={freshQ.points || 1} 
                            onChange={(e) => handleUpdateQuestion(freshQ.id, { points: Number(e.target.value) })}
                            className="flex-1 px-2 py-1.5 rounded-lg border border-slate-200 outline-none focus:border-indigo-600 text-sm font-semibold text-slate-700"
                            min="0"
                          />
                        </div>
                      </div>
                    </div>

                    {freshQ.type === 'mcq' && (
                      <div className="space-y-3 pl-11">
                        {freshQ.options?.map((opt, i) => (
                          <div key={i} className="flex items-center gap-3 group">
                            <button 
                              onClick={() => handleUpdateQuestion(freshQ.id, { correctOption: i })}
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${freshQ.correctOption === i ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300 hover:border-emerald-300'}`}
                              title="Mark as correct answer"
                            >
                              {freshQ.correctOption === i && <CheckCircle2 className="h-4 w-4 text-white" />}
                            </button>
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) => handleOptionChange(freshQ.id, i, e.target.value)}
                              className={`flex-1 bg-transparent border border-transparent hover:border-slate-200 focus:border-indigo-600 outline-none px-3 py-2 rounded-lg text-sm transition-colors ${freshQ.correctOption === i ? 'font-bold text-emerald-800 bg-emerald-50' : 'text-slate-800'}`}
                              placeholder={`Option ${i + 1}`}
                            />
                            {freshQ.options!.length > 1 && (
                              <button onClick={() => removeOption(freshQ.id, i)} className="text-slate-400 hover:text-rose-500 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        ))}
                        <div className="flex items-center gap-3 pt-2">
                          <div className="w-6 h-6 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-300">
                            <Plus className="h-3 w-3" />
                          </div>
                          <button onClick={() => addOption(freshQ.id)} className="text-sm font-bold text-indigo-600 hover:text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors">
                            Add another option
                          </button>
                        </div>
                      </div>
                    )}

                    {freshQ.type === 'essay' && (
                      <div className="pl-11 space-y-4">
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm text-slate-400 italic">
                          Student will see a text area here to type their long answer...
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-indigo-700 flex items-center gap-1.5">
                            <Sparkles className="h-3 w-3" />
                            Grading Rubric (Model Answer)
                          </label>
                          <textarea
                            value={freshQ.modelAnswer || ''}
                            onChange={(e) => handleUpdateQuestion(freshQ.id, { modelAnswer: e.target.value })}
                            placeholder="Provide the ideal answer. This will be used to grade student responses..."
                            className="w-full p-3 rounded-lg border border-indigo-200 text-sm outline-none focus:border-indigo-500 min-h-[80px] bg-indigo-50/30"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-4 bg-slate-50/50 rounded-b-2xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleDuplicateQuestion(freshQ.id)} 
                        className="text-slate-500 hover:text-slate-700 font-semibold text-sm flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-200 transition-colors"
                      >
                        <Copy className="h-4 w-4" />
                        Duplicate
                      </button>
                      <button 
                        onClick={() => handleDeleteQuestion(freshQ.id)} 
                        className="text-rose-500 hover:text-rose-700 font-semibold text-sm flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer text-sm font-bold text-slate-700">
                        Required
                        <div className={`w-9 h-5 rounded-full transition-colors relative ${freshQ.required ? 'bg-indigo-600' : 'bg-slate-300'}`} onClick={() => handleUpdateQuestion(freshQ.id, { required: !freshQ.required })}>
                          <div className={`absolute top-1 left-1 bg-white w-3 h-3 rounded-full transition-transform ${freshQ.required ? 'translate-x-4' : ''}`} />
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              );
            })}

            {examQuestions.length === 0 && (
              <div className="text-center py-16 text-slate-500 font-medium bg-white rounded-2xl border border-dashed border-slate-200">
                <div className="text-4xl mb-3">📝</div>
                <p className="font-bold text-slate-700 text-lg mb-1">No questions yet</p>
                <p className="text-sm text-slate-400">Click below to start building your exam.</p>
              </div>
            )}

            {/* Add Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 pt-4">
              <button 
                onClick={() => addEmptyQuestion('mcq')} 
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 border-2 border-dashed border-indigo-300 text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 hover:border-indigo-400 transition-colors"
              >
                <Plus className="h-5 w-5" />
                Add Question
              </button>
              <button 
                onClick={() => setShowBankModal(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 border-2 border-dashed border-slate-300 text-slate-600 font-bold rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-colors"
              >
                <Folder className="h-5 w-5" />
                Import from Bank
              </button>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-8">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 mb-4 border-b border-slate-100 pb-2">Exam Rules</h3>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Duration (Minutes)</label>
                  <input 
                    type="number" 
                    value={exam.duration}
                    onChange={(e) => saveExam({ ...exam, duration: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-600"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Attempts Allowed</label>
                  <select 
                    value={exam.attempts}
                    onChange={(e) => saveExam({ ...exam, attempts: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-600"
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
              <h3 className="text-lg font-extrabold text-slate-900 mb-4 border-b border-slate-100 pb-2">Target Class</h3>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Assign to Class Group</label>
                <select 
                  value={exam.targetClass}
                  onChange={(e) => saveExam({ ...exam, targetClass: e.target.value })}
                  className="w-full max-w-sm px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-600"
                >
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-slate-900 mb-4 border-b border-slate-100 pb-2">Availability</h3>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Activation Date & Time</label>
                  <input 
                    type="datetime-local" 
                    value={exam.activationDate.slice(0, 16)}
                    onChange={(e) => saveExam({ ...exam, activationDate: new Date(e.target.value).toISOString() })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Exam Status</label>
                  <select 
                    value={exam.status}
                    onChange={(e) => saveExam({ ...exam, status: e.target.value as Exam['status'] })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-600"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="active">Active (Open)</option>
                    <option value="completed">Completed (Closed)</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-slate-900 mb-4 border-b border-slate-100 pb-2">Presentation</h3>
              <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <div className="font-bold text-slate-800">Shuffle Question Order</div>
                    <div className="text-sm text-slate-500">Questions will be presented in random order for each student</div>
                  </div>
                  <div className={`w-11 h-6 rounded-full transition-colors relative ${exam.shuffleQuestions ? 'bg-indigo-600' : 'bg-slate-300'}`} onClick={() => saveExam({ ...exam, shuffleQuestions: !exam.shuffleQuestions })}>
                    <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${exam.shuffleQuestions ? 'translate-x-5' : ''}`} />
                  </div>
                </label>

                <label className="flex items-center justify-between cursor-pointer pt-4 border-t border-slate-100">
                  <div>
                    <div className="font-bold text-slate-800">Show Results to Students</div>
                    <div className="text-sm text-slate-500">When students can see their grade and missed questions</div>
                  </div>
                  <select 
                    value={exam.showResults || 'immediately'}
                    onChange={(e) => saveExam({ ...exam, showResults: e.target.value as any })}
                    className="border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:border-indigo-600 text-sm font-semibold"
                  >
                    <option value="immediately">Immediately after submission</option>
                    <option value="after_grading">After manual grading is complete</option>
                    <option value="never">Never (Teacher only)</option>
                  </select>
                </label>

                <label className="flex items-center justify-between cursor-pointer pt-4 border-t border-slate-100">
                  <div>
                    <div className="font-bold text-slate-800">Passing Score</div>
                    <div className="text-sm text-slate-500">Minimum percentage to pass (leave 0 to disable)</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number"
                      value={exam.passingScore || 0}
                      onChange={(e) => saveExam({ ...exam, passingScore: Number(e.target.value) })}
                      className="w-20 px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-indigo-600 text-sm font-semibold text-center"
                      min="0"
                      max="100"
                    />
                    <span className="text-sm font-bold text-slate-500">%</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'responses' && (
          <ExamAnalytics examId={exam.id} />
        )}

      </div>

      {/* Question Bank Modal */}
      {showBankModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-2">
                <Folder className="h-5 w-5 text-indigo-600" />
                Question Bank
              </h3>
              <button onClick={() => setShowBankModal(false)} className="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
            </div>

            {/* Search */}
            <div className="px-6 py-3 border-b border-slate-100">
              <input 
                type="text"
                value={bankSearch}
                onChange={(e) => setBankSearch(e.target.value)}
                placeholder="Search questions..."
                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-600"
              />
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {bankQuestions.map(q => {
                const isAdded = exam.questionIds.includes(q.id);
                return (
                  <div key={q.id} className="border border-slate-200 rounded-xl p-4 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors">
                    <div className="flex-1 mr-4">
                      <p className="font-semibold text-slate-800 text-sm line-clamp-2">
                        <MathRenderer text={q.title || 'Untitled question'} />
                      </p>
                      <div className="text-xs font-bold text-slate-400 mt-2 flex items-center gap-3">
                        <span className="uppercase tracking-wider">{q.type === 'mcq' ? 'Multiple Choice' : 'Essay'}</span>
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-500">{q.points || 1} pt</span>
                      </div>
                    </div>
                    <div>
                      {isAdded ? (
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg">
                          <CheckCircle2 className="h-4 w-4" />
                          Added
                        </div>
                      ) : (
                        <button 
                          onClick={() => importFromBank(q.id)}
                          className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                          Add
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
              
              {bankQuestions.length === 0 && (
                <div className="text-center py-12 text-slate-400 font-medium">
                  {bankSearch ? 'No questions match your search.' : 'No questions found in your bank.'}
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                {exam.questionIds.length} question{exam.questionIds.length !== 1 ? 's' : ''} in this exam
              </span>
              <button 
                onClick={() => setShowBankModal(false)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl transition-colors text-sm"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
