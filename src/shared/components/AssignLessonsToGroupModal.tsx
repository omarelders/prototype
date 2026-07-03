import React, { useState } from 'react';
import { useAppState } from '../context/AppState';
import { Search, Check, Plus, X } from 'lucide-react';

interface AssignModalProps {
  mode: 'lesson-to-groups' | 'group-to-lessons';
  sourceId: string; // lessonId or groupId depending on mode
  gradeFilter?: string; // pre-filter candidate list by grade
  onAssign: (ids: string[]) => void | Promise<void>;
  onCreateNew?: () => void; // opens Create Lesson modal pre-scoped to this group, only in group-to-lessons mode
  onClose: () => void;
  isOptionalStep?: boolean;
}

export default function AssignLessonsToGroupModal({
  mode,
  sourceId,
  gradeFilter,
  onAssign,
  onCreateNew,
  onClose,
  isOptionalStep
}: AssignModalProps) {
  const { currentLanguage, lessons, classes } = useAppState();
  const [searchQuery, setSearchQuery] = useState('');

  const isRtl = currentLanguage === 'ar';

  const dict = {
    en: {
      titleLessonToGroups: "Assign Lesson to Groups",
      titleGroupToLessons: "Link Lessons to Group",
      descLessonToGroups: "Select the class groups that should receive this lesson.",
      descGroupToLessons: "Select the lessons to assign to this class group.",
      searchPlaceholder: "Search...",
      createBtn: "+ Create new lesson",
      saveBtn: "Save Assignment",
      cancelBtn: isOptionalStep ? "Skip for now" : "Cancel",
      noCandidates: "No matching items found.",
      selectedText: "selected"
    },
    ar: {
      titleLessonToGroups: "ربط الدرس بالمجموعات",
      titleGroupToLessons: "ربط الدروس بالمجموعة",
      descLessonToGroups: "اختر المجموعات الدراسية التي تريد ربط هذا الدرس بها.",
      descGroupToLessons: "اختر الدروس التي تريد إضافتها لهذه المجموعة الدراسية.",
      searchPlaceholder: "بحث...",
      createBtn: "+ إنشاء درس جديد",
      saveBtn: "حفظ التغييرات",
      cancelBtn: isOptionalStep ? "تخطي في الوقت الحالي" : "إلغاء",
      noCandidates: "لم يتم العثور على عناصر مطابقة.",
      selectedText: "محددة"
    }
  };

  const t = dict[currentLanguage];

  // Helper to normalize grade mapping
  const normalizeGrade = (g?: string) => {
    if (!g) return '';
    const lower = g.toLowerCase();
    if (lower.includes('grade 1') || lower === 'c-1') return 'Grade 1';
    if (lower.includes('grade 2') || lower === 'c-2') return 'Grade 2';
    if (lower.includes('grade 3') || lower === 'c-3') return 'Grade 3';
    return g;
  };

  const normalizedGradeFilter = normalizeGrade(gradeFilter);

  // Initialize selected IDs state
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    if (mode === 'lesson-to-groups') {
      // Find all class groups currently containing this lesson
      return classes
        .filter(cls => cls.lessonIds.includes(sourceId))
        .map(cls => cls.id);
    } else {
      // Find the lessons currently linked to this class group
      const targetGroup = classes.find(c => c.id === sourceId);
      return targetGroup ? targetGroup.lessonIds : [];
    }
  });

  // Candidates list setup
  let candidates: Array<{ id: string; name: string; description?: string; grade?: string }> = [];

  if (mode === 'lesson-to-groups') {
    candidates = classes.map(cls => ({
      id: cls.id,
      name: cls.name,
      description: cls.description,
      grade: cls.grade ? normalizeGrade(cls.grade) : 'Grade 1' // Default or mapped
    }));
  } else {
    candidates = lessons.map(les => ({
      id: les.id,
      name: les.title,
      description: les.description,
      grade: les.grade ? normalizeGrade(les.grade) : (classes.find(c => c.id === les.targetClass)?.grade || 'Grade 1')
    }));
  }

  // Filter candidates by Grade and Search query
  const filteredCandidates = candidates.filter(item => {
    // 1. Grade filtering (if filter exists)
    if (normalizedGradeFilter) {
      const itemGrade = normalizeGrade(item.grade);
      if (itemGrade && itemGrade !== normalizedGradeFilter) {
        return false;
      }
    }

    // 2. Search query filtering
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const matchesName = item.name.toLowerCase().includes(query);
    const matchesDesc = item.description?.toLowerCase().includes(query) || false;
    return matchesName || matchesDesc;
  });

  const handleToggle = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(prev => prev.filter(item => item !== id));
    } else {
      setSelectedIds(prev => [...prev, id]);
    }
  };

  const handleSave = () => {
    onAssign(selectedIds);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div
        dir={isRtl ? 'rtl' : 'ltr'}
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden flex flex-col max-h-[85vh] animate-fade-in"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-start gap-4">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 leading-none">
              {isOptionalStep 
                ? (mode === 'lesson-to-groups' ? (currentLanguage === 'en' ? 'Assign to group(s) now?' : 'هل ترغب في تخصيص الدرس لمجموعات الآن؟') : (currentLanguage === 'en' ? 'Add lessons to this group' : 'إضافة دروس لهذه المجموعة'))
                : (mode === 'lesson-to-groups' ? t.titleLessonToGroups : t.titleGroupToLessons)}
            </h3>
            {!isOptionalStep && (
              <p className="text-xs font-semibold text-slate-400 mt-2">
                {mode === 'lesson-to-groups' ? t.descLessonToGroups : t.descGroupToLessons}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="px-6 py-3 border-b border-slate-50 flex items-center relative">
          <Search className={`absolute ${isRtl ? 'right-9' : 'left-9'} top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400`} />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className={`w-full ${isRtl ? 'pr-9 pl-4' : 'pl-9 pr-4'} py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:bg-white focus:border-indigo-600 transition-all`}
          />
        </div>

        {/* Candidates List */}
        <div className="overflow-y-auto flex-1 p-6 space-y-2 bg-slate-50/50">
          {filteredCandidates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-slate-400 space-y-3">
              <Search className="h-8 w-8 text-slate-300 opacity-70" />
              <p className="font-semibold text-sm">
                {t.noCandidates}
              </p>
              {mode === 'group-to-lessons' && onCreateNew && (
                 <button onClick={onCreateNew} className="text-indigo-600 hover:text-indigo-700 text-xs font-bold mt-2">
                   {t.createBtn}
                 </button>
              )}
            </div>
          ) : (
            filteredCandidates.map(item => {
              const isChecked = selectedIds.includes(item.id);
              return (
                <label
                  key={item.id}
                  className={`flex items-start gap-3.5 p-3.5 bg-white border rounded-xl cursor-pointer transition-all ${
                    isChecked
                      ? 'border-indigo-500 shadow-sm ring-1 ring-indigo-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleToggle(item.id)}
                    className="h-4.5 w-4.5 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-sm text-slate-800">{item.name}</span>
                      {item.grade && (
                        <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">
                          {item.grade}
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                </label>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 flex flex-col gap-3 bg-white">
          <div className="flex justify-between items-center text-xs font-bold text-slate-400 px-1">
            <span>
              {selectedIds.length} {t.selectedText}
            </span>
          </div>

          <div className="flex gap-3">
            {mode === 'group-to-lessons' && onCreateNew && (
              <button
                type="button"
                onClick={onCreateNew}
                className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-extrabold py-3 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5"
              >
                <Plus className="h-4 w-4 text-indigo-600" />
                <span>{t.createBtn}</span>
              </button>
            )}
            
            <button
              onClick={handleSave}
              className="flex-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-3 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-md shadow-indigo-100"
            >
              <Check className="h-4 w-4" />
              <span>{isOptionalStep ? (currentLanguage === 'en' ? (selectedIds.length > 0 ? `Assign to ${selectedIds.length} items` : "Save without assigning") : (selectedIds.length > 0 ? `تخصيص لـ ${selectedIds.length} عناصر` : "حفظ بدون تخصيص")) : t.saveBtn}</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full text-center text-xs font-bold text-slate-500 hover:text-slate-700 py-1"
          >
            {t.cancelBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
