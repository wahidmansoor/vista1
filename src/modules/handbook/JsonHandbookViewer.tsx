import { useState, useEffect } from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';
import { HandbookContentBlock } from './types/handbook';
import { ContentRenderer } from './ContentRenderer';

interface JsonHandbookViewerProps {
  filePath: string;
}

export function JsonHandbookViewer({ filePath }: JsonHandbookViewerProps) {
  const [content, setContent] = useState<HandbookContentBlock[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [metadata, setMetadata] = useState<any>(null);

  useEffect(() => {
    const loadContent = async () => {
      console.log('📖 JsonHandbookViewer loading:', filePath);
      setIsLoading(true);
      setError(null);
      setContent(null);
      setMetadata(null);

      try {
        const response = await fetch(filePath);
        console.log('📄 Content response:', {
          status: response.status,
          ok: response.ok,
          contentType: response.headers.get('content-type')
        });

        if (!response.ok) {
          throw new Error(`Failed to load content: ${response.statusText}`);
        }

        const json = await response.json();
        
        // Log more detailed information about the content structure
        console.log('📄 Content structure:', {
          hasContent: !!json.content,
          contentIsArray: Array.isArray(json.content),
          contentLength: json.content?.length || 0,
          hasDefaultSections: !!json.sections && Array.isArray(json.sections),
          keys: Object.keys(json)
        });
        
        // Handle different content formats
        let processedContent: HandbookContentBlock[] = [];
        let metaData = {};
        
        // Function to normalize block types and ensure proper structure
        const normalizeContentBlock = (block: any): HandbookContentBlock => {
          // If block is a string, convert to paragraph
          if (typeof block === 'string') {
            return {
              type: 'paragraph',
              text: block,
              id: `block-${Math.random().toString(36).substring(2, 11)}`
            };
          }
          
          // Clone the block to avoid mutating original
          const normalizedBlock = { ...block };
          
          // Ensure all blocks have an ID (if missing)
          if (!normalizedBlock.id) {
            normalizedBlock.id = `block-${Math.random().toString(36).substring(2, 11)}`;
          }
          
          // If normalizedBlock has a "list" property, convert it to a proper list block
          if (normalizedBlock.list && Array.isArray(normalizedBlock.list)) {
            normalizedBlock.type = normalizedBlock.type || 'list';
            normalizedBlock.items = normalizedBlock.list;
            delete normalizedBlock.list;
          }
          
          // Map alternative block types to standard ones
          if (normalizedBlock.type === 'bullets') {
            normalizedBlock.type = 'list';
          } else if (normalizedBlock.type === 'numbers') {
            normalizedBlock.type = 'numbers';
          } else if (normalizedBlock.type === 'definitions') {
            normalizedBlock.type = 'definitions';
          }
          
          // Ensure blocks have proper content field
          if (!normalizedBlock.text && !normalizedBlock.content) {
            if (typeof normalizedBlock.value === 'string') {
              normalizedBlock.text = normalizedBlock.value;
            } else if (typeof normalizedBlock.body === 'string') {
              normalizedBlock.text = normalizedBlock.body;
            }
          }
          
          // Ensure items are properly formatted (if present)
          if (normalizedBlock.items && !Array.isArray(normalizedBlock.items)) {
            // Handle case where items might be a string to be split
            if (typeof normalizedBlock.items === 'string') {
              normalizedBlock.items = normalizedBlock.items.split(/\r?\n/).filter(Boolean);
            } else {
              console.warn('Invalid items format:', normalizedBlock.items);
              normalizedBlock.items = [];
            }
          }
          
          return normalizedBlock as HandbookContentBlock;
        };

        // Process nested content which may contain complex structures
        const processNestedContent = (nestedContent: any): HandbookContentBlock[] => {
          if (!nestedContent) return [];
          
          // If it's already an array, normalize each element
          if (Array.isArray(nestedContent)) {
            return nestedContent.map(item => normalizeContentBlock(item));
          }
          
          // If it's a string, convert to a paragraph
          if (typeof nestedContent === 'string') {
            return [normalizeContentBlock({
              type: 'paragraph',
              text: nestedContent
            })];
          }
          
          // If it's an object, try to convert to appropriate block type
          if (typeof nestedContent === 'object' && nestedContent !== null) {
            // Check if it has a list property - common in Hallmarks-of-Cancer.json
            if (nestedContent.list && Array.isArray(nestedContent.list)) {
              return [normalizeContentBlock({
                type: 'list',
                items: nestedContent.list
              })];
            }
            
            // Check for other known structures
            if (nestedContent.type && typeof nestedContent.type === 'string') {
              return [normalizeContentBlock(nestedContent)];
            }
            
            // Handle other potential structures
            const blocks: HandbookContentBlock[] = [];
            for (const key in nestedContent) {
              const value = nestedContent[key];
              // Skip null values
              if (value === null) continue;
              
              if (Array.isArray(value)) {
                // If it's an array property, convert to list
                blocks.push(normalizeContentBlock({
                  type: key === 'numbers' ? 'numbers' : 'list',
                  items: value
                }));
              } else if (typeof value === 'string') {
                // String properties become paragraphs
                blocks.push(normalizeContentBlock({
                  type: 'paragraph',
                  text: value
                }));
              } else if (typeof value === 'object') {
                // Recursively process nested objects
                blocks.push(...processNestedContent(value));
              }
            }
            
            if (blocks.length > 0) {
              return blocks;
            }
          }
          
          // Fallback - convert to JSON and display as code
          return [normalizeContentBlock({
            type: 'code',
            text: JSON.stringify(nestedContent, null, 2)
          })];
        };
        
        // Handle standard format with "content" array
        if (json.content && Array.isArray(json.content)) {
          processedContent = json.content.map(normalizeContentBlock);
          const { content, ...rest } = json;
          metaData = rest;
        } 
        // Handle format with "sections" array
        else if (json.sections && Array.isArray(json.sections)) {
          // Create flat content from sections (to match the Introduction.json format)
          json.sections.forEach((section: any, sectionIndex: number) => {
            // Add section title as heading
            processedContent.push(normalizeContentBlock({
              type: 'heading',
              level: 2,
              text: section.title || 'Untitled Section',
              id: `section-${sectionIndex}`
            }));
            
            // Add section content if available
            if (section.content) {
              // Handle array of content blocks
              if (Array.isArray(section.content)) {
                section.content.forEach((contentItem: any) => {
                  // Process each content item, which might be a simple block or complex nested structure
                  processedContent.push(...processNestedContent(contentItem));
                });
              } 
              // Handle string content
              else if (typeof section.content === 'string') {
                processedContent.push(normalizeContentBlock({
                  type: 'paragraph',
                  text: section.content,
                  id: `paragraph-${sectionIndex}`
                }));
              }
              // Handle object with nested content (common in Hallmarks-of-Cancer.json)
              else if (typeof section.content === 'object' && section.content !== null) {
                processedContent.push(...processNestedContent(section.content));
              }
            }
          });
          
          const { sections, ...rest } = json;
          metaData = rest;
        }
        // Handle list-based formats (bullets, definitions, numbers)
        else if (json.bullets || json.numbers || json.definitions) {
          const listTypes = [
            { key: 'bullets', type: 'list' },
            { key: 'numbers', type: 'numbers' },
            { key: 'definitions', type: 'definitions' }
          ];
          
          listTypes.forEach(({ key, type }) => {
            if (json[key]) {
              let items = json[key];
              if (typeof items === 'string') {
                items = items.split(/\r?\n/).filter(Boolean);
              }
              
              if (Array.isArray(items) && items.length > 0) {
                processedContent.push(normalizeContentBlock({
                  type,
                  items,
                  id: `${key}-${Math.random().toString(36).substring(2, 9)}`
                }));
              }
            }
          });
          
          // Extract metadata
          const { bullets, numbers, definitions, ...rest } = json;
          metaData = rest;
        }
        // Handle content as direct properties
        else if (Object.keys(json).length > 0) {
          // Try to convert top-level properties into content blocks
          const keys = Object.keys(json).filter(key => 
            !['title', 'category', 'section', 'metadata', 'version', 'author'].includes(key)
          );
          
          if (keys.length > 0) {
            // Create a heading for each major property
            keys.forEach(key => {
              const value = json[key];
              
              // Add a section heading
              processedContent.push(normalizeContentBlock({
                type: 'heading',
                level: 2,
                text: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
                id: `section-${key}`
              }));
              
              // Handle different value types
              if (typeof value === 'string') {
                processedContent.push(normalizeContentBlock({
                  type: 'paragraph',
                  text: value,
                  id: `${key}-text`
                }));
              } else if (Array.isArray(value)) {
                // Determine if this should be bullets or numbers
                const type = key.includes('number') || key.includes('steps') ? 'numbers' : 'list';
                
                processedContent.push(normalizeContentBlock({
                  type,
                  items: value.map(item => typeof item === 'string' ? item : JSON.stringify(item)),
                  id: `${key}-list`
                }));
              } else if (typeof value === 'object' && value !== null) {
                // Check if this is a definitions-like object
                if (Object.keys(value).every(k => typeof value[k] === 'string')) {
                  const items = Object.entries(value).map(([k, v]) => `${k}: ${v}`);
                  processedContent.push(normalizeContentBlock({
                    type: 'definitions',
                    items,
                    id: `${key}-definitions`
                  }));
                } else {
                  // Convert object to markdown string representation
                  const text = Object.entries(value)
                    .map(([k, v]) => `**${k}**: ${v}`)
                    .join('\n\n');
                    
                  processedContent.push(normalizeContentBlock({
                    type: 'markdown',
                    text,
                    id: `${key}-obj`
                  }));
                }
              }
            });
            
            // Extract potential metadata
            const metadataProps = ['title', 'category', 'section', 'metadata', 'version', 'author'];
            metaData = Object.fromEntries(
              Object.entries(json).filter(([key]) => metadataProps.includes(key))
            );
          }
        }
        
        // Fallback for completely unexpected formats
        if (processedContent.length === 0) {
          // Convert the entire JSON to a code block as a last resort
          processedContent = [normalizeContentBlock({
            type: 'code',
            text: JSON.stringify(json, null, 2),
            id: 'raw-json'
          })];
        }
        
        console.log('✅ Content processed:', {
          contentBlocks: processedContent.length,
          metadata: metaData
        });
        
        setContent(processedContent);
        setMetadata(metaData);
      } catch (err) {
        console.error('❌ Error loading content:', err);
        setError(err instanceof Error ? err.message : 'Failed to load content');
      } finally {
        setIsLoading(false);
      }
    };

    if (filePath) {
      loadContent();
    }
  }, [filePath]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
        <div className="flex items-start">
          <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0" />
          <div>
            <p className="font-medium">Error Loading Content</p>
            <p className="mt-1">{error}</p>
            <p className="mt-4 text-sm">
              File path: <code className="bg-red-100 px-1 py-0.5 rounded">{filePath}</code>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!content || content.length === 0) {
    return (
      <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-700">
        <div className="flex items-start">
          <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0" />
          <div>
            <p className="font-medium">No Content Available</p>
            <p className="mt-1">The document appears to be empty or incorrectly formatted.</p>
            <p className="mt-4 text-sm">
              File path: <code className="bg-yellow-100 px-1 py-0.5 rounded">{filePath}</code>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <ContentRenderer content={content} />;
}