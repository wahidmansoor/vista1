import React from 'react';
import { Dialog } from '@headlessui/react';

interface AutoLogoutWarningProps {
  isOpen: boolean;
  timeRemaining: number;
  onExtendSession: () => void;
  onLogoutNow: () => void;
}

const AutoLogoutWarning: React.FC<AutoLogoutWarningProps> = ({
  isOpen,
  timeRemaining,
  onExtendSession,
  onLogoutNow
}) => {
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={isOpen} onClose={() => {}} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />

      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md rounded-xl bg-white p-6 shadow-2xl ring-1 ring-gray-200">          <div className="flex items-center gap-3 mb-4">
            <div className="flex-shrink-0">
              <span className="text-2xl">⏰</span>
            </div>
            <div>
              <Dialog.Title className="text-lg font-semibold text-gray-900">
                Session Timeout Warning
              </Dialog.Title>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-gray-600 mb-3">
              Your session will expire due to inactivity. You will be automatically logged out in:
            </p>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-50 border-4 border-amber-200 mb-2">
                <span className="text-2xl font-bold text-amber-700">
                  {formatTime(timeRemaining)}
                </span>
              </div>
              <p className="text-sm text-gray-500">minutes:seconds</p>
            </div>
          </div>

          <div className="flex gap-3">            <button
              onClick={onExtendSession}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <span>🔄</span>
              Stay Logged In
            </button>
              <button
              onClick={onLogoutNow}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <span>🚪</span>
              Logout Now
            </button>
          </div>

          <div className="mt-4 p-3 bg-amber-50 rounded-lg">
            <p className="text-xs text-amber-800">
              <strong>Security Notice:</strong> This timeout helps protect your data when you step away from your computer.
            </p>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AutoLogoutWarning;
