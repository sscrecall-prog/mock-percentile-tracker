import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-3 sm:p-6 md:p-8 bg-[#050814] dark:bg-[#050814] light:bg-[#F5E6C8] warm-cream:bg-[#F5E6C8] text-[#171717] dark:text-white transition-colors duration-300 overflow-x-hidden">
      
      {/* 🌌 Animated Ambient Breathing Moonglow Orbs */}
      <div 
        aria-hidden="true" 
        className="absolute top-[-10%] left-[10%] w-[380px] sm:w-[480px] h-[380px] sm:h-[480px] rounded-full bg-gradient-to-tr from-[#D4AF37]/25 via-[#F5E6C8]/30 dark:from-[#00d2ff]/25 dark:via-[#8b5cf6]/20 to-transparent blur-[80px] sm:blur-[100px] moonglow pointer-events-none" 
      />
      <div 
        aria-hidden="true" 
        className="absolute bottom-[-10%] right-[10%] w-[340px] sm:w-[440px] h-[340px] sm:h-[440px] rounded-full bg-gradient-to-tr from-[#171717]/15 via-[#D4AF37]/20 dark:from-[#ec4899]/20 dark:via-[#8b5cf6]/25 to-transparent blur-[80px] sm:blur-[100px] moonglow pointer-events-none" 
      />

      {/* 🛸 Centered Responsive Authentication Container (Constrained on Web, Comfortable Full Width on Mobile) */}
      <div className="relative z-10 w-full max-w-[460px] mx-auto login p-5 sm:p-8 shadow-[0_0_60px_rgba(212,175,55,0.15)] border border-white/15 dark:border-white/15 light:border-[#6B7280]/25 light:bg-[#FFFDF9]/95 backdrop-blur-2xl transition-all duration-300">
        {children}
      </div>
    </div>
  );
};
