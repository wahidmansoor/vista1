import React from 'react';
import { TocEntry } from './types/handbook';

interface HandbookSidebarProps {
  section: string;
  tocData: TocEntry[];
  activeTopicId?: string | null;
  onTopicClick: (section: string, topic: string) => void;
}

export const HandbookSidebar: React.FC<HandbookSidebarProps> = ({
  section,
  tocData,
  activeTopicId,
  onTopicClick,
}) => {
  if (!section || !tocData) {
    return null;
  }

  const renderTocItems = (items: TocEntry[], depth = 0) => {
    return items.map((item, index) => (
      <li key={`${item.path || item.title}-${index}`} className={`ml-${depth * 4}`}>
        {item.path ? (
          <button
            onClick={() => onTopicClick(section, item.path)}
            className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors
              ${activeTopicId === `${section}/${item.path}`
                ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                : 'text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-300 hover:bg-purple-50/50 dark:hover:bg-purple-900/10'
              }`}
          >
            {item.title}
          </button>
        ) : (
          <div className="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400">
            {item.title}
          </div>
        )}
        {item.items && item.items.length > 0 && (
          <ul className="mt-1 space-y-1">
            {renderTocItems(item.items, depth + 1)}
          </ul>
        )}
      </li>
    ));
  };

  return (
    <div className="w-80 flex-shrink-0 border-r border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Table of Contents
        </h2>
        <nav className="space-y-1">
          <ul className="space-y-1">
            {renderTocItems(tocData)}
          </ul>
        </nav>
      </div>
    </div>
  );
};