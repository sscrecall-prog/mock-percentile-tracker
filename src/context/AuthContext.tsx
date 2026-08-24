import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { getSupabase, getSupabaseConfig, resetSupabaseClient } from '../services/supabaseClient';

export interface UserProfile {
  id: string;
  email?: string;
  name?: string;
  avatarUrl?: string;
}

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
  signInWithGoogle: () => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  saveCustomConfig: (url: string, key: string) => void;
  clearCustomConfig: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rawUser, setRawUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isCloudConfigured, setIsCloudConfigured] = useState<boolean>(() => getSupabaseConfig().isConfigured);

  // Parse user profile from raw Supabase User
  const user: UserProfile | null = React.useMemo(() => {
    if (!rawUser) return null;
    return {
      id: rawUser.id,
      email: rawUser.email || undefined,
      name: rawUser.user_metadata?.full_name || rawUser.user_metadata?.name || rawUser.email?.split('@')[0] || 'Aspirant',
      avatarUrl: rawUser.user_metadata?.avatar_url || rawUser.user_metadata?.picture || undefined
    };
  }, [rawUser]);

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

  // Sign In with Google
  const signInWithGoogle = useCallback(async (): Promise<{ error?: string }> => {
    const supabase = getSupabase();
    if (!supabase) {
      return { error: 'Supabase is not configured yet. Please enter your project credentials.' };
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

  // Sign Out
  const signOut = useCallback(async () => {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setRawUser(null);
    setSession(null);
  }, []);

  // Save custom Supabase credentials directly in browser
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

  // Clear custom credentials
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
        signInWithGoogle,
        signOut,
        saveCustomConfig,
        clearCustomConfig
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
