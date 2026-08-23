import React, { useMemo } from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Cell 
} from 'recharts';
import { Clock, Zap, Gauge } from 'lucide-react';
import { useMocks } from '../../context/MockContext';
import { useTheme } from '../../theme/ThemeContext';
import { Card3DTilt } from '../3d/Card3DTilt';

export const TimeManagementAnalytics: React.FC = () => {
  const { mocks, subjectStats } = useMocks();
  const { activeTheme } = useTheme();

  const isDark = activeTheme === 'dark';

  const timeData = useMemo(() => {
    return subjectStats.map((s) => ({
      name: s.label.split(' ')[0],
      fullName: s.label,
      time: s.averageTimeMinutes,
      color: s.color
    }));
  }, [subjectStats]);

  const totalAvgTime = mocks.length > 0 
    ? (mocks.reduce((sum, m) => sum + m.timeTakenMinutes, 0) / mocks.length).toFixed(1)
    : '0';

  const avgSpeedSec = mocks.length > 0
    ? ((Number(totalAvgTime) * 60) / (mocks.reduce((sum, m) => sum + m.attempted, 0) / mocks.length || 1)).toFixed(0)
    : '0';

  return (
    <Card3DTilt
      maxTilt={2}
      className={`p-6 border rounded-3xl transition-colors shadow-3d-dark space-y-6 ${
        isDark ? 'bg-darkSurface border-white/5' : 'bg-white border-slate-200'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-electric-blue">
            <Clock className="w-4 h-4" />
            <span>Time Distribution & Pace Diagnostics</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1">
            Section-Wise Time Consumption
          </h3>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-darkContainer light:bg-slate-100 border border-white/5">
            <span className="text-slate-400">Total Avg Time: </span>
            <span className="font-bold text-white light:text-slate-900">{totalAvgTime} min</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-darkContainer light:bg-slate-100 border border-white/5">
            <span className="text-slate-400">Pace: </span>
            <span className="font-bold text-mint-dark dark:text-mint">{avgSpeedSec}s / Q</span>
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={timeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(15, 23, 42, 0.06)"} 
            />

            <XAxis 
              dataKey="name" 
              stroke={isDark ? "#64748B" : "#94A3B8"}
              fontSize={11}
              tickLine={false}
            />

            <YAxis 
              unit="m"
              stroke={isDark ? "#64748B" : "#94A3B8"}
              fontSize={11}
              tickLine={false}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="p-3 rounded-xl bg-darkSurface/95 light:bg-white/95 border border-white/10 shadow-xl text-xs space-y-1">
                      <div className="font-bold text-white light:text-slate-900">{data.fullName}</div>
                      <div className="text-electric-blue font-extrabold text-sm">
                        {data.time} Minutes Average
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Bar dataKey="time" radius={[8, 8, 0, 0]}>
              {timeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card3DTilt>
  );
};
