import React from 'react';
import { SectionName } from '../../types/mock';

interface SectionalSubjectFilterTabsProps {
  selectedSubject: SectionName | 'ALL';
  onSelectSubject: (subject: SectionName | 'ALL') => void;
  counts: Record<string, number>;
}

export const SectionalSubjectFilterTabs: React.FC<SectionalSubjectFilterTabsProps> = ({
  selectedSubject,
  onSelectSubject,
  counts
}) => {
  const tabs: { id: SectionName | 'ALL'; label: string; icon: string; color: string }[] = [
    { id: 'ALL', label: 'All Subjects', icon: '⚡', color: 'text-electric-blue' },
    { id: 'Quantitative Aptitude', label: 'Quantitative Aptitude', icon: '📐', color: 'text-sky' },
    { id: 'General Intelligence & Reasoning', label: 'Reasoning', icon: '🧠', color: 'text-mint-dark' },
    { id: 'English Comprehension', label: 'English', icon: '📖', color: 'text-lavender' },
    { id: 'General Awareness', label: 'General Awareness', icon: '🌍', color: 'text-amberAccent' },
    { id: 'Computer Knowledge', label: 'Computer', icon: '💻', color: 'text-slate-300' }
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      {tabs.map((tab) => {
        const isActive = selectedSubject === tab.id;
        const count = counts[tab.id] || 0;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectSubject(tab.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all duration-200 border ${
              isActive
                ? 'bg-electric-blue text-darkBg border-electric-blue shadow-glow-blue scale-[1.02]'
                : 'bg-white dark:bg-darkSurface text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border-slate-200 dark:border-white/10 shadow-sm'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 text-[10px] rounded-md font-black ${
                isActive
                  ? 'bg-darkBg/20 text-darkBg'
                  : 'bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
