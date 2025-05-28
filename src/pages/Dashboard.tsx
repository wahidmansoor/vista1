import React from 'react';
import { useUser } from '../hooks/useUser';
import LoginButton from '../components/LoginButton';
import LogoutButton from '../components/LogoutButton';

/**
 * Dashboard page that shows user information and authentication status
 * This serves as the main landing page after login
 */
const Dashboard: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-500 via-indigo-600 to-purple-600">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white mb-4 mx-auto"></div>
          <div className="text-white text-xl font-semibold">
            🧬 OncoVista
          </div>
          <div className="text-white/80 text-sm mt-2">
            Loading...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500 via-indigo-600 to-purple-600 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">🧬 OncoVista Dashboard</h1>
            <p className="text-white/80 text-lg">Welcome to your personalized oncology platform</p>
          </div>

          {isAuthenticated && user ? (
            <div className="space-y-6">
              {/* User Profile Card */}
              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <h2 className="text-xl font-semibold text-white mb-4">Your Profile</h2>
                <div className="flex items-center space-x-4">
                  {user.picture && (
                    <img
                      src={user.picture}
                      alt="Profile"
                      className="w-16 h-16 rounded-full border-2 border-white/20"
                    />
                  )}
                  <div className="text-white">
                    <div className="font-medium text-lg">{user.name || 'Anonymous User'}</div>
                    <div className="text-white/70">{user.email}</div>
                    {user.emailVerified && (
                      <div className="text-green-300 text-sm mt-1">✓ Email verified</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <button
                  onClick={() => window.location.href = '/handbook'}
                  className="bg-white/10 hover:bg-white/20 rounded-lg p-6 text-center transition-all border border-white/10 hover:border-white/20"
                >
                  <div className="text-3xl mb-2">📚</div>
                  <div className="text-white font-medium">Medical Handbook</div>
                  <div className="text-white/70 text-sm">Clinical guidelines & protocols</div>
                </button>

                <button
                  onClick={() => window.location.href = '/opd'}
                  className="bg-white/10 hover:bg-white/20 rounded-lg p-6 text-center transition-all border border-white/10 hover:border-white/20"
                >
                  <div className="text-3xl mb-2">🏥</div>
                  <div className="text-white font-medium">OPD Module</div>
                  <div className="text-white/70 text-sm">Outpatient workflows</div>
                </button>

                <button
                  onClick={() => window.location.href = '/tools'}
                  className="bg-white/10 hover:bg-white/20 rounded-lg p-6 text-center transition-all border border-white/10 hover:border-white/20"
                >
                  <div className="text-3xl mb-2">⚙️</div>
                  <div className="text-white font-medium">Clinical Tools</div>
                  <div className="text-white/70 text-sm">Calculators & utilities</div>
                </button>
              </div>

              {/* Logout */}
              <div className="text-center">
                <LogoutButton className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-white rounded-lg border border-red-500/30 hover:border-red-500/50 transition-all" />
              </div>
            </div>
          ) : (
            <div className="text-center space-y-6">
              <div className="text-white/80 text-lg">
                Please sign in to access your personalized dashboard
              </div>
              <LoginButton className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-lg font-medium transition-all shadow-lg" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
