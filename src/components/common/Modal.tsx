import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-2xl'
}) => {
  const { activeTheme } = useTheme();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* Modal Card / Mobile Bottom Sheet */}
      <div
        className={`relative w-full ${maxWidth} max-h-[92vh] sm:max-h-[90vh] flex flex-col rounded-t-3xl sm:rounded-2xl border-t sm:border shadow-2xl z-10 overflow-hidden transform transition-all duration-300 animate-slideUp sm:animate-scaleIn ${
          activeTheme === 'dark'
            ? 'bg-darkSurface border-white/10 text-white'
            : activeTheme === 'warm-cream'
              ? 'bg-warmSurface border-warmBorder text-slate-800'
              : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Mobile Drag Indicator */}
        <div className="sm:hidden w-10 h-1.5 rounded-full bg-slate-300 dark:bg-white/20 mx-auto mt-3 mb-1" />

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 sm:py-4 border-b border-slate-200 dark:border-white/10 shrink-0">
            <div className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white">
              {title}
            </div>
            <button
              onClick={onClose}
              aria-label="Close Modal"
              className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto overscroll-contain custom-scrollbar flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};
