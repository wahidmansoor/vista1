import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

interface LoginButtonProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * Login button component that uses Auth0 authentication
 */
const LoginButton: React.FC<LoginButtonProps> = ({ 
  className = "px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors",
  children = "Log In"
}) => {
  const { loginWithRedirect, isLoading } = useAuth0();  const handleLogin = () => {
    const returnTo = window.location.pathname === '/callback' 
      ? '/dashboard' 
      : window.location.pathname + window.location.search;
    
    // Store return URL in session storage for callback page
    sessionStorage.setItem('auth_return_to', returnTo);
    
    loginWithRedirect({
      appState: {
        returnTo,
      },
    });
  };

  return (
    <button
      onClick={handleLogin}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  );
};

export default LoginButton;
