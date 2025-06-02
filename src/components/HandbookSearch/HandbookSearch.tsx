import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, Clock, BookOpen, Filter, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { handbookSearch, SearchResult, SearchOptions } from '@/services/handbookSearch';
import { useNavigate } from 'react-router-dom';

interface HandbookSearchProps {
  onResultSelect?: (result: SearchResult) => void;
  placeholder?: string;
  showFilters?: boolean;
  defaultSection?: string;
  className?: string;
}

export function HandbookSearch({
  onResultSelect,
  placeholder = "Search handbook content...",
  showFilters = true,
  defaultSection,
  className
}: HandbookSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string>(defaultSection || 'all');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('handbook-recent-searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.warn('Failed to load recent searches');
      }
    }
  }, []);

  // Save recent searches to localStorage
  const saveRecentSearch = useCallback((searchQuery: string) => {
    const trimmed = searchQuery.trim();
    if (!trimmed || trimmed.length < 3) return;

    setRecentSearches(prev => {
      const filtered = prev.filter(s => s !== trimmed);
      const updated = [trimmed, ...filtered].slice(0, 5);
      localStorage.setItem('handbook-recent-searches', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback((searchQuery: string) => {
    const timeoutId = setTimeout(async () => {
      if (!searchQuery.trim()) {
        setResults([]);
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const options: SearchOptions = {
          maxResults: 20,
          minScore: 0.1
        };

        if (selectedSection !== 'all') {
          options.sections = [selectedSection];
        }

        const searchResults = await handbookSearch.search(searchQuery, options);
        setResults(searchResults);

        // Get suggestions for short queries
        if (searchQuery.length < 10) {
          const searchSuggestions = await handbookSearch.getSuggestions(searchQuery, 5);
          setSuggestions(searchSuggestions);
        } else {
          setSuggestions([]);
        }

      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [selectedSection]);

  // Handle search input change
  useEffect(() => {
    const cleanup = debouncedSearch(query);
    return cleanup;
  }, [query, debouncedSearch]);

  // Handle result selection
  const handleResultSelect = useCallback((result: SearchResult) => {
    saveRecentSearch(query);
    setIsOpen(false);
    setQuery('');

    if (onResultSelect) {
      onResultSelect(result);
    } else {
      // Navigate to the result
      const path = `/handbook/${result.section}/${result.path}`;
      navigate(path);
    }
  }, [query, onResultSelect, navigate, saveRecentSearch]);

  // Handle suggestion click
  const handleSuggestionClick = useCallback((suggestion: string) => {
    setQuery(suggestion);
    inputRef.current?.focus();
  }, []);

  // Handle recent search click
  const handleRecentSearchClick = useCallback((recentQuery: string) => {
    setQuery(recentQuery);
    inputRef.current?.focus();
  }, []);

  // Handle input focus/blur
  const handleFocus = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleBlur = useCallback((e: React.FocusEvent) => {
    // Don't close if clicking within results
    if (resultsRef.current?.contains(e.relatedTarget as Node)) {
      return;
    }
    setTimeout(() => setIsOpen(false), 150);
  }, []);

  // Clear search
  const handleClear = useCallback(() => {
    setQuery('');
    setResults([]);
    setSuggestions([]);
    setIsOpen(false);
    inputRef.current?.focus();
  }, []);

  // Section filter options
  const sectionOptions = [
    { value: 'all', label: 'All Sections' },
    { value: 'medical-oncology', label: 'Medical Oncology' },
    { value: 'radiation-oncology', label: 'Radiation Oncology' },
    { value: 'palliative-care', label: 'Palliative Care' }
  ];

  return (
    <div className={cn("relative w-full max-w-2xl", className)}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={cn(
            "block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg",
            "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100",
            "placeholder-gray-500 dark:placeholder-gray-400",
            "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
            "dark:border-gray-600 dark:focus:border-blue-400",
            "transition-all duration-200"
          )}
        />

        {/* Loading indicator or clear button */}
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {isLoading ? (
            <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
          ) : query ? (
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Section Filter */}
      {showFilters && (
        <div className="mt-2">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className={cn(
                "text-sm border border-gray-300 rounded-md px-2 py-1",
                "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100",
                "dark:border-gray-600 focus:ring-1 focus:ring-blue-500"
              )}
            >
              {sectionOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Search Results */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={resultsRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "absolute top-full left-0 right-0 mt-2 z-50",
              "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600",
              "rounded-lg shadow-lg max-h-96 overflow-y-auto"
            )}
          >
            {/* Recent Searches */}
            {!query && recentSearches.length > 0 && (
              <div className="p-3 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Recent Searches
                  </span>
                </div>
                <div className="space-y-1">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleRecentSearchClick(search)}
                      className={cn(
                        "block w-full text-left px-2 py-1 text-sm rounded",
                        "text-gray-600 dark:text-gray-400",
                        "hover:bg-gray-100 dark:hover:bg-gray-700"
                      )}
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            {query && suggestions.length > 0 && (
              <div className="p-3 border-b border-gray-200 dark:border-gray-600">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Suggestions
                </div>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className={cn(
                        "px-2 py-1 text-xs rounded-full",
                        "bg-blue-50 text-blue-700 hover:bg-blue-100",
                        "dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
                      )}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search Results */}
            {results.length > 0 && (
              <div className="p-2">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 px-2">
                  Results ({results.length})
                </div>
                <div className="space-y-1">
                  {results.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleResultSelect(result)}
                      className={cn(
                        "w-full text-left p-3 rounded-lg",
                        "hover:bg-gray-50 dark:hover:bg-gray-700",
                        "transition-colors duration-150"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <BookOpen className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                            {result.title}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            {result.category} • {result.section}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                            {result.snippet}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {query && !isLoading && results.length === 0 && (
              <div className="p-8 text-center">
                <BookOpen className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  No results found for "{query}"
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Try different keywords or check spelling
                </div>
              </div>
            )}

            {/* Empty State */}
            {!query && recentSearches.length === 0 && (
              <div className="p-8 text-center">
                <Search className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Start typing to search handbook content
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
