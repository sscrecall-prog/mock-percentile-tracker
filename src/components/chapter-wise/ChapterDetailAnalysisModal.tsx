import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { 
  Trophy, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Sparkles, 
  Calendar, 
  Tag, 
  Edit3, 
  Trash2, 
  Plus 
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { ChapterMasterySummary, MockTest } from '../../types/mock';
import { useMocks } from '../../context/MockContext';
import { useTheme } from '../../theme/ThemeContext';

interface ChapterDetailAnalysisModalProps {
  summary: ChapterMasterySummary | null;
  onClose: () => void;
  onLogTestForChapter: (subject: string, chapter: string) => void;
}

export const ChapterDetailAnalysisModal: React.FC<ChapterDetailAnalysisModalProps> = ({
  summary,
  onClose,
  onLogTestForChapter
}) => {
  const { setEditingMock, setIsAddModalOpen, deleteMock } = useMocks();
  const { activeTheme } = useTheme();

  if (!summary) return null;

  const isDark = activeTheme === 'dark';

  // Chart chronological progression
  const chartData = [...summary.recentTests]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((t, idx) => ({
      testIndex: `#${idx + 1}`,
      date: t.date,
      accuracy: t.accuracy,
      score: t.score,
      maxMarks: t.maxMarks
    }));

  const getPaceDiagnosis = () => {
    if (summary.avgPaceSeconds <= 45 && summary.avgAccuracy >= 85) {
      return {
        title: 'Mastery Level Speed & Precision 🔥',
        desc: 'You are solving questions with high cognitive recall and zero negative traps. Ready for tough mock simulations!',
        color: 'text-emerald-700 dark:text-mint'
      };
    }
    if (summary.avgAccuracy < 70) {
      return {
        title: 'Conceptual Leak Identified ⚠️',
        desc: 'Accuracy is below 70%. Review fundamental theorem formulas, avoid negative guesses, and practice 15 untimed practice questions.',
        color: 'text-alert-red'
      };
    }
    return {
      title: 'Solid Core Mechanics 🟢',
      desc: 'Consistent accuracy. Focus on shortcut calculation techniques to bring solve time below 50 seconds per question.',
      color: 'text-amber-600 dark:text-amber-400'
    };
  };

  const diagnosis = getPaceDiagnosis();

  return (
    <Modal
      isOpen={Boolean(summary)}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-lg text-xs font-black bg-emerald-100 dark:bg-mint/15 text-emerald-800 dark:text-mint border border-emerald-300 dark:border-mint/30">
            {summary.subject}
          </span>
          <span className="truncate">{summary.chapterName} (Diagnosis)</span>
        </div>
      }
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6">
        
        {/* Top Header Card */}
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-darkElevated border border-slate-200 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400">
              <span>{summary.totalTests} Attempted Tests</span>
              <span>•</span>
              <span>{summary.attempted} Total Questions</span>
            </div>

            <div className="mt-2 flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                {summary.avgAccuracy}%
              </span>
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                Average Accuracy
              </span>
              <span className="text-xl font-black text-emerald-700 dark:text-mint ml-2">
                Best: {summary.bestScore} M
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              onClose();
              onLogTestForChapter(summary.subject, summary.chapterName);
            }}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 text-white dark:text-darkBg font-black text-xs shadow-glow-blue transition-all self-start md:self-auto flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Log Another Test</span>
          </button>
        </div>

        {/* Speed & Concept Diagnosis Alert */}
        <div className="p-5 rounded-2xl bg-emerald-50/80 dark:bg-mint/10 border border-emerald-300 dark:border-mint/30 space-y-1.5">
          <div className={`flex items-center gap-2 text-xs font-black uppercase tracking-wider ${diagnosis.color}`}>
            <Sparkles className="w-4 h-4" />
            <span>{diagnosis.title}</span>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            {diagnosis.desc}
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-darkContainer/50 border border-slate-200 dark:border-white/5">
            <div className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase">Avg Pace</div>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
              {summary.avgPaceSeconds}s <span className="text-xs font-normal text-slate-500 dark:text-slate-400">/ Q</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-darkContainer/50 border border-slate-200 dark:border-white/5">
            <div className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase">Mastery Level</div>
            <div className="text-base sm:text-lg font-black text-emerald-700 dark:text-mint mt-0.5">
              {summary.masteryStatus}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-darkContainer/50 border border-slate-200 dark:border-white/5">
            <div className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase">Correct vs Wrong</div>
            <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
              <span className="text-emerald-700 dark:text-mint">{summary.correct}C</span> / <span className="text-alert-red">{summary.wrong}W</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-darkContainer/50 border border-slate-200 dark:border-white/5">
            <div className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase">Avg Score</div>
            <div className="text-xl font-black text-amber-600 dark:text-amber-400 mt-0.5">
              {summary.avgScore} <span className="text-xs font-normal text-slate-500">M</span>
            </div>
          </div>
        </div>

        {/* Accuracy Progression Chart */}
        {chartData.length > 1 && (
          <div className="p-5 rounded-2xl bg-slate-100 dark:bg-darkContainer/30 border border-slate-200 dark:border-white/5 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-700 dark:text-slate-300 uppercase tracking-wider">Chapter Accuracy Trajectory</span>
              <span className="text-emerald-700 dark:text-mint">Target: 85%+ Mastery</span>
            </div>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="chAccuracyGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#333' : '#e2e8f0'} />
                  <XAxis dataKey="testIndex" stroke={isDark ? '#888' : '#64748b'} tick={{ fontSize: 11 }} />
                  <YAxis domain={[40, 100]} stroke={isDark ? '#888' : '#64748b'} tick={{ fontSize: 11 }} unit="%" />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="p-3 rounded-xl bg-white dark:bg-darkSurface border border-slate-200 dark:border-white/10 shadow-xl text-xs">
                            <div className="font-bold text-slate-900 dark:text-white">{data.date}</div>
                            <div className="text-emerald-700 dark:text-mint font-black mt-1">Accuracy: {data.accuracy}%</div>
                            <div className="text-slate-600 dark:text-slate-400">Score: {data.score} / {data.maxMarks} M</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="accuracy"
                    stroke="#10B981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#chAccuracyGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Past Chapter Tests List */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-400">
            Past Tests in this Chapter ({summary.recentTests.length})
          </h4>

          <div className="space-y-2">
            {summary.recentTests.map((t) => (
              <div
                key={t.id}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-darkContainer/40 border border-slate-200 dark:border-white/5 flex items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="font-black text-slate-900 dark:text-white line-clamp-1">
                    {t.testName}
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium">
                    <span>{t.testPlatform}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {t.date}
                    </span>
                    {t.difficulty && (
                      <>
                        <span>•</span>
                        <span className="font-bold text-amber-600 dark:text-amber-400">{t.difficulty}</span>
                      </>
                    )}
                  </div>
                  {t.analysisNotes && (
                    <div className="text-[11px] text-slate-600 dark:text-slate-300 italic">
                      "{t.analysisNotes}"
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <div className="text-sm font-black text-emerald-700 dark:text-mint">
                      {t.score} / {t.maxMarks} M
                    </div>
                    <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                      {t.accuracy}% Acc ({t.timeTakenMinutes}m)
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingMock(t);
                        onClose();
                        setIsAddModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-200 dark:hover:bg-white/10"
                      title="Edit Test"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete test "${t.testName}"?`)) {
                          deleteMock(t.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-alert-red hover:bg-alert-red/10"
                      title="Delete Test"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </Modal>
  );
};
