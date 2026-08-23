import React from 'react';
import { Layers, BookOpen, Target, BarChart2, TrendingUp, Plus, Zap } from 'lucide-react';
import { useMocks, NavView } from '../../context/MockContext';

export const MobileNavigation: React.FC = () => {
  const { activeView, setActiveView, setIsAddModalOpen, setEditingMock } = useMocks();

  const navItems: { id: NavView; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Layers className="w-5 h-5" /> },
    { id: 'full-length', label: 'Full', icon: <Target className="w-5 h-5" /> },
    { id: 'sectional', label: 'Drills', icon: <Zap className="w-5 h-5" /> },
    { id: 'chapter-wise', label: 'Chapters', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart2 className="w-5 h-5" /> },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-darkBg/95 light:bg-white/95 backdrop-blur-lg border-t border-white/10 light:border-slate-200 px-3 py-2">
      <div className="flex items-center justify-around relative">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex flex-col items-center gap-1 p-1 transition-colors ${
                isActive ? 'text-electric-blue' : 'text-slate-400'
              }`}
            >
              {item.icon}
              <span className="text-[10px] font-bold">{item.label}</span>
            </button>
          );
        })}

        {/* Center Floating Plus Button */}
        <button
          onClick={() => {
            setEditingMock(null);
            setIsAddModalOpen(true);
          }}
          className="w-11 h-11 -mt-5 rounded-full bg-gradient-to-tr from-electric-blue to-mint flex items-center justify-center text-darkBg shadow-glow-blue active:scale-95 transition-transform"
        >
          <Plus className="w-6 h-6 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};
