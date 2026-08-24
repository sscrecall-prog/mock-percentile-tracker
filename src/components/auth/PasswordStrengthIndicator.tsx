import React from 'react';
import { calculatePasswordStrength } from '../../utils/authValidation';

interface PasswordStrengthIndicatorProps {
  password: string;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
  if (!password) return null;

  const { label, progress, color } = calculatePasswordStrength(password);

  const getLabelColor = () => {
    switch (label) {
      case 'Weak':
        return 'text-rose-500';
      case 'Medium':
        return 'text-amber-500';
      case 'Strong':
        return 'text-emerald-500';
    }
  };

  return (
    <div className="space-y-1.5 pt-1 animate-fadeIn">
      {/* Visual Progress Bar */}
      <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-300 ${color}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Accessible Text Status */}
      <div className="flex items-center justify-between text-[11px] font-bold">
        <span className="text-slate-400 dark:text-slate-500">Password Strength:</span>
        <span className={`transition-colors duration-200 ${getLabelColor()}`}>
          {label} (Min 8 chars, numbers & letters)
        </span>
      </div>
    </div>
  );
};
