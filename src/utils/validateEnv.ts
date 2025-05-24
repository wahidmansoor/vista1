const requiredEnvVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'VITE_OPENAI_API_KEY',
  'VITE_GEMINI_API_KEY'
] as const;

/**
 * Validates required environment variables are present
 * Throws error if any required variable is missing
 */
export function validateEnv(): void {
  let isValid = true;
  for (const key of requiredEnvVars) {
    if (!import.meta.env[key]) {
      console.error(`\u274c Missing required environment variable: ${key}`);
      isValid = false;
    }
  }
  if (!isValid) {
    throw new Error('Environment validation failed. Please check your .env file.');
  }
}
