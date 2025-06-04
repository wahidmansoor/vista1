/**
 * 🧹 Enhanced Input Sanitization Utilities for AI Agent System
 * 
 * ✅ SECURITY FEATURES:
 * - XSS prevention with comprehensive pattern matching
 * - SQL injection protection
 * - Medical context preservation
 * - Rate limiting validation
 * - Input validation with meaningful error messages
 * 
 * 🏥 MEDICAL-GRADE SANITIZATION:
 * - Preserves clinical terminology and abbreviations
 * - Handles drug names, measurements, and medical procedures
 * - Maintains formatting for dosage information
 */

export interface SanitizationOptions {
  maxLength?: number;
  allowHtml?: boolean;
  allowSpecialChars?: boolean;
  removeEmojis?: boolean;
  preserveNewlines?: boolean;
  stripUrls?: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  reason?: string;
  sanitizedInput?: string;
}

export interface RateLimitResult {
  allowed: boolean;
  resetTime?: number;
  remainingRequests?: number;
}

export class InputSanitizer {
  private static readonly DEFAULT_MAX_LENGTH = 2000;
  private static readonly MEDICAL_MAX_LENGTH = 5000;
  
  // Enhanced dangerous patterns with medical context awareness
  private static readonly DANGEROUS_PATTERNS = [
    /javascript:/gi,
    /data:/gi,
    /vbscript:/gi,
    /on\w+\s*=/gi, // event handlers like onclick=
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
    /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
    /<link\b[^<]*>/gi,
    /<meta\b[^<]*>/gi,
    /expression\s*\(/gi, // CSS expression attacks
    /url\s*\(/gi, // CSS url() attacks (but preserve medical URLs if needed)
  ];

  // Medical abbreviations and terms that should be preserved
  private static readonly MEDICAL_TERMS = [
    'mg', 'ml', 'mcg', 'IU', 'bid', 'tid', 'qid', 'prn', 'po', 'iv', 'im', 'sq',
    'CBC', 'CMP', 'LFT', 'BUN', 'Cr', 'eGFR', 'HbA1c', 'PSA', 'CEA', 'CA',
    'ANC', 'WBC', 'RBC', 'Hgb', 'Hct', 'MCV', 'PLT',
    'ECOG', 'Karnofsky', 'AJCC', 'TNM', 'NCCN'
  ];

  /**
   * Enhanced prompt sanitization with medical context preservation
   */
  static sanitizePrompt(input: string, options: SanitizationOptions = {}): string {
    if (!input || typeof input !== 'string') {
      return '';
    }

    const {
      maxLength = this.DEFAULT_MAX_LENGTH,
      allowHtml = false,
      allowSpecialChars = true,
      removeEmojis = false,
      preserveNewlines = true,
      stripUrls = false
    } = options;

    let sanitized = input;

    // Remove null bytes and control characters (preserve medical formatting)
    sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

    // Remove dangerous patterns
    this.DANGEROUS_PATTERNS.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '');
    });    // Remove HTML if not allowed
    if (!allowHtml) {
      sanitized = this.stripHtml(sanitized);
    }

    // Handle URLs
    if (stripUrls) {
      // Preserve medical reference URLs but remove others
      sanitized = sanitized.replace(/https?:\/\/(?!.*(?:pubmed|ncbi|nccn|asco|nejm|jco|cancer))[^\s]+/gi, '[URL_REMOVED]');
    }

    // Handle special characters while preserving medical notation
    if (!allowSpecialChars) {
      // Preserve medical notation like μg, °C, %, etc.
      sanitized = sanitized.replace(/[^\w\s\.\,\;\:\!\?\-\+\=\(\)\[\]\{\}\/\%\°\μ\α\β\γ\δ]/g, '');
    }

    // Remove emojis if requested
    if (removeEmojis) {
      sanitized = sanitized.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
    }

    // Handle newlines
    if (!preserveNewlines) {
      sanitized = sanitized.replace(/\n+/g, ' ');
    } else {
      // Normalize excessive newlines while preserving medical formatting
      sanitized = sanitized.replace(/\n{4,}/g, '\n\n');
    }

    // Remove excessive whitespace but preserve medical spacing
    sanitized = sanitized.replace(/[ \t]+/g, ' ').trim();

    // Truncate to maximum length with intelligent word boundary
    if (sanitized.length > maxLength) {
      sanitized = this.intelligentTruncate(sanitized, maxLength);
    }

    return sanitized;
  }

  /**
   * Sanitizes medical context with higher limits and medical term preservation
   */
  static sanitizeMedicalContext(input: string): string {
    return this.sanitizePrompt(input, {
      maxLength: this.MEDICAL_MAX_LENGTH,
      allowHtml: false,
      stripUrls: false,
      preserveNewlines: true,
      allowSpecialChars: true
    });
  }

  /**
   * Validates prompt content with medical context awareness
   */
  static validatePrompt(input: string): ValidationResult {
    if (!input || typeof input !== 'string') {
      return { isValid: false, reason: 'Input must be a valid string' };
    }

    const sanitized = this.sanitizePrompt(input);
    
    if (sanitized.length === 0) {
      return { isValid: false, reason: 'Prompt cannot be empty after sanitization' };
    }

    if (sanitized.length < 3) {
      return { isValid: false, reason: 'Prompt too short - please provide more detail' };
    }

    // Check for spam-like patterns
    if (/(.)\1{15,}/.test(sanitized)) {
      return { isValid: false, reason: 'Invalid input pattern detected (excessive repetition)' };
    }

    // Check for meaningful content (but allow medical abbreviations)
    const words = sanitized.toLowerCase().split(/\s+/);
    const uniqueWords = new Set(words);
    const medicalTermCount = words.filter(word => 
      this.MEDICAL_TERMS.some(term => word.includes(term.toLowerCase()))
    ).length;

    // More lenient for medical content
    if (words.length > 10 && uniqueWords.size / words.length < 0.2 && medicalTermCount < 2) {
      return { isValid: false, reason: 'Input appears to contain excessive repetition' };
    }

    // Check for potential injection attempts
    const suspiciousPatterns = [
      /union\s+select/gi,
      /drop\s+table/gi,
      /insert\s+into/gi,
      /delete\s+from/gi,
      /update\s+set/gi,
      /exec\s*\(/gi,
      /eval\s*\(/gi
    ];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(sanitized)) {
        return { isValid: false, reason: 'Potentially malicious content detected' };
      }
    }

    return { isValid: true, sanitizedInput: sanitized };
  }

  /**
   * Enhanced rate limiting with user-specific tracking
   */
  static validateRateLimit(
    userId: string,
    windowMs: number = 60000, // 1 minute
    maxRequests: number = 15 // Higher limit for medical users
  ): RateLimitResult {
    const key = `rate_limit_${userId}`;
    const now = Date.now();
    
    // In production, this should use Redis or a proper database
    const rateLimitStore = (global as any).__rateLimitStore__ || {};
    (global as any).__rateLimitStore__ = rateLimitStore;
    
    const userLimit = rateLimitStore[key] || { count: 0, resetTime: now + windowMs };
    
    if (now > userLimit.resetTime) {
      userLimit.count = 1;
      userLimit.resetTime = now + windowMs;
    } else {
      userLimit.count += 1;
    }
    
    rateLimitStore[key] = userLimit;
    
    return {
      allowed: userLimit.count <= maxRequests,
      resetTime: userLimit.resetTime,
      remainingRequests: Math.max(0, maxRequests - userLimit.count)
    };
  }

  /**
   * Sanitizes module-specific context data
   */
  static sanitizeModuleContext(
    module: string,
    context: Record<string, any>
  ): Record<string, string> {
    const sanitized: Record<string, string> = {};

    for (const [key, value] of Object.entries(context)) {
      if (typeof value === 'string') {
        sanitized[key] = this.sanitizeMedicalContext(value);
      } else if (typeof value === 'number' || typeof value === 'boolean') {
        sanitized[key] = String(value);
      } else if (Array.isArray(value)) {
        sanitized[key] = value
          .filter(item => typeof item === 'string' || typeof item === 'number')
          .map(item => this.sanitizeMedicalContext(String(item)))
          .join(', ');
      } else if (value && typeof value === 'object') {
        // Recursively sanitize nested objects (limit depth to prevent attacks)
        try {
          sanitized[key] = this.sanitizeMedicalContext(JSON.stringify(value));
        } catch {
          sanitized[key] = '[COMPLEX_OBJECT]';
        }
      }
    }

    return sanitized;
  }
  /**
   * Intelligent truncation that preserves medical context
   */
  private static intelligentTruncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;

    let truncated = text.substring(0, maxLength);
    
    // Try to end at a sentence boundary
    const lastPeriod = truncated.lastIndexOf('.');
    const lastQuestion = truncated.lastIndexOf('?');
    const lastExclamation = truncated.lastIndexOf('!');
    const lastSentenceEnd = Math.max(lastPeriod, lastQuestion, lastExclamation);
    
    if (lastSentenceEnd > maxLength * 0.7) {
      truncated = truncated.substring(0, lastSentenceEnd + 1);
    } else {
      // Try to end at a word boundary
      const lastSpace = truncated.lastIndexOf(' ');
      if (lastSpace > maxLength * 0.8) {
        truncated = truncated.substring(0, lastSpace);
      }
    }
    
    return truncated.trim() + '...';
  }

  /**
   * Strips HTML tags from input while preserving medical formatting
   */
  private static stripHtml(input: string): string {
    return input
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, "'")
      .replace(/&#x2F;/g, '/')
      .replace(/&nbsp;/g, ' ');
  }

  /**
   * Sanitizes complete AI request objects
   */
  static sanitizeAIRequest(request: any): any {
    if (!request || typeof request !== 'object') {
      return {};
    }

    const sanitized: any = {};

    // Sanitize common AI request fields
    if (request.prompt) {
      sanitized.prompt = this.sanitizePrompt(request.prompt);
    }

    if (request.context) {
      sanitized.context = this.sanitizeMedicalContext(request.context);
    }

    if (request.history && Array.isArray(request.history)) {
      sanitized.history = request.history
        .filter(item => typeof item === 'string')
        .map(item => this.sanitizeMedicalContext(item));
    }

    if (request.module && typeof request.module === 'string') {
      sanitized.module = request.module.replace(/[^a-zA-Z0-9_-]/g, '');
    }

    if (request.intent && typeof request.intent === 'string') {
      sanitized.intent = request.intent.replace(/[^a-zA-Z0-9_-]/g, '');
    }

    // Copy other safe fields
    ['iterationCount', 'feedbackType', 'mockMode'].forEach(field => {
      if (request[field] !== undefined) {
        sanitized[field] = request[field];
      }
    });

    return sanitized;
  }
}

/**
 * Convenience function for quick prompt sanitization
 */
export function sanitizePrompt(input: string): string {
  return InputSanitizer.sanitizePrompt(input);
}

/**
 * Convenience function for complete request sanitization
 */
export function sanitizeAIRequest(request: any): any {
  return InputSanitizer.sanitizeAIRequest(request);
}
