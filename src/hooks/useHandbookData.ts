import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { HandbookSection } from '@/modules/handbook/types/handbook';
import { isValidSection } from '@/utils/pathUtils';
import { UseHandbookDataReturn } from '@/modules/handbook/types/handbook';
import { palliativeCareTOC } from '../handbook/palliative-care/palliativeTOC';

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
      console.log('📚 useHandbookData loading from Supabase:', { section, topic });
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

        // Get TOC data - fetch all entries for the section to build navigation
        console.log('📑 Loading TOC from Supabase for section:', section);
        
        try {
          // Check if this is the palliative-care section and use manual ordering
          if (section === 'palliative-care') {
            console.log('📑 Using manual TOC ordering for palliative-care section');
            
            try {
              // Get all entries for the section from Supabase
              const { data: tocEntries, error: tocError } = await supabase
                .from('handbook_files')
                .select('topic, title, path')
                .eq('section', section);

              if (tocError) {
                throw new Error(`Failed to load TOC: ${tocError.message}`);
              }

              if (!tocEntries || tocEntries.length === 0) {
                console.warn('⚠️ No TOC entries found for section:', section);
                setTocData([]);
              } else {
                // Create a map of topic to entry for quick lookup
                const entryMap = new Map(tocEntries.map(entry => [
                  entry.topic.replace('.md', ''), // Remove .md extension for matching
                  entry
                ]));

                // Use manual ordering from palliativeCareTOC
                const orderedToc = palliativeCareTOC.map(tocItem => {
                  const topicKey = tocItem.path;
                  const dbEntry = entryMap.get(topicKey);
                  
                  return {
                    id: tocItem.path,
                    title: dbEntry?.title || tocItem.title,
                    path: `/handbook/palliative-care/${tocItem.path}`
                  };
                }).filter(item => item.title); // Filter out items that weren't found in DB

                // Add any entries from DB that weren't in the manual TOC (as fallback)
                const manualTopics = new Set(palliativeCareTOC.map(item => item.path));
                const additionalEntries = tocEntries
                  .filter(entry => !manualTopics.has(entry.topic.replace('.md', '')))
                  .map(entry => ({
                    id: entry.topic,
                    title: entry.title,
                    path: entry.path || `/${section}/${entry.topic}`
                  }));

                const finalToc = [...orderedToc, ...additionalEntries];
                
                console.log('📑 Manual TOC loaded successfully with', finalToc.length, 'entries in clinical order');
                setTocData(finalToc);
              }
            } catch (manualTocErr) {
              console.warn('⚠️ Failed to use manual TOC, falling back to alphabetical:', manualTocErr);
              // Fallback to alphabetical ordering if manual TOC fails
              const { data: tocEntries, error: tocError } = await supabase
                .from('handbook_files')
                .select('topic, title, path')
                .eq('section', section)
                .order('topic');

              if (tocError) {
                throw new Error(`Failed to load TOC: ${tocError.message}`);
              }

              const transformedToc = tocEntries?.map(entry => ({
                id: entry.topic,
                title: entry.title,
                path: entry.path || `/${section}/${entry.topic}`
              })) || [];
              
              setTocData(transformedToc);
            }
          } else {
            // Use default alphabetical ordering for other sections
            const { data: tocEntries, error: tocError } = await supabase
              .from('handbook_files')
              .select('topic, title, path')
              .eq('section', section)
              .order('topic');

            if (tocError) {
              throw new Error(`Failed to load TOC: ${tocError.message}`);
            }

            if (!tocEntries || tocEntries.length === 0) {
              console.warn('⚠️ No TOC entries found for section:', section);
              setTocData([]);
            } else {
              // Transform Supabase data to match existing TOC format
              const transformedToc = tocEntries.map(entry => ({
                id: entry.topic,
                title: entry.title,
                path: entry.path || `/${section}/${entry.topic}`
              }));
              
              console.log('📑 TOC loaded successfully with', transformedToc.length, 'entries');
              setTocData(transformedToc);
            }
          }
        } catch (tocErr) {
          console.error('❌ Error loading TOC:', tocErr);
          throw new Error(`Failed to load handbook navigation: ${tocErr instanceof Error ? tocErr.message : 'Unknown error'}`);
        }

        // Get specific content if topic is provided
        if (topic) {
          console.log('📄 Loading content from Supabase for:', { section, topic });
          
          try {
            const { data: contentData, error: contentError } = await supabase
              .from('handbook_files')
              .select('content, format, title, path')
              .eq('section', section)
              .eq('topic', topic)
              .single();

            if (contentError) {
              if (contentError.code === 'PGRST116') {
                throw new Error(`Content not found for ${section}/${topic}`);
              }
              throw new Error(`Failed to load content: ${contentError.message}`);
            }

            if (contentData) {
              setContent(contentData.content);
              setFormat(contentData.format);
              setActiveFile(contentData.path || `/${section}/${topic}`);
              console.log('📄 Content loaded successfully:', { 
                format: contentData.format, 
                contentLength: contentData.content?.length 
              });
            }
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
