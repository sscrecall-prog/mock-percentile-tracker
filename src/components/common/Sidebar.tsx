import React from 'react';
import { 
  Plus, 
  Layers, 
  Target, 
  Zap, 
  BookOpen, 
  BarChart2, 
  TrendingUp, 
  Settings as SettingsIcon,
  ExternalLink,
  Sparkles,
  Award,
  Flame,
  LayoutDashboard
} from 'lucide-react';
import { useMocks, NavView } from '../../context/MockContext';
import { audioFX } from '../../utils/audioFX';

export const Sidebar: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    setIsAddModalOpen, 
    setEditingMock,
    gamification,
    settings
  } = useMocks();

  const navMenuItems: { id: NavView; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'home', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4 shrink-0" /> },
    { id: 'full-length', label: 'Full Length Mocks', icon: <Target className="w-4 h-4 shrink-0" /> },
    { id: 'sectional', label: 'Sectional Drills', icon: <Zap className="w-4 h-4 shrink-0" /> },
    { id: 'chapter-wise', label: 'Chapter-Wise Hub', icon: <BookOpen className="w-4 h-4 shrink-0" />, badge: 'New' },
    { id: 'mocks', label: 'All Mock Tests', icon: <Layers className="w-4 h-4 shrink-0" /> },
    { id: 'percentile', label: 'Percentile Tracker', icon: <TrendingUp className="w-4 h-4 shrink-0" /> },
    { id: 'analytics', label: 'Analytics & Insights', icon: <BarChart2 className="w-4 h-4 shrink-0" /> },
    { id: 'settings', label: 'Settings & Data', icon: <SettingsIcon className="w-4 h-4 shrink-0" /> },
  ];

  const handleNavClick = (id: NavView) => {
    audioFX.playClickSound();
    setActiveView(id);
  };

  const handleOpenAddMock = () => {
    audioFX.playClickSound();
    setEditingMock(null);
    setIsAddModalOpen(true);
  };

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 h-screen sticky top-0 bg-white/95 dark:bg-[#0c1228]/95 backdrop-blur-2xl border-r border-slate-200/80 dark:border-slate-800/80 z-30 overflow-y-auto no-scrollbar justify-between p-4 space-y-4">
      
      {/* 1. Top Section: Logo & Add Mock CTA */}
      <div className="space-y-4">
        {/* Brand Logo Header */}
        <div 
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 px-2 py-1 cursor-pointer group"
        >
          <img 
            src="/logo.png" 
            alt="MockTracker Logo" 
            className="w-9 h-9 rounded-xl object-contain shadow-glow-cyan group-hover:scale-105 transition-transform duration-300 shrink-0" 
          />
          <div>
            <div className="font-black text-sm tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              <span className="bg-gradient-to-r from-[#00d2ff] via-[#a855f7] to-[#ec4899] bg-clip-text text-transparent">MOCKTRACKER</span>
              <span className="text-[8px] font-black px-1 py-0.2 rounded bg-cyan-500/15 text-cyan-600 dark:text-[#00d2ff] border border-cyan-500/30 uppercase">
                3D
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
              PERCENTILE PRO
            </p>
          </div>
        </div>

        {/* Full-width Neon CTA Button */}
        <button
          onClick={handleOpenAddMock}
          className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-[#0066ff] via-[#8b5cf6] to-[#d946ef] text-white font-extrabold text-xs shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_30px_rgba(217,70,239,0.65)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add New Mock</span>
        </button>

        {/* Navigation Menu List */}
        <nav className="space-y-1 pt-1">
          {navMenuItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 text-left group ${
                  isActive
                    ? 'bg-gradient-to-r from-[#00d2ff]/15 via-[#8b5cf6]/15 to-transparent text-[#00d2ff] dark:text-[#00d2ff] border-l-4 border-[#00d2ff] font-black pl-2.5 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? 'text-[#00d2ff]' : 'text-slate-400 dark:text-slate-500'
                  }`}>
                    {item.icon}
                  </div>
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-gradient-to-r from-[#ec4899] to-[#d946ef] text-white shadow-glow-magenta">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* 2. Bottom Section: Partner App & Aspirant XP Card */}
      <div className="space-y-2.5 pt-2 border-t border-slate-200/80 dark:border-slate-800/80">
        
        {/* Partner App Card: Syllabus 3D */}
        <a
          href="https://syllabus-3d.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => audioFX.playClickSound()}
          className="group block p-2.5 rounded-2xl bg-gradient-to-r from-[#00d2ff]/10 via-[#8b5cf6]/10 to-[#ec4899]/10 border border-slate-200 dark:border-white/10 hover:border-[#00d2ff]/40 transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#00d2ff] to-[#8b5cf6] flex items-center justify-center text-white text-[10px] font-black shadow-sm">
                S
              </div>
              <div>
                <div className="text-[11px] font-black text-slate-900 dark:text-white group-hover:text-[#00d2ff] transition-colors flex items-center gap-1">
                  <span>Syllabus 3D</span>
                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-[#00d2ff]" />
                </div>
                <div className="text-[9px] text-slate-500 dark:text-slate-400 font-medium">
                  Track & Complete Syllabus
                </div>
              </div>
            </div>
          </div>
        </a>

        {/* Aspirant Profile & Level XP Progress Card */}
        <div className="p-3 rounded-2xl bg-slate-100/80 dark:bg-[#050814]/90 border border-slate-200 dark:border-white/5 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#8b5cf6] via-[#ec4899] to-[#00d2ff] flex items-center justify-center text-white font-black text-xs shadow-glow-purple">
                S
              </div>
              <div>
                <div className="text-[11px] font-black text-slate-900 dark:text-white tracking-tight">
                  SUNNY RISE
                </div>
                <div className="text-[9px] font-semibold text-slate-500 dark:text-slate-400">
                  {gamification.levelTitle}
                </div>
              </div>
            </div>

            <span className="px-1.5 py-0.5 rounded-md text-[9px] font-black bg-[#8b5cf6]/20 text-[#8b5cf6] dark:text-[#a855f7] border border-[#8b5cf6]/30">
              Lvl {gamification.level}
            </span>
          </div>

          {/* XP Progress Bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[9px] font-bold">
              <span className="text-slate-500 dark:text-slate-400">Level XP</span>
              <span className="text-[#00d2ff] font-extrabold">{gamification.totalXp} / {gamification.nextLevelXp} XP</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-[#00d2ff] via-[#8b5cf6] to-[#ec4899] transition-all duration-500 shadow-glow-cyan"
                style={{ width: `${gamification.progressPercent}%` }}
              />
            </div>
          </div>
        </div>

      </div>

    </aside>
  );
};
