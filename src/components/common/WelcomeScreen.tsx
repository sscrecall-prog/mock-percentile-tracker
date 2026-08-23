import React, { useState } from 'react';
import { X, ArrowRight, Sparkles } from 'lucide-react';

interface WelcomeScreenProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ isOpen, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);

  if (!isOpen) return null;

  const handleStart = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 350);
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-[#0B0D13]/95 backdrop-blur-2xl transition-all duration-350 overflow-y-auto ${
        isClosing ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100 animate-fadeIn'
      }`}
    >
      {/* Background ambient radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-blue-600/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-purple-600/15 blur-[120px] pointer-events-none" />

      {/* Main Poster Container */}
      <div className="relative w-full max-w-sm sm:max-w-md my-auto flex flex-col items-center justify-center shadow-2xl rounded-3xl overflow-hidden animate-slideUp">
        
        {/* Top Floating Quick Dismiss Button */}
        <button
          onClick={handleStart}
          aria-label="Close Welcome Screen"
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white/80 hover:text-white border border-white/10 backdrop-blur-md transition-all active:scale-90"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Exact Uploaded Welcome Poster Image */}
        <div className="relative w-full overflow-hidden rounded-3xl group">
          <img
            src="/welcome-poster.png"
            alt="Welcome to MockTracker"
            className="w-full h-auto object-cover select-none pointer-events-auto cursor-pointer"
            onClick={handleStart}
          />

          {/* Interactive Invisible Overlay on 'Let's get started' button region */}
          <div 
            onClick={handleStart}
            className="absolute bottom-[8%] left-[6%] right-[6%] h-[7%] rounded-2xl cursor-pointer active:scale-95 transition-transform"
            title="Let's get started"
          />
        </div>

        {/* Bottom Floating Bar on Mobile */}
        <div className="w-full p-3 text-center sm:hidden">
          <button
            onClick={handleStart}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-black text-sm shadow-[0_4px_20px_rgba(99,102,241,0.5)] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>Let's get started</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

      </div>
    </div>
  );
};
