import React from 'react';
import { Target, Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { useMocks } from '../../context/MockContext';
import { Card3DTilt } from '../3d/Card3DTilt';

export const TargetGapCalculator: React.FC = () => {
  const { kpis, settings, updateSettings, mocks } = useMocks();

  const currentPercentile = kpis.averagePercentile;
  const targetPercentile = settings.targetPercentile;
  const gap = Math.max(0, targetPercentile - currentPercentile);

  // Estimate required score based on mock data
  const estimatedTargetScore = React.useMemo(() => {
    if (mocks.length === 0) return 160;
    // Find closest mock to target percentile
    const sortedByPerc = [...mocks].sort((a, b) => a.percentile - b.percentile);
    const match = sortedByPerc.find(m => m.percentile >= targetPercentile);
    if (match) return match.score;
    const highest = sortedByPerc[sortedByPerc.length - 1];
    return Number((highest.score + (targetPercentile - highest.percentile) * 1.5).toFixed(1));
  }, [mocks, targetPercentile]);

  const scoreGap = Math.max(0, estimatedTargetScore - kpis.averageScore);

  const presets = [90, 95, 97, 98, 99];

  return (
    <Card3DTilt
      maxTilt={2}
      className="p-6 rounded-3xl border border-white/5 light:border-slate-200 bg-darkSurface light:bg-white shadow-3d-dark space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-electric-blue">
            <Target className="w-4 h-4" />
            <span>Target Percentile Selector & Strategy</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1">
            Calculate Strategy to Close Percentile Gap
          </h3>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-darkContainer/60 light:bg-slate-100 border border-white/5">
          {presets.map((preset) => (
            <button
              key={preset}
              onClick={() => updateSettings({ targetPercentile: preset })}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all duration-200 ${
                targetPercentile === preset
                  ? 'bg-electric-blue text-darkBg shadow-glow-blue'
                  : 'text-slate-400 hover:text-white light:hover:text-slate-900'
              }`}
            >
              {preset}%
            </button>
          ))}
        </div>
      </div>

      {/* Gap Analysis 3-Column Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-darkContainer/50 light:bg-slate-50 border border-white/5 space-y-1">
          <div className="text-[10px] text-slate-400 font-semibold uppercase">Current Standing</div>
          <div className="text-xl font-black text-white light:text-slate-900">
            {currentPercentile > 0 ? `${currentPercentile}%ile` : '0%ile'}
          </div>
          <p className="text-[11px] text-slate-400">Avg Score: {kpis.averageScore} Marks</p>
        </div>

        <div className="p-4 rounded-2xl bg-darkContainer/50 light:bg-slate-50 border border-white/5 space-y-1">
          <div className="text-[10px] text-slate-400 font-semibold uppercase">Target Percentile</div>
          <div className="text-xl font-black text-electric-blue">
            {targetPercentile}%ile
          </div>
          <p className="text-[11px] text-slate-400">Estimated Score Needed: ~{estimatedTargetScore} Marks</p>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-mint/10 to-transparent border border-mint/20 space-y-1">
          <div className="text-[10px] text-mint-dark dark:text-mint font-semibold uppercase">Gap to Close</div>
          <div className="text-xl font-black text-mint-dark dark:text-mint">
            {gap > 0 ? `+${gap.toFixed(1)}%ile` : 'Goal Reached! 🎉'}
          </div>
          <p className="text-[11px] text-slate-400">
            {gap > 0 ? `Approx +${scoreGap.toFixed(1)} marks boost required` : 'Maintain current consistency'}
          </p>
        </div>
      </div>

      {/* Actionable Strategy Advice */}
      <div className="p-4 rounded-2xl bg-darkContainer/30 light:bg-slate-50 border border-white/5 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-200 light:text-slate-800">
          <Sparkles className="w-4 h-4 text-lavender" />
          <span>Data-Driven Strategy to Reach {targetPercentile}th Percentile</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          {gap > 4 ? (
            `To close the ${gap.toFixed(1)}%ile margin, prioritize eliminating negative marking in General Awareness and General Intelligence. Cutting 4 wrong guesses immediately rescues +10 marks.`
          ) : gap > 0 ? (
            `You are within striking distance of the ${targetPercentile}th percentile. Increase Quantitative Aptitude attempt coverage by 2 questions while preserving reasoning accuracy above 92%.`
          ) : (
            `You are operating at or above your ${targetPercentile}th percentile target. Focus on maintaining timing discipline under exam-day conditions.`
          )}
        </p>
      </div>
    </Card3DTilt>
  );
};
