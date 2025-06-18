/**
 * OpenAI Client Configuration - DEPRECATED
 * 
 * This file is deprecated for security reasons.
 * All OpenAI API calls should go through Netlify functions.
 * 
 * Use: /.netlify/functions/openai-summary instead
 */

// No client-side OpenAI instance should be created
// This prevents API key exposure in the browser bundle

export const openai = null;

// Migration guide:
// Replace direct openai.* calls with fetch to Netlify functions
// Example:
// 
// OLD: openai.chat.completions.create({...})
// NEW: fetch('/.netlify/functions/openai-summary', {...})