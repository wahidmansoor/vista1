// d:\Mansoor\tick-toc\src\modules\cdu\treatmentProtocols\tabs\MetadataFooter.tsx
import React from 'react';
import { Protocol } from '@/types/protocol';
import { format } from 'date-fns'; // Using date-fns for date formatting

interface MetadataFooterProps {
  protocol: Protocol;
}

const MetadataItem: React.FC<{ label: string; value?: string | number | null }> = ({ label, value }) => {
  if (value === undefined || value === null || value === '') {
    return null; // Don't render if value is not present
  }
  return (
    <div>
      <span className="font-semibold text-gray-700 dark:text-gray-300">{label}: </span>
      <span className="text-gray-600 dark:text-gray-400">{String(value)}</span>
    </div>
  );
};

const formatDate = (dateString?: string) => {
  if (!dateString) return "N/A";
  try {
    return format(new Date(dateString), "PPPpp"); // e.g., Jun 20th, 2023, 4:30 PM
  } catch {
    return dateString; // Return original if parsing fails
  }
};

export const MetadataFooter: React.FC<MetadataFooterProps> = ({ protocol }) => {
  // Fields: created_at, updated_at, last_reviewed, created_by, updated_by, id, version
  return (
    <div className="text-xs text-muted-foreground bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
      <h4 className="font-semibold text-sm mb-2 text-gray-800 dark:text-gray-200">Protocol Metadata</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2">
        <MetadataItem label="Protocol ID" value={protocol.id} />
        <MetadataItem label="Version" value={protocol.version} />
        <MetadataItem label="Created By" value={protocol.created_by} />
        <MetadataItem label="Last Updated By" value={protocol.updated_by} />
        <MetadataItem label="Created At" value={formatDate(protocol.created_at)} />
        <MetadataItem label="Last Updated At" value={formatDate(protocol.updated_at)} />
        <MetadataItem label="Last Reviewed" value={formatDate(protocol.last_reviewed)} />
      </div>
    </div>
  );
};
