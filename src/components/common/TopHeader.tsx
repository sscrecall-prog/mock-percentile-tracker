import React from 'react';
import { 
  Search, 
  Sun, 
  Moon, 
  Flame, 
  Zap, 
  Volume2, 
  VolumeX, 
  ExternalLink,
  Plus,
  Target
} from 'lucide-react';
import { useMocks } from '../../context/MockContext';
import { useTheme } from '../../theme/ThemeContext';
import { audioFX } from '../../utils/audioFX';

export const TopHeader: React.FC = () => {
  const { 
    setIsSearchModalOpen, 
    setIsAddModalOpen, 
    setEditingMock, 
    gamification, 
    isSoundEnabled, 
    toggleSound,
    settings,
    setActiveView
  } = useMocks();
  const { theme, setTheme, activeTheme } = useTheme();

  const handleOpenSearch = () => {
    audioFX.playClickSound();
    setIsSearchModalOpen(true);
  };

  const handleOpenAddMock = () => {
    audioFX.playClickSound();
    setEditingMock(null);
    setIsAddModalOpen(true);
  };

  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-xl border-b transition-colors duration-300 bg-white/90 dark:bg-[#0c1228]/85 warm-cream:bg-warmBg/90 border-slate-200/80 dark:border-slate-800/80 shadow-sm">
      <div className="w-full max-w-[1440px] mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Mobile Header Brand Logo (Visible on mobile screens < md) */}
        <div 
          onClick={() => {
            audioFX.playClickSound();
            setActiveView('home');
          }}
          className="flex md:hidden items-center gap-2 cursor-pointer group shrink-0"
        >
          <img 
            src="/logo.png" 
            alt="MockTracker Logo" 
            className="w-8 h-8 rounded-xl object-contain shadow-glow-cyan shrink-0" 
          />
          <div>
            <div className="font-black text-xs tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
              <span className="bg-gradient-to-r from-[#00d2ff] via-[#a855f7] to-[#ec4899] bg-clip-text text-transparent">MockTracker</span>
              <span className="text-[8px] font-black px-1 py-0.2 rounded bg-cyan-500/15 text-cyan-500 dark:text-[#00d2ff] border border-cyan-500/30 uppercase">
                3D
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Left: Target Exam & Benchmark Badges (Visible md and above) */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-slate-200">
            <Target className="w-3.5 h-3.5 text-[#00d2ff]" />
            <span>Target Exam: {settings.selectedExam || 'SSC CGL'}</span>
          </div>

          <div className="flex items-center gap-1 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-[#8b5cf6]/10 to-[#ec4899]/10 border border-[#8b5cf6]/20 text-[11px] font-extrabold text-[#8b5cf6] dark:text-[#a855f7]">
            <span>Target: {settings.targetPercentile || 90}%ile</span>
          </div>
        </div>

        {/* Center / Right: Search, Partner App, Streak, XP, Audio, Theme, Avatar & Add Mock */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 ml-auto">
          
          {/* Quick Search Bar */}
          <button
            onClick={handleOpenSearch}
            title="Search Mocks (Ctrl+K)"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-all text-xs font-semibold"
          >
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="hidden sm:inline text-slate-400">Quick search mocks...</span>
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 rounded text-[9px] font-mono bg-slate-200 dark:bg-white/10 border border-slate-300 dark:border-white/10 text-slate-600 dark:text-slate-400">
              Ctrl+K
            </kbd>
          </button>

          {/* Syllabus 3D Partner App Shortcut */}
          <a
            href="https://syllabus-3d.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            title="Launch Syllabus 3D"
            onClick={() => audioFX.playClickSound()}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:text-[#00d2ff] hover:border-[#00d2ff]/30 transition-colors text-xs font-bold shrink-0"
          >
            <span className="w-4 h-4 rounded-md bg-gradient-to-tr from-[#00d2ff] to-[#8b5cf6] flex items-center justify-center text-white text-[9px] font-black">
              S
            </span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>

          {/* Streak Badge */}
          <div 
            title={`${gamification.streakDays} Day Active Mock Streak!`}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-black shrink-0"
          >
            <Flame className="w-3.5 h-3.5 fill-amber-500" />
            <span>{gamification.streakDays}d</span>
          </div>

          {/* XP Level Badge */}
          <div 
            title={`Level ${gamification.level} (${gamification.levelTitle})`}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-[#00d2ff] text-xs font-extrabold shrink-0"
          >
            <Zap className="w-3.5 h-3.5 fill-[#00d2ff]" />
            <span>{gamification.totalXp} XP</span>
          </div>

          {/* Audio Synthesizer Toggle */}
          <button
            onClick={toggleSound}
            title={isSoundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
            className="w-8 h-8 flex items-center justify-center rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors shrink-0"
          >
            {isSoundEnabled ? (
              <Volume2 className="w-4 h-4 text-[#00d2ff]" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
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
            className="w-8 h-8 flex items-center justify-center rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors shrink-0"
          >
            {activeTheme === 'dark' ? (
              <Moon className="w-4 h-4 text-[#00d2ff]" />
            ) : activeTheme === 'warm-cream' ? (
              <span className="text-xs">☕</span>
            ) : (
              <Sun className="w-4 h-4 text-amber-500" />
            )}
          </button>

          {/* User Avatar Circle */}
          <div 
            title="Aspirant Profile (Sunny Rise)"
            className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#8b5cf6] via-[#ec4899] to-[#00d2ff] flex items-center justify-center text-white font-black text-xs shadow-glow-purple shrink-0 cursor-pointer"
          >
            S
          </div>

          {/* Mobile + Add Mock Button (Visible on mobile header) */}
          <button
            onClick={handleOpenAddMock}
            className="flex md:hidden items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-[#0066ff] via-[#8b5cf6] to-[#d946ef] text-white font-black text-xs shadow-cyber-cta shrink-0"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Add</span>
          </button>

        </div>

      </div>
    </header>
  );
};
