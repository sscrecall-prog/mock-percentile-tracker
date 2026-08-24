import React from 'react';
import { Loader2 } from 'lucide-react';

interface PrimaryAuthButtonProps {
  type?: 'button' | 'submit';
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export const PrimaryAuthButton: React.FC<PrimaryAuthButtonProps> = ({
  type = 'submit',
  onClick,
  disabled = false,
  isLoading = false,
  children,
  variant = 'primary',
}) => {
  const isActionDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isActionDisabled}
      className={`w-full min-h-[52px] sm:min-h-[54px] px-6 rounded-2xl font-extrabold text-sm sm:text-base tracking-wide
        flex items-center justify-center gap-2 transition-all duration-200 select-none
        ${
          variant === 'primary'
            ? 'bg-gradient-to-r from-[#0066ff] via-[#8b5cf6] to-[#d946ef] text-white shadow-cyber-cta hover:shadow-glow-purple hover:scale-[1.01] active:scale-[0.98]'
            : 'bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-white hover:bg-slate-300 dark:hover:bg-white/15'
        }
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none
      `}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Processing...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};
