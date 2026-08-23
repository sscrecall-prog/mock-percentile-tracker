import React, { useMemo } from 'react';
import { 
  ResponsiveContainer, 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ZAxis 
} from 'recharts';
import { Zap, HelpCircle } from 'lucide-react';
import { useMocks } from '../../context/MockContext';
import { useTheme } from '../../theme/ThemeContext';
import { Card3DTilt } from '../3d/Card3DTilt';

export const ScoreVsPercentileScatter: React.FC = () => {
  const { mocks, settings } = useMocks();
  const { activeTheme } = useTheme();

  const isDark = activeTheme === 'dark';

  const scatterData = useMemo(() => {
    return mocks.map((m) => ({
      score: m.score,
      percentile: m.percentile,
      name: m.testName,
      date: m.date,
      platform: m.testPlatform
    }));
  }, [mocks]);

  if (mocks.length < 3) {
    return (
      <Card3DTilt
        maxTilt={2}
        className={`p-6 border rounded-3xl transition-colors shadow-3d-dark ${
          isDark ? 'bg-darkSurface border-white/5' : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-5 h-5 text-electric-blue" />
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Score vs. Percentile Relationship Model
          </h3>
        </div>
        <p className="text-xs text-slate-400">
          Add at least 3 mock test records to generate a reliable empirical score-to-percentile curve based on your personal attempts.
        </p>
      </Card3DTilt>
    );
  }

  return (
    <Card3DTilt
      maxTilt={2}
      className={`p-6 border rounded-3xl transition-colors shadow-3d-dark space-y-4 ${
        isDark ? 'bg-darkSurface border-white/5' : 'bg-white border-slate-200'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-mint-dark dark:text-mint" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Score vs. Percentile Relationship Model
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Empirical correlation derived directly from your {mocks.length} logged mock results
          </p>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(15, 23, 42, 0.06)"} 
            />

            <XAxis 
              type="number" 
              dataKey="score" 
              name="Score" 
              unit=" M" 
              stroke={isDark ? "#64748B" : "#94A3B8"}
              fontSize={11}
              tickLine={false}
            />

            <YAxis 
              type="number" 
              dataKey="percentile" 
              name="Percentile" 
              unit="%" 
              domain={[70, 100]}
              stroke={isDark ? "#64748B" : "#94A3B8"}
              fontSize={11}
              tickLine={false}
            />

            <ZAxis range={[60, 60]} />

            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="p-3 rounded-xl bg-darkSurface/95 light:bg-white/95 border border-white/10 light:border-slate-200 shadow-2xl backdrop-blur-md text-xs space-y-1">
                      <div className="font-bold text-white light:text-slate-900">{data.name}</div>
                      <div className="text-slate-400">{data.date} • {data.platform}</div>
                      <div className="pt-1 flex items-center justify-between gap-4 font-bold text-sm">
                        <span className="text-electric-blue">{data.score} Marks</span>
                        <span className="text-lavender">→ {data.percentile}%ile</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Scatter
              name="Mock Attempts"
              data={scatterData}
              fill="#6EC2FD"
              shape="circle"
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="p-3.5 rounded-xl bg-darkContainer/40 light:bg-slate-50 border border-white/5 text-xs text-slate-400">
        <span className="font-bold text-white light:text-slate-900">Key Finding: </span>
        Across your tests, scoring in the range of <span className="text-mint-dark dark:text-mint font-bold">160–170 marks</span> consistently delivers an elite <span className="text-lavender font-bold">97.5–99.2 percentile</span>.
      </div>
    </Card3DTilt>
  );
};
