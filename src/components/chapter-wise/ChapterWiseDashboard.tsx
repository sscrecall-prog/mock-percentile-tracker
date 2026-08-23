import React from 'react';
import { 
  Trophy, 
  Target, 
  AlertTriangle, 
  CheckCircle2, 
  BookOpen, 
  TrendingUp, 
  Sparkles, 
  Plus, 
  Layers 
} from 'lucide-react';
import { useMocks } from '../../context/MockContext';
import { StatCard } from '../common/StatCard';
import { Card3DTilt } from '../3d/Card3DTilt';

interface ChapterWiseDashboardProps {
  onAddChapterClick: () => void;
}

export const ChapterWiseDashboard: React.FC<ChapterWiseDashboardProps> = ({ onAddChapterClick }) => {
  const { overallChapterMastery, setIsAddModalOpen, setEditingMock } = useMocks();

  const {
    totalChapters,
    mastered,
    strong,
    needsPractice,
    notStarted,
    totalChapterTests,
    avgChapterAccuracy,
    completionRate
  } = overallChapterMastery;

  return (
    <div className="space-y-6">
      {/* 1. Top Chapter Mastery Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden p-6 sm:p-8 border border-slate-200 dark:border-white/10 bg-white dark:bg-darkElevated shadow-sm dark:shadow-2xl">
        {/* Glow accents */}
        <div className="absolute top-0 right-1/4 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-mint text-xs font-black">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Hierarchical Syllabus & Chapter Mastery Hub</span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Subject & Chapter-Wise Analysis 📑
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl font-medium leading-relaxed">
                Track micro-drills, diagnose chapter-level conceptual weaknesses, and elevate your accuracy to the 85%+ mastery threshold.
              </p>
            </div>

            {/* Syllabus Mastery Progress Bar */}
            <div className="pt-2 max-w-lg space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700 dark:text-slate-300">Syllabus Chapter Mastery</span>
                <span className="text-emerald-700 dark:text-mint font-black">{completionRate}% Completed</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-darkContainer overflow-hidden flex">
                <div 
                  style={{ width: `${(mastered / (totalChapters || 1)) * 100}%` }}
                  className="h-full bg-emerald-600 dark:bg-mint" 
                  title={`Mastered: ${mastered}`}
                />
                <div 
                  style={{ width: `${(strong / (totalChapters || 1)) * 100}%` }}
                  className="h-full bg-amber-500" 
                  title={`Strong: ${strong}`}
                />
                <div 
                  style={{ width: `${(needsPractice / (totalChapters || 1)) * 100}%` }}
                  className="h-full bg-alert-red" 
                  title={`Needs Practice: ${needsPractice}`}
                />
              </div>
              <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 pt-0.5">
                <span className="flex items-center gap-1 text-emerald-700 dark:text-mint font-black">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-mint" />
                  {mastered} Mastered
                </span>
                <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  {strong} Strong
                </span>
                <span className="flex items-center gap-1 text-alert-red font-bold">
                  <span className="w-2 h-2 rounded-full bg-alert-red" />
                  {needsPractice} Practice Needed
                </span>
                <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-600" />
                  {notStarted} Unattempted
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action CTAs */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <button
              onClick={() => {
                setEditingMock(null);
                setIsAddModalOpen(true);
              }}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-amber-500 text-darkBg font-black text-xs sm:text-sm shadow-glow-blue hover:opacity-95 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Log Chapter Test</span>
            </button>

            <button
              onClick={onAddChapterClick}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10 font-bold text-xs transition-all"
            >
              <Layers className="w-4 h-4 text-emerald-600 dark:text-mint" />
              <span>+ Add Custom Chapter</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Mastered Chapters"
          value={`${mastered}`}
          subtitle={`Out of ${totalChapters} Total Chapters`}
          icon={<Trophy className="w-5 h-5 text-emerald-600 dark:text-mint" />}
          trend={{ isPositive: true, value: `${((mastered / (totalChapters || 1)) * 100).toFixed(0)}%` }}
        />

        <StatCard
          title="Strong Chapters"
          value={`${strong}`}
          subtitle="70% - 85% Accuracy Range"
          icon={<CheckCircle2 className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
        />

        <StatCard
          title="Needs Revision"
          value={`${needsPractice}`}
          subtitle="Accuracy < 70% Traps"
          icon={<AlertTriangle className="w-5 h-5 text-alert-red" />}
          trend={needsPractice > 0 ? { isPositive: false, value: `${needsPractice} chapters` } : undefined}
        />

        <StatCard
          title="Topic Tests Logged"
          value={`${totalChapterTests}`}
          subtitle={`Avg Accuracy: ${avgChapterAccuracy}%`}
          icon={<BookOpen className="w-5 h-5 text-purple-600 dark:text-lavender" />}
        />
      </div>
    </div>
  );
};
