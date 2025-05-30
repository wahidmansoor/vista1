import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { enhancedHandbookSearch, EnhancedSearchResult } from '@/services/handbookEnhancedSearch';
import { Search, Book, Atom, Heart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import debounce from 'lodash.debounce';

interface HandbookQuickSearchProps {
  buttonClassName?: string;
  placeholder?: string;
  maxResults?: number;
}

/**
 * A quick search widget that can be embedded in headers or navigation bars
 * to provide access to handbook content search
 */
export const HandbookQuickSearch: React.FC<HandbookQuickSearchProps> = ({ 
  buttonClassName,
  placeholder = "Search handbook...",
  maxResults = 5 
}) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<EnhancedSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut for opening search (Ctrl+K or ⌘+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input when dialog opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [open]);

  // Debounced search function
  const debouncedSearch = debounce(async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    try {
      const searchResults = await enhancedHandbookSearch(searchTerm, {
        limit: maxResults
      });
      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  }, 300);

  // Handle input change
  const handleInputChange = (value: string) => {
    setQuery(value);
    setIsLoading(true);
    debouncedSearch(value);
  };

  // Handle search result selection
  const handleSelect = (result: EnhancedSearchResult) => {
    setOpen(false);
    navigate(`/handbook/${result.section}/${result.path}`);
  };

  // Handle view all results
  const handleViewAll = () => {
    setOpen(false);
    navigate(`/handbook/search?q=${encodeURIComponent(query)}`);
  };

  // Get icon based on section
  const getSectionIcon = (section: string) => {
    switch (section) {
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

  return (
    <>
      <Button
        variant="outline"
        className={buttonClassName}
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4 mr-2" />
        <span className="hidden md:inline">{placeholder}</span>
        <kbd className="hidden md:inline-flex ml-auto h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Search handbook content..." 
          value={query}
          onValueChange={handleInputChange}
          ref={inputRef}
        />
        
        <CommandList>
          <CommandEmpty>
            {isLoading ? (
              <div className="py-6 text-center">
                <Loader2 className="h-8 w-8 mx-auto text-muted-foreground animate-spin" />
                <p className="text-sm text-muted-foreground mt-2">Searching handbook...</p>
              </div>
            ) : (
              <div className="py-6 text-center">
                <p className="text-sm text-muted-foreground">No results found.</p>
              </div>
            )}
          </CommandEmpty>
          
          {results.length > 0 && !isLoading && (
            <>
              <CommandGroup heading="Search Results">
                {results.map((result) => (
                  <CommandItem 
                    key={`${result.section}-${result.path}`}
                    onSelect={() => handleSelect(result)}
                    className="flex items-center cursor-pointer"
                  >
                    {getSectionIcon(result.section)}
                    <div className="text-sm">
                      <div>{result.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {result.section.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
              
              <CommandGroup>
                <CommandItem onSelect={handleViewAll}>
                  <Search className="h-4 w-4 mr-2" />
                  View all results for "{query}"
                </CommandItem>
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default HandbookQuickSearch;
