import { useState, useEffect } from 'react';
import { HandbookSection } from '@/modules/handbook/types/handbook';
import { isValidSection, getTocPath, getContentPath } from '@/utils/pathUtils';
import { UseHandbookDataReturn } from '@/modules/handbook/types/handbook';

// Extended interface for backward compatibility with existing code
interface ExtendedUseHandbookDataReturn extends UseHandbookDataReturn {
  tocData: any[] | null;
  activeFile: string | null;
  isValidSection: boolean;
}

export function useHandbookData(
  section?: string,
  topic?: string | null
): ExtendedUseHandbookDataReturn {
  const [tocData, setTocData] = useState<any[] | null>(null);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [content, setContent] = useState<string | null>(null);
  const [format, setFormat] = useState<'markdown' | 'json' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadData = async () => {
      console.log('📚 useHandbookData loading from local files:', { section, topic });
      setIsLoading(true);
      setError(null);
      setTocData(null);
      setActiveFile(null);
      setContent(null);
      setFormat(null);

      try {
        if (!section) {
          console.log('ℹ️ No section provided, skipping load');
          setIsLoading(false);
          return;
        }

        if (!isValidSection(section)) {
          console.warn('⚠️ Invalid section:', section);
          setError(new Error(`Invalid handbook section: ${section}`));
          setIsLoading(false);
          return;
        }

        // Get TOC data - fetch from local toc.json file
        console.log('📑 Loading TOC from local files for section:', section);
        
        try {
          const tocPath = getTocPath(section as HandbookSection);
          console.log('📑 Fetching TOC from:', tocPath);
          
          const tocResponse = await fetch(tocPath);
          if (!tocResponse.ok) {
            throw new Error(`Failed to fetch TOC: ${tocResponse.status} ${tocResponse.statusText}`);
          }

          const tocJson = await tocResponse.json();
          console.log('📑 TOC loaded successfully:', tocJson);

          // Transform TOC data to match expected format (keep nested structure)
          let transformedToc: any[] = [];
          
          // Helper function to ensure all items have valid titles and paths
          const validateToc = (items: any[], basePath: string = ''): any[] => {
            if (!Array.isArray(items)) {
              return [];
            }
            
            return items
              .filter(item => item && item.title && item.title !== 'undefined')
              .map((item: any) => ({
                id: item.id || item.path || item.title,
                title: item.title,
                path: item.path 
                  ? (basePath && !item.path.includes('/') 
                      ? `${basePath}/${item.path}` 
                      : item.path)
                  : undefined,
                items: item.items ? validateToc(item.items, item.path || basePath) : undefined
              }))
              .filter(item => item.title); // Remove any items that still don't have titles
          };
          
          if (Array.isArray(tocJson)) {
            // Process the nested structure, preserving nesting
            transformedToc = validateToc(tocJson);
          } else if (tocJson.chapters && Array.isArray(tocJson.chapters)) {
            transformedToc = validateToc(tocJson.chapters);
          } else if (tocJson.sections && Array.isArray(tocJson.sections)) {
            transformedToc = validateToc(tocJson.sections);
          } else {
            // If it's an object with properties, convert to array
            transformedToc = Object.entries(tocJson)
              .filter(([, item]: [string, any]) => item && item.title)
              .map(([key, item]: [string, any]) => ({
                id: item.id || key,
                title: item.title || key,
                path: item.path || `/handbook/${section}/${key}`,
                items: item.items ? validateToc(item.items) : undefined
              }));
          }

          console.log('📑 Transformed TOC loaded successfully with', transformedToc.length, 'entries');
          setTocData(transformedToc);

        } catch (tocErr) {
          console.error('❌ Error loading TOC:', tocErr);
          throw new Error(`Failed to load handbook navigation: ${tocErr instanceof Error ? tocErr.message : 'Unknown error'}`);
        }

        // Get specific content if topic is provided
        if (topic) {
          console.log('📄 Loading content from local files for:', { section, topic });
          
          try {
            const contentPath = getContentPath(section as HandbookSection, topic);
            console.log('📄 Fetching content from:', contentPath);
            
            const contentResponse = await fetch(contentPath);
            if (!contentResponse.ok) {
              throw new Error(`Content not found: ${contentResponse.status} ${contentResponse.statusText}`);
            }

            const contentText = await contentResponse.text();
            
            // Determine format based on file extension
            const fileFormat = contentPath.endsWith('.md') ? 'markdown' : 'json';
            
            setContent(contentText);
            setFormat(fileFormat);
            setActiveFile(contentPath);
            console.log('📄 Content loaded successfully:', { 
              format: fileFormat, 
              contentLength: contentText.length 
            });
          } catch (contentErr) {
            console.error('❌ Error loading content:', contentErr);
            throw contentErr;
          }
        } else {
          console.log('ℹ️ No topic provided, skipping content load');
        }

      } catch (err) {
        console.error('❌ Error in useHandbookData:', err);
        setError(err instanceof Error ? err : new Error('Failed to load handbook data'));
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [section, topic]);

  return {
    tocData,
    activeFile,
    content,
    format,
    isLoading,
    error,
    isValidSection: section ? isValidSection(section) : false
  };
}
