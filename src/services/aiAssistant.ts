interface AIRequest {
  prompt: string;
  context?: string;
}

interface AIResponse {
  summary: string;
}

interface AIError {
  error: string;
  details?: string;
}

const MAX_RETRIES = 1;
const RETRY_DELAY = 1000;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export class AIAssistantError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: string
  ) {
    super(message);
    this.name = 'AIAssistantError';
  }
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function generateSummary(request: AIRequest): Promise<string> {
  let lastError: Error | undefined;
  
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      if (attempt > 0) {
        await delay(RETRY_DELAY);
      }

      const response = await fetch('/api/ai/generate-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData: AIError = await response.json();
        if (response.status === 429) {
          throw new AIAssistantError(
            'Rate limit exceeded. Please try again later.',
            429
          );
        }
        throw new AIAssistantError(
          errorData.error || 'Failed to generate summary',
          response.status,
          errorData.details
        );
      }

      const data: AIResponse = await response.json();
      return data.summary;
    } catch (error: any) {
      console.error(`AI Summary Generation Error (Attempt ${attempt + 1}/${MAX_RETRIES + 1}):`, error);
      lastError = error;
      
      // Don't retry on specific errors
      if (error.statusCode === 429 || error.statusCode === 400) {
        throw error;
      }
    }
  }

  throw lastError || new AIAssistantError('Failed to generate summary after retries');
}

// Cache implementation
interface CacheEntry {
  summary: string;
  timestamp: number;
}

export function getCachedSummary(key: string): string | null {
  try {
    const cached = localStorage.getItem(`ai_summary_${key}`);
    if (!cached) return null;

    const entry: CacheEntry = JSON.parse(cached);
    if (Date.now() - entry.timestamp > CACHE_DURATION) {
      localStorage.removeItem(`ai_summary_${key}`);
      return null;
    }

    return entry.summary;
  } catch (error) {
    console.error('Cache read error:', error);
    return null;
  }
}

export function cacheSummary(key: string, summary: string): void {
  try {
    const entry: CacheEntry = {
      summary,
      timestamp: Date.now()
    };
    localStorage.setItem(`ai_summary_${key}`, JSON.stringify(entry));
  } catch (error) {
    console.error('Cache write error:', error);
  }
}