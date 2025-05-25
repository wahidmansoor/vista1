import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import ErrorBoundary from './components/ErrorBoundary';
import LogRocket from 'logrocket';
import setupLogRocketReact from 'logrocket-react';
import { validateEnv } from './utils/validateEnv';

validateEnv();

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
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary moduleName="App Root">
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

