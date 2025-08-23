import React from 'react';
import { isAuthBypassEnabled, isLocalDevelopment, logEnvironmentInfo } from '../utils/environment';

/**
 * Test page to verify authentication bypass is working
 */
const AuthTest: React.FC = () => {
  const authBypass = isAuthBypassEnabled();
  const isLocal = isLocalDevelopment();
  
  React.useEffect(() => {
    console.log('=== AUTH TEST PAGE ===');
    logEnvironmentInfo();
    console.log('Auth Bypass Enabled:', authBypass);
    console.log('Is Local Development:', isLocal);
    console.log('Environment Variable VITE_AUTH_BYPASS_DEV:', import.meta.env.VITE_AUTH_BYPASS_DEV);
    console.log('Current hostname:', window.location.hostname);
    console.log('Current protocol:', window.location.protocol);
    console.log('Current port:', window.location.port);
  }, [authBypass, isLocal]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🎉 Authentication Bypass Test
          </h1>
          <p className="text-lg text-gray-600">
            If you can see this page, the authentication bypass is working!
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-green-800 mb-2">✅ Success!</h2>
            <p className="text-green-700">
              You have successfully accessed a protected route without authentication.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">Environment Status</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-700">Auth Bypass Enabled:</span>
                <span className={`font-medium ${authBypass ? 'text-green-600' : 'text-red-600'}`}>
                  {authBypass ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Local Development:</span>
                <span className={`font-medium ${isLocal ? 'text-green-600' : 'text-red-600'}`}>
                  {isLocal ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Environment Variable:</span>
                <span className="font-medium text-gray-800">
                  {import.meta.env.VITE_AUTH_BYPASS_DEV || 'Not set'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Hostname:</span>
                <span className="font-medium text-gray-800">
                  {window.location.hostname}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">⚠️ Development Only</h3>
            <p className="text-yellow-700 text-sm">
              This authentication bypass only works in local development and is automatically 
              disabled in production environments for security.
            </p>
          </div>

          <div className="text-center">
            <button 
              onClick={() => window.location.href = '/dashboard'}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthTest;