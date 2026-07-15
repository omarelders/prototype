import React, { useState } from 'react';
import { useAppState } from '../../../shared/context/AppState';
import { Question, QuestionFolder } from '../../../shared/types';
import MathRenderer from '../../../shared/components/MathRenderer';
import QuestionFormModal from '../../../shared/components/QuestionFormModal';
import { 
  Folder, 
  FolderPlus, 
  Plus, 
  Sparkles, 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  HelpCircle,
  AlertCircle,
  Bold,
  Italic,
  Underline,
  Table,
  Calculator,
  FlaskConical,
  Image,
  List,
  ListOrdered,
  Pilcrow,
  X,
  GraduationCap,
  Settings
} from 'lucide-react';

export default function QuestionBank() {
  const { 
    currentLanguage, 
    folders, 
    questions, 
    addFolder, 
    deleteFolder, 
    addQuestion, 
    updateQuestion, 
    deleteQuestion,
    academicLevels,
    addAcademicLevel,
    deleteAcademicLevel
  } = useAppState();

  // State filters
  const [selectedLevel, setSelectedLevel] = useState<string>(() => {
    return academicLevels.length > 0 ? academicLevels[0].id : 'g3';
  });
  
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(() => {
    const initialLevel = academicLevels.length > 0 ? academicLevels[0].id : 'g3';
    const initialFolders = folders.filter(f => (f.level || 'g3') === initialLevel);
    return initialFolders.length > 0 ? initialFolders[0].id : null;
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'mcq' | 'essay'>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

  // Modal control
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  // Level configuration state
  const [showLevelConfigModal, setShowLevelConfigModal] = useState(false);
  const [newStageName, setNewStageName] = useState('');

  // Keep selectedLevel valid
  React.useEffect(() => {
    if (academicLevels.length > 0 && !academicLevels.find(l => l.id === selectedLevel)) {
      setSelectedLevel(academicLevels[0].id);
    }
  }, [academicLevels, selectedLevel]);

  // Sync selectedFolderId when selectedLevel or folders change
  React.useEffect(() => {
    const levelFolders = folders.filter(f => (f.level || 'g3') === selectedLevel);
    if (levelFolders.length > 0) {
      const isSelectedFolderInLevel = levelFolders.some(f => f.id === selectedFolderId);
      if (!isSelectedFolderInLevel) {
        setSelectedFolderId(levelFolders[0].id);
      }
    } else {
      setSelectedFolderId(null);
    }
  }, [selectedLevel, folders]);

  // Question Editor form state
  const [qTitle, setQTitle] = useState('');
  const [qType, setQType] = useState<'mcq' | 'essay'>('mcq');
  const [qDifficulty, setQDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [qOptions, setQOptions] = useState<string[]>(['', '', '', '']);
  const [qCorrect, setQCorrect] = useState(0);
  const [qModelAnswer, setQModelAnswer] = useState('');

  const getLevelStats = (level: string) => {
    const levelF = folders.filter(f => (f.level || 'g3') === level);
    const fIds = levelF.map(f => f.id);
    const levelQ = questions.filter(q => fIds.includes(q.folderId));
    return {
      foldersCount: levelF.length,
      questionsCount: levelQ.length
    };
  };

  const handleLevelChange = (level: string) => {
    setSelectedLevel(level);
    const filtered = folders.filter(f => (f.level || 'g3') === level);
    if (filtered.length > 0) {
      setSelectedFolderId(filtered[0].id);
    } else {
      setSelectedFolderId(null);
    }
  };

  const levelFolders = folders.filter(f => (f.level || 'g3') === selectedLevel);

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
      level: selectedLevel
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

  const handleSaveQuestion = (e: React.FormEvent) => {
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
    if (qLevel !== selectedLevel) return false;

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

  const handleInsertQuestionHTML = (openTag: string, closeTag: string) => {
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
      {/* Premium Level Selector Header */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-3xl p-6 md:p-8 shadow-xl border border-white/[0.08] relative overflow-hidden text-left">
        {/* Glow decorative effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2.5">
              <GraduationCap className="h-6 w-6 text-indigo-400" />
              <span>{t.levelSelectorTitle}</span>
            </h2>
            <p className="text-xs md:text-sm font-semibold text-slate-400 mt-1 max-w-xl leading-relaxed">
              {currentLanguage === 'en' 
                ? "Organize your curriculum folders and manually author items for each specific grade level."
                : "نظّم المجلدات الدراسية لكل مرحلة، واصنع أسئلتك يدويًا مع تقسيم ذكي وسلس للمستويات الدراسية."}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowLevelConfigModal(true)}
            className="flex-shrink-0 bg-indigo-600/80 hover:bg-indigo-650 text-white px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer border border-white/10 shadow-lg shadow-indigo-950/30"
          >
            <Settings className="h-4 w-4" />
            <span>{currentLanguage === 'en' ? 'Configure Levels' : 'إعداد المراحل الدراسية'}</span>
          </button>
        </div>

        {/* Level Switcher Cards Grid */}
        {academicLevels.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-8 bg-slate-900/60 border border-slate-800 rounded-2xl relative z-10 mt-8">
            <GraduationCap className="h-10 w-10 text-slate-500 mb-3.5 animate-bounce" />
            <h4 className="text-sm font-bold text-white mb-1.5">
              {currentLanguage === 'en' ? 'No Academic Levels Configured' : 'لم يتم إعداد مراحل دراسية'}
            </h4>
            <p className="text-xs text-slate-400 max-w-xs mb-5 leading-relaxed">
              {currentLanguage === 'en' 
                ? 'Select the stages and grade levels you teach to access folders and questions.'
                : 'يرجى تحديد المراحل والصفوف الدراسية التي تقوم بتدريسها للبدء.'}
            </p>
            <button
              onClick={() => setShowLevelConfigModal(true)}
              className="bg-indigo-650 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-indigo-950/40"
            >
              <Settings className="h-4 w-4" />
              <span>{currentLanguage === 'en' ? 'Configure Levels' : 'إعداد المراحل الدراسية'}</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8 relative z-10">
            {academicLevels.map((levelInfo) => {
              const levelId = levelInfo.id;
              const isSelected = selectedLevel === levelId;
              const stats = getLevelStats(levelId);
              
              const levelTitle = levelInfo.name;
              const levelSub = levelInfo.description || '';

              return (
                <button
                  key={levelId}
                  type="button"
                  onClick={() => handleLevelChange(levelId)}
                  className={`group text-left p-5 rounded-2xl border transition-all relative overflow-hidden duration-300 flex flex-col justify-between h-36 cursor-pointer ${
                    isSelected 
                      ? 'border-indigo-500 bg-slate-900/80 shadow-lg shadow-indigo-950/40 ring-1 ring-indigo-500/20 -translate-y-1' 
                      : 'border-slate-800 bg-slate-900/40 hover:bg-slate-900/60 hover:border-slate-700 hover:-translate-y-0.5'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient-xy" />
                  )}

                  <div className="flex justify-between items-start w-full">
                    <div className="space-y-1">
                      <span className="font-extrabold text-sm md:text-base text-white group-hover:text-indigo-200 transition-colors block">
                        {levelTitle}
                      </span>
                      <span className="font-semibold text-[10px] md:text-xs text-slate-400 block">
                        {levelSub}
                      </span>
                    </div>
                    
                    <div className={`h-8 w-8 rounded-full border border-slate-700/60 flex items-center justify-center font-extrabold text-xs transition-colors ${
                      isSelected ? 'bg-slate-800 text-white border-indigo-500/40' : 'bg-slate-950/60 text-slate-500 group-hover:text-slate-300'
                    }`}>
                      {levelInfo.labelNum || '•'}
                    </div>
                  </div>

                  <div className="flex gap-4 border-t border-slate-800/80 pt-3.5 mt-3.5 w-full text-[10px] md:text-xs font-bold text-slate-400">
                    <div className="flex items-center gap-1">
                      <Folder className="h-3.5 w-3.5 text-slate-500" />
                      <span>{stats.foldersCount} {t.foldersCountText}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <HelpCircle className="h-3.5 w-3.5 text-slate-500" />
                      <span>{stats.questionsCount} {t.questionsCountText}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

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

      {/* 4. Modal Academic Level Configurator */}
      {showLevelConfigModal && (
        <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-8 space-y-6 text-left my-8 text-slate-800 animate-fade-in">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-indigo-600">
                <Settings className="h-5 w-5" />
                <h3 className="font-extrabold text-slate-950 text-sm">
                  {currentLanguage === 'en' ? 'Configure Academic Levels' : 'إعداد المراحل الدراسية'}
                </h3>
              </div>
              <button 
                onClick={() => setShowLevelConfigModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs font-semibold text-slate-500 leading-relaxed">
              {currentLanguage === 'en' 
                ? 'Select the stages/grades you teach. Selected levels will be active on your dashboard.'
                : 'اختر المراحل والصفوف الدراسية التي تقوم بتدريسها، وسيتم تفعيل الصفوف المحددة في لوحة التحكم الخاصة بك.'}
            </p>

            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-1 gap-2">
                {academicLevels.map((level) => {
                  return (
                    <div 
                      key={level.id}
                      className={`flex items-center justify-between p-3.5 rounded-xl border-2 border-slate-100 hover:border-slate-200 text-slate-700 font-semibold transition-all`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs">{level.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {level.description && (
                           <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded uppercase">
                             {level.description}
                           </span>
                        )}
                        <button 
                          onClick={() => deleteAcademicLevel(level.id)}
                          className="text-slate-400 hover:text-rose-500 p-1 rounded-md transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
                {academicLevels.length === 0 && (
                  <p className="text-xs text-slate-500 text-center py-4">
                    {currentLanguage === 'en' ? 'No levels added yet.' : 'لم يتم إضافة أي مرحلة دراسية.'}
                  </p>
                )}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 mt-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newStageName}
                  onChange={(e) => setNewStageName(e.target.value)}
                  placeholder={currentLanguage === 'en' ? 'New level name (e.g., Grade 10)' : 'اسم المرحلة الجديدة (مثال: الصف الرابع)'}
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newStageName.trim()) {
                      addAcademicLevel({
                        id: `lvl-${Date.now()}`,
                        name: newStageName.trim(),
                        labelNum: (academicLevels.length + 1).toString()
                      });
                      setNewStageName('');
                    }
                  }}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer"
                >
                  {currentLanguage === 'en' ? 'Add' : 'إضافة'}
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3.5 pt-2">
              <button
                type="button"
                onClick={() => setShowLevelConfigModal(false)}
                className="w-full bg-indigo-650 hover:bg-indigo-600 text-white font-extrabold py-3.5 rounded-xl transition-all shadow-md shadow-indigo-100 cursor-pointer text-xs uppercase tracking-wider text-center"
              >
                {currentLanguage === 'en' ? 'Done' : 'تم'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
