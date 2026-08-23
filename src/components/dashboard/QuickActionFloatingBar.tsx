import React from 'react';
import { Plus, Target, BarChart2, TrendingUp, Zap } from 'lucide-react';
import { useMocks } from '../../context/MockContext';
import { Card3DTilt } from '../3d/Card3DTilt';

export const QuickActionFloatingBar: React.FC = () => {
  const { setActiveView, setIsAddModalOpen, setEditingMock } = useMocks();

  const actions = [
    {
      label: 'Log Mock Test',
      desc: 'Full mock or sectional',
      icon: <Plus className="w-5 h-5 text-darkBg" />,
      color: 'bg-gradient-to-r from-electric-blue to-mint text-darkBg',
      onClick: () => {
        setEditingMock(null);
        setIsAddModalOpen(true);
      }
    },
    {
      label: 'Full Length Analysis',
      desc: '100 Qs exam simulations',
      icon: <Target className="w-5 h-5 text-sky-600 dark:text-electric-blue" />,
      color: 'bg-white dark:bg-darkSurface border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white hover:border-slate-300 dark:hover:border-electric-blue/40 shadow-sm',
      onClick: () => setActiveView('full-length')
    },
    {
      label: 'Sectional Drills',
      desc: 'Single-subject speed center',
      icon: <Zap className="w-5 h-5 text-emerald-600 dark:text-mint" />,
      color: 'bg-white dark:bg-darkSurface border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white hover:border-slate-300 dark:hover:border-mint/40 shadow-sm',
      onClick: () => setActiveView('sectional')
    },
    {
      label: 'Percentile Tracker',
      desc: 'Orbit ring & target gap',
      icon: <TrendingUp className="w-5 h-5 text-purple-600 dark:text-lavender" />,
      color: 'bg-white dark:bg-darkSurface border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white hover:border-slate-300 dark:hover:border-lavender/40 shadow-sm',
      onClick: () => setActiveView('percentile')
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((act, idx) => (
        <Card3DTilt
          key={idx}
          maxTilt={4}
          onClick={act.onClick}
          className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 flex items-center gap-3.5 shadow-sm dark:shadow-3d-dark ${act.color}`}
        >
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/10 flex items-center justify-center shrink-0">
            {act.icon}
          </div>
          <div>
            <div className="text-sm font-extrabold text-slate-900 dark:text-white line-clamp-1">
              {act.label}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 font-medium">
              {act.desc}
            </div>
          </div>
        </Card3DTilt>
      ))}
    </div>
  );
};
