import { useState, useEffect } from 'react';
import { EnhancedSearchResult } from '@/services/handbookEnhancedSearch';

interface SearchHistoryEntry {
  id: string;
  query: string;
  timestamp: number;
  resultCount: number;
}

interface ViewedTopicEntry {
  id: string;
  title: string;
  section: string;
  path: string;
  timestamp: number;
}

const SEARCH_HISTORY_KEY = 'oncovista-search-history';
const VIEWED_TOPICS_KEY = 'oncovista-viewed-topics';
const MAX_HISTORY_ITEMS = 20;

/**
 * Hook to manage search history and recently viewed topics
 */
export const useSearchHistory = () => {
  // State for search history and viewed topics
  const [searchHistory, setSearchHistory] = useState<SearchHistoryEntry[]>([]);
  const [viewedTopics, setViewedTopics] = useState<ViewedTopicEntry[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const savedSearchHistory = localStorage.getItem(SEARCH_HISTORY_KEY);
      if (savedSearchHistory) {
        setSearchHistory(JSON.parse(savedSearchHistory));
      }
      
      const savedViewedTopics = localStorage.getItem(VIEWED_TOPICS_KEY);
      if (savedViewedTopics) {
        setViewedTopics(JSON.parse(savedViewedTopics));
      }
    } catch (error) {
      console.error('Error loading search history:', error);
      // Reset if there's an error
      localStorage.removeItem(SEARCH_HISTORY_KEY);
      localStorage.removeItem(VIEWED_TOPICS_KEY);
    }
  }, []);

  // Save to localStorage when history changes
  useEffect(() => {
    try {
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(searchHistory));
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  }, [searchHistory]);
  
  useEffect(() => {
    try {
      localStorage.setItem(VIEWED_TOPICS_KEY, JSON.stringify(viewedTopics));
    } catch (error) {
      console.error('Error saving viewed topics:', error);
    }
  }, [viewedTopics]);

  /**
   * Add a search query to history
   */
  const addSearchToHistory = (query: string, resultCount: number) => {
    if (!query.trim()) return;
    
    // Create new entry
    const newEntry: SearchHistoryEntry = {
      id: `search-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      query,
      timestamp: Date.now(),
      resultCount
    };
    
    // Update state, keeping only unique queries (by removing old duplicates)
    // and limiting to MAX_HISTORY_ITEMS
    setSearchHistory(prev => {
      const filtered = prev.filter(item => item.query.toLowerCase() !== query.toLowerCase());
      return [newEntry, ...filtered].slice(0, MAX_HISTORY_ITEMS);
    });
  };
  
  /**
   * Add a viewed topic to history
   */
  const addViewedTopic = (result: EnhancedSearchResult) => {
    // Skip if missing required data
    if (!result.title || !result.section || !result.path) return;
    
    // Create new entry
    const newEntry: ViewedTopicEntry = {
      id: `topic-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: result.title,
      section: result.section,
      path: result.path,
      timestamp: Date.now()
    };
    
    // Update state, keeping only unique topics and limiting to MAX_HISTORY_ITEMS
    setViewedTopics(prev => {
      const filtered = prev.filter(
        item => !(item.section === result.section && item.path === result.path)
      );
      return [newEntry, ...filtered].slice(0, MAX_HISTORY_ITEMS);
    });
  };
  
  /**
   * Clear all search history
   */
  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  };
  
  /**
   * Clear all viewed topics
   */
  const clearViewedTopics = () => {
    setViewedTopics([]);
    localStorage.removeItem(VIEWED_TOPICS_KEY);
  };

  return {
    searchHistory,
    viewedTopics,
    addSearchToHistory,
    addViewedTopic,
    clearSearchHistory,
    clearViewedTopics
  };
};

export type { SearchHistoryEntry, ViewedTopicEntry };
