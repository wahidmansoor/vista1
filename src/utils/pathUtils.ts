// src/utils/pathUtils.ts

/**
 * Utility functions for handling handbook file paths and content locations.
 */

/**
 * Base handbook directory within the public folder.
 * Uses /assets/ prefix to avoid conflicting with React Router handbook routes
 */
export const HANDBOOK_BASE_DIR = '/assets/handbook';

/**
 * Maps section IDs to their corresponding handbook folder names in /public/assets/handbook
 */
export const HANDBOOK_TYPES = {
  'medical-oncology': 'medical',
  'radiation-oncology': 'radiation',
  'palliative-care': 'palliative'
} as const;

export type HandbookSection = keyof typeof HANDBOOK_TYPES;

/**
 * Converts a section ID to its corresponding folder name.
 * E.g., "medical-oncology" -> "medical_oncology_handbook"
 */
export function sectionToFolderName(section: HandbookSection): string {
  const handlerFolder = HANDBOOK_TYPES[section];
  if (!handlerFolder) {
    throw new Error(`Invalid handbook section: ${section}`);
  }
  return handlerFolder;
}

/**
 * Gets the full path to the Table of Contents (TOC) JSON file for a given section.
 * 
 * @param section - The handbook section ID (e.g., "medical-oncology")
 * @returns Full path to the TOC file (e.g., "/assets/handbook/medical/toc.json")
 */
export function getTocPath(section: HandbookSection): string {
  const folderName = sectionToFolderName(section);
  // Use /assets/ prefix to avoid conflicting with React Router /handbook routes
  return `/assets/handbook/${folderName}/toc.json`;
}

/**
 * Gets the full path to a handbook content file.
 * 
 * @param section - The handbook section ID
 * @param topic - Optional topic path. If not provided, returns path to section overview
 * @returns Full path to the content file
 */
export function getContentPath(section: HandbookSection, topic?: string | null): string {
  const folderName = sectionToFolderName(section);
  const basePath = `/assets/handbook/${folderName}`;

  if (!topic) {
    // Default to overview
    return `${basePath}/overview.md`;
  }

  // Clean up the topic path and ensure it has the correct extension
  const cleanTopic = topic
    .replace(/^\/+|\/+$/g, '') // Remove leading/trailing slashes
    .replace(/\.md$|\.json$/, ''); // Remove any existing extensions

  // Return clean path without extension - loader will try both .md and .json
  const path = `${basePath}/${cleanTopic}`;
  console.log(`📄 getContentPath generated: ${path} from topic: ${topic}`);
  
  return path;
}

/**
 * Validates if a given string is a valid handbook section
 */
export function isValidSection(section: string): section is HandbookSection {
  return section in HANDBOOK_TYPES;
}

export function parseHandbookPath(pathname: string): { 
  section?: HandbookSection; 
  topic?: string;
} {
  // Add debug logging
  console.log('🔍 parseHandbookPath input:', pathname);

  // Early return if not a handbook path
  if (!pathname.startsWith('/handbook')) {
    console.log('❌ Not a handbook path');
    return {};
  }

  // Split path and remove empty segments
  const parts = pathname.split('/').filter(Boolean);
  
  // Remove 'handbook' from parts
  parts.shift();

  if (parts.length === 0) {
    console.log('ℹ️ No section found');
    return {};
  }

  const section = parts[0] as HandbookSection;
  
  // Join remaining parts to form topic path
  const topic = parts.slice(1).join('/');

  console.log('✅ Parsed path:', { section, topic });
  
  return {
    section: section || undefined,
    topic: topic || undefined
  };
}
