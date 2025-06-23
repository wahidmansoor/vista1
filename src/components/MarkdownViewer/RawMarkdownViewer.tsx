import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import type { SyntaxHighlighterProps } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Loader2, AlertTriangle } from 'lucide-react';
import type { Components } from 'react-markdown';

interface RawMarkdownViewerProps {
  filePath?: string | null;
  content?: string;
}

export function RawMarkdownViewer({ filePath, content }: RawMarkdownViewerProps) {
  const [loadedContent, setLoadedContent] = useState<string | null>(content || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If content is provided directly, use it and don't fetch
    if (content) {
      setLoadedContent(content);
      setError(null);
      setIsLoading(false);
      return;
    }

    // If filePath is provided, fetch the content
    if (filePath) {
      console.log(`[RawMarkdownViewer] Attempting to fetch: ${filePath}`); // <-- Added Log
      setIsLoading(true);
      setError(null); // Reset error state before fetching

      // Use the filePath directly for fetch, assuming it's correctly formed (absolute from public root)
      fetch(filePath)
        .then(async (res) => {
          console.log(`[RawMarkdownViewer] Fetch response status for ${filePath}: ${res.status}`); // <-- Added Log
          if (!res.ok) {
            throw new Error(`Failed to load content from ${filePath}: ${res.status} ${res.statusText}`);
          }
          const text = await res.text();
          if (!text) {
            // Handle empty file case - maybe show a message instead of error?
             console.warn(`[RawMarkdownViewer] Fetched content is empty for ${filePath}`); // <-- Added Log
             // throw new Error('Loaded content is empty'); 
             return ""; // Treat empty file as valid but empty content
          }
          return text;
        })
        .then((text) => {
          console.log(`[RawMarkdownViewer] Successfully fetched content for ${filePath}. Length: ${text.length}`); // <-- Added Log
          setLoadedContent(text);
          setError(null);
        })
        .catch((err) => {
          console.error(`[RawMarkdownViewer] Error loading markdown for ${filePath}:`, err); // <-- Added Log
          setError(err.message || 'Failed to load markdown content.');
          setLoadedContent(null); // Clear content on error
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      // Handle case where neither filePath nor content is provided
      setLoadedContent(null);
      setError(null);
      setIsLoading(false);
       console.log("[RawMarkdownViewer] No filePath or content provided."); // <-- Added Log
    }
  }, [filePath, content]); // Rerun effect if filePath or content changes

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  const components: Components = {
    p: ({ node, children, ...props }) => (
      <p className="text-base leading-relaxed text-muted-foreground mb-4 print:text-black" {...props}>
        {children}
      </p>
    ),
    h1: ({ node, children, ...props }) => (
      <h1 className="text-3xl font-bold mt-6 mb-4 text-gray-900 dark:text-gray-100 print:text-black print:break-before-page" {...props}>
        {children}
      </h1>
    ),
    h2: ({ node, children, ...props }) => (
      <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-800 dark:text-gray-200 print:text-black print:break-before-page" {...props}>
        {children}
      </h2>
    ),
    h3: ({ node, children, ...props }) => (
      <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-800 dark:text-gray-200 print:text-black print:break-after-avoid" {...props}>
        {children}
      </h3>
    ),
    ul: ({ node, children, ...props }) => (
      <ul className="ml-6 list-disc space-y-2 text-muted-foreground print:text-black print:break-inside-avoid" {...props}>
        {children}
      </ul>
    ),
    ol: ({ node, children, ...props }) => (
      <ol className="ml-6 list-decimal space-y-2 text-muted-foreground print:text-black print:break-inside-avoid" {...props}>
        {children}
      </ol>
    ),
    li: ({ node, children, ...props }) => (
      <li className="leading-relaxed" {...props}>
        {children}
      </li>
    ),
    a: ({ node, children, href, ...props }) => (
      <a 
        href={href}
        className="text-primary underline hover:text-primary/80 transition-colors print:text-blue-800"
        {...props}
      >
        {children}
      </a>
    ),
    pre: ({ node, children, ...props }) => (
      <pre className="bg-muted p-4 rounded-md overflow-x-auto print:bg-gray-100 print:break-inside-avoid" {...props}>
        {children}
      </pre>
    ),
    code: ({ node, className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || '');
      const inline = !match;
      
      if (inline) {
        return (
          <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono print:bg-gray-100" {...props}>
            {children}
          </code>
        );
      }
      
      return (
        <div className="text-sm font-mono">
          <SyntaxHighlighter
            style={oneDark as any}
            language={match?.[1] || 'text'}
            PreTag="div"
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        </div>
      );
    },
    table: ({ node, children, ...props }) => (
      <div className="overflow-x-auto print:break-inside-avoid">
        <table className="min-w-full border-collapse border rounded-md text-sm print:border-gray-300" {...props}>
          {children}
        </table>
      </div>
    ),
    thead: ({ node, children, ...props }) => (
      <thead className="bg-muted/50 print:bg-gray-100" {...props}>
        {children}
      </thead>
    ),
    tbody: ({ node, children, ...props }) => (
      <tbody className="divide-y divide-muted print:divide-gray-200" {...props}>
        {children}
      </tbody>
    ),
    tr: ({ node, children, ...props }) => (
      <tr className="even:bg-muted/20 print:even:bg-gray-50" {...props}>
        {children}
      </tr>
    ),
    th: ({ node, children, ...props }) => (
      <th className="px-4 py-2 text-left font-medium print:text-black" {...props}>
        {children}
      </th>
    ),
    td: ({ node, children, ...props }) => (
      <td className="px-4 py-2 print:text-black" {...props}>
        {children}
      </td>
    ),
    blockquote: ({ node, children, ...props }) => (
      <blockquote className="pl-4 italic border-l-4 border-primary bg-muted/20 rounded-md my-4 print:bg-transparent print:border-gray-400 print:text-black print:break-inside-avoid" {...props}>
        {children}
      </blockquote>
    ),
    hr: ({ node, ...props }) => (
      <hr className="border-t-2 border-muted my-6 print:border-gray-300" {...props} />
    ),
  };

  return (
    <article className="prose prose-slate dark:prose-invert max-w-none print:prose-sm md:print:prose-base">
      {isLoading ? (
        <Loader2 className="animate-spin" />
      ) : (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeSanitize]}
          components={components}
        >
          {loadedContent}
        </ReactMarkdown>
      )}
    </article>
  );
}
