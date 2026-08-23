import React from 'react';
import { 
  Trophy, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  BarChart2, 
  Plus, 
  Trash2, 
  Tag, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { ChapterDefinition, ChapterMasterySummary } from '../../types/mock';
import { useMocks } from '../../context/MockContext';
import { Card3DTilt } from '../3d/Card3DTilt';
import { Badge } from '../common/Badge';

interface ChapterCardProps {
  chapter: ChapterDefinition;
  summary: ChapterMasterySummary;
  onOpenAnalysis: (chapterName: string) => void;
  onLogTestForChapter: (subjectName: string, chapterName: string) => void;
}

export const ChapterCard: React.FC<ChapterCardProps> = ({
  chapter,
  summary,
  onOpenAnalysis,
  onLogTestForChapter
}) => {
  const { deleteCustomChapter } = useMocks();

  const getStatusBadge = () => {
    switch (summary.masteryStatus) {
      case 'Mastered':
        return (
          <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-emerald-100 dark:bg-mint/15 text-emerald-800 dark:text-mint border border-emerald-300 dark:border-mint/30 flex items-center gap-1">
            <Trophy className="w-3 h-3" />
            <span>Mastered</span>
          </span>
        );
      case 'Strong':
        return (
          <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-amber-100 dark:bg-amber-500/15 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Strong</span>
          </span>
        );
      case 'Needs Practice':
        return (
          <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-red-100 dark:bg-alert-red/15 text-red-800 dark:text-alert-red border border-red-300 dark:border-alert-red/30 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            <span>Needs Practice</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10">
            Not Started
          </span>
        );
    }
  };

  return (
    <Card3DTilt
      maxTilt={4}
      className="group relative p-5 rounded-2xl bg-white dark:bg-darkSurface border border-slate-200 dark:border-white/10 hover:border-emerald-500/40 dark:hover:border-emerald-500/40 shadow-sm dark:shadow-3d-dark transition-all duration-300 flex flex-col justify-between space-y-4"
    >
      {/* Top Header: Title & Mastery Badge */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-mint transition-colors line-clamp-1">
                {chapter.chapterName}
              </h3>
              {chapter.isCustom && (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-emerald-100 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30">
                  Custom
                </span>
              )}
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              {summary.totalTests > 0 
                ? `${summary.totalTests} tests logged • ${summary.attempted} Qs attempted`
                : 'Target: 85%+ Accuracy mastery'}
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-1.5">
            {getStatusBadge()}
            {chapter.isCustom && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`Delete custom chapter "${chapter.chapterName}"?`)) {
                    deleteCustomChapter(chapter.subject, chapter.id);
                  }
                }}
                title="Delete Chapter"
                className="p-1 rounded-lg text-slate-400 hover:text-alert-red hover:bg-alert-red/10 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Subtopic tags */}
        {chapter.subtopics && chapter.subtopics.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap mt-2.5">
            {chapter.subtopics.slice(0, 3).map((tag, idx) => (
              <span 
                key={idx}
                className="px-2 py-0.5 rounded-md text-[10px] font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-darkContainer border border-slate-200 dark:border-white/5 line-clamp-1"
              >
                {tag}
              </span>
            ))}
            {chapter.subtopics.length > 3 && (
              <span className="text-[10px] font-bold text-slate-500">
                +{chapter.subtopics.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Accuracy & Speed Progress Block */}
      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-darkContainer/50 border border-slate-200 dark:border-white/5 space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
            Accuracy Rate
          </span>
          <span className={`text-sm font-black ${
            summary.avgAccuracy >= 85
              ? 'text-emerald-700 dark:text-mint'
              : summary.avgAccuracy >= 70
                ? 'text-amber-600 dark:text-amber-400'
                : summary.totalTests > 0
                  ? 'text-alert-red'
                  : 'text-slate-400'
          }`}>
            {summary.totalTests > 0 ? `${summary.avgAccuracy}%` : 'No Attempts'}
          </span>
        </div>

        {/* Accuracy Bar */}
        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-darkBg overflow-hidden">
          <div
            style={{ width: `${summary.avgAccuracy}%` }}
            className={`h-full transition-all duration-500 ${
              summary.avgAccuracy >= 85
                ? 'bg-emerald-600 dark:bg-mint'
                : summary.avgAccuracy >= 70
                  ? 'bg-amber-500'
                  : 'bg-alert-red'
            }`}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 dark:text-slate-400 pt-0.5">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-purple-600 dark:text-lavender" />
            <span>Pace: {summary.avgPaceSeconds > 0 ? `${summary.avgPaceSeconds}s/Q` : 'N/A'}</span>
          </div>

          <div>
            <span>Best: </span>
            <span className="text-slate-900 dark:text-white font-black">{summary.bestScore > 0 ? `${summary.bestScore}M` : '0M'}</span>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={() => onLogTestForChapter(chapter.subject, chapter.chapterName)}
          className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white dark:text-darkBg text-xs font-black flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>Log Chapter Test</span>
        </button>

        {summary.totalTests > 0 && (
          <button
            onClick={() => onOpenAnalysis(chapter.chapterName)}
            className="py-2 px-3 rounded-xl border border-slate-200 dark:border-white/10 hover:border-emerald-500/30 bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-white hover:text-emerald-700 dark:hover:text-mint text-xs font-bold transition-all flex items-center gap-1"
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Diagnosis</span>
          </button>
        )}
      </div>
    </Card3DTilt>
  );
};
