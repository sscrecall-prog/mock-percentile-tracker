import React from 'react';
import { Target, Award, CheckCircle2, TrendingUp, Zap, Flame, ShieldCheck } from 'lucide-react';
import { useMocks } from '../../context/MockContext';
import { StatCard } from '../common/StatCard';

export const FullLengthDashboard: React.FC = () => {
  const { fullLengthKPIs, fullLengthMocks } = useMocks();

  return (
    <div className="space-y-4">
      {/* Top Full Length Highlights Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-darkElevated via-darkSurface to-darkContainer light:from-slate-50 light:via-white light:to-sky-50 border border-white/10 light:border-slate-200 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric-blue/15 border border-electric-blue/30 text-electric-blue text-xs font-bold uppercase tracking-wider">
            <Target className="w-3.5 h-3.5" />
            <span>Dedicated Exam Simulation Center</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-2">
            Full Length Mock Analytics
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mt-1">
            Exclusively tracking 100-Question / 200-Mark complete exam simulations. Chapter and sectional drills are filtered out to guarantee pure exam readiness accuracy.
          </p>
        </div>

        {/* Clearance Streak & Cutoff Success Badges */}
        <div className="flex items-center gap-3">
          <div className="p-4 rounded-2xl bg-darkSurface/80 light:bg-white border border-mint/30 shadow-glow-mint text-center min-w-[120px]">
            <div className="flex items-center justify-center gap-1 text-mint-dark dark:text-mint text-xs font-bold uppercase">
              <Flame className="w-4 h-4 fill-mint-dark" />
              <span>Clear Streak</span>
            </div>
            <div className="text-2xl font-black text-white light:text-slate-900 mt-1">
              {fullLengthKPIs.consecutiveClearanceStreak} <span className="text-xs font-semibold text-slate-400">Mocks</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-darkSurface/80 light:bg-white border border-electric-blue/30 shadow-glow-blue text-center min-w-[120px]">
            <div className="flex items-center justify-center gap-1 text-electric-blue text-xs font-bold uppercase">
              <ShieldCheck className="w-4 h-4" />
              <span>Cutoff Rate</span>
            </div>
            <div className="text-2xl font-black text-white light:text-slate-900 mt-1">
              {fullLengthKPIs.fullLengthCutoffRate}%
            </div>
          </div>
        </div>
      </div>

      {/* 6 Full Length Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          title="Full Mocks"
          value={fullLengthKPIs.totalMocks}
          subtitle="Full length attempted"
          icon={<Target className="w-4 h-4" />}
          accentColor="#6EC2FD"
        />

        <StatCard
          title="Avg Score"
          value={fullLengthKPIs.averageScore > 0 ? `${fullLengthKPIs.averageScore}` : '0'}
          subtitle="Full exam average"
          icon={<Award className="w-4 h-4" />}
          accentColor="#38BDF8"
        />

        <StatCard
          title="Peak Score"
          value={fullLengthKPIs.bestScore > 0 ? `${fullLengthKPIs.bestScore}` : '0'}
          subtitle="Personal record"
          icon={<Zap className="w-4 h-4" />}
          accentColor="#BEFFCC"
          trend={fullLengthKPIs.bestScore >= 160 ? { value: '98th %ile', isPositive: true } : undefined}
        />

        <StatCard
          title="Avg Accuracy"
          value={fullLengthKPIs.averageAccuracy > 0 ? `${fullLengthKPIs.averageAccuracy}%` : '0%'}
          subtitle="Full length quality"
          icon={<CheckCircle2 className="w-4 h-4" />}
          accentColor="#5EE88A"
        />

        <StatCard
          title="Avg Percentile"
          value={fullLengthKPIs.averagePercentile > 0 ? `${fullLengthKPIs.averagePercentile}%` : '0%'}
          subtitle="Simulation standing"
          icon={<TrendingUp className="w-4 h-4" />}
          accentColor="#A78BFA"
        />

        <StatCard
          title="Best Percentile"
          value={fullLengthKPIs.bestPercentile > 0 ? `${fullLengthKPIs.bestPercentile}%` : '0%'}
          subtitle="Top standing achieved"
          icon={<Award className="w-4 h-4" />}
          accentColor="#F472B6"
          trend={fullLengthKPIs.bestPercentile >= 98 ? { value: 'Top 2%', isPositive: true } : undefined}
        />
      </div>
    </div>
  );
};
