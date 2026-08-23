import React from 'react';
import { Layers, Award, Target, CheckCircle2, TrendingUp, Zap } from 'lucide-react';
import { useMocks } from '../../context/MockContext';
import { StatCard } from '../common/StatCard';

export const KPIOverview: React.FC = () => {
  const { kpis, setActiveView } = useMocks();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {/* 1. Total Mocks */}
      <StatCard
        title="Total Mocks"
        value={kpis.totalMocks}
        subtitle={`${kpis.totalFullLengthMocks} Full Length`}
        icon={<Layers className="w-4 h-4" />}
        accentColor="#6EC2FD"
        onClick={() => setActiveView('mocks')}
      />

      {/* 2. Average Score */}
      <StatCard
        title="Average Score"
        value={kpis.averageScore > 0 ? `${kpis.averageScore}` : '0'}
        subtitle="Across all attempts"
        icon={<Target className="w-4 h-4" />}
        accentColor="#38BDF8"
        onClick={() => setActiveView('analytics')}
      />

      {/* 3. Best Score */}
      <StatCard
        title="Best Score"
        value={kpis.bestScore > 0 ? `${kpis.bestScore}` : '0'}
        subtitle="All-time high score"
        icon={<Award className="w-4 h-4" />}
        accentColor="#BEFFCC"
        trend={kpis.bestScore >= 150 ? { value: 'Peak', isPositive: true } : undefined}
        onClick={() => setActiveView('analytics')}
      />

      {/* 4. Average Accuracy */}
      <StatCard
        title="Avg Accuracy"
        value={kpis.averageAccuracy > 0 ? `${kpis.averageAccuracy}%` : '0%'}
        subtitle="Attempt quality ratio"
        icon={<CheckCircle2 className="w-4 h-4" />}
        accentColor="#5EE88A"
        trend={kpis.averageAccuracy >= 85 ? { value: 'High', isPositive: true } : undefined}
        onClick={() => setActiveView('analytics')}
      />

      {/* 5. Average Percentile */}
      <StatCard
        title="Avg Percentile"
        value={kpis.averagePercentile > 0 ? `${kpis.averagePercentile}%` : '0%'}
        subtitle="Overall competitive tier"
        icon={<TrendingUp className="w-4 h-4" />}
        accentColor="#A78BFA"
        onClick={() => setActiveView('percentile')}
      />

      {/* 6. Best Percentile */}
      <StatCard
        title="Best Percentile"
        value={kpis.bestPercentile > 0 ? `${kpis.bestPercentile}%` : '0%'}
        subtitle="Highest standing achieved"
        icon={<Zap className="w-4 h-4" />}
        accentColor="#F472B6"
        trend={kpis.bestPercentile >= 95 ? { value: 'Top 5%', isPositive: true } : undefined}
        onClick={() => setActiveView('percentile')}
      />
    </div>
  );
};
