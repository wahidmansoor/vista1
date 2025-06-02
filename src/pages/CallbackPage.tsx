import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

const CallbackPage: React.FC = () => {
  const { handleRedirectCallback, isAuthenticated, error } = useAuth0();
  const [processing, setProcessing] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthRedirect = async () => {
      try {
        const query = window.location.search;
        if (query.includes('code=') && query.includes('state=')) {
          const result = await handleRedirectCallback();
          const returnTo = result?.appState?.returnTo || '/dashboard';
          navigate(returnTo, { replace: true });
        } else if (isAuthenticated) {
          navigate('/dashboard', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      } catch (err) {
        console.error('Auth0 callback error:', err);
        navigate('/', { replace: true });
      } finally {
        setProcessing(false);
      }
    };

    handleAuthRedirect();
  }, [handleRedirectCallback, navigate, isAuthenticated]);

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

