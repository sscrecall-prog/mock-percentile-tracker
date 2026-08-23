import React from 'react';
import { HeroSection } from '../components/dashboard/HeroSection';
import { KPIOverview } from '../components/dashboard/KPIOverview';
import { PerformanceTrendChart } from '../components/dashboard/PerformanceTrendChart';
import { QuickActionFloatingBar } from '../components/dashboard/QuickActionFloatingBar';
import { RecentMocksList } from '../components/dashboard/RecentMocksList';

export const HomeView: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Hero 3D Dashboard Header */}
      <HeroSection />

      {/* 2. 6 Core Key Performance Indicators */}
      <KPIOverview />

      {/* 3. Dynamic Interactive Performance Trend */}
      <PerformanceTrendChart />

      {/* 4. Quick Actions Floating Strip */}
      <QuickActionFloatingBar />

      {/* 5. Recent Mocks Feed */}
      <RecentMocksList />
    </div>
  );
};
