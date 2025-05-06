import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Download } from 'lucide-react';

export interface ResourceDownload {
  id: string;
  title: string;
  description: string;
  fileType: string;
  downloadLink: string;
  lastUpdated: string;
  icon: React.ReactNode;
}

interface ResourceDownloadCardProps {
  resource: ResourceDownload;
}

export const ResourceDownloadCard: React.FC<ResourceDownloadCardProps> = ({ resource }) => {
  return (
    <Card className="overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg hover:scale-[1.01] transition-all duration-300">
      <CardContent className="p-0">
        <div className="flex flex-col h-full">
          {/* Top section with icon and title */}
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-indigo-50/30 to-purple-50/30 dark:from-indigo-950/30 dark:to-purple-950/30 border-b border-gray-200 dark:border-gray-700">
            <span className="text-indigo-500 dark:text-indigo-400 flex-shrink-0">{resource.icon}</span>
            <div>
              <h3 className="font-medium text-gray-800 dark:text-gray-200">{resource.title}</h3>
              <div className="flex items-center gap-1 mt-1 text-xs text-gray-500 dark:text-gray-400">
                <Calendar className="h-3 w-3" />
                <span>Updated: {resource.lastUpdated}</span>
              </div>
            </div>
            <Badge variant="outline" className="ml-auto bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 text-xs">
              {resource.fileType}
            </Badge>
          </div>
          
          {/* Description */}
          <div className="p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">{resource.description}</p>
          </div>
          
          {/* Download button */}
          <div className="mt-auto p-3 border-t border-gray-200 dark:border-gray-700">
            <a 
              href={resource.downloadLink}
              className="w-full flex items-center justify-center gap-2 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:hover:bg-indigo-800/50 text-indigo-700 dark:text-indigo-300 py-2 px-3 rounded-lg text-sm font-medium transition-colors"
            >
              <Download className="h-4 w-4" />
              Download
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};