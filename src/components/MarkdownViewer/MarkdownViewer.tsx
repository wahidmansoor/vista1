import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { Paper, Box } from '@mui/material';

interface MarkdownViewerProps {
  content?: string;
  filePath?: string;
}

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content, filePath }) => {
  const [markdownContent, setMarkdownContent] = useState<string | null>(null);

  useEffect(() => {
  const loadMarkdown = async () => {
      if (filePath) {
        try {
          const response = await fetch(filePath);
          if (!response.ok) {
            throw new Error('Failed to fetch markdown file');
          }
          const fileContent = await response.text();
          setMarkdownContent(fileContent);
        } catch (error) {
          console.error('Error reading markdown file:', error);
          setMarkdownContent('Error loading markdown file.');
        }
      } else if (content) {
        setMarkdownContent(content);
      }
    };
    loadMarkdown();
  }, [filePath, content]);

  if (markdownContent === null) return <div>Loading...</div>;

  return (
    <Paper elevation={2}>
      <Box sx={{ p: 3 }}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeSanitize]}
          components={{
            img: ({ src, alt }) => (
              <img src={src} alt={alt} style={{ maxWidth: '100%', height: 'auto' }} />
            ),
          }}
        >
          {markdownContent}
        </ReactMarkdown>
      </Box>
    </Paper>
  );
};

export default MarkdownViewer;
