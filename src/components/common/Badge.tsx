import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'alert' | 'warning' | 'purple' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = ''
}) => {
  const variantStyles = {
    primary: 'bg-electric-blue/15 text-electric-blue border-electric-blue/30',
    success: 'bg-mint/15 text-mint-dark border-mint/30 dark:text-mint',
    alert: 'bg-alert-red/15 text-alert-red border-alert-red/30',
    warning: 'bg-amberAccent/15 text-amberAccent border-amberAccent/30',
    purple: 'bg-lavender/15 text-lavender border-lavender/30',
    neutral: 'bg-slate-500/15 text-slate-400 border-slate-500/30'
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[10px] font-semibold',
    md: 'px-2.5 py-1 text-xs font-semibold'
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border font-medium uppercase tracking-wider ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};
