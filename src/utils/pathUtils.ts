// src/utils/pathUtils.ts

/**
 * Utility functions for handling handbook file paths and content locations.
 */

/**
 * Base handbook directory within the public folder.
 */
export const HANDBOOK_BASE_DIR = '/public';

/**
 * Maps section IDs to their corresponding handbook types
 */
export const HANDBOOK_TYPES = {
  'medical-oncology': 'medical_oncology_handbook',
  'radiation-oncology': 'radiation_handbook',
  'palliative-care': 'palliative_handbook'
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
 * @returns Full path to the TOC file (e.g., "/public/medical_oncology_handbook/toc.json")
 */
export function getTocPath(section: HandbookSection): string {
  const folderName = sectionToFolderName(section);
  return `${HANDBOOK_BASE_DIR}/${folderName}/toc.json`;
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
  const basePath = `${HANDBOOK_BASE_DIR}/${folderName}`;

  if (!topic) {
    return `${basePath}/overview.json`;
  }

  // Clean up the topic path and ensure it has .json extension
  const cleanTopic = topic
    .replace(/^\/+|\/+$/g, '') // Remove leading/trailing slashes
    .replace(/\.json$|\.md$/, ''); // Remove any existing extensions
  
  // Log the path being generated
  const path = `${basePath}/${cleanTopic}.json`;
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
