import React, { useState, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ReferenceLine 
} from 'recharts';
import { Target, TrendingUp, CheckCircle2 } from 'lucide-react';
import { useMocks } from '../../context/MockContext';
import { useTheme } from '../../theme/ThemeContext';
import { Card3DTilt } from '../3d/Card3DTilt';

type WindowFilter = '7' | '15' | '30' | 'ALL';

export const FullLengthTrendSection: React.FC = () => {
  const { fullLengthMocks } = useMocks();
  const { activeTheme } = useTheme();
  const [windowFilter, setWindowFilter] = useState<WindowFilter>('ALL');

  const filteredMocks = useMemo(() => {
    const sorted = [...fullLengthMocks].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    if (windowFilter === '7') return sorted.slice(-7);
    if (windowFilter === '15') return sorted.slice(-15);
    if (windowFilter === '30') return sorted.slice(-30);
    return sorted;
  }, [fullLengthMocks, windowFilter]);

  const chartData = useMemo(() => {
    return filteredMocks.map((m, idx) => ({
      index: idx + 1,
      name: `FL #${idx + 1}`,
      fullName: m.testName,
      date: m.date,
      score: m.score,
      maxMarks: m.maxMarks,
      accuracy: m.accuracy,
      percentile: m.percentile,
      cutoffMarks: m.cutoffMarks,
      isClearedCutoff: m.isClearedCutoff
    }));
  }, [filteredMocks]);

  const isDark = activeTheme === 'dark';

  return (
    <Card3DTilt
      maxTilt={2}
      className={`p-6 border rounded-3xl transition-colors shadow-3d-dark ${
        isDark ? 'bg-darkSurface border-white/5' : 'bg-white border-slate-200'
      }`}
    >
      {/* Header & Window Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-electric-blue" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Full Length Performance Trend
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Progression curve with 135-mark cutoff benchmark and percentile trajectory
          </p>
        </div>

        {/* Range Filters: 7 Mocks | 15 Mocks | 30 Mocks | All */}
        <div className="flex items-center p-1 rounded-xl bg-darkContainer/70 light:bg-slate-100 border border-white/5 light:border-slate-200 self-start sm:self-auto">
          {(['7', '15', '30', 'ALL'] as WindowFilter[]).map((w) => (
            <button
              key={w}
              onClick={() => setWindowFilter(w)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                windowFilter === w
                  ? 'bg-electric-blue text-darkBg shadow-glow-blue'
                  : 'text-slate-400 hover:text-white light:hover:text-slate-900'
              }`}
            >
              {w === 'ALL' ? 'All Mocks' : `${w} Mocks`}
            </button>
          ))}
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
          No full-length mock tests recorded yet.
        </div>
      ) : (
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="flScoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6EC2FD" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#6EC2FD" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(15, 23, 42, 0.06)"} 
              />

              <XAxis 
                dataKey="index" 
                tickFormatter={(v) => `Mock ${v}`}
                stroke={isDark ? "#64748B" : "#94A3B8"}
                fontSize={11}
                tickLine={false}
              />

              <YAxis 
                domain={[80, 200]}
                stroke={isDark ? "#64748B" : "#94A3B8"}
                fontSize={11}
                tickLine={false}
              />

              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="p-3.5 rounded-xl bg-darkSurface/95 light:bg-white/95 border border-white/10 light:border-slate-200 shadow-2xl backdrop-blur-md text-xs space-y-1.5">
                        <div className="font-bold text-white light:text-slate-900">{data.fullName}</div>
                        <div className="text-slate-400">Date: {data.date}</div>
                        <div className="pt-1 flex items-center justify-between gap-4 font-bold text-sm">
                          <span className="text-slate-400">Score:</span>
                          <span className="text-electric-blue">{data.score} / {data.maxMarks}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-400">
                          <span>Accuracy:</span>
                          <span className="text-mint-dark dark:text-mint font-bold">{data.accuracy}%</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-400">
                          <span>Percentile:</span>
                          <span className="text-lavender font-bold">{data.percentile}%ile</span>
                        </div>
                        <div className="pt-1 border-t border-white/10 flex items-center justify-between">
                          <span className="text-slate-400">Cutoff:</span>
                          <span className={data.isClearedCutoff ? 'text-mint-dark font-bold' : 'text-alert-red font-bold'}>
                            {data.isClearedCutoff ? `Cleared (+${(data.score - data.cutoffMarks).toFixed(1)})` : `Failed (${(data.score - data.cutoffMarks).toFixed(1)})`}
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <ReferenceLine 
                y={135} 
                stroke="#EF4648" 
                strokeDasharray="4 4" 
                label={{ value: 'Cutoff (135 Marks)', fill: '#EF4648', fontSize: 11, position: 'insideTopLeft' }} 
              />

              <ReferenceLine 
                y={160} 
                stroke="#34D399" 
                strokeDasharray="3 3" 
                label={{ value: 'Target 98th %ile (160 Marks)', fill: '#34D399', fontSize: 11, position: 'insideTopRight' }} 
              />

              <Area
                type="monotone"
                dataKey="score"
                stroke="#6EC2FD"
                strokeWidth={3}
                fill="url(#flScoreGradient)"
                activeDot={{ r: 7, fill: '#6EC2FD', stroke: '#FFFFFF', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card3DTilt>
  );
};
