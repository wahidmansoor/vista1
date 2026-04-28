import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: '/',
    plugins: [
      react({
        jsxRuntime: 'automatic',
        include: "**/*.{jsx,tsx}"
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
    },
    build: {
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
        }
      }
    },
    server: {
      port: 3003,
      open: true,
      // Add middleware to handle static file requests properly
      middleware: (req, res, next) => {
        // Let static files through normally
        if (req.url.startsWith('/assets/') || req.url.endsWith('.md') || req.url.endsWith('.json')) {
          console.log(`📦 Allowing static asset: ${req.url}`);
        }
        next();
      }
    },
    preview: {
      port: 4173,
      open: true
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom']
    }
  };
});
