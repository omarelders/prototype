import React, { useState } from 'react';
import { useAppState } from '../../../shared/context/AppState';
import { Question, QuestionFolder } from '../../../shared/types';

import QuestionFormModal from '../../../shared/components/QuestionFormModal';
import { 
  Folder, 
  FolderPlus, 
  Plus, 
    Search,
    Trash2,
  Edit3, 
      AlertCircle,

} from 'lucide-react';

export default function QuestionBank({ gradeId }: { gradeId: string }) {
  const { 
    currentLanguage, 
    folders, 
    questions, 
    addFolder, 
    deleteFolder, 
    addQuestion, 
    updateQuestion, 
    deleteQuestion
  } = useAppState();

  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'mcq' | 'essay'>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

  // Modal control
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  // Sync selectedFolderId when gradeId or folders change
  React.useEffect(() => {
    const levelFolders = folders.filter(f => f.level === gradeId);
    if (levelFolders.length > 0) {
      const isSelectedFolderInLevel = levelFolders.some(f => f.id === selectedFolderId);
      if (!isSelectedFolderInLevel) {
        setSelectedFolderId(levelFolders[0].id);
      }
    } else {
      setSelectedFolderId(null);
    }
  }, [gradeId, folders, selectedFolderId]);

  // Question Editor form state
  const [qTitle, setQTitle] = useState('');
  const [qType, setQType] = useState<'mcq' | 'essay'>('mcq');
  const [qDifficulty, setQDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [qOptions, setQOptions] = useState<string[]>(['', '', '', '']);
  const [qCorrect, setQCorrect] = useState(0);
  const [qModelAnswer, setQModelAnswer] = useState('');

  const levelFolders = folders.filter(f => f.level === gradeId);

  // Translations
  const dict = {
    en: {
      foldersTitle: "Unit Folders",
      allQuestions: "All Questions",
      addFolderBtn: "New Folder",
      addQuestionBtn: "New Question",
      searchPlaceholder: "Search questions...",
      filterType: "Type",
      filterDifficulty: "Difficulty",
      colTitle: "Question Text",
      colType: "Type",
      colDifficulty: "Difficulty",
      colActions: "Actions",
      mcq: "Multiple Choice",
      essay: "Essay / Written",
      easy: "Easy",
      medium: "Medium",
      hard: "Hard",
      editorTitle: "Question Editor",
      optionsLabel: "MCQ Options",
      correctLabel: "Mark Correct Option",
      modelLabel: "Grading Reference Answer",
      mathHelper: "Supports Math equations (e.g. $F = ma$ or $E = mc^2$).",
      levelSelectorTitle: "Select Academic Level",
      level1: "First Grade (الصف الأول)",
      level2: "Second Grade (الصف الثاني)",
      level3: "Third Grade (الصف الثالث)",
      foldersCountText: "units",
      questionsCountText: "questions",
      noFoldersAlert: "No unit folders created for this level yet. Create a unit folder to add questions.",
    },
    ar: {
      foldersTitle: "مجلدات الوحدات",
      allQuestions: "جميع الأسئلة",
      addFolderBtn: "مجلد جديد",
      addQuestionBtn: "سؤال جديد",
      aiGenerateBtn: "توليد بالذكاء الاصطناعي",
      searchPlaceholder: "بحث في نص السؤال...",
      filterType: "نوع السؤال",
      filterDifficulty: "مستوى الصعوبة",
      colTitle: "نص السؤال الدراسي",
      colType: "النوع",
      colDifficulty: "الصعوبة",
      colActions: "إجراءات",
      mcq: "اختيار من متعدد",
      essay: "سؤال مقالي",
      easy: "سهل",
      medium: "متوسط",
      hard: "صعب",
      editorTitle: "محرر صياغة الأسئلة",
      aiTitle: "مولد الأسئلة بالذكاء الاصطناعي",
      aiPromptLabel: "اكتب موضوع الدرس أو فقرة الشرح لتوليد الأسئلة",
      aiPromptPlaceholder: "مثال: شرح قاعدة لوشاتيليه وتأثير التغير في الضغط والحرارة على الاتزان الكيميائي...",
      aiSubmit: "توليد السؤال فوراً",
      aiGradeLabel: "المستوى الدراسي المستهدف",
      aiTypeLabel: "نوع السؤال",
      aiGrade1: "الصف الأول",
      aiGrade2: "الصف الثاني",
      aiGrade3: "الصف الثالث",
      optionsLabel: "خيارات الإجابة",
      correctLabel: "حدد الإجابة الصحيحة النموذجية",
      modelLabel: "نص الإجابة النموذجية المرجعية",
      mathHelper: "يدعم المعادلات والرموز الرياضية والكيميائية بكل سهولة.",
      levelSelectorTitle: "اختر المستوى الدراسي للتحكم بالأسئلة",
      level1: "الصف الأول الثانوي",
      level2: "الصف الثاني الثانوي",
      level3: "الصف الثالث الثانوي",
      foldersCountText: "وحدات",
      questionsCountText: "سؤال",
      noFoldersAlert: "لا توجد مجلدات وحدات دراسية مضافة لهذا المستوى بعد. اضغط على أيقونة إضافة مجلد للبدء.",
      aiReviewTitle: "مراجعة السؤال المولد بالذكاء الاصطناعي",
      aiReviewSubtitle: "معاينة لكيفية ظهور السؤال للطلاب. يمكنك إضافته للبنك، أو إعادة التوليد، أو تعديل الوصف.",
      aiApproveBtn: "موافقة وحفظ",
      aiRegenerateBtn: "إعادة توليد",
      aiAdjustBtn: "تعديل الوصف",
      aiCorrectAnswer: "الإجابة الصحيحة"
    }
  };

  const t = dict[currentLanguage];

  // Logic Folders
  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName) return;
    const newF: QuestionFolder = {
      id: `f-${Date.now()}`,
      name: newFolderName,
      parentId: null,
      level: gradeId
    };
    addFolder(newF);
    setShowFolderModal(false);
    setNewFolderName('');
    setSelectedFolderId(newF.id);
  };

  // Logic Questions
  const handleOpenEditor = (question?: Question) => {
    if (question) {
      setEditingQuestion(question);
      setQTitle(question.title);
      setQType(question.type);
      setQDifficulty(question.difficulty);
      setQOptions(question.options || ['', '', '', '']);
      setQCorrect(question.correctOption || 0);
      setQModelAnswer(question.modelAnswer || '');
    } else {
      setEditingQuestion(null);
      setQTitle('');
      setQType('mcq');
      setQDifficulty('medium');
      setQOptions(['', '', '', '']);
      setQCorrect(0);
      setQModelAnswer('');
    }
    setShowQuestionModal(true);
  };

  const _handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qTitle || !selectedFolderId) return;

    const newQ: Question = {
      id: editingQuestion ? editingQuestion.id : `q-${Date.now()}`,
      title: qTitle,
      type: qType,
      difficulty: qDifficulty,
      options: qType === 'mcq' ? qOptions : undefined,
      correctOption: qType === 'mcq' ? qCorrect : undefined,
      modelAnswer: qType === 'essay' ? qModelAnswer : undefined,
      folderId: selectedFolderId
    };

    if (editingQuestion) {
      updateQuestion(newQ);
    } else {
      addQuestion(newQ);
    }

    setShowQuestionModal(false);
    setEditingQuestion(null);
  };

  // Filter lists
  const filteredQuestions = questions.filter(q => {
    // level isolation check
    const qFolder = folders.find(f => f.id === q.folderId);
    const qLevel = qFolder ? (qFolder.level || 'g3') : 'g3';
    if (qLevel !== gradeId) return false;

    // folder check
    if (selectedFolderId && q.folderId !== selectedFolderId) return false;
    if (!selectedFolderId) return false; // Show nothing if no folder is active in this level
    
    // search check
    if (searchQuery && !q.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    // type check
    if (typeFilter !== 'all' && q.type !== typeFilter) return false;
    // difficulty check
    if (difficultyFilter !== 'all' && q.difficulty !== difficultyFilter) return false;
    return true;
  });

  const _handleInsertQuestionHTML = (openTag: string, closeTag: string) => {
    const textarea = document.getElementById('question-editor-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const replacement = openTag + (selected || 'text') + closeTag;
    const newContent = text.substring(0, start) + replacement + text.substring(end);
    
    setQTitle(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + openTag.length, start + openTag.length + (selected || 'text').length);
    }, 50);
  };

  return (
    <div className="space-y-8 w-full">

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Sidebar Folders */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6 text-left">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Folder className="h-4 w-4 text-indigo-600" />
              <span>{t.foldersTitle}</span>
            </h3>
            <button 
              onClick={() => setShowFolderModal(true)}
              className="p-1.5 hover:bg-slate-100 rounded text-indigo-600 transition-colors cursor-pointer"
              title={t.addFolderBtn}
            >
              <FolderPlus className="h-4 w-4" />
            </button>
          </div>

          <nav className="space-y-1">
            {levelFolders.length === 0 ? (
              <div className="text-center py-6 px-3 bg-slate-50 border border-dashed border-slate-200 rounded-xl space-y-2">
                <AlertCircle className="h-5 w-5 mx-auto text-slate-400 animate-pulse" />
                <p className="text-[10px] font-semibold text-slate-500 leading-normal">
                  {t.noFoldersAlert}
                </p>
              </div>
            ) : (
              levelFolders.map(folder => {
                const isSelected = selectedFolderId === folder.id;
                return (
                  <div 
                    key={folder.id}
                    className="flex items-center justify-between group rounded-lg"
                  >
                    <button
                      onClick={() => setSelectedFolderId(folder.id)}
                      className={`flex-1 flex items-center gap-2 px-3 py-2 text-xs font-bold text-left rounded-lg transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-indigo-50 text-indigo-700' 
                          : 'hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <Folder className={`h-4 w-4 ${isSelected ? 'text-indigo-600 fill-indigo-100' : 'text-slate-400'}`} />
                      <span className="truncate">{folder.name}</span>
                    </button>

                    <button 
                      onClick={() => deleteFolder(folder.id)}
                      className="p-1 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity ml-1.5 text-slate-400 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </nav>
        </div>

        {/* Main Table view */}
        <div className="lg:col-span-9 space-y-6 text-left">
          {/* Toolbar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="relative flex-1 w-full">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all"
              />
            </div>

            <div className="flex flex-wrap gap-3.5 w-full md:w-auto">
              {/* Type selector */}
              <select
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value as any)}
                className="px-3.5 py-2 border border-slate-200 bg-slate-50 rounded-xl text-xs font-bold outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all cursor-pointer"
              >
                <option value="all">{t.filterType}: {t.allQuestions}</option>
                <option value="mcq">{t.mcq}</option>
                <option value="essay">{t.essay}</option>
              </select>

              {/* Difficulty filter */}
              <select
                value={difficultyFilter}
                onChange={e => setDifficultyFilter(e.target.value as any)}
                className="px-3.5 py-2 border border-slate-200 bg-slate-50 rounded-xl text-xs font-bold outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all cursor-pointer"
              >
                <option value="all">{t.filterDifficulty}: All</option>
                <option value="easy">{t.easy}</option>
                <option value="medium">{t.medium}</option>
                <option value="hard">{t.hard}</option>
              </select>


              {/* Manual builder */}
              <button
                onClick={() => handleOpenEditor()}
                disabled={!selectedFolderId}
                className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all disabled:opacity-50 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>{t.addQuestionBtn}</span>
              </button>
            </div>
          </div>

          {/* Questions grid table list */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            {filteredQuestions.length === 0 ? (
              <div className="p-12 text-center text-slate-400 space-y-3">
                <AlertCircle className="h-10 w-10 mx-auto text-slate-300 animate-bounce" />
                <p className="text-sm font-semibold">No questions matching filters in this unit folder.</p>
              </div>
            ) : (
              <table className="w-full text-left text-sm text-slate-500">
                <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">{t.colTitle}</th>
                    <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">{t.colType}</th>
                    <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">{t.colDifficulty}</th>
                    <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">{t.colActions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-600">
                  {filteredQuestions.map(q => (
                    <tr key={q.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 text-slate-900 font-bold max-w-md truncate">{q.title}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                          q.type === 'mcq' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {q.type === 'mcq' ? t.mcq : t.essay}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${
                          q.difficulty === 'easy' ? 'bg-emerald-50 text-emerald-700' : q.difficulty === 'medium' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                        }`}>
                          {q.difficulty === 'easy' && t.easy}
                          {q.difficulty === 'medium' && t.medium}
                          {q.difficulty === 'hard' && t.hard}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex gap-3.5">
                        <button 
                          onClick={() => handleOpenEditor(q)}
                          className="text-indigo-600 hover:text-indigo-700 cursor-pointer"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => deleteQuestion(q.id)}
                          className="text-rose-600 hover:text-rose-700 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* 1. Modal Folder creation */}
      {showFolderModal && (
        <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateFolder} className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-sm w-full p-8 space-y-5 text-left">
            <h3 className="font-bold text-slate-900">{t.addFolderBtn}</h3>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Folder Name</label>
              <input
                type="text"
                required
                value={newFolderName}
                onChange={e => setNewFolderName(e.target.value)}
                placeholder="Unit 2: Organic Compounds"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-100"
              >
                {t.addFolderBtn}
              </button>
              <button
                type="button"
                onClick={() => setShowFolderModal(false)}
                className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold py-3 rounded-xl transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}


      {/* 3. Modal Question Editor */}
      {showQuestionModal && (
        <QuestionFormModal
          initialQuestion={editingQuestion}
          defaultType="mcq"
          defaultGrade={selectedFolderId ? folders.find(f => f.id === selectedFolderId)?.level : 'g3'}
          onSave={(savedQ) => {
            if (editingQuestion) {
              updateQuestion({ ...editingQuestion, ...savedQ });
            } else {
              addQuestion({ ...savedQ, folderId: selectedFolderId || '' } as Question);
            }
            setShowQuestionModal(false);
            setEditingQuestion(null);
          }}
          onClose={() => {
            setShowQuestionModal(false);
            setEditingQuestion(null);
          }}
        />
      )}


    </div>
  );
}
