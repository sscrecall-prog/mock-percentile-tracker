import React from 'react';
import { 
  Plus, 
  Search, 
  Sun, 
  Moon, 
  BarChart2, 
  TrendingUp, 
  Layers, 
  Target, 
  Zap, 
  Settings as SettingsIcon,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { useMocks, NavView } from '../../context/MockContext';
import { useTheme } from '../../theme/ThemeContext';

export const Navbar: React.FC = () => {
  const { activeView, setActiveView, setIsAddModalOpen, setIsSearchModalOpen, setEditingMock } = useMocks();
  const { theme, setTheme, activeTheme } = useTheme();

  const navItems: { id: NavView; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'home', label: 'Home', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'full-length', label: 'Full Mocks', icon: <Target className="w-3.5 h-3.5" /> },
    { id: 'sectional', label: 'Sectionals', icon: <Zap className="w-3.5 h-3.5" /> },
    { id: 'chapter-wise', label: 'Chapters', icon: <BookOpen className="w-3.5 h-3.5" />, badge: 'New' },
    { id: 'mocks', label: 'All Mocks', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'percentile', label: 'Percentile', icon: <TrendingUp className="w-3.5 h-3.5" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart2 className="w-3.5 h-3.5" /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl border-b transition-colors duration-300 bg-white/95 dark:bg-darkBg/95 warm-cream:bg-warmBg/95 border-slate-200 dark:border-white/10">
      <div className="w-full max-w-[1440px] mx-auto px-3 sm:px-4 lg:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* 1. Brand Logo */}
        <div 
          onClick={() => setActiveView('home')}
          className="flex items-center gap-2 cursor-pointer group shrink-0"
        >
          <img 
            src="/logo.png" 
            alt="MockTracker Logo" 
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl object-contain shadow-glow-blue group-hover:scale-105 transition-transform duration-300 shrink-0" 
          />
          <div>
            <div className="font-black text-xs sm:text-sm tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
              <span>MockTracker</span>
              <span className="text-[9px] font-black px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-800 dark:text-mint border border-emerald-500/30 uppercase">
                3D Pro
              </span>
            </div>
            <p className="text-[9px] text-slate-500 dark:text-slate-400 font-medium hidden 2xl:block">
              Percentile & Score Intelligence
            </p>
          </div>
        </div>

        {/* 2. Desktop Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 bg-slate-100 dark:bg-darkSurface/90 p-1 rounded-xl border border-slate-200 dark:border-white/10">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`relative flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-lg text-xs font-black transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-500 text-darkBg shadow-glow-blue'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-white/5'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && !isActive && (
                  <span className="px-1.5 py-0.2 rounded-full text-[8px] font-black bg-emerald-500/20 text-emerald-800 dark:text-mint">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* 3. Right Controls: Search, Theme Toggle & Add Mock CTA */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Quick Search Shortcut */}
          <button
            onClick={() => setIsSearchModalOpen(true)}
            title="Search Mocks (Ctrl+K)"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors text-xs font-bold"
          >
            <Search className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
            <span className="hidden xl:inline">Search</span>
            <kbd className="hidden xl:inline-block px-1 py-0.2 rounded text-[9px] font-mono bg-slate-200 dark:bg-white/10 border border-slate-300 dark:border-white/10 text-slate-600 dark:text-slate-400">
              ⌘K
            </kbd>
          </button>

          {/* Theme Mode Toggle */}
          <button
            onClick={() => {
              if (theme === 'dark') setTheme('light');
              else if (theme === 'light') setTheme('warm-cream');
              else setTheme('dark');
            }}
            title={`Theme: ${theme}`}
            className="w-8 h-8 flex items-center justify-center rounded-xl border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors shrink-0"
          >
            {activeTheme === 'dark' ? (
              <Moon className="w-4 h-4 text-emerald-400" />
            ) : activeTheme === 'warm-cream' ? (
              <span className="text-xs">☕</span>
            ) : (
              <Sun className="w-4 h-4 text-amber-500" />
            )}
          </button>

          {/* ALWAYS VISIBLE Quick Add Mock CTA */}
          <button
            onClick={() => {
              setEditingMock(null);
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-amber-400 text-darkBg font-black text-xs shadow-glow-blue hover:opacity-95 transition-all transform active:scale-95 shrink-0 whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3] shrink-0" />
            <span>Add Mock</span>
          </button>
        </div>

      </div>
    </header>
  );
};
