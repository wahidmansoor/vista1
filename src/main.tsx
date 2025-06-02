import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import ErrorBoundary from './components/ErrorBoundary';
import { Auth0Provider } from './auth/auth-provider';
import { UserProvider } from './context/UserContext';
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
    <Auth0Provider>
      <UserProvider>
        <ErrorBoundary moduleName="App Root">
          <App />
        </ErrorBoundary>
      </UserProvider>
    </Auth0Provider>
  </React.StrictMode>
);

