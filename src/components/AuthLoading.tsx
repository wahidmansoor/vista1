import React from 'react';

export const AuthLoading: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-500 via-indigo-600 to-purple-600">
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
};

export default AuthLoading;
