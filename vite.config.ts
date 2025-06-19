import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  // Validate required environment variables for production builds
  const requiredEnvVars = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];
    // In production mode, validate required environment variables
  if (mode === 'production') {
    console.log('Building for production - validating required environment variables...');
    
    const missingVars = requiredEnvVars.filter(varName => !env[varName] || env[varName].trim() === '');
    
    if (missingVars.length > 0) {
      console.error('\x1b[31m%s\x1b[0m', '🚨 ERROR: Missing required environment variables:');
      missingVars.forEach(varName => {
        console.error(`  - ${varName}`);
      });
      console.error('\x1b[31m%s\x1b[0m', 'Production builds require all necessary environment variables.');
      console.error('Set these variables in your .env file or deployment environment.');
      console.error('Exiting build process...');
      
      // Exit with error code 1
      process.exit(1);
    }
    
    console.log('\x1b[32m%s\x1b[0m', '✅ All required environment variables are present.');
  }
  // Map environment variables, using values only in development
  const envValues = {
    VITE_GEMINI_API_KEY: env.VITE_GEMINI_API_KEY || (mode === 'development' ? 'dev_key' : undefined),
    VITE_SUPABASE_URL: env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: env.VITE_SUPABASE_ANON_KEY,
    VITE_OPENAI_API_KEY: env.VITE_OPENAI_API_KEY || (mode === 'development' ? 'dev_key' : undefined),
    VITE_AUTH0_DOMAIN: env.VITE_AUTH0_DOMAIN || (mode === 'development' ? 'dev.auth0.com' : undefined),
    VITE_AUTH0_CLIENT_ID: env.VITE_AUTH0_CLIENT_ID || (mode === 'development' ? 'dev_client_id' : undefined),
    // Ensure debug mode is disabled in production
    VITE_ENABLE_DEBUG: mode === 'production' ? 'false' : (env.VITE_ENABLE_DEBUG || 'false')
  };
  return {
    base: '/',
  define: {
      // Define environment variables with proper validation
      'process.env.VITE_GEMINI_API_KEY': JSON.stringify(envValues.VITE_GEMINI_API_KEY),
      'process.env.VITE_SUPABASE_URL': JSON.stringify(envValues.VITE_SUPABASE_URL),      'process.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(envValues.VITE_SUPABASE_ANON_KEY),
      'process.env.VITE_OPENAI_API_KEY': JSON.stringify(envValues.VITE_OPENAI_API_KEY),
      'process.env.VITE_AUTH0_DOMAIN': JSON.stringify(envValues.VITE_AUTH0_DOMAIN),
      'process.env.VITE_AUTH0_CLIENT_ID': JSON.stringify(envValues.VITE_AUTH0_CLIENT_ID),
      'process.env.VITE_ENABLE_DEBUG': JSON.stringify(envValues.VITE_ENABLE_DEBUG)
    },plugins: [
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
    },    css: {
      preprocessorOptions: {
        // Handle CSS imports more robustly - removed invalid css property
      }
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
