import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Component to protect routes that require authentication
 * Shows children if authenticated, otherwise shows login prompt
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallback 
}) => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-teal-500 via-indigo-600 to-purple-600">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white mb-4 mx-auto"></div>
          <div className="text-white text-xl font-semibold">
            🧬 OncoVista
          </div>
          <div className="text-white/80 text-sm mt-2">
            Authenticating...
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-teal-500 via-indigo-600 to-purple-600">
        <div className="text-center bg-white/10 backdrop-blur-lg rounded-lg p-8 max-w-md">
          <div className="text-white text-2xl font-bold mb-2">🧬 OncoVista</div>
          <h2 className="text-xl font-bold mb-4 text-white">Authentication Required</h2>
          <p className="mb-6 text-white/80">You need to be logged in to access this page.</p>
          <button
            onClick={() => loginWithRedirect({
              appState: {
                returnTo: window.location.pathname + window.location.search,
              },
            })}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium w-full"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
