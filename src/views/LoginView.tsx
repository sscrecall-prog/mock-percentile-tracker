import React, { useState } from 'react';
import { Mail, User as UserIcon, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMocks } from '../context/MockContext';
import { audioFX } from '../utils/audioFX';
import { triggerCelebrationConfetti } from '../utils/confettiFX';
import { validateEmail, mapAuthError } from '../utils/authValidation';

// Modular Reusable Auth Components
import { AuthLayout } from '../components/auth/AuthLayout';
import { AuthHeader } from '../components/auth/AuthHeader';
import { AuthTextField } from '../components/auth/AuthTextField';
import { PasswordField } from '../components/auth/PasswordField';
import { PasswordStrengthIndicator } from '../components/auth/PasswordStrengthIndicator';
import { PrimaryAuthButton } from '../components/auth/PrimaryAuthButton';
import { SocialLoginButton } from '../components/auth/SocialLoginButton';
import { AuthErrorMessage } from '../components/auth/AuthErrorMessage';
import { TermsModal } from '../components/auth/TermsModal';

type AuthViewMode = 'login' | 'signup' | 'forgot_password' | 'reset_confirmation';

export const LoginView: React.FC = () => {
  const { 
    signInWithEmailPassword, 
    signUpWithEmail, 
    signInWithGoogle, 
    resetPassword,
    continueAsGuest 
  } = useAuth();
  
  const { showToast, settings } = useMocks();

  // Screen View State
  const [viewMode, setViewMode] = useState<AuthViewMode>('login');

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [targetExam, setTargetExam] = useState(settings.selectedExam || 'SSC CGL');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Status & Validation
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [termsModalType, setTermsModalType] = useState<'terms' | 'privacy' | null>(null);

  // Field Touched / Validation States
  const isEmailValid = validateEmail(email);
  const isPasswordValid = password.length >= 8;
  const isConfirmPasswordValid = password === confirmPassword && confirmPassword.length > 0;
  const isFullNameValid = fullName.trim().length > 0;

  // Clear errors upon switching tabs
  const handleSwitchMode = (mode: AuthViewMode) => {
    audioFX.playClickSound();
    setErrorMessage(null);
    setViewMode(mode);
  };

  // 1. Handle Login Submission
  const handleLoginSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }
    if (!isEmailValid) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);
    audioFX.playClickSound();

    const { error } = await signInWithEmailPassword(email.trim(), password);
    setIsSubmitting(false);

    if (error) {
      setErrorMessage(mapAuthError(error));
      audioFX.playClickSound();
    } else {
      audioFX.playAchievementSound();
      showToast('Welcome back! Signed in successfully 🚀');
    }
  };

  // 2. Handle Sign Up Submission
  const handleSignUpSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!isFullNameValid) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!isEmailValid) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    if (!agreeTerms) {
      setErrorMessage('Please agree to the Terms of Service & Privacy Policy.');
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);
    audioFX.playClickSound();

    const { error } = await signUpWithEmail(fullName.trim(), email.trim(), password, targetExam);
    setIsSubmitting(false);

    if (error) {
      setErrorMessage(mapAuthError(error));
      audioFX.playClickSound();
    } else {
      audioFX.playAchievementSound();
      triggerCelebrationConfetti();
      showToast(`Welcome to MockTracker, ${fullName.trim()}! 🎉`);
    }
  };

  // 3. Handle Forgot Password Submission
  const handleForgotPasswordSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!isEmailValid) {
      setErrorMessage('Please enter a valid registered email address.');
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);
    audioFX.playClickSound();

    const { error, success } = await resetPassword(email.trim());
    setIsSubmitting(false);

    if (error) {
      setErrorMessage(mapAuthError(error));
    } else if (success) {
      setViewMode('reset_confirmation');
      showToast('Password reset link sent to your email ✉️');
    }
  };

  // 4. Handle Google 1-Click
  const handleGoogleSignIn = async () => {
    audioFX.playClickSound();
    setErrorMessage(null);
    setIsSubmitting(true);
    const { error } = await signInWithGoogle();
    setIsSubmitting(false);

    if (error) {
      setErrorMessage(mapAuthError(error));
    }
  };

  // 5. Handle Guest Exploration
  const handleGuestExplore = () => {
    audioFX.playClickSound();
    continueAsGuest(fullName.trim() || 'Aspirant');
    showToast('Continuing as Guest. Your progress is saved locally 🚀');
  };

  return (
    <AuthLayout>
      {/* Dynamic Header */}
      <AuthHeader 
        title={
          viewMode === 'login' 
            ? 'Welcome Back' 
            : viewMode === 'signup' 
            ? 'Create Account' 
            : 'Forgot Password?'
        }
        subtitle={
          viewMode === 'login'
            ? 'Continue your learning journey'
            : viewMode === 'signup'
            ? 'Start tracking your preparation smarter'
            : 'Enter your registered email and we\'ll send you a password reset link.'
        }
      />

      {/* Inline Safe Error Alert Banner */}
      <div className="mb-4">
        <AuthErrorMessage message={errorMessage} />
      </div>

      {/* ============================================================= */}
      {/* 1. LOGIN SCREEN                                               */}
      {/* ============================================================= */}
      {viewMode === 'login' && (
        <form onSubmit={handleLoginSubmit} className="space-y-4 animate-fadeIn" noValidate>
          {/* Email Field */}
          <AuthTextField
            id="login-email"
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
            placeholder="Enter your email"
            icon={Mail}
            autoComplete="email"
            required
            disabled={isSubmitting}
          />

          {/* Password Field */}
          <div>
            <PasswordField
              id="login-password"
              label="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              disabled={isSubmitting}
            />

            {/* Forgot Password Link (Right-aligned) */}
            <div className="text-right mt-1.5">
              <button
                type="button"
                onClick={() => handleSwitchMode('forgot_password')}
                className="text-xs font-bold text-[#00d2ff] hover:underline cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#00d2ff]"
              >
                Forgot Password?
              </button>
            </div>
          </div>

          {/* Primary Login CTA Button (54px height) */}
          <div className="pt-1">
            <PrimaryAuthButton
              type="submit"
              isLoading={isSubmitting}
              disabled={!email.trim() || !password}
            >
              Log In
            </PrimaryAuthButton>
          </div>

          {/* Divider: OR CONTINUE WITH */}
          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-slate-200 dark:border-white/10 w-full" />
            <span className="bg-slate-100 dark:bg-[#0c1228] px-3 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-400 shrink-0">
              OR CONTINUE WITH
            </span>
            <div className="border-t border-slate-200 dark:border-white/10 w-full" />
          </div>

          {/* Social Google Login Button */}
          <SocialLoginButton 
            onClick={handleGoogleSignIn} 
            disabled={isSubmitting} 
            text="Continue with Google"
          />

          {/* Switch to Sign Up */}
          <div className="text-center pt-2">
            <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => handleSwitchMode('signup')}
                className="font-extrabold text-[#00d2ff] hover:underline cursor-pointer focus:outline-none"
              >
                Sign Up
              </button>
            </p>
          </div>

          {/* Continue as Guest */}
          <div className="text-center pt-1">
            <button
              type="button"
              onClick={handleGuestExplore}
              className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              Skip for now • Continue as Guest →
            </button>
          </div>
        </form>
      )}

      {/* ============================================================= */}
      {/* 2. SIGN UP SCREEN                                             */}
      {/* ============================================================= */}
      {viewMode === 'signup' && (
        <form onSubmit={handleSignUpSubmit} className="space-y-3.5 animate-fadeIn" noValidate>
          {/* Full Name */}
          <AuthTextField
            id="signup-fullname"
            label="Full Name"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
            placeholder="Enter your full name"
            icon={UserIcon}
            autoComplete="name"
            required
            disabled={isSubmitting}
          />

          {/* Target Exam Goal Selector */}
          <div className="space-y-1.5 text-left">
            <label htmlFor="signup-exam" className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Target Competitive Exam <span className="text-rose-500">*</span>
            </label>
            <select
              id="signup-exam"
              value={targetExam}
              onChange={(e) => setTargetExam(e.target.value as any)}
              disabled={isSubmitting}
              className="w-full px-3.5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all outline-none
                bg-slate-100 dark:bg-[#050814]/90 light:bg-slate-50 border border-slate-200 dark:border-white/10
                text-slate-900 dark:text-white focus:border-[#8b5cf6] focus:ring-2 focus:ring-[#8b5cf6]/20"
            >
              <option value="SSC CGL">SSC CGL 2026</option>
              <option value="SSC CHSL">SSC CHSL</option>
              <option value="SSC MTS">SSC MTS</option>
              <option value="RRB NTPC">RRB NTPC & Group D</option>
              <option value="IBPS PO">IBPS / SBI PO</option>
              <option value="Custom">Other Government Exam</option>
            </select>
          </div>

          {/* Email Address */}
          <AuthTextField
            id="signup-email"
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
            placeholder="Enter your email"
            icon={Mail}
            autoComplete="email"
            required
            disabled={isSubmitting}
          />

          {/* Password with Strength Indicator */}
          <div>
            <PasswordField
              id="signup-password"
              label="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              placeholder="Create a password"
              autoComplete="new-password"
              required
              disabled={isSubmitting}
            />
            <PasswordStrengthIndicator password={password} />
          </div>

          {/* Confirm Password */}
          <div>
            <PasswordField
              id="signup-confirm-password"
              label="Confirm Password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              placeholder="Confirm your password"
              autoComplete="new-password"
              required
              disabled={isSubmitting}
              error={confirmPassword && password !== confirmPassword ? "Passwords don't match" : undefined}
            />
          </div>

          {/* Terms & Privacy Checkbox */}
          <div className="flex items-start gap-2.5 pt-1 text-left">
            <input
              type="checkbox"
              id="terms-checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              disabled={isSubmitting}
              className="w-4 h-4 mt-0.5 rounded accent-[#8b5cf6] cursor-pointer"
            />
            <label htmlFor="terms-checkbox" className="text-xs text-slate-600 dark:text-slate-400 select-none">
              I agree to the{' '}
              <button
                type="button"
                onClick={() => setTermsModalType('terms')}
                className="font-bold text-[#00d2ff] hover:underline cursor-pointer"
              >
                Terms of Service
              </button>{' '}
              and{' '}
              <button
                type="button"
                onClick={() => setTermsModalType('privacy')}
                className="font-bold text-[#00d2ff] hover:underline cursor-pointer"
              >
                Privacy Policy
              </button>
            </label>
          </div>

          {/* Create Account Primary Button */}
          <div className="pt-2">
            <PrimaryAuthButton
              type="submit"
              isLoading={isSubmitting}
              disabled={!isFullNameValid || !isEmailValid || password.length < 8 || password !== confirmPassword || !agreeTerms}
            >
              Create Account
            </PrimaryAuthButton>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-3">
            <div className="border-t border-slate-200 dark:border-white/10 w-full" />
            <span className="bg-slate-100 dark:bg-[#0c1228] px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 shrink-0">
              OR
            </span>
            <div className="border-t border-slate-200 dark:border-white/10 w-full" />
          </div>

          {/* Google Sign Up */}
          <SocialLoginButton 
            onClick={handleGoogleSignIn} 
            disabled={isSubmitting} 
            text="Sign up with Google"
          />

          {/* Switch to Login */}
          <div className="text-center pt-2">
            <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => handleSwitchMode('login')}
                className="font-extrabold text-[#8b5cf6] hover:underline cursor-pointer focus:outline-none"
              >
                Log In
              </button>
            </p>
          </div>
        </form>
      )}

      {/* ============================================================= */}
      {/* 3. FORGOT PASSWORD SCREEN                                     */}
      {/* ============================================================= */}
      {viewMode === 'forgot_password' && (
        <form onSubmit={handleForgotPasswordSubmit} className="space-y-4 animate-fadeIn" noValidate>
          <AuthTextField
            id="forgot-email"
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
            placeholder="Enter your registered email"
            icon={Mail}
            autoComplete="email"
            required
            disabled={isSubmitting}
          />

          <PrimaryAuthButton
            type="submit"
            isLoading={isSubmitting}
            disabled={!isEmailValid}
          >
            Send Reset Link
          </PrimaryAuthButton>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => handleSwitchMode('login')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </button>
          </div>
        </form>
      )}

      {/* ============================================================= */}
      {/* 4. RESET CONFIRMATION SUCCESS STATE                           */}
      {/* ============================================================= */}
      {viewMode === 'reset_confirmation' && (
        <div className="space-y-4 text-center animate-fadeIn py-2">
          <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 flex items-center justify-center mx-auto shadow-glow-cyan">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              Check your email
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
              We've sent password reset instructions to <b className="text-slate-900 dark:text-white">{email}</b>.
            </p>
          </div>

          <div className="pt-3">
            <PrimaryAuthButton
              type="button"
              onClick={() => handleSwitchMode('login')}
            >
              Back to Login
            </PrimaryAuthButton>
          </div>
        </div>
      )}

      {/* Terms & Privacy Modal */}
      {termsModalType && (
        <TermsModal
          isOpen={Boolean(termsModalType)}
          onClose={() => setTermsModalType(null)}
          type={termsModalType}
        />
      )}
    </AuthLayout>
  );
};
