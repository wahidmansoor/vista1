export function parseMarkdownTOC(content: string) {
  const lines = content.split('\n');
  const result: Record<string, Record<string, string[]>> = {};
  
  let currentChapter = '';
  let currentSection = '';
  
  for (const line of lines) {
    // Skip empty lines and horizontal rules
    if (!line.trim() || line.trim().startsWith('---')) continue;
    
    // Chapter headings (##)
    if (line.startsWith('## ')) {
      // Handle format "## Chapter XX. Chapter Name"
      const chapterText = line.replace('## ', '');
      const periodIndex = chapterText.indexOf('.');
      currentChapter = periodIndex !== -1 
        ? chapterText.substring(periodIndex + 1).trim()
        : chapterText.replace(/^Chapter \d+\s*/, '').trim();
      result[currentChapter] = {};
      currentSection = '';
      continue;
    }
    
    // Section headings (###)
    if (line.startsWith('### ')) {
      currentSection = line.replace('### ', '').trim();
      if (currentChapter && !result[currentChapter][currentSection]) {
        result[currentChapter][currentSection] = [];
      }
      continue;
    }
    
    // List items (topics)
    if (line.trim().startsWith('- ') && currentChapter && currentSection) {
      // Convert the topic to a URL-friendly lowercase slug
      const topic = line.trim()
        .replace('- ', '')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-');
      result[currentChapter][currentSection].push(topic);
    }
  }
  
  return result;
}
