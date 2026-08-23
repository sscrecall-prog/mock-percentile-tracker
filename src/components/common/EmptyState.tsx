import React from 'react';
import { Plus } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText = 'Log Mock Test',
  onAction,
  icon = '??'
}) => {
  return (
    <div className="p-8 sm:p-12 text-center rounded-2xl border border-dashed border-white/10 dark:border-white/10 light:border-slate-300 bg-darkSurface/30 light:bg-white/50 backdrop-blur-sm max-w-lg mx-auto my-8">
      {/* Animated Icon Ring */}
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-electric-blue/20 to-mint/20 border border-electric-blue/30 flex items-center justify-center text-3xl shadow-glow-blue animate-float">
        {icon}
      </div>

      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-sm mx-auto">
        {description}
      </p>

      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-electric-blue to-electric-dark text-darkBg font-bold text-sm shadow-glow-blue hover:opacity-95 transition-all transform active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          {actionText}
        </button>
      )}
    </div>
  );
};
