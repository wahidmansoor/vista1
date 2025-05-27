/**
 * Handbook Search Service
 * Provides full-text search capabilities across all handbook content
 */

export interface SearchResult {
  id: string;
  title: string;
  section: string;
  category: string;
  path: string;
  content: string;
  snippet: string;
  score: number;
  matches: SearchMatch[];
}

export interface SearchMatch {
  text: string;
  start: number;
  end: number;
  context: string;
}

export interface SearchOptions {
  sections?: string[];
  maxResults?: number;
  minScore?: number;
  includeContent?: boolean;
}

export interface ContentIndex {
  id: string;
  title: string;
  section: string;
  category: string;
  path: string;
  content: string;
  searchableText: string;
}

class HandbookSearchService {
  private contentIndex: ContentIndex[] = [];
  private isIndexed = false;
  private indexingPromise: Promise<void> | null = null;

  /**
   * Initialize the search service and build content index
   */
  async initialize(): Promise<void> {
    if (this.isIndexed) return;
    if (this.indexingPromise) return this.indexingPromise;

    this.indexingPromise = this.buildIndex();
    await this.indexingPromise;
    this.isIndexed = true;
  }

  /**
   * Build searchable index from all handbook content
   */
  private async buildIndex(): Promise<void> {
    console.log('🔍 Building handbook search index...');
    
    const sections = ['medical-oncology', 'radiation-oncology', 'palliative-care'];
    const sectionFolders = {
      'medical-oncology': 'medical_oncology_handbook',
      'radiation-oncology': 'radiation_handbook',
      'palliative-care': 'palliative_handbook'
    };

    for (const section of sections) {
      const folder = sectionFolders[section as keyof typeof sectionFolders];
      await this.indexSection(section, folder);
    }

    console.log(`✅ Search index built with ${this.contentIndex.length} items`);
  }

  /**
   * Index content from a specific handbook section
   */
  private async indexSection(section: string, folder: string): Promise<void> {
    try {
      // Load TOC to get content structure
      const tocResponse = await fetch(`/public/${folder}/toc.json`);
      if (!tocResponse.ok) {
        console.warn(`⚠️ Could not load TOC for ${section}`);
        return;
      }

      const tocData = await tocResponse.json();
      await this.indexTocItems(tocData, section, folder, '');

      // Also index markdown files in sections folder
      await this.indexMarkdownFiles(section, folder);

    } catch (error) {
      console.error(`❌ Error indexing section ${section}:`, error);
    }
  }

  /**
   * Recursively index TOC items
   */
  private async indexTocItems(
    items: any[], 
    section: string, 
    folder: string, 
    basePath: string
  ): Promise<void> {
    for (const item of items) {
      if (item.path) {
        await this.indexContentFile(item, section, folder);
      }
      
      if (item.items && Array.isArray(item.items)) {
        await this.indexTocItems(item.items, section, folder, basePath);
      }
    }
  }

  /**
   * Index a specific content file (JSON)
   */
  private async indexContentFile(
    item: any, 
    section: string, 
    folder: string
  ): Promise<void> {
    try {
      const filePath = `/public/${folder}/${item.path}.json`;
      const response = await fetch(filePath);
      
      if (!response.ok) return;

      const content = await response.json();
      const searchableText = this.extractSearchableText(content);

      const indexItem: ContentIndex = {
        id: `${section}/${item.path}`,
        title: content.title || item.title,
        section,
        category: content.category || this.getSectionDisplayName(section),
        path: item.path,
        content: JSON.stringify(content),
        searchableText
      };

      this.contentIndex.push(indexItem);

    } catch (error) {
      console.warn(`⚠️ Could not index ${item.path}:`, error);
    }
  }

  /**
   * Index markdown files from sections folder
   */
  private async indexMarkdownFiles(section: string, folder: string): Promise<void> {
    if (section !== 'palliative-care') return; // Only palliative care has markdown sections

    const markdownFiles = [
      'introduction', 'symptom-management', 'pain-control', 'medication-guide',
      'assessment-tools', 'communication-skills', 'goals-of-care', 'psychosocial',
      'ethical-issues', 'case-studies', 'bereavement'
    ];

    for (const fileName of markdownFiles) {
      try {
        const filePath = `/public/${folder}/sections/${fileName}.md`;
        const response = await fetch(filePath);
        
        if (!response.ok) continue;

        const content = await response.text();
        const title = this.extractMarkdownTitle(content) || fileName.replace(/-/g, ' ');

        const indexItem: ContentIndex = {
          id: `${section}/sections/${fileName}`,
          title,
          section,
          category: this.getSectionDisplayName(section),
          path: `sections/${fileName}`,
          content,
          searchableText: this.cleanMarkdownText(content)
        };

        this.contentIndex.push(indexItem);

      } catch (error) {
        console.warn(`⚠️ Could not index markdown ${fileName}:`, error);
      }
    }
  }

  /**
   * Extract searchable text from JSON content
   */
  private extractSearchableText(content: any): string {
    const textParts: string[] = [];

    if (content.title) textParts.push(content.title);
    if (content.summary) textParts.push(content.summary);

    if (content.content && Array.isArray(content.content)) {
      content.content.forEach((block: any) => {
        switch (block.type) {
          case 'paragraph':
          case 'clinical_pearl':
            textParts.push(block.text || '');
            break;
          case 'heading':
            textParts.push(block.text || '');
            break;
          case 'list':
            if (block.items) {
              textParts.push(...block.items);
            }
            break;
          case 'table':
            if (block.headers) textParts.push(...block.headers);
            if (block.rows) {
              block.rows.forEach((row: string[]) => {
                textParts.push(...row);
              });
            }
            break;
        }
      });
    }

    return textParts.join(' ').toLowerCase();
  }

  /**
   * Extract title from markdown content
   */
  private extractMarkdownTitle(content: string): string | null {
    const titleMatch = content.match(/^#\s+(.+)$/m);
    return titleMatch ? titleMatch[1] : null;
  }

  /**
   * Clean markdown text for searching
   */
  private cleanMarkdownText(content: string): string {
    return content
      .replace(/#{1,6}\s+/g, '') // Remove markdown headers
      .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.+?)\*/g, '$1') // Remove italic
      .replace(/`(.+?)`/g, '$1') // Remove code
      .replace(/\[(.+?)\]\(.+?\)/g, '$1') // Remove links, keep text
      .replace(/<!--.*?-->/gs, '') // Remove comments
      .toLowerCase();
  }

  /**
   * Get display name for section
   */
  private getSectionDisplayName(section: string): string {
    const displayNames = {
      'medical-oncology': 'Medical Oncology',
      'radiation-oncology': 'Radiation Oncology',
      'palliative-care': 'Palliative Care'
    };
    return displayNames[section as keyof typeof displayNames] || section;
  }

  /**
   * Search handbook content
   */
  async search(query: string, options: SearchOptions = {}): Promise<SearchResult[]> {
    await this.initialize();

    if (!query.trim()) return [];

    const searchTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 1);
    const results: SearchResult[] = [];

    for (const item of this.contentIndex) {
      // Filter by sections if specified
      if (options.sections && !options.sections.includes(item.section)) {
        continue;
      }

      const score = this.calculateScore(item, searchTerms);
      if (score < (options.minScore || 0.1)) continue;

      const matches = this.findMatches(item, searchTerms);
      const snippet = this.generateSnippet(item, searchTerms);

      results.push({
        id: item.id,
        title: item.title,
        section: item.section,
        category: item.category,
        path: item.path,
        content: options.includeContent ? item.content : '',
        snippet,
        score,
        matches
      });
    }

    // Sort by relevance score
    results.sort((a, b) => b.score - a.score);

    return results.slice(0, options.maxResults || 50);
  }

  /**
   * Calculate relevance score for search result
   */
  private calculateScore(item: ContentIndex, searchTerms: string[]): number {
    let score = 0;

    for (const term of searchTerms) {
      // Title matches get highest weight
      if (item.title.toLowerCase().includes(term)) {
        score += 3;
      }

      // Content matches get base weight
      const contentMatches = (item.searchableText.match(new RegExp(term, 'g')) || []).length;
      score += contentMatches * 1;

      // Boost for exact phrase matches
      if (searchTerms.length > 1) {
        const phrase = searchTerms.join(' ');
        if (item.searchableText.includes(phrase)) {
          score += 5;
        }
      }
    }

    // Normalize score by content length
    return score / Math.sqrt(item.searchableText.length / 1000);
  }

  /**
   * Find specific matches within content
   */
  private findMatches(item: ContentIndex, searchTerms: string[]): SearchMatch[] {
    const matches: SearchMatch[] = [];

    for (const term of searchTerms) {
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      let match;

      while ((match = regex.exec(item.searchableText)) !== null) {
        const start = Math.max(0, match.index - 50);
        const end = Math.min(item.searchableText.length, match.index + term.length + 50);
        const context = item.searchableText.slice(start, end);

        matches.push({
          text: term,
          start: match.index,
          end: match.index + term.length,
          context: `...${context}...`
        });

        if (matches.length >= 3) break;
      }
    }

    return matches;
  }

  /**
   * Generate snippet for search result
   */
  private generateSnippet(item: ContentIndex, searchTerms: string[]): string {
    const maxSnippetLength = 200;
    
    // Try to find a snippet that contains search terms
    for (const term of searchTerms) {
      const index = item.searchableText.indexOf(term);
      if (index !== -1) {
        const start = Math.max(0, index - 100);
        const end = Math.min(item.searchableText.length, index + 100);
        let snippet = item.searchableText.slice(start, end);
        
        if (start > 0) snippet = '...' + snippet;
        if (end < item.searchableText.length) snippet = snippet + '...';
        
        return snippet.slice(0, maxSnippetLength);
      }
    }

    // Fallback to beginning of content
    return item.searchableText.slice(0, maxSnippetLength) + '...';
  }

  /**
   * Get suggestions for autocomplete
   */
  async getSuggestions(query: string, limit = 10): Promise<string[]> {
    await this.initialize();

    const suggestions = new Set<string>();
    const queryLower = query.toLowerCase();

    for (const item of this.contentIndex) {
      // Add title if it matches
      if (item.title.toLowerCase().includes(queryLower)) {
        suggestions.add(item.title);
      }

      // Add common medical terms from content
      const words = item.searchableText.split(/\s+/);
      for (const word of words) {
        if (word.length > 3 && word.includes(queryLower)) {
          suggestions.add(word);
        }
      }

      if (suggestions.size >= limit) break;
    }

    return Array.from(suggestions).slice(0, limit);
  }

  /**
   * Clear the search index (for testing or manual refresh)
   */
  clearIndex(): void {
    this.contentIndex = [];
    this.isIndexed = false;
    this.indexingPromise = null;
  }
}

// Export singleton instance
export const handbookSearch = new HandbookSearchService();
