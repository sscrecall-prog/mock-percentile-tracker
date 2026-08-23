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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn"
      />

      {/* Modal Card */}
      <div
        className={`relative w-full ${maxWidth} max-h-[90vh] flex flex-col rounded-2xl border shadow-2xl z-10 overflow-hidden transform transition-all duration-300 ${
          activeTheme === 'dark'
            ? 'bg-darkSurface border-white/10 text-white'
            : activeTheme === 'warm-cream'
              ? 'bg-warmSurface border-warmBorder text-slate-800'
              : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-white/10 shrink-0">
            <div className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">{title}</div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar text-slate-900 dark:text-slate-100">
          {children}
        </div>
      </div>
    </div>
  );
};
