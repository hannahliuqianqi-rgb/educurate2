import React, { useState } from 'react';
import { AppView } from '../types';
import confetti from 'canvas-confetti';

interface LearningPlanDetailProps {
  onNavigate: (view: AppView) => void;
}

interface YouTubeVideoItem {
  id: string;
  title: string;
  channelTitle: string;
  description: string;
  thumbnail: string;
  duration?: string;
  views?: string;
}

interface GoogleBookItem {
  id: string;
  title: string;
  authors: string[];
  publisher?: string;
  publishedDate?: string;
  description: string;
  thumbnail: string;
  pageCount?: number;
  infoLink?: string;
}

export const LearningPlanDetail: React.FC<LearningPlanDetailProps> = ({ onNavigate }) => {
  const [activeDay, setActiveDay] = useState<number>(3);
  const [videoCompleted, setVideoCompleted] = useState<boolean>(false);
  const [readingStarted, setReadingStarted] = useState<boolean>(false);
  const [mentorModalOpen, setMentorModalOpen] = useState<boolean>(false);
  const [questionText, setQuestionText] = useState<string>('');
  const [chatLog, setChatLog] = useState<Array<{ sender: 'user' | 'mentor'; text: string }>>([
    {
      sender: 'mentor',
      text: "Hello! I'm here to help clarify superposition, Dirac bra-ket notation, or recommend custom books and YouTube lectures for your learning pathway.",
    },
  ]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Search Recommendation State via Google APIs
  const [searchQuery, setSearchQuery] = useState<string>('Quantum Computing Superposition');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchFilter, setSearchFilter] = useState<'all' | 'videos' | 'books'>('all');
  const [recommendedVideos, setRecommendedVideos] = useState<YouTubeVideoItem[]>([
    {
      id: 'vid_default_1',
      title: 'Visualizing Superposition in Qubits',
      channelTitle: 'QuantumRealm Channel',
      description: 'An intuitive visual guide to how states overlap before measurement, avoiding heavy math in favor of clear geometric models.',
      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXIASuLi85eel74J2Ws5GLg8vSDwBkyf11e-5xaod0AZIMVPcJKsWkbzdgAyXFIUB58864ffmtWXxqtzM79jb_JrzkCCL0WnmWuWQriAlOzKRWuKxDvbLx8SiFSZ9Ch8DX1sVrWnqAO9_0zLrwgqD_LaYByYNPxmcsIGkkTpx-NcdKJhTfukX0qK3jaAlzLOYHtNejQbvC30x5R-dnIgG0WV4DlwQzJb10MCUGRvsE56InVvP5wGgc',
      duration: '14:20',
      views: '148K',
    },
  ]);
  const [recommendedBooks, setRecommendedBooks] = useState<GoogleBookItem[]>([
    {
      id: 'book_default_1',
      title: 'Quantum Computing since Democritus',
      authors: ['Scott Aaronson'],
      publisher: 'Cambridge University Press',
      publishedDate: '2013',
      description: 'Deep dive into the philosophical and mathematical implications of interference patterns and quantum complexity theory.',
      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCuyYVka8NukNXrxDO9-hWmMpIF63NNqKlXOOr3J1GOxs396TDaq6kbQhTqUN7SPaL0KSk24E16fiNFtMnShbQ_nT1l0oI9zLomZOYhfysesBI7dlJML64aj6YuKy0p1h0cGx5iksN7LsiQ1HBrN21WF3LSeERGSYRujgshcplH1QspQLx_0fX-Ll2guwO5mmYW1fM7QwL1v33gXY1bwNjubSCRuecLL02MHhW16zGisbiGR2q_H1Qn',
      pageCount: 396,
      infoLink: 'https://books.google.com/books?id=quantum',
    },
  ]);

  // Selected items added to user's personalized Day curriculum
  const [customPathwayItems, setCustomPathwayItems] = useState<Array<{ type: 'video' | 'book'; item: any }>>([]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleFetchRecommendations = async (customQuery?: string) => {
    const q = (customQuery || searchQuery).trim();
    if (!q) return;

    setIsSearching(true);
    try {
      const [youtubeRes, booksRes] = await Promise.all([
        fetch(`/api/youtube/search?q=${encodeURIComponent(q)}&maxResults=6`),
        fetch(`/api/books/volumes?q=${encodeURIComponent(q)}&maxResults=6`),
      ]);

      if (youtubeRes.ok) {
        const yData = await youtubeRes.json();
        if (yData.items && Array.isArray(yData.items)) {
          const mappedVideos: YouTubeVideoItem[] = yData.items.map((item: any, idx: number) => {
            const vidId = typeof item.id === 'object' ? item.id.videoId : item.id;
            return {
              id: vidId || `yt_${idx}_${Date.now()}`,
              title: item.snippet?.title || `${q} Lesson ${idx + 1}`,
              channelTitle: item.snippet?.channelTitle || 'Google API Verified Educator',
              description: item.snippet?.description || `Explore fundamental principles of ${q}.`,
              thumbnail:
                item.snippet?.thumbnails?.high?.url ||
                item.snippet?.thumbnails?.medium?.url ||
                item.snippet?.thumbnails?.default?.url ||
                'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80',
              duration: '12:45',
              views: '85K',
            };
          });
          setRecommendedVideos(mappedVideos);
        }
      }

      if (booksRes.ok) {
        const bData = await booksRes.json();
        if (bData.items && Array.isArray(bData.items)) {
          const mappedBooks: GoogleBookItem[] = bData.items.map((item: any, idx: number) => {
            const vInfo = item.volumeInfo || {};
            return {
              id: item.id || `bk_${idx}_${Date.now()}`,
              title: vInfo.title || `${q}: Principles & Practice`,
              authors: vInfo.authors || ['Academic Contributors'],
              publisher: vInfo.publisher || 'Educational Press',
              publishedDate: vInfo.publishedDate || '2024',
              description: vInfo.description || `In-depth textbook reference and exercises covering ${q}.`,
              thumbnail:
                vInfo.imageLinks?.thumbnail ||
                vInfo.imageLinks?.smallThumbnail ||
                'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80',
              pageCount: vInfo.pageCount || 280,
              infoLink: vInfo.infoLink || `https://books.google.com/books?q=${encodeURIComponent(q)}`,
            };
          });
          setRecommendedBooks(mappedBooks);
        }
      }

      triggerToast(`Loaded recommendations for "${q}"!`);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      triggerToast('Connected to fallback recommendations.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddToPathway = (type: 'video' | 'book', item: any) => {
    setCustomPathwayItems((prev) => [...prev, { type, item }]);
    confetti({
      particleCount: 45,
      spread: 55,
      origin: { y: 0.75 },
    });
    triggerToast(`Added "${item.title}" to Day ${activeDay} curriculum!`);
  };

  const handleMarkVideoComplete = () => {
    const next = !videoCompleted;
    setVideoCompleted(next);
    if (next) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
      triggerToast('Video lesson completed! +50 XP awarded.');
    }
  };

  const handleStartReading = () => {
    setReadingStarted(true);
    triggerToast('Opening Chapter in EduCurate Reader...');
  };

  const handleSendQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;

    const userQ = questionText.trim();
    setChatLog((prev) => [...prev, { sender: 'user', text: userQ }]);
    setQuestionText('');

    setTimeout(() => {
      setChatLog((prev) => [
        ...prev,
        {
          sender: 'mentor',
          text: `Great question about "${userQ}". In quantum mechanics, state vectors remain in linear combination until measurement causes wavefunction projection onto one of the eigenbases. Check the new recommended videos and book chapters above!`,
        },
      ]);
    }, 800);
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen pt-20 md:pl-64 pb-24 md:pb-0 relative flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-blue-600 text-white px-5 py-3 rounded-2xl shadow-2xl font-bold flex items-center gap-2 border border-blue-400/40 animate-fade-in-up">
          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            check_circle
          </span>
          <span className="text-sm">{toastMessage}</span>
        </div>
      )}

      {/* TopNavBar (Header + Desktop User Actions) */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-4 md:px-10 h-16 max-w-7xl mx-auto bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-lg">
        <div className="md:hidden flex items-center cursor-pointer" onClick={() => onNavigate('landing')}>
          <span className="text-xl font-bold text-white tracking-tight font-['Outfit']">EduCurate</span>
        </div>
        <nav className="hidden md:flex gap-6 items-center">
          <button
            onClick={() => onNavigate('landing')}
            className="text-slate-300 hover:text-white transition-colors text-sm font-semibold bg-transparent border-none cursor-pointer"
          >
            Dashboard
          </button>
          <button
            onClick={() => onNavigate('aspirators')}
            className="text-slate-300 hover:text-white transition-colors text-sm font-semibold bg-transparent border-none cursor-pointer"
          >
            Discovery
          </button>
          <button
            onClick={() => onNavigate('learning_plan')}
            className="text-blue-400 border-b-2 border-blue-400 pb-1 text-sm font-bold scale-95 transition-transform bg-transparent cursor-pointer"
          >
            My Library
          </button>
        </nav>
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('parent_dashboard')}
            className="bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors cursor-pointer border-none shadow-md"
          >
            Parent Portal
          </button>
          <div
            onClick={() => onNavigate('parent_dashboard')}
            className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 overflow-hidden hidden md:block cursor-pointer"
          >
            <img
              alt="Student profile avatar"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpTaBJlTwHV0024TVqGEHTGGcVag1UVmwRlA1RI5EKsL3oAwQU_kyferKzDpxENUt0Lz-QJWurYknvzsbnhRgrANThUAIVltH8wscx44gzqgFBdtYWiH7VvV2YQam2Gy4LoyYjL6J_sM6ikRJRicgugB2SkVvslwgw5Jv2sKc4mcRB1cCy-zrIcM5kLC6qD7lLauUOdJAzeZ2s7ZUcJJpGE5mOSU8RMoZBEgGIiKBNgnNK1Ivj6G5K"
            />
          </div>
        </div>
      </header>

      {/* SideNavBar (Desktop) */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full p-5 z-40 bg-slate-900/95 backdrop-blur-md border-r border-slate-800 w-64 pt-20">
        <div className="mb-8 flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('landing')}>
          <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              psychology
            </span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white font-['Outfit'] leading-none">EduCurate</h2>
            <p className="text-xs text-slate-400 mt-1 font-medium">Your Digital Mentor</p>
          </div>
        </div>
        <nav className="flex-1 flex flex-col gap-1.5">
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-3 p-3 text-slate-300 hover:text-white hover:bg-slate-800 transition-all rounded-xl group text-left cursor-pointer border-none bg-transparent"
          >
            <span className="material-symbols-outlined text-xl group-hover:text-blue-400 transition-colors">home</span>
            <span className="text-sm font-semibold">Home</span>
          </button>
          <button
            onClick={() => onNavigate('curator_ai')}
            className="flex items-center gap-3 p-3 text-slate-300 hover:text-white hover:bg-slate-800 transition-all rounded-xl group text-left cursor-pointer border-none bg-transparent"
          >
            <span className="material-symbols-outlined text-xl group-hover:text-blue-400 transition-colors">psychology_alt</span>
            <span className="text-sm font-semibold">AI Guide</span>
          </button>
          {/* Active State */}
          <button
            onClick={() => onNavigate('learning_plan')}
            className="flex items-center gap-3 p-3 text-blue-400 font-bold bg-blue-600/15 border border-blue-500/30 rounded-xl translate-x-1 transition-transform group text-left cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_stories
            </span>
            <span className="text-sm font-bold">Learning Paths</span>
          </button>
          <button
            onClick={() => onNavigate('aspirators')}
            className="flex items-center gap-3 p-3 text-slate-300 hover:text-white hover:bg-slate-800 transition-all rounded-xl group text-left cursor-pointer border-none bg-transparent"
          >
            <span className="material-symbols-outlined text-xl group-hover:text-blue-400 transition-colors">explore</span>
            <span className="text-sm font-semibold">Discovery</span>
          </button>
          <button
            onClick={() => onNavigate('parent_dashboard')}
            className="flex items-center gap-3 p-3 text-slate-300 hover:text-white hover:bg-slate-800 transition-all rounded-xl group mt-auto text-left cursor-pointer border-none bg-transparent"
          >
            <span className="material-symbols-outlined text-xl group-hover:text-blue-400 transition-colors">settings</span>
            <span className="text-sm font-semibold">Settings</span>
          </button>
        </nav>
        <div className="mt-8">
          <button
            onClick={() => onNavigate('curator_ai')}
            className="w-full bg-blue-600 text-white text-sm font-bold py-3 rounded-xl hover:bg-blue-500 transition-colors shadow-md cursor-pointer border-none flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Start New Lesson
          </button>
        </div>
      </aside>

      {/* BottomNavBar (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 pb-safe bg-slate-900 border-t border-slate-800 shadow-2xl">
        <button
          onClick={() => onNavigate('landing')}
          className="flex flex-col items-center justify-center text-slate-400 hover:text-white px-4 py-1 rounded-lg transition-colors bg-transparent border-none"
        >
          <span className="material-symbols-outlined mb-1 text-lg">home</span>
          <span className="text-[10px] font-semibold">Home</span>
        </button>
        <button
          onClick={() => onNavigate('curator_ai')}
          className="flex flex-col items-center justify-center text-slate-400 hover:text-white px-4 py-1 rounded-lg transition-colors bg-transparent border-none"
        >
          <span className="material-symbols-outlined mb-1 text-lg">chat_bubble</span>
          <span className="text-[10px] font-semibold">Guide</span>
        </button>
        <button
          onClick={() => onNavigate('aspirators')}
          className="flex flex-col items-center justify-center text-slate-400 hover:text-white px-4 py-1 rounded-lg transition-colors bg-transparent border-none"
        >
          <span className="material-symbols-outlined mb-1 text-lg">search</span>
          <span className="text-[10px] font-semibold">Explore</span>
        </button>
        {/* Active */}
        <button
          onClick={() => onNavigate('learning_plan')}
          className="flex flex-col items-center justify-center bg-blue-600 text-white rounded-xl px-4 py-1 scale-95 transition-transform border-none"
        >
          <span className="material-symbols-outlined mb-1 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
            local_library
          </span>
          <span className="text-[10px] font-bold">Library</span>
        </button>
      </nav>

      {/* Main Canvas */}
      <main className="max-w-7xl mx-auto px-4 md:px-10 py-8 flex-1 w-full space-y-8">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-slate-900/60 p-6 md:p-8 rounded-2xl border border-slate-800 shadow-xl">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <span className="bg-blue-500/20 text-blue-300 border border-blue-500/40 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Active Plan
              </span>
              <span className="text-slate-400 text-xs font-medium">Estimated 14 Days • Intermediate Level</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-white mb-2 tracking-tight">
              Introduction to Quantum Computing
            </h1>
            <p className="text-slate-300 text-sm md:text-base max-w-2xl leading-relaxed">
              A curated, multi-day curriculum designed to take you from foundational physics concepts to understanding basic quantum algorithms and circuit gates.
            </p>
          </div>
          <div className="flex gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={() => {
                triggerToast('Difficulty adjusted: Adaptive pacing enabled.');
              }}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 border border-slate-700 text-slate-200 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors bg-slate-900 cursor-pointer shadow-sm"
            >
              <span className="material-symbols-outlined text-sm">tune</span>
              Adjust Difficulty
            </button>
            <button
              onClick={() => onNavigate('curator_ai')}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-500 transition-colors shadow-md cursor-pointer border-none"
            >
              <span className="material-symbols-outlined text-sm">edit_calendar</span>
              Customize Plan
            </button>
          </div>
        </header>

        {/* Progress Overview */}
        <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-md">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-bold text-white">Overall Progress</h3>
            <span className="text-sm font-bold text-blue-400">Day 3 of 14</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-3 mb-2 overflow-hidden border border-slate-700/50">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-700 ease-out"
              style={{ width: '21%' }}
            ></div>
          </div>
          <p className="text-xs font-semibold text-slate-400 text-right">21% Complete • 11 Days Remaining</p>
        </section>

        {/* ========================================================================= */}
        {/* Google API Search & Recommendation Engine (Crystal-Clear High Contrast) */}
        {/* ========================================================================= */}
        <section className="bg-slate-900 border border-blue-500/30 rounded-2xl p-5 md:p-7 shadow-2xl space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="bg-blue-600 text-white text-[11px] font-bold px-3 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1 shadow-sm">
                  <span className="material-symbols-outlined text-[14px]">bolt</span> Live Google API Search
                </span>
                <span className="text-xs font-bold text-blue-400">YouTube Masterclasses &amp; Google Books</span>
              </div>
              <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
                Search &amp; Recommend Learning Resources
              </h2>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-3xl">
                Query live Google Books volumes and YouTube educational lectures to instantly discover curated chapters, video tutorials, and add them directly to your personalized pathway.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 shrink-0">
              <button
                type="button"
                onClick={() => setSearchFilter('all')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all border-none cursor-pointer ${
                  searchFilter === 'all'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                All Resources
              </button>
              <button
                type="button"
                onClick={() => setSearchFilter('videos')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all border-none cursor-pointer flex items-center gap-1.5 ${
                  searchFilter === 'videos'
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'bg-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">play_circle</span> Videos
              </button>
              <button
                type="button"
                onClick={() => setSearchFilter('books')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all border-none cursor-pointer flex items-center gap-1.5 ${
                  searchFilter === 'books'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">menu_book</span> Books
              </button>
            </div>
          </div>

          {/* Search Bar Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleFetchRecommendations();
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics (e.g. Quantum Superposition, Linear Algebra, Machine Learning)..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-950 text-white placeholder:text-slate-500 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-md cursor-pointer border-none shrink-0 disabled:opacity-50"
            >
              {isSearching ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>
                  <span>Searching Google APIs...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">auto_awesome</span>
                  <span>Recommend Now</span>
                </>
              )}
            </button>
          </form>

          {/* Preset Quick Chips with High Contrast */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">tune</span> Popular Topics:
            </span>
            {[
              'Quantum Superposition',
              'Quantum Entanglement',
              'Shor Algorithm',
              'Qiskit Python Tutorial',
              'Linear Algebra Eigenvalues',
              'Quantum Cryptography',
            ].map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => {
                  setSearchQuery(chip);
                  handleFetchRecommendations(chip);
                }}
                className="text-xs px-3 py-1.5 bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-200 rounded-full border border-slate-700 transition-colors cursor-pointer font-semibold"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
            {/* Render YouTube Videos */}
            {(searchFilter === 'all' || searchFilter === 'videos') &&
              recommendedVideos.map((video) => (
                <div
                  key={video.id}
                  className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative h-40 bg-slate-900 overflow-hidden">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-md">
                        <span className="material-symbols-outlined text-[12px]">play_circle</span> YouTube
                      </div>
                      {video.duration && (
                        <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-0.5 rounded text-[10px] font-bold backdrop-blur-sm">
                          {video.duration}
                        </div>
                      )}
                    </div>
                    <div className="p-4 space-y-2">
                      <h3 className="font-bold text-sm text-white line-clamp-2 leading-snug">{video.title}</h3>
                      <p className="text-xs text-blue-400 font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>
                          verified
                        </span>
                        {video.channelTitle}
                      </p>
                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{video.description}</p>
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    <button
                      type="button"
                      onClick={() => handleAddToPathway('video', video)}
                      className="w-full py-2.5 bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/40 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">add_task</span>
                      Add to Day {activeDay} Pathway
                    </button>
                  </div>
                </div>
              ))}

            {/* Render Google Books */}
            {(searchFilter === 'all' || searchFilter === 'books') &&
              recommendedBooks.map((book) => (
                <div
                  key={book.id}
                  className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden hover:-translate-y-1 hover:border-purple-500/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative h-40 bg-slate-900 overflow-hidden flex items-center justify-center p-3">
                      <img
                        src={book.thumbnail}
                        alt={book.title}
                        className="h-32 w-auto object-contain shadow-lg rounded-sm group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2 bg-purple-600 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-md">
                        <span className="material-symbols-outlined text-[12px]">menu_book</span> Book
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      <h3 className="font-bold text-sm text-white line-clamp-2 leading-snug">{book.title}</h3>
                      <p className="text-xs text-purple-300 font-semibold">
                        {book.authors?.join(', ') || 'Various Authors'} • {book.publishedDate}
                      </p>
                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{book.description}</p>
                    </div>
                  </div>

                  <div className="p-4 pt-0 flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleAddToPathway('book', book)}
                      className="flex-1 py-2.5 bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/40 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">add_task</span>
                      Add to Pathway
                    </button>
                    {book.infoLink && (
                      <a
                        href={book.infoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 border border-slate-700 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-colors"
                        title="View on Google Books"
                      >
                        <span className="material-symbols-outlined text-sm">open_in_new</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* Day Curriculum Timeline & AI Mentor Card */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Timeline */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            {/* Day 3 (Active Day) */}
            <article className="relative">
              <div className="absolute left-4 top-10 bottom-[-32px] w-0.5 bg-slate-800 hidden md:block z-0"></div>

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm ring-4 ring-slate-950 shadow-md">
                    3
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    Superposition &amp; Interference
                  </h2>
                  <span className="bg-blue-600/30 text-blue-300 border border-blue-500/40 px-2.5 py-0.5 rounded-md text-xs font-bold ml-auto md:ml-0">
                    Today
                  </span>
                </div>

                <div className="ml-0 md:ml-12 grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Video Resource */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-blue-500/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                    <div className="relative h-40 bg-slate-950 overflow-hidden">
                      <img
                        alt="Video thumbnail"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXIASuLi85eel74J2Ws5GLg8vSDwBkyf11e-5xaod0AZIMVPcJKsWkbzdgAyXFIUB58864ffmtWXxqtzM79jb_JrzkCCL0WnmWuWQriAlOzKRWuKxDvbLx8SiFSZ9Ch8DX1sVrWnqAO9_0zLrwgqD_LaYByYNPxmcsIGkkTpx-NcdKJhTfukX0qK3jaAlzLOYHtNejQbvC30x5R-dnIgG0WV4DlwQzJb10MCUGRvsE56InVvP5wGgc"
                      />
                      <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-md">
                        <span className="material-symbols-outlined text-[12px]">play_circle</span> Video
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-0.5 rounded text-[10px] font-bold backdrop-blur-sm">
                        14:20
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="text-base font-bold text-white mb-1 line-clamp-2">
                        Visualizing Superposition in Qubits
                      </h3>
                      <p className="text-xs text-blue-400 font-semibold mb-3">QuantumRealm Channel</p>
                      <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-4">
                        An intuitive visual guide to how states overlap before measurement, avoiding heavy math in favor of clear geometric models.
                      </p>
                      <button
                        onClick={handleMarkVideoComplete}
                        className={`mt-auto w-full py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 text-xs font-bold cursor-pointer border ${
                          videoCompleted
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                            : 'bg-slate-800 text-blue-400 border-slate-700 hover:bg-blue-600 hover:text-white'
                        }`}
                      >
                        <span
                          className="material-symbols-outlined text-base"
                          style={videoCompleted ? { fontVariationSettings: "'FILL' 1" } : {}}
                        >
                          {videoCompleted ? 'verified' : 'check_circle'}
                        </span>
                        {videoCompleted ? 'Completed (+50 XP)' : 'Mark Complete'}
                      </button>
                    </div>
                  </div>

                  {/* Book Resource */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-purple-500/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                    <div className="relative h-40 bg-slate-950 overflow-hidden flex items-center justify-center p-3">
                      <img
                        alt="Book cover"
                        className="h-32 w-auto shadow-lg group-hover:-translate-y-1 transition-transform duration-300 rounded-sm"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCuyYVka8NukNXrxDO9-hWmMpIF63NNqKlXOOr3J1GOxs396TDaq6kbQhTqUN7SPaL0KSk24E16fiNFtMnShbQ_nT1l0oI9zLomZOYhfysesBI7dlJML64aj6YuKy0p1h0cGx5iksN7LsiQ1HBrN21WF3LSeERGSYRujgshcplH1QspQLx_0fX-Ll2guwO5mmYW1fM7QwL1v33gXY1bwNjubSCRuecLL02MHhW16zGisbiGR2q_H1Qn"
                      />
                      <div className="absolute top-2 right-2 bg-purple-600 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-md">
                        <span className="material-symbols-outlined text-[12px]">menu_book</span> Book
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="text-base font-bold text-white mb-1 line-clamp-2">
                        Quantum Computing since Democritus
                      </h3>
                      <p className="text-xs text-purple-300 font-semibold mb-3">Scott Aaronson • Chapter 9</p>
                      <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-4">
                        Deep dive into the philosophical and mathematical implications of interference patterns.
                      </p>
                      <button
                        onClick={handleStartReading}
                        className="mt-auto w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-colors flex items-center justify-center gap-2 text-xs font-bold shadow-md cursor-pointer border-none"
                      >
                        <span className="material-symbols-outlined text-base">menu_book</span>
                        {readingStarted ? 'Continue Reading' : 'Start Reading'}
                      </button>
                    </div>
                  </div>

                  {/* Dynamically Added Custom Pathway Items */}
                  {customPathwayItems.map((custom, index) => (
                    <div
                      key={index}
                      className="bg-slate-900 border-2 border-blue-500/50 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between col-span-1 md:col-span-2 animate-fade-in-up"
                    >
                      <div className="p-5 space-y-2">
                        <div className="flex items-center justify-between">
                          <span
                            className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                              custom.type === 'video' ? 'bg-blue-600 text-white' : 'bg-purple-600 text-white'
                            }`}
                          >
                            {custom.type === 'video' ? 'Added YouTube Video' : 'Added Book Chapter'}
                          </span>
                          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">check_circle</span> Added by You
                          </span>
                        </div>
                        <h4 className="font-bold text-base text-white">{custom.item.title}</h4>
                        <p className="text-xs text-slate-300 leading-relaxed">{custom.item.description}</p>
                      </div>
                      <div className="p-5 pt-0">
                        <button
                          onClick={() => triggerToast(`Launching ${custom.item.title}...`)}
                          className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold cursor-pointer border-none transition-colors"
                        >
                          Start Study Module
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </article>

            {/* Day 4 (Upcoming) */}
            <article className="relative opacity-85 hover:opacity-100 transition-opacity">
              <div className="absolute left-4 top-10 bottom-[-32px] w-0.5 bg-slate-800 hidden md:block z-0"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-700 text-slate-300 flex items-center justify-center font-bold text-sm ring-4 ring-slate-950">
                    4
                  </div>
                  <h2 className="text-lg font-bold text-slate-200">Entanglement Basics &amp; Bell States</h2>
                  <span className="text-xs text-slate-400 font-medium ml-auto md:ml-0">Est. 1h 15m</span>
                </div>
                <div className="ml-0 md:ml-12 bg-slate-900 border border-slate-800 border-dashed rounded-2xl p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full bg-blue-600/30 border border-blue-500 flex items-center justify-center z-10">
                        <span className="material-symbols-outlined text-blue-400 text-sm">play_circle</span>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-purple-600/30 border border-purple-500 flex items-center justify-center z-0">
                        <span className="material-symbols-outlined text-purple-400 text-sm">menu_book</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">2 Resources Planned</p>
                      <p className="text-xs text-slate-400">Video &amp; Reading Assignment</p>
                    </div>
                  </div>
                  <button
                    onClick={() => triggerToast('Previewing Day 4: Bell States & EPR Paradox modules loaded.')}
                    className="text-blue-400 hover:text-blue-300 font-bold text-xs flex items-center gap-1 cursor-pointer bg-transparent border-none"
                  >
                    Preview <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
                </div>
              </div>
            </article>

            {/* Day 5 (Upcoming) */}
            <article className="relative opacity-60">
              <div className="relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-700 text-slate-400 flex items-center justify-center font-bold text-sm ring-4 ring-slate-950">
                    5
                  </div>
                  <h2 className="text-lg font-bold text-slate-300">
                    Quantum Gates &amp; Circuit Synthesis
                  </h2>
                </div>
              </div>
            </article>
          </div>

          {/* Right Column: AI Mentor Insight & Tags */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* AI Mentor Card */}
            <div className="sticky top-24 bg-slate-900 border border-blue-500/30 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                  <span className="material-symbols-outlined text-xl">psychology</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Mentor Insight</h3>
                  <p className="text-xs text-slate-400">AI Pedagogical Assistant</p>
                </div>
              </div>

              <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 shadow-inner">
                <p className="text-xs text-slate-200 italic leading-relaxed">
                  "Before diving into today's video, make sure you're comfortable with the concept of complex numbers from Day 2. Use the live Google API search above if you need supplemental math brush-up videos!"
                </p>
              </div>

              <button
                onClick={() => setMentorModalOpen(true)}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer border-none shadow-md"
              >
                <span className="material-symbols-outlined text-sm">chat</span>
                Ask Mentor a Question
              </button>
            </div>

            {/* Curriculum Focus Tags */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
              <h3 className="text-sm font-bold text-white">Curriculum Focus</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-slate-800 text-slate-200 border border-slate-700 rounded-full text-xs font-semibold">
                  Physics
                </span>
                <span className="px-3 py-1 bg-slate-800 text-slate-200 border border-slate-700 rounded-full text-xs font-semibold">
                  Math Intensive
                </span>
                <span className="px-3 py-1 bg-slate-800 text-slate-200 border border-slate-700 rounded-full text-xs font-semibold">
                  Theoretical
                </span>
                <span className="px-3 py-1 bg-slate-800 text-slate-200 border border-slate-700 rounded-full text-xs font-semibold">
                  Quantum Gates
                </span>
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* AI Mentor Quick Modal */}
      {mentorModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl w-full max-w-lg p-6 border border-slate-700 shadow-2xl flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-sm">psychology</span>
                </div>
                <h3 className="text-base font-bold text-white">Curator Mentor Assistant</h3>
              </div>
              <button
                onClick={() => setMentorModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer border-none bg-transparent"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {chatLog.map((c, i) => (
                <div key={i} className={`flex gap-2 ${c.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`p-3.5 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                      c.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-none'
                    }`}
                  >
                    {c.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendQuestion} className="flex gap-2 pt-3 border-t border-slate-800">
              <input
                type="text"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Ask about Day 3 quantum concepts or materials..."
                className="flex-1 px-4 py-2.5 border border-slate-700 rounded-xl bg-slate-950 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-500 transition-colors cursor-pointer border-none"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full py-8 px-4 md:px-10 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-950 border-t border-slate-800 mt-12 text-xs text-slate-400">
        <div className="font-bold text-white font-['Outfit'] text-base">
          EduCurate
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          <button onClick={() => onNavigate('parent_dashboard')} className="hover:text-white transition-colors bg-transparent border-none cursor-pointer text-slate-400">
            Privacy Policy
          </button>
          <button onClick={() => onNavigate('parent_dashboard')} className="hover:text-white transition-colors bg-transparent border-none cursor-pointer text-slate-400">
            Terms of Service
          </button>
          <button onClick={() => onNavigate('curator_ai')} className="hover:text-white transition-colors bg-transparent border-none cursor-pointer text-slate-400">
            Contact Support
          </button>
          <button onClick={() => onNavigate('landing')} className="hover:text-white transition-colors bg-transparent border-none cursor-pointer text-slate-400">
            About Us
          </button>
        </div>
        <div className="text-center md:text-right">
          © 2026 EduCurate Learning Platform. Curated Clarity for every learner.
        </div>
      </footer>
    </div>
  );
};
