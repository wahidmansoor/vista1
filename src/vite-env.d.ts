/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_VERSION?: string;
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  
  // Auth0 Configuration (safe to expose - public client identifiers)
  readonly VITE_AUTH0_DOMAIN?: string;
  readonly VITE_AUTH0_CLIENT_ID?: string;
  readonly VITE_AUTH0_CALLBACK_URL?: string;
  readonly VITE_AUTH0_REDIRECT_URI?: string;
  readonly VITE_AUTH0_AUDIENCE?: string;
  
  // Application Configuration
  readonly VITE_AI_PROVIDER?: string;
  readonly VITE_APP_MODE?: string;
  readonly VITE_LOG_LEVEL?: string;
  
  // Built-in Vite environment variables
  readonly NODE_ENV: string;
  readonly PROD: boolean;
  readonly DEV: boolean;
  readonly MODE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
