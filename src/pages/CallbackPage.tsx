import React, { useEffect, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

/**
 * Callback page that handles Auth0 authentication redirect
 * Redirects to dashboard after successful authentication
 */
const CallbackPage: React.FC = () => {
  const { isLoading, error, isAuthenticated, handleRedirectCallback } = useAuth0();
  const navigate = useNavigate();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent double processing
    if (hasProcessed.current) return;

    const processCallback = async () => {
      try {
        // Always call handleRedirectCallback on callback page
        const result = await handleRedirectCallback();
        hasProcessed.current = true;
        
        // Extract returnTo from appState or default to dashboard
        const returnTo = result?.appState?.returnTo || '/dashboard';
        
        console.log('Auth0 callback successful, redirecting to:', returnTo);
        navigate(returnTo, { replace: true });
      } catch (err) {
        console.error('Auth0 callback error:', err);
        hasProcessed.current = true;
        
        // On error, redirect to home page
        navigate('/', { replace: true });
      }
    };

    // Process callback when not loading
    if (!isLoading && !hasProcessed.current) {
      processCallback();
    }
  }, [isLoading, handleRedirectCallback, navigate]);

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
