import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Default Supabase Cloud Project Configuration for MockTracker 3D Pro
export const DEFAULT_SUPABASE_URL = 'https://zxgfjubhtmhaeiwmqrxo.supabase.co';
export const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4Z2ZqdWJodG1oYWVpd21xcnhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc1MzE0MDUsImV4cCI6MjEwMzEwNzQwNX0.lPoqjVUQwS15GZKWQW6PYYMecK3vKDj9BgFV1AHyBAc';

// 1. Check from Environment Variables, LocalStorage, or embedded defaults
export const getSupabaseConfig = () => {
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

  const localUrl = typeof window !== 'undefined' ? localStorage.getItem('mocktracker_supabase_url') : null;
  const localKey = typeof window !== 'undefined' ? localStorage.getItem('mocktracker_supabase_key') : null;

  const url = localUrl || envUrl || DEFAULT_SUPABASE_URL;
  const key = localKey || envKey || DEFAULT_SUPABASE_ANON_KEY;

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
