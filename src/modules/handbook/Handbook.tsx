import { useCallback, useMemo } from 'react';
import { Loader2, BookOpen, Book } from 'lucide-react';
import { useLocation, useNavigate } from "react-router-dom";
import ErrorWrapper from "@/components/ErrorWrapper";
import ErrorBoundary from "@/components/ErrorBoundary";
import HandbookLanding from "./HandbookLanding";
import { HandbookSidebarNew } from './HandbookSidebarNew';
import { JsonHandbookViewer } from './JsonHandbookViewer';
import { useHandbookData } from '@/hooks/useHandbookData';
import { parseHandbookPath } from '@/utils/pathUtils';
import { parseErrorDetails } from '@/utils/errorUtils';
import { sectionsMeta } from './constants';
import type { FC, ReactElement } from 'react';

const Handbook: FC = (): ReactElement => {
  const location = useLocation();
  const navigate = useNavigate();

  // Move path parsing into useMemo to prevent unnecessary recalculations
  const { section, topic } = useMemo(() => {
    const result = parseHandbookPath(location.pathname);
    console.log('📖 Parsed handbook path:', { ...result, pathname: location.pathname });
    return result;
  }, [location.pathname]);

  // Use our custom hook for data fetching and state management
  const { 
    tocData,
    activeFile,
    isLoading,
    error,
    isValidSection
  } = useHandbookData(section, topic);

  // Get current section metadata
  const currentSectionMeta = useMemo(() => {
    return section ? sectionsMeta.find(s => s.id === section) : undefined;
  }, [section]);

  // Handle topic selection and navigation
  const handleTopicClick = useCallback((selectedSection: string, selectedTopic: string) => {
    try {
      console.log('🔍 Navigation request:', { selectedSection, selectedTopic });
      
      // Clean up topic path
      const cleanTopic = selectedTopic
        .replace(/^\/+|\/+$/g, '') // Remove leading/trailing slashes
        .replace(/\.json$|\.md$/, ''); // Remove any extensions
      
      // Build the target path, preserving nested structure
      const targetPath = `/handbook/${selectedSection}/${cleanTopic}`;
      
      navigate(targetPath);
    } catch (err) {
      console.error('❌ Navigation error:', err);
    }
  }, [navigate]);

  // Only show landing page if we're at /handbook root
  if (location.pathname === '/handbook') {
    return <HandbookLanding />;
  }

  // If we have a section but it's invalid, show an error
  if (section && !isValidSection) {
    return (
      <div className="p-8">
        <div className="text-red-500 p-4 rounded-lg bg-red-50 border border-red-200">
          Invalid handbook section: {section}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Sidebar with loading and error states */}
      {isLoading ? (
        <div className="w-80 flex-shrink-0 flex items-center justify-center p-6">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="w-80 flex-shrink-0 p-6">
          <div className="text-red-500 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            {typeof error === 'string' ? error : parseErrorDetails(error).message}
          </div>
        </div>
      ) : (
        <HandbookSidebarNew
          section={section}
          tocData={tocData || []}
          activeTopicId={topic ? `${section}/${topic}` : section}
          onTopicClick={handleTopicClick}
        />
      )}

      {/* Content Area */}
      <div className="flex-1 p-8 overflow-y-auto min-h-screen" id="handbook-content-area">
        <ErrorWrapper>
          {activeFile ? (
            <>
              {/* Header */}
              <div className="flex justify-between items-center mb-6 print:hidden">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {topic 
                    ? topic.split('/').pop()?.replace(/-/g, ' ')?.replace('.json', '') 
                    : currentSectionMeta?.title || 'Handbook'}
                </div>
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center px-3 py-1.5 text-sm
                    bg-white dark:bg-slate-800 
                    text-gray-700 dark:text-gray-300
                    border border-gray-200 dark:border-gray-700
                    rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-slate-700
                    transition-colors"
                >
                  <span role="img" aria-label="Print" className="mr-1">🖨️</span> Print
                </button>
              </div>

              <ErrorBoundary moduleName="AI Handbook">
                <JsonHandbookViewer filePath={activeFile} />
              </ErrorBoundary>
            </>
          ) : (
            // Placeholder when no topic is selected
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-medium text-muted-foreground">
                Select a topic from the sidebar to view its content.
              </h2>
              <p className="text-muted-foreground mt-2">
                You are currently in the <span className="font-semibold">{currentSectionMeta?.title || 'Handbook'}</span> section.
              </p>
            </div>
          )}
        </ErrorWrapper>
      </div>
    </div>
  );
};

export default Handbook;
