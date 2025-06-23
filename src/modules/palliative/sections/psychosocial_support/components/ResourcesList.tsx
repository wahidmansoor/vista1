import React from 'react';
import { FileText, BookOpen } from 'lucide-react';
import { ResourceDownload } from '../data/psychosocialData';

interface ResourcesListProps {
  resources: ResourceDownload[];
}

export const ResourcesList: React.FC<ResourcesListProps> = ({ resources }) => {
  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h3 className="text-lg font-medium bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-indigo-300 dark:to-purple-300 mb-2">
          Psychosocial Support Resources
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Download forms, templates, and resources to support your psychosocial care practice.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {resources.map((resource) => (
          <div key={resource.id} className="relative group">
            <div className="h-full overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
              <div className="p-4 bg-gradient-to-r from-indigo-50/30 to-purple-50/30 dark:from-indigo-950/30 dark:to-purple-950/30 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <span className="text-indigo-500 dark:text-indigo-400">{resource.icon}</span>
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200">{resource.title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Last updated: {resource.lastUpdated}</p>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">{resource.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                    {resource.fileType}
                  </span>
                  <a
                    href={resource.downloadLink}
                    className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                  >
                    Download →
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-indigo-50/50 dark:bg-indigo-950/50 rounded-lg p-4 border border-indigo-100 dark:border-indigo-900 mt-6">
        <div className="flex items-start gap-3">
          <BookOpen className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Resource Updates</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Resources are updated quarterly by the Psychosocial Support team. Contact the team for specific resources not listed here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};