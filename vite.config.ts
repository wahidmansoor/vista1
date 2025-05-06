import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

// Environment validation function
function validateEnv(env: Record<string, string>) {
  const required = [
    'VITE_GEMINI_API_KEY',
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'VITE_OPENAI_API_KEY'
  ];
  const missing = required.filter(key => !env[key]);

  if (missing.length > 0) {
    if (env.MODE === 'production') {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    } else {
      console.warn(`⚠️ Missing environment variables: ${missing.join(', ')}\nFalling back to mock mode for AI features.`);
    }
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  validateEnv(env);

  return {
    plugins: [react()],
    css: {
      postcss: {
        plugins: [
          tailwindcss(),
          autoprefixer(),
        ],
      },
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, './src')
      }
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
        }
      },
      fs: {
        strict: false,
        allow: ['..']
      }
    },
    publicDir: 'public',
    assetsInclude: ['**/*.md'],
    test: {
      globals: true,
      environment: 'node',
      include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      coverage: {
        reporter: ['text', 'html'],
        exclude: [
          'node_modules/',
          'src/test/**'
        ]
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
