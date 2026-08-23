import React from 'react';
import { Zap, Target, Award, CheckCircle2, Clock, Flame, Layers } from 'lucide-react';
import { MockTest, SectionName } from '../../types/mock';
import { StatCard } from '../common/StatCard';

interface SectionalDashboardProps {
  selectedSubject: SectionName | 'ALL';
  onSelectSubject: (subject: SectionName | 'ALL') => void;
  allSectionalMocks: MockTest[];
  activeMocks: MockTest[];
}

export const SectionalDashboard: React.FC<SectionalDashboardProps> = ({
  selectedSubject,
  onSelectSubject,
  allSectionalMocks,
  activeMocks
}) => {
  const isAll = selectedSubject === 'ALL';

  const totalDrills = activeMocks.length;
  const avgAccuracy = totalDrills > 0
    ? Number((activeMocks.reduce((sum, m) => sum + m.accuracy, 0) / totalDrills).toFixed(1))
    : 0;

  const bestScore = totalDrills > 0
    ? Math.max(...activeMocks.map(m => m.score))
    : 0;

  const totalAttemptedQuestions = activeMocks.reduce((sum, m) => sum + m.attempted, 0);
  const totalQuestions = activeMocks.reduce((sum, m) => sum + m.totalQuestions, 0);
  const totalTimeMinutes = activeMocks.reduce((sum, m) => sum + m.timeTakenMinutes, 0);
  const avgSecondsPerQuestion = totalAttemptedQuestions > 0
    ? ((totalTimeMinutes * 60) / totalAttemptedQuestions).toFixed(0)
    : '0';

  const cutoffClearedCount = activeMocks.filter(m => m.isClearedCutoff).length;
  const cutoffRate = totalDrills > 0
    ? Number(((cutoffClearedCount / totalDrills) * 100).toFixed(0))
    : 0;

  // Counts from all sectional mocks
  const isMatch = (m: MockTest, sub: SectionName) => {
    if (m.subjectName === sub) return true;
    if (m.sections && m.sections.some(s => s.sectionName === sub)) return true;
    const name = m.testName.toLowerCase();
    if (sub === 'Quantitative Aptitude' && (name.includes('quant') || name.includes('math'))) return true;
    if (sub === 'General Intelligence & Reasoning' && (name.includes('reason') || name.includes('reasoning'))) return true;
    if (sub === 'English Comprehension' && (name.includes('english') || name.includes('comprehension') || name.includes('vocab'))) return true;
    if (sub === 'General Awareness' && (name.includes('awareness') || name.includes('gk') || name.includes('gs'))) return true;
    return false;
  };

  const quantCount = allSectionalMocks.filter(m => isMatch(m, 'Quantitative Aptitude')).length;
  const reasoningCount = allSectionalMocks.filter(m => isMatch(m, 'General Intelligence & Reasoning')).length;
  const englishCount = allSectionalMocks.filter(m => isMatch(m, 'English Comprehension')).length;
  const gaCount = allSectionalMocks.filter(m => isMatch(m, 'General Awareness')).length;

  const subjectShortTitle = isAll 
    ? 'All Sectional' 
    : selectedSubject === 'Quantitative Aptitude' ? 'Quant'
    : selectedSubject === 'General Intelligence & Reasoning' ? 'Reasoning'
    : selectedSubject === 'English Comprehension' ? 'English'
    : selectedSubject === 'General Awareness' ? 'GA / GK'
    : selectedSubject;

  return (
    <div className="space-y-4">
      {/* Top Sectional Highlights Banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-darkElevated border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-mint/15 border border-emerald-300 dark:border-mint/30 text-emerald-800 dark:text-mint text-xs font-black uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5" />
              <span>{isAll ? 'Single-Subject Speed & Accuracy Drills' : `${subjectShortTitle} Intelligence Center`}</span>
            </span>
            {!isAll && (
              <button
                type="button"
                onClick={() => onSelectSubject('ALL')}
                className="text-xs font-bold text-sky-700 dark:text-electric-blue hover:underline px-2.5 py-0.5 rounded-full bg-sky-100 dark:bg-electric-blue/10 border border-sky-200 dark:border-electric-blue/20"
              >
                Reset to All Subjects ↺
              </button>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-2">
            {isAll ? 'Sectional Mocks & Subject Intelligence' : `${subjectShortTitle} Drill Analysis & Metrics`}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mt-1 font-medium">
            {isAll
              ? 'Dedicated performance tracking for 25-Question single-subject drills. Click any subject button to filter analysis.'
              : `Showing dedicated performance, speed pacing, accuracy, and test history exclusively for ${subjectShortTitle}.`}
          </p>
        </div>

        {/* Interactive Subject Buttons (Clicking switches the whole screen!) */}
        <div className="grid grid-cols-2 gap-2 shrink-0 text-xs font-bold">
          <button
            type="button"
            onClick={() => onSelectSubject(selectedSubject === 'Quantitative Aptitude' ? 'ALL' : 'Quantitative Aptitude')}
            className={`px-3 py-2 rounded-xl border flex items-center justify-between gap-3 transition-all cursor-pointer ${
              selectedSubject === 'Quantitative Aptitude'
                ? 'bg-sky-500 text-white dark:bg-electric-blue dark:text-darkBg border-sky-500 shadow-md scale-[1.03]'
                : 'bg-sky-50 dark:bg-darkSurface text-sky-700 dark:text-sky border-sky-200 dark:border-sky/30 hover:bg-sky-100 dark:hover:bg-darkSurface/90'
            }`}
          >
            <span>📐 Quant Drills</span>
            <span className={`font-black text-sm px-1.5 py-0.2 rounded-md ${selectedSubject === 'Quantitative Aptitude' ? 'bg-white/20 text-white' : 'bg-sky-100 dark:bg-sky/20 text-sky-800 dark:text-sky'}`}>
              {quantCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onSelectSubject(selectedSubject === 'General Intelligence & Reasoning' ? 'ALL' : 'General Intelligence & Reasoning')}
            className={`px-3 py-2 rounded-xl border flex items-center justify-between gap-3 transition-all cursor-pointer ${
              selectedSubject === 'General Intelligence & Reasoning'
                ? 'bg-emerald-600 text-white dark:bg-mint dark:text-darkBg border-emerald-600 shadow-md scale-[1.03]'
                : 'bg-emerald-50 dark:bg-darkSurface text-emerald-700 dark:text-mint border-emerald-200 dark:border-mint/30 hover:bg-emerald-100 dark:hover:bg-darkSurface/90'
            }`}
          >
            <span>🧠 Reasoning</span>
            <span className={`font-black text-sm px-1.5 py-0.2 rounded-md ${selectedSubject === 'General Intelligence & Reasoning' ? 'bg-white/20 text-white' : 'bg-emerald-100 dark:bg-mint/20 text-emerald-800 dark:text-mint'}`}>
              {reasoningCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onSelectSubject(selectedSubject === 'English Comprehension' ? 'ALL' : 'English Comprehension')}
            className={`px-3 py-2 rounded-xl border flex items-center justify-between gap-3 transition-all cursor-pointer ${
              selectedSubject === 'English Comprehension'
                ? 'bg-purple-600 text-white dark:bg-lavender dark:text-darkBg border-purple-600 shadow-md scale-[1.03]'
                : 'bg-purple-50 dark:bg-darkSurface text-purple-700 dark:text-lavender border-purple-200 dark:border-lavender/30 hover:bg-purple-100 dark:hover:bg-darkSurface/90'
            }`}
          >
            <span>📖 English</span>
            <span className={`font-black text-sm px-1.5 py-0.2 rounded-md ${selectedSubject === 'English Comprehension' ? 'bg-white/20 text-white' : 'bg-purple-100 dark:bg-lavender/20 text-purple-800 dark:text-lavender'}`}>
              {englishCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onSelectSubject(selectedSubject === 'General Awareness' ? 'ALL' : 'General Awareness')}
            className={`px-3 py-2 rounded-xl border flex items-center justify-between gap-3 transition-all cursor-pointer ${
              selectedSubject === 'General Awareness'
                ? 'bg-amber-500 text-white dark:bg-amberAccent dark:text-darkBg border-amber-500 shadow-md scale-[1.03]'
                : 'bg-amber-50 dark:bg-darkSurface text-amber-700 dark:text-amberAccent border-amber-200 dark:border-amberAccent/30 hover:bg-amber-100 dark:hover:bg-darkSurface/90'
            }`}
          >
            <span>🌍 GA / GK</span>
            <span className={`font-black text-sm px-1.5 py-0.2 rounded-md ${selectedSubject === 'General Awareness' ? 'bg-white/20 text-white' : 'bg-amber-100 dark:bg-amberAccent/20 text-amber-800 dark:text-amberAccent'}`}>
              {gaCount}
            </span>
          </button>
        </div>
      </div>

      {/* 6 Sectional Metric Cards (Filtered dynamically by active subject!) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          title={isAll ? 'Sectional Drills' : `${subjectShortTitle} Drills`}
          value={totalDrills}
          subtitle={isAll ? 'Total single subject tests' : `${subjectShortTitle} test sessions`}
          icon={<Zap className="w-4 h-4" />}
          accentColor="#BEFFCC"
        />

        <StatCard
          title="Avg Accuracy"
          value={avgAccuracy > 0 ? `${avgAccuracy}%` : '0%'}
          subtitle={`${subjectShortTitle} accuracy`}
          icon={<CheckCircle2 className="w-4 h-4" />}
          accentColor="#5EE88A"
          trend={avgAccuracy >= 88 ? { value: 'Target', isPositive: true } : undefined}
        />

        <StatCard
          title="Avg Speed / Pace"
          value={`${avgSecondsPerQuestion}s`}
          subtitle="Seconds per question"
          icon={<Clock className="w-4 h-4" />}
          accentColor="#6EC2FD"
        />

        <StatCard
          title="Peak Score"
          value={bestScore > 0 ? `${bestScore}` : '0'}
          subtitle="Best drill score / 50"
          icon={<Award className="w-4 h-4" />}
          accentColor="#38BDF8"
        />

        <StatCard
          title="Total Questions"
          value={totalQuestions}
          subtitle="Total questions attempted"
          icon={<Layers className="w-4 h-4" />}
          accentColor="#A78BFA"
        />

        <StatCard
          title="Cutoff Rate"
          value={`${cutoffRate}%`}
          subtitle="Benchmark clear rate"
          icon={<Flame className="w-4 h-4" />}
          accentColor="#F472B6"
        />
      </div>
    </div>
  );
};
