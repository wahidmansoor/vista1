import React from 'react';
import { AlertTriangle, X, Check, Info } from 'lucide-react';

/**
 * Props for the AlertBanner component
 */
export interface AlertBannerProps {
  /**
   * Type of alert
   */
  type: 'warning' | 'error' | 'success' | 'info';
  
  /**
   * Title of the alert
   */
  title: string;
  
  /**
   * Message to display in the alert
   */
  message: string | string[];
  
  /**
   * Optional className for custom styling
   */
  className?: string;
}

/**
 * A reusable alert banner component that displays different types of alerts
 */
const AlertBanner: React.FC<AlertBannerProps> = ({ 
  type, 
  title, 
  message,
  className = ''
}) => {
  const colors = {
    warning: 'bg-yellow-50 border-yellow-400 text-yellow-800',
    error: 'bg-red-50 border-red-400 text-red-800',
    success: 'bg-green-50 border-green-400 text-green-800',
    info: 'bg-blue-50 border-blue-400 text-blue-800'
  };

  const icons = {
    warning: <AlertTriangle className="w-5 h-5 mr-2" />,
    error: <X className="w-5 h-5 mr-2" />,
    success: <Check className="w-5 h-5 mr-2" />,
    info: <Info className="w-5 h-5 mr-2" />
  };

  const messageArray = Array.isArray(message) ? message : [message];

  return (
    <div className={`p-4 mb-4 border-l-4 rounded-r ${colors[type]} ${className}`}>
      <div className="flex items-center">
        {icons[type]}
        <h3 className="font-semibold">{title}</h3>
      </div>
      <div className="mt-2">
        {messageArray.map((msg, i) => (
          <p key={i} className="text-sm leading-snug">{msg}</p>
        ))}
      </div>
    </div>
  );
};

export default AlertBanner; 