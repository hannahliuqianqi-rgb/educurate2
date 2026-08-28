import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

function getGoogleApiKey(): string | undefined {
  return (
    process.env.GOOGLE_API_KEY ||
    process.env.YOUTUBE_API_KEY ||
    process.env.GEMINI_API_KEY ||
    process.env.VITE_GOOGLE_API_KEY
  );
}

// Helper to make authenticated requests to Google APIs using the X-goog-api-key header
async function fetchGoogleApi(url: string, apiKey?: string) {
  const key = apiKey || getGoogleApiKey();
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (key) {
    // Prefer header form for security: URLs leak into logs; headers do not
    headers["X-goog-api-key"] = key;
  }

  const response = await fetch(url, { headers });
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage =
      data?.error?.message || `Google API request failed with status ${response.status}`;
    const err = new Error(errorMessage) as any;
    err.status = response.status;
    err.details = data?.error;
    throw err;
  }

  return data;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoints (/api/health and /api/health.js)
  const healthHandler = (_req: Request, res: Response) => {
    const hasGoogleApiKey = Boolean(getGoogleApiKey());
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      environment: process.env.NODE_ENV || "development",
      hasGoogleApiKey,
      authMethod: "X-goog-api-key HTTP header (secure)",
      services: {
        youtube_video_stats: "/api/youtube/video",
        youtube_channel_stats: "/api/youtube/channel",
        youtube_playlist_items: "/api/youtube/playlist-items",
        youtube_comments: "/api/youtube/comments",
        youtube_search: "/api/youtube/search",
        google_books_volumes: "/api/books/volumes",
        google_fonts_catalogue: "/api/fonts",
      },
    });
  };

  app.get("/api/health", healthHandler);
  app.get("/api/health.js", healthHandler);

  // ==========================================
  // 1. YouTube - Stats for one video (1 unit)
  // https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=VIDEO_ID
  // ==========================================
  app.get("/api/youtube/video", async (req: Request, res: Response) => {
    try {
      const videoId = req.query.id as string;
      if (!videoId) {
        return res.status(400).json({ error: "Missing required query parameter: 'id'" });
      }

      const key = getGoogleApiKey();
      if (!key) {
        return res.status(200).json({
          mock: true,
          items: [
            {
              id: videoId,
              snippet: {
                title: `Demo Video (${videoId}) - Science & Solar System for Kids`,
                description: "An educational deep dive into planetary systems and astrophysics.",
                channelTitle: "EduCurate Explorers",
                publishedAt: new Date().toISOString(),
                thumbnails: {
                  high: { url: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&auto=format&fit=crop&q=80" },
                },
              },
              statistics: {
                viewCount: "148200",
                likeCount: "9420",
                commentCount: "348",
              },
            },
          ],
          notice: "Using mock preview data. Provide GOOGLE_API_KEY in secrets to stream live YouTube metrics.",
        });
      }

      const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${encodeURIComponent(videoId)}`;
      const data = await fetchGoogleApi(url, key);
      return res.json(data);
    } catch (err: any) {
      console.error("YouTube Video Stats Error:", err);
      return res.status(err.status || 500).json({
        error: err.message || "Failed to fetch video statistics",
        details: err.details,
      });
    }
  });

  // ==========================================
  // 2. YouTube - A channel's numbers (1 unit)
  // https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&forHandle=SOME_HANDLE
  // ==========================================
  app.get("/api/youtube/channel", async (req: Request, res: Response) => {
    try {
      const handle = (req.query.handle || req.query.forHandle) as string;
      const channelId = req.query.id as string;

      if (!handle && !channelId) {
        return res.status(400).json({
          error: "Must provide either 'handle' (or 'forHandle') or 'id' query parameter",
        });
      }

      const key = getGoogleApiKey();
      if (!key) {
        return res.status(200).json({
          mock: true,
          items: [
            {
              id: channelId || "UC_EduCurateOfficial",
              snippet: {
                title: handle ? `@${handle.replace(/^@/, "")}` : "EduCurate Science Academy",
                description: "Verified educational video channels curated for inquisitive minds and lifelong learners.",
                customUrl: handle ? `@${handle.replace(/^@/, "")}` : "@educurate_academy",
                thumbnails: {
                  high: { url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80" },
                },
              },
              statistics: {
                viewCount: "5420000",
                subscriberCount: "128000",
                videoCount: "450",
              },
            },
          ],
          notice: "Using mock preview data. Provide GOOGLE_API_KEY in secrets to stream live YouTube channel numbers.",
        });
      }

      const queryParam = handle
        ? `forHandle=${encodeURIComponent(handle.startsWith("@") ? handle : `@${handle}`)}`
        : `id=${encodeURIComponent(channelId)}`;

      const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&${queryParam}`;
      const data = await fetchGoogleApi(url, key);
      return res.json(data);
    } catch (err: any) {
      console.error("YouTube Channel Stats Error:", err);
      return res.status(err.status || 500).json({
        error: err.message || "Failed to fetch channel statistics",
        details: err.details,
      });
    }
  });

  // ==========================================
  // 3. YouTube - A channel's uploads WITHOUT burning search quota (1 unit/page)
  // https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=PLAYLIST_ID&maxResults=50
  // ==========================================
  app.get("/api/youtube/playlist-items", async (req: Request, res: Response) => {
    try {
      const playlistId = req.query.playlistId as string;
      const maxResults = Math.min(Number(req.query.maxResults) || 50, 50);
      const pageToken = req.query.pageToken as string;

      if (!playlistId) {
        return res.status(400).json({ error: "Missing required query parameter: 'playlistId'" });
      }

      const key = getGoogleApiKey();
      if (!key) {
        return res.status(200).json({
          mock: true,
          items: [
            {
              id: "item_1",
              snippet: {
                title: "How Ocean Currents Shape Planet Earth",
                description: "Explore the global conveyer belt and marine ecosystems.",
                publishedAt: new Date().toISOString(),
                resourceId: { videoId: "mock_vid_ocean_1" },
                thumbnails: {
                  high: { url: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&auto=format&fit=crop&q=80" },
                },
              },
            },
            {
              id: "item_2",
              snippet: {
                title: "Ancient Civilizations: The Silk Road Journeys",
                description: "Tracing trade routes, cultural exchanges, and inventions.",
                publishedAt: new Date().toISOString(),
                resourceId: { videoId: "mock_vid_history_2" },
                thumbnails: {
                  high: { url: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80" },
                },
              },
            },
          ],
          notice: "Using mock preview data. Provide GOOGLE_API_KEY to fetch channel playlist uploads without burning search quota.",
        });
      }

      let url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${encodeURIComponent(playlistId)}&maxResults=${maxResults}`;
      if (pageToken) {
        url += `&pageToken=${encodeURIComponent(pageToken)}`;
      }

      const data = await fetchGoogleApi(url, key);
      return res.json(data);
    } catch (err: any) {
      console.error("YouTube Playlist Items Error:", err);
      return res.status(err.status || 500).json({
        error: err.message || "Failed to fetch playlist items",
        details: err.details,
      });
    }
  });

  // ==========================================
  // 4. YouTube - Comments on a video (1 unit/page)
  // https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=VIDEO_ID&maxResults=100
  // ==========================================
  app.get("/api/youtube/comments", async (req: Request, res: Response) => {
    try {
      const videoId = req.query.videoId as string;
      const maxResults = Math.min(Number(req.query.maxResults) || 100, 100);
      const pageToken = req.query.pageToken as string;

      if (!videoId) {
        return res.status(400).json({ error: "Missing required query parameter: 'videoId'" });
      }

      const key = getGoogleApiKey();
      if (!key) {
        return res.status(200).json({
          mock: true,
          items: [
            {
              id: "comm_1",
              snippet: {
                topLevelComment: {
                  snippet: {
                    authorDisplayName: "Clara M.",
                    authorProfileImageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
                    textDisplay: "This visualization made photosynthesis so clear for my students!",
                    likeCount: 24,
                    publishedAt: "2026-08-20T10:00:00Z",
                  },
                },
              },
            },
            {
              id: "comm_2",
              snippet: {
                topLevelComment: {
                  snippet: {
                    authorDisplayName: "Leo K.",
                    authorProfileImageUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
                    textDisplay: "Amazing explanation, especially the part about planetary gravity.",
                    likeCount: 15,
                    publishedAt: "2026-08-22T14:30:00Z",
                  },
                },
              },
            },
          ],
          notice: "Using mock comments. Provide GOOGLE_API_KEY to stream live video comment threads.",
        });
      }

      let url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${encodeURIComponent(videoId)}&maxResults=${maxResults}`;
      if (pageToken) {
        url += `&pageToken=${encodeURIComponent(pageToken)}`;
      }

      const data = await fetchGoogleApi(url, key);
      return res.json(data);
    } catch (err: any) {
      console.error("YouTube Comments Error:", err);
      return res.status(err.status || 500).json({
        error: err.message || "Failed to fetch video comments",
        details: err.details,
      });
    }
  });

  // ==========================================
  // 5. YouTube - Search, the precious one (100 calls/day/project)
  // https://www.googleapis.com/youtube/v3/search?part=snippet&q=QUERY&type=video
  // ==========================================
  app.get("/api/youtube/search", async (req: Request, res: Response) => {
    try {
      const query = req.query.q as string;
      const maxResults = Math.min(Number(req.query.maxResults) || 20, 50);
      const pageToken = req.query.pageToken as string;

      if (!query) {
        return res.status(400).json({ error: "Missing required query parameter: 'q'" });
      }

      const key = getGoogleApiKey();
      if (!key) {
        return res.status(200).json({
          mock: true,
          items: [
            {
              id: { videoId: "search_result_1" },
              snippet: {
                title: `${query}: Foundational Introduction`,
                description: `Comprehensive video guide for mastering ${query} through interactive conceptual lessons.`,
                channelTitle: "Global Knowledge Lab",
                publishedAt: new Date().toISOString(),
                thumbnails: {
                  high: { url: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80" },
                },
              },
            },
            {
              id: { videoId: "search_result_2" },
              snippet: {
                title: `${query} in 15 Minutes - Visual Summary`,
                description: `Fast-paced visual breakdown of key concepts and practical applications of ${query}.`,
                channelTitle: "Curated Minds",
                publishedAt: new Date().toISOString(),
                thumbnails: {
                  high: { url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80" },
                },
              },
            },
          ],
          notice: "Using mock search data. Provide GOOGLE_API_KEY to search YouTube videos live.",
        });
      }

      let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=${maxResults}`;
      if (pageToken) {
        url += `&pageToken=${encodeURIComponent(pageToken)}`;
      }

      const data = await fetchGoogleApi(url, key);
      return res.json(data);
    } catch (err: any) {
      console.error("YouTube Search Error:", err);
      return res.status(err.status || 500).json({
        error: err.message || "Failed to search YouTube videos",
        details: err.details,
      });
    }
  });

  // ==========================================
  // 6. Books - Search volumes (key mandatory)
  // https://www.googleapis.com/books/v1/volumes?q=QUERY&maxResults=10
  // ==========================================
  app.get("/api/books/volumes", async (req: Request, res: Response) => {
    try {
      const query = req.query.q as string;
      const maxResults = Math.min(Number(req.query.maxResults) || 10, 40);
      const startIndex = Number(req.query.startIndex) || 0;

      if (!query) {
        return res.status(400).json({ error: "Missing required query parameter: 'q'" });
      }

      const key = getGoogleApiKey();
      if (!key) {
        return res.status(200).json({
          mock: true,
          totalItems: 2,
          items: [
            {
              id: "book_1",
              volumeInfo: {
                title: `The Essential Companion to ${query}`,
                authors: ["Dr. Eleanor Vance", "Prof. Marcus Thorne"],
                publisher: "Academic Press",
                publishedDate: "2024",
                description: `An authoritative handbook exploring fundamental theories and recent breakthroughs in ${query}.`,
                pageCount: 384,
                categories: ["Education", "Science"],
                imageLinks: {
                  thumbnail: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80",
                },
                infoLink: `https://books.google.com/books?q=${encodeURIComponent(query)}`,
              },
            },
            {
              id: "book_2",
              volumeInfo: {
                title: `Learning ${query}: Illustrated Guide for Beginners`,
                authors: ["Aria Sterling"],
                publisher: "Curated Learning Books",
                publishedDate: "2025",
                description: `Engaging, step-by-step illustrated lessons and practice exercises for curious learners of all ages.`,
                pageCount: 220,
                categories: ["Juvenile Nonfiction", "Self-Help"],
                imageLinks: {
                  thumbnail: "https://images.unsplash.com/photo-1532012164546-f432f2e3777a?w=400&auto=format&fit=crop&q=80",
                },
                infoLink: `https://books.google.com/books?q=${encodeURIComponent(query)}`,
              },
            },
          ],
          notice: "Using mock book results. Provide GOOGLE_API_KEY to search Google Books live.",
        });
      }

      const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=${maxResults}&startIndex=${startIndex}`;
      const data = await fetchGoogleApi(url, key);
      return res.json(data);
    } catch (err: any) {
      console.error("Google Books Error:", err);
      return res.status(err.status || 500).json({
        error: err.message || "Failed to fetch Google Books volumes",
        details: err.details,
      });
    }
  });

  // Alias for books search
  app.get("/api/books/search", (req: Request, res: Response) => {
    res.redirect(`/api/books/volumes?${new URLSearchParams(req.query as any).toString()}`);
  });

  // ==========================================
  // 7. Fonts - The catalogue
  // https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity
  // ==========================================
  app.get("/api/fonts", async (req: Request, res: Response) => {
    try {
      const sort = (req.query.sort as string) || "popularity";
      const key = getGoogleApiKey();

      if (!key) {
        return res.status(200).json({
          mock: true,
          items: [
            {
              family: "Plus Jakarta Sans",
              variants: ["regular", "600", "700", "800"],
              subsets: ["latin", "latin-ext"],
              version: "v8",
              category: "sans-serif",
            },
            {
              family: "Work Sans",
              variants: ["regular", "500", "600", "700"],
              subsets: ["latin", "latin-ext"],
              version: "v19",
              category: "sans-serif",
            },
            {
              family: "Playfair Display",
              variants: ["regular", "600", "700"],
              subsets: ["latin"],
              version: "v37",
              category: "serif",
            },
            {
              family: "JetBrains Mono",
              variants: ["regular", "500", "700"],
              subsets: ["latin"],
              version: "v18",
              category: "monospace",
            },
          ],
          notice: "Using mock Google Fonts catalogue. Provide GOOGLE_API_KEY to fetch the live 1500+ Google Fonts repository.",
        });
      }

      const url = `https://www.googleapis.com/webfonts/v1/webfonts?sort=${encodeURIComponent(sort)}`;
      const data = await fetchGoogleApi(url, key);
      return res.json(data);
    } catch (err: any) {
      console.error("Google Fonts Catalogue Error:", err);
      return res.status(err.status || 500).json({
        error: err.message || "Failed to fetch Google Fonts catalogue",
        details: err.details,
      });
    }
  });

  // ==========================================
  // Vite middleware for development & static for prod
  // ==========================================
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`EduCurate API server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
