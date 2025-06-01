import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ContentRenderer } from '@/modules/handbook/ContentRenderer';

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
          <ContentRenderer path={contentPath} section={section} />
        </div>
      </ScrollArea>
    </div>
  );
};

export default HandbookPage;
