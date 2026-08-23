import React from 'react';
import { useTheme } from '../../theme/ThemeContext';

interface PercentileOrbitalRing3DProps {
  currentPercentile: number;
  targetPercentile: number;
  bestPercentile: number;
}

export const PercentileOrbitalRing3D: React.FC<PercentileOrbitalRing3DProps> = ({
  currentPercentile,
  targetPercentile,
  bestPercentile
}) => {
  const { activeTheme } = useTheme();
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (currentPercentile / 100) * circumference;
  const targetOffset = circumference - (targetPercentile / 100) * circumference;

  const isDark = activeTheme === 'dark';

  return (
    <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
      {/* 3D Depth Aura Glow */}
      <div className="absolute inset-4 rounded-full bg-electric-blue/15 blur-2xl animate-pulse-slow" />
      
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 220 220">
        {/* Background Track */}
        <circle
          cx="110"
          cy="110"
          r={radius}
          stroke={isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(15, 23, 42, 0.08)"}
          strokeWidth="14"
          fill="transparent"
        />

        {/* Target Indicator Arc */}
        <circle
          cx="110"
          cy="110"
          r={radius}
          stroke={isDark ? "rgba(167, 139, 250, 0.35)" : "rgba(124, 58, 237, 0.25)"}
          strokeWidth="16"
          strokeDasharray={circumference}
          strokeDashoffset={targetOffset}
          fill="transparent"
          strokeLinecap="round"
        />

        {/* Current Percentile Glowing Arc */}
        <circle
          cx="110"
          cy="110"
          r={radius}
          stroke="url(#percentileGradient)"
          strokeWidth="14"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          fill="transparent"
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />

        {/* Gradients */}
        <defs>
          <linearGradient id="percentileGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6EC2FD" />
            <stop offset="70%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#BEFFCC" />
          </linearGradient>
        </defs>
      </svg>

      {/* Center 3D Glass Badge */}
      <div className="absolute flex flex-col items-center justify-center text-center p-4 rounded-full bg-darkSurface/80 light:bg-white/90 backdrop-blur-md border border-electric-blue/30 shadow-glow-blue w-36 h-36">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Current</span>
        <div className="flex items-baseline">
          <span className="text-3xl font-extrabold text-white light:text-slate-900 tracking-tight">
            {currentPercentile.toFixed(1)}
          </span>
          <span className="text-sm font-bold text-electric-blue ml-0.5">%ile</span>
        </div>
        <div className="mt-1 px-2 py-0.5 rounded-full bg-mint/15 border border-mint/30 text-[10px] font-bold text-mint-dark">
          Target: {targetPercentile}%
        </div>
      </div>
    </div>
  );
};
