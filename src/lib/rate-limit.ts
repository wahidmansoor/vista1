import { NextApiResponse } from 'next';
import { LRUCache } from 'lru-cache';

interface RateLimitOptions {
  uniqueTokenPerInterval?: number;
  interval?: number;
}

interface RequestWindow {
  count: number;
  resetTime: number;
}

export class RateLimiter {
  private requests: Map<string, RequestWindow>;
  private readonly limit: number;
  private readonly windowMs: number;

  constructor(limit: number, windowMs: number) {
    this.requests = new Map();
    this.limit = limit;
    this.windowMs = windowMs;
  }

  check(ip: string): boolean {
    const now = Date.now();
    const window = this.requests.get(ip);

    // Clean up expired windows
    if (window && now > window.resetTime) {
      this.requests.delete(ip);
    }

    // Create new window if needed
    if (!this.requests.has(ip)) {
      this.requests.set(ip, {
        count: 1,
        resetTime: now + this.windowMs
      });
      return true;
    }

    // Update existing window
    const currentWindow = this.requests.get(ip)!;
    if (currentWindow.count < this.limit) {
      currentWindow.count++;
      return true;
    }

    return false;
  }

  reset(): void {
    this.requests.clear();
  }
}

export function rateLimit(options?: RateLimitOptions) {
  const tokenCache = new LRUCache({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 60000,
  });

  return {
    check: (res: NextApiResponse, limit: number, token: string) =>
      new Promise<void>((resolve, reject) => {
        const tokenCount = (tokenCache.get(token) as number[]) || [0];
        if (tokenCount[0] === 0) {
          tokenCache.set(token, tokenCount);
        }
        tokenCount[0] += 1;

        const currentUsage = tokenCount[0];
        const isRateLimited = currentUsage >= limit;

        res.setHeader('X-RateLimit-Limit', limit);
        res.setHeader('X-RateLimit-Remaining', isRateLimited ? 0 : limit - currentUsage);

        if (isRateLimited) {
          reject(new Error('Too Many Requests'));
          res.status(429).json({ error: 'Too Many Requests' });
        } else {
          resolve();
        }
      }),
  };
}