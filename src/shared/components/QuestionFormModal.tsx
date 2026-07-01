import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import MathRenderer from './MathRenderer';
import { 
  X, 
  CheckCircle2, 
  Bold, 
  Italic, 
  Underline, 
  Pilcrow, 
  List, 
  ListOrdered, 
  Image, 
  Calculator, 
  FlaskConical, 
  Table, 
  Plus,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { Question } from '../types';
import { useAppState } from '../context/AppState';

interface QuestionFormModalProps {
  initialQuestion?: Question | null;
  defaultType?: 'mcq' | 'essay';
  defaultGrade?: string;
  onSave: (question: Partial<Question>) => void;
  onClose: () => void;
}

export default function QuestionFormModal({
  initialQuestion,
  defaultType = 'mcq',
  defaultGrade = 'Grade 1',
  onSave,
  onClose
}: QuestionFormModalProps) {
  const { currentLanguage } = useAppState();

  const [qType, setQType] = useState<'mcq' | 'essay'>(initialQuestion?.type || defaultType);
  const [qTitle, setQTitle] = useState(initialQuestion?.title || '');
  const [qOptions, setQOptions] = useState<string[]>(initialQuestion?.options || ['Option 1', 'Option 2', 'Option 3', 'Option 4']);
  const [qCorrect, setQCorrect] = useState<number>(initialQuestion?.correctOption || 0);
  const [qModelAnswer, setQModelAnswer] = useState(initialQuestion?.modelAnswer || '');
  const [qDifficulty, setQDifficulty] = useState<'easy'|'medium'|'hard'>(initialQuestion?.difficulty || 'medium');
  const [qGrade, setQGrade] = useState<string>(initialQuestion?.grade || defaultGrade);

  const dict = {
    en: {
      editTitle: "Edit Question",
      createTitle: "Create Question",
      subtitle: "Design your question and answers",
      mcq: "MCQ",
      essay: "Essay",
      targetGrade: "Target Grade",
      grade1: "Grade 1",
      grade2: "Grade 2",
      grade3: "Grade 3",
      difficulty: "Difficulty Level",
      easy: "Easy",
      medium: "Medium",
      hard: "Hard",
      content: "Question Content",
      placeholder: "Type your question here. Use the toolbar for formatting or math...",
      optionsLabel: "Answer Options",
      correctLabel: "Select correct answer",
      optionPlaceholder: "Option",
      addOptionBtn: "Add Another Option",
      modelLabel: "Grading Rubric / Reference",
      modelPlaceholder: "Provide reference solutions, keywords, and main points required for the AI to auto-grade...",
      saveUpdateBtn: "Save Updates to Question",
      createBtn: "Create & Add Question",
      studentView: "Student View",
      previewPlaceholder: "Your question text will be rendered here...",
      studentPlaceholder: "Student will type their essay response here...",
      wordCount: "0 / 500 words",
      qText: "Q1"
    },
    ar: {
      editTitle: "تعديل السؤال",
      createTitle: "إنشاء سؤال جديد",
      subtitle: "صمم سؤالك وإجاباته النموذجية",
      mcq: "اختيار من متعدد",
      essay: "سؤال مقالي",
      targetGrade: "المرحلة الدراسية المستهدفة",
      grade1: "الصف الأول",
      grade2: "الصف الثاني",
      grade3: "الصف الثالث",
      difficulty: "مستوى الصعوبة",
      easy: "سهل",
      medium: "متوسط",
      hard: "صعب",
      content: "نص السؤال الدراسي",
      placeholder: "اكتب نص السؤال هنا. يمكنك استخدام شريط الأدوات للتنسيق أو كتابة الرموز والمعادلات...",
      optionsLabel: "خيارات الإجابة",
      correctLabel: "حدد الإجابة الصحيحة النموذجية",
      optionPlaceholder: "الخيار",
      addOptionBtn: "إضافة خيار إجابة آخر",
      modelLabel: "نص الإجابة النموذجية المرجعية",
      modelPlaceholder: "اكتب حل السؤال والكلمات المفتاحية والنقاط الأساسية المطلوبة ليتمكن الذكاء الاصطناعي من التصحيح التلقائي...",
      saveUpdateBtn: "حفظ وتعديل السؤال",
      createBtn: "إنشاء وإضافة السؤال",
      studentView: "معاينة واجهة الطالب",
      previewPlaceholder: "سيتم عرض نص السؤال الخاص بك هنا للطلاب...",
      studentPlaceholder: "سيكتب الطالب إجابته المقالية هنا...",
      wordCount: "0 / 500 كلمة",
      qText: "س١"
    }
  };

  const t = dict[currentLanguage];

  const handleInsertQuestionHTML = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('question-editor-textarea') as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const selected = text.substring(start, end);
    const after = text.substring(end, text.length);

    setQTitle(before + prefix + selected + suffix + after);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    }, 0);
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qTitle.trim()) return;

    const savedQ: Partial<Question> = {
      title: qTitle,
      type: qType,
      difficulty: qDifficulty,
      grade: qGrade,
    };

    if (qType === 'mcq') {
      savedQ.options = qOptions;
      savedQ.correctOption = qCorrect;
    } else {
      savedQ.modelAnswer = qModelAnswer;
    }

    onSave(savedQ);
  };

  const modalContent = (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[9999] flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden">
      <div className="bg-white rounded-[2rem] shadow-2xl max-w-6xl w-full h-[90vh] max-h-[850px] text-left glass-card grid grid-cols-1 lg:grid-cols-12 overflow-hidden border border-slate-200/60 relative">
        
        {/* Left Column: Form Editor (8 cols) */}
        <form onSubmit={handleSaveQuestion} className="lg:col-span-7 p-8 lg:p-10 space-y-6 overflow-y-auto relative flex flex-col bg-white h-full">
          
          {/* Header & Toggle */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                {initialQuestion ? t.editTitle : t.createTitle}
                <Sparkles className="h-5 w-5 text-indigo-500" />
              </h2>
              <p className="text-slate-500 text-sm mt-1 font-medium">{t.subtitle}</p>
            </div>
            
            {/* Pill Toggle for MCQ / Essay */}
            <div className="flex bg-slate-100 p-1 rounded-full border border-slate-200 shadow-inner">
              <button
                type="button"
                onClick={() => setQType('mcq')}
                className={`px-6 py-2 rounded-full text-xs font-extrabold transition-all duration-300 ${
                  qType === 'mcq' 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 translate-x-0' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                }`}
              >
                {t.mcq}
              </button>
              <button
                type="button"
                onClick={() => setQType('essay')}
                className={`px-6 py-2 rounded-full text-xs font-extrabold transition-all duration-300 ${
                  qType === 'essay' 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                }`}
              >
                {t.essay}
              </button>
            </div>
          </div>

          {/* Difficulty & Grade Config */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 group">
              <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest pl-1 group-focus-within:text-indigo-600 transition-colors">{t.targetGrade}</label>
              <div className="relative">
                <select 
                  value={qGrade} 
                  onChange={e => setQGrade(e.target.value)} 
                  className="w-full bg-white border border-slate-200 text-slate-800 text-sm font-bold p-3.5 rounded-2xl outline-none focus:border-indigo-500 focus:bg-white appearance-none transition-all focus:ring-4 focus:ring-indigo-500/10 cursor-pointer shadow-sm hover:border-slate-300"
                >
                  <option value="Grade 1" className="bg-white">{t.grade1}</option>
                  <option value="Grade 2" className="bg-white">{t.grade2}</option>
                  <option value="Grade 3" className="bg-white">{t.grade3}</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none group-focus-within:text-indigo-600 transition-colors" />
              </div>
            </div>
            
            <div className="space-y-2 group">
              <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest pl-1 group-focus-within:text-indigo-600 transition-colors">{t.difficulty}</label>
              <div className="relative">
                <select 
                  value={qDifficulty} 
                  onChange={e => setQDifficulty(e.target.value as any)} 
                  className="w-full bg-white border border-slate-200 text-slate-800 text-sm font-bold p-3.5 rounded-2xl outline-none focus:border-indigo-500 focus:bg-white appearance-none transition-all focus:ring-4 focus:ring-indigo-500/10 cursor-pointer shadow-sm hover:border-slate-300"
                >
                  <option value="easy" className="bg-white">{t.easy}</option>
                  <option value="medium" className="bg-white">{t.medium}</option>
                  <option value="hard" className="bg-white">{t.hard}</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none group-focus-within:text-indigo-600 transition-colors" />
              </div>
            </div>
          </div>

          {/* Question Editor */}
          <div className="flex flex-col flex-1">
            <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest pl-1 mb-2">{t.content}</label>
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all flex-1 min-h-[200px] shadow-sm">
              
              {/* Rich Text Toolbar */}
              <div className="flex flex-wrap items-center gap-1.5 p-2 border-b border-slate-200 bg-slate-50">
                <button type="button" onClick={() => handleInsertQuestionHTML('<strong>', '</strong>')} className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-slate-800 transition-all" title="Bold">
                  <Bold className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => handleInsertQuestionHTML('<em>', '</em>')} className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-slate-800 transition-all" title="Italic">
                  <Italic className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => handleInsertQuestionHTML('<u>', '</u>')} className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-slate-800 transition-all" title="Underline">
                  <Underline className="h-4 w-4" />
                </button>
                <div className="w-px h-5 bg-slate-300 mx-1" />
                <button type="button" onClick={() => handleInsertQuestionHTML('<h1>', '</h1>')} className="px-2 py-1.5 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-slate-800 transition-all text-xs font-bold">H1</button>
                <button type="button" onClick={() => handleInsertQuestionHTML('<h2>', '</h2>')} className="px-2 py-1.5 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-slate-800 transition-all text-xs font-bold">H2</button>
                <button type="button" onClick={() => handleInsertQuestionHTML('<h3>', '</h3>')} className="px-2 py-1.5 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-slate-800 transition-all text-xs font-bold">H3</button>
                <div className="w-px h-5 bg-slate-300 mx-1" />
                <button type="button" onClick={() => handleInsertQuestionHTML('<ul>\n  <li>', '</li>\n</ul>')} className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-slate-800 transition-all">
                  <List className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => handleInsertQuestionHTML('<ol>\n  <li>', '</li>\n</ol>')} className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-slate-800 transition-all">
                  <ListOrdered className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => handleInsertQuestionHTML('<img src="', '" alt="" />')} className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-slate-800 transition-all">
                  <Image className="h-4 w-4" />
                </button>
                <div className="w-px h-5 bg-slate-300 mx-1" />
                <button type="button" onClick={() => handleInsertQuestionHTML('$', '$')} className="p-2 hover:bg-emerald-100 rounded-lg text-emerald-600 hover:text-emerald-700 transition-all bg-emerald-50" title="Inline Math">
                  <Calculator className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => handleInsertQuestionHTML('$$\n', '\n$$')} className="p-2 hover:bg-emerald-100 rounded-lg text-emerald-600 hover:text-emerald-700 transition-all bg-emerald-50" title="Block Math">
                  <FlaskConical className="h-4 w-4" />
                </button>
              </div>

              <textarea
                id="question-editor-textarea"
                required
                value={qTitle}
                onChange={e => setQTitle(e.target.value)}
                placeholder={t.placeholder}
                className="w-full flex-1 p-5 bg-transparent border-none text-sm font-medium outline-none text-slate-800 resize-none placeholder:text-slate-400 leading-relaxed"
              />
            </div>
          </div>

          {/* MCQ Options */}
          {qType === 'mcq' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">{t.optionsLabel}</label>
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">{t.correctLabel}</span>
              </div>
              
              <div className="space-y-3">
                {qOptions.map((opt, idx) => (
                  <div key={idx} className={`flex items-center gap-3 p-2 pr-4 rounded-2xl border transition-all ${
                    qCorrect === idx 
                      ? 'bg-indigo-50 border-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.1)]' 
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                  }`}>
                    {/* Correct Toggle */}
                    <button
                      type="button"
                      onClick={() => setQCorrect(idx)}
                      className="p-2 rounded-xl shrink-0 transition-transform hover:scale-110"
                      title="Mark as correct"
                    >
                      {qCorrect === idx ? (
                        <div className="bg-indigo-600 rounded-full shadow-lg shadow-indigo-600/30">
                          <CheckCircle2 className="h-6 w-6 text-white" />
                        </div>
                      ) : (
                        <div className="h-6 w-6 rounded-full border-2 border-slate-300 hover:border-slate-400 transition-colors bg-slate-50" />
                      )}
                    </button>

                    <input
                      type="text"
                      required
                      value={opt}
                      onChange={e => {
                        const newOpts = [...qOptions];
                        newOpts[idx] = e.target.value;
                        setQOptions(newOpts);
                      }}
                      placeholder={`${t.optionPlaceholder} ${idx + 1}`}
                      className="flex-1 bg-transparent border-none text-sm font-semibold focus:ring-0 outline-none text-slate-800 placeholder:text-slate-400"
                    />

                    <button
                      type="button"
                      onClick={() => {
                        if (qOptions.length > 2) {
                          setQOptions(qOptions.filter((_, oIdx) => oIdx !== idx));
                          if (qCorrect === idx) setQCorrect(0);
                          else if (qCorrect > idx) setQCorrect(qCorrect - 1);
                        }
                      }}
                      className="text-slate-400 hover:text-rose-500 p-2 rounded-xl hover:bg-rose-50 transition-colors shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setQOptions([...qOptions, ''])}
                className="w-full py-4 border-2 border-dashed border-slate-300 rounded-2xl text-xs font-bold text-slate-500 hover:text-indigo-600 hover:border-indigo-400 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 group"
              >
                <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform" />
                <span>{t.addOptionBtn}</span>
              </button>
            </div>
          )}

          {/* Essay Answer */}
          {qType === 'essay' && (
            <div className="space-y-2 flex-1 flex flex-col">
              <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest pl-1 mb-2">{t.modelLabel}</label>
              <textarea
                rows={4}
                required
                value={qModelAnswer}
                onChange={e => setQModelAnswer(e.target.value)}
                placeholder={t.modelPlaceholder}
                className="w-full flex-1 p-5 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none resize-none text-slate-800 placeholder:text-slate-400 transition-all shadow-sm"
              />
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-4 mt-auto">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-extrabold py-4 rounded-2xl text-sm transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 hover:-translate-y-0.5"
            >
              {initialQuestion ? t.saveUpdateBtn : t.createBtn}
            </button>
          </div>
        </form>

        {/* Right Column: Live Student Preview (5 cols) */}
        <div className="lg:col-span-5 bg-slate-50 p-8 lg:p-10 hidden lg:flex flex-col relative border-l border-slate-200">
          <button 
            type="button" 
            onClick={onClose} 
            className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 p-2 rounded-full transition-all shadow-sm"
            title="Close Editor"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-indigo-100 border border-indigo-200 text-indigo-700 px-4 py-1.5 rounded-full text-[10px] font-extrabold tracking-widest uppercase shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
              </span>
              {t.studentView}
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            {/* Mock Tablet/Screen Frame */}
            <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200 border border-slate-200 pointer-events-none relative overflow-hidden">
              {/* Subtle top glare */}
              <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-white to-transparent opacity-80 z-10" />
              
              <div className="relative z-20 flex justify-between items-start mb-6 border-b border-slate-100 pb-4">
                <span className="text-sm font-black text-slate-400">{t.qText}</span>
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                  qDifficulty === 'easy' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                  qDifficulty === 'medium' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                }`}>
                  {qDifficulty === 'easy' ? t.easy : qDifficulty === 'medium' ? t.medium : t.hard}
                </span>
              </div>
              
              <div className="text-[15px] font-bold text-slate-800 mb-8 leading-loose whitespace-pre-wrap">
                <MathRenderer text={qTitle || t.previewPlaceholder} />
              </div>
              
              {qType === 'mcq' ? (
                <div className="space-y-3 relative z-20">
                  {qOptions.map((opt, idx) => (
                    <div key={idx} className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                      qCorrect === idx ? 'border-indigo-500 bg-indigo-50/50 shadow-sm' : 'border-slate-100 bg-slate-50/50'
                    }`}>
                      <div className={`h-5 w-5 flex-shrink-0 rounded-full border-2 flex items-center justify-center ${
                        qCorrect === idx ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'
                      }`}>
                        {qCorrect === idx && <CheckCircle2 className="h-3 w-3 text-white" />}
                      </div>
                      <span className={`text-sm font-bold leading-snug ${qCorrect === idx ? 'text-indigo-900' : 'text-slate-600'}`}>
                        <MathRenderer text={opt || `${t.optionPlaceholder} ${idx + 1}`} />
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="relative z-20">
                  <textarea 
                    disabled 
                    rows={6} 
                    className="w-full p-5 rounded-2xl border-2 border-slate-200 bg-slate-50/50 resize-none text-sm font-semibold text-slate-400" 
                    placeholder={t.studentPlaceholder} 
                  />
                  <div className="absolute bottom-4 right-4 text-[10px] font-bold text-slate-400">{t.wordCount}</div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
