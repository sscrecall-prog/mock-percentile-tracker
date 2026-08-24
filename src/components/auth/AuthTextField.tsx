import React from 'react';
import { LucideIcon } from 'lucide-react';

interface AuthTextFieldProps {
  id: string;
  label: string;
  type?: 'text' | 'email' | 'tel';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  icon?: LucideIcon;
  error?: string;
  autoComplete?: string;
  required?: boolean;
  disabled?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const AuthTextField: React.FC<AuthTextFieldProps> = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  icon: Icon,
  error,
  autoComplete,
  required = false,
  disabled = false,
  onKeyDown,
}) => {
  return (
    <div className="space-y-1.5 text-left">
      <label 
        htmlFor={id} 
        className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400"
      >
        {label} {required && <span className="text-rose-500">*</span>}
      </label>

      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          disabled={disabled}
          inputMode={type === 'email' ? 'email' : type === 'tel' ? 'tel' : 'text'}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full ${Icon ? 'pl-10' : 'pl-3.5'} pr-3.5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 outline-none
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
      </div>

      {error && (
        <p id={`${id}-error`} className="text-[11px] font-semibold text-rose-500 animate-fadeIn pl-0.5">
          {error}
        </p>
      )}
    </div>
  );
};
