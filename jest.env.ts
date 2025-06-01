// Mock for import.meta.env
Object.defineProperty(global, 'import', {
  value: {
    meta: { 
      env: { 
        VITE_GEMINI_API_KEY: 'test-key',
        VITE_SUPABASE_URL: 'https://test.supabase.co',
        VITE_SUPABASE_ANON_KEY: 'test-key',
        NODE_ENV: 'test',
        DEV: true,
        PROD: false,
        MODE: 'test'
      } 
    }
  },
  writable: false
});
