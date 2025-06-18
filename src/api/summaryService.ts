/**
 * Summary Service - Secure Implementation
 * Routes all AI requests through Netlify functions to protect API keys
 */

export async function generateSummary(content: string): Promise<string> {
  if (!content) {
    throw new Error('Content is required');
  }

  // Always route through Netlify function for security
  try {
    const response = await fetch('/.netlify/functions/openai-summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        prompt: content,
        maxTokens: 250,
        temperature: 0.5
      })
    });
    
    if (!response.ok) {
      throw new Error('Summary service unavailable');
    }
    
    const data = await response.json();
    return data.content || 'Summary unavailable';
  } catch (error) {
    console.error('Summary generation failed:', error);
    return 'Summary generation temporarily unavailable. Please try again later.';
  }
}
