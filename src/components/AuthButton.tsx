import React from 'react';
import { useAuth } from '../hooks/useAuth';

/**
 * Login/Logout button component that demonstrates Auth0 usage
 */
const AuthButton: React.FC = () => {
  const { isAuthenticated, isLoading, login, logout, user, error } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-4">
        <span>Welcome, {user.name || user.email}!</span>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Log Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={login}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
    >
      Log In
    </button>
  );
};

export default AuthButton;
