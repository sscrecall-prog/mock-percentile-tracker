import React from 'react';
import { AlertCircle } from 'lucide-react';

interface AuthErrorMessageProps {
  message?: string | null;
}

export const AuthErrorMessage: React.FC<AuthErrorMessageProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div 
      role="alert" 
      aria-live="polite"
      className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2.5 animate-fadeIn"
    >
      <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
      <span className="flex-1 leading-relaxed">{message}</span>
    </div>
  );
};
