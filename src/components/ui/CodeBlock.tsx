import React from 'react';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  language?: string;
  value: string;
  className?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, value, className }) => {
  // Determine language display name
  const displayLanguage = language || 'text';
  const formattedLanguage = displayLanguage === 'js' ? 'javascript' : displayLanguage;
  
  return (
    <div className={cn("relative rounded-md overflow-hidden", className)}>
      {/* Language indicator */}
      <div className="absolute right-2 top-2 bg-gray-700/60 text-gray-200 text-xs px-2 py-0.5 rounded">
        {formattedLanguage}
      </div>
      
      {/* Code block with syntax highlighting */}
      <pre className="p-4 bg-gray-900 dark:bg-gray-950 text-gray-100 overflow-x-auto text-sm">
        <code className={`language-${displayLanguage}`}>
          {value}
        </code>
      </pre>
    </div>
  );
};

export default CodeBlock;
