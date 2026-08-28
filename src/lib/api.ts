/**
 * Client API services for YouTube v3, Google Books v1, and Google Fonts catalogue.
 * All requests route through the backend server /api endpoints, ensuring API keys
 * are never exposed in client URLs and are passed securely via X-goog-api-key headers.
 */

export interface YouTubeVideoStats {
  id: string;
  snippet: {
    title: string;
    description: string;
    channelTitle: string;
    publishedAt: string;
    thumbnails?: {
      default?: { url: string };
      medium?: { url: string };
      high?: { url: string };
    };
  };
  statistics?: {
    viewCount: string;
    likeCount?: string;
    commentCount?: string;
  };
}

export interface YouTubeChannelStats {
  id: string;
  snippet: {
    title: string;
    description: string;
    customUrl?: string;
    thumbnails?: {
      high?: { url: string };
    };
  };
  statistics?: {
    viewCount: string;
    subscriberCount: string;
    videoCount: string;
    hiddenSubscriberCount?: boolean;
  };
}

export interface YouTubePlaylistItem {
  id: string;
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    resourceId: {
      videoId: string;
    };
    thumbnails?: {
      high?: { url: string };
    };
  };
}

export interface YouTubeCommentThread {
  id: string;
  snippet: {
    topLevelComment: {
      snippet: {
        authorDisplayName: string;
        authorProfileImageUrl: string;
        textDisplay: string;
        likeCount: number;
        publishedAt: string;
      };
    };
  };
}

export interface GoogleBookVolume {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    publisher?: string;
    publishedDate?: string;
    description?: string;
    pageCount?: number;
    categories?: string[];
    imageLinks?: {
      smallThumbnail?: string;
      thumbnail?: string;
    };
    infoLink?: string;
    previewLink?: string;
  };
}

export interface GoogleWebFont {
  family: string;
  variants: string[];
  subsets: string[];
  version: string;
  category: string;
}

export const api = {
  /**
   * YouTube: stats for one video (1 unit)
   * GET /api/youtube/video?id=VIDEO_ID
   */
  async getVideoStats(videoId: string): Promise<{ items: YouTubeVideoStats[]; mock?: boolean }> {
    const res = await fetch(`/api/youtube/video?id=${encodeURIComponent(videoId)}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch video stats: ${res.statusText}`);
    }
    return res.json();
  },

  /**
   * YouTube: channel numbers/stats (1 unit)
   * GET /api/youtube/channel?handle=SOME_HANDLE or ?id=CHANNEL_ID
   */
  async getChannelStats(options: { handle?: string; id?: string }): Promise<{ items: YouTubeChannelStats[]; mock?: boolean }> {
    const params = new URLSearchParams();
    if (options.handle) params.set('handle', options.handle);
    if (options.id) params.set('id', options.id);
    
    const res = await fetch(`/api/youtube/channel?${params.toString()}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch channel stats: ${res.statusText}`);
    }
    return res.json();
  },

  /**
   * YouTube: channel uploads WITHOUT burning search quota (1 unit/page)
   * GET /api/youtube/playlist-items?playlistId=PLAYLIST_ID&maxResults=50
   */
  async getPlaylistUploads(playlistId: string, maxResults = 50, pageToken?: string): Promise<{ items: YouTubePlaylistItem[]; nextPageToken?: string; mock?: boolean }> {
    const params = new URLSearchParams({ playlistId, maxResults: String(maxResults) });
    if (pageToken) params.set('pageToken', pageToken);

    const res = await fetch(`/api/youtube/playlist-items?${params.toString()}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch playlist items: ${res.statusText}`);
    }
    return res.json();
  },

  /**
   * YouTube: comments on a video (1 unit/page)
   * GET /api/youtube/comments?videoId=VIDEO_ID&maxResults=100
   */
  async getVideoComments(videoId: string, maxResults = 100, pageToken?: string): Promise<{ items: YouTubeCommentThread[]; nextPageToken?: string; mock?: boolean }> {
    const params = new URLSearchParams({ videoId, maxResults: String(maxResults) });
    if (pageToken) params.set('pageToken', pageToken);

    const res = await fetch(`/api/youtube/comments?${params.toString()}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch video comments: ${res.statusText}`);
    }
    return res.json();
  },

  /**
   * YouTube: search videos (100 calls/day/project)
   * GET /api/youtube/search?q=QUERY&type=video
   */
  async searchVideos(query: string, maxResults = 20, pageToken?: string): Promise<{ items: any[]; nextPageToken?: string; mock?: boolean }> {
    const params = new URLSearchParams({ q: query, maxResults: String(maxResults) });
    if (pageToken) params.set('pageToken', pageToken);

    const res = await fetch(`/api/youtube/search?${params.toString()}`);
    if (!res.ok) {
      throw new Error(`Failed to search videos: ${res.statusText}`);
    }
    return res.json();
  },

  /**
   * YouTube: Kids Safe Educational Search (Top 3 videos)
   * GET /api/youtube/kids-search?q=QUERY&maxResults=3
   */
  async searchKidsVideos(query: string, maxResults = 3): Promise<{ query: string; mock?: boolean; count: number; items: any[]; notice?: string }> {
    const params = new URLSearchParams({ q: query, maxResults: String(maxResults) });
    const res = await fetch(`/api/youtube/kids-search?${params.toString()}`);
    if (!res.ok) {
      throw new Error(`Failed to search kid videos: ${res.statusText}`);
    }
    return res.json();
  },

  /**
   * Books: search volumes (key mandatory)
   * GET /api/books/volumes?q=QUERY&maxResults=10
   */
  async searchBooks(query: string, maxResults = 10, startIndex = 0): Promise<{ items: GoogleBookVolume[]; totalItems: number; mock?: boolean }> {
    const params = new URLSearchParams({ q: query, maxResults: String(maxResults), startIndex: String(startIndex) });
    const res = await fetch(`/api/books/volumes?${params.toString()}`);
    if (!res.ok) {
      throw new Error(`Failed to search books: ${res.statusText}`);
    }
    return res.json();
  },

  /**
   * Fonts: the catalogue
   * GET /api/fonts?sort=popularity
   */
  async getFontsCatalogue(sort = 'popularity'): Promise<{ items: GoogleWebFont[]; mock?: boolean }> {
    const res = await fetch(`/api/fonts?sort=${encodeURIComponent(sort)}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch fonts catalogue: ${res.statusText}`);
    }
    return res.json();
  },

  /**
   * API Health Check
   */
  async checkHealth(): Promise<{ status: string; hasGoogleApiKey: boolean; services: string[] }> {
    const res = await fetch('/api/health');
    return res.json();
  }
};
