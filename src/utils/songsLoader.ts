import type { Song } from "./lyricsProcessor";

/**
 * Configuration for loading songs from external source
 */
export interface SongsLoaderConfig {
  /**
   * URL to fetch songs from (e.g., S3, API endpoint, CDN)
   * If not provided, will use local fallback
   */
  songsUrl?: string;

  /**
   * Cache duration in milliseconds (default: 5 minutes)
   */
  cacheDurationMs?: number;

  /**
   * Enable/disable caching (default: true)
   */
  enableCache?: boolean;
}

/**
 * Cache entry for songs data
 */
interface SongsCache {
  data: Song[];
  timestamp: number;
  expiresAt: number;
}

// In-memory cache
let songsCache: SongsCache | null = null;

/**
 * Fetches songs from an external URL
 * @param url The URL to fetch songs from
 * @returns Promise that resolves to an array of songs
 */
async function fetchSongsFromUrl(url: string): Promise<Song[]> {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // Add any custom headers if needed (e.g., API keys)
      // "Authorization": "Bearer YOUR_API_KEY",
    },
    // Add cache control if needed
    cache: "no-cache", // Always fetch fresh data
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch songs: ${response.status} ${response.statusText}`,
    );
  }

  const data = await response.json();

  // Validate that data is an array
  if (!Array.isArray(data)) {
    throw new Error("Invalid songs data format: expected an array");
  }

  // Basic validation - ensure each song has required fields
  const validSongs = data.filter(
    (song) => song.id && song.title && Array.isArray(song.lyrics),
  );

  if (validSongs.length === 0) {
    throw new Error("No valid songs found in the response");
  }

  return validSongs as Song[];
}

/**
 * Loads songs from local fallback (songs.json)
 * @returns Promise that resolves to an array of songs
 */
async function loadLocalSongs(): Promise<Song[]> {
  try {
    // Dynamic import to allow webpack to handle the JSON file
    const songsModule = await import("../data/songs.json");
    return songsModule.default as Song[];
  } catch {
    // Error loading local songs
    throw new Error("Failed to load local songs fallback");
  }
}

/**
 * Checks if the cache is still valid
 */
function isCacheValid(
  cache: SongsCache | null,
  cacheDurationMs: number,
): boolean {
  if (!cache) {
    return false;
  }

  const now = Date.now();
  return now < cache.expiresAt;
}

/**
 * Loads songs from external source or local fallback
 *
 * @param config Configuration for loading songs
 * @returns Promise that resolves to an array of songs
 *
 * @example
 * ```ts
 * const songs = await loadSongs({
 *   songsUrl: "https://your-bucket.s3.amazonaws.com/songs.json",
 *   cacheDurationMs: 300000, // 5 minutes
 * });
 * ```
 */
export async function loadSongs(
  config: SongsLoaderConfig = {},
): Promise<Song[]> {
  const {
    songsUrl,
    cacheDurationMs = 5 * 60 * 1000, // 5 minutes default
    enableCache = true,
  } = config;

  // Check cache first if enabled
  if (enableCache && songsCache && isCacheValid(songsCache, cacheDurationMs)) {
    return songsCache.data;
  }

  // Try to fetch from external URL if provided
  if (songsUrl) {
    try {
      const songs = await fetchSongsFromUrl(songsUrl);

      // Update cache if enabled
      if (enableCache) {
        const now = Date.now();
        songsCache = {
          data: songs,
          timestamp: now,
          expiresAt: now + cacheDurationMs,
        };
      }

      return songs;
    } catch {
      // Failed to fetch songs from external URL, falling back to local
      // Fall through to local fallback
    }
  }

  // Fallback to local songs
  const localSongs = await loadLocalSongs();

  // Update cache with local songs if enabled
  if (enableCache) {
    const now = Date.now();
    songsCache = {
      data: localSongs,
      timestamp: now,
      expiresAt: now + cacheDurationMs,
    };
  }

  return localSongs;
}

/**
 * Clears the songs cache
 * Useful if you want to force a refresh
 */
export function clearSongsCache(): void {
  songsCache = null;
}

/**
 * Gets the current cache status
 */
export function getCacheStatus(): {
  cached: boolean;
  timestamp: number | null;
  expiresAt: number | null;
} {
  if (!songsCache) {
    return {
      cached: false,
      timestamp: null,
      expiresAt: null,
    };
  }

  return {
    cached: true,
    timestamp: songsCache.timestamp,
    expiresAt: songsCache.expiresAt,
  };
}
