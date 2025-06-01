import React, { createContext, useContext } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useAutoLogout } from '../hooks/useAutoLogout';
import AutoLogoutWarning from '../components/AutoLogoutWarning';

interface AutoLogoutContextType {
  timeRemaining: number;
  isWarningShown: boolean;
  showWarning: boolean;
  isActive: boolean;
  extendSession: () => void;
  logout: () => void;
}

const AutoLogoutContext = createContext<AutoLogoutContextType | null>(null);

interface AutoLogoutProviderProps {
  children: React.ReactNode;
  timeoutMinutes?: number;
  warningMinutes?: number;
  showWarningModal?: boolean;
}

export const AutoLogoutProvider: React.FC<AutoLogoutProviderProps> = ({
  children,
  timeoutMinutes = 10,
  warningMinutes = 2,
  showWarningModal = true
}) => {
  const { isAuthenticated } = useAuth0();
  
  const {
    timeRemaining,
    isWarningShown,
    extendSession,
    logout
  } = useAutoLogout({
    timeoutMinutes,
    warningMinutes,
    enableWarning: showWarningModal,
    onWarning: () => {
      // Optional: Play a sound or show a browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Session Timeout Warning', {
          body: `Your session will expire in ${warningMinutes} minutes due to inactivity.`,
          icon: '/icons/mine.png'
        });
      }
    },
    onLogout: () => {
      // Optional: Show a toast or notification
      console.log('User logged out due to inactivity');
    }
  });
  const contextValue: AutoLogoutContextType = {
    timeRemaining,
    isWarningShown,
    showWarning: isWarningShown,
    isActive: isAuthenticated && timeRemaining > 0,
    extendSession,
    logout
  };

  return (
    <AutoLogoutContext.Provider value={contextValue}>
      {children}
      
      {/* Show warning modal only if user is authenticated and warning is enabled */}
      {isAuthenticated && showWarningModal && (
        <AutoLogoutWarning
          isOpen={isWarningShown}
          timeRemaining={timeRemaining}
          onExtendSession={extendSession}
          onLogoutNow={logout}
        />
      )}
    </AutoLogoutContext.Provider>
  );
};

export const useAutoLogoutContext = (): AutoLogoutContextType => {
  const context = useContext(AutoLogoutContext);
  if (!context) {
    throw new Error('useAutoLogoutContext must be used within an AutoLogoutProvider');
  }
  return context;
};

export default AutoLogoutProvider;
