import { LRUCache } from 'lru-cache'

interface RateLimiterOptions {
  limit: number;
  ttl: number;
}

interface RateLimiter {
  check: (key: string) => boolean;
}

const createRateLimiter = (options: RateLimiterOptions): RateLimiter => {
  const tokenCache = new LRUCache<string, number>({
    max: options.limit || 100,
    ttl: options.ttl || 15 * 60 * 1000,
  });

  return {
    check: (key: string) => {
      const current = tokenCache.get(key) || 0;

      if (current >= options.limit) {
        return false;
      }

      tokenCache.set(key, current + 1);
      return true;
    },
  };
};

export const loginLimiter = createRateLimiter({ limit: 5, ttl: 15 * 60 * 1000 });
export const forgotPasswordLimiter = createRateLimiter({ limit: 3, ttl: 15 * 60 * 1000 });
