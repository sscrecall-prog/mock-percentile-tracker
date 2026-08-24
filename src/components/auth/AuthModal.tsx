import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Cloud, 
  LogOut, 
  Smartphone, 
  ShieldCheck, 
  User as UserIcon, 
  Mail, 
  ArrowRight, 
  Sparkles, 
  Key, 
  CheckCircle2, 
  Edit3, 
  RotateCcw,
  Lock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useMocks } from '../../context/MockContext';
import { audioFX } from '../../utils/audioFX';
import { triggerCelebrationConfetti } from '../../utils/confettiFX';
import { Modal } from '../common/Modal';

export const AuthModal: React.FC = () => {
  const { 
    user, 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authMode, 
    setAuthMode,
    pendingOtp,
    otpCountdown,
    sendPhoneOtp,
    verifyPhoneOtp,
    resendPhoneOtp,
    signInWithGoogle,
    continueAsGuest,
    signOut
  } = useAuth();
  
  const { showToast, gamification, settings } = useMocks();

  // Form states
  const [phoneNumber, setPhoneNumber] = useState('');
  const [aspirantName, setAspirantName] = useState('');
  const [targetExam, setTargetExam] = useState(settings.selectedExam || 'SSC CGL');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // 6-digit OTP array state
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first OTP box when entering OTP view
  useEffect(() => {
    if (authMode === 'otp_verify') {
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 150);
    }
  }, [authMode]);

  if (!isAuthModalOpen) return null;

  // 1. Handle Send OTP
  const handleSendOtp = async (e: React.FormEvent, isSignUp: boolean) => {
    e.preventDefault();
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      showToast('Please enter a valid 10-digit mobile number.', 'warning');
      return;
    }

    if (isSignUp && !aspirantName.trim()) {
      showToast('Please enter your full name.', 'warning');
      return;
    }

    audioFX.playClickSound();
    setIsSendingOtp(true);
    const { error, otp } = await sendPhoneOtp(
      cleanPhone, 
      isSignUp ? aspirantName.trim() : '', 
      targetExam, 
      isSignUp
    );
    setIsSendingOtp(false);

    if (error) {
      showToast(error, 'error');
    } else {
      audioFX.playSuccessChime();
      showToast(`6-Digit OTP sent to +91 ${cleanPhone.slice(-10)}! 📲`);
      setOtpDigits(['', '', '', '', '', '']);
    }
  };

  // 2. Handle OTP Input Typing (Auto-jump to next box)
  const handleOtpDigitChange = (index: number, value: string) => {
    const cleanVal = value.replace(/\D/g, '').slice(-1);
    const nextDigits = [...otpDigits];
    nextDigits[index] = cleanVal;
    setOtpDigits(nextDigits);

    audioFX.playClickSound();

    // Auto-focus next input
    if (cleanVal && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    // Auto-verify if all 6 digits are typed
    const fullOtp = nextDigits.join('');
    if (fullOtp.length === 6) {
      handleVerify(fullOtp);
    }
  };

  // Handle Backspace navigation
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Handle Paste 6-digit OTP
  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData.length > 0) {
      const nextDigits = ['', '', '', '', '', ''];
      pastedData.split('').forEach((char, i) => {
        if (i < 6) nextDigits[i] = char;
      });
      setOtpDigits(nextDigits);
      if (pastedData.length === 6) {
        handleVerify(pastedData);
      } else {
        const nextFocusIndex = Math.min(pastedData.length, 5);
        otpInputRefs.current[nextFocusIndex]?.focus();
      }
    }
  };

  // 3. Handle Verify OTP
  const handleVerify = async (otpToVerify?: string) => {
    const finalOtp = otpToVerify || otpDigits.join('');
    if (finalOtp.length !== 6) {
      showToast('Please enter all 6 digits of the OTP.', 'warning');
      return;
    }

    setIsVerifying(true);
    const { error } = await verifyPhoneOtp(finalOtp);
    setIsVerifying(false);

    if (error) {
      showToast(error, 'error');
      audioFX.playClickSound();
    } else {
      audioFX.playAchievementSound();
      triggerCelebrationConfetti();
      showToast('Phone Number Verified! Welcome to MockTracker 🎉');
    }
  };

  // 4. Handle Resend OTP
  const handleResend = async () => {
    if (otpCountdown > 0) return;
    audioFX.playClickSound();
    const { error, otp } = await resendPhoneOtp();
    if (error) {
      showToast(error, 'error');
    } else {
      showToast('New 6-Digit OTP sent! 📲');
      setOtpDigits(['', '', '', '', '', '']);
      otpInputRefs.current[0]?.focus();
    }
  };

  // 5. Handle Google 1-Click
  const handleGoogleSignIn = async () => {
    audioFX.playClickSound();
    const { error } = await signInWithGoogle();
    if (error) showToast(error, 'error');
  };

  // Modal Title
  const modalTitle = user
    ? 'Aspirant Profile Hub'
    : authMode === 'otp_verify'
    ? 'Enter 6-Digit OTP'
    : authMode === 'phone_signup'
    ? 'Create Aspirant Account'
    : 'Sign In with Mobile Number';

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={() => setIsAuthModalOpen(false)}
      title={modalTitle}
      maxWidth="max-w-md"
    >
      <div className="space-y-4 text-slate-800 dark:text-white">

        {/* ============================================================= */}
        {/* VIEW 1: LOGGED IN PROFILE VIEW                                */}
        {/* ============================================================= */}
        {user ? (
          <div className="space-y-4 animate-fadeIn">
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
                      Verified
                    </span>
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {user.phone ? `+91 ${user.phone}` : user.email || 'Aspirant Account'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  audioFX.playClickSound();
                  signOut();
                  showToast('Signed out successfully.', 'info');
                }}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

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

            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Real-Time PC & Mobile 2-Way Sync is Active!</span>
            </div>
          </div>
        ) : (
          /* ============================================================= */
          /* VIEW 2: 6-DIGIT OTP VERIFICATION SCREEN                       */
          /* ============================================================= */
          authMode === 'otp_verify' && pendingOtp ? (
            <div className="space-y-4 animate-fadeIn">
              
              {/* Header Info */}
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#00d2ff] via-[#8b5cf6] to-[#ec4899] flex items-center justify-center mx-auto text-white shadow-glow-cyan mb-2">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h3 className="font-black text-sm text-slate-900 dark:text-white">
                  Verification Code Sent
                </h3>
                <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <span>Code sent to <b className="text-slate-900 dark:text-white">{pendingOtp.formattedPhone}</b></span>
                  <button
                    type="button"
                    onClick={() => {
                      audioFX.playClickSound();
                      setAuthMode(pendingOtp.isSignUp ? 'phone_signup' : 'phone_login');
                    }}
                    className="text-[#00d2ff] hover:underline flex items-center gap-0.5 ml-1"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>

              {/* Instant Test OTP Notification Pill */}
              <div className="p-2.5 rounded-xl bg-gradient-to-r from-[#00d2ff]/10 via-[#8b5cf6]/10 to-[#ec4899]/10 border border-[#00d2ff]/30 text-center">
                <p className="text-[11px] font-bold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#00d2ff]" />
                  <span>Your 6-digit OTP code is: <b className="text-base font-mono font-black text-[#00d2ff] tracking-widest">{pendingOtp.generatedOtp}</b></span>
                </p>
              </div>

              {/* 6-DIGIT OTP BOXES */}
              <div className="flex items-center justify-center gap-2 sm:gap-2.5 py-1">
                {otpDigits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpInputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpDigitChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onPaste={index === 0 ? handleOtpPaste : undefined}
                    className={`w-11 h-13 sm:w-12 sm:h-14 text-center font-mono text-xl sm:text-2xl font-black rounded-2xl border transition-all outline-none ${
                      digit 
                        ? 'border-[#00d2ff] bg-[#00d2ff]/10 text-slate-900 dark:text-white shadow-[0_0_12px_rgba(0,210,255,0.35)]' 
                        : 'border-slate-300 dark:border-white/15 bg-slate-100 dark:bg-[#050814] text-slate-900 dark:text-white focus:border-[#8b5cf6] focus:shadow-glow-purple'
                    }`}
                  />
                ))}
              </div>

              {/* Verify CTA Button */}
              <button
                type="button"
                onClick={() => handleVerify()}
                disabled={isVerifying}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#0066ff] via-[#8b5cf6] to-[#d946ef] text-white font-extrabold text-xs shadow-cyber-cta hover:scale-[1.01] active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <span>{isVerifying ? 'Verifying OTP...' : 'Verify & Enter App ➔'}</span>
              </button>

              {/* Resend OTP Timer & Actions */}
              <div className="flex items-center justify-between text-xs pt-1 px-1">
                <button
                  type="button"
                  onClick={() => {
                    audioFX.playClickSound();
                    setAuthMode(pendingOtp.isSignUp ? 'phone_signup' : 'phone_login');
                  }}
                  className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-semibold"
                >
                  ← Change Number
                </button>

                {otpCountdown > 0 ? (
                  <span className="text-slate-400 dark:text-slate-500 font-medium">
                    Resend OTP in <b className="text-[#00d2ff]">{otpCountdown}s</b>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="text-[#00d2ff] font-bold hover:underline flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Resend OTP Now</span>
                  </button>
                )}
              </div>

            </div>
          ) : (
            /* ============================================================= */
            /* VIEW 3: PHONE NUMBER INPUT (LOGIN / SIGN UP TABS)             */
            /* ============================================================= */
            <div className="space-y-4 animate-fadeIn">
              
              {/* Top Tabs: Login vs Sign Up */}
              <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-100 dark:bg-[#050814]/80 border border-slate-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    audioFX.playClickSound();
                    setAuthMode('phone_login');
                  }}
                  className={`py-2 rounded-xl text-xs font-black transition-all ${
                    authMode === 'phone_login'
                      ? 'bg-gradient-to-r from-[#00d2ff] to-[#3b82f6] text-white shadow-glow-cyan'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Phone Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    audioFX.playClickSound();
                    setAuthMode('phone_signup');
                  }}
                  className={`py-2 rounded-xl text-xs font-black transition-all ${
                    authMode === 'phone_signup'
                      ? 'bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] text-white shadow-glow-purple'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Sign Up (New)
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={(e) => handleSendOtp(e, authMode === 'phone_signup')} className="space-y-3.5">
                
                {/* Sign Up Exclusive Fields */}
                {authMode === 'phone_signup' && (
                  <>
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
                          value={aspirantName}
                          onChange={(e) => setAspirantName(e.target.value)}
                          placeholder="e.g. Sunny Rise"
                          className="w-full pl-9.5 pr-3 py-2.5 rounded-xl bg-slate-100 dark:bg-[#050814] border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#8b5cf6] transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                        Target Exam Goal
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
                        <option value="Custom">Other Competitive Exam</option>
                      </select>
                    </div>
                  </>
                )}

                {/* Mobile Number Field (With +91 Flag Badge) */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Mobile Phone Number
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-2.5 rounded-xl bg-slate-200 dark:bg-white/10 border border-slate-300 dark:border-white/10 text-xs font-black text-slate-900 dark:text-white shrink-0 flex items-center gap-1.5">
                      <span>🇮🇳</span>
                      <span>+91</span>
                    </div>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 10-digit mobile number"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-[#050814] border border-slate-200 dark:border-white/10 text-xs font-semibold tracking-wider outline-none focus:border-[#00d2ff] transition-colors"
                    />
                  </div>
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={isSendingOtp}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#0066ff] via-[#8b5cf6] to-[#d946ef] text-white font-extrabold text-xs shadow-cyber-cta hover:scale-[1.01] active:scale-98 transition-all flex items-center justify-center gap-2 mt-2"
                >
                  <span>{isSendingOtp ? 'Generating OTP...' : 'Send 6-Digit OTP ➔'}</span>
                </button>
              </form>

              {/* Divider OR */}
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
                  onClick={() => {
                    audioFX.playClickSound();
                    continueAsGuest(aspirantName.trim() || 'Aspirant');
                    showToast('Continuing as Guest. Data saved locally.');
                  }}
                  className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-[#00d2ff] transition-colors"
                >
                  Skip for now • Continue as Guest →
                </button>
              </div>

            </div>
          )
        )}

      </div>
    </Modal>
  );
};
