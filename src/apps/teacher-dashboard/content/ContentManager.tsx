import React, { useState, useEffect } from 'react';
import { useAppState } from '../../../shared/context/AppState';
import { Lesson, LessonSection, ClassGroup, Question } from '../../../shared/types';
import MathRenderer from '../../../shared/components/MathRenderer';
import QuestionFormModal from '../../../shared/components/QuestionFormModal';
import AssignLessonsToGroupModal from '../../../shared/components/AssignLessonsToGroupModal';
import QuestionBank from '../question-bank/QuestionBank';
import ExamsManager from '../exams/ExamsManager';
import {
  BookOpen,
  Layers,
  FileText,
  Plus,
  Trash2,
  Video,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  RotateCw,
  Save,
  Sparkles,
  Upload,
  GripVertical,
  Edit2,
  X,
  PlayCircle,
  Folder,
  ChevronDown
} from 'lucide-react';

export default function ContentManager() {
  const {
    currentLanguage,
    lessons,
    addLesson,
    updateLesson,
    deleteLesson,
    classes,
    addClass,
    updateClass,
    exams,
    questions,
    addQuestion,
    folders,
    updateLessonGroupLinks,
    academicLevels,
    addAcademicLevel,
    deleteAcademicLevel
  } = useAppState();

  const [selectedGradeId, setSelectedGradeId] = useState<string | null>(null);
  const [showLevelConfigModal, setShowLevelConfigModal] = useState(false);
  const [newStageName, setNewStageName] = useState('');

  const [activeTab, setActiveTab] = useState<'lessons' | 'classes' | 'questions' | 'exams'>('lessons');

  // Translations
  const dict = {
    en: {
      lessons: "Lessons",
      classes: "Classes",
      questions: "Question Bank",
      exams: "Exams Lifecycle",
      createLessonBtn: "Create Lesson",
      createClassBtn: "Create Class",
      colTitle: "Lesson Title",
      colClass: "Target Class",
      colStatus: "Status",
      colActions: "Actions",
      published: "Published",
      draft: "Draft",
      sectionBuilder: "Section Builder",
      videoSection: "Video Section (Bunny Stream)",
      readingSection: "Reading Section (Rich Text + LaTeX)",
      exerciseSection: "Exercises Section",
      addVideo: "Add Video Section",
      addReading: "Add Reading Section",
      addExercises: "Add Exercises Section",
      aiGenerate: "AI Generate Questions",
      undo: "Undo",
      redo: "Redo",
      save: "Save Lesson",
      autosave: "Draft saved automatically at",
      modelAnswer: "Model Answer",
      classGroup: {
        name: "Class Name",
        desc: "Description",
        lessonsCount: "Lessons Linked",
        examsCount: "Exams Linked",
        addLesson: "+ Add Lesson",
        addExam: "+ Add Exam",
        noLessons: "No lessons added yet.",
        noExams: "No exams added yet."
      }
    },
    ar: {
      lessons: "الدروس والشروحات",
      classes: "الفصول",
      questions: "بنك الأسئلة والمحاور",
      exams: "الامتحانات والنتائج",
      createLessonBtn: "إنشاء درس جديد",
      createClassBtn: "إنشاء مجموعة جديدة",
      colTitle: "عنوان الدرس",
      colClass: "المجموعة المستهدفة",
      colStatus: "حالة النشر",
      colActions: "خيارات التحكم",
      published: "منشور للطلاب",
      draft: "مسودة",
      sectionBuilder: "محرر محتوى الدرس والفقرات",
      videoSection: "قسم الفيديو (مشغل Bunny Stream)",
      readingSection: "قسم القراءة والمقال (معادلات LaTeX)",
      exerciseSection: "قسم الأسئلة والتمارين",
      addVideo: "أضف فقرة فيديو",
      addReading: "أضف فقرة قراءة",
      addExercises: "أضف فقرة أسئلة تفاعلية",
      aiGenerate: "توليد الأسئلة بالذكاء الاصطناعي",
      undo: "تراجع",
      redo: "إعادة",
      save: "حفظ ونشر الدرس",
      autosave: "تم الحفظ التلقائي كمسودة الساعة",
      modelAnswer: "الإجابة النموذجية للتقييم",
      classGroup: {
        name: "اسم المجموعة الدراسية",
        desc: "الوصف والمنهج الدراسي",
        lessonsCount: "عدد الدروس المربوطة",
        examsCount: "عدد الامتحانات المربوطة",
        addLesson: "+ إضافة درس",
        addExam: "+ إضافة امتحان",
        noLessons: "لم يتم إضافة دروس بعد.",
        noExams: "لم يتم إضافة امتحانات بعد."
      }
    }
  };

  const t = dict[currentLanguage];

  const [showBuilder, setShowBuilder] = useState(false);
  const [builderLesson, setBuilderLesson] = useState<Lesson | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [draggedSectionIdx, setDraggedSectionIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  const [showClassBuilder, setShowClassBuilder] = useState(false);
  const [builderClass, setBuilderClass] = useState<ClassGroup | null>(null);
  const [selectedClassItem, setSelectedClassItem] = useState<{type: 'lesson'|'exam', index: number} | null>(null);

  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [qModalType, setQModalType] = useState<'mcq' | 'essay'>('mcq');
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);

  // New Lesson metadata states
  const [showCreateLessonModal, setShowCreateLessonModal] = useState(false);
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonDesc, setLessonDesc] = useState('');
  const [lessonThumbnail, setLessonThumbnail] = useState<string | null>(null);
  const [lessonTargetClass, setLessonTargetClass] = useState<string>('');
  const [lessonStatus, setLessonStatus] = useState<'draft' | 'published' | 'scheduled'>('published');

  // Hybrid linking states
  const [cGrade, setCGrade] = useState<string>('');
  const [cStatus, setCStatus] = useState<'active' | 'scheduled' | 'draft'>('active');
  const [lessonSubject, setLessonSubject] = useState('Chemistry');
  const [assignModalConfig, setAssignModalConfig] = useState<{ mode: 'lesson-to-groups' | 'group-to-lessons' | 'exam-to-groups' | 'group-to-exams'; sourceId: string; gradeFilter?: string; isOptionalStep?: boolean } | null>(null);
  const [preSelectedGroupId, setPreSelectedGroupId] = useState<string | null>(null);
  const [isNewLesson, setIsNewLesson] = useState(false);

  useEffect(() => {
    if (showCreateLessonModal) {
      if (preSelectedGroupId) {
        setLessonTargetClass(preSelectedGroupId);
      } else if (classes.length > 0 && !lessonTargetClass) {
        setLessonTargetClass(classes[0].id);
      }
    }
  }, [showCreateLessonModal, preSelectedGroupId, classes, lessonTargetClass]);

  const handleCreateLessonSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonTitle) return;

    const targetClassId = preSelectedGroupId || lessonTargetClass || (classes.length > 0 ? classes[0].id : 'c-1');
    const selectedClass = classes.find(c => c.id === targetClassId);

    const newL: Lesson = {
      id: `l-${Date.now()}`,
      title: lessonTitle,
      description: lessonDesc,
      status: lessonStatus,
      targetClass: targetClassId,
      sections: [],
      academicLevelId: selectedGradeId || selectedClass?.academicLevelId || 'g1',
      subject: lessonSubject
    };
    addLesson(newL);

    // Link this lesson to the class group immediately
    updateLessonGroupLinks({ lessonId: newL.id, linkedIds: [targetClassId] });

    if (preSelectedGroupId) {
      setPreSelectedGroupId(null);
    } else {
      setBuilderLesson(newL);
      setHistory([[]]);
      setHistoryIndex(0);
      setIsNewLesson(true);
      setShowBuilder(true);
    }

    setShowCreateLessonModal(false);
    // Clear fields
    setLessonTitle('');
    setLessonDesc('');
    setLessonThumbnail(null);
  };

  // Section Builder History state for Undo/Redo
  const [history, setHistory] = useState<LessonSection[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [autoSaveTime, setAutoSaveTime] = useState('');

  // 1. Lessons logic
  const handleOpenBuilder = (lesson?: Lesson) => {
    if (lesson) {
      setBuilderLesson(lesson);
      setHistory([lesson.sections]);
      setHistoryIndex(0);
    } else {
      const newL: Lesson = {
        id: `l-${Date.now()}`,
        title: currentLanguage === 'en' ? 'New Chemistry Lecture' : 'محاضرة كيمياء جديدة',
        description: '',
        status: 'draft',
        targetClass: classes.length > 0 ? classes[0].id : 'c-1',
        sections: []
      };
      setBuilderLesson(newL);
      setHistory([[]]);
      setHistoryIndex(0);
    }
    setShowBuilder(true);
  };

  const updateBuilderSections = (newSections: LessonSection[]) => {
    if (!builderLesson) return;

    // Add to history stack
    const nextHistory = history.slice(0, historyIndex + 1);
    nextHistory.push(newSections);
    setHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);

    setBuilderLesson({
      ...builderLesson,
      sections: newSections
    });
  };

  // Undo / Redo
  const handleUndo = () => {
    if (historyIndex > 0 && builderLesson) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      setBuilderLesson({
        ...builderLesson,
        sections: history[prevIndex]
      });
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1 && builderLesson) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setBuilderLesson({
        ...builderLesson,
        sections: history[nextIndex]
      });
    }
  };

  // Simulate auto-save
  useEffect(() => {
    if (showBuilder && builderLesson) {
      const interval = setInterval(() => {
        const now = new Date();
        const timeStr = now.toTimeString().split(' ')[0];
        setAutoSaveTime(timeStr);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [showBuilder, builderLesson]);

  const handleAddSection = (type: 'video' | 'reading' | 'exercises') => {
    if (!builderLesson) return;
    const newSec: LessonSection = {
      id: `s-${Date.now()}`,
      type,
      videoUrl: type === 'video' ? 'https://iframe.mediadelivery.net/play/12345/bunny-demo' : undefined,
      videoDescription: type === 'video' ? 'Enter video explanation description here...' : undefined,
      readingContent: type === 'reading' ? '### Markdown Header\nWrite chemistry equations like $H_2O$ or LaTeX formulae like $\\int x^2 dx$ here.' : undefined,
      exerciseQuestionIds: type === 'exercises' ? [] : undefined
    };
    updateBuilderSections([...builderLesson.sections, newSec]);
    setSelectedSectionId(newSec.id);
  };

  const handleRemoveSection = (id: string) => {
    if (!builderLesson) return;
    updateBuilderSections(builderLesson.sections.filter(s => s.id !== id));
    if (selectedSectionId === id) setSelectedSectionId(null);
  };

  const handleMoveSection = (idx: number, direction: 'up' | 'down') => {
    if (!builderLesson) return;
    const newSecs = [...builderLesson.sections];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= newSecs.length) return;

    // Swap
    const temp = newSecs[idx];
    newSecs[idx] = newSecs[targetIdx];
    newSecs[targetIdx] = temp;
    updateBuilderSections(newSecs);
  };

  const handleSectionTextChange = (id: string, text: string) => {
    if (!builderLesson) return;
    const updated = builderLesson.sections.map(s => {
      if (s.id === id) {
        if (s.type === 'reading') return { ...s, readingContent: text };
        if (s.type === 'video') return { ...s, videoDescription: text };
      }
      return s;
    });
    // Set builder lesson directly without writing full history on every keyboard character stroke
    setBuilderLesson({ ...builderLesson, sections: updated });
  };

  const insertTextAtCursor = (
    textAreaId: string,
    sectionId: string,
    prefix: string,
    suffix: string = ''
  ) => {
    const textarea = document.getElementById(textAreaId) as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const selected = text.substring(start, end);
    const after = text.substring(end, text.length);

    const newText = before + prefix + selected + suffix + after;
    handleSectionTextChange(sectionId, newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    }, 0);
  };

  // AI Generator simulation inside Section Builder
  const handleToggleQuestion = (sectionId: string, qId: string) => {
    if (!builderLesson) return;
    const updated = builderLesson.sections.map(s => {
      if (s.id === sectionId && s.type === 'exercises') {
        const currentIds = s.exerciseQuestionIds || [];
        if (currentIds.includes(qId)) {
          return { ...s, exerciseQuestionIds: currentIds.filter(id => id !== qId) };
        } else {
          return { ...s, exerciseQuestionIds: [...currentIds, qId] };
        }
      }
      return s;
    });
    setBuilderLesson({ ...builderLesson, sections: updated });
  };

  const handleSaveLesson = () => {
    if (!builderLesson) return;

    const existing = lessons.find(l => l.id === builderLesson.id);
    const savedLesson = {
      ...builderLesson,
      status: 'published' as const,
      academicLevelId: builderLesson.academicLevelId || selectedGradeId || classes.find(c => c.id === builderLesson.targetClass)?.academicLevelId || 'g1',
      subject: builderLesson.subject || 'Chemistry'
    };

    if (existing) {
      updateLesson(savedLesson);
    } else {
      addLesson(savedLesson);
    }

    setShowBuilder(false);
    setBuilderLesson(null);

    // If it was a newly created lesson, open AssignModal!
    if (isNewLesson) {
      setAssignModalConfig({
        mode: 'lesson-to-groups',
        sourceId: savedLesson.id,
        gradeFilter: savedLesson.academicLevelId,
        isOptionalStep: true
      });
      setIsNewLesson(false);
    }
  };

  // 2. Class creation logic
  const [showClassModal, setShowClassModal] = useState(false);
  const [cName, setCName] = useState('');
  const [cDesc, setCDesc] = useState('');

  useEffect(() => {
    if (showClassModal) {
      if (selectedGradeId) {
        setCGrade(selectedGradeId);
      } else if (academicLevels.length > 0 && !cGrade) {
        setCGrade(academicLevels[0].id);
      }
    }
  }, [showClassModal, selectedGradeId, academicLevels, cGrade]);

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cName) return;
    const newClass: ClassGroup = {
      id: `c-${Date.now()}`,
      name: cName,
      description: cDesc,
      lessonIds: [],
      examIds: [],
      academicLevelId: cGrade || (academicLevels.length > 0 ? academicLevels[0].id : 'g1'),
      status: cStatus
    };
    addClass(newClass);
    setShowClassModal(false);
    setCName('');
    setCDesc('');
    setCStatus('active');

    setBuilderClass(newClass);
    setShowClassBuilder(true);
  };

  const handleOpenClassBuilder = (cls: ClassGroup) => {
    setBuilderClass(cls);
    setShowClassBuilder(true);
  };

  return (
    <div className="space-y-6">
      {selectedGradeId === null ? (
        <div className="w-full max-w-7xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                <Layers className="h-8 w-8 text-indigo-600" />
                <span>{currentLanguage === 'en' ? 'Curriculum Overview' : 'النظرة العامة للمناهج'}</span>
              </h2>
              <p className="text-sm font-medium text-slate-500 mt-2 max-w-xl leading-relaxed">
                {currentLanguage === 'en' 
                  ? "Select an academic grade to manage its educational content, classes, question banks, and examinations."
                  : "اختر مرحلة دراسية لإدارة محتواها التعليمي، فصولها، بنك الأسئلة، والامتحانات."}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowLevelConfigModal(true)}
              className="flex-shrink-0 bg-white hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all border border-slate-300 shadow-sm"
            >
              <Folder className="h-4 w-4 text-slate-500" />
              <span>{currentLanguage === 'en' ? 'Manage Grades' : 'إدارة المراحل الدراسية'}</span>
            </button>
          </div>

          {academicLevels.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center p-12 bg-slate-50 border border-slate-200 border-dashed rounded-3xl">
              <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                <BookOpen className="h-8 w-8 text-indigo-400" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">
                {currentLanguage === 'en' ? 'No Grades Configured Yet' : 'لم يتم إعداد مراحل دراسية بعد'}
              </h4>
              <p className="text-sm text-slate-500 max-w-md mb-6">
                {currentLanguage === 'en' 
                  ? 'Get started by configuring the academic grades and levels for your school or institution.'
                  : 'ابدأ بإعداد المراحل والمستويات الدراسية لمدرستك أو مؤسستك.'}
              </p>
              <button
                onClick={() => setShowLevelConfigModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-md"
              >
                {currentLanguage === 'en' ? 'Configure Your First Grade' : 'إعداد المرحلة الأولى'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {academicLevels.map((levelInfo) => (
                <button
                  key={levelInfo.id}
                  type="button"
                  onClick={() => setSelectedGradeId(levelInfo.id)}
                  className="group relative flex flex-col text-left bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all duration-300 overflow-hidden cursor-pointer h-full"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600 group-hover:scale-110 transition-transform duration-300">
                        <BookOpen className="h-6 w-6" />
                      </div>
                      <div className="h-8 w-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm">
                        {levelInfo.labelNum || '•'}
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
                      {levelInfo.name}
                    </h3>
                    <p className="text-sm text-slate-500 font-medium mb-6 line-clamp-2">
                      {levelInfo.description}
                    </p>
                    
                    <div className="mt-auto grid grid-cols-3 gap-2 pt-4 border-t border-slate-100">
                      <div className="flex flex-col items-center p-2 rounded-lg bg-slate-50 group-hover:bg-indigo-50/50 transition-colors">
                        <span className="text-lg font-bold text-slate-700">{lessons.filter(l => l.academicLevelId === levelInfo.id).length}</span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{currentLanguage === 'en' ? 'Lessons' : 'دروس'}</span>
                      </div>
                      <div className="flex flex-col items-center p-2 rounded-lg bg-slate-50 group-hover:bg-indigo-50/50 transition-colors">
                        <span className="text-lg font-bold text-slate-700">{classes.filter(c => c.academicLevelId === levelInfo.id).length}</span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{currentLanguage === 'en' ? 'Classes' : 'فصول'}</span>
                      </div>
                      <div className="flex flex-col items-center p-2 rounded-lg bg-slate-50 group-hover:bg-indigo-50/50 transition-colors">
                        <span className="text-lg font-bold text-slate-700">{exams.filter(e => e.academicLevelId === levelInfo.id).length}</span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{currentLanguage === 'en' ? 'Exams' : 'امتحانات'}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Back to Grades button */}
          <div className="flex items-center gap-4 mb-4">
            <button 
              onClick={() => setSelectedGradeId(null)}
              className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm"
            >
              <RotateCcw className="h-4 w-4" />
              {currentLanguage === 'en' ? 'Back to Grades' : 'العودة للمراحل'}
            </button>
            <h2 className="text-xl font-extrabold text-slate-800">
              {academicLevels.find(l => l.id === selectedGradeId)?.name}
            </h2>
          </div>

          {/* View Header Tabs */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-4 gap-4">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('lessons')}
            className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'lessons' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
              }`}
          >
            {t.lessons}
          </button>
          <button
            onClick={() => setActiveTab('classes')}
            className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'classes' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
              }`}
          >
            {t.classes}
          </button>
          <button
            onClick={() => setActiveTab('questions')}
            className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'questions' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
              }`}
          >
            {t.questions}
          </button>
          <button
            onClick={() => setActiveTab('exams')}
            className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'exams' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
              }`}
          >
            {t.exams}
          </button>
        </div>

        {activeTab === 'lessons' && (
          <button
            onClick={() => setShowCreateLessonModal(true)}
            className="bg-indigo-600 text-white px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-1.5 hover:bg-indigo-700 shadow-md transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>{t.createLessonBtn}</span>
          </button>
        )}

        {activeTab === 'classes' && (
          <button
            onClick={() => setShowClassModal(true)}
            className="bg-indigo-600 text-white px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-1.5 hover:bg-indigo-700 shadow-md transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>{t.createClassBtn}</span>
          </button>
        )}
      </div>

      {/* 1. Lessons Tab */}
      {activeTab === 'lessons' && !showBuilder && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.filter(l => l.academicLevelId === selectedGradeId).map(lesson => (
            <div
              key={lesson.id}
              className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all group flex flex-col overflow-hidden"
            >
              {/* Card Header (Cover Image/Color + Status) */}
              <div className="h-24 bg-gradient-to-br from-indigo-50 to-blue-50 relative flex items-start justify-between p-4">
                <div className="bg-white p-2 rounded-xl shadow-sm">
                  <BookOpen className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex px-2 py-1 rounded-md text-[10px] font-bold ${lesson.status === 'published' ? 'bg-emerald-500 text-white' : lesson.status === 'scheduled' ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                    {lesson.status === 'published' ? 'Active' : lesson.status === 'scheduled' ? 'Scheduled' : 'Draft'}
                  </span>
                  <div className="cursor-grab text-slate-400 hover:text-slate-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="h-4 w-4" />
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                    {classes.find(c => c.id === lesson.targetClass)?.name || 'General'}
                  </span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-lg line-clamp-1">{lesson.title}</h3>
                {lesson.description && (
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{lesson.description}</p>
                )}

                <div className="mt-auto pt-4 flex flex-wrap items-center gap-2">
                  <span className="bg-slate-50 text-slate-600 border border-slate-100 px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5">
                    <Layers className="h-3 w-3" />
                    {lesson.sections && lesson.sections.length > 0 ? `${lesson.sections.length} Sections` : 'Empty'}
                  </span>
                  {(() => {
                    const linkedGroups = classes.filter(cls => cls.lessonIds.includes(lesson.id));
                    const count = linkedGroups.length;
                    return (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setAssignModalConfig({
                            mode: 'lesson-to-groups',
                            sourceId: lesson.id,
                            gradeFilter: lesson.academicLevelId
                          });
                        }}
                        className="bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100 px-2 py-1 rounded-md text-xs font-extrabold flex items-center gap-1.5 cursor-pointer transition-all"
                        title={currentLanguage === 'en' ? 'Manage Linked Groups' : 'إدارة المجموعات المرتبطة'}
                      >
                        <Folder className="h-3 w-3" />
                        <span>
                          {currentLanguage === 'en' ? `${count} Groups` : `${count} مجموعات`}
                        </span>
                      </button>
                    );
                  })()}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="border-t border-slate-100 p-3 flex justify-between bg-slate-50">
                <button
                  onClick={() => deleteLesson(lesson.id)}
                  className="p-2 text-rose-500 hover:bg-rose-100 rounded-lg transition-colors flex items-center justify-center"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleOpenBuilder(lesson)}
                  className="flex-1 ml-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 py-2"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  {currentLanguage === 'en' ? 'Edit Content' : 'تعديل المحتوى'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 1.1 Section Builder Full screen editor mode */}
      {showBuilder && builderLesson && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-md p-6 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.sectionBuilder}</span>
              <input
                type="text"
                value={builderLesson.title}
                onChange={e => setBuilderLesson({ ...builderLesson, title: e.target.value })}
                className="block text-xl font-bold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-200 focus:border-indigo-600 outline-none w-full max-w-md py-1 mt-1"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Undo/Redo tools */}
              <div className="flex border border-slate-200 rounded-lg overflow-hidden">
                <button
                  onClick={handleUndo}
                  disabled={historyIndex <= 0}
                  className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 disabled:text-slate-300 transition-colors border-r border-slate-200"
                  title={t.undo}
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button
                  onClick={handleRedo}
                  disabled={historyIndex >= history.length - 1}
                  className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 disabled:text-slate-300 transition-colors"
                  title={t.redo}
                >
                  <RotateCw className="h-4 w-4" />
                </button>
              </div>

              {/* Autosave timer indicator */}
              {autoSaveTime && (
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-md animate-pulse">
                  {t.autosave} {autoSaveTime}
                </span>
              )}

              <button
                onClick={handleSaveLesson}
                className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-bold flex items-center gap-1.5 hover:bg-indigo-700 shadow-md transition-all"
              >
                <Save className="h-4 w-4" />
                <span>{t.save}</span>
              </button>

              <button
                onClick={() => { setShowBuilder(false); setBuilderLesson(null); }}
                className="border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
              >
                {currentLanguage === 'en' ? 'Cancel' : 'إلغاء'}
              </button>
            </div>
          </div>

          {/* Builder area: standard course builder layout */}
          <div className="flex flex-col lg:flex-row gap-6 min-h-[600px] h-full">
            {/* Left Sidebar: Curriculum Outline */}
            <div className="lg:w-[320px] shrink-0 border border-slate-200 rounded-2xl bg-slate-50 flex flex-col overflow-hidden max-h-[800px]">
              <div className="p-4 border-b border-slate-200 bg-white">
                <h4 className="font-bold text-slate-800 text-sm">Curriculum Outline</h4>
                <p className="text-xs text-slate-500 mt-1 font-medium">Drag items to reorder</p>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {builderLesson.sections.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <BookOpen className="h-8 w-8 mx-auto text-slate-300 mb-3" />
                    <p className="text-xs font-semibold">No content added yet.</p>
                  </div>
                ) : (
                  builderLesson.sections.map((section, idx) => (
                    <div
                      key={section.id}
                      draggable
                      onDragStart={(e) => {
                        setDraggedSectionIdx(idx);
                        e.dataTransfer.effectAllowed = 'move';
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOverIdx(idx);
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (draggedSectionIdx !== null && draggedSectionIdx !== idx) {
                          const newSecs = [...builderLesson.sections];
                          const [movedItem] = newSecs.splice(draggedSectionIdx, 1);
                          newSecs.splice(idx, 0, movedItem);
                          updateBuilderSections(newSecs);
                        }
                        setDraggedSectionIdx(null);
                        setDragOverIdx(null);
                      }}
                      onDragEnd={() => {
                        setDraggedSectionIdx(null);
                        setDragOverIdx(null);
                      }}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer group ${selectedSectionId === section.id
                          ? 'bg-indigo-50 border-indigo-200 shadow-sm ring-1 ring-indigo-500/20'
                          : dragOverIdx === idx
                            ? 'bg-indigo-50 border-indigo-400 border-dashed'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        } ${draggedSectionIdx === idx ? 'opacity-50' : ''}`}
                      onClick={() => setSelectedSectionId(section.id)}
                    >
                      <div className="flex items-center gap-3 overflow-hidden w-full">
                        <div className="cursor-grab text-slate-400 hover:text-slate-600 px-1 py-2">
                          <GripVertical className="h-4 w-4" />
                        </div>
                        <div className={`p-1.5 rounded-lg shrink-0 ${section.type === 'video' ? 'bg-blue-100 text-blue-600' :
                            section.type === 'reading' ? 'bg-amber-100 text-amber-600' :
                              'bg-emerald-100 text-emerald-600'
                          }`}>
                          {section.type === 'video' && <Video className="h-3.5 w-3.5" />}
                          {section.type === 'reading' && <FileText className="h-3.5 w-3.5" />}
                          {section.type === 'exercises' && <Layers className="h-3.5 w-3.5" />}
                        </div>
                        <span className={`text-xs font-bold truncate ${selectedSectionId === section.id ? 'text-indigo-900' : 'text-slate-700'}`}>
                          {section.type === 'video' ? 'Video Lesson' : section.type === 'reading' ? 'Reading Material' : 'Quiz & Exercises'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Add Content Toolbar */}
              <div className="p-4 border-t border-slate-200 bg-white grid grid-cols-1 gap-2 shrink-0">
                <button
                  onClick={() => handleAddSection('video')}
                  className="bg-blue-50/50 hover:bg-blue-50 border border-blue-100 text-blue-600 px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors w-full"
                >
                  <Video className="h-4 w-4" /> Add Video
                </button>
                <button
                  onClick={() => handleAddSection('reading')}
                  className="bg-amber-50/50 hover:bg-amber-50 border border-amber-100 text-amber-600 px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors w-full"
                >
                  <FileText className="h-4 w-4" /> Add Reading
                </button>
                <button
                  onClick={() => handleAddSection('exercises')}
                  className="bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-100 text-emerald-600 px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors w-full"
                >
                  <Layers className="h-4 w-4" /> Add Exercises
                </button>
              </div>
            </div>

            {/* Right Main Area: Content Editor */}
            <div className="flex-1 border border-slate-200 rounded-2xl bg-white p-6 shadow-sm relative min-h-[500px]">
              {(() => {
                const activeSection = builderLesson.sections.find(s => s.id === selectedSectionId);
                const activeIdx = builderLesson.sections.findIndex(s => s.id === selectedSectionId);

                if (!activeSection) {
                  return (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 space-y-4 bg-slate-50/30 rounded-2xl">
                      <BookOpen className="h-12 w-12 text-slate-200" />
                      <p className="text-sm font-semibold">Select an item from the curriculum outline to edit its content.</p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-6 h-full flex flex-col animate-fade-in">
                    {/* Header */}
                    <div className="flex flex-wrap sm:flex-nowrap items-center justify-between border-b border-slate-100 pb-4 gap-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${activeSection.type === 'video' ? 'bg-blue-50 text-blue-600' :
                            activeSection.type === 'reading' ? 'bg-amber-50 text-amber-600' :
                              'bg-emerald-50 text-emerald-600'
                          }`}>
                          {activeSection.type === 'video' && <Video className="h-5 w-5" />}
                          {activeSection.type === 'reading' && <FileText className="h-5 w-5" />}
                          {activeSection.type === 'exercises' && <Layers className="h-5 w-5" />}
                        </div>
                        <div>
                          <h3 className="font-extrabold text-slate-800 text-lg">
                            {activeSection.type === 'video' ? t.videoSection : activeSection.type === 'reading' ? t.readingSection : t.exerciseSection}
                          </h3>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Item #{activeIdx + 1}</p>
                        </div>
                      </div>

                      {/* Item Actions */}
                      <div className="flex items-center gap-1.5 shrink-0 bg-slate-50 p-1 rounded-xl border border-slate-200">
                        <button
                          onClick={() => handleMoveSection(activeIdx, 'up')}
                          disabled={activeIdx === 0}
                          className="p-2 rounded-lg hover:bg-white text-slate-600 disabled:opacity-50 transition-colors shadow-sm"
                          title="Move Up"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleMoveSection(activeIdx, 'down')}
                          disabled={activeIdx === builderLesson.sections.length - 1}
                          className="p-2 rounded-lg hover:bg-white text-slate-600 disabled:opacity-50 transition-colors shadow-sm"
                          title="Move Down"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </button>
                        <div className="w-px h-5 bg-slate-200 mx-1" />
                        <button
                          onClick={() => handleRemoveSection(activeSection.id)}
                          className="p-2 rounded-lg hover:bg-rose-50 hover:text-rose-600 text-slate-600 transition-colors"
                          title="Delete Item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Editor Body */}
                    <div className="flex-1 overflow-y-auto pr-2 pb-6">
                      {activeSection.type === 'video' && (
                        <div className="space-y-5">
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Upload Video</label>
                            <div className="border-2 border-dashed border-slate-200 hover:border-indigo-500/40 rounded-xl p-6 text-center hover:bg-slate-50 transition-all relative">
                              <input
                                type="file"
                                accept="video/*"
                                onChange={e => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const url = URL.createObjectURL(file);
                                    const updated = builderLesson.sections.map(s => s.id === activeSection.id ? { ...s, videoUrl: url } : s);
                                    setBuilderLesson({ ...builderLesson, sections: updated });
                                  }
                                }}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              />
                              <Upload className="h-8 w-8 mx-auto text-slate-400 mb-3" />
                              <p className="text-sm font-bold text-slate-600 mb-1">
                                {activeSection.videoUrl && activeSection.videoUrl.startsWith('blob:') ? 'Video selected. Click to replace.' : 'Drag & drop a video file here'}
                              </p>
                              <p className="text-xs text-slate-400">MP4, WebM, or OGG (max 500MB)</p>
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Video Explanation Caption</label>
                            <input
                              type="text"
                              value={activeSection.videoDescription || ''}
                              onChange={e => handleSectionTextChange(activeSection.id, e.target.value)}
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 transition-colors"
                            />
                          </div>
                          {/* Video Preview */}
                          {activeSection.videoUrl && activeSection.videoUrl.startsWith('blob:') ? (
                            <div className="rounded-2xl overflow-hidden shadow-lg mt-6 bg-black">
                              <video src={activeSection.videoUrl} controls className="w-full h-full max-h-[400px] object-contain" />
                            </div>
                          ) : (
                            <div className="aspect-video bg-slate-900 rounded-2xl flex items-center justify-center relative overflow-hidden shadow-lg mt-6">
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                              <PlayCircle className="h-16 w-16 text-white/50" />
                              <span className="absolute bottom-4 left-6 text-white/80 text-sm font-semibold">Video Preview</span>
                            </div>
                          )}
                        </div>
                      )}

                      {activeSection.type === 'reading' && (
                        <div className="space-y-6 flex flex-col h-full">
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Article Content (Markdown + LaTeX Support)</label>
                            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-600 transition-colors flex flex-col">
                              {/* Toolbar */}
                              <div className="flex flex-wrap items-center gap-1 bg-slate-50 border-b border-slate-200 p-2">
                                <button onClick={() => insertTextAtCursor(`editor-${activeSection.id}`, activeSection.id, '**', '**')} className="px-2.5 py-1.5 hover:bg-slate-200 rounded text-slate-700 font-extrabold text-sm transition-colors" title="Bold">B</button>
                                <div className="w-px h-4 bg-slate-300 mx-1" />
                                <button onClick={() => insertTextAtCursor(`editor-${activeSection.id}`, activeSection.id, '## ')} className="px-2.5 py-1.5 hover:bg-slate-200 rounded text-slate-700 font-bold text-sm transition-colors" title="Header 2">H2</button>
                                <button onClick={() => insertTextAtCursor(`editor-${activeSection.id}`, activeSection.id, '### ')} className="px-2.5 py-1.5 hover:bg-slate-200 rounded text-slate-700 font-bold text-sm transition-colors" title="Header 3">H3</button>
                                <div className="w-px h-4 bg-slate-300 mx-1" />
                                <button onClick={() => insertTextAtCursor(`editor-${activeSection.id}`, activeSection.id, '- ')} className="px-2.5 py-1.5 hover:bg-slate-200 rounded text-slate-700 font-bold text-sm transition-colors" title="Bullet List">• List</button>
                                <div className="w-px h-4 bg-slate-300 mx-1" />
                                <button onClick={() => insertTextAtCursor(`editor-${activeSection.id}`, activeSection.id, '$', '$')} className="px-2.5 py-1.5 hover:bg-slate-200 rounded text-slate-700 font-bold text-sm font-serif italic transition-colors" title="Inline Math">$x$</button>
                                <button onClick={() => insertTextAtCursor(`editor-${activeSection.id}`, activeSection.id, '\n$$\n', '\n$$\n')} className="px-2.5 py-1.5 hover:bg-slate-200 rounded text-slate-700 font-bold text-sm font-serif transition-colors" title="Block Math">∑ Math</button>
                              </div>
                              <textarea
                                id={`editor-${activeSection.id}`}
                                rows={12}
                                value={activeSection.readingContent || ''}
                                onChange={e => handleSectionTextChange(activeSection.id, e.target.value)}
                                placeholder="Write your article content here..."
                                className="w-full p-5 bg-white text-sm font-mono outline-none resize-y"
                              />
                            </div>
                          </div>
                          <div className="flex-1 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-4 border-b border-slate-100 pb-2">Live Preview</span>
                            <div className="text-sm text-slate-700 font-semibold leading-loose prose max-w-none">
                              <MathRenderer text={activeSection.readingContent || ''} />
                            </div>
                          </div>
                        </div>
                      )}

                      {activeSection.type === 'exercises' && (
                        <div className="space-y-6">
                          <div className="flex gap-4">
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

                          <div className="border border-slate-200 p-3 rounded-xl bg-slate-50 space-y-3">
                            {(() => {
                              const targetGrade = classes.find(c => c.id === builderLesson.targetClass)?.grade || builderLesson.grade || 'Grade 1';
                              const filteredBankQuestions = questions.filter(q => q.grade === targetGrade || !q.grade);
                              if (filteredBankQuestions.length === 0) {
                                return (
                                  <div className="text-center py-6 text-slate-400 font-semibold text-sm">
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
                                      <div className="p-2 space-y-2 bg-slate-50 border-t border-slate-100 max-h-[300px] overflow-y-auto">
                                        {folderQuestions.map(q => (
                                          <label key={q.id} className={`flex items-start gap-3 text-xs font-bold cursor-pointer p-3 rounded-xl border transition-all ${(activeSection.exerciseQuestionIds || []).includes(q.id) ? 'border-indigo-500 bg-white shadow-sm ring-1 ring-indigo-500/20' : 'border-slate-200 bg-white hover:border-slate-300'
                                            }`}>
                                            <input
                                              type="checkbox"
                                              checked={(activeSection.exerciseQuestionIds || []).includes(q.id)}
                                              onChange={() => handleToggleQuestion(activeSection.id, q.id)}
                                              className="h-4.5 w-4.5 text-indigo-600 focus:ring-indigo-500 rounded border-slate-300 mt-0.5"
                                            />
                                            <div className="flex-1">
                                              <span className="text-slate-800 text-sm line-clamp-2 leading-relaxed" dangerouslySetInnerHTML={{ __html: q.title }} />
                                              <div className="flex items-center gap-2 mt-2">
                                                <span className={`px-2 py-0.5 rounded text-[9px] uppercase tracking-wider font-extrabold ${q.type === 'mcq' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                                  {q.type}
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
                              defaultGrade={classes.find(c => c.id === builderLesson?.targetClass)?.grade || builderLesson?.grade || 'Grade 1'}
                              onSave={(savedQ) => {
                                const newQ: Question = {
                                  id: `q-${Date.now()}`,
                                  ...savedQ,
                                  folderId: folders.length > 0 ? folders[0].id : 'unassigned',
                                } as Question;
                                addQuestion(newQ);
                                handleToggleQuestion(activeSection.id, newQ.id);
                                setShowQuestionModal(false);
                              }}
                              onClose={() => setShowQuestionModal(false)}
                            />
                          )}

                          <div className="space-y-3 pt-4 border-t border-slate-100">
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1 border-b border-slate-100 pb-2">
                              {currentLanguage === 'en'
                                ? `${activeSection.exerciseQuestionIds?.length || 0} Linked Questions`
                                : `${activeSection.exerciseQuestionIds?.length || 0} أسئلة مرتبطة`}
                            </h4>
                            {activeSection.exerciseQuestionIds && activeSection.exerciseQuestionIds.length > 0 ? (
                              <div className="space-y-2">
                                {activeSection.exerciseQuestionIds.map((qId, qIdx) => {
                                  const qObj = questions.find(q => q.id === qId);
                                  return (
                                    <div key={qId} className="p-4 bg-white border border-slate-200 hover:border-slate-300 transition-colors rounded-xl flex justify-between items-center group shadow-sm">
                                      <div className="flex items-center gap-3">
                                        <span className="bg-slate-100 text-slate-500 font-bold text-[10px] px-2 py-1 rounded">#{qIdx + 1}</span>
                                        <span className="font-bold text-slate-800 text-sm max-w-[200px] sm:max-w-[300px] truncate" dangerouslySetInnerHTML={{ __html: qObj ? qObj.title : 'Practice Problem' }} />
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <span className={`px-2.5 py-1 rounded-md font-mono font-bold text-[10px] border ${qObj?.type === 'mcq' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                                          {qObj ? qObj.type.toUpperCase() : 'MCQ'}
                                        </span>
                                        <button
                                          onClick={() => handleToggleQuestion(activeSection.id, qId)}
                                          className="text-slate-400 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100 p-1"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center text-slate-400 bg-slate-50/50">
                                <p className="text-xs font-semibold">No questions added yet. Generate some or pick from bank.</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* 2. Classes Tab */}
      {activeTab === 'classes' && (
        <div className="space-y-6">
          {!showClassBuilder && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {classes.filter(c => c.academicLevelId === selectedGradeId).map(cls => (
                <div key={cls.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 relative flex flex-col group transition-all hover:shadow-md h-[240px]">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col items-start gap-2">
                      {cls.grade && (
                        <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-xs font-bold">
                          {cls.grade}
                        </span>
                      )}
                      <h4 className="font-extrabold text-slate-900 text-lg mt-2 line-clamp-1">{cls.name}</h4>
                    </div>
                    <div className="bg-indigo-50 text-indigo-600 p-3 rounded-xl shrink-0">
                      <Layers className="h-6 w-6" />
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6 line-clamp-2">{cls.description}</p>
                  
                  <div className="border-t border-slate-100 pt-4 flex justify-between mt-auto" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                    <div className="flex flex-col gap-1 w-1/2 items-start">
                      <span className="text-xs font-bold text-slate-500">
                        {currentLanguage === 'en' ? 'Linked Exams' : 'عدد الامتحانات المربوطة'}
                      </span>
                      <span className="font-extrabold text-slate-900">{cls.examIds.length}</span>
                    </div>
                    <div className="flex flex-col gap-1 w-1/2 items-start">
                      <span className="text-xs font-bold text-indigo-600">
                        {currentLanguage === 'en' ? 'Linked Lessons' : 'عدد الدروس المربوطة'}
                      </span>
                      <span className="font-extrabold text-slate-900">{cls.lessonIds.length}</span>
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center gap-3 z-10">
                    <button onClick={() => handleOpenClassBuilder(cls)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm">
                      <Edit2 className="h-4 w-4" /> {currentLanguage === 'en' ? 'Edit Class' : 'تعديل الفصل'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Class Builder */}
          {showClassBuilder && builderClass && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-md p-6 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.createClassBtn}</span>
                  <input
                    type="text"
                    value={builderClass.name}
                    onChange={e => setBuilderClass({ ...builderClass, name: e.target.value })}
                    className="block text-xl font-bold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-200 focus:border-indigo-600 outline-none w-full max-w-md py-1 mt-1"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      updateClass(builderClass);
                      setShowClassBuilder(false);
                      setBuilderClass(null);
                    }}
                    className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-bold flex items-center gap-1.5 hover:bg-indigo-700 shadow-md transition-all"
                  >
                    <Save className="h-4 w-4" />
                    <span>{currentLanguage === 'en' ? 'Save Class' : 'حفظ ونشر الفصل'}</span>
                  </button>
                  <button
                    onClick={() => { setShowClassBuilder(false); setBuilderClass(null); }}
                    className="border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                  >
                    {currentLanguage === 'en' ? 'Cancel' : 'إلغاء'}
                  </button>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-6 min-h-[600px] h-full">
                {/* Left Sidebar: Curriculum Outline */}
                <div className="lg:w-[320px] shrink-0 border border-slate-200 rounded-2xl bg-slate-50 flex flex-col overflow-hidden max-h-[800px]">
                  <div className="p-4 border-b border-slate-200 bg-white">
                    <h4 className="font-bold text-slate-800 text-sm">Curriculum Outline</h4>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Add Lessons and Exams</p>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {builderClass.lessonIds.length === 0 && builderClass.examIds.length === 0 ? (
                      <div className="text-center py-8 text-slate-400">
                        <BookOpen className="h-8 w-8 mx-auto text-slate-300 mb-3" />
                        <p className="text-xs font-semibold">No content added yet.</p>
                      </div>
                    ) : (
                      <>
                        {builderClass.lessonIds.map((lessonId) => (
                          <div key={`l-${lessonId}`} className="flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer bg-white border-slate-200 hover:border-slate-300">
                            <div className="flex items-center gap-3 overflow-hidden w-full">
                              <div className="cursor-grab text-slate-400 px-1 py-2"><GripVertical className="h-4 w-4" /></div>
                              <div className="p-1.5 rounded-lg shrink-0 bg-indigo-100 text-indigo-600"><BookOpen className="h-3.5 w-3.5" /></div>
                              <span className="text-xs font-bold truncate text-slate-700">Lesson: {lessons.find(l => l.id === lessonId)?.title || lessonId}</span>
                            </div>
                            <button onClick={() => setBuilderClass({ ...builderClass, lessonIds: builderClass.lessonIds.filter(id => id !== lessonId) })} className="text-slate-400 hover:text-rose-500"><Trash2 className="h-4 w-4" /></button>
                          </div>
                        ))}
                        {builderClass.examIds.map((examId) => (
                          <div key={`e-${examId}`} className="flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer bg-white border-slate-200 hover:border-slate-300">
                            <div className="flex items-center gap-3 overflow-hidden w-full">
                              <div className="cursor-grab text-slate-400 px-1 py-2"><GripVertical className="h-4 w-4" /></div>
                              <div className="p-1.5 rounded-lg shrink-0 bg-amber-100 text-amber-600"><FileText className="h-3.5 w-3.5" /></div>
                              <span className="text-xs font-bold truncate text-slate-700">Exam: {exams?.find(e => e.id === examId)?.title || examId}</span>
                            </div>
                            <button onClick={() => setBuilderClass({ ...builderClass, examIds: builderClass.examIds.filter(id => id !== examId) })} className="text-slate-400 hover:text-rose-500"><Trash2 className="h-4 w-4" /></button>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                  <div className="p-4 border-t border-slate-200 bg-white grid grid-cols-1 gap-2 shrink-0">
                    <button onClick={() => setSelectedClassItem({type: 'lesson', index: -1})} className="bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100 text-indigo-600 px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors w-full">
                      <BookOpen className="h-4 w-4" /> Add Lesson
                    </button>
                    <button onClick={() => setSelectedClassItem({type: 'exam', index: -1})} className="bg-amber-50/50 hover:bg-amber-50 border border-amber-100 text-amber-600 px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors w-full">
                      <FileText className="h-4 w-4" /> Add Exam
                    </button>
                  </div>
                </div>

                {/* Right Content */}
                <div className="flex-1 border border-slate-200 rounded-2xl bg-white p-6 shadow-sm relative min-h-[500px]">
                  {!selectedClassItem ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 space-y-4 bg-slate-50/30 rounded-2xl">
                      <Layers className="h-12 w-12 text-slate-200" />
                      <p className="text-sm font-semibold">Select an item type from the curriculum outline to add.</p>
                    </div>
                  ) : (
                    <div className="space-y-6 animate-fade-in">
                      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                        <div className={`p-2 rounded-xl ${selectedClassItem.type === 'lesson' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'}`}>
                          {selectedClassItem.type === 'lesson' ? <BookOpen className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                        </div>
                        <h3 className="font-extrabold text-slate-800 text-lg">
                          Select {selectedClassItem.type === 'lesson' ? 'Lesson' : 'Exam'} to Add
                        </h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2">
                        {selectedClassItem.type === 'lesson' ? (
                          lessons.filter(l => !builderClass.lessonIds.includes(l.id)).map(l => (
                            <button key={l.id} onClick={() => {
                              setBuilderClass({...builderClass, lessonIds: [...builderClass.lessonIds, l.id]});
                              setSelectedClassItem(null);
                            }} className="text-left p-4 border border-slate-200 rounded-xl hover:border-indigo-500 hover:shadow-sm transition-all bg-white">
                              <h4 className="font-bold text-slate-800 text-sm mb-1">{l.title}</h4>
                              <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded font-bold">{l.grade}</span>
                            </button>
                          ))
                        ) : (
                          exams?.filter(e => !builderClass.examIds.includes(e.id)).map(e => (
                            <button key={e.id} onClick={() => {
                              setBuilderClass({...builderClass, examIds: [...builderClass.examIds, e.id]});
                              setSelectedClassItem(null);
                            }} className="text-left p-4 border border-slate-200 rounded-xl hover:border-amber-500 hover:shadow-sm transition-all bg-white">
                              <h4 className="font-bold text-slate-800 text-sm mb-1">{e.title}</h4>
                              <span className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded font-bold">{e.targetGrade || 'Grade 1'}</span>
                            </button>
                          ))
                        )}
                        
                          {(selectedClassItem.type === 'lesson' ? lessons.filter(l => !builderClass.lessonIds.includes(l.id)) : exams?.filter(e => !builderClass.examIds.includes(e.id)))?.length === 0 && (
                          <div className="col-span-1 md:col-span-2 text-center py-8 text-slate-400">
                            No available items to add.
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Modal Class Creation */}
          {showClassModal && (
            <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <form onSubmit={handleCreateClass} className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-8 space-y-5 text-left animate-fade-in max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h3 className="font-extrabold text-slate-900 text-lg">{t.createClassBtn}</h3>
                  <button type="button" onClick={() => setShowClassModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">{t.classGroup.name}</label>
                  <input
                    type="text"
                    required
                    value={cName}
                    onChange={e => setCName(e.target.value)}
                    placeholder="Grade 12 - Scientific Group A"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none font-semibold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">{t.classGroup.desc}</label>
                  <textarea
                    rows={2}
                    value={cDesc}
                    onChange={e => setCDesc(e.target.value)}
                    placeholder="Provide details about lessons syllabus or weekly group schedules..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none resize-none font-semibold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    {currentLanguage === 'en' ? 'Target Grade' : 'المرحلة الدراسية المستهدفة'}
                  </label>
                  <select
                    value={cGrade}
                    onChange={e => setCGrade(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-indigo-600 font-semibold text-slate-700 cursor-pointer text-left"
                  >
                    {academicLevels.length > 0 ? (
                      academicLevels.map(lvl => (
                        <option key={lvl.id} value={lvl.id}>{lvl.name}</option>
                      ))
                    ) : (
                      <option value="">{currentLanguage === 'en' ? 'No grades found' : 'لا توجد مراحل دراسية'}</option>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Status</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['draft', 'active', 'scheduled'] as const).map(status => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setCStatus(status)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all capitalize ${cStatus === status ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600' : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                          }`}
                      >
                        {status === 'active' ? 'Active' : status === 'scheduled' ? 'Schedule' : 'Draft'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-100 flex items-center justify-center gap-2"
                  >
                    <span>{t.createClassBtn}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowClassModal(false)}
                    className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold py-3 rounded-xl transition-all"
                  >
                    {currentLanguage === 'en' ? 'Cancel' : 'إلغاء'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* 3. Questions Tab */}
      {activeTab === 'questions' && (
        <QuestionBank gradeId={selectedGradeId || 'g1'} />
      )}

      {/* 4. Exams Tab */}
      {activeTab === 'exams' && (
        <ExamsManager gradeId={selectedGradeId || 'g1'} />
      )}

      {/* Modal Lesson Creation */}
      {showCreateLessonModal && (
        <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateLessonSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-8 space-y-5 text-left animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-lg">Create New Lesson</h3>
              <button type="button" onClick={() => setShowCreateLessonModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Title</label>
              <input
                type="text"
                required
                value={lessonTitle}
                onChange={e => setLessonTitle(e.target.value)}
                placeholder="Enter lesson title"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none font-semibold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Description</label>
              <textarea
                rows={2}
                value={lessonDesc}
                onChange={e => setLessonDesc(e.target.value)}
                placeholder="Enter lesson description"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none resize-none font-semibold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Thumbnail</label>
              <div className="border-2 border-dashed border-slate-200 hover:border-indigo-500/40 rounded-xl p-5 text-center hover:bg-slate-50 transition-all relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => setLessonThumbnail(reader.result as string);
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload className="h-6 w-6 mx-auto text-slate-400 mb-1.5" />
                <p className="text-xs font-bold text-slate-600">{lessonThumbnail ? 'Image loaded' : 'Drag & drop an image here, or click to browse'}</p>
                <p className="text-[10px] text-slate-500 mt-0.5 font-medium">PNG, JPG up to 5MB</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                {currentLanguage === 'en' ? 'Target Class Group' : 'المجموعة الدراسية المستهدفة'}
              </label>
              <select
                value={lessonTargetClass}
                onChange={e => setLessonTargetClass(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-indigo-600 font-semibold text-slate-700 cursor-pointer text-left"
              >
                {classes.length > 0 ? (
                  classes.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))
                ) : (
                  <option value="">{currentLanguage === 'en' ? 'No classes found' : 'لا توجد فصول دراسية'}</option>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Status</label>
              <div className="grid grid-cols-3 gap-3">
                {(['draft', 'published', 'scheduled'] as const).map(status => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setLessonStatus(status)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all capitalize ${lessonStatus === status ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600' : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                      }`}
                  >
                    {status === 'published' ? 'Publish Now' : status === 'scheduled' ? 'Schedule' : 'Draft'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-100 flex items-center justify-center gap-2"
              >
                <span>Create & Add Sections</span>
              </button>
              <button
                type="button"
                onClick={() => setShowCreateLessonModal(false)}
                className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold py-3 rounded-xl transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reusable Linking Modal */}
      {assignModalConfig && (
        <AssignLessonsToGroupModal
          mode={assignModalConfig.mode}
          sourceId={assignModalConfig.sourceId}
          gradeFilter={assignModalConfig.gradeFilter}
          isOptionalStep={assignModalConfig.isOptionalStep}
          onAssign={(linkedIds) => {
            updateLessonGroupLinks({
              lessonId: assignModalConfig.mode === 'lesson-to-groups' ? assignModalConfig.sourceId : undefined,
              examId: assignModalConfig.mode === 'exam-to-groups' ? assignModalConfig.sourceId : undefined,
              groupId: (assignModalConfig.mode === 'group-to-lessons' || assignModalConfig.mode === 'group-to-exams') ? assignModalConfig.sourceId : undefined,
              type: assignModalConfig.mode.includes('exam') ? 'exam' : 'lesson',
              linkedIds
            });
            setAssignModalConfig(null);
          }}
          onCreateNew={
            assignModalConfig.mode === 'group-to-lessons'
              ? () => {
                setLessonTargetClass(assignModalConfig.sourceId);
                setPreSelectedGroupId(assignModalConfig.sourceId);
                setShowCreateLessonModal(true);
              }
              : undefined
          }
          onClose={() => setAssignModalConfig(null)}
        />
      )}

      {/* Close the fragment that wrapped the tabs view when a grade is selected */}
      </>
      )}

      {/* Modal Academic Level Configurator */}
      {showLevelConfigModal && (
        <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-8 space-y-6 text-left my-8 text-slate-800 animate-fade-in">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-indigo-600">
                <Folder className="h-5 w-5" />
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
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-3.5 rounded-xl transition-all shadow-md shadow-indigo-100 cursor-pointer text-xs uppercase tracking-wider text-center"
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
