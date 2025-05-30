import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react({
        jsxRuntime: 'automatic', // Changed from 'classic' to match tsconfig
        include: "**/*.{jsx,tsx}"
      })
    ],    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },    build: {
      outDir: 'dist',
      // Enable source maps for all builds to help with debugging
      sourcemap: true, 
      minify: 'terser',
      cssMinify: true,
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
        external: [],
      },
      commonjsOptions: {
        include: [/node_modules/],
        transformMixedEsModules: true,
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
      include: ['react', 'react-dom', 'react-router-dom', '@emotion/react', '@emotion/styled', '@mui/material'],
      esbuildOptions: {
        target: 'es2020',
      }
    },
    esbuild: {
      logOverride: { 'this-is-undefined-in-esm': 'silent' }
    }
  }
})