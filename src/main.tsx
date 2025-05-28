import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import ErrorBoundary from './components/ErrorBoundary';
import { Auth0Provider } from './providers/Auth0Provider';
import { UserProvider } from './context/UserContext';
import { AutoLogoutProvider } from './providers/AutoLogoutProvider';
import LogRocket from 'logrocket';
import setupLogRocketReact from 'logrocket-react';
import { validateEnv } from './utils/validateEnv';
import { errorTracker } from './utils/errorTracking';

validateEnv();

// Initialize error tracking immediately
console.log('🔍 Error tracking initialized');

if (import.meta.env.PROD) {
  try {
    LogRocket.init('oncovista/oncovista-app', {
      release: import.meta.env.VITE_APP_VERSION || 'development',
      console: { isEnabled: true, shouldAggregateConsoleErrors: true },
      network: {
        requestSanitizer: (request) => {
          if (request.url.includes('/api/health')) return null;
          request.headers = {};
          return request;
        },
      },
    });
    setupLogRocketReact(LogRocket);
    console.log('✅ LogRocket initialized');
  } catch (e) {
    console.warn('⚠️ LogRocket failed to initialize:', e);
    // Track LogRocket initialization errors
    errorTracker.captureError({
      error: e instanceof Error ? e : new Error(String(e)),
      module: 'LogRocket',
      additionalContext: { type: 'initialization_error' },
    });
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Auth0Provider
      autoLogoutMinutes={10}
      autoLogoutWarningMinutes={2}
      enableAutoLogout={true}
    >
      <UserProvider>
        <AutoLogoutProvider>
          <ErrorBoundary moduleName="App Root">
            <App />
          </ErrorBoundary>
        </AutoLogoutProvider>
      </UserProvider>
    </Auth0Provider>
  </React.StrictMode>
);

