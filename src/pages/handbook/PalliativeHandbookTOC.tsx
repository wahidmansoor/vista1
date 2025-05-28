import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiChevronDown, 
  HiChevronRight, 
  HiMagnifyingGlass, 
  HiBars3, 
  HiXMark,
  HiFunnel,
  HiTag,
  HiHeart,
  HiClock,
  HiStar
} from 'react-icons/hi2';
import { UniversalHandbookViewer } from '../../modules/handbook/UniversalHandbookViewer';
import { TocEntry } from '../../modules/handbook/types/handbook';
import { searchTocItems, filterByTags, extractAllTags, highlightMatch, SearchResult } from '@/utils/searchUtils';

const PalliativeHandbookTOC = () => {
  const [tocData, setTocData] = useState<TocEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showTagFilter, setShowTagFilter] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  // Enhanced search results using fuzzy matching
  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return searchTocItems(tocData as any[], searchTerm);
  }, [tocData, searchTerm]);

  // Available tags for filtering
  const availableTags = useMemo(() => {
    return extractAllTags(tocData as any[]);
  }, [tocData]);

  // Filtered TOC based on search and tags
  const displayToc = useMemo(() => {
    let filtered = tocData;
    
    // Apply tag filtering
    if (selectedTags.length > 0) {
      filtered = filterByTags(filtered as any[], selectedTags) as TocEntry[];
    }
    
    // Apply search filtering if no search results (fallback to simple search)
    if (searchTerm.trim() && searchResults.length === 0) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.items?.some(subItem => 
          subItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (subItem.items?.some(subSubItem => 
            subSubItem.title.toLowerCase().includes(searchTerm.toLowerCase())
          ))
        ))
      );
    }
    
    return filtered;
  }, [tocData, selectedTags, searchTerm, searchResults]);
  useEffect(() => {
    const loadTOC = async () => {
      try {
        setLoading(true);
        const response = await fetch('/palliative_care_handbook/toc.json');
        if (!response.ok) {
          throw new Error(`Failed to load TOC: ${response.statusText}`);
        }
        const data = await response.json();
        setTocData(data || []);
        
        // Expand first section by default
        if (data && data.length > 0) {
          setExpandedSections(new Set([data[0].title]));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load table of contents');
        console.error('Error loading TOC:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTOC();
  }, []);  // Recently viewed topics display
  const renderRecentlyViewed = () => {
    if (recentlyViewed.length === 0) return null;

    return (
      <div className="mb-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
        <h3 className="text-sm font-medium text-purple-800 dark:text-purple-200 mb-2 flex items-center">
          <HiClock className="w-4 h-4 mr-1" />
          Recently Viewed
        </h3>
        <div className="space-y-1">
          {recentlyViewed.slice(0, 3).map((path, index) => {
            // Find the topic title from the path
            const findTopicByPath = (items: TocEntry[]): string | null => {
              for (const item of items) {
                if (item.path === path) return item.title;
                if (item.items) {
                  const found = findTopicByPath(item.items);
                  if (found) return found;
                }
              }
              return null;
            };
            
            const title = findTopicByPath(tocData) || path;
            
            return (
              <div
                key={index}
                onClick={() => handleTopicSelect(path)}
                className="p-2 rounded cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-800/30 transition-colors"
              >
                <span className="text-sm text-purple-800 dark:text-purple-200">{title}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  const toggleSection = (sectionTitle: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionTitle)) {
        newSet.delete(sectionTitle);
      } else {
        newSet.add(sectionTitle);
      }
      return newSet;
    });
  };
  const handleTopicSelect = (path: string) => {
    setSelectedTopic(path);
    // Add to recently viewed
    setRecentlyViewed(prev => {
      const updated = [path, ...prev.filter(p => p !== path)].slice(0, 5);
      return updated;
    });
    // Close mobile menu when topic is selected
    setIsMobileMenuOpen(false);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTags([]);
  };

  // Render search results
  const renderSearchResults = () => {
    if (!searchTerm.trim() || searchResults.length === 0) return null;

    return (
      <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
            Search Results ({searchResults.length})
          </h3>
          <button
            onClick={() => setSearchTerm('')}
            className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
          >
            <HiXMark className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-1">
          {searchResults.slice(0, 10).map((result, index) => (
            <div
              key={index}
              onClick={() => result.item.path && handleTopicSelect(result.item.path)}
              className="p-2 rounded cursor-pointer hover:bg-green-100 dark:hover:bg-green-800/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span 
                  className="text-sm text-green-800 dark:text-green-200"
                  dangerouslySetInnerHTML={{ 
                    __html: highlightMatch(result.item.title, searchTerm) 
                  }}
                />
                <span className="text-xs text-green-600 dark:text-green-400 capitalize">
                  {result.matchType}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render tag filter
  const renderTagFilter = () => {
    if (availableTags.length === 0) return null;

    return (
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => setShowTagFilter(!showTagFilter)}
            className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400"
          >
            <HiFunnel className="w-4 h-4 mr-1" />
            Filter by Tags
            {showTagFilter ? (
              <HiChevronDown className="w-4 h-4 ml-1" />
            ) : (
              <HiChevronRight className="w-4 h-4 ml-1" />
            )}
          </button>
          {selectedTags.length > 0 && (
            <button
              onClick={clearFilters}
              className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Clear All
            </button>
          )}
        </div>
        
        <AnimatePresence>
          {showTagFilter && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap gap-1"
            >
              {availableTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-2 py-1 text-xs rounded-full transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  <HiTag className="w-3 h-3 inline mr-1" />
                  {tag}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const renderTocEntry = (entry: TocEntry, level: number = 0) => {
    const hasItems = entry.items && entry.items.length > 0;
    const isExpanded = expandedSections.has(entry.title);
    const isSelected = selectedTopic === entry.path;

    return (
      <div key={entry.title} className={`toc-entry level-${level}`}>
        <div
          className={`flex items-center cursor-pointer p-2 hover:bg-gray-50 rounded-md transition-colors ${
            isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : ''
          }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => {
            if (hasItems) {
              toggleSection(entry.title);
            } else if (entry.path) {
              handleTopicSelect(entry.path);
            }
          }}
        >
          {hasItems && (            <span className="mr-2 flex-shrink-0">
              {isExpanded ? (
                <HiChevronDown className="h-4 w-4 text-gray-500" />
              ) : (
                <HiChevronRight className="h-4 w-4 text-gray-500" />
              )}
            </span>
          )}
          <div className="flex-1 min-w-0">
            <div className={`font-medium text-gray-900 ${level === 0 ? 'text-lg' : 'text-base'}`}>
              {entry.title}
            </div>
          </div>
        </div>
        
        {hasItems && isExpanded && (
          <div className="toc-subsections">
            {entry.items!.map(item => 
              renderTocEntry(item, level + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading Palliative Care Handbook...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">
          <svg className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          Error loading handbook
        </div>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white dark:from-green-900 dark:to-gray-800">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-2xl mr-2">🕊️</div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Palliative Care
            </h1>
          </div>          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <HiBars3 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex h-screen lg:h-auto">
        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed left-0 top-0 h-full w-80 bg-white dark:bg-gray-800 z-50 lg:hidden overflow-y-auto"
              >
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="text-2xl mr-2">🕊️</div>
                      <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        Palliative Care
                      </h1>
                    </div>                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <HiXMark className="w-5 h-5" />
                    </button>
                  </div>                  {/* Mobile Search */}
                  <div className="relative">
                    <HiMagnifyingGlass className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search topics..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>
                  <div className="p-4">
                  {renderSearchResults()}
                  {renderTagFilter()}
                  {renderRecentlyViewed()}
                  
                  {displayToc.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      {searchTerm || selectedTags.length > 0 ? 'No topics found matching your criteria.' : 'No content available.'}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {displayToc.map(entry => renderTocEntry(entry))}
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Desktop Sidebar TOC */}
        <div className="hidden lg:block w-1/3 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-y-auto">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <div className="text-3xl mr-3">🕊️</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Palliative Care
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Comprehensive Care Guidelines
                </p>
              </div>
            </div>            {/* Desktop Search */}
            <div className="relative">
              <HiMagnifyingGlass className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>          <div className="p-4">
            {renderSearchResults()}
            {renderTagFilter()}
            {renderRecentlyViewed()}
            
            {displayToc.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchTerm || selectedTags.length > 0 ? 'No topics found matching your criteria.' : 'No content available.'}
              </div>
            ) : (
              <div className="space-y-2">
                {displayToc.map(entry => renderTocEntry(entry))}
              </div>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {selectedTopic ? (
            <UniversalHandbookViewer
              filePath={`/palliative_care_handbook/${selectedTopic}.json`}
              activePath={selectedTopic}
              mode="content"
            />
          ) : (
            <div className="flex items-center justify-center h-full p-8">
              <div className="text-center max-w-md mx-auto">
                <div className="text-6xl mb-4">🕊️</div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Palliative Care Handbook
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Comprehensive guidance for providing compassionate, patient-centered palliative care 
                  across all stages of serious illness.
                </p>                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="lg:hidden inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <HiMagnifyingGlass className="w-4 h-4 mr-2" />
                  Browse Topics
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PalliativeHandbookTOC;
