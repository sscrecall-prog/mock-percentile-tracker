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
  BookOpen,
  Flame,
  Volume2,
  VolumeX,
  Award
} from 'lucide-react';
import { useMocks, NavView } from '../../context/MockContext';
import { useTheme } from '../../theme/ThemeContext';
import { audioFX } from '../../utils/audioFX';

export const Navbar: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    setIsAddModalOpen, 
    setIsSearchModalOpen, 
    setEditingMock,
    gamification,
    isSoundEnabled,
    toggleSound
  } = useMocks();
  const { theme, setTheme, activeTheme } = useTheme();

  const navItems: { id: NavView; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'home', label: 'Home', icon: <Layers className="w-3.5 h-3.5 shrink-0" /> },
    { id: 'full-length', label: 'Full Mocks', icon: <Target className="w-3.5 h-3.5 shrink-0" /> },
    { id: 'sectional', label: 'Sectionals', icon: <Zap className="w-3.5 h-3.5 shrink-0" /> },
    { id: 'chapter-wise', label: 'Chapters', icon: <BookOpen className="w-3.5 h-3.5 shrink-0" />, badge: 'New' },
    { id: 'mocks', label: 'All Mocks', icon: <Layers className="w-3.5 h-3.5 shrink-0" /> },
    { id: 'percentile', label: 'Percentile', icon: <TrendingUp className="w-3.5 h-3.5 shrink-0" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart2 className="w-3.5 h-3.5 shrink-0" /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon className="w-3.5 h-3.5 shrink-0" /> },
  ];

  const handleNavClick = (id: NavView) => {
    audioFX.playClickSound();
    setActiveView(id);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl border-b transition-colors duration-300 bg-white/90 dark:bg-[#0c1228]/85 warm-cream:bg-warmBg/90 border-slate-200/80 dark:border-slate-800/80 shadow-lg">
      <div className="w-full max-w-[1440px] mx-auto px-2 sm:px-4 h-16 flex items-center justify-between gap-1.5 sm:gap-3 overflow-hidden">
        
        {/* 1. Brand Logo & Gamification Badges */}
        <div className="flex items-center gap-2 shrink-0">
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-1.5 sm:gap-2 cursor-pointer group shrink-0"
          >
            <img 
              src="/logo.png" 
              alt="MockTracker Logo" 
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl object-contain shadow-glow-cyan group-hover:scale-105 transition-transform duration-300 shrink-0" 
            />
            <div className="shrink-0">
              <div className="font-black text-xs sm:text-sm tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                <span className="bg-gradient-to-r from-[#00d2ff] via-[#a855f7] to-[#ec4899] bg-clip-text text-transparent">MockTracker</span>
                <span className="text-[8px] sm:text-[9px] font-black px-1 py-0.2 rounded bg-cyan-500/15 text-cyan-500 dark:text-[#00d2ff] border border-cyan-500/30 uppercase">
                  3D Pro
                </span>
              </div>
            </div>
          </div>

          {/* Gamification Level Pill (Visible on very wide screens 2xl) */}
          <div className="hidden 2xl:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[10px] font-bold shrink-0">
            <Award className="w-3 h-3 text-[#8b5cf6]" />
            <span className="text-slate-700 dark:text-slate-200">Lv.{gamification.level}</span>
            <span className="text-[#00d2ff] font-extrabold">{gamification.totalXp} XP</span>
          </div>

          {/* Streak Flame Badge (Visible on very wide screens 2xl) */}
          <div 
            title={`${gamification.streakDays} Day Active Mock Streak!`}
            className="hidden 2xl:flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black shrink-0"
          >
            <Flame className="w-3 h-3 fill-amber-500" />
            <span>{gamification.streakDays}d Streak</span>
          </div>
        </div>

        {/* 2. Desktop Navigation Tabs (Compact & Responsive) */}
        <nav className="hidden lg:flex items-center gap-0.5 bg-slate-100/90 dark:bg-[#050814]/80 p-0.5 xl:p-1 rounded-xl border border-slate-200/80 dark:border-white/10 backdrop-blur-md shrink min-w-0 overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative flex items-center gap-1 px-2 xl:px-2.5 py-1.5 rounded-lg text-[11px] xl:text-xs font-bold transition-all duration-200 whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#00d2ff] to-[#3b82f6] text-white shadow-glow-cyan font-black'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-white/5'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && !isActive && (
                  <span className="px-1 py-0.1 rounded-full text-[8px] font-black bg-purple-500/20 text-purple-600 dark:text-purple-300">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* 3. Right Controls: Search, Sound, Theme Toggle & ALWAYS FULLY VISIBLE Add Mock CTA */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 ml-auto lg:ml-0">
          {/* Quick Search Shortcut */}
          <button
            onClick={() => {
              audioFX.playClickSound();
              setIsSearchModalOpen(true);
            }}
            title="Search Mocks (Ctrl+K)"
            className="flex items-center gap-1 px-2 py-1.5 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors text-xs font-bold shrink-0"
          >
            <Search className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
            <kbd className="hidden 2xl:inline-block px-1 py-0.2 rounded text-[8px] font-mono bg-slate-200 dark:bg-white/10 border border-slate-300 dark:border-white/10 text-slate-600 dark:text-slate-400">
              ⌘K
            </kbd>
          </button>

          {/* Sound Synthesizer Toggle */}
          <button
            onClick={toggleSound}
            title={isSoundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-xl border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors shrink-0"
          >
            {isSoundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00d2ff]" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
            )}
          </button>

          {/* Theme Mode Toggle */}
          <button
            onClick={() => {
              audioFX.playClickSound();
              if (theme === 'dark') setTheme('light');
              else if (theme === 'light') setTheme('warm-cream');
              else setTheme('dark');
            }}
            title={`Theme: ${theme}`}
            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-xl border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors shrink-0"
          >
            {activeTheme === 'dark' ? (
              <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00d2ff]" />
            ) : activeTheme === 'warm-cream' ? (
              <span className="text-xs">☕</span>
            ) : (
              <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />
            )}
          </button>

          {/* ALWAYS VISIBLE SIGNATURE NEON CYBER CTA */}
          <button
            onClick={() => {
              audioFX.playClickSound();
              setEditingMock(null);
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-1 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-[#0066ff] via-[#8b5cf6] to-[#d946ef] text-white font-extrabold text-xs shadow-[0_0_20px_rgba(139,92,246,0.45)] hover:shadow-[0_0_30px_rgba(217,70,239,0.65)] hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0 whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3] shrink-0" />
            <span>Add Mock</span>
          </button>
        </div>

      </div>
    </header>
  );
};
