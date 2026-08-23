import React, { useState } from 'react';
import { 
  MoreVertical, 
  Edit3, 
  Trash2, 
  Calendar, 
  Clock, 
  Zap, 
  Tag, 
  BarChart, 
  CheckCircle2,
  XCircle 
} from 'lucide-react';
import { MockTest, SectionName } from '../../types/mock';
import { useMocks } from '../../context/MockContext';
import { useTheme } from '../../theme/ThemeContext';
import { Card3DTilt } from '../3d/Card3DTilt';
import { Badge } from '../common/Badge';

interface SectionalMockCardProps {
  mock: MockTest;
  onOpenAnalysis: (mock: MockTest) => void;
}

export const SectionalMockCard: React.FC<SectionalMockCardProps> = ({ mock, onOpenAnalysis }) => {
  const { setEditingMock, setIsAddModalOpen, deleteMock } = useMocks();
  const { activeTheme } = useTheme();
  const [showMenu, setShowMenu] = useState(false);

  const isDark = activeTheme === 'dark';
  const subject = mock.subjectName || mock.sections[0]?.sectionName || 'Quantitative Aptitude';
  const paceSeconds = mock.attempted > 0 
    ? ((mock.timeTakenMinutes * 60) / mock.attempted).toFixed(0) 
    : '0';

  const getSubjectColor = (sub: SectionName) => {
    switch (sub) {
      case 'Quantitative Aptitude':
        return { bg: 'bg-sky-100 dark:bg-sky/15', text: 'text-sky-800 dark:text-sky', border: 'border-sky-300 dark:border-sky/30', icon: '📐' };
      case 'General Intelligence & Reasoning':
        return { bg: 'bg-emerald-100 dark:bg-mint/15', text: 'text-emerald-800 dark:text-mint', border: 'border-emerald-300 dark:border-mint/30', icon: '🧠' };
      case 'English Comprehension':
        return { bg: 'bg-purple-100 dark:bg-lavender/15', text: 'text-purple-800 dark:text-lavender', border: 'border-purple-300 dark:border-lavender/30', icon: '📖' };
      case 'General Awareness':
        return { bg: 'bg-amber-100 dark:bg-amberAccent/15', text: 'text-amber-800 dark:text-amberAccent', border: 'border-amber-300 dark:border-amberAccent/30', icon: '🌍' };
      default:
        return { bg: 'bg-sky-100 dark:bg-electric-blue/15', text: 'text-sky-800 dark:text-electric-blue', border: 'border-sky-300 dark:border-electric-blue/30', icon: '⚡' };
    }
  };

  const colors = getSubjectColor(subject);

  return (
    <Card3DTilt
      maxTilt={4}
      className={`group relative p-5 border rounded-2xl transition-all duration-300 shadow-sm dark:shadow-3d-dark space-y-3.5 ${
        isDark
          ? 'bg-darkSurface border-white/10 hover:border-white/20 text-white'
          : 'bg-white border-slate-200 hover:border-slate-300 text-slate-900'
      }`}
    >
      {/* Top Header: Subject Badge, Platform Tag & Action Menu */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`px-2.5 py-1 rounded-lg text-xs font-black border flex items-center gap-1.5 ${colors.bg} ${colors.text} ${colors.border}`}>
            <span>{colors.icon}</span>
            <span>{subject}</span>
          </span>

          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
            {mock.testPlatform}
          </span>
        </div>

        <div className="flex items-center gap-1 relative">
          <Badge variant={mock.accuracy >= 85 ? 'success' : mock.accuracy >= 70 ? 'primary' : 'alert'} size="sm">
            {mock.accuracy}% Acc
          </Badge>

          {/* Options Dropdown */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-1 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div 
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-7 z-30 w-36 rounded-xl bg-white dark:bg-darkElevated border border-slate-200 dark:border-white/10 shadow-xl py-1 text-xs text-slate-800 dark:text-slate-200 animate-fadeIn"
              >
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onOpenAnalysis(mock);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-white/10 flex items-center gap-2 font-medium"
                >
                  <BarChart className="w-3.5 h-3.5 text-sky-600 dark:text-electric-blue" />
                  <span>Drill Analysis</span>
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    setEditingMock(mock);
                    setIsAddModalOpen(true);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-white/10 flex items-center gap-2 font-medium"
                >
                  <Edit3 className="w-3.5 h-3.5 text-emerald-600 dark:text-mint" />
                  <span>Edit Drill</span>
                </button>
                <div className="my-1 border-t border-slate-200 dark:border-white/10" />
                <button
                  onClick={() => {
                    setShowMenu(false);
                    if (confirm(`Delete drill "${mock.testName}"?`)) {
                      deleteMock(mock.id);
                    }
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-alert-red/15 text-alert-red flex items-center gap-2 font-bold"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Drill Title & Date */}
      <div 
        onClick={() => onOpenAnalysis(mock)}
        className="cursor-pointer"
      >
        <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-electric-blue transition-colors line-clamp-1">
          {mock.testName}
        </h3>

        <div className="flex items-center gap-3 mt-1 text-xs text-slate-600 dark:text-slate-400 font-medium">
          <span>{mock.exam} ({mock.tier})</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-slate-500 dark:text-slate-400" />
            {mock.date}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-500 dark:text-slate-400" />
            {mock.timeTakenMinutes}m
          </span>
        </div>
      </div>

      {/* Topic Focus Tags (if provided) */}
      {(mock.topicFocus || (mock.weakAreas && mock.weakAreas.length > 0)) && (
        <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300">
          <Tag className="w-3 h-3 text-sky-600 dark:text-electric-blue shrink-0" />
          <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 line-clamp-1">
            {mock.topicFocus || mock.weakAreas.join(', ')}
          </span>
        </div>
      )}

      {/* 3-Metric Score Block tailored for 50 Marks */}
      <div 
        onClick={() => onOpenAnalysis(mock)}
        className="p-3 rounded-xl bg-slate-50 dark:bg-darkContainer/50 border border-slate-200 dark:border-white/10 grid grid-cols-3 gap-2 text-center cursor-pointer"
      >
        <div>
          <div className="text-[10px] text-slate-600 dark:text-slate-400 font-extrabold uppercase">Score</div>
          <div className="text-base sm:text-lg font-black text-emerald-700 dark:text-mint">
            {mock.score}
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal ml-0.5">/{mock.maxMarks}</span>
          </div>
        </div>

        <div>
          <div className="text-[10px] text-slate-600 dark:text-slate-400 font-extrabold uppercase">Accuracy</div>
          <div className="text-base sm:text-lg font-black text-sky-700 dark:text-electric-blue">
            {mock.accuracy}%
          </div>
        </div>

        <div>
          <div className="text-[10px] text-slate-600 dark:text-slate-400 font-extrabold uppercase">Speed Pace</div>
          <div className="text-base sm:text-lg font-black text-purple-700 dark:text-lavender">
            {paceSeconds}s
            <span className="text-[9px] text-slate-500 dark:text-slate-400 font-normal ml-0.5">/Q</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Correct vs Wrong & View Analysis link */}
      <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 pt-1 font-medium">
        <div className="flex items-center gap-2">
          <span className="text-emerald-700 dark:text-mint font-extrabold">{mock.correct} Correct</span>
          <span>•</span>
          <span className="text-alert-red font-extrabold">{mock.wrong} Wrong (-{mock.negativeMarks}M)</span>
        </div>

        <button
          onClick={() => onOpenAnalysis(mock)}
          className="text-[11px] font-bold text-sky-700 dark:text-electric-blue hover:underline"
        >
          Analysis →
        </button>
      </div>
    </Card3DTilt>
  );
};
