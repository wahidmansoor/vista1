import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  BookOpen, Clock, Tag, ChevronRight, 
  FileDown, FileText, FileSpreadsheet, File
} from 'lucide-react';
import { EnhancedSearchResult } from '@/services/handbookEnhancedSearch';
import { cn } from '@/lib/utils';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { exportSearchResults, ExportFormat } from '../utils/exportUtils';
import SearchResultFeedback from './SearchResultFeedback';

interface SearchResultsProps {
  results: EnhancedSearchResult[];
  isLoading: boolean;
  query: string;
  onResultClick?: (result: EnhancedSearchResult) => void;
  enableExport?: boolean;
}

/**
 * SearchResults component to display handbook search results
 * Displays enhanced search results with excerpts and highlighting
 */
export const SearchResults: React.FC<SearchResultsProps> = ({ 
  results, 
  isLoading, 
  query,
  onResultClick,
  enableExport = true
}) => {
  const navigate = useNavigate();
  const [isExporting, setIsExporting] = useState(false);

  const handleResultClick = (result: EnhancedSearchResult) => {
    // Navigate to the result path
    navigate(`/handbook/${result.section}/${result.path}`);
    
    // Call the optional click handler if provided
    if (onResultClick) {
      onResultClick(result);
    }
  };
  
  const handleExport = async (format: ExportFormat) => {
    try {
      setIsExporting(true);
      await exportSearchResults(results, query, {
        format,
        includeExcerpts: true,
        includeMetadata: true
      });
    } catch (error) {
      console.error('Error exporting results:', error);
      alert('Failed to export results. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <SearchResultSkeleton />
        <SearchResultSkeleton />
        <SearchResultSkeleton />
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No results found</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          We couldn't find any content matching "{query}". Try different keywords or check the spelling.
        </p>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">
          Found {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
        </h3>
        
        {enableExport && results.length > 0 && (
          <TooltipProvider>
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      disabled={isExporting}
                      className="flex gap-2"
                    >
                      {isExporting ? (
                        <>Exporting</>
                      ) : (
                        <>
                          <FileDown className="h-4 w-4" />
                          Export
                        </>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Export search results for documentation</p>
                </TooltipContent>
              </Tooltip>
              
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Export Format</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleExport('markdown')}>
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Markdown (.md)</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('csv')}>
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  <span>CSV Spreadsheet</span>
                </DropdownMenuItem>                <DropdownMenuItem onClick={() => handleExport('pdf')}>
                  <File className="mr-2 h-4 w-4" />
                  <span>PDF Document</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('docx')}>
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Word Document (.docx)</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TooltipProvider>
        )}
      </div>
        <ScrollArea className="h-[70vh]">
        <div className="space-y-4 pr-4">
          {results.map((result) => (
            <SearchResultCard 
              key={`${result.section}-${result.path}`} 
              result={result}
              query={query}
              onClick={() => handleResultClick(result)} 
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

interface SearchResultCardProps {
  result: EnhancedSearchResult;
  query: string;
  onClick: () => void;
  showFeedback?: boolean;
}

/**
 * Individual search result card component
 */
const SearchResultCard: React.FC<SearchResultCardProps> = ({ 
  result, 
  query, 
  onClick,
  showFeedback = true 
}) => {
  // Get section name for display
  const getSectionName = (section: string): string => {
    switch (section) {
      case 'medical-oncology': return 'Medical Oncology';
      case 'radiation-oncology': return 'Radiation Oncology';
      case 'palliative-care': return 'Palliative Care';
      default: return section.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  // Get badge color based on clinical level
  const getLevelColor = (level?: string): string => {
    switch(level) {
      case 'basic': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'intermediate': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'advanced': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <Card 
      className="border border-border hover:border-primary/20 hover:bg-accent/10 transition-colors cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <Badge variant="outline" className="mb-2">
              {getSectionName(result.section)}
            </Badge>
            <CardTitle className="text-lg font-semibold">{result.title}</CardTitle>
          </div>
          <Badge className={cn(getLevelColor(result.metadata?.clinicalLevel))}>
            {result.metadata?.clinicalLevel || 'General'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Show excerpt with highlighted matches */}
        {result.excerpt && (
          <div className="text-sm text-muted-foreground mb-3 overflow-hidden">
            <div dangerouslySetInnerHTML={{ __html: result.excerpt }} />
          </div>
        )}
        
        {/* Metadata row */}
        <div className="flex flex-wrap gap-2 mt-3">
          {result.metadata?.tags?.map(tag => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1 text-xs">
              <Tag size={12} />
              {tag}
            </Badge>
          ))}
        </div>      </CardContent>

      <CardFooter className="flex flex-col pt-2">
        <div className="flex justify-between w-full text-xs text-muted-foreground">
          <div className="flex items-center">
            <Clock size={14} className="mr-1" />
            {result.metadata?.lastUpdated ? new Date(result.metadata.lastUpdated).toLocaleDateString() : 'No date'}
          </div>
          <Button variant="ghost" size="sm" className="text-xs h-6">
            View <ChevronRight size={14} className="ml-1" />
          </Button>
        </div>
        
        {/* Feedback component */}
        {showFeedback && (
          <div className="w-full" onClick={(e) => e.stopPropagation()}>
            <SearchResultFeedback 
              result={result} 
              query={query}
            />
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

/**
 * Skeleton loader for search results
 */
const SearchResultSkeleton: React.FC = () => (
  <Card className="border border-border overflow-hidden">
    <CardHeader className="pb-2">
      <div className="flex justify-between items-start">
        <div className="w-full">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-1"></div>
        </div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
      </div>
    </CardHeader>
    
    <CardContent>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
      </div>
      
      <div className="flex gap-2 mt-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
      </div>
    </CardContent>

    <CardFooter className="flex justify-between pt-2">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
    </CardFooter>
  </Card>
);

export default SearchResults;
