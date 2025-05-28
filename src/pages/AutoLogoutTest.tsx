import React, { useState } from 'react';
import { useAutoLogoutContext } from '@/providers/AutoLogoutProvider';

/**
 * Test page to demonstrate auto-logout functionality
 * This page shows the current auto-logout state and allows manual testing
 */
const AutoLogoutTest: React.FC = () => {
  const { 
    timeRemaining, 
    showWarning, 
    extendSession, 
    logout,
    isActive 
  } = useAutoLogoutContext();
  
  const [activityCount, setActivityCount] = useState(0);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleTestActivity = () => {
    setActivityCount(prev => prev + 1);
    // Activity tracking is automatic through mouse/keyboard events
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          🔒 Auto-Logout Test Page
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Status Card */}
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h2 className="text-xl font-semibold text-blue-900 mb-4 flex items-center gap-2">
              <span>📊</span> Session Status
            </h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-blue-700">Session Active:</span>
                <span className={`font-medium ${isActive ? 'text-green-600' : 'text-red-600'}`}>
                  {isActive ? '✅ Active' : '❌ Inactive'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-blue-700">Time Remaining:</span>
                <span className="font-mono text-lg font-bold text-blue-900">
                  {formatTime(timeRemaining)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-blue-700">Warning Shown:</span>
                <span className={`font-medium ${showWarning ? 'text-amber-600' : 'text-green-600'}`}>
                  {showWarning ? '⚠️ Yes' : '✅ No'}
                </span>
              </div>
            </div>
          </div>

          {/* Controls Card */}
          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            <h2 className="text-xl font-semibold text-green-900 mb-4 flex items-center gap-2">
              <span>🎮</span> Test Controls
            </h2>
            
            <div className="space-y-4">
              <button
                onClick={handleTestActivity}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Simulate Activity ({activityCount})
              </button>
              
              <button
                onClick={extendSession}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                🔄 Extend Session
              </button>
              
              <button
                onClick={logout}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                🚪 Force Logout
              </button>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-amber-50 rounded-lg p-6 border border-amber-200">
          <h2 className="text-xl font-semibold text-amber-900 mb-4 flex items-center gap-2">
            <span>📋</span> Test Instructions
          </h2>
          
          <div className="text-amber-800 space-y-2">
            <p><strong>1. Automatic Activity Detection:</strong> Move your mouse or press keys to reset the timer</p>
            <p><strong>2. Session Timeout:</strong> Default is 10 minutes, warning appears at 2 minutes remaining</p>
            <p><strong>3. Warning Modal:</strong> A modal will appear when time remaining is less than 2 minutes</p>
            <p><strong>4. Status Display:</strong> Check the header for the auto-logout status indicator</p>
            <p><strong>5. Force Testing:</strong> Use the "Force Logout" button to test logout functionality</p>
          </div>
        </div>

        {/* Technical Details */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 mt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span>⚙️</span> Technical Details
          </h2>
          
          <div className="text-gray-700 text-sm space-y-1">
            <p>• Auto-logout is configured for 10 minutes of inactivity</p>
            <p>• Warning appears 2 minutes before logout</p>
            <p>• Activity is tracked via mouse movement, clicks, and keyboard events</p>
            <p>• Session extension resets the timer back to full duration</p>
            <p>• Logout uses Auth0's logout functionality</p>
            <p>• Component is wrapped in AutoLogoutProvider for global state</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoLogoutTest;
