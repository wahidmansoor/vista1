import { HandbookSection as PathUtilsHandbookSection } from '@/utils/pathUtils';

export interface HandbookContentBlock {
  id?: string;
  type: string;
  
  // Content properties - block can have either content or text
  content?: string;
  text?: string;
  
  // Used for lists, numbering, and definitions
  items?: any[]; // Array of strings or objects with term/definition

  // Used for headings
  level?: number;
  
  // Used for tables
  headers?: string[];
  rows?: any[][];
  
  // Used for code blocks
  language?: string;
  
  // Optional additional properties that might be present
  ordered?: boolean;
  url?: string;
  alt?: string;
  title?: string;
}

export interface TopicContent {
  title: string;
  category: string;
  section: string;
  summary?: string;
  content: HandbookContentBlock[];
  metadata?: {
    version?: string;
    lastUpdated?: string;
    author?: string;
    license?: string;
    tags?: string[];
  };
}

export interface TocEntry {
  title: string;
  path: string;
  items?: TocEntry[];
}

// Re-export the consistent type from pathUtils
export type HandbookSection = PathUtilsHandbookSection;

export interface HandbookTOCItem {
  id: string;
  title: string;
  path?: string;
  children?: HandbookTOCItem[];
}

export interface HandbookFullTOC {
  sections: HandbookSection[];
  structure: Record<string, HandbookTOCItem[]>;
}