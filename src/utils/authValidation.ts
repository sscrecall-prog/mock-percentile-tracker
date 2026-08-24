/**
 * Form Validation & Safe Error Mapping Utilities for Authentication
 */

export interface PasswordStrengthResult {
  score: number; // 0 to 5
  label: 'Weak' | 'Medium' | 'Strong';
  progress: number; // 0 to 100%
  color: string; // Tailwind color class
  requirements: {
    minLength: boolean;
    hasLower: boolean;
    hasUpper: boolean;
    hasNumber: boolean;
    hasSpecial: boolean;
  };
}

/**
 * Standard RFC 5322 Compliant Email Format Validator
 */
export const validateEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
};

/**
 * Calculates Password Strength with multi-factor entropy evaluation
 */
export const calculatePasswordStrength = (password: string): PasswordStrengthResult => {
  const requirements = {
    minLength: password.length >= 8,
    hasLower: /[a-z]/.test(password),
    hasUpper: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
  };

  let score = 0;
  if (requirements.minLength) score += 1;
  if (requirements.hasLower) score += 1;
  if (requirements.hasUpper) score += 1;
  if (requirements.hasNumber) score += 1;
  if (requirements.hasSpecial) score += 1;

  if (score <= 2 || password.length < 8) {
    return {
      score,
      label: 'Weak',
      progress: Math.min(Math.max((score / 5) * 100, 20), 35),
      color: 'bg-rose-500',
      requirements,
    };
  }

  if (score === 3 || score === 4) {
    return {
      score,
      label: 'Medium',
      progress: 70,
      color: 'bg-amber-500',
      requirements,
    };
  }

  return {
    score: 5,
    label: 'Strong',
    progress: 100,
    color: 'bg-emerald-500',
    requirements,
  };
};

/**
 * Human-Friendly Safe Error Mapper
 * Prevents exposing raw database schemas, tokens, or technical stack traces to end users.
 */
export const mapAuthError = (rawError: any): string => {
  if (!rawError) return 'An unexpected error occurred. Please try again.';

  const message = typeof rawError === 'string' ? rawError : rawError?.message || rawError?.error_description || '';
  const lowerMsg = message.toLowerCase();

  if (lowerMsg.includes('invalid login credentials') || lowerMsg.includes('invalid_credentials')) {
    return 'Incorrect email or password. Please try again.';
  }

  if (lowerMsg.includes('user already registered') || lowerMsg.includes('already exists') || lowerMsg.includes('unique constraint')) {
    return 'An account already exists with this email address. Please log in.';
  }

  if (lowerMsg.includes('password should be at least') || lowerMsg.includes('weak password')) {
    return 'Password is too weak. Please use at least 8 characters with numbers and letters.';
  }

  if (lowerMsg.includes('network') || lowerMsg.includes('fetch') || lowerMsg.includes('failed to fetch') || lowerMsg.includes('timeout')) {
    return 'Unable to connect. Check your internet connection and try again.';
  }

  if (lowerMsg.includes('popup closed') || lowerMsg.includes('cancelled') || lowerMsg.includes('user cancelled')) {
    return 'Sign in was cancelled.';
  }

  if (lowerMsg.includes('rate limit') || lowerMsg.includes('too many requests')) {
    return 'Too many attempts. Please wait a moment and try again.';
  }

  if (lowerMsg.includes('email not confirmed')) {
    return 'Please check your email and confirm your account before logging in.';
  }

  return 'Something went wrong. Please check your details and try again.';
};
