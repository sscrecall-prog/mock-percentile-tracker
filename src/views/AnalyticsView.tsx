import React from 'react';
import { WeakSectionDiagnostic } from '../components/analytics/WeakSectionDiagnostic';
import { TimeManagementAnalytics } from '../components/analytics/TimeManagementAnalytics';
import { ConsistencyMatrix } from '../components/analytics/ConsistencyMatrix';
import { PerformanceInsightsList } from '../components/analytics/PerformanceInsightsList';

export const AnalyticsView: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Algorithmic Weak Area & Negative Drain Diagnosis */}
      <WeakSectionDiagnostic />

      {/* 2. Section-Wise Time Allocation & Pace */}
      <TimeManagementAnalytics />

      {/* 3. Consistency, Variance & Standard Deviation */}
      <ConsistencyMatrix />

      {/* 4. Performance Insights & Discovery Feed */}
      <PerformanceInsightsList />
    </div>
  );
};
