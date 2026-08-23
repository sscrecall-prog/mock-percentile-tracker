import React from 'react';
import { 
  BarChart2, 
  Layers, 
  Target, 
  TrendingUp, 
  Search, 
  Plus, 
  Moon, 
  Sun, 
  Settings as SettingsIcon,
  Sparkles,
  BookOpen,
  Zap
} from 'lucide-react';
import { useMocks, NavView } from '../../context/MockContext';
import { useTheme } from '../../theme/ThemeContext';

export const Navbar: React.FC = () => {
  const { activeView, setActiveView, setIsAddModalOpen, setIsSearchModalOpen, setEditingMock } = useMocks();
  const { theme, setTheme, activeTheme } = useTheme();

  const navItems: { id: NavView; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'home', label: 'Home', icon: <Layers className="w-4 h-4" /> },
    { id: 'full-length', label: 'Full Length', icon: <Target className="w-4 h-4" /> },
    { id: 'sectional', label: 'Sectionals', icon: <Zap className="w-4 h-4" /> },
    { id: 'chapter-wise', label: 'Chapter Wise', icon: <BookOpen className="w-4 h-4" />, badge: 'New' },
    { id: 'mocks', label: 'All Mocks', icon: <Layers className="w-4 h-4" /> },
    { id: 'percentile', label: 'Percentile', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart2 className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl border-b transition-colors duration-300 bg-white/90 dark:bg-darkBg/90 warm-cream:bg-warmBg/90 border-slate-200 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveView('home')}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-electric-blue to-mint flex items-center justify-center shadow-glow-blue group-hover:scale-105 transition-transform duration-300">
            <Sparkles className="w-5 h-5 text-darkBg fill-darkBg" />
          </div>
          <div>
            <div className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>MockTracker</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-electric-blue/20 text-electric-dark dark:text-electric-blue border border-electric-blue/30 uppercase">
                3D Pro
              </span>
            </div>
            <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium hidden sm:block">
              Percentile & Score Intelligence
            </p>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-darkSurface/80 p-1 rounded-xl border border-slate-200 dark:border-white/10">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-electric-blue text-darkBg shadow-glow-blue'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-white/5'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && !isActive && (
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-mint/20 text-mint-dark dark:text-mint">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quick Search Shortcut */}
          <button
            onClick={() => setIsSearchModalOpen(true)}
            className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors text-xs font-semibold"
          >
            <Search className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span className="hidden lg:inline">Search...</span>
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-200 dark:bg-white/10 border border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-300">
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
            className="p-2 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
          >
            {activeTheme === 'dark' ? (
              <Moon className="w-4 h-4 text-electric-blue" />
            ) : activeTheme === 'warm-cream' ? (
              <span className="text-xs">☕</span>
            ) : (
              <Sun className="w-4 h-4 text-amber-500" />
            )}
          </button>

          {/* Quick Add Mock CTA */}
          <button
            onClick={() => {
              setEditingMock(null);
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-electric-blue to-electric-dark text-darkBg font-extrabold text-xs shadow-glow-blue hover:opacity-95 transition-all transform active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span className="hidden sm:inline">Add Mock</span>
          </button>
        </div>

      </div>
    </header>
  );
};
