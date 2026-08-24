import { createClient, SupabaseClient } from '@supabase/supabase-js';

// 1. Check from Environment Variables or LocalStorage (for custom keys in UI)
export const getSupabaseConfig = () => {
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

  const localUrl = typeof window !== 'undefined' ? localStorage.getItem('mocktracker_supabase_url') : null;
  const localKey = typeof window !== 'undefined' ? localStorage.getItem('mocktracker_supabase_key') : null;

  const url = localUrl || envUrl || '';
  const key = localKey || envKey || '';

  const isConfigured = Boolean(url && key && url.startsWith('http'));

  return { url, key, isConfigured };
};

let clientInstance: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient | null => {
  const { url, key, isConfigured } = getSupabaseConfig();

  if (!isConfigured) return null;

  if (!clientInstance) {
    clientInstance = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
  }

  return clientInstance;
};

export const resetSupabaseClient = () => {
  clientInstance = null;
};
