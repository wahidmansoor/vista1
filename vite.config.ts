import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');

  // Don't throw errors for missing env vars during build, let the app handle it
  if (mode === 'production') {
    console.log('Building for production...');
  }

  // Provide default values for missing environment variables during build
  const envDefaults = {
    VITE_GEMINI_API_KEY: env.VITE_GEMINI_API_KEY || 'default_key',
    VITE_SUPABASE_URL: env.VITE_SUPABASE_URL || 'https://default.supabase.co',
    VITE_SUPABASE_ANON_KEY: env.VITE_SUPABASE_ANON_KEY || 'default_key',
    VITE_OPENAI_API_KEY: env.VITE_OPENAI_API_KEY || 'default_key',
    VITE_AUTH0_DOMAIN: env.VITE_AUTH0_DOMAIN || 'default.auth0.com',
    VITE_AUTH0_CLIENT_ID: env.VITE_AUTH0_CLIENT_ID || 'default_client_id'
  };
  return {
    base: '/',
    define: {
      // Define environment variables with defaults for build
      'process.env.VITE_GEMINI_API_KEY': JSON.stringify(envDefaults.VITE_GEMINI_API_KEY),
      'process.env.VITE_SUPABASE_URL': JSON.stringify(envDefaults.VITE_SUPABASE_URL),
      'process.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(envDefaults.VITE_SUPABASE_ANON_KEY),
      'process.env.VITE_OPENAI_API_KEY': JSON.stringify(envDefaults.VITE_OPENAI_API_KEY),
      'process.env.VITE_AUTH0_DOMAIN': JSON.stringify(envDefaults.VITE_AUTH0_DOMAIN),
      'process.env.VITE_AUTH0_CLIENT_ID': JSON.stringify(envDefaults.VITE_AUTH0_CLIENT_ID)
    },    plugins: [
      react({
        jsxRuntime: 'automatic',
        include: "**/*.{jsx,tsx}",
        exclude: /node_modules/
      }),
      viteStaticCopy({
        targets: [
          {
            src: 'public/_headers', // 👈 this ensures CSP and cache rules are deployed
            dest: '.'               // copied to dist/_headers
          }
        ]
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },    build: {
      outDir: 'dist',
      sourcemap: mode === 'development',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
            ui: ['@mui/material'],
            ai: ['@google/generative-ai', 'openai'],
            utils: ['lucide-react']
          }
        },
        onwarn(warning, warn) {
          // Suppress specific warnings during build
          if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return;
          if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
          warn(warning);
        }
      },
      // Increase chunk size limit
      chunkSizeWarningLimit: 1000
    },
    server: {
      port: 3003,
      open: true
    },
    preview: {
      port: 4173,
      open: true
    },    optimizeDeps: {
      include: [
        'react', 
        'react-dom', 
        'react-router-dom',
        'lucide-react',
        '@radix-ui/react-dialog',
        '@radix-ui/react-toast',
        'framer-motion'
      ],
      exclude: ['@google/generative-ai']
    }
  };
});
