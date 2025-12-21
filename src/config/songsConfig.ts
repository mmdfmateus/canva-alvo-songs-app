/**
 * Configuration for loading songs from external source
 *
 * To use an external source (S3, API, etc.):
 * 1. Set EXTERNAL_SONGS_URL to your URL
 * 2. The app will fetch from that URL and fallback to local if it fails
 *
 * Examples:
 * - S3: "https://your-bucket.s3.amazonaws.com/songs.json"
 * - GitHub: "https://raw.githubusercontent.com/user/repo/main/songs.json"
 * - API: "https://api.example.com/songs"
 * - CDN: "https://cdn.example.com/songs.json"
 *
 * Leave as undefined to use local fallback only
 */
export const EXTERNAL_SONGS_URL: string | undefined =
  "https://alvo-songs.s3.sa-east-1.amazonaws.com/songs.json";

/**
 * Cache duration in milliseconds
 * Default: 5 minutes (300000ms)
 */
export const SONGS_CACHE_DURATION_MS = 5 * 60 * 1000;

/**
 * Enable/disable caching
 * Set to false to always fetch fresh data (not recommended for production)
 */
export const ENABLE_SONGS_CACHE = true;
