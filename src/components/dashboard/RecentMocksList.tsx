import React from 'react';
import { ChevronRight, Calendar, ArrowRight, BookOpen } from 'lucide-react';
import { useMocks } from '../../context/MockContext';
import { Badge } from '../common/Badge';

export const RecentMocksList: React.FC = () => {
  const { mocks, setActiveView, setViewingMockDetail } = useMocks();

  const recent = [...mocks]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="p-6 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-darkSurface shadow-sm dark:shadow-3d-dark">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
            Recent Mock Attempts
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-medium">Latest recorded test sessions</p>
        </div>

        <button
          onClick={() => setActiveView('mocks')}
          className="flex items-center gap-1 text-xs font-bold text-sky-700 dark:text-electric-blue hover:underline"
        >
          <span>View All ({mocks.length})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {recent.length === 0 ? (
        <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-400 font-medium">
          No recent mocks recorded. Click &quot;Log Mock Test&quot; above.
        </div>
      ) : (
        <div className="space-y-2.5">
          {recent.map((mock) => (
            <div
              key={mock.id}
              onClick={() => {
                setViewingMockDetail(mock);
                if (mock.mockType === 'FULL_LENGTH') {
                  setActiveView('full-length');
                } else if (mock.mockType === 'SECTIONAL' || mock.mockType === 'SUBJECT') {
                  setActiveView('sectional');
                } else {
                  setActiveView('mocks');
                }
              }}
              className="group flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-darkContainer/40 border border-slate-200 dark:border-white/5 hover:border-sky-400 dark:hover:border-electric-blue/30 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                {/* Score Avatar */}
                <div
                  className={`w-11 h-11 rounded-2xl flex flex-col items-center justify-center font-black text-xs shadow-inner ${
                    mock.isClearedCutoff
                      ? 'bg-emerald-100 dark:bg-mint/15 text-emerald-800 dark:text-mint border border-emerald-300 dark:border-mint/30'
                      : 'bg-red-100 dark:bg-alert-red/15 text-red-800 dark:text-alert-red border border-red-300 dark:border-alert-red/30'
                  }`}
                >
                  <span className="text-xs leading-none">{mock.score.toFixed(0)}</span>
                  <span className="text-[9px] font-medium opacity-80">/{mock.maxMarks}</span>
                </div>

                <div>
                  <div className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-sky-700 dark:group-hover:text-electric-blue transition-colors line-clamp-1">
                    {mock.testName}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-medium">
                    <span>{mock.testPlatform}</span>
                    <span>•</span>
                    <span>{mock.exam}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                      {mock.date}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-black text-slate-900 dark:text-white">
                    {mock.accuracy}% Acc
                  </div>
                  <div className="text-[11px] font-bold text-purple-700 dark:text-lavender">
                    {mock.percentile}%ile
                  </div>
                </div>

                <Badge variant={mock.isClearedCutoff ? 'success' : 'alert'} size="sm">
                  {mock.isClearedCutoff ? 'Cleared' : 'Missed'}
                </Badge>

                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
