import Fuse, { IFuseOptions } from 'fuse.js';
import { HandbookContentBlock, TopicContent } from '@/modules/handbook/types/handbook';
import { HANDBOOK_TYPES, HandbookSection } from '@/utils/pathUtils';

/**
 * Enhanced search result containing detailed information about matches
 */
export interface EnhancedSearchResult {
  id: string;
  title: string;
  section: HandbookSection;
  path: string;
  matches: {
    field: string;
    value: string;
    indices: [number, number][];
  }[];
  score: number;
  metadata?: {
    category?: string;
    version?: string;
    lastUpdated?: string;
    author?: string;
    tags?: string[];
    clinicalLevel?: 'basic' | 'intermediate' | 'advanced';
  };
  summary?: string;
  excerpt?: string; // Content excerpt with matched text
  contentBlocks?: HandbookContentBlock[]; // Matching content blocks
}

/**
 * Options for enhanced handbook search
 */
export interface EnhancedSearchOptions {
  sections?: HandbookSection[];
  limit?: number;
  threshold?: number;
  tags?: string[];
  clinicalLevel?: ('basic' | 'intermediate' | 'advanced')[];
  author?: string;
  beforeDate?: Date;
  afterDate?: Date;
}

/**
 * Content index interface for search optimization
 */
interface ContentIndex {
  id: string;
  title: string;
  path: string;
  section: HandbookSection;
  content: string; // Combined content text for full-text search
  metadata: {
    category?: string;
    version?: string;
    lastUpdated?: string;
    author?: string;
    tags?: string[];
    clinicalLevel?: 'basic' | 'intermediate' | 'advanced';
  };
  headings: string[]; // All headings for better context
  contentBlocks: HandbookContentBlock[];
}

// In-memory cache for content indices
let contentIndices: Record<HandbookSection, ContentIndex[]> = {
  'medical-oncology': [],
  'radiation-oncology': [],
  'palliative-care': []
};

// Fuse instances for each section (created on-demand)
const fuseInstances: Partial<Record<HandbookSection, Fuse<ContentIndex>>> = {};

/**
 * Default search options with optimized configuration
 */
const defaultSearchOptions: IFuseOptions<ContentIndex> = {
  keys: [
    { name: 'title', weight: 2 },
    { name: 'headings', weight: 1.5 },
    { name: 'content', weight: 1 },
    { name: 'metadata.tags', weight: 1.2 }
  ],
  includeMatches: true,
  includeScore: true,
  threshold: 0.4,
  minMatchCharLength: 3,
  shouldSort: true,
  ignoreLocation: true,
  useExtendedSearch: true
};

/**
 * Initialize content indices for a specific handbook section
 * @param section Handbook section to index
 */
export async function initializeContentIndex(section: HandbookSection): Promise<void> {
  console.log(`📚 Initializing content index for ${section}...`);
  try {
    // Get TOC to find all available content
    const tocPath = `/${HANDBOOK_TYPES[section]}/toc.json`;
    const tocResponse = await fetch(tocPath);
    if (!tocResponse.ok) {
      throw new Error(`Failed to load TOC: ${tocResponse.statusText}`);
    }
    
    const tocData = await tocResponse.json();
    
    // Extract all content paths from TOC
    const contentPaths: string[] = [];
    const extractPaths = (items: any[]) => {
      for (const item of items) {
        if (item.path) {
          contentPaths.push(item.path);
        }
        if (item.items && Array.isArray(item.items)) {
          extractPaths(item.items);
        }
      }
    };
    
    if (Array.isArray(tocData)) {
      extractPaths(tocData);
    }
    
    // Process each content file to build the index
    const indices: ContentIndex[] = [];
    
    for (const path of contentPaths) {
      try {
        // Generate full content path
        const contentPath = `/${HANDBOOK_TYPES[section]}/${path}.json`;
        const response = await fetch(contentPath);
        
        if (!response.ok) continue;
        
        const contentData = await response.json() as TopicContent;
        
        // Extract relevant text from content blocks for search
        let fullText = '';
        const headings: string[] = [];
        
        if (Array.isArray(contentData.content)) {
          contentData.content.forEach(block => {
            // Collect text from various block types
            if (block.type === 'heading') {
              const headingText = block.text || block.content || '';
              headings.push(headingText);
              fullText += headingText + ' ';
            } else if (block.type === 'paragraph' || block.type === 'markdown') {
              fullText += (block.text || block.content || '') + ' ';
            } else if (block.type === 'list' || block.type === 'numbers' || block.type === 'definitions') {
              if (Array.isArray(block.items)) {
                block.items.forEach(item => {
                  if (typeof item === 'string') {
                    fullText += item + ' ';
                  } else if (item && typeof item === 'object') {
                    fullText += JSON.stringify(item) + ' ';
                  }
                });
              }
            } else if (block.type === 'table' && Array.isArray(block.rows)) {
              block.rows.forEach(row => {
                row.forEach(cell => {
                  fullText += (typeof cell === 'string' ? cell : JSON.stringify(cell)) + ' ';
                });
              });
            }
          });
        }
        
        // Create index entry
        const index: ContentIndex = {
          id: path,
          title: contentData.title,
          path,
          section,
          content: fullText,
          metadata: {
            category: contentData.category,
            author: contentData.metadata?.author,
            version: contentData.metadata?.version,
            lastUpdated: contentData.metadata?.lastUpdated,
            tags: contentData.metadata?.tags,
            clinicalLevel: contentData.metadata?.clinicalLevel as any
          },
          headings,
          contentBlocks: contentData.content
        };
        
        indices.push(index);
      } catch (error) {
        console.error(`Error indexing ${path}:`, error);
      }
    }
    
    // Update content indices
    contentIndices[section] = indices;
    
    // Create Fuse instance for this section
    fuseInstances[section] = new Fuse(indices, defaultSearchOptions);
    
    console.log(`📊 Indexed ${indices.length} content files for ${section}`);
  } catch (error) {
    console.error(`Failed to initialize content index for ${section}:`, error);
    throw error;
  }
}

/**
 * Extract excerpts with match highlights from content
 * @param content Full content text
 * @param matches Match indices from Fuse.js
 * @returns Excerpt with highlighted match
 */
function getExcerpt(content: string, matches: [number, number][]): string {
  if (!matches.length) return '';
  
  // Use the first match for excerpt
  const [start, end] = matches[0];
  
  // Get surrounding context (50 chars before and after)
  const excerptStart = Math.max(0, start - 50);
  const excerptEnd = Math.min(content.length, end + 50);
  
  let excerpt = '';
  
  // Add ellipsis if not starting from the beginning
  if (excerptStart > 0) {
    excerpt += '...';
  }
  
  // Add text before match
  excerpt += content.substring(excerptStart, start);
  
  // Add match with highlight markers
  excerpt += `<mark>${content.substring(start, end + 1)}</mark>`;
  
  // Add text after match
  excerpt += content.substring(end + 1, excerptEnd);
  
  // Add ellipsis if not ending at the content end
  if (excerptEnd < content.length) {
    excerpt += '...';
  }
  
  return excerpt;
}

/**
 * Find the relevant content blocks that contain the matched text
 * @param blocks All content blocks
 * @param matchText Text that was matched
 * @returns Array of relevant content blocks
 */
function findMatchingBlocks(blocks: HandbookContentBlock[], matchText: string): HandbookContentBlock[] {
  if (!matchText || !blocks.length) return [];
  
  // Normalize match text for comparison
  const normalizedMatch = matchText.toLowerCase().trim();
  
  return blocks.filter(block => {
    const blockContent = (block.text || block.content || '').toLowerCase();
    return blockContent.includes(normalizedMatch);
  });
}

/**
 * Perform enhanced search across handbook content
 * @param query Search query
 * @param options Search options
 * @returns Promise with search results
 */
export async function enhancedHandbookSearch(
  query: string,
  options: EnhancedSearchOptions = {}
): Promise<EnhancedSearchResult[]> {
  const {
    sections = ['medical-oncology', 'radiation-oncology', 'palliative-care'],
    limit = 20,
    threshold,
    tags,
    clinicalLevel,
    author,
    beforeDate,
    afterDate
  } = options;
  
  // Initialize indices if needed
  const initPromises = sections.map(async section => {
    if (!contentIndices[section].length) {
      await initializeContentIndex(section);
    }
  });
  
  await Promise.all(initPromises);
  
  // Collect results from all sections
  const allResults: EnhancedSearchResult[] = [];
  
  for (const section of sections) {
    let fuse = fuseInstances[section];
    if (!fuse) continue;
      // Apply custom threshold if provided
    if (threshold !== undefined) {
      const currentOptions = { ...defaultSearchOptions, threshold };
      fuse = new Fuse(contentIndices[section], currentOptions);
    }
    
    // Perform search
    const sectionResults = fuse.search(query);
    
    // Map to enhanced results
    const mappedResults = sectionResults.map(result => {
      const { item, matches = [], score = 1 } = result;
      
      // Extract matched content for excerpt generation
      let matchedText = '';
      let contentMatches: [number, number][] = [];
      
      matches.forEach(match => {
        if (match.key === 'content' && match.indices.length) {
          matchedText = match.value || '';
          contentMatches = match.indices;
        }
      });
      
      // Find matching content blocks
      const matchingBlocks = matchedText ? 
        findMatchingBlocks(item.contentBlocks, matchedText) :
        [];
      
      return {
        id: item.id,
        title: item.title,
        section: item.section,
        path: item.path,
        matches,
        score,
        metadata: item.metadata,
        summary: item.content.substring(0, 150) + (item.content.length > 150 ? '...' : ''),
        excerpt: getExcerpt(item.content, contentMatches),
        contentBlocks: matchingBlocks.slice(0, 3) // Limit to 3 blocks for performance
      };
    });
    
    allResults.push(...mappedResults);
  }
  
  // Apply additional filtering
  let filteredResults = allResults;
  
  // Filter by tags
  if (tags && tags.length > 0) {
    filteredResults = filteredResults.filter(result => 
      tags.some(tag => result.metadata?.tags?.includes(tag))
    );
  }
  
  // Filter by clinical level
  if (clinicalLevel && clinicalLevel.length > 0) {
    filteredResults = filteredResults.filter(result => 
      clinicalLevel.includes(result.metadata?.clinicalLevel as any)
    );
  }
  
  // Filter by author
  if (author) {
    filteredResults = filteredResults.filter(result => 
      result.metadata?.author?.toLowerCase().includes(author.toLowerCase())
    );
  }
  
  // Filter by date range
  if (beforeDate || afterDate) {
    filteredResults = filteredResults.filter(result => {
      if (!result.metadata?.lastUpdated) return true;
      
      const updateDate = new Date(result.metadata.lastUpdated);
      
      if (beforeDate && updateDate > beforeDate) return false;
      if (afterDate && updateDate < afterDate) return false;
      
      return true;
    });
  }
  
  // Sort by relevance (score) and limit results
  return filteredResults
    .sort((a, b) => a.score - b.score)
    .slice(0, limit);
}

/**
 * Clear search indices for specific sections or all sections
 * @param sections Sections to clear, or all if not specified
 */
export function clearSearchIndices(sections?: HandbookSection[]): void {
  const sectionsToReset = sections || Object.keys(contentIndices) as HandbookSection[];
  
  sectionsToReset.forEach(section => {
    contentIndices[section] = [];
    delete fuseInstances[section];
  });
}
