import React from 'react';
import { ThemeProvider } from './theme/ThemeContext';
import { MockProvider, useMocks } from './context/MockContext';
import { Navbar } from './components/common/Navbar';
import { MobileNavigation } from './components/common/MobileNavigation';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { ToastContainer } from './components/common/ToastContainer';
import { AddEditMockModal } from './components/forms/AddEditMockModal';

// Views
import { HomeView } from './views/HomeView';
import { MocksView } from './views/MocksView';
import { FullLengthView } from './views/FullLengthView';
import { SectionalView } from './views/SectionalView';
import { AnalyticsView } from './views/AnalyticsView';
import { PercentileView } from './views/PercentileView';
import { SettingsView } from './views/SettingsView';

const AppContent: React.FC = () => {
  const { activeView } = useMocks();

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300 pb-20 md:pb-8 bg-slate-50 dark:bg-darkBg text-slate-900 dark:text-white">
      {/* 1. Sticky Navigation Bar */}
      <Navbar />

      {/* 2. Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeView === 'home' && <HomeView />}
        {activeView === 'mocks' && <MocksView />}
        {activeView === 'full-length' && <FullLengthView />}
        {activeView === 'sectional' && <SectionalView />}
        {activeView === 'analytics' && <AnalyticsView />}
        {activeView === 'percentile' && <PercentileView />}
        {activeView === 'settings' && <SettingsView />}
      </main>

      {/* 3. Global Modals & Notifications */}
      <AddEditMockModal />
      <GlobalSearchModal />
      <ToastContainer />

      {/* 4. Compact Mobile Navigation */}
      <MobileNavigation />

      {/* 5. Minimalist Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-white/5 py-6 text-center text-xs text-slate-600 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Mock Test & Percentile Tracker • 3D Exam Intelligence</span>
          <span>Designed for SSC CGL, CHSL, MTS, Railway & Banking Aspirants</span>
        </div>
      </footer>
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
