import React from 'react';
import { Modal } from '../common/Modal';
import { ShieldCheck, FileText } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'terms' | 'privacy';
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose, type }) => {
  const isTerms = type === 'terms';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isTerms ? 'Terms of Service' : 'Privacy Policy'}
      maxWidth="max-w-lg"
    >
      <div className="space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 max-h-[60vh] overflow-y-auto pr-1">
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#00d2ff]/10 border border-[#00d2ff]/20 text-[#00d2ff] font-bold">
          {isTerms ? <FileText className="w-5 h-5 shrink-0" /> : <ShieldCheck className="w-5 h-5 shrink-0" />}
          <span>{isTerms ? 'MockTracker 3D Terms of Service' : 'Aspirant Data Privacy Policy'}</span>
        </div>

        {isTerms ? (
          <>
            <p>
              Welcome to <b>MockTracker 3D Pro</b>. By creating an account or using our application, you agree to track your competitive exam mocks responsibly and abide by fair preparation principles.
            </p>
            <h4 className="font-bold text-slate-900 dark:text-white mt-2">1. Personal Learning Account</h4>
            <p>Your mock test logs, subject chapter analytics, and percentile benchmarks are private to your authenticated profile.</p>
            <h4 className="font-bold text-slate-900 dark:text-white mt-2">2. Cloud Data Synchronization</h4>
            <p>MockTracker synchronizes your test data across your PC and mobile devices using encrypted database connections.</p>
          </>
        ) : (
          <>
            <p>
              Your privacy is our priority. We collect only necessary aspirant profile information (Name, Email/Phone, Target Exam) to deliver accurate percentile intelligence and real-time multi-device sync.
            </p>
            <h4 className="font-bold text-slate-900 dark:text-white mt-2">1. Data Storage & Security</h4>
            <p>All test scores and syllabus trackers are secured with PostgreSQL Row Level Security (RLS). We never sell your personal information to third parties.</p>
            <h4 className="font-bold text-slate-900 dark:text-white mt-2">2. Cookies & Local Storage</h4>
            <p>Local storage is used to ensure offline-first functionality so your study sessions remain uninterrupted without internet connectivity.</p>
          </>
        )}

        <div className="pt-3 border-t border-slate-200 dark:border-white/10 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0066ff] to-[#8b5cf6] text-white font-extrabold text-xs shadow-sm hover:scale-[1.02] active:scale-98"
          >
            I Understand
          </button>
        </div>
      </div>
    </Modal>
  );
};
