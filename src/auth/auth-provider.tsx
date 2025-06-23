import React from 'react';
import { Auth0Provider as Auth0ReactProvider, useAuth0 } from '@auth0/auth0-react';
import AuthLoading from '../components/AuthLoading';

interface Auth0ProviderProps {
  children: React.ReactNode;
}

// Wrapper component to handle loading state
const Auth0Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoading } = useAuth0();

  if (isLoading) {
    return <AuthLoading />;
  }

  return <>{children}</>;
};

export const Auth0Provider: React.FC<Auth0ProviderProps> = ({ children }) => {
  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
  const callbackUrl = import.meta.env.VITE_AUTH0_CALLBACK_URL || window.location.origin + '/callback';
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

  if (!domain || !clientId) {
    console.error('Auth0 configuration missing. Please set VITE_AUTH0_DOMAIN and VITE_AUTH0_CLIENT_ID environment variables.');
    return <>{children}</>;
  }

  return (
    <Auth0ReactProvider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: callbackUrl,
        ...(audience && { audience }),
        scope: "openid profile email read:current_user update:current_user_metadata"
      }}
      useRefreshTokens={true}
      useRefreshTokensFallback={true}
      cacheLocation="localstorage" // ✅ FIXED: no more 'cookie'
      skipRedirectCallback={window.location.pathname === '/callback'}
      onRedirectCallback={(appState) => {
        window.history.replaceState(
          {},
          document.title,
          appState?.returnTo === '/callback' || !appState?.returnTo
            ? '/dashboard'
            : appState.returnTo
        );
      }}
    >
      <Auth0Wrapper>
        {children}
      </Auth0Wrapper>
    </Auth0ReactProvider>
  );
};

export default Auth0Provider;
