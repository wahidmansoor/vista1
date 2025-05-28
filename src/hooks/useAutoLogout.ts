import { useEffect, useCallback, useRef, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

interface UseAutoLogoutOptions {
  timeoutMinutes?: number;
  warningMinutes?: number;
  onWarning?: () => void;
  onLogout?: () => void;
  enableWarning?: boolean;
}

interface UseAutoLogoutReturn {
  timeRemaining: number;
  isWarningShown: boolean;
  extendSession: () => void;
  logout: () => void;
}

export const useAutoLogout = ({
  timeoutMinutes = 10,
  warningMinutes = 2,
  onWarning,
  onLogout,
  enableWarning = true
}: UseAutoLogoutOptions = {}): UseAutoLogoutReturn => {
  const { logout: auth0Logout, isAuthenticated } = useAuth0();
  const [timeRemaining, setTimeRemaining] = useState(timeoutMinutes * 60);
  const [isWarningShown, setIsWarningShown] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const warningTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const lastActivityRef = useRef<number>(Date.now());

  const resetTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
    setTimeRemaining(timeoutMinutes * 60);
    setIsWarningShown(false);

    // Clear existing timers
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);

    // Only set timers if user is authenticated
    if (!isAuthenticated) return;

    // Set warning timer
    if (enableWarning && warningMinutes > 0) {
      warningTimeoutRef.current = setTimeout(() => {
        setIsWarningShown(true);
        onWarning?.();
      }, (timeoutMinutes - warningMinutes) * 60 * 1000);
    }

    // Set logout timer
    timeoutRef.current = setTimeout(() => {
      handleLogout();
    }, timeoutMinutes * 60 * 1000);

    // Set countdown interval
    intervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - lastActivityRef.current) / 1000);
      const remaining = Math.max(0, timeoutMinutes * 60 - elapsed);
      setTimeRemaining(remaining);

      if (remaining <= 0) {
        handleLogout();
      }
    }, 1000);
  }, [timeoutMinutes, warningMinutes, enableWarning, onWarning, isAuthenticated]);

  const handleLogout = useCallback(() => {
    onLogout?.();
    auth0Logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  }, [auth0Logout, onLogout]);

  const extendSession = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  const logout = useCallback(() => {
    handleLogout();
  }, [handleLogout]);

  // Track user activity
  useEffect(() => {
    if (!isAuthenticated) return;

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const handleActivity = () => {
      resetTimer();
    };

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Initialize timer
    resetTimer();

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAuthenticated, resetTimer]);

  // Clear timers when component unmounts or user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsWarningShown(false);
      setTimeRemaining(timeoutMinutes * 60);
    }
  }, [isAuthenticated, timeoutMinutes]);

  return {
    timeRemaining,
    isWarningShown,
    extendSession,
    logout
  };
};

export default useAutoLogout;
