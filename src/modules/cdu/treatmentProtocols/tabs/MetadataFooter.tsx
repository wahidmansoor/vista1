import React from 'react';
import { CalendarDays, Calendar, User, BookOpen, RefreshCcw } from 'lucide-react';
import { formatDate } from '@/utils/dateUtils';
import type { Protocol } from '@/types/protocol';

interface MetadataFooterProps {
  protocol: Protocol;
  className?: string;
}

const MetadataFooter: React.FC<MetadataFooterProps> = ({ protocol, className = '' }) => {
  // Format dates if they exist
  const createdDate = protocol.created_at ? formatDate(protocol.created_at) : 'Unknown';
  const updatedDate = protocol.updated_at ? formatDate(protocol.updated_at) : 'Unknown';
  const reviewDate = protocol.next_review_date ? formatDate(protocol.next_review_date) : 'Not set';
  
  return (
    <div className={`border-t border-gray-200 dark:border-gray-800 pt-4 mt-6 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center space-x-2">
          <CalendarDays className="h-4 w-4" />
          <span>Created: {createdDate}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <RefreshCcw className="h-4 w-4" />
          <span>Updated: {updatedDate}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4" />
          <span>Next review: {reviewDate}</span>
        </div>
        
        {protocol.author && (
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Author: {protocol.author}</span>
          </div>
        )}
          {protocol.version && (
          <div className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4" />
            <span>Version: {protocol.version}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export { MetadataFooter };
