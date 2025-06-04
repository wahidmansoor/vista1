import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Filter, Clock, TrendingUp, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { handbookSearch, SearchResult } from '@/services/handbookSearch';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { HandbookSearch } from '@/components/HandbookSearch/HandbookSearch';

interface SearchPageProps {
  className?: string;
}

export function SearchPage({ className }: SearchPageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'title' | 'section'>('relevance');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const navigate = useNavigate();

  const currentQuery = searchParams.get('q') || '';

  // Popular search terms (could be dynamic in the future)
  const popularSearches = [
    'neutropenic fever',
    'staging',
    'palliative care',
    'pain management',
    'chemotherapy protocols',
    'radiation therapy',
    'tumor markers',
    'emergency oncology'
  ];

  // Recent additions (mock data - could be dynamic)
  const recentAdditions = [
    {
      title: 'CAR-T Cell Therapy Guidelines',
      section: 'medical-oncology',
      category: 'Treatment Modalities',
      date: '2024-05-20'
    },
    {
      title: 'Advanced Pain Control Techniques',
      section: 'palliative-care',
      category: 'Symptom Management',
      date: '2024-05-18'
    },
    {
      title: 'SBRT Treatment Planning',
      section: 'radiation-oncology',
      category: 'Treatment Planning',
      date: '2024-05-15'
    }
  ];

  // Handle search from URL parameters
  useEffect(() => {
    if (currentQuery) {
      performSearch(currentQuery);
    }
  }, [currentQuery, selectedSection]);

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const searchResults = await handbookSearch.search(query, {
        sections: selectedSection === 'all' ? undefined : [selectedSection],
        maxResults: 50,
        minScore: 0.05,
        includeContent: false
      });

      // Apply sorting
      const sortedResults = sortResults(searchResults, sortBy);
      setResults(sortedResults);

    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const sortResults = (results: SearchResult[], sortBy: string): SearchResult[] => {
    switch (sortBy) {
      case 'title':
        return [...results].sort((a, b) => a.title.localeCompare(b.title));
      case 'section':
        return [...results].sort((a, b) => a.section.localeCompare(b.section));
      case 'relevance':
      default:
        return results; // Already sorted by relevance score
    }
  };

  const handleResultClick = (result: SearchResult) => {
    const path = `/handbook/${result.section}/${result.path}`;
    navigate(path);
  };

  const handlePopularSearchClick = (search: string) => {
    setSearchParams({ q: search });
  };

  const highlightMatches = (text: string, query: string): React.ReactNode => {
    if (!query) return text;

    const terms = query.toLowerCase().split(/\s+/);
    let highlightedText = text;

    terms.forEach(term => {
      if (term.length > 1) {
        const regex = new RegExp(`(${term})`, 'gi');
        highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
      }
    });

    return <span dangerouslySetInnerHTML={{ __html: highlightedText }} />;
  };

  const getSectionIcon = (section: string) => {
    switch (section) {
      case 'medical-oncology':
        return '🏥';
      case 'radiation-oncology':
        return '⚛️';
      case 'palliative-care':
        return '💙';
      default:
        return '📖';
    }
  };

  const getSectionDisplayName = (section: string) => {
    switch (section) {
      case 'medical-oncology':
        return 'Medical Oncology';
      case 'radiation-oncology':
        return 'Radiation Oncology';
      case 'palliative-care':
        return 'Palliative Care';
      default:
        return section;
    }
  };

  return (
    <div className={cn("min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800", className)}>
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Handbook Search
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Search across all oncology handbook content
              </p>
            </div>
            
            {/* Search Component */}
            <div className="flex-1 max-w-2xl">
              <HandbookSearch
                placeholder="Search treatments, guidelines, protocols..."
                showFilters={false}
                onResultSelect={handleResultClick}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Filters */}
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </h3>
                
                <div className="space-y-4">
                  {/* Section Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Section
                    </label>
                    <select
                      value={selectedSection}
                      onChange={(e) => setSelectedSection(e.target.value)}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                    >
                      <option value="all">All Sections</option>
                      <option value="medical-oncology">Medical Oncology</option>
                      <option value="radiation-oncology">Radiation Oncology</option>
                      <option value="palliative-care">Palliative Care</option>
                    </select>
                  </div>

                  {/* Sort Options */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Sort by
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                    >
                      <option value="relevance">Relevance</option>
                      <option value="title">Title</option>
                      <option value="section">Section</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Popular Searches */}
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Popular Searches
                </h3>
                <div className="space-y-2">
                  {popularSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handlePopularSearchClick(search)}
                      className="block w-full text-left text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Additions */}
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Recent Additions
                </h3>
                <div className="space-y-3">
                  {recentAdditions.map((item, index) => (
                    <div key={index} className="text-sm">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {item.title}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {getSectionDisplayName(item.section)} • {item.date}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {!currentQuery ? (
              /* Welcome State */
              <div className="text-center py-12">
                <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Search Handbook Content
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                  Find specific treatments, guidelines, protocols, and clinical information across all handbook sections.
                </p>
                
                {/* Quick Search Categories */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                  {[
                    { title: 'Treatments', examples: ['chemotherapy', 'immunotherapy', 'radiation'] },
                    { title: 'Guidelines', examples: ['staging', 'protocols', 'pathways'] },
                    { title: 'Emergencies', examples: ['neutropenic fever', 'SVC syndrome', 'TLS'] }
                  ].map((category, index) => (
                    <div key={index} className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                        {category.title}
                      </h3>
                      <div className="space-y-1">
                        {category.examples.map((example, i) => (
                          <button
                            key={i}
                            onClick={() => handlePopularSearchClick(example)}
                            className="block text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline"
                          >
                            {example}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Search Results */
              <div>
                {/* Results Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Search Results
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {isLoading ? 'Searching...' : `${results.length} results for "${currentQuery}"`}
                    </p>
                  </div>
                </div>

                {/* Results */}
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center py-12"
                    >
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                    </motion.div>
                  ) : results.length > 0 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-4"
                    >
                      {results.map((result, index) => (
                        <motion.div
                          key={result.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6 hover:shadow-md transition-shadow"
                        >
                          <button
                            onClick={() => handleResultClick(result)}
                            className="w-full text-left group"
                          >
                            <div className="flex items-start gap-4">
                              <div className="text-2xl mt-1">
                                {getSectionIcon(result.section)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-1">
                                  {highlightMatches(result.title, currentQuery)}
                                </h3>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                    {getSectionDisplayName(result.section)}
                                  </span>
                                  <span className="text-sm text-gray-500 dark:text-gray-400">
                                    • {result.category}
                                  </span>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 mb-3">
                                  {highlightMatches(result.snippet, currentQuery)}
                                </p>
                                <div className="flex items-center text-sm text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300">
                                  Read more
                                  <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                                </div>
                              </div>
                            </div>
                          </button>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-12"
                    >
                      <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No results found
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Try different keywords or check your spelling
                      </p>
                      <button
                        onClick={() => setSearchParams({})}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                      >
                        Clear search
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>      {/* Custom styles for highlighted text */}
      <style>{`
        mark {
          background-color: #fef08a;
          color: #1f2937;
          padding: 1px 2px;
          border-radius: 2px;
        }
        .dark mark {
          background-color: #eab308;
          color: #111827;
        }
      `}</style>
    </div>
  );
}
