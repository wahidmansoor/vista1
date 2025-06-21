/**
 * Metadata Footer Component
 * Displays protocol metadata and version information
 */

import React from 'react';
import { Calendar, User, FileText, GitBranch } from 'lucide-react';

interface MetadataFooterProps {
  protocol?: any;
}

export const MetadataFooter: React.FC<MetadataFooterProps> = ({ protocol }) => {
  if (!protocol) {
    return null;
  }

  return (
    <div className="bg-gray-50 border-t p-4 space-y-3">
      <h4 className="font-medium text-gray-900 flex items-center">
        <FileText className="h-4 w-4 mr-2" />
        Protocol Information
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
        {protocol.version && (
          <div className="flex items-center space-x-2">
            <GitBranch className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">Version:</span>
            <span className="font-medium">{protocol.version}</span>
          </div>
        )}
        
        {protocol.last_updated && (
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">Updated:</span>
            <span className="font-medium">{new Date(protocol.last_updated).toLocaleDateString()}</span>
          </div>
        )}
        
        {protocol.created_by && (
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">Author:</span>
            <span className="font-medium">{protocol.created_by}</span>
          </div>
        )}
        
        {protocol.guideline_source && (
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">Source:</span>
            <span className="font-medium">{protocol.guideline_source}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetadataFooter;
