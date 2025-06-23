import type { Protocol } from '../types/protocol';

class ProtocolCache {
  private cache: Map<string, Protocol[]>;
  private expiry: Map<string, number>;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.cache = new Map();
    this.expiry = new Map();
  }

  private getCacheKey(filters: any): string {
    return JSON.stringify(filters || {});
  }

  get(filters: any): Protocol[] | null {
    const key = this.getCacheKey(filters);
    const expiryTime = this.expiry.get(key);
    
    if (!expiryTime || Date.now() > expiryTime) {
      this.cache.delete(key);
      this.expiry.delete(key);
      return null;
    }

    return this.cache.get(key) || null;
  }

  set(filters: any, protocols: Protocol[]): void {
    const key = this.getCacheKey(filters);
    this.cache.set(key, protocols);
    this.expiry.set(key, Date.now() + this.CACHE_DURATION);
  }

  clear(): void {
    this.cache.clear();
    this.expiry.clear();
  }

  invalidateQuery(filters: any): void {
    const key = this.getCacheKey(filters);
    this.cache.delete(key);
    this.expiry.delete(key);
  }
}

export const protocolCache = new ProtocolCache();