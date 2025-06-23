import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth0, User } from '@auth0/auth0-react';

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error?: Error;
  login: () => void;
  logout: () => void;
  getAccessToken: () => Promise<string>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

/**
 * User context provider that wraps Auth0 functionality
 * and provides user state throughout the application
 */
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    loginWithRedirect,
    logout: auth0Logout,
    getAccessTokenSilently,
  } = useAuth0();

  const login = () => {
    loginWithRedirect({
      appState: {
        returnTo: window.location.pathname === '/callback' 
          ? '/dashboard' 
          : window.location.pathname + window.location.search,
      },
    });
  };

  const logout = () => {
    auth0Logout({
      logoutParams: {
        returnTo: 'https://mwoncovista.netlify.app',
      },
    });
  };

  const getAccessToken = async (): Promise<string> => {
    try {
      return await getAccessTokenSilently();
    } catch (error) {
      console.error('Error getting access token:', error);
      throw error;
    }
  };

  const value: UserContextType = {
    user: isAuthenticated ? user || null : null,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    getAccessToken,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

/**
 * Hook to access user context
 * Throws error if used outside UserProvider
 */
export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};

export default UserContext;
