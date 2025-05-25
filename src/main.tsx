import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import ErrorBoundary from './components/ErrorBoundary'; // ✅ Corrected import
import LogRocket from 'logrocket';
import setupLogRocketReact from 'logrocket-react';
import { validateEnv } from './utils/validateEnv';

// ✅ Step 1: Validate environment variables
validateEnv();

// ✅ Step 2: Setup LogRocket only in production
if (import.meta.env.PROD) {
  try {
    LogRocket.init('oncovista/oncovista-app', {
      release: import.meta.env.VITE_APP_VERSION || 'development',
      console: {
        isEnabled: true,
        shouldAggregateConsoleErrors: true
      },
      network: {
        requestSanitizer: request => {
          if (request.url.includes('/api/health')) {
            return null;
          }
          request.headers = {};
          return request;
        }
      }
    });
    setupLogRocketReact(LogRocket);
    console.log('LogRocket initialized successfully');
  } catch (error) {
    console.warn('LogRocket failed to initialize:', error);
  }
}

// ✅ Step 3: Render the app with ErrorBoundary
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
