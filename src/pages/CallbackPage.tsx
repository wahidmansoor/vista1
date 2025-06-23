import React, { useEffect, useState, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate, useLocation } from 'react-router-dom';

const CallbackPage: React.FC = () => {
  const { handleRedirectCallback, isAuthenticated, error, isLoading } = useAuth0();
  const [processing, setProcessing] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleAuthRedirect = useCallback(async () => {
    try {
      const query = location.search;
      // Check for auth code and state parameters
      if (query.includes('code=') && query.includes('state=')) {
        const result = await handleRedirectCallback();
        const returnTo = result?.appState?.returnTo || '/dashboard';
        navigate(returnTo, { replace: true });
      } else if (isAuthenticated && !isLoading) {
        // Already authenticated, redirect to dashboard
        navigate('/dashboard', { replace: true });
      } else if (!isLoading) {
        // No auth parameters and not authenticated, return to home
        navigate('/', { replace: true });
      }
    } catch (err) {
      console.error('Auth0 callback error:', err);
      // On error, redirect to home with error state
      navigate('/?error=auth_callback_failed', { replace: true });
    } finally {
      setProcessing(false);
    }
  }, [handleRedirectCallback, navigate, isAuthenticated, isLoading, location]);

  useEffect(() => {
    // Only process if we're not still loading the auth state
    if (!isLoading) {
      handleAuthRedirect();
    }
  }, [handleAuthRedirect, isLoading]);

  if (processing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-500 via-indigo-600 to-purple-600">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white mb-4 mx-auto"></div>
          <div className="text-white text-xl font-semibold">🧬 OncoVista</div>
          <div className="text-white/80 text-sm mt-2">Completing authentication...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-500 via-indigo-600 to-purple-600">
        <div className="text-center bg-white/10 backdrop-blur-lg rounded-lg p-8 max-w-md">
          <div className="text-red-400 text-xl font-bold mb-4">Authentication Error</div>
          <p className="text-white/80 mb-4">{error.message}</p>
          <button
            onClick={() => navigate('/', { replace: true })}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default CallbackPage;
