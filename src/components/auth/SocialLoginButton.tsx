import React from 'react';

interface SocialLoginButtonProps {
  onClick: () => void;
  disabled?: boolean;
  text?: string;
}

export const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({
  onClick,
  disabled = false,
  text = 'Continue with Google',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full min-h-[48px] px-4 rounded-xl bg-white hover:bg-slate-50 dark:bg-white/5 dark:hover:bg-white/10 
        text-slate-800 dark:text-white font-extrabold text-xs sm:text-sm 
        border border-slate-300 dark:border-white/15 
        shadow-sm hover:shadow transition-all duration-200 active:scale-[0.98] 
        flex items-center justify-center gap-3 select-none disabled:opacity-50 cursor-pointer"
    >
      {/* Official Multi-Color Google G SVG Icon */}
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
        <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z" />
        <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2s.7 5.5 1.9 7.9l3.7-2.9z" />
        <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16.5C3.7 20.4 7.5 23.5 12 23.5z" />
      </svg>
      <span>{text}</span>
    </button>
  );
};
