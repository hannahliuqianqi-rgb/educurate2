/**
 * Health check handler for API uptime and configuration verification.
 * Compatible with serverless environments (e.g. Vercel, Netlify) and Express routes.
 */
export default function handler(req, res) {
  const hasGoogleApiKey = Boolean(
    process.env.GOOGLE_API_KEY ||
    process.env.YOUTUBE_API_KEY ||
    process.env.GEMINI_API_KEY ||
    process.env.VITE_GOOGLE_API_KEY
  );

  const healthData = {
    status: "ok",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime ? process.uptime() : 0),
    environment: process.env.NODE_ENV || "development",
    hasGoogleApiKey: hasGoogleApiKey,
    authMethod: "X-goog-api-key HTTP header (secure)",
    services: {
      youtube_video_stats: "/api/youtube/video",
      youtube_channel_stats: "/api/youtube/channel",
      youtube_playlist_items: "/api/youtube/playlist-items",
      youtube_comments: "/api/youtube/comments",
      youtube_search: "/api/youtube/search",
      google_books_volumes: "/api/books/volumes",
      google_fonts_catalogue: "/api/fonts"
    }
  };

  if (res && typeof res.status === 'function') {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    return res.status(200).json(healthData);
  }

  // Standalone return if called directly as a function
  return healthData;
}
