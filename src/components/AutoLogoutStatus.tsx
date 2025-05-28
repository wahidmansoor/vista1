import React from 'react';
import { useAutoLogoutContext } from '../providers/AutoLogoutProvider';

/**
 * Component to display auto-logout status in the header or dashboard
 * Shows remaining time and provides extend session functionality
 */
const AutoLogoutStatus: React.FC = () => {
  const { timeRemaining, isWarningShown, extendSession } = useAutoLogoutContext();

  // Don't show if no warning is shown yet (more than 2 minutes remaining)
  if (!isWarningShown) {
    return null;
  }

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
      <span className="text-amber-600">⏰</span>
      <span>Session expires in {formatTime(timeRemaining)}</span>
      <button
        onClick={extendSession}
        className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-amber-100 hover:bg-amber-200 rounded border border-amber-300 transition-colors"
        title="Extend your session"
      >
        <span className="text-amber-700">🔄</span>
        Extend
      </button>
    </div>
  );
};

export default AutoLogoutStatus;
