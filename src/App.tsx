import React from 'react';
import { ThemeProvider } from './theme/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MockProvider, useMocks } from './context/MockContext';
import { Sidebar } from './components/common/Sidebar';
import { TopHeader } from './components/common/TopHeader';
import { MobileNavigation } from './components/common/MobileNavigation';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { ToastContainer } from './components/common/ToastContainer';
import { AddEditMockModal } from './components/forms/AddEditMockModal';
import { AuthModal } from './components/auth/AuthModal';

// Views
import { LoginView } from './views/LoginView';
import { HomeView } from './views/HomeView';
import { MocksView } from './views/MocksView';
import { FullLengthView } from './views/FullLengthView';
import { SectionalView } from './views/SectionalView';
import { ChapterWiseView } from './views/ChapterWiseView';
import { AnalyticsView } from './views/AnalyticsView';
import { PercentileView } from './views/PercentileView';
import { SettingsView } from './views/SettingsView';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const { activeView } = useMocks();

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#050814] text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-[#00d2ff] border-t-transparent animate-spin" />
          <span className="text-xs font-bold text-slate-400">Loading MockTracker 3D...</span>
        </div>
      </div>
    );
  }

  // 1. Dedicated Fullscreen Login Page (Shown First on App / Web Launch!)
  if (!user) {
    return (
      <>
        <LoginView />
        <ToastContainer />
      </>
    );
  }

  // 2. Authenticated Dashboard Experience
  return (
    <div className="min-h-screen flex transition-colors duration-300 bg-slate-50 dark:bg-darkBg text-slate-900 dark:text-white">
      {/* Left Fixed Sidebar (Desktop >= md) */}
      <Sidebar />

      {/* Main Viewport & Scrollable Content Column (Offset with md:ml-64 for fixed sidebar) */}
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

      {/* Global Modals & Notifications */}
      <AuthModal />
      <AddEditMockModal />
      <GlobalSearchModal />
      <ToastContainer />

      {/* Native Mobile Bottom Navigation Bar (< md) */}
      <MobileNavigation />
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MockProvider>
          <AppContent />
        </MockProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
