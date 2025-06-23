import { useState, useEffect, useMemo } from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';
import { HandbookContentBlock } from './types/handbook';
import { ContentRenderer } from './ContentRenderer';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import DOMPurify from 'dompurify';

interface UniversalContentViewerProps {
  content: string | null;
  format: 'markdown' | 'json' | null;
  isLoading: boolean;
  error: Error | null;
  title?: string;
}

// Add sticky header with metadata and progress
function StickyHeader({ metadata, totalBlocks, currentBlock }: {
  metadata?: any;
  totalBlocks: number;
  currentBlock: number;
}) {
  const progress = totalBlocks > 0 ? (currentBlock / totalBlocks) * 100 : 0;
  
  return (
    <div className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 print:hidden">
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

// Function to process JSON content into content blocks
function processJsonContent(jsonString: string): { blocks: HandbookContentBlock[], metadata: any } {
  try {
    const json = JSON.parse(jsonString);
    
    // Log detailed information about the content structure
    console.log('📄 Processing JSON content structure:', {
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
          type: 'definitions',
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
    
    console.log('✅ JSON content processed:', {
      contentBlocks: processedContent.length,
      metadata: metaData
    });
    
    return { blocks: processedContent, metadata: metaData };
  } catch (err) {
    console.error('❌ Error parsing JSON content:', err);
    
    // Return fallback content with error information
    return {
      blocks: [
        {
          type: 'heading',
          level: 2,
          text: 'Error Processing Content',
          id: 'error-heading'
        },
        {
          type: 'paragraph',
          text: `Failed to parse JSON content: ${err instanceof Error ? err.message : 'Unknown error'}`,
          id: 'error-message'
        },
        {
          type: 'code',
          language: 'text',
          text: jsonString,
          id: 'raw-content'
        }
      ],
      metadata: {}
    };
  }
}

export function UniversalContentViewer({ 
  content, 
  format, 
  isLoading, 
  error, 
  title 
}: UniversalContentViewerProps) {
  const [processedContent, setProcessedContent] = useState<HandbookContentBlock[] | null>(null);
  const [metadata, setMetadata] = useState<any>(null);
  const [currentVisibleBlock, setCurrentVisibleBlock] = useState(0);

  // Process content based on format
  const { contentBlocks, contentMetadata } = useMemo(() => {
    if (!content || !format) {
      return { contentBlocks: null, contentMetadata: null };
    }

    console.log('🔄 Processing content:', { format, contentLength: content.length });

    if (format === 'markdown') {
      // Sanitize markdown content to prevent XSS
      const sanitizedContent = DOMPurify.sanitize(content);
      const blocks = processMarkdownContent(sanitizedContent);
      
      // Extract metadata (simple frontmatter implementation)
      const metadataMatch = content.match(/^---\n([\s\S]*?)\n---/);
      const extractedMetadata: Record<string, string> = {};
      
      if (metadataMatch && metadataMatch[1]) {
        const frontMatter = metadataMatch[1];
        const frontMatterLines = frontMatter.split('\n');
        
        frontMatterLines.forEach(line => {
          const [key, value] = line.split(':').map(part => part.trim());
          if (key && value) {
            extractedMetadata[key] = value;
          }
        });
      }
      
      // Add title if provided
      if (title && !extractedMetadata.title) {
        extractedMetadata.title = title;
      }
      
      return { contentBlocks: blocks, contentMetadata: extractedMetadata };
    } else if (format === 'json') {
      const { blocks, metadata } = processJsonContent(content);
      
      // Add title if provided and not in metadata
      if (title && !metadata.title) {
        metadata.title = title;
      }
      
      return { contentBlocks: blocks, contentMetadata: metadata };
    }

    return { contentBlocks: null, contentMetadata: null };
  }, [content, format, title]);

  useEffect(() => {
    setProcessedContent(contentBlocks);
    setMetadata(contentMetadata);
  }, [contentBlocks, contentMetadata]);

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
  }, [processedContent]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300">
        <div className="flex items-start">
          <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0" />
          <div className="w-full">
            <h3 className="font-medium text-red-800 dark:text-red-200">Error Loading Content</h3>
            <p className="mt-1 font-semibold">{error.message}</p>
            
            <div className="mt-4 pt-3 border-t border-red-200 dark:border-red-800">
              <details className="text-sm">
                <summary className="cursor-pointer font-medium">Technical Details</summary>
                <div className="mt-2 p-2 bg-red-100 dark:bg-red-900/40 rounded overflow-x-auto">
                  <code className="whitespace-pre-wrap break-words">{error.stack || error.message}</code>
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!processedContent || processedContent.length === 0) {
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

  // For simple markdown, render directly with ReactMarkdown
  if (format === 'markdown' && (!processedContent || processedContent.length === 0)) {
    return (
      <div className="relative">
        <StickyHeader 
          metadata={metadata}
          totalBlocks={1}
          currentBlock={1}
        />
        
        <div className="pt-4 prose prose-slate dark:prose-invert prose-headings:scroll-mt-8 max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
          >
            {content || ''}
          </ReactMarkdown>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <StickyHeader 
        metadata={metadata}
        totalBlocks={processedContent?.length || 0}
        currentBlock={currentVisibleBlock}
      />
      
      <div className="pt-4">
        <ContentRenderer content={processedContent} />
      </div>
    </div>
  );
}
