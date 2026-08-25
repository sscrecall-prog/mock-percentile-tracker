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
  Target,
  ArrowLeft
} from 'lucide-react';
import { useMocks } from '../../context/MockContext';
import { useTheme } from '../../theme/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { audioFX } from '../../utils/audioFX';

export const TopHeader: React.FC = () => {
  const { user, isSyncing, setIsAuthModalOpen } = useAuth();
  const { 
    setIsSearchModalOpen, 
    gamification, 
    isSoundEnabled, 
    toggleSound,
    settings,
    setActiveView,
    activeView,
    navigateBack,
    canNavigateBack
  } = useMocks();
  const { theme, setTheme, activeTheme } = useTheme();

  const handleOpenSearch = () => {
    audioFX.playClickSound();
    setIsSearchModalOpen(true);
  };

  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-xl border-b transition-colors duration-300 bg-[#FFFDF9]/90 dark:bg-[#0c1228]/85 warm-cream:bg-[#FFFDF9]/90 border-[#6B7280]/20 dark:border-slate-800/80 shadow-sm">
      <div className="w-full max-w-[1440px] mx-auto px-2 sm:px-4 lg:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
        
        {/* Left Section: Back Button OR Brand Logo on Mobile */}
        <div className="flex items-center gap-2 shrink-0">
          {canNavigateBack && (
            <button
              type="button"
              onClick={navigateBack}
              title="Go Back"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#EADCBF]/40 dark:bg-white/10 hover:bg-[#EADCBF]/70 dark:hover:bg-white/15 border border-[#6B7280]/20 dark:border-white/10 text-xs font-bold text-[#171717] dark:text-white transition-all cursor-pointer select-none active:scale-95 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4 text-[#D4AF37] dark:text-[#00d2ff]" />
              <span className="hidden sm:inline">Back</span>
            </button>
          )}

          {/* Mobile Header Brand Logo (Visible on mobile screens < md) */}
          <div 
            onClick={() => {
              audioFX.playClickSound();
              setActiveView('home');
            }}
            className="flex md:hidden items-center gap-1.5 cursor-pointer group shrink-0"
          >
            <img 
              src="/logo.png" 
              alt="MockTracker Logo" 
              className="w-7 h-7 rounded-xl object-contain shadow-glow-cyan shrink-0" 
            />
            <div className="shrink-0">
              <div className="font-black text-xs tracking-tight text-[#171717] dark:text-white flex items-center gap-1">
                <span className="bg-gradient-to-r from-[#D4AF37] to-[#171717] dark:from-[#00d2ff] dark:via-[#a855f7] dark:to-[#ec4899] bg-clip-text text-transparent">MockTracker</span>
                <span className="text-[8px] font-black px-1 py-0.2 rounded bg-[#D4AF37]/15 text-[#B8860B] dark:text-[#00d2ff] border border-[#D4AF37]/30 uppercase">
                  3D
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Left: Target Exam & Benchmark Badges (Visible md and above) */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#EADCBF]/30 dark:bg-white/5 border border-[#6B7280]/20 dark:border-white/10 text-xs font-bold text-[#171717] dark:text-slate-200">
              <Target className="w-3.5 h-3.5 text-[#D4AF37] dark:text-[#00d2ff]" />
              <span>Target Exam: {settings.selectedExam || 'SSC CGL'}</span>
            </div>

            <div className="flex items-center gap-1 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-[#D4AF37]/15 to-[#F5E6C8]/40 dark:from-[#8b5cf6]/10 dark:to-[#ec4899]/10 border border-[#D4AF37]/30 dark:border-[#8b5cf6]/20 text-[11px] font-extrabold text-[#171717] dark:text-[#a855f7]">
              <span>Target: {settings.targetPercentile || 90}%ile</span>
            </div>
          </div>
        </div>

        {/* Right Controls Container (Fully optimized for Mobile & Desktop) */}
        <div className="flex items-center gap-1 sm:gap-2 ml-auto shrink-0">
          
          {/* Quick Search Button */}
          <button
            onClick={handleOpenSearch}
            title="Search Mocks (Ctrl+K)"
            className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl border border-[#6B7280]/20 dark:border-white/10 bg-[#EADCBF]/30 dark:bg-white/5 text-[#6B7280] dark:text-slate-300 hover:text-[#171717] dark:hover:text-white hover:bg-[#EADCBF]/60 dark:hover:bg-white/10 transition-all text-xs font-semibold shrink-0"
          >
            <Search className="w-3.5 h-3.5 text-[#6B7280] dark:text-slate-400 shrink-0" />
            <span className="hidden xl:inline text-[#6B7280] dark:text-slate-400">Quick search mocks...</span>
            <kbd className="hidden 2xl:inline-block px-1.5 py-0.5 rounded text-[9px] font-mono bg-[#EADCBF]/50 dark:bg-white/10 border border-[#6B7280]/20 dark:border-white/10 text-[#171717] dark:text-slate-400">
              Ctrl+K
            </kbd>
          </button>

          {/* Syllabus 3D Shortcut (Desktop/Tablet) */}
          <a
            href="https://syllabus-3d.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            title="Launch Syllabus 3D"
            onClick={() => audioFX.playClickSound()}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:text-[#00d2ff] hover:border-[#00d2ff]/30 transition-colors text-xs font-bold shrink-0 group"
          >
            <img 
              src="/syllabus-logo.png" 
              alt="Syllabus 3D" 
              className="w-4 h-4 rounded-md object-contain shrink-0 group-hover:scale-110 transition-transform" 
            />
            <span className="hidden lg:inline">Syllabus 3D</span>
            <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-[#00d2ff]" />
          </a>

          {/* Streak Badge (Desktop/Tablet) */}
          <div 
            title={`${gamification.streakDays} Day Active Mock Streak!`}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-black shrink-0"
          >
            <Flame className="w-3.5 h-3.5 fill-amber-500" />
            <span>{gamification.streakDays}d</span>
          </div>

          {/* XP Level Badge (Desktop/Tablet) */}
          <div 
            title={`Level ${gamification.level} (${gamification.levelTitle})`}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-[#00d2ff] text-xs font-extrabold shrink-0"
          >
            <Zap className="w-3.5 h-3.5 fill-[#00d2ff]" />
            <span>{gamification.totalXp} XP</span>
          </div>

          {/* Audio Synthesizer Toggle (Desktop/Tablet) */}
          <button
            onClick={toggleSound}
            title={isSoundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
            className="hidden sm:flex w-7 h-7 sm:w-8 sm:h-8 items-center justify-center rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors shrink-0"
          >
            {isSoundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00d2ff]" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
            )}
          </button>

          {/* 1. DARK MODE / THEME TOGGLE (ALWAYS VISIBLE ON MOBILE & DESKTOP!) */}
          <button
            onClick={() => {
              audioFX.playClickSound();
              if (theme === 'dark') setTheme('light');
              else if (theme === 'light') setTheme('warm-cream');
              else setTheme('dark');
            }}
            title={`Current Theme: ${theme}. Tap to switch`}
            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors shrink-0 active:scale-90"
          >
            {activeTheme === 'dark' ? (
              <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00d2ff]" />
            ) : activeTheme === 'warm-cream' ? (
              <span className="text-xs">☕</span>
            ) : (
              <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />
            )}
          </button>

          {/* 2. CLOUD SYNC & GOOGLE PROFILE AVATAR (ALWAYS VISIBLE ON MOBILE & DESKTOP!) */}
          <button 
            onClick={() => {
              audioFX.playClickSound();
              setIsAuthModalOpen(true);
            }}
            title={user ? `${user.name} • 2-Way Cloud Sync Active (Click to manage)` : 'Click to Sign in with Google (Sync PC & Mobile)'}
            className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-xl overflow-hidden flex items-center justify-center text-white font-black text-xs shadow-glow-purple shrink-0 active:scale-90 transition-all group"
          >
            {user?.avatarUrl ? (
              <img 
                src={user.avatarUrl} 
                alt={user.name || 'User Avatar'} 
                className="w-full h-full object-cover rounded-xl border border-[#00d2ff]" 
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-[#8b5cf6] via-[#ec4899] to-[#00d2ff] flex items-center justify-center font-black text-white">
                {user?.name ? user.name[0]?.toUpperCase() : 'S'}
              </div>
            )}

            {/* Cloud Status Dot */}
            <span 
              className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-[#0c1228] ${
                user ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-amber-400'
              } ${isSyncing ? 'animate-ping' : ''}`} 
            />
          </button>

        </div>

      </div>
    </header>
  );
};
