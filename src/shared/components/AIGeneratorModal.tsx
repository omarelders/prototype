import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Sparkles, X, RotateCw, Check, ArrowLeft } from 'lucide-react';
import { useAppState } from '../context/AppState';
import MathRenderer from './MathRenderer';

interface AIGeneratorModalProps {
  onGenerate: (data: {
    title: string;
    grade: string;
    type: 'mcq' | 'essay';
    difficulty: 'easy' | 'medium' | 'hard';
    options?: string[];
    correctOption?: number;
    modelAnswer?: string;
  }) => void;
  onClose: () => void;
}

export default function AIGeneratorModal({ onGenerate, onClose }: AIGeneratorModalProps) {
  const { currentLanguage } = useAppState();

  const [topic, setTopic] = useState('');
  const [grade, setGrade] = useState('Grade 1');
  const [type, setType] = useState<'mcq' | 'essay'>('mcq');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  // State machine: 'input' | 'generating' | 'preview'
  const [step, setStep] = useState<'input' | 'generating' | 'preview'>('input');
  
  // Generated result
  const [generatedTitle, setGeneratedTitle] = useState('');
  const [generatedOptions, setGeneratedOptions] = useState<string[]>([]);
  const [generatedCorrect, setGeneratedCorrect] = useState(0);
  const [generatedModelAnswer, setGeneratedModelAnswer] = useState('');

  const dict = {
    en: {
      title: "AI Question Generator",
      topicLabel: "Enter lesson topic or explanation text to generate questions",
      topicPlaceholder: "e.g. Le Chatelier's principle and the effect of pressure and temperature on chemical equilibrium...",
      gradeLabel: "Target Grade Level",
      grade1: "Grade 1",
      grade2: "Grade 2",
      grade3: "Grade 3",
      typeLabel: "Question Type",
      mcq: "Multiple Choice",
      essay: "Essay Question",
      difficultyLabel: "QUESTION DIFFICULTY LEVEL",
      easy: "Easy",
      medium: "Medium",
      hard: "Hard",
      cancel: "Cancel",
      generateBtn: "Generate Question Now",
      previewTitle: "AI Generated Preview",
      acceptBtn: "Accept & Add Question",
      regenerateBtn: "Regenerate Question",
      backBtn: "Modify Settings",
      generating: "Analyzing topic and generating question...",
      correctLabel: "Correct Answer"
    },
    ar: {
      title: "مولد الأسئلة بالذكاء الاصطناعي",
      topicLabel: "اكتب موضوع الدرس أو فقرة الشرح لتوليد الأسئلة",
      topicPlaceholder: "مثال: شرح قاعدة لوشاتيليه وتأثير التغير في الضغط والحرارة على الاتزان الكيميائي...",
      gradeLabel: "المستوى الدراسي المستهدف",
      grade1: "الصف الأول",
      grade2: "الصف الثاني",
      grade3: "الصف الثالث",
      typeLabel: "نوع السؤال",
      mcq: "اختيار من متعدد",
      essay: "سؤال مقالي",
      difficultyLabel: "QUESTION DIFFICULTY LEVEL",
      easy: "سهل",
      medium: "متوسط",
      hard: "صعب",
      cancel: "إلغاء",
      generateBtn: "توليد السؤال فوراً",
      previewTitle: "معاينة السؤال المولد بالذكاء الاصطناعي",
      acceptBtn: "قبول وإضافة السؤال",
      regenerateBtn: "إعادة التوليد",
      backBtn: "تعديل الخيارات",
      generating: "جاري تحليل المحتوى وتوليد السؤال...",
      correctLabel: "الإجابة الصحيحة النموذجية"
    }
  };

  const t = dict[currentLanguage];

  const triggerGeneration = () => {
    if (!topic.trim()) return;
    setStep('generating');

    setTimeout(() => {
      // Create some custom mock chemistry/physics/math questions based on keywords in the topic
      const topicLower = topic.toLowerCase();
      let qTitle = '';
      let qOpts: string[] = [];
      let qCorrect = 0;
      let qModel = '';

      if (type === 'mcq') {
        if (topicLower.includes('equilibrium') || topicLower.includes('ضغط') || topicLower.includes('حرارة') || topicLower.includes('لوشاتيليه')) {
          qTitle = currentLanguage === 'en' 
            ? "According to Le Chatelier's principle, what happens to the equilibrium of the reaction $N_2(g) + 3H_2(g) \\rightleftharpoons 2NH_3(g)$ when pressure is increased?"
            : "وفقاً لقاعدة لوشاتيليه، ماذا يحدث لاتزان التفاعل التالي $N_2(g) + 3H_2(g) \\rightleftharpoons 2NH_3(g)$ عند زيادة الضغط؟";
          qOpts = currentLanguage === 'en'
            ? [
                "Shifts toward the reactants (left)",
                "Shifts toward the products (right)",
                "No change in equilibrium state",
                "The reaction stops completely"
              ]
            : [
                "ينزاح الاتزان نحو المتفاعلات (اليسار)",
                "ينزاح الاتزان نحو النواتج (اليمين)",
                "لا يتأثر موضع الاتزان",
                "يتوقف التفاعل تماماً"
              ];
          qCorrect = 1;
        } else if (topicLower.includes('newton') || topicLower.includes('حركة') || topicLower.includes('قانون')) {
          qTitle = currentLanguage === 'en'
            ? "A rocket expels fuel at rate $R$. According to Newton's third law, the thrust force on the rocket is proportional to:"
            : "يطلق الصاروخ وقوداً بمعدل $R$. وفقاً لقانون نيوتن الثالث، فإن قوة الدفع المؤثرة على الصاروخ تتناسب طردياً مع:";
          qOpts = currentLanguage === 'en'
            ? ["Fuel velocity squared", "Mass of the empty rocket", "Velocity of expelled gases", "Rocket volume"]
            : ["مربع سرعة الوقود", "كتلة الصاروخ الفارغ", "سرعة الغازات المنفلتة", "حجم الصاروخ"];
          qCorrect = 2;
        } else {
          // Default MCQ based on topic
          qTitle = currentLanguage === 'en'
            ? `Which of the following statements is mathematically or conceptually correct regarding **${topic}**?`
            : `أي من الخيارات التالية يعتبر صحيحاً علمياً أو مفاهيمياً بخصوص **${topic}**؟`;
          qOpts = currentLanguage === 'en'
            ? [
                "It represents a linear proportionality under ideal conditions.",
                "It is inversely proportional to external system parameters.",
                "It is completely unaffected by temperature shifts.",
                "It reaches a maximum threshold at zero absolute value."
              ]
            : [
                "يمثل علاقة طردية خطية تحت الظروف القياسية.",
                "يتناسب عكسياً مع المتغيرات الخارجية للنظام.",
                "لا يتأثر نهائياً بتغير درجات الحرارة.",
                "يصل إلى القيمة العظمى عند الصفر المطلق."
              ];
          qCorrect = 0;
        }
      } else {
        // Essay Question
        if (topicLower.includes('equilibrium') || topicLower.includes('ضغط') || topicLower.includes('حرارة') || topicLower.includes('لوشاتيليه')) {
          qTitle = currentLanguage === 'en'
            ? "Discuss the industrial implications of Le Chatelier's principle in the Haber-Bosch process for synthesizing ammonia ($NH_3$)."
            : "ناقش التطبيقات الصناعية لقاعدة لوشاتيليه في طريقة هابر-بوش لإنتاج غاز الأمونيا ($NH_3$).";
          qModel = currentLanguage === 'en'
            ? "1. High pressure shifts equilibrium to the right (fewer gas moles).\n2. Exothermic reaction means low temp favors yield, but high temp is needed for catalyst rate.\n3. Continuous removal of NH3 maintains reactant side drive."
            : "1. زيادة الضغط يزيح موضع الاتزان لليمين (عدد مولات غازية أقل).\n2. التفاعل طارد للحرارة وبالتالي الحرارة المنخفضة تفضل النواتج ولكن نحتاج حرارة معتدلة لزيادة نشاط العامل الحفاز.\n3. سحب الأمونيا باستمرار من وعاء التفاعل يزيد من المردود.";
        } else {
          qTitle = currentLanguage === 'en'
            ? `Explain the core conceptual mechanism of **${topic}**, outlining its mathematical formulas and physical significance.`
            : `اشرح بالتفصيل المبدأ العلمي لـ **${topic}** موضحاً القوانين الرياضية المرتبطة والأهمية الفيزيائية لها.`;
          qModel = currentLanguage === 'en'
            ? "Provide detailed step-by-step mathematical proof, state assumptions, and provide practical real-world application examples."
            : "يجب أن تتضمن إجابة الطالب توضيحاً رياضياً خطوة بخطوة، مع ذكر الفرضيات الأساسية وتطبيقات عملية من الحياة اليومية.";
        }
      }

      setGeneratedTitle(qTitle);
      setGeneratedOptions(qOpts);
      setGeneratedCorrect(qCorrect);
      setGeneratedModelAnswer(qModel);
      setStep('preview');
    }, 1500);
  };

  const handleAccept = () => {
    onGenerate({
      title: generatedTitle,
      grade,
      type,
      difficulty,
      options: type === 'mcq' ? generatedOptions : undefined,
      correctOption: type === 'mcq' ? generatedCorrect : undefined,
      modelAnswer: type === 'essay' ? generatedModelAnswer : undefined
    });
  };

  return createPortal(
    <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-xl p-8 relative shadow-2xl flex flex-col gap-6 animate-fade-in text-left">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <Sparkles className="h-5.5 w-5.5 text-indigo-600" />
            <h2 className="text-lg font-extrabold text-slate-900">
              {step === 'preview' ? t.previewTitle : t.title}
            </h2>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 bg-slate-50 p-2 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* STEP 1: Input Fields */}
        {step === 'input' && (
          <>
            <div className="space-y-6">
              {/* Topic */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">{t.topicLabel}</label>
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder={t.topicPlaceholder}
                  className="w-full h-32 p-4 rounded-xl border border-slate-200 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 text-sm font-semibold resize-none bg-slate-50 focus:bg-white text-slate-700 transition-colors"
                />
              </div>

              {/* Grade Level */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">{t.gradeLabel}</label>
                <div className="flex gap-3">
                  {[
                    { id: 'Grade 1', label: t.grade1 },
                    { id: 'Grade 2', label: t.grade2 },
                    { id: 'Grade 3', label: t.grade3 }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setGrade(opt.id)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                        grade === opt.id
                          ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50 shadow-sm'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50 bg-white'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Type */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">{t.typeLabel}</label>
                <div className="flex gap-3">
                  {[
                    { id: 'mcq', label: t.mcq },
                    { id: 'essay', label: t.essay }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setType(opt.id as 'mcq' | 'essay')}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                        type === opt.id
                          ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50 shadow-sm'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50 bg-white'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty Level */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-2">{t.difficultyLabel}</label>
                <div className="flex gap-3">
                  {[
                    { id: 'easy', label: t.easy },
                    { id: 'medium', label: t.medium },
                    { id: 'hard', label: t.hard }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setDifficulty(opt.id as 'easy'|'medium'|'hard')}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                        difficulty === opt.id
                          ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50 shadow-sm'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50 bg-white'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mt-2">
              <button
                onClick={onClose}
                className="flex-1 py-3.5 rounded-xl font-bold text-xs border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              >
                {t.cancel}
              </button>
              <button
                onClick={triggerGeneration}
                disabled={!topic.trim()}
                className="flex-[2] py-3.5 rounded-xl font-bold text-xs bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-md shadow-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{t.generateBtn}</span>
                <Sparkles className="h-4 w-4" />
              </button>
            </div>
          </>
        )}

        {/* STEP 2: Loading State */}
        {step === 'generating' && (
          <div className="flex flex-col items-center justify-center py-16 space-y-6">
            <div className="relative flex items-center justify-center">
              <div className="h-16 w-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
              <Sparkles className="absolute h-6 w-6 text-indigo-600 animate-pulse" />
            </div>
            <p className="text-sm font-bold text-slate-600 animate-pulse">{t.generating}</p>
          </div>
        )}

        {/* STEP 3: Preview and Review */}
        {step === 'preview' && (
          <>
            <div className="space-y-5 bg-slate-50 border border-slate-200 p-5 rounded-2xl">
              {/* Badges */}
              <div className="flex gap-2">
                <span className={`px-2 py-0.5 rounded text-[9px] uppercase tracking-wider font-extrabold ${type === 'mcq' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  {type === 'mcq' ? t.mcq : t.essay}
                </span>
                <span className={`px-2 py-0.5 rounded text-[9px] uppercase tracking-wider font-extrabold ${difficulty === 'easy' ? 'bg-emerald-50 text-emerald-600' : difficulty === 'medium' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}`}>
                  {difficulty === 'easy' ? t.easy : difficulty === 'medium' ? t.medium : t.hard}
                </span>
                <span className="px-2 py-0.5 rounded text-[9px] uppercase tracking-wider font-extrabold bg-slate-200 text-slate-700">
                  {grade}
                </span>
              </div>

              {/* Title */}
              <div className="text-sm font-bold text-slate-800 leading-relaxed">
                <MathRenderer text={generatedTitle} />
              </div>

              {/* MCQ Options */}
              {type === 'mcq' && (
                <div className="space-y-2 mt-3">
                  {generatedOptions.map((opt, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-semibold ${
                        index === generatedCorrect 
                          ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900' 
                          : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      <span className={`h-5 w-5 rounded-full flex items-center justify-center font-bold text-[10px] border ${
                        index === generatedCorrect 
                          ? 'bg-emerald-600 text-white border-emerald-600' 
                          : 'bg-slate-50 border-slate-200 text-slate-500'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span>{opt}</span>
                      {index === generatedCorrect && (
                        <span className="ml-auto text-[9px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded uppercase tracking-wider">
                          {t.correctLabel}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Essay Rubric */}
              {type === 'essay' && (
                <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 mt-3">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-indigo-400 block mb-2">Model Answer / Evaluation Rubric</span>
                  <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line font-medium">
                    {generatedModelAnswer}
                  </p>
                </div>
              )}
            </div>

            {/* Actions for Step 3 */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setStep('input')}
                className="flex-1 py-3 rounded-xl font-bold text-xs border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>{t.backBtn}</span>
              </button>

              <button
                onClick={triggerGeneration}
                className="flex-1 py-3 rounded-xl font-bold text-xs border border-indigo-200 text-indigo-700 hover:bg-indigo-50 transition-colors flex items-center justify-center gap-1.5"
              >
                <RotateCw className="h-4 w-4" />
                <span>{t.regenerateBtn}</span>
              </button>

              <button
                onClick={handleAccept}
                className="flex-[1.5] py-3 rounded-xl font-bold text-xs bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-indigo-100"
              >
                <Check className="h-4 w-4" />
                <span>{t.acceptBtn}</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}
