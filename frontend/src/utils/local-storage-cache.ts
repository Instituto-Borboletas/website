export class LocalStorageCache<T> {
  private cache: Record<string, T> = {};

  constructor(private cacheName: string) {
    this.load()
  }

  get(key: string): T | null {
    return this.cache[key] ?? null;
  }

  set(key: string, value: T): void {
    this.cache[key] = value;
  }

  load(): void {
    try {
      const existingCache = localStorage.getItem(this.cacheName);
      if (existingCache) {
        this.cache = JSON.parse(existingCache);
        return;
      }

      this.cache = {};
    } catch (error) {
      console.error(`Failed to load cache for ${this.cacheName}`, error);
      this.cache = {};
    }
  }

  store(): void {
    try {
      localStorage.setItem(this.cacheName, JSON.stringify(this.cache));
    } catch (error) {
      console.error(`Failed to store cache for ${this.cacheName}`, error);
    }
  }
}
