import React, { useMemo } from 'react';
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
import { Zap, Target, TrendingUp } from 'lucide-react';
import { MockTest, SectionName } from '../../types/mock';
import { useTheme } from '../../theme/ThemeContext';
import { Card3DTilt } from '../3d/Card3DTilt';

interface SectionalTrendChartProps {
  mocks: MockTest[];
  subjectTitle: string;
}

export const SectionalTrendChart: React.FC<SectionalTrendChartProps> = ({ mocks, subjectTitle }) => {
  const { activeTheme } = useTheme();

  const chartData = useMemo(() => {
    const sorted = [...mocks].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return sorted.map((m, idx) => ({
      index: idx + 1,
      name: `Drill #${idx + 1}`,
      fullName: m.testName,
      date: m.date,
      score: m.score,
      maxMarks: m.maxMarks,
      accuracy: m.accuracy,
      percentile: m.percentile,
      subject: m.subjectName || m.sections[0]?.sectionName || 'Subject'
    }));
  }, [mocks]);

  const isDark = activeTheme === 'dark';

  return (
    <Card3DTilt
      maxTilt={2}
      className={`p-6 border rounded-3xl transition-colors shadow-sm dark:shadow-3d-dark ${
        isDark ? 'bg-darkSurface border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-emerald-600 dark:text-mint" />
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
              {subjectTitle} Drill Trajectory
            </h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-medium">
            Score and accuracy progression across {chartData.length} sectional drills (50 Marks benchmark)
          </p>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-slate-500 dark:text-slate-400 text-sm font-medium">
          No sectional drills recorded for this subject filter.
        </div>
      ) : (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="sectionalScoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#BEFFCC" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#BEFFCC" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(15, 23, 42, 0.06)"} 
              />

              <XAxis 
                dataKey="index" 
                tickFormatter={(v) => `D#${v}`}
                stroke={isDark ? "#64748B" : "#94A3B8"}
                fontSize={11}
                tickLine={false}
              />

              <YAxis 
                domain={[10, 50]}
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
                        <div className="text-slate-400">Date: {data.date} • {data.subject}</div>
                        <div className="pt-1 flex items-center justify-between gap-4 font-bold text-sm">
                          <span className="text-slate-400">Score:</span>
                          <span className="text-mint-dark dark:text-mint">{data.score} / {data.maxMarks} M</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-400">
                          <span>Accuracy:</span>
                          <span className="text-electric-blue font-bold">{data.accuracy}%</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-400">
                          <span>Percentile:</span>
                          <span className="text-lavender font-bold">{data.percentile}%ile</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <ReferenceLine 
                y={35} 
                stroke="#6EC2FD" 
                strokeDasharray="4 4" 
                label={{ value: 'Target 70% (35 M)', fill: '#6EC2FD', fontSize: 10, position: 'insideTopLeft' }} 
              />

              <ReferenceLine 
                y={45} 
                stroke="#34D399" 
                strokeDasharray="3 3" 
                label={{ value: 'Elite 90% (45 M)', fill: '#34D399', fontSize: 10, position: 'insideTopRight' }} 
              />

              <Area
                type="monotone"
                dataKey="score"
                stroke="#BEFFCC"
                strokeWidth={3}
                fill="url(#sectionalScoreGradient)"
                activeDot={{ r: 6, fill: '#BEFFCC', stroke: '#FFFFFF', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card3DTilt>
  );
};
