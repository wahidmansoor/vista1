/**
 * Environment utilities for accessing Vite environment variables
 * This file handles all environment variable access safely for browser environments
 */

// Browser detection utility
export const isBrowser = typeof window !== 'undefined';

// Type definitions for environment variables
export interface EnvironmentVariables {
  supabaseUrl: string;
  supabaseAnonKey: string;
  openaiApiKey: string;
  geminiApiKey: string;
}

// Environment variable keys
export type EnvVarKey = 'SUPABASE_URL' | 'SUPABASE_ANON_KEY' | 'OPENAI_API_KEY' | 'GEMINI_API_KEY' | 'AUTH0_DOMAIN' | 'AUTH0_CLIENT_ID';

// List of required environment variables
const REQUIRED_ENV_VARS: string[] = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY', 
  'VITE_OPENAI_API_KEY',
  'VITE_GEMINI_API_KEY'
];

// List of optional environment variables (Auth0 is optional)
const OPTIONAL_ENV_VARS: string[] = [
  'VITE_AUTH0_DOMAIN',
  'VITE_AUTH0_CLIENT_ID',
  'VITE_AUTH0_CALLBACK_URL'
];

/**
 * Get a single environment variable by key
 * @param key - The environment variable key (without VITE_ prefix)
 * @returns The environment variable value or undefined
 */
export function getEnvVar(key: string): string | undefined {
  // Use Vite's import.meta.env instead of process.env for browser compatibility
  return import.meta.env[`VITE_${key}`];
}

/**
 * Get a typed environment variable with error handling
 * @param key - The environment variable key
 * @returns The environment variable value
 * @throws Error if the variable is not defined
 */
export function getTypedEnvVar(key: EnvVarKey): string {
  const value = import.meta.env[`VITE_${key}`];
  if (!value || value.trim() === '') {
    throw new Error(`Environment variable VITE_${key} is not defined or empty`);
  }
  return value;
}

/**
 * Get all required environment variables as an object
 * @returns Object containing all environment variables
 * @throws Error if any required variable is missing
 */
export function getEnvVars(): EnvironmentVariables {
  return {
    supabaseUrl: getTypedEnvVar('SUPABASE_URL'),
    supabaseAnonKey: getTypedEnvVar('SUPABASE_ANON_KEY'),
    openaiApiKey: getTypedEnvVar('OPENAI_API_KEY'),
    geminiApiKey: getTypedEnvVar('GEMINI_API_KEY'),
  };
}

/**
 * Validate that all required environment variables are present
 * @throws Error if any required variable is missing
 */
export function validateEnvironment(): void {
  const missingVars = REQUIRED_ENV_VARS.filter(varName => {
    const value = import.meta.env[varName];
    return !value || value.trim() === '';
  });

  if (missingVars.length > 0) {
    const errorMessage = `Missing required environment variables: ${missingVars.join(', ')}`;
    console.error('Environment validation failed:', errorMessage);
    console.error('Available environment variables:', Object.keys(import.meta.env).filter(key => key.startsWith('VITE_')));
    throw new Error(errorMessage);
  }

  console.log('✅ All required environment variables are present');
}

/**
 * Check if we're in development mode
 */
export function isDevelopment(): boolean {
  return import.meta.env.DEV;
}

/**
 * Check if we're in production mode
 */
export function isProduction(): boolean {
  return import.meta.env.PROD;
}

/**
 * Get the current mode (development, production, etc.)
 */
export function getMode(): string {
  return import.meta.env.MODE;
}

/**
 * Safe environment variable getter with fallback
 * @param key - Environment variable key
 * @param fallback - Fallback value if variable is not found
 * @returns The environment variable value or fallback
 */
export function getEnvVarWithFallback(key: string, fallback: string): string {
  return getEnvVar(key) || fallback;
}

/**
 * Initialize and validate environment on app startup
 * Call this function early in your app initialization
 */
export function initializeEnvironment(): EnvironmentVariables {
  try {
    validateEnvironment();
    const envVars = getEnvVars();
    console.log('🚀 Environment initialized successfully');
    return envVars;
  } catch (error) {
    console.error('❌ Failed to initialize environment:', error);
    throw error;
  }
}

// Export environment variables for easy access
export const ENV = {
  get SUPABASE_URL() { return getTypedEnvVar('SUPABASE_URL'); },
  get SUPABASE_ANON_KEY() { return getTypedEnvVar('SUPABASE_ANON_KEY'); },
  get OPENAI_API_KEY() { return getTypedEnvVar('OPENAI_API_KEY'); },
  get GEMINI_API_KEY() { return getTypedEnvVar('GEMINI_API_KEY'); },
  get IS_DEV() { return isDevelopment(); },
  get IS_PROD() { return isProduction(); },
  get MODE() { return getMode(); }
};

// Default export for convenience
export default {
  getEnvVar,
  getTypedEnvVar,
  getEnvVars,
  validateEnvironment,
  initializeEnvironment,
  isDevelopment,
  isProduction,
  getMode,
  ENV
};