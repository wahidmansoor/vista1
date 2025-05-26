// Required environment variables for production
const requiredEnvVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
] as const;

// Optional environment variables with warnings
const optionalEnvVars = [
  'VITE_OPENAI_API_KEY',
  'VITE_GEMINI_API_KEY'
] as const;

/**
 * Validates required environment variables are present
 * Warns about missing optional variables but doesn't throw
 */
export function validateEnv(): void {
  let hasRequiredVars = true;
  
  // Check required variables
  for (const key of requiredEnvVars) {
    if (!import.meta.env[key]) {
      console.error(`❌ Missing required environment variable: ${key}`);
      hasRequiredVars = false;
    }
  }
  
  // Check optional variables and warn
  for (const key of optionalEnvVars) {
    if (!import.meta.env[key]) {
      console.warn(`⚠️ Optional environment variable missing: ${key} - Some features may be limited`);
    }
  }
  
  if (!hasRequiredVars) {
    console.error('Environment validation failed. Please check your .env file.');
    // Only throw in development to prevent production crashes
    if (import.meta.env.DEV) {
      throw new Error('Environment validation failed. Please check your .env file.');
    }
  }
}
