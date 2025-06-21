/**
 * Supabase Client Configuration
 * Simple and clean Supabase client initialization
 * 
 * Environment Variables Required:
 * - VITE_SUPABASE_URL: Supabase project URL
 * - VITE_SUPABASE_ANON_KEY: Supabase anonymous key
 * 
 * @version 3.0.0
 * @author OncoVista Treatment System
 */

import { createClient } from '@supabase/supabase-js';

// Validate environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing required environment variables: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

// Initialize Supabase client using environment variables
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Export both named and default exports for compatibility
export { supabase };
export default supabase;
