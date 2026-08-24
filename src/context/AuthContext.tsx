import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { getSupabase, getSupabaseConfig, resetSupabaseClient } from '../services/supabaseClient';

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  targetExam?: string;
  isGuest?: boolean;
}

export type AuthMode = 'signin' | 'signup' | 'forgot_password' | 'profile';

interface AuthContextType {
  user: UserProfile | null;
  rawUser: User | null;
  session: Session | null;
  isLoading: boolean;
  isCloudConfigured: boolean;
  isSyncing: boolean;
  setIsSyncing: (syncing: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authMode: AuthMode;
  setAuthMode: (mode: AuthMode) => void;
  openAuth: (mode?: AuthMode) => void;
  signUpWithEmail: (name: string, emailOrPhone: string, password: string, targetExam?: string) => Promise<{ error?: string }>;
  signInWithEmailPassword: (emailOrPhone: string, password: string) => Promise<{ error?: string }>;
  signInWithGoogle: () => Promise<{ error?: string }>;
  resetPassword: (emailOrPhone: string) => Promise<{ error?: string; success?: boolean }>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  continueAsGuest: (name?: string) => void;
  signOut: () => Promise<void>;
  saveCustomConfig: (url: string, key: string) => void;
  clearCustomConfig: () => void;
}

const LOCAL_USER_KEY = 'mocktracker_user_profile';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rawUser, setRawUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<AuthMode>('signin');
  const [isCloudConfigured, setIsCloudConfigured] = useState<boolean>(() => getSupabaseConfig().isConfigured);

  // Local user profile state (for offline / custom profile)
  const [localProfile, setLocalProfile] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Effective user profile
  const user: UserProfile | null = React.useMemo(() => {
    if (rawUser) {
      return {
        id: rawUser.id,
        email: rawUser.email || undefined,
        phone: rawUser.phone || undefined,
        name: rawUser.user_metadata?.full_name || rawUser.user_metadata?.name || localProfile?.name || rawUser.email?.split('@')[0] || 'Aspirant',
        avatarUrl: rawUser.user_metadata?.avatar_url || rawUser.user_metadata?.picture || localProfile?.avatarUrl || undefined,
        targetExam: rawUser.user_metadata?.target_exam || localProfile?.targetExam || 'SSC CGL',
        isGuest: false
      };
    }
    return localProfile;
  }, [rawUser, localProfile]);

  // Open Auth helper
  const openAuth = useCallback((mode: AuthMode = 'signin') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  }, []);

  // Initialize and listen to Auth state changes
  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      setIsLoading(false);
      setIsCloudConfigured(false);
      return;
    }

    setIsCloudConfigured(true);

    // 1. Check existing active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setRawUser(session?.user ?? null);
      setIsLoading(false);
    }).catch(() => {
      setIsLoading(false);
    });

    // 2. Subscribe to realtime auth changes (sign in, sign out, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setRawUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isCloudConfigured]);

  // 1. Sign Up with Email / Phone & Password
  const signUpWithEmail = useCallback(async (name: string, emailOrPhone: string, password: string, targetExam = 'SSC CGL'): Promise<{ error?: string }> => {
    const isEmail = emailOrPhone.includes('@');
    const email = isEmail ? emailOrPhone.trim().toLowerCase() : `${emailOrPhone.replace(/\D/g, '')}@mocktracker.app`;

    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name.trim(),
              target_exam: targetExam,
              phone: !isEmail ? emailOrPhone : undefined,
            },
          },
        });

        if (error) throw error;
        if (data.user) {
          setRawUser(data.user);
          const prof: UserProfile = {
            id: data.user.id,
            name: name.trim(),
            email: isEmail ? email : undefined,
            phone: !isEmail ? emailOrPhone : undefined,
            targetExam,
            isGuest: false,
          };
          setLocalProfile(prof);
          localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(prof));
        }
        return {};
      } catch (err: any) {
        console.error('Sign up error:', err);
        return { error: err.message || 'Failed to create account.' };
      }
    } else {
      // Offline fallback: create local user account
      const prof: UserProfile = {
        id: `user-${Date.now()}`,
        name: name.trim(),
        email: isEmail ? email : undefined,
        phone: !isEmail ? emailOrPhone : undefined,
        targetExam,
        isGuest: false,
      };
      setLocalProfile(prof);
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(prof));
      return {};
    }
  }, []);

  // 2. Sign In with Email / Phone & Password
  const signInWithEmailPassword = useCallback(async (emailOrPhone: string, password: string): Promise<{ error?: string }> => {
    const isEmail = emailOrPhone.includes('@');
    const email = isEmail ? emailOrPhone.trim().toLowerCase() : `${emailOrPhone.replace(/\D/g, '')}@mocktracker.app`;

    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        if (data.user) {
          setRawUser(data.user);
        }
        return {};
      } catch (err: any) {
        console.error('Sign in error:', err);
        return { error: err.message || 'Invalid email/phone or password.' };
      }
    } else {
      // Local fallback
      if (localProfile) {
        return {};
      }
      return { error: 'Cloud database is not connected. Please enter project keys or continue as Guest.' };
    }
  }, [localProfile]);

  // 3. Sign In with Google OAuth
  const signInWithGoogle = useCallback(async (): Promise<{ error?: string }> => {
    const supabase = getSupabase();
    if (!supabase) {
      return { error: 'Supabase is not configured yet. Please enter project keys in settings.' };
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;
      return {};
    } catch (err: any) {
      console.error('Google Sign In Error:', err);
      return { error: err.message || 'Failed to initialize Google Sign In' };
    }
  }, []);

  // 4. Forgot Password / Reset
  const resetPassword = useCallback(async (emailOrPhone: string): Promise<{ error?: string; success?: boolean }> => {
    const isEmail = emailOrPhone.includes('@');
    const email = isEmail ? emailOrPhone.trim().toLowerCase() : `${emailOrPhone.replace(/\D/g, '')}@mocktracker.app`;

    const supabase = getSupabase();
    if (supabase) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: typeof window !== 'undefined' ? `${window.location.origin}?mode=reset` : undefined,
        });
        if (error) throw error;
        return { success: true };
      } catch (err: any) {
        console.error('Password reset error:', err);
        return { error: err.message || 'Failed to send reset link.' };
      }
    } else {
      return { success: true };
    }
  }, []);

  // 5. Update Profile
  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    setLocalProfile((prev) => {
      const updated = prev ? { ...prev, ...updates } : { id: `user-${Date.now()}`, name: 'Aspirant', ...updates };
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(updated));
      return updated;
    });

    const supabase = getSupabase();
    if (supabase && rawUser) {
      try {
        await supabase.auth.updateUser({
          data: {
            full_name: updates.name,
            target_exam: updates.targetExam,
            avatar_url: updates.avatarUrl,
          },
        });
      } catch (err) {
        console.error('Error updating user profile on cloud:', err);
      }
    }
  }, [rawUser]);

  // 6. Continue as Guest
  const continueAsGuest = useCallback((name = 'Sunny Rise') => {
    const guestProf: UserProfile = {
      id: `guest-${Date.now()}`,
      name,
      targetExam: 'SSC CGL',
      isGuest: true,
    };
    setLocalProfile(guestProf);
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(guestProf));
    setIsAuthModalOpen(false);
  }, []);

  // 7. Sign Out
  const signOut = useCallback(async () => {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setRawUser(null);
    setSession(null);
    setLocalProfile(null);
    localStorage.removeItem(LOCAL_USER_KEY);
    setAuthMode('signin');
  }, []);

  // 8. Custom Supabase Config
  const saveCustomConfig = useCallback((url: string, key: string) => {
    const cleanUrl = url.trim();
    const cleanKey = key.trim();
    if (cleanUrl && cleanKey) {
      localStorage.setItem('mocktracker_supabase_url', cleanUrl);
      localStorage.setItem('mocktracker_supabase_key', cleanKey);
      resetSupabaseClient();
      setIsCloudConfigured(true);
    }
  }, []);

  const clearCustomConfig = useCallback(() => {
    localStorage.removeItem('mocktracker_supabase_url');
    localStorage.removeItem('mocktracker_supabase_key');
    resetSupabaseClient();
    setIsCloudConfigured(false);
    setRawUser(null);
    setSession(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        rawUser,
        session,
        isLoading,
        isCloudConfigured,
        isSyncing,
        setIsSyncing,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authMode,
        setAuthMode,
        openAuth,
        signUpWithEmail,
        signInWithEmailPassword,
        signInWithGoogle,
        resetPassword,
        updateProfile,
        continueAsGuest,
        signOut,
        saveCustomConfig,
        clearCustomConfig,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
