import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { useMocks } from '../../context/MockContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useMocks();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-6 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4">
      {toasts.map(toast => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-mint-dark dark:text-mint shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amberAccent shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-alert-red shrink-0" />,
          info: <Info className="w-5 h-5 text-electric-blue shrink-0" />
        };

        const borders = {
          success: 'border-mint/30 bg-darkSurface/95 dark:bg-darkSurface/95 light:bg-white/95',
          warning: 'border-amberAccent/30 bg-darkSurface/95 dark:bg-darkSurface/95 light:bg-white/95',
          error: 'border-alert-red/30 bg-darkSurface/95 dark:bg-darkSurface/95 light:bg-white/95',
          info: 'border-electric-blue/30 bg-darkSurface/95 dark:bg-darkSurface/95 light:bg-white/95'
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-xl border shadow-xl backdrop-blur-md transition-all animate-float ${borders[toast.type]}`}
          >
            <div className="flex items-center gap-3">
              {icons[toast.type]}
              <span className="text-sm font-medium text-slate-900 dark:text-white">
                {toast.message}
              </span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
