import React, { useState } from 'react';
import { 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { EnhancedSearchResult } from '@/services/handbookEnhancedSearch';

interface SearchResultFeedbackProps {
  result: EnhancedSearchResult;
  query: string;
  onFeedbackSubmitted?: (feedback: SearchFeedback) => void;
}

export interface SearchFeedback {
  resultId: string;
  query: string;
  section: string;
  isHelpful: boolean;
  comment?: string;
  timestamp: number;
}

/**
 * Component for collecting user feedback on search results relevance.
 * Allows users to indicate whether a result was helpful and provide comments.
 */
const SearchResultFeedback: React.FC<SearchResultFeedbackProps> = ({
  result,
  query,
  onFeedbackSubmitted,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [isHelpful, setIsHelpful] = useState<boolean | null>(null);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleFeedback = (helpful: boolean) => {
    setIsHelpful(helpful);
    setExpanded(true);
  };

  const handleSubmit = () => {
    if (isHelpful === null) return;

    const feedback: SearchFeedback = {
      resultId: result.id,
      query,
      section: result.section,
      isHelpful,
      comment: comment.trim() || undefined,
      timestamp: Date.now(),
    };

    // In a real application, this would be sent to an API
    console.log('Search feedback:', feedback);
    
    // Call the callback if provided
    if (onFeedbackSubmitted) {
      onFeedbackSubmitted(feedback);
    }
    
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex items-center justify-center py-2 text-sm text-green-600 dark:text-green-400">
        <CheckCircle size={14} className="mr-1" />
        <span>Thank you for your feedback!</span>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-100 dark:border-gray-800 pt-2 mt-2 text-sm">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">Was this result helpful?</p>
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isHelpful === true ? "default" : "ghost"}
                  size="sm"
                  className="h-8 px-2"
                  onClick={() => handleFeedback(true)}
                >
                  <ThumbsUp size={16} className="mr-1" />
                  Yes
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>This result was helpful</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isHelpful === false ? "default" : "ghost"}
                  size="sm"
                  className="h-8 px-2"
                  onClick={() => handleFeedback(false)}
                >
                  <ThumbsDown size={16} className="mr-1" />
                  No
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>This result was not helpful</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {expanded && (
        <div className="mt-2 space-y-2">
          <div className="relative">
            <Textarea
              placeholder="Tell us why (optional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={2}
              className="resize-none"
            />
            <MessageSquare
              size={14}
              className="absolute top-2 right-2 text-muted-foreground"
            />
          </div>
          <div className="flex justify-end">
            <Button size="sm" onClick={handleSubmit}>
              Submit Feedback
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResultFeedback;
