import React from 'react';
import { RawMarkdownViewer } from './MarkdownViewer/RawMarkdownViewer';
import ErrorBoundary from './ErrorBoundary';

export default function TestMarkdownViewer() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Markdown Viewer Test</h1>
        <button 
          onClick={() => window.print()}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition-colors print:hidden"
        >
          Print
        </button>
      </div>
      <ErrorBoundary>
        <RawMarkdownViewer filePath="/test.md" />
      </ErrorBoundary>
    </div>
  );
}