import React from 'react';
import { isAuthBypassEnabled, isLocalDevelopment } from '../utils/environment';

/**
 * Visual indicator showing when authentication bypass is active
 * Only shows in development mode
 */
const AuthBypassIndicator: React.FC = () => {
  const authBypass = isAuthBypassEnabled();
  const isLocal = isLocalDevelopment();

  if (!authBypass || !isLocal) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 bg-yellow-500 text-black px-3 py-2 rounded-lg shadow-lg border border-yellow-600">
      <div className="flex items-center space-x-2">
        <span className="text-lg">🔓</span>
        <div className="text-sm font-medium">
          <div>Auth Bypass Active</div>
          <div className="text-xs opacity-75">Development Mode</div>
        </div>
      </div>
    </div>
  );
};

export default AuthBypassIndicator;