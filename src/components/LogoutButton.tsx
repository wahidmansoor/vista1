import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

interface LogoutButtonProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * Logout button component that uses Auth0 authentication
 */
const LogoutButton: React.FC<LogoutButtonProps> = ({ 
  className = "px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors",
  children = "Log Out"
}) => {
  const { logout, isLoading } = useAuth0();
  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: 'https://mwoncovista.netlify.app',
      },
    });
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  );
};

export default LogoutButton;
