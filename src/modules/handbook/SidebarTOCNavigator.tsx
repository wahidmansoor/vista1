import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TocEntry {
  title: string;
  path?: string;
  items?: TocEntry[];
}

interface Props {
  tocData: TocEntry[];
  onSelect?: (path: string) => void;
  activePath?: string;
}

export function SidebarTOCNavigator({ tocData, onSelect, activePath }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [currentContext, setCurrentContext] = useState<string>('');

  // Auto-expand parent sections of active path
  useEffect(() => {
    if (activePath) {
      const pathParts = activePath.split('/').filter(Boolean);
      let currentPath = '';
      pathParts.forEach(part => {
        currentPath += `/${part}`;
        setExpandedSections(prev => new Set([...prev, currentPath]));
      });
    }
  }, [activePath]);

  const toggleSection = (path: string | undefined) => {
    if (!path) return;

    // Track parent section paths when toggling
    const pathParts = path.split('/').filter(Boolean);
    let currentPath = '';
    
    setExpandedSections(prev => {
      const next = new Set(prev);
      
      if (next.has(path)) {
        // When collapsing, also collapse any child sections
        for (const existing of next) {
          if (existing.startsWith(path)) {
            next.delete(existing);
          }
        }
      } else {
        // When expanding, ensure all parent sections are expanded too
        pathParts.forEach(part => {
          currentPath += `/${part}`;
          next.add(currentPath);
        });
      }
      
      return next;
    });
    
    // Update current context for child items
    setCurrentContext(path);
  };

  // Path normalization helper
  const normalizeEntryPath = (entry: TocEntry, parentPath: string = ''): TocEntry => {
    let normalized = { ...entry };
    
    if (entry.path !== undefined && typeof entry.path !== 'string') {
      console.warn('⚠️ Invalid path type:', entry);
      normalized.path = undefined;
      return normalized;
    }
    
    // If path is provided, normalize it
    if (entry.path) {
      try {
        // Use parent path as context for nested items
        const context = parentPath || currentContext;
        
        // Remove any leading/trailing slashes and normalize
        const cleanPath = entry.path.trim().replace(/^\/+|\/+$/g, '');
        
        if (!cleanPath) {
          console.warn('⚠️ Empty path after cleaning:', entry);
          normalized.path = undefined;
        } else if (!cleanPath.includes('/')) {
          // Short path - prepend context
          normalized.path = `${context}/${cleanPath}`.toLowerCase().replace(/\s+/g, '-').replace(/\/+/g, '/');
          console.log('✅ Normalized short path:', normalized.path);
        } else {
          // Full path - just normalize
          normalized.path = cleanPath.toLowerCase().replace(/\s+/g, '-').replace(/\/+/g, '/');
          console.log('✅ Normalized full path:', normalized.path);
        }
        
        // Validate final path format
        if (normalized.path && !/^[\w-/]+$/.test(normalized.path)) {
          console.warn('⚠️ Invalid characters in path:', normalized.path);
          normalized.path = undefined;
        }
      } catch (err) {
        console.error('❌ Path normalization error:', err);
        normalized.path = undefined;
      }
    }
    
    // Recursively normalize children with current normalized path as context
    if (normalized.items) {
      const itemContext = normalized.path || parentPath;
      normalized.items = normalized.items
        .map(item => normalizeEntryPath(item, itemContext))
        .filter(item => item !== null);
    }
    
    return normalized;
  };

  // Normalize TOC data before filtering
  const normalizedTocData = tocData.map(entry => normalizeEntryPath(entry));

  const filterTocData = (data: TocEntry[]): TocEntry[] => {
    return data.reduce<TocEntry[]>((acc, entry) => {
      const matches = entry.title.toLowerCase().includes(searchQuery.toLowerCase());
      const filteredChildren = entry.items ? filterTocData(entry.items) : undefined;

      if (matches || (filteredChildren && filteredChildren.length > 0)) {
        acc.push({
          ...entry,
          items: filteredChildren
        });
      }

      return acc;
    }, []);
  };

  const filteredData = searchQuery ? filterTocData(normalizedTocData) : normalizedTocData;

  // Enhance handleSelect to provide better feedback for invalid paths
  const handleSelect = (path: string | undefined) => {
    console.log('handleSelect called with path:', path); // Debug log

    // Add guard for empty/invalid paths
    if (!path || typeof path !== 'string') {
      console.warn('⚠️ Invalid or missing topic path');
      alert('This topic has no valid content to display.');
      return;
    }

    // Clean and validate the path
    try {
      const normalizedPath = path.startsWith('/') ? path : `/${path}`.replace(/\/+/g, '/');

      // Basic path validation
      if (!/^\/[\w-/]+$/.test(normalizedPath)) {
        console.warn('⚠️ Invalid path format:', normalizedPath);
        alert('Invalid path format. Please try another topic.');
        return;
      }

      console.log('✅ Navigating to:', normalizedPath);
      onSelect?.(normalizedPath);
    } catch (err) {
      console.error('❌ Path processing error:', err);
      alert('An error occurred while processing the path.');
    }
  };

  // Add UI indicators for invalid or inactive paths
  const renderTocItem = (entry: TocEntry, level = 0, parentKey = '') => {
    const isValidEntry = entry.title && (!entry.path || (typeof entry.path === 'string' && /^[\w-/]+$/.test(entry.path)));

    const hasChildren = entry.items && entry.items.length > 0;
    const isActive = entry.path === activePath;
    const shouldExpand = hasChildren && (
      expandedSections.has(entry.path || '') || 
      (entry.items?.some(child => child.path === activePath)) ||
      searchQuery.length > 0
    );

    const key = `toc-${entry.path || `${parentKey}-${entry.title}`}-${level}`;

    if (!isValidEntry) {
      return (
        <div key={key} className="w-full opacity-50" title="Invalid navigation entry">
          <div className={cn(
            'flex items-center w-full px-4 py-2 rounded-lg',
            'text-gray-400 dark:text-gray-600',
            level > 0 && 'ml-4'
          )}>
            <span className="w-6 mr-2" />
            <span className="flex-1 text-left py-1 text-sm line-through">
              {entry.title || 'Invalid Entry'}
            </span>
          </div>
        </div>
      );
    }

    return (
      <div key={key} className="w-full">
        <motion.div
          initial={false}
          animate={{ backgroundColor: isActive ? 'rgba(124, 58, 237, 0.1)' : 'transparent' }}
          className={cn(
            'flex items-center w-full px-4 py-2 rounded-lg transition-colors',
            'hover:bg-gray-100 dark:hover:bg-gray-800',
            isActive && 'bg-purple-100/50 dark:bg-purple-900/20',
            level > 0 && 'ml-4'
          )}
        >
          {hasChildren ? (
            <button
              onClick={() => toggleSection(entry.path)}
              className="p-1 mr-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              title={shouldExpand ? "Collapse section" : "Expand section"}
            >
              {shouldExpand ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
            </button>
          ) : (
            <span className="w-6 mr-2" />
          )}

          <button
            onClick={() => handleSelect(entry.path)}
            className={cn(
              'flex-1 text-left py-1 text-sm',
              isActive ? 'text-purple-600 dark:text-purple-400 font-medium' : 'text-gray-700 dark:text-gray-300',
              !entry.path && 'cursor-default opacity-75'
            )}
            title={!entry.path ? "This entry has no associated content" : undefined}
          >
            {entry.title}
          </button>
        </motion.div>

        {hasChildren && shouldExpand && (
          <AnimatePresence>
            <motion.div
              key={`children-${key}`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              {entry.items!.map(child => renderTocItem(child, level + 1, key))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    );
  };

  return (
    <div className="w-80 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 h-full overflow-hidden flex flex-col">
      {/* Search */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              'w-full pl-10 pr-4 py-2 text-sm rounded-lg',
              'bg-gray-50 dark:bg-gray-800',
              'border border-gray-200 dark:border-gray-700',
              'focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400',
              'placeholder-gray-400 dark:placeholder-gray-500'
            )}
          />
        </div>
      </div>

      {/* TOC Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        <AnimatePresence>
          {filteredData.length > 0 ? (
            filteredData.map(entry => renderTocItem(entry, 0, 'root'))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-gray-500 dark:text-gray-400 py-8"
            >
              No topics found
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
