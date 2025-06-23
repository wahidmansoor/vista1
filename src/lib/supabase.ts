import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types for handbook files
export interface HandbookFile {
  id: string;
  section: string;
  topic: string;
  title: string;
  content: string;
  format: 'markdown' | 'json';
  path?: string;
  created_at: string;
  updated_at?: string;
}

export type HandbookFileInsert = Omit<HandbookFile, 'id' | 'created_at' | 'updated_at'>;
export type HandbookFileUpdate = Partial<HandbookFileInsert>;
