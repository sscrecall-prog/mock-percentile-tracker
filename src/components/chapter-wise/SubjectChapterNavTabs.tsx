import React from 'react';
import { Plus, Trash2, BookOpen } from 'lucide-react';
import { useMocks } from '../../context/MockContext';

interface SubjectChapterNavTabsProps {
  selectedSubject: string;
  onSelectSubject: (subjectName: string) => void;
  onAddSubjectClick: () => void;
}

export const SubjectChapterNavTabs: React.FC<SubjectChapterNavTabsProps> = ({
  selectedSubject,
  onSelectSubject,
  onAddSubjectClick
}) => {
  const { subjectsWithChapters, getChapterMasterySummary, deleteCustomSubject } = useMocks();

  return (
    <div className="flex items-center justify-between gap-3 overflow-x-auto pb-2 custom-scrollbar">
      <div className="flex items-center gap-2 flex-nowrap shrink-0">
        {subjectsWithChapters.map((subject) => {
          const isSelected = selectedSubject.toLowerCase() === subject.name.toLowerCase();
          
          // Calculate chapter mastery for this subject
          const totalChapters = subject.chapters.length;
          const masteredCount = subject.chapters.filter(ch => {
            const sum = getChapterMasterySummary(subject.name, ch.chapterName);
            return sum.masteryStatus === 'Mastered';
          }).length;

          return (
            <div key={subject.id} className="relative group/tab flex items-center">
              <button
                onClick={() => onSelectSubject(subject.name)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all duration-200 border whitespace-nowrap shadow-sm ${
                  isSelected
                    ? 'bg-emerald-600 dark:bg-emerald-500 text-white dark:text-darkBg border-emerald-600 dark:border-emerald-400 shadow-glow-blue scale-105'
                    : 'bg-white dark:bg-darkSurface border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/20'
                }`}
              >
                <span className="text-base leading-none">{subject.icon}</span>
                <span>{subject.name}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  isSelected
                    ? 'bg-white/20 text-white dark:text-darkBg'
                    : 'bg-slate-100 dark:bg-darkContainer text-slate-600 dark:text-slate-400'
                }`}>
                  {masteredCount}/{totalChapters}
                </span>
              </button>

              {subject.isCustom && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Delete custom subject "${subject.name}"?`)) {
                      deleteCustomSubject(subject.id);
                    }
                  }}
                  title="Delete Custom Subject"
                  className="ml-1 p-1.5 rounded-lg text-slate-400 hover:text-alert-red hover:bg-alert-red/10 transition-colors opacity-0 group-hover/tab:opacity-100"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}

        {/* Add Custom Subject Button */}
        <button
          onClick={onAddSubjectClick}
          className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl border border-dashed border-emerald-500/40 hover:border-emerald-500 text-emerald-700 dark:text-mint bg-emerald-50/50 dark:bg-emerald-500/5 text-xs font-black transition-all hover:scale-105 whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>+ Add Subject</span>
        </button>
      </div>
    </div>
  );
};
