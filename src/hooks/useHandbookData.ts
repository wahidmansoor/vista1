import { useState, useEffect } from 'react';
import { HandbookSection } from '@/modules/handbook/types/handbook';
import { isValidSection, getContentPath, getTocPath } from '@/utils/pathUtils';

interface UseHandbookDataReturn {
  tocData: any[] | null;
  activeFile: string | null;
  isLoading: boolean;
  error: Error | null;
  isValidSection: boolean;
}

export function useHandbookData(
  section?: string,
  topic?: string | null
): UseHandbookDataReturn {
  const [tocData, setTocData] = useState<any[] | null>(null);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadData = async () => {
      console.log('📚 useHandbookData loading:', { section, topic });
      setIsLoading(true);
      setError(null);
      setTocData(null);
      setActiveFile(null);

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

        // Get TOC data
        const tocPath = getTocPath(section as HandbookSection);
        console.log('📑 Loading TOC from:', tocPath);
        
        try {
          const tocResponse = await fetch(tocPath);
          if (!tocResponse.ok) {
            throw new Error(`Failed to load TOC: ${tocResponse.statusText}`);
          }
          
          const tocJson = await tocResponse.json();
          
          // Validate TOC structure
          if (!Array.isArray(tocJson)) {
            throw new Error(`Invalid TOC format: Expected an array but got ${typeof tocJson}`);
          }
          
          console.log('📑 TOC loaded successfully with', tocJson.length, 'entries');
          setTocData(tocJson);
        } catch (tocErr) {
          console.error('❌ Error loading TOC:', tocErr);
          throw new Error(`Failed to load handbook navigation: ${tocErr instanceof Error ? tocErr.message : 'Unknown error'}`);
        }

        // Get content file path
        if (topic) {
          const contentPath = getContentPath(section as HandbookSection, topic);
          console.log('📄 Content path:', contentPath);
          setActiveFile(contentPath);
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
    isLoading,
    error,
    isValidSection: section ? isValidSection(section) : false
  };
}