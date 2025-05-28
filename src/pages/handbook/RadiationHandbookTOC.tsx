import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiChevronRight, 
  HiChevronDown, 
  HiBookOpen, 
  HiBeaker, 
  HiMagnifyingGlass, 
  HiFunnel,
  HiXMark,
  HiBars3,
  HiClock,
  HiStar,
  HiTag
} from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';
import ErrorBoundary from '@/components/ErrorBoundary';
import { UniversalHandbookViewer } from '@/modules/handbook/UniversalHandbookViewer';
import { searchTocItems, filterByTags, extractAllTags, highlightMatch, SearchResult } from '@/utils/searchUtils';

interface TocEntry {
  title: string;
  path?: string;
  items?: TocEntry[];
  tags?: string[];
  category?: string;
}

const RadiationHandbookTOC = () => {
  const [toc, setToc] = useState<TocEntry[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showTagFilter, setShowTagFilter] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const navigate = useNavigate();

  // Enhanced search results using fuzzy matching
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchTocItems(toc, searchQuery);
  }, [toc, searchQuery]);

  // Available tags for filtering
  const availableTags = useMemo(() => {
    return extractAllTags(toc);
  }, [toc]);

  // Filtered TOC based on search and tags
  const displayToc = useMemo(() => {
    let filtered = toc;
    
    // Apply tag filtering
    if (selectedTags.length > 0) {
      filtered = filterByTags(filtered, selectedTags);
    }
    
    // Apply search filtering if no search results (fallback to simple search)
    if (searchQuery.trim() && searchResults.length === 0) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.items?.some(subItem => 
          subItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (subItem.items?.some(subSubItem => 
            subSubItem.title.toLowerCase().includes(searchQuery.toLowerCase())
          ))
        ))
      );
    }
    
    return filtered;
  }, [toc, selectedTags, searchQuery, searchResults]);

  // Load TOC data
  useEffect(() => {
    const loadTOC = async () => {
      try {
        setLoading(true);
        const response = await fetch('/radiation_oncology_handbook/toc.json');
        if (!response.ok) {
          throw new Error('Failed to load radiation oncology TOC');
        }
        const tocData = await response.json();
        setToc(tocData);
        setError(null);
      } catch (err) {
        console.error('Error loading radiation oncology TOC:', err);
        setError('Failed to load radiation oncology handbook');
      } finally {
        setLoading(false);
      }
    };

    loadTOC();
  }, []);

  const toggleSection = (sectionTitle: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionTitle)) {
      newExpanded.delete(sectionTitle);
    } else {
      newExpanded.add(sectionTitle);
    }
    setExpandedSections(newExpanded);
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
    setSearchQuery('');
    setSelectedTags([]);
  };

  // Render search results
  const renderSearchResults = () => {
    if (!searchQuery.trim() || searchResults.length === 0) return null;

    return (
      <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
            Search Results ({searchResults.length})
          </h3>
          <button
            onClick={() => setSearchQuery('')}
            className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-200"
          >
            <HiXMark className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-1">
          {searchResults.slice(0, 10).map((result, index) => (
            <div
              key={index}
              onClick={() => result.item.path && handleTopicSelect(result.item.path)}
              className="p-2 rounded cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-800/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span 
                  className="text-sm text-yellow-800 dark:text-yellow-200"
                  dangerouslySetInnerHTML={{ 
                    __html: highlightMatch(result.item.title, searchQuery) 
                  }}
                />
                <span className="text-xs text-yellow-600 dark:text-yellow-400 capitalize">
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
            className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
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
                      ? 'bg-blue-600 text-white'
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

  const renderTocItem = (item: TocEntry, level: number = 0) => {
    const hasChildren = item.items && item.items.length > 0;
    const isExpanded = expandedSections.has(item.title);
    const paddingLeft = level * 16;

    return (
      <div key={item.title} className="mb-1">
        <div
          className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 ${
            selectedTopic === item.path ? 'bg-blue-100 dark:bg-blue-900/40' : ''
          }`}
          style={{ paddingLeft: `${paddingLeft + 8}px` }}
          onClick={() => {
            if (hasChildren) {
              toggleSection(item.title);
            } else if (item.path) {
              handleTopicSelect(item.path);
            }
          }}
        >
          {hasChildren && (
            <button className="mr-2">
              {isExpanded ? (
                <HiChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <HiChevronRight className="w-4 h-4 text-gray-500" />
              )}
            </button>
          )}
          {!hasChildren && <div className="w-6" />}
          <div className="flex items-center flex-1">
            <HiBeaker className="w-4 h-4 text-blue-600 mr-2" />
            <span className={`${level === 0 ? 'font-semibold text-gray-900 dark:text-gray-100' : 
              level === 1 ? 'font-medium text-gray-800 dark:text-gray-200' : 
              'text-gray-700 dark:text-gray-300'} text-sm`}>
              {item.title}
            </span>
          </div>
        </div>

        <AnimatePresence>
          {hasChildren && isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              {item.items?.map((child) => renderTocItem(child, level + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-blue-900 dark:to-gray-800 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white dark:from-red-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Error Loading Handbook</h2>
          <p className="text-red-500 dark:text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary moduleName="Radiation Oncology Handbook">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-blue-900 dark:to-gray-800">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <HiBeaker className="w-6 h-6 text-blue-600 mr-2" />
              <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Radiation Oncology
              </h1>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <HiMagnifyingGlass className="w-5 h-5" />
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
                        <HiBeaker className="w-6 h-6 text-blue-600 mr-2" />
                        <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                          Radiation Oncology
                        </h1>
                      </div>
                      <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        ✕
                      </button>
                    </div>
                    
                    {/* Mobile Search */}
                    <div className="relative">
                      <HiMagnifyingGlass className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search topics..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />                    </div>
                  </div>
                  
                  <div className="p-4">
                    {renderSearchResults()}
                    {renderTagFilter()}
                    {displayToc.map((item) => renderTocItem(item))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Desktop Sidebar TOC */}
          <div className="hidden lg:block w-1/3 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <HiBeaker className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Radiation Oncology
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Comprehensive Treatment Guidelines
                  </p>
                </div>
              </div>

              {/* Desktop Search */}
              <div className="relative">
                <HiMagnifyingGlass className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>            </div>

            <div className="p-4">
              {renderSearchResults()}
              {renderTagFilter()}
              {displayToc.map((item) => renderTocItem(item))}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto">
            {selectedTopic ? (
              <UniversalHandbookViewer
                filePath={`/radiation_oncology_handbook/${selectedTopic}.json`}
                activePath={selectedTopic}
                mode="content"
              />
            ) : (
              <div className="flex items-center justify-center h-full p-8">
                <div className="text-center max-w-md mx-auto">
                  <HiBeaker className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    Radiation Oncology Handbook
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Select a topic from the table of contents to view detailed radiation therapy guidelines and protocols.
                  </p>
                  <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="lg:hidden inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
    </ErrorBoundary>
  );
};

export default RadiationHandbookTOC;
