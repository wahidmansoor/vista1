import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

/**
 * Callback page that handles Auth0 authentication redirect
 * Redirects to dashboard after successful authentication
 */
const CallbackPage: React.FC = () => {
  const { isLoading, error, isAuthenticated, handleRedirectCallback } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Wait for Auth0 to process the callback
        if (!isLoading && !error) {
          // Get the return URL from session storage or default to dashboard
          const returnTo = sessionStorage.getItem('auth_return_to') || '/dashboard';
          sessionStorage.removeItem('auth_return_to');
          
          console.log('Auth0 callback successful, redirecting to:', returnTo);
          
          // Use replace to avoid adding to history stack
          navigate(returnTo, { replace: true });
        }
      } catch (err) {
        console.error('Auth0 callback processing error:', err);
        navigate('/', { replace: true });
      }
    };

    if (!isLoading && isAuthenticated) {
      processCallback();
    } else if (!isLoading && error) {
      console.error('Auth0 callback error:', error);
      navigate('/', { replace: true });
    }
  }, [isLoading, isAuthenticated, error, navigate]);

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-500 via-indigo-600 to-purple-600">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white mb-4 mx-auto"></div>
        <div className="text-white text-xl font-semibold">
          🧬 OncoVista
        </div>
        <div className="text-white/80 text-sm mt-2">
          Completing authentication...
        </div>
      </div>
    </div>
  );
};

export default CallbackPage;
