import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Protocol } from '@/types/protocol';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = () => {
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase environment variables.');
    throw new Error('Supabase credentials are not configured.');
  }

  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(supabaseUrl, supabaseKey, {
        auth: {
          detectSessionInUrl: true,
          persistSession: true,
          autoRefreshToken: true,
        },
      });
      console.info('✅ Supabase client initialized');
    } catch (err) {
      console.error('❌ Failed to create Supabase client:', err);
      throw new Error('Failed to initialize Supabase client');
    }
  }

  return supabaseInstance;
};

// For backward compatibility with existing code
export const supabase = getSupabase();

// Helper to safely parse JSONB fields (handles string or object)
function safeJsonParse<T>(data: any, fallback: T): T {
  if (data == null) return fallback;
  if (typeof data === 'object') return data as T;
  if (typeof data === 'string') {
    try {
      return JSON.parse(data) as T;
    } catch {
      return fallback;
    }
  }
  return fallback;
}

// Data transformation utility for Protocol
export const toProtocol = (dbProtocol: any): Protocol => {
  // Parse JSONB fields safely
  const precautions = safeJsonParse(dbProtocol.precautions, []);
  const eligibility = safeJsonParse(dbProtocol.eligibility, { inclusion_criteria: [], exclusion_criteria: [] });
  const treatment = safeJsonParse(dbProtocol.treatment, { drugs: [] });

  return {
    ...dbProtocol,
    precautions: (precautions || []).map((p: any) =>
      typeof p === 'string' ? { note: p } : p
    ),
    eligibility: eligibility
      ? {
          inclusion_criteria: (eligibility.inclusion_criteria || []).map((c: any) =>
            typeof c === 'string' ? { criterion: c } : c
          ),
          exclusion_criteria: (eligibility.exclusion_criteria || []).map((c: any) =>
            typeof c === 'string' ? { criterion: c } : c
          ),
        }
      : undefined,
    treatment: treatment
      ? {
          drugs: (treatment.drugs || []).map((d: any) => ({
            ...d,
            special_notes: Array.isArray(d.special_notes)
              ? d.special_notes.map((n: any) => (typeof n === 'string' ? n : n.note))
              : [],
          })),
        }
      : undefined,
  };
};
