import React from 'react';
import { cn } from '../../../../../lib/utils';

interface LegalItemProps {
  requirement: string;
  description: string;
  mandatory?: boolean;
}

export const LegalItem: React.FC<LegalItemProps> = ({
  requirement,
  description,
  mandatory = false,
}) => {
  return (
    <div className={cn(
      'rounded-lg p-3 sm:p-4',
      mandatory 
        ? 'bg-red-50 dark:bg-red-900/20' 
        : 'bg-gray-50 dark:bg-gray-800'
    )}>
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <h5 className="text-sm sm:text-base font-medium text-gray-800 dark:text-gray-200">
            {requirement}
          </h5>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {description}
          </p>
        </div>
        {mandatory && (
          <span className="px-2 py-1 text-xs font-medium bg-red-100 dark:bg-red-900 
                        text-red-800 dark:text-red-200 rounded-full whitespace-nowrap flex-shrink-0">
            Required
          </span>
        )}
      </div>
    </div>
  );
};