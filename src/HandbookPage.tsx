import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ContentRenderer } from '@/modules/handbook/ContentRenderer';
import type { HandbookContentBlock } from '@/modules/handbook/types/handbook';

interface HandbookPageProps {
  basePath?: string;
  section?: string;
}

/**
 * Component for displaying handbook content pages
 * Handles routing parameters and content rendering
 */
const HandbookPage: React.FC<HandbookPageProps> = ({ basePath = '', section = 'medical-oncology' }) => {
  const { contentPath } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState<HandbookContentBlock[]>([
    { type: 'markdown', content: '# Loading content...' }
  ]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // In a real implementation, this would fetch content based on the contentPath
    // For now, we'll just simulate content loading with a placeholder
    if (contentPath) {
      setIsLoading(true);
      // Simulate API call delay
      setTimeout(() => {
        setContent([
          { 
            type: 'markdown', 
            content: `# ${contentPath.split('/').pop()?.replace(/-/g, ' ')}\n\nThis is placeholder content for ${contentPath}` 
          }
        ]);
        setIsLoading(false);
      }, 500);
    }
  }, [contentPath]);
  
  const handleBack = () => {
    navigate(`/${basePath || section}`);
  };

  if (!contentPath) {
    return <div className="p-8">No content path specified</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleBack}
          className="flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Table of Contents
        </Button>
      </div>
      <ScrollArea className="flex-1 p-4 md:p-6">
        <div className="max-w-3xl mx-auto">
          <ContentRenderer content={content} />
          {isLoading && <div className="text-center text-gray-500 mt-4">Loading content...</div>}
        </div>
      </ScrollArea>
    </div>
  );
};

export default HandbookPage;
