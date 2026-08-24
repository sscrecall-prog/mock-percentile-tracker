import React, { useState } from 'react';
import { 
  X, 
  Cloud, 
  CheckCircle2, 
  LogOut, 
  Eye, 
  EyeOff, 
  Key, 
  Database, 
  Sparkles, 
  Smartphone, 
  Monitor,
  Target,
  ArrowRight,
  ShieldCheck,
  User as UserIcon,
  Mail,
  Lock,
  Phone,
  RefreshCw
} from 'lucide-react';
import { useAuth, AuthMode } from '../../context/AuthContext';
import { useMocks } from '../../context/MockContext';
import { audioFX } from '../../utils/audioFX';
import { Modal } from '../common/Modal';

export const AuthModal: React.FC = () => {
  const { 
    user, 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authMode, 
    setAuthMode,
    signUpWithEmail, 
    signInWithEmailPassword, 
    signInWithGoogle, 
    resetPassword,
    continueAsGuest,
    signOut, 
    isCloudConfigured,
    saveCustomConfig,
    clearCustomConfig,
    isSyncing
  } = useAuth();
  
  const { showToast, gamification, settings } = useMocks();

  // Form states
  const [name, setName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [targetExam, setTargetExam] = useState(settings.selectedExam || 'SSC CGL');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSuccessMessage, setResetSuccessMessage] = useState(false);

  // Custom Supabase Keys
  const [supabaseUrlInput, setSupabaseUrlInput] = useState('');
  const [supabaseKeyInput, setSupabaseKeyInput] = useState('');
  const [showConfigForm, setShowConfigForm] = useState(false);

  if (!isAuthModalOpen) return null;

  // 1. Handle Sign In
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone.trim() || !password) {
      showToast('Please enter your email/phone and password.', 'warning');
      return;
    }

    audioFX.playClickSound();
    setIsSubmitting(true);
    const { error } = await signInWithEmailPassword(emailOrPhone.trim(), password);
    setIsSubmitting(false);

    if (error) {
      showToast(error, 'error');
    } else {
      audioFX.playAchievementSound();
      showToast('Signed in successfully! 🚀');
      setIsAuthModalOpen(false);
    }
  };

  // 2. Handle Sign Up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Please enter your full name.', 'warning');
      return;
    }
    if (!emailOrPhone.trim()) {
      showToast('Please enter your email address or phone number.', 'warning');
      return;
    }
    if (password.length < 6) {
      showToast('Password must be at least 6 characters.', 'warning');
      return;
    }
    if (password !== confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }

    audioFX.playClickSound();
    setIsSubmitting(true);
    const { error } = await signUpWithEmail(name.trim(), emailOrPhone.trim(), password, targetExam);
    setIsSubmitting(false);

    if (error) {
      showToast(error, 'error');
    } else {
      audioFX.playAchievementSound();
      showToast(`Welcome to MockTracker, ${name.trim()}! 🎉`);
      setIsAuthModalOpen(false);
    }
  };

  // 3. Handle Forgot Password
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone.trim()) {
      showToast('Please enter your registered email or phone number.', 'warning');
      return;
    }

    audioFX.playClickSound();
    setIsSubmitting(true);
    const { error, success } = await resetPassword(emailOrPhone.trim());
    setIsSubmitting(false);

    if (error) {
      showToast(error, 'error');
    } else if (success) {
      setResetSuccessMessage(true);
      showToast('Password reset link sent to your email! ✉️');
    }
  };

  // 4. Handle 1-Click Google Sign In
  const handleGoogleSignIn = async () => {
    audioFX.playClickSound();
    setIsSubmitting(true);
    const { error } = await signInWithGoogle();
    setIsSubmitting(false);
    if (error) {
      showToast(error, 'error');
    }
  };

  // 5. Handle Guest Exploration
  const handleGuestExplore = () => {
    audioFX.playClickSound();
    continueAsGuest(name.trim() || 'Aspirant');
    showToast('Continuing as Guest. Data will be saved locally. 🚀');
  };

  // 6. Handle Custom DB Keys
  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (supabaseUrlInput.trim() && supabaseKeyInput.trim()) {
      saveCustomConfig(supabaseUrlInput.trim(), supabaseKeyInput.trim());
      showToast('Cloud database keys saved!');
      setShowConfigForm(false);
    }
  };

  const modalTitle = user 
    ? 'Aspirant Profile & Cloud Sync' 
    : authMode === 'signup' 
    ? 'Create Aspirant Profile' 
    : authMode === 'forgot_password' 
    ? 'Reset Password' 
    : 'Welcome Back Aspirant';

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={() => setIsAuthModalOpen(false)}
      title={modalTitle}
      maxWidth="max-w-md"
    >
      <div className="space-y-4 text-slate-800 dark:text-white">

        {/* ------------------------------------------------------------- */}
        {/* VIEW 1: LOGGED IN USER PROFILE HUB                            */}
        {/* ------------------------------------------------------------- */}
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
                      {user.isGuest ? 'Guest' : 'Active'}
                    </span>
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {user.email || user.phone || 'Local Offline Account'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  audioFX.playClickSound();
                  signOut();
                  showToast('Signed out of profile.', 'info');
                }}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            {/* Target Goal & Stats */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                <span className="text-slate-500 dark:text-slate-400 font-bold block text-[10px] uppercase tracking-wider">Target Goal</span>
                <span className="font-black text-sm text-slate-900 dark:text-white">{user.targetExam || 'SSC CGL'}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                <span className="text-slate-500 dark:text-slate-400 font-bold block text-[10px] uppercase tracking-wider">Aspirant Level</span>
                <span className="font-black text-sm text-[#00d2ff]">Lv.{gamification.level} • {gamification.totalXp} XP</span>
              </div>
            </div>

            {/* Live 2-Way Sync Status */}
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-200">
                  <span className={`w-2 h-2 rounded-full ${user.isGuest ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'}`} />
                  <span>{user.isGuest ? 'Local Device Storage' : 'PC & Mobile 2-Way Cloud Sync'}</span>
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-[11px]">
                  {user.isGuest ? 'Offline' : 'Connected'}
                </span>
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                {user.isGuest 
                  ? 'You are in Guest mode. Sign in with Google or Email to unlock instant live sync between your PC and Mobile.'
                  : 'All mocks and custom chapter drills sync automatically in real-time between your PC and Mobile phone.'
                }
              </p>
            </div>
          </div>
        ) : (
          /* ------------------------------------------------------------- */
          /* VIEW 2: AUTHENTICATION FLOW (SIGN IN / SIGN UP / FORGOT PW)   */
          /* ------------------------------------------------------------- */
          <div className="space-y-4">
            
            {/* Top Switcher Tabs (Sign In vs Sign Up) */}
            {authMode !== 'forgot_password' && (
              <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-100 dark:bg-[#050814]/80 border border-slate-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    audioFX.playClickSound();
                    setAuthMode('signin');
                  }}
                  className={`py-2 rounded-xl text-xs font-black transition-all ${
                    authMode === 'signin'
                      ? 'bg-gradient-to-r from-[#00d2ff] to-[#3b82f6] text-white shadow-glow-cyan'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    audioFX.playClickSound();
                    setAuthMode('signup');
                  }}
                  className={`py-2 rounded-xl text-xs font-black transition-all ${
                    authMode === 'signup'
                      ? 'bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] text-white shadow-glow-purple'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Create Account
                </button>
              </div>
            )}

            {/* 1. SIGN IN FORM */}
            {authMode === 'signin' && (
              <form onSubmit={handleSignIn} className="space-y-3.5 animate-fadeIn">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Email / Gmail or Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={emailOrPhone}
                      onChange={(e) => setEmailOrPhone(e.target.value)}
                      placeholder="e.g. sunny@gmail.com or 9876543210"
                      className="w-full pl-9.5 pr-3 py-2.5 rounded-xl bg-slate-100 dark:bg-[#050814] border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#00d2ff] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        audioFX.playClickSound();
                        setAuthMode('forgot_password');
                      }}
                      className="text-[11px] font-bold text-[#00d2ff] hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-9.5 pr-10 py-2.5 rounded-xl bg-slate-100 dark:bg-[#050814] border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#00d2ff] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(p => !p)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#0066ff] via-[#8b5cf6] to-[#d946ef] text-white font-extrabold text-xs shadow-cyber-cta hover:scale-[1.01] active:scale-98 transition-all flex items-center justify-center gap-2"
                >
                  <span>{isSubmitting ? 'Signing In...' : 'Sign In to Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* 2. SIGN UP FORM */}
            {authMode === 'signup' && (
              <form onSubmit={handleSignUp} className="space-y-3 animate-fadeIn">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Aspirant Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Sunny Rise"
                      className="w-full pl-9.5 pr-3 py-2.5 rounded-xl bg-slate-100 dark:bg-[#050814] border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#8b5cf6] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Target Competitive Exam
                  </label>
                  <select
                    value={targetExam}
                    onChange={(e) => setTargetExam(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-[#050814] border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#8b5cf6]"
                  >
                    <option value="SSC CGL">SSC CGL 2026</option>
                    <option value="SSC CHSL">SSC CHSL</option>
                    <option value="SSC MTS">SSC MTS</option>
                    <option value="RRB NTPC">RRB NTPC & Group D</option>
                    <option value="IBPS PO">IBPS / SBI PO</option>
                    <option value="Custom">Other Government Exam</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Email / Gmail or Mobile Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={emailOrPhone}
                      onChange={(e) => setEmailOrPhone(e.target.value)}
                      placeholder="e.g. sunny@gmail.com or 9876543210"
                      className="w-full pl-9.5 pr-3 py-2.5 rounded-xl bg-slate-100 dark:bg-[#050814] border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#8b5cf6] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                      Password
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 chars"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-[#050814] border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#8b5cf6]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                      Confirm
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-[#050814] border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#8b5cf6]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#8b5cf6] via-[#ec4899] to-[#00d2ff] text-white font-extrabold text-xs shadow-cyber-cta hover:scale-[1.01] active:scale-98 transition-all flex items-center justify-center gap-2 mt-2"
                >
                  <span>{isSubmitting ? 'Creating Profile...' : 'Create Aspirant Profile'}</span>
                  <Sparkles className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* 3. FORGOT PASSWORD FORM */}
            {authMode === 'forgot_password' && (
              <form onSubmit={handleForgotPassword} className="space-y-4 animate-fadeIn">
                <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-xs text-sky-800 dark:text-sky-300">
                  Enter your registered Gmail address or phone number to receive instructions to reset your password.
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Registered Email / Phone
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={emailOrPhone}
                      onChange={(e) => setEmailOrPhone(e.target.value)}
                      placeholder="e.g. sunny@gmail.com"
                      className="w-full pl-9.5 pr-3 py-2.5 rounded-xl bg-slate-100 dark:bg-[#050814] border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#00d2ff]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#0066ff] to-[#8b5cf6] text-white font-extrabold text-xs shadow-glow-blue active:scale-98 transition-all"
                >
                  {isSubmitting ? 'Sending Link...' : 'Send Password Reset Link'}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      audioFX.playClickSound();
                      setAuthMode('signin');
                    }}
                    className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-white"
                  >
                    ← Back to Sign In
                  </button>
                </div>
              </form>
            )}

            {/* Divider OR */}
            {authMode !== 'forgot_password' && (
              <>
                <div className="relative flex items-center justify-center my-2">
                  <div className="border-t border-slate-200 dark:border-white/10 w-full" />
                  <span className="bg-white dark:bg-[#0c1228] px-3 text-[10px] font-black uppercase text-slate-400 shrink-0">
                    OR
                  </span>
                  <div className="border-t border-slate-200 dark:border-white/10 w-full" />
                </div>

                {/* 1-Click Google Sign In */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 text-slate-900 font-extrabold text-xs border border-slate-300 dark:border-white/20 shadow-sm hover:shadow transition-all active:scale-98 flex items-center justify-center gap-2.5"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
                    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z" />
                    <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2s.7 5.5 1.9 7.9l3.7-2.9z" />
                    <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16.5C3.7 20.4 7.5 23.5 12 23.5z" />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                {/* Continue as Guest */}
                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={handleGuestExplore}
                    className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-[#00d2ff] transition-colors"
                  >
                    Skip for now • Continue as Guest →
                  </button>
                </div>
              </>
            )}

          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* VIEW 3: CUSTOM SUPABASE DATABASE KEYS (OPTIONAL SETTING)      */}
        {/* ------------------------------------------------------------- */}
        <div className="pt-2 border-t border-slate-200 dark:border-white/5">
          <button
            type="button"
            onClick={() => setShowConfigForm(prev => !prev)}
            className="text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:text-[#00d2ff] flex items-center justify-between w-full"
          >
            <span className="flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5" />
              <span>Custom Supabase Database Keys (Advanced)</span>
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
                  placeholder="https://zxgfjubhtmhaeiwmqrxo.supabase.co"
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
