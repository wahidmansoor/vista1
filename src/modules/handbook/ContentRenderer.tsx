import React from 'react';
import { HandbookContentBlock } from './types/handbook';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { AlertCircle, AlertTriangle, Info, FileText, Book } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

// Create simple UI components to avoid external dependencies
const Separator: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => (
  <div {...props} className={cn("h-px bg-gray-200 dark:bg-gray-700", props.className)} />
);

interface ContentRendererProps {
  content: HandbookContentBlock[];
  className?: string;
  enableActiveHighlighting?: boolean;
}

// Enhanced markdown rendering with better prose styling
const renderMarkdown = (text: string) => {
  if (!text) return null;
  
  return (
    <div className="prose prose-slate dark:prose-invert prose-headings:scroll-mt-8 max-w-none 
                   prose-h1:text-2xl prose-h1:font-bold prose-h1:text-gray-900 dark:prose-h1:text-gray-100
                   prose-h2:text-xl prose-h2:font-semibold prose-h2:text-gray-800 dark:prose-h2:text-gray-200
                   prose-h3:text-lg prose-h3:font-medium prose-h3:text-gray-800 dark:prose-h3:text-gray-200
                   prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed
                   prose-li:text-gray-700 dark:prose-li:text-gray-300
                   prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                   prose-pre:bg-gray-50 dark:prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-200 dark:prose-pre:border-gray-700
                   prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-primary/5
                   prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                   prose-strong:font-semibold prose-strong:text-gray-900 dark:prose-strong:text-gray-100">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
};

// Function to generate a stable key for content blocks
const getKey = (block: HandbookContentBlock, index: number, prefix = 'content') => {
  // Always include the index for reliability
  return block.id ? `${prefix}-${block.id}-${index}` : `${prefix}-${index}`;
};

// Helper to get content from various possible properties
const getBlockContent = (block: HandbookContentBlock): string => {
  if (typeof block.content === 'string') return block.content;
  if (typeof block.text === 'string') return block.text;
  return '';
};

// Recursive function to render nested lists
const renderNestedList = (
  items: any[], 
  parentKey: string, 
  ordered: boolean = false, 
  level: number = 0
): JSX.Element => {
  const ListTag = ordered ? 'ol' : 'ul';
  const listClasses = cn(
    "space-y-1 my-1",
    ordered ? "list-decimal" : "list-disc",
    level === 0 ? "pl-6" : "pl-4"
  );
  
  return (
    <ListTag className={listClasses}>
      {items.map((item, index) => {
        const itemKey = `${parentKey}-item-${index}`;
        
        // Case 1: Simple string item
        if (typeof item === 'string') {
          return (
            <li key={itemKey} className="pl-1">
              {renderMarkdown(item)}
            </li>
          );
        }
        
        // Case 2: Object with text and sublist
        if (item && typeof item === 'object') {
          // Check if it's a complex item with a sublist
          if ('text' in item && 'sublist' in item && Array.isArray(item.sublist)) {
            return (
              <li key={itemKey} className="pl-1">
                {renderMarkdown(item.text)}
                {renderNestedList(item.sublist, `${itemKey}-sublist`, false, level + 1)}
              </li>
            );
          }
          
          // Case 3: Simple object item, convert to string
          return (
            <li key={itemKey} className="pl-1">
              {JSON.stringify(item)}
            </li>
          );
        }
        
        // Case 4: Fallback for any other type
        return (
          <li key={itemKey} className="pl-1">
            {String(item)}
          </li>
        );
      })}
    </ListTag>
  );
};

export function ContentRenderer({ content, className }: ContentRendererProps) {
  // Helper to check if we should show a section separator
  const shouldShowSeparator = (block: HandbookContentBlock, index: number) => {
    if (index === 0) return false;
    if (block.type !== 'heading') return false;
    // Add separators for H2 or higher
    return block.level && block.level <= 2;
  };

  if (!content || !Array.isArray(content) || content.length === 0) {
    return (
      <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-700 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-300">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p>No content blocks available to render.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("handbook-content space-y-4", className)}>
      {content.map((block, index) => {
        // Show section separators for headings
        if (shouldShowSeparator(block, index)) {
          return (
            <React.Fragment key={getKey(block, index)}>
              <Separator className="my-6" />
              {renderBlock(block, index)}
            </React.Fragment>
          );
        }
        return renderBlock(block, index);
      })}
    </div>
  );

  function renderBlock(block: HandbookContentBlock, index: number) {
    const content = getBlockContent(block);
    
    switch (block.type) {
      case 'heading': {
        const level = block.level || 2;
        const validLevel = Math.min(Math.max(level, 1), 6); // Ensure level is between 1-6
        
        const HeadingTag = `h${validLevel}` as keyof JSX.IntrinsicElements;
        const headingClasses = {
          1: "text-3xl font-bold tracking-tight mb-4",
          2: "text-2xl font-semibold tracking-tight mt-8 mb-4",
          3: "text-xl font-semibold tracking-tight mt-6 mb-3",
          4: "text-lg font-semibold tracking-tight mt-4 mb-2",
          5: "text-base font-medium tracking-tight mt-4 mb-2",
          6: "text-sm font-medium tracking-tight mt-4 mb-2"
        }[validLevel] || "text-lg font-semibold tracking-tight mt-4 mb-2";
        
        return (
          <HeadingTag 
            key={getKey(block, index)} 
            id={block.id || `heading-${index}`}
            className={headingClasses}
          >
            {renderMarkdown(content)}
          </HeadingTag>
        );
      }

      case 'paragraph':
        return (
          <div key={getKey(block, index)} className="text-base leading-7 mb-4 text-gray-800 dark:text-gray-200">
            {renderMarkdown(content)}
          </div>
        );

      case 'list':
      case 'bullets': {
        if (!block.items || !Array.isArray(block.items) || block.items.length === 0) {
          return null;
        }
        
        return (
          <div key={getKey(block, index)} className="my-4">
            {renderNestedList(block.items, getKey(block, index), false)}
          </div>
        );
      }

      case 'numbers': {
        if (!block.items || !Array.isArray(block.items) || block.items.length === 0) {
          return null;
        }
        
        return (
          <div key={getKey(block, index)} className="my-4">
            {renderNestedList(block.items, getKey(block, index), true)}
          </div>
        );
      }

      case 'definitions': {
        if (!block.items || !Array.isArray(block.items) || block.items.length === 0) {
          return null;
        }
        
        return (
          <dl key={getKey(block, index)} className="space-y-4 text-base leading-7 my-4">
            {block.items.map((item, itemIndex) => {
              const itemKey = `${getKey(block, index)}-def-${itemIndex}`;
              
              // Case 1: String in format "term: definition"
              if (typeof item === 'string') {
                const parts = item.split(/:\s*(.+)/);
                const term = parts[0];
                const definition = parts.length >= 2 ? parts[1] : '';
                
                return (
                  <div key={itemKey} className="mt-2">
                    <dt className="font-semibold text-gray-900 dark:text-gray-100">{renderMarkdown(term)}</dt>
                    <dd className="mt-1 pl-4 text-gray-700 dark:text-gray-300">{renderMarkdown(definition)}</dd>
                  </div>
                );
              }
              
              // Case 2: Object with term and definition properties
              if (item && typeof item === 'object') {
                const definitionItem = item as Record<string, any>;
                
                if ('term' in definitionItem) {
                  const term = String(definitionItem.term || '');
                  
                  // Case 2.1: Object with term and definition
                  if ('definition' in definitionItem) {
                    const definition = String(definitionItem.definition || '');
                    return (
                      <div key={itemKey} className="mt-2">
                        <dt className="font-semibold text-gray-900 dark:text-gray-100">{renderMarkdown(term)}</dt>
                        <dd className="mt-1 pl-4 text-gray-700 dark:text-gray-300">{renderMarkdown(definition)}</dd>
                      </div>
                    );
                  }
                  
                  // Case 2.2: Object with term and sublist
                  if ('sublist' in definitionItem && Array.isArray(definitionItem.sublist)) {
                    return (
                      <div key={itemKey} className="mt-2">
                        <dt className="font-semibold text-gray-900 dark:text-gray-100">{renderMarkdown(term)}</dt>
                        <dd className="mt-1 pl-4">
                          {renderNestedList(definitionItem.sublist, `${itemKey}-sublist`)}
                        </dd>
                      </div>
                    );
                  }
                }
                
                // Case 3: Object with arbitrary properties (use first key-value pair)
                const entries = Object.entries(definitionItem);
                if (entries.length > 0) {
                  const [term, definition] = entries[0];
                  return (
                    <div key={itemKey} className="mt-2">
                      <dt className="font-semibold text-gray-900 dark:text-gray-100">{renderMarkdown(term)}</dt>
                      <dd className="mt-1 pl-4 text-gray-700 dark:text-gray-300">
                        {typeof definition === 'string' 
                          ? renderMarkdown(definition)
                          : Array.isArray(definition)
                            ? renderNestedList(definition, `${itemKey}-list`)
                            : String(definition)
                        }
                      </dd>
                    </div>
                  );
                }
              }
              
              // Fallback
              return (
                <div key={itemKey} className="mt-2 text-red-600 dark:text-red-400">
                  <dt>Invalid definition item</dt>
                  <dd className="pl-4 text-sm">{JSON.stringify(item)}</dd>
                </div>
              );
            })}
          </dl>
        );
      }

      case 'table': {
        const hasHeaders = block.headers && Array.isArray(block.headers) && block.headers.length > 0;
        const hasRows = block.rows && Array.isArray(block.rows) && block.rows.length > 0;
        
        if (!hasRows) {
          return (
            <div key={getKey(block, index)} className="text-red-500 my-4">
              Invalid table: missing rows
            </div>
          );
        }
        
        return (
          <div key={getKey(block, index)} className="my-6 w-full overflow-auto rounded-md border border-gray-200 dark:border-gray-700">
            <Table>
              {hasHeaders && (
                <TableHeader>
                  <TableRow>
                    {block.headers!.map((header, i) => (
                      <TableHead key={`${getKey(block, index)}-header-${i}`}>
                        {renderMarkdown(header)}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
              )}
              <TableBody>
                {block.rows!.map((row, rowIndex) => (
                  <TableRow key={`${getKey(block, index)}-row-${rowIndex}`}>
                    {row.map((cell, cellIndex) => (
                      <TableCell key={`${getKey(block, index)}-cell-${rowIndex}-${cellIndex}`}>
                        {typeof cell === 'string' 
                          ? renderMarkdown(cell) 
                          : String(cell)
                        }
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        );
      }

      case 'code':
        return (
          <div key={getKey(block, index)} className="my-4">
            <CodeBlock 
              language={block.language} 
              value={content || ''} 
              showLineNumbers={true}
            />
          </div>
        );

      case 'note':
        return (
          <div
            key={getKey(block, index)}
            className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 my-4"
          >
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-500 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-blue-800 dark:text-blue-200">
                {renderMarkdown(content)}
              </div>
            </div>
          </div>
        );

      case 'warning':
        return (
          <div
            key={getKey(block, index)}
            className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 my-4"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-500 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
              <div className="text-yellow-800 dark:text-yellow-200">
                {renderMarkdown(content)}
              </div>
            </div>
          </div>
        );

      case 'clinical_pearl':
        return (
          <motion.div
            key={getKey(block, index)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-l-4 border-primary rounded-lg p-4 my-4 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <Book className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="text-gray-800 dark:text-gray-200">
                {renderMarkdown(content)}
              </div>
            </div>
          </motion.div>
        );

      case 'markdown':
        return (
          <div key={getKey(block, index)} className="my-4 prose dark:prose-invert prose-headings:scroll-mt-8 max-w-none">
            {renderMarkdown(content)}
          </div>
        );

      case 'document':
        return (
          <div
            key={getKey(block, index)}
            className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4 my-4"
          >
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="text-gray-800 dark:text-gray-200">
                {renderMarkdown(content)}
              </div>
            </div>
          </div>
        );

      default:
        console.warn(`Unknown block type: ${block.type || 'undefined'}`, block);
        
        // Try to render content if available
        if (content) {
          return (
            <div key={getKey(block, index)} className="p-4 border border-amber-200 dark:border-amber-800 rounded-lg bg-amber-50 dark:bg-amber-900/20 my-4">
              <div className="flex items-start gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <p className="text-amber-700 dark:text-amber-300 text-sm font-medium">
                  Unknown content type: {block.type || 'undefined'}
                </p>
              </div>
              <div className="text-gray-800 dark:text-gray-200 mt-2">
                {renderMarkdown(content)}
              </div>
            </div>
          );
        }
        
        // Show object as JSON if no renderable content
        return (
          <div key={getKey(block, index)} className="p-4 border border-amber-200 dark:border-amber-800 rounded-lg bg-amber-50 dark:bg-amber-900/20 my-4">
            <div className="flex items-start gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
              <p className="text-amber-700 dark:text-amber-300 text-sm font-medium">
                Unknown content block structure
              </p>
            </div>
            <pre className="mt-2 text-xs overflow-auto bg-amber-100 dark:bg-amber-900/40 p-2 rounded text-amber-800 dark:text-amber-200">
              {JSON.stringify(block, null, 2)}
            </pre>
          </div>
        );
    }
  }
}