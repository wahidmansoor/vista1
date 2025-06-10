import { AIProvider } from '../AIService';

interface RateLimit {
  maxRequests: number;
  windowMs: number;
  requests: number;
  windowStart: number;
}

export class RateLimiter {
  private limits: Map<AIProvider, RateLimit>;

  constructor() {
    this.limits = new Map();
    this.initializeLimits();
  }

  private initializeLimits() {
    // Default rate limits for different providers
    this.limits.set('openai', {
      maxRequests: 60,
      windowMs: 60000, // 1 minute
      requests: 0,
      windowStart: Date.now()
    });

    this.limits.set('anthropic', {
      maxRequests: 50,
      windowMs: 60000,
      requests: 0,
      windowStart: Date.now()
    });

    this.limits.set('local', {
      maxRequests: 100,
      windowMs: 60000,
      requests: 0,
      windowStart: Date.now()
    });
  }

  public async checkLimit(provider: AIProvider): Promise<boolean> {
    const limit = this.limits.get(provider);
    if (!limit) {
      throw new Error(`No rate limit configured for provider: ${provider}`);
    }

    const now = Date.now();
    if (now - limit.windowStart >= limit.windowMs) {
      // Reset window if it has expired
      limit.requests = 0;
      limit.windowStart = now;
    }

    if (limit.requests >= limit.maxRequests) {
      // Calculate wait time until next window
      const waitTime = limit.windowStart + limit.windowMs - now;
      throw new Error(`Rate limit exceeded for ${provider}. Please wait ${Math.ceil(waitTime / 1000)} seconds.`);
    }

    limit.requests++;
    return true;
  }

  public getRateLimit(provider: AIProvider): RateLimit | undefined {
    return this.limits.get(provider);
  }

  public resetLimits(): void {
    this.initializeLimits();
  }

  public configureLimit(
    provider: AIProvider,
    maxRequests: number,
    windowMs: number
  ): void {
    this.limits.set(provider, {
      maxRequests,
      windowMs,
      requests: 0,
      windowStart: Date.now()
    });
  }
}
