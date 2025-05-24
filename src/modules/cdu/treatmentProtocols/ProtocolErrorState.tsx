import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ProtocolErrorStateProps {
  error: string;
  type?: 'error' | 'warning' | 'info';
}

const ProtocolErrorState: React.FC<ProtocolErrorStateProps> = ({ error, type = 'error' }) => {
  const bgColor = type === 'error' ? 'bg-red-50 dark:bg-red-900/10' 
    : type === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/10'
    : 'bg-blue-50 dark:bg-blue-900/10';

  const textColor = type === 'error' ? 'text-red-700 dark:text-red-200'
    : type === 'warning' ? 'text-yellow-700 dark:text-yellow-200'
    : 'text-blue-700 dark:text-blue-200';

  const iconColor = type === 'error' ? 'text-red-400 dark:text-red-300'
    : type === 'warning' ? 'text-yellow-400 dark:text-yellow-300'
    : 'text-blue-400 dark:text-blue-300';

  return (
    <div className={`rounded-lg p-4 ${bgColor}`}>
      <div className="flex items-center space-x-3">
        <AlertCircle className={`h-5 w-5 ${iconColor}`} />
        <div className={`text-sm font-medium ${textColor}`}>
          {error}
        </div>
      </div>
    </div>
  );
};

export default ProtocolErrorState;
