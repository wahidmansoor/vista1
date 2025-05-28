
export interface SearchableItem {
  title: string;
  path?: string;
  tags?: string[];
  category?: string;
  items?: SearchableItem[];
}

export interface SearchResult {
  item: SearchableItem;
  score: number;
  matchType: 'title' | 'tag' | 'category';
  matchedText: string;
}

/**
 * Simple fuzzy search implementation
 */
export function fuzzyMatch(query: string, text: string): number {
  const queryLower = query.toLowerCase();
  const textLower = text.toLowerCase();
  
  // Exact match gets highest score
  if (textLower === queryLower) return 1.0;
  
  // Starts with query gets high score
  if (textLower.startsWith(queryLower)) return 0.9;
  
  // Contains query gets medium score
  if (textLower.includes(queryLower)) return 0.7;
  
  // Fuzzy matching - check if characters appear in order
  let queryIndex = 0;
  let matchCount = 0;
  
  for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
    if (textLower[i] === queryLower[queryIndex]) {
      queryIndex++;
      matchCount++;
    }
  }
  
  // If all query characters found in order, return score based on match density
  if (queryIndex === queryLower.length) {
    return 0.3 + (matchCount / text.length) * 0.4;
  }
  
  return 0;
}

/**
 * Search through TOC items with fuzzy matching
 */
export function searchTocItems(
  items: SearchableItem[], 
  query: string, 
  minScore: number = 0.3
): SearchResult[] {
  if (!query.trim()) return [];
  
  const results: SearchResult[] = [];
  
  function searchRecursive(items: SearchableItem[], depth: number = 0) {
    for (const item of items) {
      // Search in title
      const titleScore = fuzzyMatch(query, item.title);
      if (titleScore >= minScore) {
        results.push({
          item,
          score: titleScore + (depth === 0 ? 0.1 : 0), // Bonus for top-level items
          matchType: 'title',
          matchedText: item.title
        });
      }
      
      // Search in category
      if (item.category) {
        const categoryScore = fuzzyMatch(query, item.category);
        if (categoryScore >= minScore) {
          results.push({
            item,
            score: categoryScore * 0.8, // Category matches get slightly lower score
            matchType: 'category',
            matchedText: item.category
          });
        }
      }
      
      // Search in tags
      if (item.tags) {
        for (const tag of item.tags) {
          const tagScore = fuzzyMatch(query, tag);
          if (tagScore >= minScore) {
            results.push({
              item,
              score: tagScore * 0.9,
              matchType: 'tag',
              matchedText: tag
            });
          }
        }
      }
      
      // Search in child items
      if (item.items) {
        searchRecursive(item.items, depth + 1);
      }
    }
  }
  
  searchRecursive(items);
  
  // Sort by score descending, then by title
  return results
    .sort((a, b) => {
      if (Math.abs(a.score - b.score) < 0.01) {
        return a.item.title.localeCompare(b.item.title);
      }
      return b.score - a.score;
    })
    .slice(0, 20); // Limit to top 20 results
}

/**
 * Highlight matching text in search results
 */
export function highlightMatch(text: string, query: string): string {
  if (!query.trim()) return text;
  
  const queryLower = query.toLowerCase();
  const textLower = text.toLowerCase();
  const index = textLower.indexOf(queryLower);
  
  if (index === -1) return text;
  
  return (
    text.substring(0, index) +
    '<mark class="bg-yellow-200 dark:bg-yellow-800">' +
    text.substring(index, index + query.length) +
    '</mark>' +
    text.substring(index + query.length)
  );
}

/**
 * Filter TOC items by tags
 */
export function filterByTags(items: SearchableItem[], selectedTags: string[]): SearchableItem[] {
  if (selectedTags.length === 0) return items;
  
  function filterRecursive(items: SearchableItem[]): SearchableItem[] {
    return items.reduce((filtered, item) => {
      const hasMatchingTag = item.tags?.some(tag => selectedTags.includes(tag));
      const filteredChildren = item.items ? filterRecursive(item.items) : [];
      
      if (hasMatchingTag || filteredChildren.length > 0) {
        filtered.push({
          ...item,
          items: filteredChildren.length > 0 ? filteredChildren : item.items
        });
      }
      
      return filtered;
    }, [] as SearchableItem[]);
  }
  
  return filterRecursive(items);
}

/**
 * Get all unique tags from TOC items
 */
export function extractAllTags(items: SearchableItem[]): string[] {
  const tags = new Set<string>();
  
  function extractRecursive(items: SearchableItem[]) {
    for (const item of items) {
      if (item.tags) {
        item.tags.forEach(tag => tags.add(tag));
      }
      if (item.items) {
        extractRecursive(item.items);
      }
    }
  }
  
  extractRecursive(items);
  return Array.from(tags).sort();
}
