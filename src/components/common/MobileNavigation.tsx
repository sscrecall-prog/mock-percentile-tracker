import React, { useState } from 'react';
import { 
  Layers, 
  BookOpen, 
  Target, 
  BarChart2, 
  TrendingUp, 
  Plus, 
  Zap, 
  MoreHorizontal,
  Settings as SettingsIcon,
  Moon,
  Sun,
  X,
  Search,
  Sparkles
} from 'lucide-react';
import { useMocks, NavView } from '../../context/MockContext';
import { useTheme } from '../../theme/ThemeContext';

export const MobileNavigation: React.FC = () => {
  const { activeView, setActiveView, setIsAddModalOpen, setIsSearchModalOpen, setEditingMock } = useMocks();
  const { theme, setTheme, activeTheme } = useTheme();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  // Left 2 items
  const leftTabs: { id: NavView; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Layers className="w-5 h-5" /> },
    { id: 'full-length', label: 'Full Mock', icon: <Target className="w-5 h-5" /> },
  ];

  // Right 2 items
  const rightTabs: { id: NavView; label: string; icon: React.ReactNode }[] = [
    { id: 'chapter-wise', label: 'Chapters', icon: <BookOpen className="w-5 h-5" /> },
  ];

  const secondaryTabs: { id: NavView; label: string; desc: string; icon: React.ReactNode }[] = [
    { id: 'sectional', label: 'Sectional Drills', desc: 'Single-subject speed center', icon: <Zap className="w-5 h-5 text-emerald-600 dark:text-mint" /> },
    { id: 'mocks', label: 'All Mock Tests', desc: 'Complete history & filters', icon: <Layers className="w-5 h-5 text-emerald-600 dark:text-mint" /> },
    { id: 'percentile', label: 'Percentile Tracker', desc: 'Target gap & 3D orbital ring', icon: <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400" /> },
    { id: 'analytics', label: 'Deep Analytics', desc: 'Weak areas & consistency index', icon: <BarChart2 className="w-5 h-5 text-purple-600 dark:text-lavender" /> },
    { id: 'settings', label: 'Settings & Data', desc: 'Export, backup & cutoffs', icon: <SettingsIcon className="w-5 h-5 text-slate-600 dark:text-slate-400" /> },
  ];

  const isSecondaryActive = ['sectional', 'mocks', 'percentile', 'analytics', 'settings'].includes(activeView);

  return (
    <>
      {/* 1. Native Mobile Bottom Tab Bar (100% Symmetrical 5-Column Grid) */}
      <nav 
        aria-label="Mobile Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-darkBg/95 backdrop-blur-2xl border-t border-slate-200/80 dark:border-white/10 px-2 pt-1.5 pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.15)] dark:shadow-[0_-10px_30px_rgba(0,0,0,0.5)] transition-colors duration-300"
      >
        <div className="grid grid-cols-5 items-center justify-items-center relative max-w-lg mx-auto w-full">
          
          {/* Column 1: Home */}
          <button
            onClick={() => {
              setActiveView('home');
              setIsMoreMenuOpen(false);
            }}
            className="group w-full flex flex-col items-center justify-center py-1 transition-all duration-200 active:scale-75"
          >
            <div className={`p-1.5 rounded-2xl transition-all duration-300 transform group-active:scale-90 ${
              activeView === 'home'
                ? 'bg-emerald-500/15 text-emerald-700 dark:text-mint scale-110 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}>
              <Layers className="w-5 h-5" />
            </div>
            <span className={`text-[10px] mt-0.5 tracking-tight transition-all ${
              activeView === 'home'
                ? 'font-black text-emerald-700 dark:text-mint'
                : 'font-semibold text-slate-500 dark:text-slate-400'
            }`}>
              Home
            </span>
            {activeView === 'home' && (
              <span className="w-1 h-1 rounded-full bg-emerald-500 mt-0.5 animate-pulse" />
            )}
          </button>

          {/* Column 2: Full Mock */}
          <button
            onClick={() => {
              setActiveView('full-length');
              setIsMoreMenuOpen(false);
            }}
            className="group w-full flex flex-col items-center justify-center py-1 transition-all duration-200 active:scale-75"
          >
            <div className={`p-1.5 rounded-2xl transition-all duration-300 transform group-active:scale-90 ${
              activeView === 'full-length'
                ? 'bg-emerald-500/15 text-emerald-700 dark:text-mint scale-110 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}>
              <Target className="w-5 h-5" />
            </div>
            <span className={`text-[10px] mt-0.5 tracking-tight transition-all ${
              activeView === 'full-length'
                ? 'font-black text-emerald-700 dark:text-mint'
                : 'font-semibold text-slate-500 dark:text-slate-400'
            }`}>
              Full Mock
            </span>
            {activeView === 'full-length' && (
              <span className="w-1 h-1 rounded-full bg-emerald-500 mt-0.5 animate-pulse" />
            )}
          </button>

          {/* Column 3: EXACT MATHEMATICAL CENTER + BUTTON WITH PULSE ANIMATION */}
          <div className="relative flex items-center justify-center -mt-6">
            {/* Ambient Breathing Aura Glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-500 to-amber-400 blur-md opacity-70 animate-pulse pointer-events-none" />

            <button
              onClick={() => {
                setEditingMock(null);
                setIsAddModalOpen(true);
                setIsMoreMenuOpen(false);
              }}
              title="Log Mock Test"
              className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-500 via-emerald-400 to-amber-400 p-0.5 shadow-[0_8px_25px_rgba(16,185,129,0.4)] active:scale-85 active:rotate-90 transition-all duration-200 ease-out flex items-center justify-center border-4 border-white dark:border-darkBg group hover:shadow-[0_8px_30px_rgba(245,158,11,0.5)]"
            >
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-emerald-500 via-emerald-400 to-amber-400 flex items-center justify-center text-darkBg transform group-hover:scale-105 transition-transform">
                <Plus className="w-7 h-7 stroke-[3] text-darkBg" />
              </div>
            </button>
          </div>

          {/* Column 4: Chapters */}
          <button
            onClick={() => {
              setActiveView('chapter-wise');
              setIsMoreMenuOpen(false);
            }}
            className="group w-full flex flex-col items-center justify-center py-1 transition-all duration-200 active:scale-75"
          >
            <div className={`p-1.5 rounded-2xl transition-all duration-300 transform group-active:scale-90 ${
              activeView === 'chapter-wise'
                ? 'bg-emerald-500/15 text-emerald-700 dark:text-mint scale-110 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}>
              <BookOpen className="w-5 h-5" />
            </div>
            <span className={`text-[10px] mt-0.5 tracking-tight transition-all ${
              activeView === 'chapter-wise'
                ? 'font-black text-emerald-700 dark:text-mint'
                : 'font-semibold text-slate-500 dark:text-slate-400'
            }`}>
              Chapters
            </span>
            {activeView === 'chapter-wise' && (
              <span className="w-1 h-1 rounded-full bg-emerald-500 mt-0.5 animate-pulse" />
            )}
          </button>

          {/* Column 5: More Menu */}
          <button
            onClick={() => setIsMoreMenuOpen(prev => !prev)}
            className="group w-full flex flex-col items-center justify-center py-1 transition-all duration-200 active:scale-75"
          >
            <div className={`p-1.5 rounded-2xl transition-all duration-300 transform group-active:scale-90 ${
              isSecondaryActive || isMoreMenuOpen
                ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 scale-110 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}>
              <MoreHorizontal className="w-5 h-5" />
            </div>
            <span className={`text-[10px] mt-0.5 tracking-tight transition-all ${
              isSecondaryActive || isMoreMenuOpen
                ? 'font-black text-amber-700 dark:text-amber-400'
                : 'font-semibold text-slate-500 dark:text-slate-400'
            }`}>
              More
            </span>
            {(isSecondaryActive || isMoreMenuOpen) && (
              <span className="w-1 h-1 rounded-full bg-amber-500 mt-0.5 animate-pulse" />
            )}
          </button>

        </div>
      </nav>

      {/* 2. Native Mobile Bottom Sheet Drawer for "More" Menu */}
      {isMoreMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 animate-fadeIn">
          {/* Backdrop */}
          <div 
            onClick={() => setIsMoreMenuOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Bottom Sheet Modal */}
          <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-darkSurface rounded-t-3xl border-t border-slate-200 dark:border-white/10 p-5 pb-safe shadow-2xl animate-slideUp space-y-4 max-h-[85vh] overflow-y-auto">
            
            {/* Sheet Handle */}
            <div className="sheet-handle" />

            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  More Features & Tools
                </h3>
              </div>
              <button
                onClick={() => setIsMoreMenuOpen(false)}
                className="p-1.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Actions Row */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => {
                  setIsMoreMenuOpen(false);
                  setIsSearchModalOpen(true);
                }}
                className="flex items-center gap-2 p-3 rounded-2xl bg-slate-100 dark:bg-darkContainer border border-slate-200 dark:border-white/5 text-xs font-bold text-slate-800 dark:text-white active:scale-95 transition-all text-left"
              >
                <Search className="w-4 h-4 text-emerald-600 dark:text-mint" />
                <div>
                  <div>Search Mocks</div>
                  <div className="text-[10px] text-slate-400 font-normal">Quick filter</div>
                </div>
              </button>

              <button
                onClick={() => {
                  if (theme === 'dark') setTheme('light');
                  else if (theme === 'light') setTheme('warm-cream');
                  else setTheme('dark');
                }}
                className="flex items-center gap-2 p-3 rounded-2xl bg-slate-100 dark:bg-darkContainer border border-slate-200 dark:border-white/5 text-xs font-bold text-slate-800 dark:text-white active:scale-95 transition-all text-left"
              >
                {activeTheme === 'dark' ? (
                  <Moon className="w-4 h-4 text-emerald-400" />
                ) : activeTheme === 'warm-cream' ? (
                  <span className="text-sm">☕</span>
                ) : (
                  <Sun className="w-4 h-4 text-amber-500" />
                )}
                <div>
                  <div className="capitalize">{theme} Theme</div>
                  <div className="text-[10px] text-slate-400 font-normal">Tap to switch</div>
                </div>
              </button>
            </div>

            {/* Secondary Navigation List */}
            <div className="space-y-1.5 pt-1">
              {secondaryTabs.map((tab) => {
                const isActive = activeView === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveView(tab.id);
                      setIsMoreMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all text-left active:scale-98 ${
                      isActive
                        ? 'bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-300 dark:border-emerald-500/30'
                        : 'bg-slate-50 dark:bg-darkContainer/60 border border-slate-200 dark:border-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-white dark:bg-darkBg shadow-sm">
                        {tab.icon}
                      </div>
                      <div>
                        <div className="text-xs font-black text-slate-900 dark:text-white">
                          {tab.label}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                          {tab.desc}
                        </div>
                      </div>
                    </div>

                    {isActive && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-600 text-white">
                        Active
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

          </div>
        </div>
      )}
    </>
  );
};
