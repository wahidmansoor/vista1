import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Search, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TocEntry {
  title: string;
  path?: string;
  items?: TocEntry[];
}

interface SidebarProps {
  section?: string;
  tocData: TocEntry[];
  activeTopicId?: string | null;
  onTopicClick: (section: string, topic: string) => void;
}

interface TOCSectionProps {
  entry: TocEntry;
  depth: number;
  isExpanded: boolean;
  isActive: boolean;
  section?: string;
  activeTopicId?: string | null;
  onToggle: () => void;
  onSelect: (path: string) => void;
}

const TOCSection: React.FC<TOCSectionProps> = ({
  entry,
  depth,
  isExpanded,
  isActive,
  section,
  activeTopicId,
  onToggle,
  onSelect,
}) => {
  const hasChildren = entry.items && entry.items.length > 0;
  
  // Handle active states for nested items
  const isActiveItem = entry.path && activeTopicId === entry.path;
  const hasActiveChild = hasChildren && entry.items?.some(item => 
    item.path === activeTopicId || 
    (item.items?.some(subItem => subItem.path === activeTopicId))
  );
  
  return (
    <div className="relative">
      <button
        onClick={() => hasChildren ? onToggle() : entry.path && onSelect(entry.path)}
        className={cn(
          "w-full text-left group flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200",
          "hover:bg-slate-100 dark:hover:bg-slate-800",
          (isActiveItem || hasActiveChild) && 
            "bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30",
          depth > 0 && "ml-4"
        )}
      >
        {hasChildren && (
          <motion.div
            initial={false}
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "text-slate-400",
              hasActiveChild && "text-indigo-500 dark:text-indigo-400"
            )}
          >
            <ChevronRight size={16} />
          </motion.div>
        )}
        <span
          className={cn(
            "flex-1 text-sm transition-colors",
            hasChildren ? "font-semibold" : "font-normal",
            (isActiveItem || hasActiveChild)
              ? "text-indigo-700 dark:text-indigo-300"
              : "text-slate-700 dark:text-slate-300",
            "group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
          )}
        >
          {entry.title}
        </span>
        
        {/* New or Updated badges */}
        {entry.path?.includes('new') && (
          <span className="px-1.5 py-0.5 text-[10px] font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full">
            New
          </span>
        )}
        {entry.path?.includes('updated') && (
          <span className="px-1.5 py-0.5 text-[10px] font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
            Updated
          </span>
        )}
      </button>

      {hasChildren && (
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="relative pl-4 before:absolute before:left-2 before:top-0 before:h-full before:w-px before:bg-slate-200 dark:before:bg-slate-700">
                {entry.items?.map((item, i) => (
                  <TocItem
                    key={`${item.title}-${i}`}
                    entry={item}
                    depth={depth + 1}
                    section={section}
                    activeTopicId={activeTopicId}
                    onSelect={onSelect}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

const TocItem: React.FC<{
  entry: TocEntry;
  depth: number;
  section?: string;
  activeTopicId?: string | null;
  onSelect: (path: string) => void;
}> = ({
  entry,
  depth,
  section,
  activeTopicId,
  onSelect,
}) => {
  // Auto-expand parent items that contain the active topic
  const [isExpanded, setIsExpanded] = useState(() => {
    if (!activeTopicId) return depth === 0;
    if (entry.items) {
      return entry.items.some(item => 
        item.path === activeTopicId ||
        (item.items?.some(subItem => subItem.path === activeTopicId))
      );
    }
    return false;
  });

  const hasChildren = entry.items && entry.items.length > 0;
  const isActive = entry.path === activeTopicId;

  return (
    <TOCSection
      entry={entry}
      depth={depth}
      isExpanded={isExpanded}
      isActive={isActive}
      section={section}
      activeTopicId={activeTopicId}
      onToggle={() => setIsExpanded(!isExpanded)}
      onSelect={onSelect}
    />
  );
};

export const HandbookSidebarNew: React.FC<SidebarProps> = ({
  section,
  tocData,
  activeTopicId,
  onTopicClick,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleTopicSelect = useCallback((path: string) => {
    if (section && path) {
      onTopicClick(section, path);
    }
  }, [section, onTopicClick]);

  const filteredData = useMemo(() => {
    if (!searchQuery) return tocData;

    const searchLower = searchQuery.toLowerCase();
    
    const filterItems = (items: TocEntry[]): TocEntry[] => {
      return items.reduce<TocEntry[]>((acc, item) => {
        if (item.title.toLowerCase().includes(searchLower)) {
          acc.push(item);
        } else if (item.items) {
          const filteredChildren = filterItems(item.items);
          if (filteredChildren.length > 0) {
            acc.push({ ...item, items: filteredChildren });
          }
        }
        return acc;
      }, []);
    };

    return filterItems(tocData);
  }, [tocData, searchQuery]);

  return (
    <div className="w-80 flex-shrink-0 border-r border-slate-200 dark:border-slate-800">
      {/* Search Bar */}
      <div className="sticky top-0 z-10 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 
                     bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100
                     placeholder:text-slate-400 dark:placeholder:text-slate-500
                     focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400
                     transition-all duration-200"
          />
        </div>
      </div>

      {/* TOC Content */}
      <div className="h-[calc(100vh-4rem)] p-4 space-y-2 overflow-y-auto 
                    scrollbar-thin scrollbar-track-transparent
                    scrollbar-thumb-slate-200 hover:scrollbar-thumb-slate-300
                    dark:scrollbar-thumb-slate-700 dark:hover:scrollbar-thumb-slate-600
                    scroll-smooth">
        {filteredData.length === 0 ? (
          <div className="flex items-center gap-2 p-4 text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            <AlertCircle size={16} />
            <span>No matching topics found</span>
          </div>
        ) : (
          filteredData.map((entry, index) => (
            <TocItem
              key={`${entry.title}-${index}`}
              entry={entry}
              depth={0}
              section={section}
              activeTopicId={activeTopicId}
              onSelect={handleTopicSelect}
            />
          ))
        )}
      </div>
    </div>
  );
};