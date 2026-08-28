import React, { useState, useEffect } from 'react';
import { 
  Server, 
  Youtube, 
  BookOpen, 
  Type, 
  Key, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Play, 
  Copy, 
  Check, 
  ExternalLink,
  Code2,
  RefreshCw,
  Search,
  MessageSquare,
  ListVideo,
  UserCheck,
  Film
} from 'lucide-react';
import { api } from '../lib/api';

interface ApiEndpointConfig {
  id: string;
  category: 'youtube' | 'books' | 'fonts';
  title: string;
  method: 'GET';
  path: string;
  quotaCost: string;
  description: string;
  defaultParams: Record<string, string>;
  headerInfo: string;
  run: (params: Record<string, string>) => Promise<any>;
}

export const ApiExplorer: React.FC = () => {
  const [selectedEndpointId, setSelectedEndpointId] = useState<string>('yt_video');
  const [params, setParams] = useState<Record<string, string>>({ id: 'dQw4w9WgXcQ' });
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [healthStatus, setHealthStatus] = useState<{ status: string; hasGoogleApiKey: boolean } | null>(null);

  const endpoints: ApiEndpointConfig[] = [
    {
      id: 'yt_video',
      category: 'youtube',
      title: 'YouTube: Video Stats',
      method: 'GET',
      path: '/api/youtube/video',
      quotaCost: '1 unit',
      description: 'Fetches metadata and view/like/comment statistics for a single video ID without running heavy search.',
      defaultParams: { id: 'M7lc1UVf-VE' },
      headerInfo: 'X-goog-api-key: [Hidden Server-Side]',
      run: (p) => api.getVideoStats(p.id || 'M7lc1UVf-VE'),
    },
    {
      id: 'yt_channel',
      category: 'youtube',
      title: "YouTube: Channel's Numbers",
      method: 'GET',
      path: '/api/youtube/channel',
      quotaCost: '1 unit',
      description: "Retrieves a channel's core numbers (subscriber count, total views, video count) by handle or channel ID.",
      defaultParams: { handle: 'TEDEd' },
      headerInfo: 'X-goog-api-key: [Hidden Server-Side]',
      run: (p) => api.getChannelStats({ handle: p.handle }),
    },
    {
      id: 'yt_uploads',
      category: 'youtube',
      title: "YouTube: Channel's Uploads (Playlist)",
      method: 'GET',
      path: '/api/youtube/playlist-items',
      quotaCost: '1 unit / page',
      description: "Fetches up to 50 uploads from a channel playlist (e.g. uploads playlist) WITHOUT burning search quota.",
      defaultParams: { playlistId: 'UUsooa4yRKGN_zEE8iknghZA', maxResults: '10' },
      headerInfo: 'X-goog-api-key: [Hidden Server-Side]',
      run: (p) => api.getPlaylistUploads(p.playlistId || 'UUsooa4yRKGN_zEE8iknghZA', Number(p.maxResults) || 10),
    },
    {
      id: 'yt_comments',
      category: 'youtube',
      title: 'YouTube: Video Comments',
      method: 'GET',
      path: '/api/youtube/comments',
      quotaCost: '1 unit / page',
      description: 'Streams top-level video comment threads and user discussion up to 100 comments per page.',
      defaultParams: { videoId: 'M7lc1UVf-VE', maxResults: '20' },
      headerInfo: 'X-goog-api-key: [Hidden Server-Side]',
      run: (p) => api.getVideoComments(p.videoId || 'M7lc1UVf-VE', Number(p.maxResults) || 20),
    },
    {
      id: 'yt_search',
      category: 'youtube',
      title: 'YouTube: Search Videos',
      method: 'GET',
      path: '/api/youtube/search',
      quotaCost: '100 calls/day project bucket',
      description: 'Performs semantic search for video content. Conserves the high-value project search quota.',
      defaultParams: { q: 'astronomy for curious learners', maxResults: '5' },
      headerInfo: 'X-goog-api-key: [Hidden Server-Side]',
      run: (p) => api.searchVideos(p.q || 'astronomy for curious learners', Number(p.maxResults) || 5),
    },
    {
      id: 'books_volumes',
      category: 'books',
      title: 'Google Books: Search Volumes',
      method: 'GET',
      path: '/api/books/volumes',
      quotaCost: 'Key Mandatory (0 anon)',
      description: 'Searches published books, academic volumes, ISBNs, and reading previews with required API key headers.',
      defaultParams: { q: 'Quantum Computing Foundations', maxResults: '5' },
      headerInfo: 'X-goog-api-key: [Hidden Server-Side]',
      run: (p) => api.searchBooks(p.q || 'Quantum Computing Foundations', Number(p.maxResults) || 5),
    },
    {
      id: 'fonts_catalogue',
      category: 'fonts',
      title: 'Google Fonts: Catalogue',
      method: 'GET',
      path: '/api/fonts',
      quotaCost: 'Key Standard',
      description: 'Fetches the full Google Web Fonts typographic catalogue sorted by popularity, date, or alpha.',
      defaultParams: { sort: 'popularity' },
      headerInfo: 'X-goog-api-key: [Hidden Server-Side]',
      run: (p) => api.getFontsCatalogue(p.sort || 'popularity'),
    },
  ];

  const currentEndpoint = endpoints.find(e => e.id === selectedEndpointId) || endpoints[0];

  useEffect(() => {
    // Check API health status
    api.checkHealth()
      .then(res => setHealthStatus(res))
      .catch(() => setHealthStatus({ status: 'offline', hasGoogleApiKey: false }));
  }, []);

  const handleSelectEndpoint = (endpoint: ApiEndpointConfig) => {
    setSelectedEndpointId(endpoint.id);
    setParams({ ...endpoint.defaultParams });
    setResponse(null);
    setError(null);
  };

  const handleRunRequest = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await currentEndpoint.run(params);
      setResponse(data);
    } catch (err: any) {
      setError(err.message || 'API request failed');
      setResponse(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyJson = () => {
    if (!response) return;
    navigator.clipboard.writeText(JSON.stringify(response, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 mb-8 shadow-xl relative overflow-hidden backdrop-blur-sm">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <Server className="w-6 h-6" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Backend API Services & Gateway
              </h1>
            </div>
            <p className="text-slate-400 text-sm max-w-2xl">
              Server-side API routes proxying requests to YouTube v3, Google Books v1, and Google Web Fonts. 
              Protected with strict <code className="text-cyan-300 font-mono bg-slate-800/80 px-1.5 py-0.5 rounded text-xs">X-goog-api-key</code> headers to prevent credential log leakage.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5">
              <ShieldCheck className={`w-8 h-8 ${healthStatus?.hasGoogleApiKey ? 'text-emerald-400' : 'text-amber-400'}`} />
              <div>
                <div className="text-xs text-slate-400 font-medium">Header Auth Status</div>
                <div className="text-sm font-bold text-white flex items-center gap-1.5">
                  {healthStatus?.hasGoogleApiKey ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live Key Active
                    </span>
                  ) : (
                    <span className="text-amber-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-amber-400" /> Key Mode / Resilient Fallback
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Endpoints list & Execution console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Endpoint Directory */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2 flex items-center justify-between">
            <span>Available Endpoints</span>
            <span className="text-[10px] bg-slate-800 text-cyan-300 px-2 py-0.5 rounded-full font-mono">7 routes</span>
          </div>

          <div className="space-y-2">
            {endpoints.map((ep) => {
              const isSelected = ep.id === selectedEndpointId;
              let Icon = Youtube;
              let iconColor = 'text-red-400';
              if (ep.category === 'books') {
                Icon = BookOpen;
                iconColor = 'text-amber-400';
              } else if (ep.category === 'fonts') {
                Icon = Type;
                iconColor = 'text-purple-400';
              }

              return (
                <button
                  key={ep.id}
                  onClick={() => handleSelectEndpoint(ep)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col gap-2 ${
                    isSelected
                      ? 'bg-slate-800/90 border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                      : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${iconColor}`} />
                      <span className="font-semibold text-sm text-slate-100">{ep.title}</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-950/80 text-cyan-300 border border-slate-800">
                      {ep.quotaCost}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span className="text-emerald-400 font-bold">{ep.method}</span>
                    <span className="truncate max-w-[200px] text-slate-500">{ep.path}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Security Best Practices Callout */}
          <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-800/40 text-xs text-cyan-200/90 space-y-2 mt-4">
            <div className="flex items-center gap-2 font-bold text-cyan-300">
              <ShieldCheck className="w-4 h-4" />
              <span>Header Security Enforcement</span>
            </div>
            <p className="leading-relaxed text-[11px] text-slate-300">
              In your backend Express proxy, Google API keys are forwarded inside the <code className="text-cyan-300 font-mono">X-goog-api-key</code> HTTP header instead of query parameters so that keys never appear in URL access logs or browser history.
            </p>
          </div>
        </div>

        {/* Right Side: Request Runner & Interactive Inspector */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            
            {/* Header & Path */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold">
                    {currentEndpoint.method}
                  </span>
                  <span className="font-mono text-sm sm:text-base font-semibold text-slate-200">
                    {currentEndpoint.path}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {currentEndpoint.description}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-800/60 px-3 py-1 rounded-xl">
                  {currentEndpoint.quotaCost}
                </span>
              </div>
            </div>

            {/* Request Parameters Form */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Query Parameters
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.keys(currentEndpoint.defaultParams).map((paramKey) => (
                  <div key={paramKey} className="space-y-1">
                    <label className="text-xs font-mono text-slate-300">{paramKey}:</label>
                    <input
                      type="text"
                      value={params[paramKey] ?? ''}
                      onChange={(e) => setParams({ ...params, [paramKey]: e.target.value })}
                      placeholder={`Enter ${paramKey}...`}
                      className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                ))}
              </div>

              {/* Secure Headers info */}
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/80">
                <Key className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-slate-400">Header:</span>
                <span className="text-emerald-400">{currentEndpoint.headerInfo}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleRunRequest}
                disabled={loading}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-lg shadow-cyan-500/20 flex items-center gap-2 cursor-pointer transition disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Executing Request...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Execute /api Request</span>
                  </>
                )}
              </button>

              {response && (
                <button
                  onClick={handleCopyJson}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied JSON!' : 'Copy JSON'}</span>
                </button>
              )}
            </div>

            {/* Response Console */}
            {error && (
              <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-800/60 text-xs text-rose-300 flex items-start gap-3 animate-fadeIn">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-rose-200">Request Error</div>
                  <div className="mt-0.5 font-mono">{error}</div>
                </div>
              </div>
            )}

            {response && (
              <div className="space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Status: 200 OK
                  </span>
                  {response.mock && (
                    <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded text-[10px] font-mono font-semibold">
                      Preview / Mock Fallback
                    </span>
                  )}
                </div>

                <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 font-mono text-xs text-slate-300 overflow-x-auto max-h-96 custom-scrollbar">
                  <pre>{JSON.stringify(response, null, 2)}</pre>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};
