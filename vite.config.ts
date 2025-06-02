import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react({
        jsxRuntime: 'automatic',
        include: "**/*.{jsx,tsx}",
        babel: {
          plugins: [
            ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }]
          ]
        }
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    build: {
      outDir: 'dist',
      sourcemap: process.env.NODE_ENV !== 'production',
      minify: 'terser',
      cssMinify: true,
      // Netlify optimized build config
      rollupOptions: {
        external: [],
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              if (id.includes('react')) return 'vendor-react'
              if (id.includes('@mui')) return 'vendor-mui'
              if (id.includes('@google') || id.includes('openai')) return 'vendor-ai'
              if (id.includes('@radix-ui') || id.includes('@headlessui')) return 'vendor-ui'
              if (id.includes('@supabase')) return 'vendor-supabase'
              return 'vendor'
            }
          },
          chunkFileNames: 'assets/[name].[hash].js',
          entryFileNames: 'assets/[name].[hash].js',
          assetFileNames: ({name}) => {
            if (/\.(gif|jpe?g|png|svg)$/.test(name ?? '')) {
              return 'assets/images/[name].[hash][extname]'
            }
            if (/\.css$/.test(name ?? '')) {
              return 'assets/css/[name].[hash][extname]' 
            }
            return 'assets/[name].[hash][extname]'
          }
        }
      },
      // Optimize dependencies
      optimizeDeps: {
        include: [
          'react',
          'react-dom',
          '@radix-ui/*',
          '@headlessui/react',
          'lucide-react'
        ],
        exclude: ['@supabase/supabase-js']
      },
      // Handle environment variables
      define: {
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        'process.env.VITE_GEMINI_API_KEY': JSON.stringify(process.env.VITE_GEMINI_API_KEY),
        'process.env.VITE_SUPABASE_URL': JSON.stringify(process.env.VITE_SUPABASE_URL),
        'process.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY)
      }
    }
  }
})