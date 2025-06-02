import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Menu, Loader2 } from 'lucide-react';
import { UniversalHandbookViewer } from './UniversalHandbookViewer';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useWindowWidth } from '@react-hook/window-size';

interface HandbookLayoutProps {
  section: string;
  defaultTopic?: string;
}

export function HandbookLayout({ section, defaultTopic }: HandbookLayoutProps) {
  const [tocCollapsed, setTocCollapsed] = useState(false);
  const [activeTopic, setActiveTopic] = useState<string | undefined>(defaultTopic);
  const [isLoading, setIsLoading] = useState(true);
  const windowWidth = useWindowWidth();

  // Auto-collapse TOC on mobile
  useEffect(() => {
    if (windowWidth < 768) {
      setTocCollapsed(true);
    }
  }, [windowWidth]);

  const normalizePath = (path: string, section: string): string => {
    if (!path) return '';
    
    // If path already includes directory structure, return as is
    if (path.includes('/')) return path;
    
    // For abbreviated paths, construct full path based on current section
    return `${section}/${path.replace(/\s+/g, '-')}`.toLowerCase();
  };

  // Handle topic selection with path normalization
  const handleTopicSelect = (path: string) => {
    const normalizedPath = normalizePath(path, section);
    setActiveTopic(normalizedPath);
    if (windowWidth < 768) {
      setTocCollapsed(true);
    }
  };

  // Construct file paths with normalized paths
  const handbookFolder = section.replace('-', '_') + '_handbook';
  const tocPath = `/${handbookFolder}/toc.json`;
  const contentPath = activeTopic ? `/${handbookFolder}/${normalizePath(activeTopic, section)}.json` : tocPath;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* TOC Panel */}
      <motion.div
        initial={false}
        animate={{
          width: tocCollapsed ? '0px' : '320px',
          opacity: tocCollapsed ? 0 : 1
        }}
        transition={{ duration: 0.3 }}
        className={`
          relative border-r border-slate-200 dark:border-slate-700
          overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm
        `}
      >
        <div className="h-full overflow-y-auto">
          <ErrorBoundary>
            <UniversalHandbookViewer
              filePath={tocPath}
              activePath={activeTopic}
              onTopicSelect={handleTopicSelect}
              mode="toc"
            />
          </ErrorBoundary>
        </div>
      </motion.div>

      {/* Toggle Button */}
      <button
        onClick={() => setTocCollapsed(!tocCollapsed)}
        className="fixed left-0 top-4 z-50 p-2 bg-white dark:bg-slate-800 shadow-md rounded-r-lg
          hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        aria-label={tocCollapsed ? "Show table of contents" : "Hide table of contents"}
      >
        <Menu className="w-5 h-5 text-slate-600 dark:text-slate-300" />
      </button>

      {/* Content Area */}
      <motion.div
        className="flex-1 overflow-hidden"
        initial={false}
        animate={{ marginLeft: tocCollapsed ? '0px' : '320px' }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-6 max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={contentPath}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <ErrorBoundary>
                <UniversalHandbookViewer
                  filePath={contentPath}
                  activePath={activeTopic}
                  onTopicSelect={handleTopicSelect}
                  mode="content"
                />
              </ErrorBoundary>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}