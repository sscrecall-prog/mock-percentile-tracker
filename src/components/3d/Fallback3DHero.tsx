import React from 'react';

export const Fallback3DHero: React.FC = () => {
  return (
    <div className="relative w-full h-full min-h-[220px] flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-electric-blue/10 via-transparent to-mint/10 border border-white/5">
      {/* Outer Rotating Glow Ring */}
      <div className="absolute w-48 h-48 rounded-full border border-electric-blue/30 animate-spin-slow" />
      <div className="absolute w-36 h-36 rounded-full border border-dashed border-mint/40 animate-spin-slow [animation-direction:reverse]" />
      
      {/* Center Core Badge */}
      <div className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-tr from-darkContainer to-darkElevated border border-electric-blue/40 shadow-glow-blue flex flex-col items-center justify-center">
        <span className="text-2xl">??</span>
        <span className="text-[10px] font-bold text-electric-blue tracking-wider uppercase mt-1">Percentile</span>
      </div>

      {/* Floating Sparkles */}
      <div className="absolute top-6 left-8 w-2 h-2 rounded-full bg-electric-blue animate-pulse shadow-glow-blue" />
      <div className="absolute bottom-8 right-10 w-2 h-2 rounded-full bg-mint animate-pulse shadow-glow-mint" />
      <div className="absolute top-10 right-14 w-1.5 h-1.5 rounded-full bg-lavender animate-pulse" />
    </div>
  );
};
