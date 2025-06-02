import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Book, AlertTriangle, ChevronRight, ChevronUp, Calendar, Tag, User, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import ErrorBoundary from '@/components/ErrorBoundary';
import { SidebarTOCNavigator } from './SidebarTOCNavigator';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useLocation } from "react-router-dom";
import { HandbookContentBlock } from './types/handbook';
import { JsonHandbookViewer } from './JsonHandbookViewer';
import { AlertTriangle as AlertTriangleIcon } from 'lucide-react';

interface Props {
  filePath: string;
  onTopicSelect?: (path: string) => void;
  activePath?: string;
  mode?: 'toc' | 'content';
}

interface TopicContent {
  title: string;
  category: string;
  section: string;
  summary?: string;
  content: HandbookContentBlock[];
  metadata?: {
    version?: string;
    lastUpdated?: string;
    author?: string;
    license?: string;
    tags?: string[];
  };
}

// Use the HandbookContentBlock type instead of redefining ContentBlock
type ContentBlock = HandbookContentBlock;

interface TocEntry {
  title: string;
  path?: string;
  items?: TocEntry[];
}

interface HeadingLink {
  id: string;
  text: string;
  level: number;
}

function MiniTOC({ headings }: { headings: HeadingLink[] }) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -80% 0px' }
    );

    const headingElements = document.querySelectorAll('h1[id], h2[id], h3[id]');
    headingElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  if (headings.length < 5) return null;

  return (
    <nav className="hidden xl:block fixed top-24 right-8 w-64 max-h-[calc(100vh-8rem)] overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
          On This Page
        </h4>
        <ul className="space-y-3">
          {headings.map((heading) => (
            <li
              key={heading.id}
              style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}
            >
              <a
                href={`#${heading.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(heading.id)?.scrollIntoView({
                    behavior: 'smooth'
                  });
                }}
                className={cn(
                  'text-sm hover:text-primary transition-colors block',
                  activeId === heading.id
                    ? 'text-primary font-medium'
                    : 'text-gray-600 dark:text-gray-400'
                )}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

function LoadingState() {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center p-8 animate-in fade-in">
      <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
      <p className="text-gray-600 dark:text-gray-400">Loading handbook content...</p>
    </div>
  );
}

// Enhance ErrorState component to include a "Return to Handbook Home" button
function ErrorState({ error }: { error: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-[300px] flex flex-col items-center justify-center p-8 rounded-lg bg-red-50 dark:bg-red-900/20"
    >
      <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
      <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">
        Error Loading Content
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
        {error}
      </p>
      <button 
        onClick={() => window.location.assign('/handbook')}
        className="mt-6 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
      >
        Return to Handbook Home
      </button>
    </motion.div>
  );
}

// Add helper functions for path normalization and file existence check
function normalizePath(path: string): string {
  return path
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[()]/g, '')
    .replace(/,/g, '')
    .replace(/–/g, '-');
}

async function checkFileExists(path: string): Promise<boolean> {
  try {
    const response = await fetch(path, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

interface UniversalHandbookViewerProps {
  section: string;
  topic?: string;
}

/**
 * UniversalHandbookViewer provides a consistent interface for viewing content,
 * automatically detecting the format (.json or .md) and rendering appropriately.
 */
export const UniversalHandbookViewer: React.FC<Props> = ({ 
  filePath, 
  onTopicSelect, 
  activePath, 
  mode = 'content' 
}) => {
  const [contentPath, setContentPath] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fileType, setFileType] = useState<'json' | 'markdown' | null>(null);
  const [data, setData] = useState<TocEntry[] | TopicContent | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [headings, setHeadings] = useState<HeadingLink[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  // Extract section and topic from the URL
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean);

  const section = pathParts[1] || undefined;  // e.g., /handbook/general-oncology
  const topic = pathParts.length > 2 ? pathParts.slice(2).join('/') : undefined;

  console.log("📘 Section:", section);
  console.log("📘 Topic:", topic);

  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true);
      setError(null);
      setContentPath(null);
      setFileType(null);

      try {
        console.log(`🔍 Trying to load handbook content from: ${filePath}`);

        // Check if it's a JSON file
        if (filePath.endsWith('.json')) {
          console.log(`✅ Using JSON content at: ${filePath}`);
          setContentPath(filePath);
          setFileType('json');
          setIsLoading(false);
          return;
        }
        
        // Check if it's a Markdown file
        if (filePath.endsWith('.md')) {
          console.log(`✅ Using Markdown content at: ${filePath}`);
          setContentPath(filePath);
          setFileType('markdown');
          setIsLoading(false);
          return;
        }
        
        // If no extension, try both formats
        
        // Try JSON first
        const jsonPath = `${filePath}.json`;
        const jsonResponse = await fetch(jsonPath, { method: 'HEAD' });
        if (jsonResponse.ok) {
          console.log(`✅ Found JSON content at: ${jsonPath}`);
          setContentPath(jsonPath);
          setFileType('json');
          setIsLoading(false);
          return;
        }

        // Try markdown if JSON not found
        const markdownPath = `${filePath}.md`;
        const mdResponse = await fetch(markdownPath, { method: 'HEAD' });
        if (mdResponse.ok) {
          console.log(`✅ Found Markdown content at: ${markdownPath}`);
          setContentPath(markdownPath);
          setFileType('markdown');
          setIsLoading(false);
          return;
        }

        // If we get here, neither file could be found
        const errorPaths = [jsonPath, markdownPath].join(' or ');
        console.error(`❌ No content found at: ${errorPaths}`);
        setError(`Could not find content at the specified path. Please check the path and try again.`);
      } catch (err) {
        console.error('❌ Error in UniversalHandbookViewer:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    if (filePath) {
      loadContent();
    }
  }, [filePath]);

  // Scroll to top when content changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo(0, 0);
    }
  }, [section, topic]);

  // Show/hide scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        setShowScrollTop(contentRef.current.scrollTop > 300);
      }
    };

    const current = contentRef.current;
    if (current) {
      current.addEventListener('scroll', handleScroll);
      return () => current.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Extract headings from content safely
  useEffect(() => {
    if (data && !Array.isArray(data) && 'content' in data) {
      const extractedHeadings = data.content
        .filter(block => block.type === 'heading')
        .map((block, index) => ({
          id: `heading-${index}`,
          text: block.text || '',
          level: block.level || 2
        }));
      setHeadings(extractedHeadings);
    } else {
      setHeadings([]); // Reset safely for TOC view or null data
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading content...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Failed to Load Content</p>
            <p className="mt-1">{error}</p>
            <div className="mt-3 text-sm">
              <p>Looked for content at:</p>
              <code className="block mt-1 p-2 bg-red-100 dark:bg-red-900/40 rounded">
                {filePath}
              </code>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!contentPath || !fileType) {
    return (
      <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-700 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-300">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">No Content Available</p>
            <p className="mt-1">Could not determine the content type for: {filePath}</p>
          </div>
        </div>
      </div>
    );
  }

  // Render the appropriate viewer based on file type
  return (
    <div className="handbook-viewer">
      {fileType === 'json' && <JsonHandbookViewer filePath={contentPath} />}
      {fileType === 'markdown' && (
        <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 text-blue-700">
          <p>Markdown content will be displayed here when the viewer is implemented.</p>
          <p className="text-sm mt-2">File: {contentPath}</p>
        </div>
      )}
    </div>
  );
}

function MetadataDisplay({ metadata }: { metadata?: TopicContent['metadata'] }) {
  if (!metadata) return null;

  return (
    <div className="flex flex-wrap gap-4 mb-8 text-sm text-gray-600 dark:text-gray-400">
      {metadata.lastUpdated && (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>Updated: {metadata.lastUpdated}</span>
        </div>
      )}
      {metadata.version && (
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4" />
          <span>v{metadata.version}</span>
        </div>
      )}
      {metadata.author && (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4" />
          <span>{metadata.author}</span>
        </div>
      )}
      {metadata.license && (
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4" />
          <span>{metadata.license}</span>
        </div>
      )}
      {metadata.tags && metadata.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {metadata.tags.map((tag, i) => (
            <span 
              key={i}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
