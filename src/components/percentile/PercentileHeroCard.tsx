import React from 'react';
import { TrendingUp, Target, Award, Zap, ArrowUpRight } from 'lucide-react';
import { useMocks } from '../../context/MockContext';
import { PercentileOrbitalRing3D } from '../3d/PercentileOrbitalRing3D';
import { StatCard } from '../common/StatCard';

export const PercentileHeroCard: React.FC = () => {
  const { kpis, settings } = useMocks();

  const currentPercentile = kpis.averagePercentile;
  const targetPercentile = settings.targetPercentile;
  const percentileGap = Math.max(0, targetPercentile - currentPercentile);

  return (
    <div className="space-y-6">
      {/* 3D Visual Hero Panel */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-darkElevated via-darkSurface to-darkContainer light:from-white light:via-slate-50 light:to-sky-50 border border-white/10 light:border-slate-200 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Metrics & Gap Summary */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lavender/15 border border-lavender/30 text-lavender text-xs font-bold uppercase tracking-wider">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Competitive Percentile Engine</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Percentile Trajectory & Target Gap
            </h2>

            <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
              Your percentile represents the percentage of all test-takers you outperform. 
              {percentileGap > 0 ? (
                <>
                  {' '}You are currently <span className="font-bold text-mint-dark dark:text-mint">{percentileGap.toFixed(1)}%ile</span> away from your goal of <span className="font-bold text-electric-blue">{targetPercentile}%ile</span>.
                </>
              ) : (
                <>
                  {' '}Congratulations! You have reached your target percentile milestone of <span className="font-bold text-mint-dark dark:text-mint">{targetPercentile}%ile</span>!
                </>
              )}
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-darkSurface/60 light:bg-white border border-white/5 light:border-slate-200">
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Current Avg</div>
                <div className="text-xl font-black text-white light:text-slate-900 mt-0.5">
                  {currentPercentile > 0 ? `${currentPercentile}%` : '0%'}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-darkSurface/60 light:bg-white border border-white/5 light:border-slate-200">
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Target</div>
                <div className="text-xl font-black text-electric-blue mt-0.5">
                  {targetPercentile}%
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-darkSurface/60 light:bg-white border border-white/5 light:border-slate-200">
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Gap to Close</div>
                <div className="text-xl font-black text-mint-dark dark:text-mint mt-0.5">
                  {percentileGap > 0 ? `${percentileGap.toFixed(1)}%` : '0.0%'}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Orbital Percentile Ring */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <PercentileOrbitalRing3D
              currentPercentile={currentPercentile}
              targetPercentile={targetPercentile}
              bestPercentile={kpis.bestPercentile}
            />
          </div>

        </div>
      </div>

      {/* 4 Percentile KPI Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Current Percentile"
          value={kpis.averagePercentile > 0 ? `${kpis.averagePercentile}%` : '0%'}
          subtitle="Average across all mocks"
          icon={<TrendingUp className="w-4 h-4" />}
          accentColor="#6EC2FD"
        />

        <StatCard
          title="Best Percentile"
          value={kpis.bestPercentile > 0 ? `${kpis.bestPercentile}%` : '0%'}
          subtitle="Peak competition standing"
          icon={<Award className="w-4 h-4" />}
          accentColor="#BEFFCC"
          trend={kpis.bestPercentile >= 95 ? { value: 'Top Tier', isPositive: true } : undefined}
        />

        <StatCard
          title="Lowest Percentile"
          value={kpis.lowestPercentile > 0 ? `${kpis.lowestPercentile}%` : '0%'}
          subtitle="Baseline floor attempt"
          icon={<Zap className="w-4 h-4" />}
          accentColor="#EF4648"
        />

        <StatCard
          title="Target Percentile"
          value={`${settings.targetPercentile}%`}
          subtitle="Configured objective"
          icon={<Target className="w-4 h-4" />}
          accentColor="#A78BFA"
        />
      </div>
    </div>
  );
};
