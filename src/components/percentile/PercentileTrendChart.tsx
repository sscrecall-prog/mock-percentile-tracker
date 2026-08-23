import React, { useMemo } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ReferenceLine 
} from 'recharts';
import { TrendingUp, Target } from 'lucide-react';
import { useMocks } from '../../context/MockContext';
import { useTheme } from '../../theme/ThemeContext';
import { Card3DTilt } from '../3d/Card3DTilt';

export const PercentileTrendChart: React.FC = () => {
  const { mocks, settings } = useMocks();
  const { activeTheme } = useTheme();

  const chartData = useMemo(() => {
    const sorted = [...mocks].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return sorted.map((m, idx) => ({
      index: idx + 1,
      name: `Mock #${idx + 1}`,
      fullName: m.testName,
      date: m.date,
      percentile: m.percentile,
      score: m.score
    }));
  }, [mocks]);

  const isDark = activeTheme === 'dark';

  return (
    <Card3DTilt
      maxTilt={2}
      className={`p-6 border rounded-3xl transition-colors shadow-3d-dark ${
        isDark ? 'bg-darkSurface border-white/5' : 'bg-white border-slate-200'
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-lavender" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Percentile Progression Curve
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Chronological growth curve against your {settings.targetPercentile}th percentile target benchmark
          </p>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
          No mock tests logged yet.
        </div>
      ) : (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(15, 23, 42, 0.06)"} 
              />

              <XAxis 
                dataKey="index" 
                tickFormatter={(v) => `M#${v}`}
                stroke={isDark ? "#64748B" : "#94A3B8"}
                fontSize={11}
                tickLine={false}
              />

              <YAxis 
                domain={[70, 100]}
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
                        <div className="text-lavender font-extrabold text-sm pt-1">
                          {data.percentile}%ile ({data.score} Marks)
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <ReferenceLine 
                y={settings.targetPercentile} 
                stroke="#A78BFA" 
                strokeDasharray="4 4" 
                label={{ 
                  value: `Target (${settings.targetPercentile}%ile)`, 
                  fill: '#A78BFA', 
                  fontSize: 10, 
                  position: 'insideTopRight' 
                }} 
              />

              <Line
                type="monotone"
                dataKey="percentile"
                stroke="#A78BFA"
                strokeWidth={3}
                dot={{ r: 5, fill: '#A78BFA', stroke: '#FFFFFF', strokeWidth: 2 }}
                activeDot={{ r: 7, fill: '#A78BFA', stroke: '#BEFFCC', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card3DTilt>
  );
};
