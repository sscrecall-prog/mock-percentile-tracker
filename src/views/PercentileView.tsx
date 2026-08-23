import React from 'react';
import { PercentileHeroCard } from '../components/percentile/PercentileHeroCard';
import { TargetGapCalculator } from '../components/percentile/TargetGapCalculator';
import { PercentileTrendChart } from '../components/percentile/PercentileTrendChart';
import { ScoreVsPercentileScatter } from '../components/percentile/ScoreVsPercentileScatter';

export const PercentileView: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. 3D Percentile Orbital Hero Card & KPIs */}
      <PercentileHeroCard />

      {/* 2. Target Gap Engine & Strategy Calculator */}
      <TargetGapCalculator />

      {/* 3. Percentile Progression Line Chart */}
      <PercentileTrendChart />

      {/* 4. Empirical Score vs. Percentile Relationship Model */}
      <ScoreVsPercentileScatter />
    </div>
  );
};
