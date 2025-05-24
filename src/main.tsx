import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import ErrorBoundary from './components/ErrorBoundaryNew'; // ✅ updated import
import LogRocket from 'logrocket';
import setupLogRocketReact from 'logrocket-react';
import { validateEnv } from './utils/validateEnv';

// Validate environment variables
validateEnv();

// Only initialize LogRocket in production
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
          // Don't record requests to certain endpoints
          if (request.url.includes('/api/health')) {
            return null;
          }
          // Remove sensitive headers
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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
