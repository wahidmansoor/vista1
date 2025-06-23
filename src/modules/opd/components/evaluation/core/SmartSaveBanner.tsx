import React, { useEffect, useState } from 'react';
import { Save, Check, AlertCircle, Wifi, WifiOff, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error' | 'offline';

interface SmartSaveBannerProps {
  status: SaveStatus;
  lastSaved?: Date;
  autoSaveEnabled?: boolean;
  onManualSave?: () => void;
  onToggleAutoSave?: () => void;
  hasUnsavedChanges?: boolean;
  errorMessage?: string;
  className?: string;
  showDetailedStatus?: boolean;
}

const formatLastSaved = (date: Date): string => {
  const now = new Date();
  const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffMinutes < 1) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  
  return date.toLocaleDateString();
};

const getStatusConfig = (status: SaveStatus) => {
  switch (status) {
    case 'saving':
      return {
        icon: Save,
        color: 'bg-blue-50 border-blue-200 text-blue-800',
        badgeColor: 'bg-blue-100 text-blue-800',
        message: 'Saving changes...',
        spinning: true
      };
    case 'saved':
      return {
        icon: Check,
        color: 'bg-green-50 border-green-200 text-green-800',
        badgeColor: 'bg-green-100 text-green-800',
        message: 'All changes saved',
        spinning: false
      };
    case 'error':
      return {
        icon: AlertCircle,
        color: 'bg-red-50 border-red-200 text-red-800',
        badgeColor: 'bg-red-100 text-red-800',
        message: 'Failed to save',
        spinning: false
      };
    case 'offline':
      return {
        icon: WifiOff,
        color: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        badgeColor: 'bg-yellow-100 text-yellow-800',
        message: 'Working offline',
        spinning: false
      };
    default:
      return {
        icon: Clock,
        color: 'bg-gray-50 border-gray-200 text-gray-800',
        badgeColor: 'bg-gray-100 text-gray-800',
        message: 'Ready to save',
        spinning: false
      };
  }
};

export const SmartSaveBanner: React.FC<SmartSaveBannerProps> = ({
  status,
  lastSaved,
  autoSaveEnabled = true,
  onManualSave,
  onToggleAutoSave,
  hasUnsavedChanges = false,
  errorMessage,
  className,
  showDetailedStatus = true
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeDisplay, setTimeDisplay] = useState<string>('');
  
  const config = getStatusConfig(status);
  const IconComponent = config.icon;
  
  // Update time display every minute
  useEffect(() => {
    if (!lastSaved) return;
    
    const updateTime = () => {
      setTimeDisplay(formatLastSaved(lastSaved));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [lastSaved]);
  
  // Show banner when there are status changes or unsaved changes
  useEffect(() => {
    if (status !== 'idle' || hasUnsavedChanges) {
      setIsVisible(true);
    } else {
      // Hide after successful save
      const timer = setTimeout(() => setIsVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [status, hasUnsavedChanges]);
  
  if (!isVisible && status === 'idle' && !hasUnsavedChanges) {
    return null;
  }
  
  return (
    <div className={cn(
      "sticky top-0 z-40 border-b transition-all duration-300 ease-in-out",
      config.color,
      className
    )}>
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <IconComponent 
                className={cn(
                  "h-4 w-4",
                  config.spinning && "animate-spin"
                )} 
              />
              <span className="text-sm font-medium">
                {config.message}
              </span>
            </div>
            
            {showDetailedStatus && (
              <div className="flex items-center space-x-2 text-xs opacity-80">
                {lastSaved && (
                  <span>Last saved {timeDisplay}</span>
                )}
                
                {status === 'error' && errorMessage && (
                  <span>• {errorMessage}</span>
                )}
                
                {hasUnsavedChanges && (
                  <Badge variant="outline" className={config.badgeColor}>
                    Unsaved changes
                  </Badge>
                )}
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Auto-save toggle */}
            {onToggleAutoSave && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleAutoSave}
                className="text-xs h-7"
              >
                Auto-save: {autoSaveEnabled ? 'ON' : 'OFF'}
              </Button>
            )}
            
            {/* Manual save button */}
            {onManualSave && (
              <Button
                variant="outline"
                size="sm"
                onClick={onManualSave}
                disabled={status === 'saving' || (!hasUnsavedChanges && status !== 'error')}
                className="text-xs h-7"
              >
                <Save className="h-3 w-3 mr-1" />
                {status === 'saving' ? 'Saving...' : 'Save Now'}
              </Button>
            )}
            
            {/* Network status indicator */}
            <div className="flex items-center space-x-1">
              {status === 'offline' ? (
                <WifiOff className="h-3 w-3 text-yellow-600" />
              ) : (
                <Wifi className="h-3 w-3 text-green-600" />
              )}
            </div>
          </div>
        </div>
        
        {/* Progress bar for saving */}
        {status === 'saving' && (
          <div className="mt-2">
            <div className="w-full bg-blue-200 rounded-full h-1">
              <div className="bg-blue-600 h-1 rounded-full animate-pulse" style={{ width: '60%' }} />
            </div>
          </div>
        )}
        
        {/* Detailed error message */}
        {status === 'error' && errorMessage && showDetailedStatus && (
          <div className="mt-2 p-2 bg-red-100 border border-red-200 rounded text-xs text-red-700">
            <strong>Error:</strong> {errorMessage}
            {onManualSave && (
              <Button
                variant="link"
                size="sm"
                onClick={onManualSave}
                className="ml-2 text-xs h-auto p-0 text-red-700 underline"
              >
                Try again
              </Button>
            )}
          </div>
        )}
        
        {/* Offline mode information */}
        {status === 'offline' && showDetailedStatus && (
          <div className="mt-2 p-2 bg-yellow-100 border border-yellow-200 rounded text-xs text-yellow-700">
            <strong>Offline Mode:</strong> Changes are saved locally and will sync when connection is restored.
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartSaveBanner;
