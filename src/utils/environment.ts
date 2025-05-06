/**
 * Utility functions for environment-specific code
 */

export const isServer = typeof window === 'undefined';
export const isBrowser = !isServer;

export function getEnvVar(key: string): string | undefined {
  if (isBrowser) {
    return import.meta.env[`VITE_${key}`];
  }
  return process.env[`VITE_${key}`];
}

export function validateEnvVars(requiredVars: string[]): void {
  const missing = requiredVars.filter(key => !getEnvVar(key));
  if (missing.length > 0) {
    console.warn(`⚠️ Missing required environment variables: ${missing.join(', ')}`);
  }
}