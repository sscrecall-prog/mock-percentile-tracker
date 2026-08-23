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
import { TrendingUp, Award, Target, CheckCircle2 } from 'lucide-react';
import { useMocks } from '../../context/MockContext';
import { useTheme } from '../../theme/ThemeContext';
import { Card3DTilt } from '../3d/Card3DTilt';

type TrendMetric = 'score' | 'accuracy' | 'percentile';

export const PerformanceTrendChart: React.FC = () => {
  const { mocks } = useMocks();
  const { activeTheme } = useTheme();
  const [metric, setMetric] = useState<TrendMetric>('score');

  const chartData = useMemo(() => {
    const sorted = [...mocks].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return sorted.map((m, idx) => ({
      index: idx + 1,
      name: m.testName.length > 20 ? `${m.testName.substring(0, 18)}...` : m.testName,
      fullName: m.testName,
      date: m.date,
      score: m.score,
      maxMarks: m.maxMarks,
      accuracy: m.accuracy,
      percentile: m.percentile,
      cutoffMarks: m.cutoffMarks,
      isClearedCutoff: m.isClearedCutoff
    }));
  }, [mocks]);

  const isDark = activeTheme === 'dark';

  const config = {
    score: {
      label: 'Score Progression',
      dataKey: 'score',
      unit: 'Marks',
      stroke: '#6EC2FD',
      fill: 'url(#scoreGradient)',
      icon: <Target className="w-4 h-4 text-electric-blue" />,
      domain: [0, 200] as [number, number]
    },
    accuracy: {
      label: 'Accuracy Trend',
      dataKey: 'accuracy',
      unit: '%',
      stroke: '#5EE88A',
      fill: 'url(#accGradient)',
      icon: <CheckCircle2 className="w-4 h-4 text-mint-dark" />,
      domain: [40, 100] as [number, number]
    },
    percentile: {
      label: 'Percentile Trajectory',
      dataKey: 'percentile',
      unit: '%ile',
      stroke: '#A78BFA',
      fill: 'url(#percGradient)',
      icon: <TrendingUp className="w-4 h-4 text-lavender" />,
      domain: [50, 100] as [number, number]
    }
  };

  const currentConfig = config[metric];

  return (
    <Card3DTilt
      maxTilt={2}
      className={`p-6 border rounded-3xl transition-colors shadow-sm dark:shadow-3d-dark ${
        isDark ? 'bg-darkSurface border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}
    >
      {/* Header with Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            {currentConfig.icon}
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {currentConfig.label}
            </h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-medium">
            Chronological progression across {chartData.length} mock tests
          </p>
        </div>

        {/* Metric Selector Tabs */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-darkContainer/70 border border-slate-200 dark:border-white/5 self-start sm:self-auto">
          {(['score', 'accuracy', 'percentile'] as TrendMetric[]).map((m) => (
            <button
              key={m}
              onClick={() => setMetric(m)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all duration-200 ${
                metric === m
                  ? 'bg-electric-blue text-darkBg shadow-glow-blue'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Canvas */}
      {chartData.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
          No mock test data available yet.
        </div>
      ) : (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6EC2FD" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6EC2FD" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="accGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5EE88A" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#5EE88A" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="percGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#A78BFA" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#A78BFA" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(15, 23, 42, 0.06)"} 
              />

              <XAxis 
                dataKey="index" 
                tickFormatter={(val) => `M#${val}`}
                stroke={isDark ? "#64748B" : "#94A3B8"}
                fontSize={11}
                tickLine={false}
              />

              <YAxis 
                domain={currentConfig.domain}
                stroke={isDark ? "#64748B" : "#94A3B8"}
                fontSize={11}
                tickLine={false}
              />

              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="p-3 rounded-xl bg-darkSurface/95 light:bg-white/95 border border-white/10 light:border-slate-200 shadow-2xl backdrop-blur-md text-xs space-y-1">
                        <div className="font-bold text-white light:text-slate-900">{data.fullName}</div>
                        <div className="text-slate-400">Date: {data.date}</div>
                        <div className="pt-1 flex items-center justify-between gap-4 font-semibold">
                          <span className="text-slate-400">{currentConfig.unit}:</span>
                          <span className="text-electric-blue text-sm font-extrabold">
                            {payload[0].value} {currentConfig.unit}
                          </span>
                        </div>
                        {metric === 'score' && (
                          <div className="text-[11px] text-slate-400 flex items-center justify-between">
                            <span>Cutoff benchmark:</span>
                            <span className={data.isClearedCutoff ? 'text-mint-dark font-bold' : 'text-alert-red font-bold'}>
                              {data.cutoffMarks} M
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />

              {metric === 'score' && (
                <ReferenceLine 
                  y={135} 
                  stroke="#EF4648" 
                  strokeDasharray="4 4" 
                  label={{ value: 'Cutoff (135)', fill: '#EF4648', fontSize: 10, position: 'insideTopRight' }} 
                />
              )}

              {metric === 'percentile' && (
                <ReferenceLine 
                  y={98} 
                  stroke="#BEFFCC" 
                  strokeDasharray="4 4" 
                  label={{ value: 'Target (98%ile)', fill: '#BEFFCC', fontSize: 10, position: 'insideTopRight' }} 
                />
              )}

              <Area
                type="monotone"
                dataKey={currentConfig.dataKey}
                stroke={currentConfig.stroke}
                strokeWidth={3}
                fill={currentConfig.fill}
                activeDot={{ r: 6, fill: currentConfig.stroke, stroke: '#FFFFFF', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card3DTilt>
  );
};
