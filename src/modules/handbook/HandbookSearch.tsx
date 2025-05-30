import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { HandbookSection } from '@/utils/pathUtils';
import { enhancedHandbookSearch, EnhancedSearchResult, EnhancedSearchOptions } from '@/services/handbookEnhancedSearch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  Search,
  Book,
  Atom,
  Heart,
  Filter,
  SlidersHorizontal,
  X,
  RotateCcw,
  Loader2,
  History,
  Clock,
  Trash2
} from 'lucide-react';
import debounce from 'lodash.debounce';
import SearchResults from './components/SearchResults';
import { useSearchHistory, SearchHistoryEntry, ViewedTopicEntry } from './hooks/useSearchHistory';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

/**
 * HandbookSearch - Advanced search interface for handbook content
 * Features:
 * - Cross-sectional search across all specialties
 * - Filtering by clinical level, tags, etc.
 * - Real-time results with debounced input
 */
const HandbookSearch: React.FC = () => {
  // URL params for shareable search links
  const [searchParams, setSearchParams] = useSearchParams();

  // States for search
  const [query, setQuery] = useState<string>(searchParams.get('q') || '');
  const [results, setResults] = useState<EnhancedSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("results");
  
  // Search history hook
  const { 
    searchHistory, 
    viewedTopics, 
    addSearchToHistory, 
    addViewedTopic, 
    clearSearchHistory,
    clearViewedTopics
  } = useSearchHistory();
  
  // Filter states
  const [selectedSections, setSelectedSections] = useState<HandbookSection[]>([
    'medical-oncology', 
    'radiation-oncology', 
    'palliative-care'
  ]);
  
  const [selectedLevels, setSelectedLevels] = useState<string[]>([
    'basic', 
    'intermediate', 
    'advanced'
  ]);

  // Create a debounced search function to avoid excessive API calls
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string, options: EnhancedSearchOptions) => {
      if (!searchQuery.trim()) {
        setResults([]);
        setIsLoading(false);
        return;
      }
      
      try {
        const searchResults = await enhancedHandbookSearch(searchQuery, options);
        setResults(searchResults);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );
  // Update URL when query changes
  useEffect(() => {
    if (query) {
      setSearchParams({ q: query });
    } else {
      setSearchParams({});
    }
  }, [query, setSearchParams]);

  // Perform search when query or filters change
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    
    const searchOptions: EnhancedSearchOptions = {
      sections: selectedSections,
      clinicalLevel: selectedLevels as any,
      limit: 20,
    };

    debouncedSearch(query, searchOptions);
    
    // Cleanup function for debounce
    return () => {
      debouncedSearch.cancel();
    };
  }, [query, selectedSections, selectedLevels, debouncedSearch]);
  
  // Add search to history when results come back
  useEffect(() => {
    if (query && !isLoading && results.length > 0) {
      addSearchToHistory(query, results.length);
    }
  }, [results, isLoading, query, addSearchToHistory]);
  
  // Handler for viewing a result
  const handleResultClick = (result: EnhancedSearchResult) => {
    // Add to viewed topics
    addViewedTopic(result);
  };

  // Handle section toggling
  const handleSectionToggle = (section: HandbookSection) => {
    setSelectedSections(prev => {
      if (prev.includes(section)) {
        return prev.filter(s => s !== section);
      } else {
        return [...prev, section];
      }
    });
  };

  // Handle clinical level toggling
  const handleLevelToggle = (level: string) => {
    setSelectedLevels(prev => {
      if (prev.includes(level)) {
        return prev.filter(l => l !== level);
      } else {
        return [...prev, level];
      }
    });
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedSections(['medical-oncology', 'radiation-oncology', 'palliative-care']);
    setSelectedLevels(['basic', 'intermediate', 'advanced']);
  };
  return (
    <div className="container mx-auto py-8 max-w-5xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Handbook Search</h1>
        <p className="text-muted-foreground">Search across all oncology handbook content</p>
      </div>
      
      {/* Search input */}
      <div className="relative mb-6">
        <Input
          type="text"
          placeholder="Search for topics, treatments, protocols..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 h-12 text-lg"
          autoFocus
        />
        <Search className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
        {query && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="absolute right-2 top-2.5 h-7 w-7 p-0" 
            onClick={() => setQuery('')}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear</span>
          </Button>
        )}
      </div>
      
      {/* Tabs for results/history */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
        <TabsList className="mb-4">
          <TabsTrigger value="results" className="flex items-center gap-1">
            <Search className="h-4 w-4" />
            Results
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-1">
            <History className="h-4 w-4" />
            Search History
          </TabsTrigger>
          <TabsTrigger value="recent" className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            Recently Viewed
          </TabsTrigger>
        </TabsList>
      </Tabs>      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters sidebar - only visible when showFilters is true on mobile and only on results tab */}
        {activeTab === 'results' && (
          <div className={`${showFilters ? 'block' : 'hidden md:block'} w-full md:w-64 space-y-6`}>
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Filters</CardTitle>
                  <Button variant="ghost" size="sm" onClick={handleResetFilters}>
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Reset
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Section filters */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Handbook Sections</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="medical-oncology" 
                        checked={selectedSections.includes('medical-oncology')}
                        onCheckedChange={() => handleSectionToggle('medical-oncology')}
                      />
                      <Label 
                        htmlFor="medical-oncology" 
                        className="flex items-center text-sm font-normal cursor-pointer"
                      >
                        <Book className="h-4 w-4 mr-2 text-blue-600" />
                        Medical Oncology
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="radiation-oncology" 
                        checked={selectedSections.includes('radiation-oncology')}
                        onCheckedChange={() => handleSectionToggle('radiation-oncology')}
                      />
                      <Label 
                        htmlFor="radiation-oncology" 
                        className="flex items-center text-sm font-normal cursor-pointer"
                      >
                        <Atom className="h-4 w-4 mr-2 text-amber-600" />
                        Radiation Oncology
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="palliative-care" 
                        checked={selectedSections.includes('palliative-care')}
                        onCheckedChange={() => handleSectionToggle('palliative-care')}
                      />
                      <Label 
                        htmlFor="palliative-care" 
                        className="flex items-center text-sm font-normal cursor-pointer"
                      >
                        <Heart className="h-4 w-4 mr-2 text-rose-600" />
                        Palliative Care
                      </Label>
                    </div>
                  </div>
                </div>
                
                {/* Clinical level filters */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Clinical Level</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="basic" 
                        checked={selectedLevels.includes('basic')}
                        onCheckedChange={() => handleLevelToggle('basic')}
                      />
                      <Label 
                        htmlFor="basic" 
                        className="text-sm font-normal cursor-pointer"
                      >
                        Basic
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="intermediate" 
                        checked={selectedLevels.includes('intermediate')}
                        onCheckedChange={() => handleLevelToggle('intermediate')}
                      />
                      <Label 
                        htmlFor="intermediate" 
                        className="text-sm font-normal cursor-pointer"
                      >
                        Intermediate
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="advanced" 
                        checked={selectedLevels.includes('advanced')}
                        onCheckedChange={() => handleLevelToggle('advanced')}
                      />
                      <Label 
                        htmlFor="advanced" 
                        className="text-sm font-normal cursor-pointer"
                      >
                        Advanced
                      </Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main content area */}
        <div className="flex-1">
          {/* Show mobile filters toggle only on results tab */}
          {activeTab === 'results' && (
            <div className="flex md:hidden justify-end mb-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? (
                  <>
                    <X className="h-4 w-4 mr-2" /> Hide Filters
                  </>
                ) : (
                  <>
                    <Filter className="h-4 w-4 mr-2" /> Show Filters
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Tab content */}
          {activeTab === 'results' && (
            <>
              {query.trim() ? (
                <SearchResults 
                  results={results} 
                  isLoading={isLoading} 
                  query={query}
                  onResultClick={handleResultClick}
                  enableExport={true}
                />
              ) : (
                <Card className="flex flex-col items-center justify-center p-12 text-center border border-dashed">
                  <Search className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Enter search terms</h3>
                  <p className="text-muted-foreground max-w-md">
                    Search across all handbook content for topics, treatments, protocols, and clinical information.
                  </p>
                </Card>
              )}
            </>
          )}
          
          {/* Search History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  Recent Searches
                </h3>
                {searchHistory.length > 0 && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={clearSearchHistory}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Clear History
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Clear search history</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              
              {searchHistory.length === 0 ? (
                <Card className="flex flex-col items-center justify-center p-12 text-center border border-dashed">
                  <History className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No search history</h3>
                  <p className="text-muted-foreground max-w-md">
                    Your search history will appear here
                  </p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {searchHistory.map((entry) => (
                    <Card key={entry.id} className="overflow-hidden">
                      <CardHeader className="py-3">
                        <div className="flex justify-between items-center">
                          <Button 
                            variant="link" 
                            className="p-0 h-auto text-left justify-start font-medium text-lg"
                            onClick={() => setQuery(entry.query)}
                          >
                            {entry.query}
                          </Button>
                          <Badge variant="secondary">
                            {entry.resultCount} result{entry.resultCount !== 1 ? 's' : ''}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardFooter className="py-2 text-xs text-muted-foreground">
                        <Clock size={12} className="mr-1" />
                        {new Date(entry.timestamp).toLocaleString()}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Recently Viewed Tab */}
          {activeTab === 'recent' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  Recently Viewed Topics
                </h3>
                {viewedTopics.length > 0 && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={clearViewedTopics}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Clear History
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Clear recently viewed topics</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              
              {viewedTopics.length === 0 ? (
                <Card className="flex flex-col items-center justify-center p-12 text-center border border-dashed">
                  <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No recently viewed topics</h3>
                  <p className="text-muted-foreground max-w-md">
                    Topics you view will appear here for quick access
                  </p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {viewedTopics.map((topic) => {
                    // Get section icon
                    const getSectionIcon = () => {
                      switch (topic.section) {
                        case 'medical-oncology': 
                          return <Book className="h-4 w-4 mr-2 text-blue-600" />;
                        case 'radiation-oncology': 
                          return <Atom className="h-4 w-4 mr-2 text-amber-600" />;
                        case 'palliative-care': 
                          return <Heart className="h-4 w-4 mr-2 text-rose-600" />;
                        default:
                          return <Book className="h-4 w-4 mr-2" />;
                      }
                    };
                    
                    // Format section name
                    const sectionName = topic.section.replace(/-/g, ' ')
                      .replace(/\b\w/g, l => l.toUpperCase());
                    
                    return (
                      <Card key={topic.id}>
                        <CardHeader className="py-3">
                          <div className="flex justify-between items-center">
                            <Link 
                              to={`/handbook/${topic.section}/${topic.path}`}
                              className="font-medium text-lg hover:text-primary hover:underline"
                            >
                              {topic.title}
                            </Link>
                          </div>
                        </CardHeader>
                        <CardFooter className="py-2 flex justify-between text-xs text-muted-foreground">
                          <div className="flex items-center">
                            {getSectionIcon()}
                            {sectionName}
                          </div>
                          <div className="flex items-center">
                            <Clock size={12} className="mr-1" />
                            {new Date(topic.timestamp).toLocaleString()}
                          </div>
                        </CardFooter>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HandbookSearch;
