import { useAuth0 } from '@auth0/auth0-react';
import { useUserContext } from '../context/UserContext';

/**
 * Custom hook to access user information and authentication state
 * Returns user details, authentication status, and authentication methods
 * Can use either Auth0 directly or the UserContext
 */
export const useUser = (useContext = false) => {
  const auth0 = useAuth0();
  
  // If useContext is true, use the UserContext, otherwise use Auth0 directly
  if (useContext) {
    try {
      const context = useUserContext();
      return {
        // User information from context
        user: context.user ? {
          id: context.user.sub,
          name: context.user.name,
          email: context.user.email,
          picture: context.user.picture,
          emailVerified: context.user.email_verified,
          nickname: context.user.nickname,
          givenName: context.user.given_name,
          familyName: context.user.family_name,
          locale: context.user.locale,
          updatedAt: context.user.updated_at,
        } : null,
        
        // Authentication state
        isAuthenticated: context.isAuthenticated,
        isLoading: context.isLoading,
        error: context.error,
        
        // Authentication methods
        login: context.login,
        logout: context.logout,
        getAccessTokenSilently: context.getAccessToken,
        getIdTokenClaims: auth0.getIdTokenClaims,
      };
    } catch {
      // Fall back to Auth0 if context is not available
    }
  }

  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
    getIdTokenClaims,
  } = auth0;
  const login = () => {
    loginWithRedirect({
      appState: {
        returnTo: window.location.pathname === '/callback' 
          ? '/dashboard' 
          : window.location.pathname + window.location.search,
      },
    });
  };

  const logoutUser = () => {
    logout({
      logoutParams: {
        returnTo: 'https://mwoncovista.netlify.app',
      },
    });
  };

  return {
    // User information
    user: user ? {
      id: user.sub,
      name: user.name,
      email: user.email,
      picture: user.picture,
      emailVerified: user.email_verified,
      nickname: user.nickname,
      givenName: user.given_name,
      familyName: user.family_name,
      locale: user.locale,
      updatedAt: user.updated_at,
    } : null,
    
    // Authentication state
    isAuthenticated,
    isLoading,
    error,
    
    // Authentication methods
    login,
    logout: logoutUser,
    getAccessTokenSilently,
    getIdTokenClaims,
  };
};

export default useUser;
