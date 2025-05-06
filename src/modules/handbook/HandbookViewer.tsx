import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, Atom, Heart } from "lucide-react";
import { RawMarkdownViewer } from "@/components/MarkdownViewer/RawMarkdownViewer";
import ErrorBoundary from "@/components/ErrorBoundary";
import ErrorWrapper from "@/components/ErrorWrapper";
import { UniversalHandbookViewer } from './UniversalHandbookViewer';

interface TOCEntry {
  title: string;
  path?: string;
  items?: TOCEntry[];
}

const sections = [
  {
    id: "medical-oncology",
    title: "Medical Oncology",
    description: "Comprehensive guide covering systemic treatments, chemotherapy protocols, targeted therapies, and immunotherapy approaches in cancer treatment.",
    icon: BookOpen
  },
  {
    id: "radiation-oncology", 
    title: "Radiation Oncology",
    description: "Detailed protocols for radiation therapy, treatment planning, dosimetry, and management of radiation-related effects.",
    icon: Atom
  },
  {
    id: "palliative-care",
    title: "Palliative Care", 
    description: "Guidelines for symptom management, pain control, and improving quality of life for patients with advanced cancer.",
    icon: Heart
  }
];

export default function HandbookViewer() {
  const { section, topic } = useParams();
  const navigate = useNavigate();
  const [contentPath, setContentPath] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loadingState, setLoadingState] = useState<{
    pageViewId?: string;
    content?: string;
    error?: string;
  }>({});

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoadingState({}); // Reset state
        if (!section) {
          // Load TOC by default
          setContentPath('/public/medical_oncology_handbook/toc.json');
          return;
        }

        // Construct content path with .json extension
        let path: string;
        if (topic) {
          path = `/public/medical_oncology_handbook/${section}/${topic}.json`;
        } else {
          path = `/public/medical_oncology_handbook/${section}/index.json`;
        }

        console.log('Loading content from:', path);
        setContentPath(path);
        setError(null);
      } catch (err) {
        console.error('Caught error:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load content';
        setLoadingState(prev => ({
          ...prev,
          error: errorMessage
        }));
        setError(errorMessage);
      }
    };

    loadContent();
  }, [section, topic]);

  const handleTopicSelect = (path: string) => {
    if (!path) {
      console.warn('Attempted to navigate to undefined path');
      return;
    }

    try {
      // Remove leading slash if present
      const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
      
      // Split path into section and topic
      const [newSection, ...topicParts] = normalizedPath.split('/');
      const newTopic = topicParts.join('/');

      console.log('Navigating to:', { section: newSection, topic: newTopic });
      
      // Navigate to new route
      if (newTopic) {
        navigate(`/handbook/${newSection}/${newTopic}`);
      } else {
        navigate(`/handbook/${newSection}`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Navigation failed';
      console.error('Navigation error:', errorMessage);
      setError('Failed to navigate to selected topic');
    }
  };

  // Safe destructuring of loading state with fallback values
  const pageViewId = loadingState?.pageViewId ?? 'unknown';
  const content = loadingState?.content ?? '';
  const loadError = loadingState?.error;

  if (error || loadError) {
    return <div className="text-red-500 p-4">{error || loadError}</div>;
  }

  return (
    <ErrorBoundary moduleName="Handbook Viewer">
      <UniversalHandbookViewer
        filePath={contentPath}
        onTopicSelect={handleTopicSelect}
        activePath={topic ? `${section}/${topic}` : section}
      />
    </ErrorBoundary>
  );
}
