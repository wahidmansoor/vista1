import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

function validateEnv(env: Record<string, string>) {
  const required = ['VITE_GEMINI_API_KEY'];
  const missing = required.filter(key => !env[key]);
  if (missing.length && env.MODE === 'production') {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  validateEnv(env);

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    build: {
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'gemini-sdk': ['@google/generative-ai']
          }
        }
      }
    }
  };
});