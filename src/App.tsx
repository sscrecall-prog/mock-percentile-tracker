import React from 'react';
import { ThemeProvider } from './theme/ThemeContext';
import { MockProvider, useMocks } from './context/MockContext';
import { Sidebar } from './components/common/Sidebar';
import { TopHeader } from './components/common/TopHeader';
import { MobileNavigation } from './components/common/MobileNavigation';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { ToastContainer } from './components/common/ToastContainer';
import { AddEditMockModal } from './components/forms/AddEditMockModal';

// Views
import { HomeView } from './views/HomeView';
import { MocksView } from './views/MocksView';
import { FullLengthView } from './views/FullLengthView';
import { SectionalView } from './views/SectionalView';
import { ChapterWiseView } from './views/ChapterWiseView';
import { AnalyticsView } from './views/AnalyticsView';
import { PercentileView } from './views/PercentileView';
import { SettingsView } from './views/SettingsView';

const AppContent: React.FC = () => {
  const { activeView } = useMocks();

  return (
    <div className="min-h-screen flex transition-colors duration-300 bg-slate-50 dark:bg-darkBg text-slate-900 dark:text-white">
      {/* 1. Left Fixed Sidebar (Desktop >= md) */}
      <Sidebar />

      {/* 2. Main Viewport & Scrollable Content Column (Offset with md:ml-64 for fixed sidebar) */}
      <div className="md:ml-64 flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Sticky Top Header */}
        <TopHeader />

        {/* Dynamic View Container */}
        <main className="flex-1 max-w-[1440px] w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8">
          {activeView === 'home' && <HomeView />}
          {activeView === 'mocks' && <MocksView />}
          {activeView === 'full-length' && <FullLengthView />}
          {activeView === 'sectional' && <SectionalView />}
          {activeView === 'chapter-wise' && <ChapterWiseView />}
          {activeView === 'analytics' && <AnalyticsView />}
          {activeView === 'percentile' && <PercentileView />}
          {activeView === 'settings' && <SettingsView />}
        </main>

        {/* Minimalist Footer */}
        <footer className="mt-auto border-t border-slate-200 dark:border-white/5 py-6 text-center text-xs text-slate-600 dark:text-slate-400">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">MockTracker 3D • Exam Percentile Intelligence</span>
            <span>Designed for SSC CGL, CHSL, MTS, Railway & Banking Aspirants</span>
          </div>
        </footer>
      </div>

      {/* 3. Global Modals & Notifications */}
      <AddEditMockModal />
      <GlobalSearchModal />
      <ToastContainer />

      {/* 4. Native Mobile Bottom Navigation Bar (< md) */}
      <MobileNavigation />
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <MockProvider>
        <AppContent />
      </MockProvider>
    </ThemeProvider>
  );
}

export default App;
