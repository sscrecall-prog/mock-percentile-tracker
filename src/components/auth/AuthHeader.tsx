import React from 'react';

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ title, subtitle }) => {
  return (
    <header className="text-center space-y-2 mb-6">
      {/* 3D App Logo Icon */}
      <div className="inline-flex p-2 rounded-2xl bg-gradient-to-tr from-[#00d2ff]/20 via-[#8b5cf6]/20 to-[#ec4899]/20 border border-white/15 dark:border-white/15 light:border-slate-200 shadow-glow-cyan">
        <img 
          src="/logo.png" 
          alt="MockTracker 3D" 
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-contain shadow-md select-none" 
        />
      </div>

      {/* Title & Subtitle */}
      <div>
        <h1 className="font-black text-xl sm:text-2xl tracking-tight text-slate-900 dark:text-white">
          {title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
          {subtitle}
        </p>
      </div>
    </header>
  );
};
