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
    activeLevels,
    setActiveLevels
  } = useAppState();

  const allAvailableLevels = [
    { id: 'prep1', en: 'First Preparatory', ar: 'الصف الأول الإعدادي', subEn: 'Grade 7 Curriculum', subAr: 'منهج الصف الأول الإعدادي', labelNum: '١' },
    { id: 'prep2', en: 'Second Preparatory', ar: 'الصف الثاني الإعدادي', subEn: 'Grade 8 Curriculum', subAr: 'منهج الصف الثاني الإعدادي', labelNum: '٢' },
    { id: 'prep3', en: 'Third Preparatory', ar: 'الصف الثالث الإعدادي', subEn: 'Grade 9 Curriculum', subAr: 'منهج الصف الثالث الإعدادي', labelNum: '٣' },
    { id: 'g1', en: 'First Secondary', ar: 'الصف الأول الثانوي', subEn: 'Grade 10 Curriculum', subAr: 'منهج الصف الأول الثانوي', labelNum: '١' },
    { id: 'g2', en: 'Second Secondary', ar: 'الصف الثاني الثانوي', subEn: 'Grade 11 Curriculum', subAr: 'منهج الصف الثاني الثانوي', labelNum: '٢' },
    { id: 'g3', en: 'Third Secondary', ar: 'الصف الثالث الثانوي', subEn: 'Grade 12 Curriculum', subAr: 'منهج الصف الثالث الثانوي', labelNum: '٣' },
  ];

  // State filters
  const [selectedLevel, setSelectedLevel] = useState<string>(() => {
    return activeLevels.length > 0 ? activeLevels[0] : 'g3';
  });
  
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(() => {
    const initialLevel = activeLevels.length > 0 ? activeLevels[0] : 'g3';
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

  const [showAIModal, setShowAIModal] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiDifficulty, setAiDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [aiGradeLevel, setAiGradeLevel] = useState<'Grade 1' | 'Grade 2' | 'Grade 3'>('Grade 3');
  const [aiQuestionType, setAiQuestionType] = useState<'mcq' | 'essay'>('mcq');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiGeneratedQuestion, setAiGeneratedQuestion] = useState<Question | null>(null);

  // Level configuration state
  const [showLevelConfigModal, setShowLevelConfigModal] = useState(false);
  const [tempActiveLevels, setTempActiveLevels] = useState<string[]>(activeLevels);

  // Sync tempActiveLevels when activeLevels context changes
  React.useEffect(() => {
    setTempActiveLevels(activeLevels);
  }, [activeLevels]);

  // Keep selectedLevel valid
  React.useEffect(() => {
    if (activeLevels.length > 0 && !activeLevels.includes(selectedLevel)) {
      setSelectedLevel(activeLevels[0]);
    }
  }, [activeLevels, selectedLevel]);

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

  // Sync AI grade level with active level when AI modal opens or level changes
  React.useEffect(() => {
    const levelInfo = allAvailableLevels.find(l => l.id === selectedLevel);
    if (levelInfo) {
      setAiGradeLevel((currentLanguage === 'en' ? levelInfo.en : levelInfo.ar) as any);
    } else {
      setAiGradeLevel('Grade 3');
    }
  }, [selectedLevel, currentLanguage]);

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
      aiGenerateBtn: "AI Generate",
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
      aiTitle: "AI Question Generator",
      aiPromptLabel: "Describe Topic / Text Material",
      aiPromptPlaceholder: "Example: Explain the concepts of electrical resistance and calculate values in parallel...",
      aiSubmit: "Generate Questions",
      aiGradeLabel: "Target Grade Level",
      aiTypeLabel: "Question Type",
      aiGrade1: "Grade 1",
      aiGrade2: "Grade 2",
      aiGrade3: "Grade 3",
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
      aiReviewTitle: "Review AI Generated Question",
      aiReviewSubtitle: "Preview how this generated question will look. You can add it to the bank, regenerate, or adjust prompt.",
      aiApproveBtn: "Approve & Save",
      aiRegenerateBtn: "Regenerate Question",
      aiAdjustBtn: "Adjust Prompt",
      aiCorrectAnswer: "Correct Option"
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

  // Helper to generate a new simulated question with high-fidelity variants
  const generateSimulatedQuestion = (): Question => {
    const gradeLabel = aiGradeLevel === 'Grade 1' ? 'Grade 1' : aiGradeLevel === 'Grade 2' ? 'Grade 2' : 'Grade 3';
    const gradeEmoji = aiGradeLevel === 'Grade 1' ? '📘' : aiGradeLevel === 'Grade 2' ? '📙' : '📕';
    const randomSeed = Math.floor(Math.random() * 100);
    const topic = aiPrompt.trim() || 'Physics';

    if (aiQuestionType === 'mcq') {
      const optionsPools = [
        [
          `Option A: The primary rate of change is proportional to $k [A]^2$.`,
          `Option B: The system state satisfies the relation $\\Delta G = \\Delta H - T\\Delta S$.`,
          `Option C: The equivalent resonance is described by $\\omega = \\frac{1}{\\sqrt{LC}}$.`,
          `Option D: No significant correlation is found with the topic "${topic}".`
        ],
        [
          `Answer A: The rate of heat transfer is governed by Fourier's law: $q = -k \\nabla T$.`,
          `Answer B: The maximum work output is calculated using $W_{max} = -\\Delta H$.`,
          `Answer C: The steady-state equilibrium satisfies the condition $dQ/dt = 0$.`,
          `Answer D: The energy efficiency is given by $\\eta = 1 - \\frac{T_C}{T_H}$.`
        ],
        [
          `Selection A: The electric field strength is given by $E = \\frac{V}{d}$.`,
          `Selection B: The force is calculated using Coulomb's Law: $F = k_e \\frac{q_1 q_2}{r^2}$.`,
          `Selection C: The total capacitance in parallel is $C_{eq} = C_1 + C_2$.`,
          `Selection D: The magnetic flux is constant through the closed surface.`
        ]
      ];
      
      const chosenPool = optionsPools[randomSeed % optionsPools.length];
      
      return {
        id: `q-ai-${Date.now()}`,
        title: `${gradeEmoji} [AI] ${gradeLabel} (${aiDifficulty === 'easy' ? 'Easy' : aiDifficulty === 'medium' ? 'Medium' : 'Hard'}): How does the principle of "${topic}" affect the overall system equilibrium under standard conditions? (Variant #${randomSeed})`,
        type: 'mcq',
        difficulty: aiDifficulty,
        options: chosenPool,
        correctOption: randomSeed % 4,
        folderId: selectedFolderId || ''
      };
    } else {
      const essayAnswers = [
        `To explain "${topic}" in detail, we must first define the core variables. Next, outline the boundary conditions and state equations. Finally, demonstrate a sample calculation showing how the theory correlates with practical measurements (e.g., error margin within $\\pm 5\\%$).`,
        `The phenomenon of "${topic}" is governed by fundamental conservation laws. We analyze the system by setting up a differential equation representing the rate of change over time, then solving it using the initial state parameters.`,
        `Begin by stating the physical interpretation of "${topic}". Highlight the key differences between the ideal model and real-world observations, focusing on dampening forces, friction, or resistance.`
      ];
      
      const chosenAnswer = essayAnswers[randomSeed % essayAnswers.length];
      
      return {
        id: `q-ai-${Date.now()}`,
        title: `${gradeEmoji} [AI] ${gradeLabel} (${aiDifficulty === 'easy' ? 'Easy' : aiDifficulty === 'medium' ? 'Medium' : 'Hard'}): Discuss the physical/chemical implications of "${topic}" in high-performance applications. (Variant #${randomSeed})`,
        type: 'essay',
        difficulty: aiDifficulty,
        modelAnswer: chosenAnswer,
        folderId: selectedFolderId || ''
      };
    }
  };

  const runAIGeneration = () => {
    if (!aiPrompt || !selectedFolderId) return;
    setAiGenerating(true);
    setTimeout(() => {
      setAiGeneratedQuestion(generateSimulatedQuestion());
      setAiGenerating(false);
    }, 1200);
  };

  const handleAIGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    runAIGeneration();
  };

  const handleApproveAIGenerated = () => {
    if (!aiGeneratedQuestion) return;
    addQuestion(aiGeneratedQuestion);
    setAiGeneratedQuestion(null);
    setShowAIModal(false);
    setAiPrompt('');
  };

  const handleCancelAIGenerate = () => {
    setAiGeneratedQuestion(null);
    setShowAIModal(false);
    setAiPrompt('');
  };

  const handleAdjustAIGenerate = () => {
    setAiGeneratedQuestion(null);
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
                ? "Organize your curriculum folders, manually author items, or generate new learning assessments using AI for each specific grade level."
                : "نظّم المجلدات الدراسية لكل مرحلة، واصنع أسئلتك يدويًا أو ولّدها بالذكاء الاصطناعي مع تقسيم ذكي وسلس للمستويات الدراسية."}
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
        {activeLevels.length === 0 ? (
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
            {activeLevels.map((levelId) => {
              const levelInfo = allAvailableLevels.find(l => l.id === levelId) || allAvailableLevels[3];
              const isSelected = selectedLevel === levelId;
              const stats = getLevelStats(levelId);
              
              const levelTitle = currentLanguage === 'en' ? levelInfo.en : levelInfo.ar;
              const levelSub = currentLanguage === 'en' ? levelInfo.subEn : levelInfo.subAr;

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
                      {levelInfo.labelNum}
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

              {/* AI Generator Trigger */}
              <button
                onClick={() => setShowAIModal(true)}
                disabled={!selectedFolderId}
                className="bg-indigo-50 text-indigo-600 border border-indigo-200 hover:bg-indigo-100 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
                <span>{t.aiGenerateBtn}</span>
              </button>

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

      {/* 2. Modal AI Generator */}
      {showAIModal && (
        <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          {aiGeneratedQuestion ? (
            /* AI Question Review View */
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-2xl w-full p-8 space-y-6 text-left animate-fade-in my-8">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5 text-indigo-600">
                  <Sparkles className="h-5 w-5 animate-pulse" />
                  <h3 className="font-extrabold text-slate-950 text-sm">{t.aiReviewTitle}</h3>
                </div>
                <button 
                  onClick={handleCancelAIGenerate}
                  className="text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                {t.aiReviewSubtitle}
              </p>

              {/* Student View Live Preview Card */}
              <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50/50 shadow-inner relative">
                <div className="flex justify-between items-center mb-5">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Live Preview</span>
                  <div className="flex gap-2">
                    <span className="bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase">
                      {aiGeneratedQuestion.type === 'mcq' ? t.mcq : t.essay}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                      aiGeneratedQuestion.difficulty === 'easy' ? 'bg-emerald-100 text-emerald-700' : 
                      aiGeneratedQuestion.difficulty === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {aiGeneratedQuestion.difficulty}
                    </span>
                  </div>
                </div>

                {/* Question Title */}
                <div className="text-base font-extrabold text-slate-900 mb-6 leading-relaxed">
                  <MathRenderer text={aiGeneratedQuestion.title} />
                </div>

                {/* Question Body */}
                {aiGeneratedQuestion.type === 'mcq' ? (
                  <div className="space-y-2.5">
                    {aiGeneratedQuestion.options?.map((opt, idx) => {
                      const isCorrect = aiGeneratedQuestion.correctOption === idx;
                      return (
                        <div 
                          key={idx} 
                          className={`flex items-center gap-3.5 p-3 rounded-xl border-2 transition-all ${
                            isCorrect 
                              ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900' 
                              : 'border-slate-200 bg-white text-slate-700'
                          }`}
                        >
                          <div className={`h-5 w-5 flex-shrink-0 rounded-full border-2 flex items-center justify-center text-xs font-extrabold ${
                            isCorrect ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300 text-slate-400'
                          }`}>
                            {String.fromCharCode(65 + idx)}
                          </div>
                          <span className="text-xs font-bold leading-relaxed flex-1">
                            <MathRenderer text={opt} />
                          </span>
                          {isCorrect && (
                            <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded uppercase tracking-wide">
                              {t.aiCorrectAnswer}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t.modelLabel}</label>
                    <div className="w-full p-4 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 leading-relaxed max-h-48 overflow-y-auto shadow-sm">
                      <MathRenderer text={aiGeneratedQuestion.modelAnswer || ''} />
                    </div>
                  </div>
                )}
              </div>

              {/* Loader inside Review Modal if regenerating */}
              {aiGenerating ? (
                <div className="flex flex-col items-center justify-center py-6 space-y-3.5">
                  <div className="h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-bold text-indigo-600 animate-pulse">Regenerating variant...</span>
                </div>
              ) : (
                /* Actions */
                <div className="flex flex-col sm:flex-row gap-3 pt-3">
                  <button
                    onClick={handleApproveAIGenerated}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 rounded-xl transition-all shadow-md shadow-emerald-100 flex items-center justify-center gap-1.5 cursor-pointer text-xs uppercase tracking-wider"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{t.aiApproveBtn}</span>
                  </button>

                  <button
                    onClick={runAIGeneration}
                    className="flex-1 bg-indigo-50 border border-indigo-200 text-indigo-600 hover:bg-indigo-100 font-extrabold py-3.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs uppercase tracking-wider"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>{t.aiRegenerateBtn}</span>
                  </button>

                  <button
                    onClick={handleAdjustAIGenerate}
                    className="sm:px-5 py-3.5 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl transition-all text-xs uppercase tracking-wider cursor-pointer text-center"
                  >
                    {t.aiAdjustBtn}
                  </button>

                  <button
                    onClick={handleCancelAIGenerate}
                    className="sm:px-5 py-3.5 border border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-slate-600 font-semibold rounded-xl transition-all text-xs uppercase tracking-wider cursor-pointer text-center"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* AI Question Setup Form (Original) */
            <form onSubmit={handleAIGenerate} className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-8 space-y-5 text-left animate-fade-in animate-duration-300">
              <div className="flex items-center gap-2 text-indigo-600">
                <Sparkles className="h-5 w-5" />
                <h3 className="font-bold text-slate-900">{t.aiTitle}</h3>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">{t.aiPromptLabel}</label>
                <textarea
                  rows={4}
                  required
                  value={aiPrompt}
                  onChange={e => setAiPrompt(e.target.value)}
                  placeholder={t.aiPromptPlaceholder}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">{t.aiGradeLabel}</label>
                <div className="grid grid-cols-3 gap-3.5">
                  {(['Grade 1', 'Grade 2', 'Grade 3'] as const).map(grade => (
                    <button
                      key={grade}
                      type="button"
                      onClick={() => setAiGradeLevel(grade)}
                      className={`py-2 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer ${
                        aiGradeLevel === grade ? 'border-indigo-600 bg-indigo-50/20 text-indigo-700' : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      {grade === 'Grade 1' ? t.aiGrade1 : grade === 'Grade 2' ? t.aiGrade2 : t.aiGrade3}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">{t.aiTypeLabel}</label>
                <div className="grid grid-cols-2 gap-3.5">
                  <button
                    type="button"
                    onClick={() => setAiQuestionType('mcq')}
                    className={`py-2 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer ${
                      aiQuestionType === 'mcq' ? 'border-indigo-600 bg-indigo-50/20 text-indigo-700' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    {t.mcq}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAiQuestionType('essay')}
                    className={`py-2 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer ${
                      aiQuestionType === 'essay' ? 'border-indigo-600 bg-indigo-50/20 text-indigo-700' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    {t.essay}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Question difficulty level</label>
                <div className="grid grid-cols-3 gap-3.5">
                  {(['easy', 'medium', 'hard'] as const).map(diff => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setAiDifficulty(diff)}
                      className={`py-2 rounded-xl text-xs font-bold border-2 transition-all capitalize cursor-pointer ${
                        aiDifficulty === diff ? 'border-indigo-600 bg-indigo-50/20 text-indigo-700' : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={aiGenerating}
                  className="flex-1 bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 flex items-center justify-center gap-2 cursor-pointer text-xs"
                >
                  {aiGenerating ? (
                    <>
                      <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span>{t.aiSubmit}</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCancelAIGenerate}
                  className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold py-3 rounded-xl transition-all cursor-pointer text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
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
              {/* Preparatory School Section */}
              <div className="space-y-2.5">
                <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1">
                  {currentLanguage === 'en' ? 'Preparatory Stage' : 'المرحلة الإعدادية'}
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {allAvailableLevels.slice(0, 3).map((level) => {
                    const isChecked = tempActiveLevels.includes(level.id);
                    return (
                      <label 
                        key={level.id}
                        className={`flex items-center justify-between p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
                          isChecked 
                            ? 'border-indigo-600 bg-indigo-50/20 text-indigo-900 font-bold' 
                            : 'border-slate-100 hover:border-slate-200 text-slate-700 font-semibold'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input 
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setTempActiveLevels([...tempActiveLevels, level.id]);
                              } else {
                                setTempActiveLevels(tempActiveLevels.filter(id => id !== level.id));
                              }
                            }}
                            className="h-4.5 w-4.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                          <span className="text-xs">{currentLanguage === 'en' ? level.en : level.ar}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-bold bg-slate-100 px-2 py-0.5 rounded uppercase">
                          {currentLanguage === 'en' ? 'Prep' : 'إعدادي'}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Secondary School Section */}
              <div className="space-y-2.5 pt-2">
                <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1">
                  {currentLanguage === 'en' ? 'Secondary Stage' : 'المرحلة الثانوية'}
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {allAvailableLevels.slice(3).map((level) => {
                    const isChecked = tempActiveLevels.includes(level.id);
                    return (
                      <label 
                        key={level.id}
                        className={`flex items-center justify-between p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
                          isChecked 
                            ? 'border-indigo-600 bg-indigo-50/20 text-indigo-900 font-bold' 
                            : 'border-slate-100 hover:border-slate-200 text-slate-700 font-semibold'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input 
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setTempActiveLevels([...tempActiveLevels, level.id]);
                              } else {
                                setTempActiveLevels(tempActiveLevels.filter(id => id !== level.id));
                              }
                            }}
                            className="h-4.5 w-4.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                          <span className="text-xs">{currentLanguage === 'en' ? level.en : level.ar}</span>
                        </div>
                        <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded uppercase">
                          {currentLanguage === 'en' ? 'Sec' : 'ثانوي'}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Warning Alert */}
            <div className="flex gap-2.5 items-start bg-slate-50 p-4.5 rounded-2xl border border-slate-200/60">
              <AlertCircle className="h-4.5 w-4.5 text-indigo-500 flex-shrink-0 mt-0.5" />
              <p className="text-[10px] text-slate-500 leading-normal font-semibold">
                {currentLanguage === 'en'
                  ? 'Note: Deselecting a level hides it from your dashboard tabs. Existing folder resources and questions are preserved and not deleted.'
                  : 'ملاحظة: إلغاء تحديد مرحلة دراسية يخفيها من لوحة التحكم، لكن يتم الحفاظ على المجلدات والأسئلة الحالية ولا يتم حذفها.'}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setActiveLevels(tempActiveLevels);
                  setShowLevelConfigModal(false);
                }}
                className="flex-1 bg-indigo-650 hover:bg-indigo-600 text-white font-extrabold py-3.5 rounded-xl transition-all shadow-md shadow-indigo-100 cursor-pointer text-xs uppercase tracking-wider text-center"
              >
                {currentLanguage === 'en' ? 'Save Changes' : 'حفظ الإعدادات'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setTempActiveLevels(activeLevels);
                  setShowLevelConfigModal(false);
                }}
                className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold py-3.5 rounded-xl transition-all cursor-pointer text-xs uppercase tracking-wider text-center"
              >
                {currentLanguage === 'en' ? 'Cancel' : 'إلغاء'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
