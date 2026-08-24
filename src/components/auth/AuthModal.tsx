import React, { useState } from 'react';
import { 
  X, 
  Cloud, 
  CheckCircle2, 
  LogOut, 
  RefreshCw, 
  Key, 
  Database, 
  Copy, 
  Check, 
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Smartphone,
  Monitor
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useMocks } from '../../context/MockContext';
import { audioFX } from '../../utils/audioFX';
import { Modal } from '../common/Modal';

export const AuthModal: React.FC = () => {
  const { 
    user, 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    signInWithGoogle, 
    signOut, 
    isCloudConfigured,
    saveCustomConfig,
    clearCustomConfig,
    isSyncing
  } = useAuth();
  const { mocks, showToast } = useMocks();

  const [supabaseUrlInput, setSupabaseUrlInput] = useState('');
  const [supabaseKeyInput, setSupabaseKeyInput] = useState('');
  const [showConfigForm, setShowConfigForm] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleGoogleSignIn = async () => {
    audioFX.playClickSound();
    setIsSigningIn(true);
    const { error } = await signInWithGoogle();
    setIsSigningIn(false);
    if (error) {
      showToast(error, 'error');
    }
  };

  const handleSignOut = async () => {
    audioFX.playClickSound();
    await signOut();
    showToast('Signed out of cloud account.', 'info');
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (supabaseUrlInput.trim() && supabaseKeyInput.trim()) {
      saveCustomConfig(supabaseUrlInput.trim(), supabaseKeyInput.trim());
      showToast('Cloud database keys saved!');
      setShowConfigForm(false);
    }
  };

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={() => setIsAuthModalOpen(false)}
      title="Cloud Sync & Multi-Device Login"
      maxWidth="max-w-lg"
    >
      <div className="space-y-5 text-slate-800 dark:text-white">

        {/* 1. Logged In State */}
        {user ? (
          <div className="space-y-4">
            {/* User Profile Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#00d2ff]/10 via-[#8b5cf6]/10 to-[#ec4899]/10 border border-[#00d2ff]/20 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {user.avatarUrl ? (
                  <img 
                    src={user.avatarUrl} 
                    alt={user.name} 
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-[#00d2ff] shadow-glow-cyan" 
                  />
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#8b5cf6] to-[#00d2ff] flex items-center justify-center text-white font-black text-lg shadow-glow-purple">
                    {user.name?.[0]?.toUpperCase() || 'A'}
                  </div>
                )}
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>{user.name}</span>
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      Connected
                    </span>
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {user.email}
                  </p>
                </div>
              </div>

              <button
                onClick={handleSignOut}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            {/* Live 2-Way Sync Status */}
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Real-Time PC & Mobile 2-Way Sync</span>
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-[11px]">
                  Active
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white dark:bg-[#050814]/80 border border-slate-200 dark:border-white/5">
                  <Monitor className="w-4 h-4 text-[#00d2ff]" />
                  <span>PC / Laptop Sync</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white dark:bg-[#050814]/80 border border-slate-200 dark:border-white/5">
                  <Smartphone className="w-4 h-4 text-[#ec4899]" />
                  <span>Mobile Phone Sync</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Any mock test added, edited, or deleted on your PC or Mobile updates instantly on all connected devices via WebSockets.
              </p>
            </div>
          </div>
        ) : (
          /* 2. Logged Out State */
          <div className="space-y-4">
            
            {/* Visual Header Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#00d2ff]/10 via-[#8b5cf6]/10 to-[#ec4899]/10 border border-[#8b5cf6]/20 text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#00d2ff] via-[#8b5cf6] to-[#ec4899] flex items-center justify-center mx-auto text-white shadow-glow-purple">
                <Cloud className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Sync Between PC & Mobile In Real Time
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
                Sign in with Google to access the same mock scores, analytics, and custom chapter benchmarks seamlessly across all your devices.
              </p>
            </div>

            {/* 1-Click Google Sign In Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isSigningIn}
              className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-900 font-extrabold text-sm border border-slate-300 dark:border-white/20 shadow-md hover:shadow-lg transition-all active:scale-98 flex items-center justify-center gap-3 group"
            >
              {/* Official Google G Logo SVG */}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z" />
                <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2s.7 5.5 1.9 7.9l3.7-2.9z" />
                <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16.5C3.7 20.4 7.5 23.5 12 23.5z" />
              </svg>
              <span>{isSigningIn ? 'Connecting to Google...' : 'Continue with Google'}</span>
            </button>

            {/* Offline Safety Guarantee */}
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Your existing local data is safe and will automatically merge upon sign in.</span>
            </div>

          </div>
        )}

        {/* 3. Custom Supabase Project Configuration (Optional for self-hosters) */}
        <div className="pt-2 border-t border-slate-200 dark:border-white/5">
          <button
            type="button"
            onClick={() => setShowConfigForm(prev => !prev)}
            className="text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:text-[#00d2ff] flex items-center justify-between w-full"
          >
            <span className="flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5" />
              <span>Custom Supabase Project Keys (Advanced)</span>
            </span>
            <span>{showConfigForm ? '▲' : '▼'}</span>
          </button>

          {showConfigForm && (
            <form onSubmit={handleSaveConfig} className="mt-3 space-y-3 p-3.5 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs animate-fadeIn">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Supabase Project URL
                </label>
                <input
                  type="url"
                  value={supabaseUrlInput}
                  onChange={(e) => setSupabaseUrlInput(e.target.value)}
                  placeholder="https://xyzcompany.supabase.co"
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#050814] border border-slate-300 dark:border-white/10 text-xs outline-none focus:border-[#00d2ff]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Supabase Anon Public Key
                </label>
                <input
                  type="password"
                  value={supabaseKeyInput}
                  onChange={(e) => setSupabaseKeyInput(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5..."
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#050814] border border-slate-300 dark:border-white/10 text-xs outline-none focus:border-[#00d2ff]"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={clearCustomConfig}
                  className="text-rose-500 font-bold hover:underline"
                >
                  Reset Keys
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#0066ff] to-[#8b5cf6] text-white font-bold shadow-md"
                >
                  Save Cloud Keys
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </Modal>
  );
};
