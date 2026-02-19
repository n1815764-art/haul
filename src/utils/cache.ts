import { MMKV } from 'react-native-mmkv';

// Initialize MMKV storage
const storage = new MMKV({
  id: 'haul-cache',
  encryptionKey: 'haul-secure-storage-key',
});

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

// Generic cache implementation
class CacheLayer {
  private storage: MMKV;

  constructor(storage: MMKV) {
    this.storage = storage;
  }

  // Get item from cache
  get<T>(key: string): T | null {
    try {
      const entry = this.storage.getString(key);
      if (!entry) return null;

      const parsed: CacheEntry<T> = JSON.parse(entry);
      
      // Check if expired
      if (Date.now() - parsed.timestamp > parsed.ttl) {
        this.delete(key);
        return null;
      }

      return parsed.data;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  // Set item in cache
  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    try {
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        ttl,
      };
      this.storage.set(key, JSON.stringify(entry));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  // Delete item from cache
  delete(key: string): void {
    this.storage.delete(key);
  }

  // Clear all cache
  clear(): void {
    this.storage.clearAll();
  }

  // Get multiple items
  getMany<T>(keys: string[]): Record<string, T | null> {
    const result: Record<string, T | null> = {};
    keys.forEach(key => {
      result[key] = this.get<T>(key);
    });
    return result;
  }

  // Set multiple items
  setMany<T>(items: Record<string, T>, ttl: number = 5 * 60 * 1000): void {
    Object.entries(items).forEach(([key, data]) => {
      this.set(key, data, ttl);
    });
  }

  // Check if key exists and is not expired
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  // Get cache size (approximate)
  getSize(): number {
    return this.storage.getAllKeys().length;
  }
}

// Export singleton instance
export const cache = new CacheLayer(storage);

// Cache keys helper
export const cacheKeys = {
  products: (id?: string) => id ? `product:${id}` : 'products:all',
  user: (id: string) => `user:${id}`,
  hauls: (id?: string) => id ? `haul:${id}` : 'hauls:all',
  streams: (id?: string) => id ? `stream:${id}` : 'streams:all',
  search: (query: string) => `search:${query}`,
  notifications: 'notifications:all',
  orders: 'orders:all',
  analytics: 'analytics:summary',
};

// Cache TTL values (in milliseconds)
export const cacheTTL = {
  products: 5 * 60 * 1000,      // 5 minutes
  user: 30 * 60 * 1000,          // 30 minutes
  hauls: 2 * 60 * 1000,          // 2 minutes
  streams: 1 * 60 * 1000,        // 1 minute
  search: 10 * 60 * 1000,        // 10 minutes
  notifications: 1 * 60 * 1000,  // 1 minute
  orders: 5 * 60 * 1000,         // 5 minutes
  analytics: 15 * 60 * 1000,     // 15 minutes
};
