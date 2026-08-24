import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  autoComplete?: 'current-password' | 'new-password';
  required?: boolean;
  disabled?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder = 'Enter your password',
  error,
  autoComplete = 'current-password',
  required = false,
  disabled = false,
  onKeyDown,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-1.5 text-left">
      <label 
        htmlFor={id} 
        className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400"
      >
        {label} {required && <span className="text-rose-500">*</span>}
      </label>

      <div className="relative flex items-center">
        {/* Leading Lock Icon */}
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Lock className="w-4 h-4" />
        </div>

        {/* Secure Password Input */}
        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full pl-10 pr-11 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 outline-none
            bg-slate-100 dark:bg-[#050814]/90 light:bg-slate-50 light:border-slate-300
            text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500
            border ${
              error 
                ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20' 
                : 'border-slate-200 dark:border-white/10 focus:border-[#00d2ff] focus:ring-2 focus:ring-[#00d2ff]/20'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        />

        {/* Independent Show / Hide Password Toggle */}
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          tabIndex={0}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>

      {error && (
        <p id={`${id}-error`} className="text-[11px] font-semibold text-rose-500 animate-fadeIn pl-0.5">
          {error}
        </p>
      )}
    </div>
  );
};
