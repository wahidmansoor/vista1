import { useState, useEffect } from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';
import { HandbookContentBlock } from './types/handbook';
import { ContentRenderer } from './ContentRenderer';

interface JsonHandbookViewerProps {
  filePath: string;
}

// Add sticky header with metadata and progress
function StickyHeader({ metadata, totalBlocks, currentBlock }: {
  metadata?: any;
  totalBlocks: number;
  currentBlock: number;
}) {
  const progress = totalBlocks > 0 ? (currentBlock / totalBlocks) * 100 : 0;
  
  return (
    <div className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 print:hidden">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {metadata?.title && (
              <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                {metadata.title}
              </h1>
            )}
            {metadata?.category && (
              <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                {metadata.category}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            {metadata?.lastUpdated && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Updated: {metadata.lastUpdated}
              </span>
            )}
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {currentBlock}/{totalBlocks} sections
            </div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-2 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// Helper function to convert markdown content to content blocks
function processMarkdownContent(markdown: string): HandbookContentBlock[] {
  const blocks: HandbookContentBlock[] = [];
  const lines = markdown.split('\n');
  
  let currentTextBlock: string[] = [];
  let currentListItems: string[] = [];
  let tableLines: string[] = [];
  let inCodeBlock = false;
  let blockId = 1;
  
  const generateId = (type: string) => `${type}-${blockId++}`;
  
  const flushTextBlock = () => {
    if (currentTextBlock.length > 0) {
      blocks.push({
        type: 'paragraph',
        text: currentTextBlock.join('\n'),
        id: generateId('p')
      });
      currentTextBlock = [];
    }
  };
  
  const flushListItems = () => {
    if (currentListItems.length > 0) {
      blocks.push({
        type: 'list',
        items: currentListItems,
        id: generateId('list')
      });
      currentListItems = [];
    }
  };
  
  const flushTableLines = () => {
    if (tableLines.length > 0) {
      blocks.push({
        type: 'table',
        text: tableLines.join('\n'),
        id: generateId('table')
      });
      tableLines = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Handle code blocks
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        inCodeBlock = false;
        continue;
      } else {
        flushTextBlock();
        flushListItems();
        inCodeBlock = true;
        const language = line.trim().slice(3);
        const codeLines = [];
        i++;
        
        while (i < lines.length && !lines[i].trim().startsWith('```')) {
          codeLines.push(lines[i]);
          i++;
        }
        
        blocks.push({
          type: 'code',
          language: language || 'plaintext',
          text: codeLines.join('\n'),
          id: generateId('code')
        });
        continue;
      }
    }
    
    if (inCodeBlock) continue;
    
    // Handle headings
    if (line.startsWith('# ')) {
      flushTextBlock();
      flushListItems();
      flushTableLines();
      blocks.push({
        type: 'heading',
        level: 1,
        text: line.substring(2),
        id: generateId('h1')
      });
    } else if (line.startsWith('## ')) {
      flushTextBlock();
      flushListItems();
      flushTableLines();
      blocks.push({
        type: 'heading',
        level: 2,
        text: line.substring(3),
        id: generateId('h2')
      });
    } else if (line.startsWith('### ')) {
      flushTextBlock();
      flushListItems();
      flushTableLines();
      blocks.push({
        type: 'heading',
        level: 3,
        text: line.substring(4),
        id: generateId('h3')
      });
    } else if (line.startsWith('#### ')) {
      flushTextBlock();
      flushListItems();
      flushTableLines();
      blocks.push({
        type: 'heading',
        level: 4,
        text: line.substring(5),
        id: generateId('h4')
      });
    }
    // Handle blockquotes (Clinical Pearl)
    else if (line.startsWith('> ')) {
      flushTextBlock();
      flushListItems();
      flushTableLines();
      const quoteLines = [line.substring(2)];
      i++;
      
      while (i < lines.length && lines[i].startsWith('> ')) {
        quoteLines.push(lines[i].substring(2));
        i++;
      }
      i--; // Move back one to process this line next time
      
      blocks.push({
        type: 'clinical_pearl',
        text: quoteLines.join('\n'),
        id: generateId('pearl')
      });
    }
    // Handle lists
    else if (line.trim().match(/^[\*\-\•]\s/)) {
      flushTextBlock();
      flushTableLines();
      currentListItems.push(line.trim().substring(2));
    }
    // Handle tables
    else if (line.includes('|') && (line.trim().startsWith('|') || line.trim().endsWith('|'))) {
      flushTextBlock();
      flushListItems();
      tableLines.push(line);
      
      // Collect all table rows
      while (i + 1 < lines.length && lines[i + 1].includes('|') && 
            (lines[i + 1].trim().startsWith('|') || lines[i + 1].trim().endsWith('|'))) {
        i++;
        tableLines.push(lines[i]);
      }
    }
    // Handle horizontal rules
    else if (line.trim() === '---' || line.trim() === '***' || line.trim() === '___') {
      flushTextBlock();
      flushListItems();
      flushTableLines();
      blocks.push({
        type: 'divider',
        id: generateId('divider')
      });
    }
    // Handle regular paragraphs
    else if (line.trim() !== '') {
      flushListItems();
      flushTableLines();
      currentTextBlock.push(line);
    } else if (line.trim() === '' && currentTextBlock.length > 0) {
      // Empty line after text content
      flushTextBlock();
    }
  }
  
  // Flush any remaining content
  flushTextBlock();
  flushListItems();
  flushTableLines();
  
  return blocks;
}

export function JsonHandbookViewer({ filePath }: JsonHandbookViewerProps) {
  const [content, setContent] = useState<HandbookContentBlock[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [metadata, setMetadata] = useState<any>(null);
  const [currentVisibleBlock, setCurrentVisibleBlock] = useState(0);

  useEffect(() => {
    const loadContent = async () => {
      console.log('📖 JsonHandbookViewer loading:', filePath);
      setIsLoading(true);
      setError(null);
      setContent(null);
      setMetadata(null);      try {
        const response = await fetch(filePath);
        console.log('📄 Content response:', {
          status: response.status,
          ok: response.ok,
          contentType: response.headers.get('content-type'),
          filePath
        });

        if (!response.ok) {
          // Show more detailed error information
          throw new Error(`Failed to load content (${response.status}): ${response.statusText}\nFile path: ${filePath}`);
        }
        
        // Check if the content type is HTML which indicates an error page was returned
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('text/html') && !filePath.toLowerCase().endsWith('.html')) {
          throw new Error(`Invalid content received: The server returned HTML instead of the expected format.\nFile path: ${filePath}\n\nThis usually happens when the file doesn't exist or there's a server configuration issue.`);
        }

        // Check if the file is Markdown or JSON based on extension
        if (filePath.toLowerCase().endsWith('.md')) {
          const markdownText = await response.text();
          console.log('📝 Processing markdown content...');
          
          // Process markdown into content blocks
          const processedContent = processMarkdownContent(markdownText);
          
          // Extract metadata (simple frontmatter implementation)
          const metadataMatch = markdownText.match(/^---\n([\s\S]*?)\n---/);
          const metadata: Record<string, string> = {};
          
          if (metadataMatch && metadataMatch[1]) {
            const frontMatter = metadataMatch[1];
            const frontMatterLines = frontMatter.split('\n');
            
            frontMatterLines.forEach(line => {
              const [key, value] = line.split(':').map(part => part.trim());
              if (key && value) {
                metadata[key] = value;
              }
            });
          }
          
          setContent(processedContent);
          setMetadata(metadata);
        } else {
          // Handle JSON content as before
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
                id: `p-${Math.random().toString(36).substring(2, 11)}`
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
              normalizedBlock.items = normalizedBlock.list;
              normalizedBlock.type = 'list';
              delete normalizedBlock.list;
            }
            
            // Map alternative block types to standard ones
            if (normalizedBlock.type === 'bullets') {
              normalizedBlock.type = 'list';
            } else if (normalizedBlock.type === 'numbers') {
              normalizedBlock.type = 'list';
              normalizedBlock.ordered = true;
            } else if (normalizedBlock.type === 'definitions') {
              normalizedBlock.type = 'definition_list';
            }
            
            // Ensure blocks have proper content field
            if (!normalizedBlock.text && normalizedBlock.content) {
              normalizedBlock.text = normalizedBlock.content;
            }
            
            // Ensure items are properly formatted (if present)
            if (normalizedBlock.items && !Array.isArray(normalizedBlock.items)) {
              normalizedBlock.items = [normalizedBlock.items.toString()];
            }
            
            return normalizedBlock as HandbookContentBlock;
          };

          // Process nested content which may contain complex structures
          const processNestedContent = (nestedContent: any): HandbookContentBlock[] => {
            if (!nestedContent) return [];
            
            // If it's already an array, normalize each element
            if (Array.isArray(nestedContent)) {
              return nestedContent.map(normalizeContentBlock);
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
              return [normalizeContentBlock(nestedContent)];
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
            // Create flat content from sections
            processedContent = [];
            
            json.sections.forEach((section: any, sectionIndex: number) => {
              if (section.title) {
                processedContent.push({
                  type: 'heading',
                  level: 2,
                  text: section.title,
                  id: `section-${sectionIndex}`
                });
              }
              
              if (section.content) {
                const sectionContent = processNestedContent(section.content);
                processedContent = [...processedContent, ...sectionContent];
              }
            });
            
            const { sections, ...rest } = json;
            metaData = rest;
          }
          // Handle list-based formats (bullets, definitions, numbers)
          else if (json.bullets || json.numbers || json.definitions) {
            if (json.title) {
              processedContent.push({
                type: 'heading',
                level: 1,
                text: json.title,
                id: 'title'
              });
            }
            
            if (json.bullets && Array.isArray(json.bullets)) {
              processedContent.push({
                type: 'list',
                items: json.bullets,
                id: 'bullets'
              });
            }
            
            if (json.numbers && Array.isArray(json.numbers)) {
              processedContent.push({
                type: 'list',
                items: json.numbers,
                ordered: true,
                id: 'numbers'
              });
            }
            
            if (json.definitions && Array.isArray(json.definitions)) {
              processedContent.push({
                type: 'definition_list',
                items: json.definitions,
                id: 'definitions'
              });
            }
            
            const { bullets, numbers, definitions, ...rest } = json;
            metaData = rest;
          }
          else if (Object.keys(json).length > 0) {
            // For simple objects, convert directly to content blocks
            processedContent = Object.entries(json).map(([key, value]) => {
              // Skip metadata-like fields
              if (['title', 'summary', 'author', 'version', 'category', 'section'].includes(key)) {
                return null;
              }
              
              if (key === 'text' || key === 'description') {
                return {
                  type: 'paragraph',
                  text: value as string,
                  id: key
                };
              }
              
              if (Array.isArray(value)) {
                return {
                  type: 'list',
                  items: value.map(v => typeof v === 'string' ? v : JSON.stringify(v)),
                  id: key
                };
              }
              
              return {
                type: 'heading',
                level: 3,
                text: key,
                id: `section-${key}`
              };
            }).filter(Boolean) as HandbookContentBlock[];
            
            metaData = {
              title: json.title,
              summary: json.summary,
              author: json.author,
              version: json.version,
              category: json.category,
              section: json.section
            };
          }
          
          // Fallback for completely unexpected formats
          if (processedContent.length === 0) {
            processedContent = [
              {
                type: 'heading',
                level: 2,
                text: 'Content',
                id: 'content-heading'
              },
              {
                type: 'code',
                language: 'json',
                text: JSON.stringify(json, null, 2),
                id: 'raw-content'
              }
            ];
          }
          
          console.log('✅ Content processed:', {
            contentBlocks: processedContent.length,
            metadata: metaData
          });
          
          setContent(processedContent);
          setMetadata(metaData);
        }      } catch (err) {
        console.error('❌ Error loading content:', err);
        
        // Provide more helpful error messages
        let errorMessage = err instanceof Error ? err.message : 'Failed to load content';
        
        // Special case for common JSON parsing errors 
        if (errorMessage.includes('Unexpected token')) {
          errorMessage = `${errorMessage}\n\nThis is likely because the file is not valid JSON or is actually an HTML error page.`;
          
          // Add suggestions based on file path
          if (filePath.includes('radiation_handbook') || filePath.includes('radiation-oncology')) {
            errorMessage += `\n\nSuggestion: Check if the file exists at the correct path. The radiation handbook uses .md files in the 'sections' directory.`;
          }
        }
        
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    if (filePath) {
      loadContent();
    }
  }, [filePath]);

  // Add scroll tracking for progress indicator
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('[data-block-index]');
      const viewportTop = window.scrollY + 200; // Offset for sticky header
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i] as HTMLElement;
        if (section.offsetTop <= viewportTop) {
          const blockIndex = parseInt(section.getAttribute('data-block-index') || '0', 10);
          setCurrentVisibleBlock(blockIndex);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [content]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }
  if (error) {
    // Split error message into lines for better formatting
    const errorLines = error.split('\n');
    const mainError = errorLines[0];
    const detailLines = errorLines.slice(1);
    
    return (
      <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300">
        <div className="flex items-start">
          <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0" />
          <div className="w-full">
            <h3 className="font-medium text-red-800 dark:text-red-200">Error Loading Content</h3>
            <p className="mt-1 font-semibold">{mainError}</p>
            
            {detailLines.length > 0 && (
              <div className="mt-3 text-sm">
                {detailLines.map((line, i) => (
                  <p key={i} className={i === 0 ? "" : "mt-1"}>
                    {line}
                  </p>
                ))}
              </div>
            )}
            
            <div className="mt-4 pt-3 border-t border-red-200 dark:border-red-800">
              <details className="text-sm">
                <summary className="cursor-pointer font-medium">Technical Details</summary>
                <div className="mt-2 p-2 bg-red-100 dark:bg-red-900/40 rounded overflow-x-auto">
                  <code className="whitespace-pre-wrap break-words">{filePath}</code>
                </div>
              </details>
            </div>
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
            <h3 className="font-medium text-yellow-800">No Content Available</h3>
            <p className="mt-1">This topic does not have any content yet.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <StickyHeader 
        metadata={metadata}
        totalBlocks={content?.length || 0}
        currentBlock={currentVisibleBlock}
      />
      
      <div className="pt-4">
        <ContentRenderer content={content} />
      </div>
    </div>
  );
}