import React, { useState } from 'react';
import { 
  MoreVertical, 
  Edit3, 
  Copy, 
  Trash2, 
  Calendar, 
  Clock, 
  Target, 
  TrendingUp, 
  CheckCircle2, 
  BarChart,
  GitCompare
} from 'lucide-react';
import { MockTest } from '../../types/mock';
import { useMocks } from '../../context/MockContext';
import { useTheme } from '../../theme/ThemeContext';
import { Card3DTilt } from '../3d/Card3DTilt';
import { Badge } from '../common/Badge';

interface MockCardProps {
  mock: MockTest;
}

export const MockCard: React.FC<MockCardProps> = ({ mock }) => {
  const { 
    setEditingMock, 
    setIsAddModalOpen, 
    duplicateMock, 
    deleteMock, 
    setViewingMockDetail, 
    selectedMockIds, 
    toggleMockSelection,
    setActiveView 
  } = useMocks();

  const { activeTheme } = useTheme();
  const [showMenu, setShowMenu] = useState(false);

  const isSelected = selectedMockIds.includes(mock.id);
  const isDark = activeTheme === 'dark';

  return (
    <Card3DTilt
      maxTilt={5}
      className={`group relative p-5 border rounded-2xl transition-all duration-300 shadow-3d-dark ${
        isSelected
          ? 'border-electric-blue bg-electric-blue/5'
          : isDark
            ? 'bg-darkSurface border-white/5 hover:border-white/15'
            : 'bg-white border-slate-200 hover:border-slate-300'
      }`}
    >
      {/* Top Bar: Checkbox, Platform, Mock Type & More Menu */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          {/* Comparison Checkbox */}
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => toggleMockSelection(mock.id)}
            title="Select to compare"
            className="w-4 h-4 rounded border-white/20 bg-darkContainer text-electric-blue focus:ring-0 cursor-pointer"
          />

          <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-electric-blue/15 text-electric-blue border border-electric-blue/20">
            {mock.testPlatform}
          </span>

          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold text-slate-400 bg-white/5 border border-white/5">
            {mock.mockType.replace('_', ' ')}
          </span>
        </div>

        <div className="flex items-center gap-1.5 relative">
          <Badge variant={mock.isClearedCutoff ? 'success' : 'alert'} size="sm">
            {mock.isClearedCutoff ? 'Cutoff Cleared ✓' : 'Below Cutoff ✗'}
          </Badge>

          {/* Options Dropdown */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div 
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-7 z-30 w-36 rounded-xl bg-darkElevated border border-white/10 shadow-2xl py-1 text-xs text-slate-200 animate-fadeIn"
              >
                <button
                  onClick={() => {
                    setShowMenu(false);
                    setViewingMockDetail(mock);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-white/10 flex items-center gap-2"
                >
                  <BarChart className="w-3.5 h-3.5 text-electric-blue" />
                  <span>View Details</span>
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    setEditingMock(mock);
                    setIsAddModalOpen(true);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-white/10 flex items-center gap-2"
                >
                  <Edit3 className="w-3.5 h-3.5 text-mint-dark" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    duplicateMock(mock.id);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-white/10 flex items-center gap-2"
                >
                  <Copy className="w-3.5 h-3.5 text-lavender" />
                  <span>Duplicate</span>
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    toggleMockSelection(mock.id);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-white/10 flex items-center gap-2"
                >
                  <GitCompare className="w-3.5 h-3.5 text-sky" />
                  <span>{isSelected ? 'Deselect' : 'Compare'}</span>
                </button>
                <div className="my-1 border-t border-white/10" />
                <button
                  onClick={() => {
                    setShowMenu(false);
                    if (confirm(`Delete "${mock.testName}"?`)) {
                      deleteMock(mock.id);
                    }
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-alert-red/20 text-alert-red flex items-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Test Title & Date */}
      <div 
        onClick={() => setViewingMockDetail(mock)}
        className="cursor-pointer"
      >
        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-electric-blue transition-colors line-clamp-1">
          {mock.testName}
        </h3>

        <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
          <span>{mock.exam} ({mock.tier})</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {mock.date}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {mock.timeTakenMinutes}m
          </span>
        </div>
      </div>

      {/* 3-Metric Score Block */}
      <div 
        onClick={() => setViewingMockDetail(mock)}
        className="mt-4 p-3 rounded-xl bg-darkContainer/50 light:bg-slate-100/70 border border-white/5 light:border-slate-200 grid grid-cols-3 gap-2 text-center cursor-pointer"
      >
        <div>
          <div className="text-[10px] text-slate-400 font-semibold uppercase">Score</div>
          <div className={`text-base sm:text-lg font-extrabold ${
            mock.isClearedCutoff ? 'text-mint-dark dark:text-mint' : 'text-slate-200 light:text-slate-800'
          }`}>
            {mock.score}
            <span className="text-[10px] text-slate-400 font-normal ml-0.5">/{mock.maxMarks}</span>
          </div>
        </div>

        <div>
          <div className="text-[10px] text-slate-400 font-semibold uppercase">Accuracy</div>
          <div className="text-base sm:text-lg font-extrabold text-electric-blue">
            {mock.accuracy}%
          </div>
        </div>

        <div>
          <div className="text-[10px] text-slate-400 font-semibold uppercase">Percentile</div>
          <div className="text-base sm:text-lg font-extrabold text-lavender">
            {mock.percentile}%
          </div>
        </div>
      </div>

      {/* Section Quick Dots */}
      {mock.sections.length > 0 && (
        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <span>{mock.sections.length} Sections:</span>
            <div className="flex items-center gap-1">
              {mock.sections.map((s, idx) => (
                <div
                  key={idx}
                  title={`${s.sectionName}: ${s.accuracy}% accuracy (${s.score} marks)`}
                  className={`w-2 h-2 rounded-full ${
                    s.accuracy >= 85 ? 'bg-mint-dark' : s.accuracy >= 70 ? 'bg-electric-blue' : 'bg-alert-red'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={() => setViewingMockDetail(mock)}
            className="text-[11px] font-bold text-electric-blue hover:underline"
          >
            Analysis →
          </button>
        </div>
      )}
    </Card3DTilt>
  );
};
