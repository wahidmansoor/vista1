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
    },    server: {
      port: 3003,
      open: true
    },
    preview: {
      port: 4173,
      open: true
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom']
    }
  }
})