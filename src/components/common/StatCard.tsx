import React from 'react';
import { Card3DTilt } from '../3d/Card3DTilt';
import { useTheme } from '../../theme/ThemeContext';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  accentColor?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon,
  accentColor = 'rgba(110, 194, 253, 0.4)',
  onClick
}) => {
  const { activeTheme } = useTheme();

  return (
    <Card3DTilt
      onClick={onClick}
      className={`group p-5 border rounded-2xl transition-all duration-300 ${
        activeTheme === 'dark'
          ? 'bg-darkSurface border-white/10 hover:border-white/20 text-white'
          : activeTheme === 'warm-cream'
            ? 'bg-warmSurface border-warmBorder hover:border-amber-200 text-slate-900'
            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-900 shadow-sm'
      } shadow-md dark:shadow-3d-dark cursor-pointer`}
    >
      {/* Top row */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300">
          {title}
        </span>
        {icon && (
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
            style={{ backgroundColor: accentColor.replace('0.4', '0.15'), color: accentColor }}
          >
            {icon}
          </div>
        )}
      </div>

      {/* Metric value */}
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          {value}
        </span>
        {trend && (
          <span
            className={`text-xs font-bold px-1.5 py-0.5 rounded ${
              trend.isPositive
                ? 'bg-mint/20 text-emerald-700 dark:text-mint font-extrabold'
                : 'bg-alert-red/20 text-alert-red font-extrabold'
            }`}
          >
            {trend.value}
          </span>
        )}
      </div>

      {/* Subtitle */}
      {subtitle && (
        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 line-clamp-1 font-medium">
          {subtitle}
        </p>
      )}
    </Card3DTilt>
  );
};
