import React from 'react';
import { Sparkles, Plus, TrendingUp, Target, Award, ArrowUpRight } from 'lucide-react';
import { useMocks } from '../../context/MockContext';
import { Hero3DCanvas } from '../3d/Hero3DCanvas';

export const HeroSection: React.FC = () => {
  const { kpis, settings, setIsAddModalOpen, setEditingMock, setActiveView } = useMocks();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning, Aspirant';
    if (hour < 18) return 'Good Afternoon, Aspirant';
    return 'Good Evening, Aspirant';
  };

  const isAheadOfCutoff = kpis.averageScore >= 135;

  return (
    <div className="relative rounded-3xl overflow-hidden p-6 sm:p-8 border border-slate-200 dark:border-white/10 bg-white dark:bg-darkElevated shadow-sm dark:shadow-2xl">
      {/* Background Radial Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-electric-blue/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 rounded-full bg-mint/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Greeting, Goal & Motivational Summary */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Top Status Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 dark:bg-electric-blue/10 border border-sky-300 dark:border-electric-blue/20 text-sky-800 dark:text-electric-blue text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Target Exam: {settings.selectedExam} • Target {settings.targetPercentile}%ile</span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {getGreeting()} 🎯
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed font-medium">
              {kpis.totalMocks > 0 ? (
                <>
                  You have logged <span className="text-sky-700 dark:text-electric-blue font-bold">{kpis.totalMocks} mock attempts</span>. 
                  Your current average percentile is <span className="text-emerald-700 dark:text-mint font-bold">{kpis.averagePercentile}%ile</span> with an average score of <span className="text-slate-900 dark:text-white font-bold">{kpis.averageScore} marks</span>.
                </>
              ) : (
                'Start logging your mock tests to unlock 3D trajectory tracking, section diagnostic intelligence, and automated percentile gap analysis.'
              )}
            </p>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-darkSurface/60 border border-slate-200 dark:border-white/5">
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 text-xs font-semibold">
                <Target className="w-3.5 h-3.5 text-sky-600 dark:text-electric-blue" />
                <span>Cutoff Status</span>
              </div>
              <div className="mt-1 text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {kpis.totalFullLengthMocks > 0 ? (
                  <span className={isAheadOfCutoff ? 'text-emerald-700 dark:text-mint' : 'text-amber-600 dark:text-amberAccent'}>
                    {isAheadOfCutoff ? 'Cleared ✓' : 'In Progress'}
                  </span>
                ) : 'N/A'}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-darkSurface/60 border border-slate-200 dark:border-white/5">
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 text-xs font-semibold">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-mint" />
                <span>Best Score</span>
              </div>
              <div className="mt-1 text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {kpis.bestScore > 0 ? `${kpis.bestScore} M` : '0'}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-darkSurface/60 border border-slate-200 dark:border-white/5">
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 text-xs font-semibold">
                <Award className="w-3.5 h-3.5 text-purple-600 dark:text-lavender" />
                <span>Peak %ile</span>
              </div>
              <div className="mt-1 text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {kpis.bestPercentile > 0 ? `${kpis.bestPercentile}%` : '0%'}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={() => {
                setEditingMock(null);
                setIsAddModalOpen(true);
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-electric-blue to-mint text-darkBg font-extrabold text-xs sm:text-sm shadow-glow-blue hover:opacity-90 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Log Mock Test</span>
            </button>

            <button
              onClick={() => setActiveView('analytics')}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10 font-bold text-xs sm:text-sm transition-all"
            >
              <span>View Analytics</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Right Column: 3D Holographic Scene */}
        <div className="lg:col-span-5 relative w-full h-[260px] sm:h-[300px] flex items-center justify-center">
          <Hero3DCanvas />
        </div>

      </div>
    </div>
  );
};
