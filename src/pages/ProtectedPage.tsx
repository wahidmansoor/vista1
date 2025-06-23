import React from 'react';
import ProtectedRoute from '../auth/ProtectedRoute';
import { useUser } from '../hooks/useUser';
import LogoutButton from '../components/LogoutButton';

/**
 * Example of a protected page that requires authentication
 * This demonstrates how to use the ProtectedRoute component
 */
const ProtectedPage: React.FC = () => {
  const { user } = useUser();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                🔒 Protected Page
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                This page is only accessible to authenticated users
              </p>
            </div>

            {user && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-6">
                <h2 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">
                  Welcome, {user.name || 'User'}!
                </h2>
                <div className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>User ID:</strong> {user.id}</p>
                  {user.picture && (
                    <div className="mt-4">
                      <img
                        src={user.picture}
                        alt="Profile"
                        className="w-12 h-12 rounded-full border-2 border-blue-200"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                This is a demonstration of protected content. Only authenticated users can see this page.
                If you're seeing this, it means:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 ml-4">
                <li>✅ You are successfully authenticated with Auth0</li>
                <li>✅ Your access token is valid</li>
                <li>✅ The ProtectedRoute component is working correctly</li>
                <li>✅ User information is being retrieved from Auth0</li>
              </ul>
            </div>

            <div className="mt-8 text-center">
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ProtectedPage;
