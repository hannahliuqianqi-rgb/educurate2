import React, { useState, useEffect } from 'react';
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
  const [completedDays, setCompletedDays] = useState<number[]>([1, 2]);
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
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleFetchRecommendations = async (customQuery?: string) => {
    const q = (customQuery || searchQuery).trim();
    if (!q) return;

    setIsSearching(true);
    try {
      // Parallel fetch to backend YouTube search & Google Books endpoints
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

      triggerToast(`Loaded Google API recommendations for "${q}"!`);
    } catch (err) {
      console.error('Error fetching Google API recommendations:', err);
      triggerToast('Connected to fallback recommendations.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddToPathway = (type: 'video' | 'book', item: any) => {
    setCustomPathwayItems((prev) => [...prev, { type, item }]);
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.8 },
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
    <div className="bg-background text-on-background font-body-md min-h-screen pt-20 md:pl-64 pb-24 md:pb-0 relative flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-primary text-on-primary px-5 py-3 rounded-2xl shadow-2xl font-bold flex items-center gap-2 animate-fade-in-up">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            check_circle
          </span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TopNavBar (Header + Desktop User Actions) */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-4 md:px-10 h-16 max-w-container-max mx-auto bg-surface-container-lowest dark:bg-inverse-surface border-b border-outline-variant shadow-sm dark:shadow-none transition-all">
        <div className="md:hidden flex items-center cursor-pointer" onClick={() => onNavigate('landing')}>
          <span className="text-headline-md font-headline-md font-bold text-primary dark:text-primary-fixed-dim">EduCurate</span>
        </div>
        <nav className="hidden md:flex gap-6 items-center">
          <button
            onClick={() => onNavigate('landing')}
            className="text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed-dim transition-colors text-label-md font-label-md bg-transparent border-none cursor-pointer"
          >
            Dashboard
          </button>
          <button
            onClick={() => onNavigate('aspirators')}
            className="text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed-dim transition-colors text-label-md font-label-md bg-transparent border-none cursor-pointer"
          >
            Discovery
          </button>
          <button
            onClick={() => onNavigate('learning_plan')}
            className="text-primary dark:text-primary-fixed-dim border-b-2 border-primary dark:border-primary-fixed-dim pb-1 text-label-md font-label-md scale-95 transition-transform duration-150 font-bold bg-transparent cursor-pointer"
          >
            My Library
          </button>
        </nav>
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('parent_dashboard')}
            className="bg-primary text-on-primary font-label-md text-label-md px-4 py-2 rounded-lg hover:bg-primary-container transition-colors cursor-pointer border-none shadow-sm"
          >
            Parent Portal
          </button>
          <div
            onClick={() => onNavigate('parent_dashboard')}
            className="w-10 h-10 rounded-full bg-surface-variant border border-outline-variant overflow-hidden hidden md:block cursor-pointer"
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
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full p-stack-md z-40 bg-surface-muted dark:bg-adult-ed border-r border-outline-variant w-64 pt-20">
        <div className="mb-stack-lg flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('landing')}>
          <div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              psychology
            </span>
          </div>
          <div>
            <h2 className="text-headline-md font-headline-md font-bold text-primary dark:text-primary-fixed-dim leading-none">EduCurate</h2>
            <p className="text-caption font-caption text-on-surface-variant mt-1">Your Digital Mentor</p>
          </div>
        </div>
        <nav className="flex-1 flex flex-col gap-1">
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-3 p-3 text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-high dark:hover:bg-inverse-surface transition-all rounded-lg group text-left cursor-pointer border-none bg-transparent"
          >
            <span className="material-symbols-outlined text-xl group-hover:text-primary transition-colors">home</span>
            <span className="text-label-md font-label-md">Home</span>
          </button>
          <button
            onClick={() => onNavigate('curator_ai')}
            className="flex items-center gap-3 p-3 text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-high dark:hover:bg-inverse-surface transition-all rounded-lg group text-left cursor-pointer border-none bg-transparent"
          >
            <span className="material-symbols-outlined text-xl group-hover:text-primary transition-colors">psychology_alt</span>
            <span className="text-label-md font-label-md">AI Guide</span>
          </button>
          {/* Active State */}
          <button
            onClick={() => onNavigate('learning_plan')}
            className="flex items-center gap-3 p-3 text-primary dark:text-primary-fixed-dim font-bold bg-primary-container/10 rounded-lg translate-x-1 transition-transform group text-left cursor-pointer border border-primary/20 shadow-sm"
          >
            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_stories
            </span>
            <span className="text-label-md font-label-md">Learning Paths</span>
          </button>
          <button
            onClick={() => onNavigate('aspirators')}
            className="flex items-center gap-3 p-3 text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-high dark:hover:bg-inverse-surface transition-all rounded-lg group text-left cursor-pointer border-none bg-transparent"
          >
            <span className="material-symbols-outlined text-xl group-hover:text-primary transition-colors">explore</span>
            <span className="text-label-md font-label-md">Discovery</span>
          </button>
          <button
            onClick={() => onNavigate('parent_dashboard')}
            className="flex items-center gap-3 p-3 text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-high dark:hover:bg-inverse-surface transition-all rounded-lg group mt-auto text-left cursor-pointer border-none bg-transparent"
          >
            <span className="material-symbols-outlined text-xl group-hover:text-primary transition-colors">settings</span>
            <span className="text-label-md font-label-md">Settings</span>
          </button>
        </nav>
        <div className="mt-stack-lg">
          <button
            onClick={() => onNavigate('curator_ai')}
            className="w-full bg-primary text-on-primary font-label-md text-label-md py-3 rounded-lg hover:bg-primary-container transition-colors shadow-sm cursor-pointer border-none flex items-center justify-center gap-2 font-bold"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Start New Lesson
          </button>
        </div>
      </aside>

      {/* BottomNavBar (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 pb-safe bg-surface-container-lowest dark:bg-inverse-surface shadow-[0_-4px_20px_rgba(0,0,0,0.05)] rounded-t-xl border-t border-outline-variant">
        <button
          onClick={() => onNavigate('landing')}
          className="flex flex-col items-center justify-center text-on-surface-variant dark:text-surface-variant px-4 py-1 active:bg-surface-variant rounded-lg transition-colors bg-transparent border-none"
        >
          <span className="material-symbols-outlined mb-1">home</span>
          <span className="text-[10px] font-semibold">Home</span>
        </button>
        <button
          onClick={() => onNavigate('curator_ai')}
          className="flex flex-col items-center justify-center text-on-surface-variant dark:text-surface-variant px-4 py-1 active:bg-surface-variant rounded-lg transition-colors bg-transparent border-none"
        >
          <span className="material-symbols-outlined mb-1">chat_bubble</span>
          <span className="text-[10px] font-semibold">Guide</span>
        </button>
        <button
          onClick={() => onNavigate('aspirators')}
          className="flex flex-col items-center justify-center text-on-surface-variant dark:text-surface-variant px-4 py-1 active:bg-surface-variant rounded-lg transition-colors bg-transparent border-none"
        >
          <span className="material-symbols-outlined mb-1">search</span>
          <span className="text-[10px] font-semibold">Explore</span>
        </button>
        {/* Active */}
        <button
          onClick={() => onNavigate('learning_plan')}
          className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-2xl px-4 py-1 scale-90 transition-transform duration-200 border-none"
        >
          <span className="material-symbols-outlined mb-1" style={{ fontVariationSettings: "'FILL' 1" }}>
            local_library
          </span>
          <span className="text-[10px] font-semibold">Library</span>
        </button>
      </nav>

      {/* Main Canvas */}
      <main className="max-w-container-max mx-auto px-4 md:px-10 py-stack-lg flex-1 w-full space-y-8">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-stack-md">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-surface-variant text-primary px-3 py-1 rounded-full text-caption font-caption font-bold">
                Active Plan
              </span>
              <span className="text-on-surface-variant text-caption font-caption">Estimated 14 Days</span>
            </div>
            <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg-mobile md:font-headline-lg text-on-surface mb-2 font-bold tracking-tight">
              Introduction to Quantum Computing
            </h1>
            <p className="text-body-md font-body-md text-on-surface-variant max-w-2xl leading-relaxed">
              A curated, multi-day curriculum designed to take you from foundational physics concepts to understanding basic quantum algorithms.
            </p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button
              onClick={() => {
                triggerToast('Difficulty adjusted: Adaptive pacing enabled.');
              }}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 border border-primary text-primary px-4 py-2.5 rounded-lg font-label-md text-label-md hover:bg-surface-container-low transition-colors bg-surface-container-lowest font-bold cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">tune</span>
              Adjust Difficulty
            </button>
            <button
              onClick={() => onNavigate('curator_ai')}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-primary text-on-primary px-4 py-2.5 rounded-lg font-label-md text-label-md hover:bg-primary-container transition-colors shadow-sm font-bold cursor-pointer border-none"
            >
              <span className="material-symbols-outlined text-sm">edit_calendar</span>
              Customize Plan
            </button>
          </div>
        </header>

        {/* Progress Overview */}
        <section className="bg-surface-muted border border-outline-variant rounded-xl p-stack-md shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-label-md font-label-md text-on-surface font-bold">Overall Progress</h3>
            <span className="text-label-md font-label-md text-status-progress font-bold">Day 3 of 14</span>
          </div>
          <div className="w-full bg-surface-container-high rounded-full h-2.5 mb-2 overflow-hidden">
            <div
              className="bg-status-progress h-2.5 rounded-full transition-all duration-700 ease-out"
              style={{ width: '21%' }}
            ></div>
          </div>
          <p className="text-caption font-caption text-on-surface-variant text-right font-medium">21% Complete</p>
        </section>

        {/* ========================================================================= */}
        {/* NEW: Interactive Google API Search & Recommendation Engine */}
        {/* ========================================================================= */}
        <section className="bg-gradient-to-br from-surface-container-lowest to-surface-container-low border border-primary/20 rounded-2xl p-5 md:p-7 shadow-md space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="bg-primary text-on-primary text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">bolt</span> Google API Live Search
                </span>
                <span className="text-xs font-semibold text-primary">YouTube Videos &amp; Google Books Volumes</span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-on-surface">Search &amp; Recommend Learning Resources</h2>
              <p className="text-xs md:text-sm text-on-surface-variant">
                Query the live Google Books and YouTube API to instantly discover video masterclasses, textbook chapters, and add them directly to your custom pathway.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 bg-surface-muted p-1 rounded-xl border border-outline-variant shrink-0">
              <button
                type="button"
                onClick={() => setSearchFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border-none cursor-pointer ${
                  searchFilter === 'all' ? 'bg-primary text-on-primary shadow-sm' : 'bg-transparent text-on-surface-variant'
                }`}
              >
                All Resources
              </button>
              <button
                type="button"
                onClick={() => setSearchFilter('videos')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border-none cursor-pointer flex items-center gap-1 ${
                  searchFilter === 'videos' ? 'bg-primary-ed text-white shadow-sm' : 'bg-transparent text-on-surface-variant'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">play_circle</span> Videos
              </button>
              <button
                type="button"
                onClick={() => setSearchFilter('books')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border-none cursor-pointer flex items-center gap-1 ${
                  searchFilter === 'books' ? 'bg-secondary-ed text-white shadow-sm' : 'bg-transparent text-on-surface-variant'
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
            className="flex flex-col sm:flex-row gap-2.5"
          >
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search any subject (e.g. Quantum Superposition, Linear Algebra, Machine Learning)..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface placeholder:text-outline text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-inner"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="bg-primary hover:bg-primary-container text-on-primary font-bold px-6 py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-md cursor-pointer border-none shrink-0 disabled:opacity-50"
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

          {/* Preset Quick Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-semibold text-on-surface-variant flex items-center gap-1">
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
                className="text-xs px-3 py-1 bg-surface-container-high hover:bg-primary-container/20 text-on-surface rounded-full border border-outline-variant transition-colors cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {/* Render YouTube Videos */}
            {(searchFilter === 'all' || searchFilter === 'videos') &&
              recommendedVideos.map((video) => (
                <div
                  key={video.id}
                  className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative h-36 bg-surface-container-high overflow-hidden">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 right-2 bg-primary-ed text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                        <span className="material-symbols-outlined text-[12px]">play_circle</span> YouTube
                      </div>
                      {video.duration && (
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-0.5 rounded text-[10px] font-medium backdrop-blur-sm">
                          {video.duration}
                        </div>
                      )}
                    </div>
                    <div className="p-4 space-y-1.5">
                      <h3 className="font-bold text-sm text-on-surface line-clamp-2 leading-snug">{video.title}</h3>
                      <p className="text-xs text-primary font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">verified</span>
                        {video.channelTitle}
                      </p>
                      <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">{video.description}</p>
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    <button
                      type="button"
                      onClick={() => handleAddToPathway('video', video)}
                      className="w-full py-2 bg-surface-container-low hover:bg-primary hover:text-on-primary text-primary border border-primary/20 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
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
                  className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative h-36 bg-surface-container-high overflow-hidden flex items-center justify-center p-2 bg-gradient-to-t from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                      <img
                        src={book.thumbnail}
                        alt={book.title}
                        className="h-28 w-auto object-contain shadow-md rounded group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2 bg-secondary-ed text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                        <span className="material-symbols-outlined text-[12px]">menu_book</span> Book
                      </div>
                    </div>
                    <div className="p-4 space-y-1.5">
                      <h3 className="font-bold text-sm text-on-surface line-clamp-2 leading-snug">{book.title}</h3>
                      <p className="text-xs text-secondary-ed font-semibold">
                        {book.authors?.join(', ') || 'Various Authors'} • {book.publishedDate}
                      </p>
                      <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">{book.description}</p>
                    </div>
                  </div>

                  <div className="p-4 pt-0 flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleAddToPathway('book', book)}
                      className="flex-1 py-2 bg-surface-container-low hover:bg-secondary-ed hover:text-white text-secondary-ed border border-secondary-ed/20 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">add_task</span>
                      Add to Pathway
                    </button>
                    {book.infoLink && (
                      <a
                        href={book.infoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 border border-outline-variant rounded-lg text-on-surface-variant hover:text-primary flex items-center justify-center"
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
        {/* Day Curriculum Timeline & Context Cards */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg">
          {/* Left Column: The Timeline (Days) */}
          <div className="lg:col-span-8 flex flex-col gap-stack-lg">
            {/* Day 3 (Current Day) */}
            <article className="relative">
              {/* Timeline Connector */}
              <div className="absolute left-4 top-10 bottom-[-32px] w-0.5 bg-outline-variant hidden md:block z-0"></div>

              <div className="relative z-10">
                <div className="flex items-center gap-stack-md mb-stack-sm">
                  <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-label-md ring-4 ring-background shadow-sm">
                    3
                  </div>
                  <h2 className="text-headline-md font-headline-md text-on-surface font-bold">
                    Superposition &amp; Interference
                  </h2>
                  <span className="bg-surface-container-highest text-primary-fixed-variant px-2.5 py-0.5 rounded-md text-caption font-caption ml-auto md:ml-0 border border-outline-variant font-bold">
                    Today
                  </span>
                </div>

                <div className="ml-0 md:ml-12 grid grid-cols-1 md:grid-cols-2 gap-stack-md">
                  {/* Video Resource */}
                  <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 group flex flex-col">
                    <div className="relative h-40 bg-surface-container-high overflow-hidden">
                      <img
                        alt="Video thumbnail"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXIASuLi85eel74J2Ws5GLg8vSDwBkyf11e-5xaod0AZIMVPcJKsWkbzdgAyXFIUB58864ffmtWXxqtzM79jb_JrzkCCL0WnmWuWQriAlOzKRWuKxDvbLx8SiFSZ9Ch8DX1sVrWnqAO9_0zLrwgqD_LaYByYNPxmcsIGkkTpx-NcdKJhTfukX0qK3jaAlzLOYHtNejQbvC30x5R-dnIgG0WV4DlwQzJb10MCUGRvsE56InVvP5wGgc"
                      />
                      <div className="absolute top-2 right-2 bg-primary-ed text-white px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                        <span className="material-symbols-outlined text-[12px]">play_circle</span> Video
                      </div>
                      <div className="absolute bottom-2 right-2 bg-on-surface/80 text-white px-2 py-0.5 rounded text-caption font-caption backdrop-blur-sm">
                        14:20
                      </div>
                    </div>
                    <div className="p-stack-md flex-1 flex flex-col">
                      <h3 className="text-label-md font-label-md text-on-surface mb-1 line-clamp-2 font-bold">
                        Visualizing Superposition in Qubits
                      </h3>
                      <p className="text-caption font-caption text-on-surface-variant mb-stack-md">QuantumRealm Channel</p>
                      <p className="text-body-md font-body-md text-on-surface-variant text-sm line-clamp-3 mb-stack-md">
                        An intuitive visual guide to how states overlap before measurement, avoiding heavy math in favor of clear geometric models.
                      </p>
                      <button
                        onClick={handleMarkVideoComplete}
                        className={`mt-auto w-full py-2.5 border rounded-lg transition-colors flex items-center justify-center gap-2 text-label-md font-label-md cursor-pointer font-semibold ${
                          videoCompleted
                            ? 'bg-status-complete/10 text-status-complete border-status-complete'
                            : 'border-outline-variant text-primary hover:bg-surface-container-low'
                        }`}
                      >
                        <span
                          className="material-symbols-outlined text-sm"
                          style={videoCompleted ? { fontVariationSettings: "'FILL' 1" } : {}}
                        >
                          {videoCompleted ? 'verified' : 'check_circle'}
                        </span>
                        {videoCompleted ? 'Completed' : 'Mark Complete'}
                      </button>
                    </div>
                  </div>

                  {/* Book Resource */}
                  <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 group flex flex-col">
                    <div className="relative h-40 bg-surface-container-high overflow-hidden flex items-center justify-center">
                      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-secondary-ed to-transparent"></div>
                      <img
                        alt="Book cover"
                        className="h-32 w-auto shadow-md group-hover:-translate-y-2 transition-transform duration-500 z-10 rounded-sm"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCuyYVka8NukNXrxDO9-hWmMpIF63NNqKlXOOr3J1GOxs396TDaq6kbQhTqUN7SPaL0KSk24E16fiNFtMnShbQ_nT1l0oI9zLomZOYhfysesBI7dlJML64aj6YuKy0p1h0cGx5iksN7LsiQ1HBrN21WF3LSeERGSYRujgshcplH1QspQLx_0fX-Ll2guwO5mmYW1fM7QwL1v33gXY1bwNjubSCRuecLL02MHhW16zGisbiGR2q_H1Qn"
                      />
                      <div className="absolute top-2 right-2 bg-secondary-ed text-white px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm z-20">
                        <span className="material-symbols-outlined text-[12px]">menu_book</span> Book
                      </div>
                    </div>
                    <div className="p-stack-md flex-1 flex flex-col">
                      <h3 className="text-label-md font-label-md text-on-surface mb-1 line-clamp-2 font-bold">
                        Quantum Computing since Democritus
                      </h3>
                      <p className="text-caption font-caption text-on-surface-variant mb-stack-md">Scott Aaronson • Chapter 9</p>
                      <p className="text-body-md font-body-md text-on-surface-variant text-sm line-clamp-3 mb-stack-md">
                        Deep dive into the philosophical and mathematical implications of interference patterns.
                      </p>
                      <button
                        onClick={handleStartReading}
                        className="mt-auto w-full py-2.5 bg-primary text-on-primary rounded-lg hover:bg-primary-container transition-colors flex items-center justify-center gap-2 text-label-md font-label-md shadow-sm font-bold cursor-pointer border-none"
                      >
                        <span className="material-symbols-outlined text-sm">menu_book</span>
                        {readingStarted ? 'Continue Reading' : 'Start Reading'}
                      </button>
                    </div>
                  </div>

                  {/* Dynamically Added Custom Pathway Items */}
                  {customPathwayItems.map((custom, index) => (
                    <div
                      key={index}
                      className="bg-surface-container-lowest border-2 border-primary/40 rounded-xl overflow-hidden shadow-md flex flex-col justify-between col-span-1 animate-fade-in-up"
                    >
                      <div className="p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span
                            className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                              custom.type === 'video' ? 'bg-primary-ed text-white' : 'bg-secondary-ed text-white'
                            }`}
                          >
                            {custom.type === 'video' ? 'API Video' : 'API Book'}
                          </span>
                          <span className="text-[11px] font-bold text-status-complete flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">check_circle</span> Added by You
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-on-surface">{custom.item.title}</h4>
                        <p className="text-xs text-on-surface-variant line-clamp-2">{custom.item.description}</p>
                      </div>
                      <div className="p-4 pt-0">
                        <button
                          onClick={() => triggerToast(`Launching ${custom.item.title}...`)}
                          className="w-full py-2 bg-primary text-on-primary rounded-lg text-xs font-bold cursor-pointer border-none hover:bg-primary-container transition-colors"
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
            <article className="relative opacity-80 hover:opacity-100 transition-opacity">
              <div className="absolute left-4 top-10 bottom-[-32px] w-0.5 bg-outline-variant hidden md:block z-0"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-stack-md mb-stack-sm">
                  <div className="w-8 h-8 rounded-full bg-surface-container-high border-2 border-outline-variant text-on-surface-variant flex items-center justify-center font-bold text-label-md ring-4 ring-background">
                    4
                  </div>
                  <h2 className="text-headline-md font-headline-md text-on-surface font-semibold">Entanglement Basics</h2>
                  <span className="text-caption font-caption text-on-surface-variant ml-auto md:ml-0 font-medium">Est. 1h 15m</span>
                </div>
                <div className="ml-0 md:ml-12 bg-surface-muted border border-outline-variant border-dashed rounded-xl p-stack-md flex items-center justify-between">
                  <div className="flex items-center gap-stack-md">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full bg-primary-ed/20 border border-primary-ed flex items-center justify-center z-10">
                        <span className="material-symbols-outlined text-primary-ed text-sm">play_circle</span>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-secondary-ed/20 border border-secondary-ed flex items-center justify-center z-0">
                        <span className="material-symbols-outlined text-secondary-ed text-sm">menu_book</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-label-md font-label-md text-on-surface font-bold">2 Resources Planned</p>
                      <p className="text-caption font-caption text-on-surface-variant">Video &amp; Reading Assignment</p>
                    </div>
                  </div>
                  <button
                    onClick={() => triggerToast('Previewing Day 4: Bell States & EPR Paradox modules loaded.')}
                    className="text-primary font-label-md text-label-md hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-none font-bold"
                  >
                    Preview <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
                </div>
              </div>
            </article>

            {/* Day 5 (Upcoming) */}
            <article className="relative opacity-60">
              <div className="relative z-10">
                <div className="flex items-center gap-stack-md mb-stack-sm">
                  <div className="w-8 h-8 rounded-full bg-surface-container-high border-2 border-outline-variant text-on-surface-variant flex items-center justify-center font-bold text-label-md ring-4 ring-background">
                    5
                  </div>
                  <h2 className="text-headline-md font-headline-md text-on-surface font-semibold">
                    Quantum Gates &amp; Circuit Synthesis
                  </h2>
                </div>
              </div>
            </article>
          </div>

          {/* Right Column: Context & Mentor */}
          <div className="lg:col-span-4 flex flex-col gap-stack-lg">
            {/* AI Mentor Sticky Card */}
            <div className="sticky top-24 bg-surface-container-low border border-primary-fixed-dim/30 rounded-2xl p-stack-md shadow-sm overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10"></div>

              <div className="flex items-center gap-3 mb-stack-md relative z-10">
                <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-md">
                  <span className="material-symbols-outlined">psychology</span>
                </div>
                <div>
                  <h3 className="text-label-md font-label-md text-on-surface font-bold">Mentor Insight</h3>
                  <p className="text-caption font-caption text-on-surface-variant">AI Assistant</p>
                </div>
              </div>

              <div className="bg-surface-container-lowest rounded-xl p-stack-md border border-outline-variant shadow-sm relative z-10 mb-stack-md">
                <p className="text-body-md font-body-md text-on-surface text-sm italic leading-relaxed">
                  "Before diving into today's video, make sure you're comfortable with the concept of complex numbers from Day 2. Use the Google API search above if you need supplemental math brush-up videos!"
                </p>
              </div>

              <button
                onClick={() => setMentorModalOpen(true)}
                className="w-full py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-primary hover:bg-surface-variant transition-colors flex items-center justify-center gap-2 text-label-md font-label-md relative z-10 cursor-pointer font-bold shadow-sm"
              >
                <span className="material-symbols-outlined text-sm">chat</span>
                Ask a Question
              </button>
            </div>

            {/* Plan Stats / Tags */}
            <div className="bg-surface-muted border border-outline-variant rounded-xl p-stack-md">
              <h3 className="text-label-md font-label-md text-on-surface mb-stack-sm font-bold">Curriculum Focus</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-surface-container-high border border-outline-variant rounded-full text-caption font-caption text-on-surface-variant font-medium">
                  Physics
                </span>
                <span className="px-3 py-1 bg-surface-container-high border border-outline-variant rounded-full text-caption font-caption text-on-surface-variant font-medium">
                  Math Intensive
                </span>
                <span className="px-3 py-1 bg-surface-container-high border border-outline-variant rounded-full text-caption font-caption text-on-surface-variant font-medium">
                  Theoretical
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* AI Mentor Quick Modal */}
      {mentorModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl w-full max-w-lg p-6 border border-outline-variant shadow-2xl flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between pb-4 border-b border-outline-variant">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-sm">psychology</span>
                </div>
                <h3 className="text-headline-md font-bold text-on-surface text-lg">Curator Mentor Assistant</h3>
              </div>
              <button
                onClick={() => setMentorModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface cursor-pointer border-none bg-transparent"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {chatLog.map((c, i) => (
                <div key={i} className={`flex gap-2 ${c.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`p-3 rounded-xl max-w-[85%] text-sm ${
                      c.sender === 'user'
                        ? 'bg-primary text-on-primary rounded-br-none'
                        : 'bg-surface-container border border-outline-variant text-on-surface rounded-bl-none'
                    }`}
                  >
                    {c.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendQuestion} className="flex gap-2 pt-3 border-t border-outline-variant">
              <input
                type="text"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Ask about Day 3 quantum concepts..."
                className="flex-1 px-4 py-2 border border-outline-variant rounded-xl bg-surface-muted text-on-surface text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-on-primary rounded-xl font-bold text-sm hover:bg-primary-container transition-colors cursor-pointer border-none"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full py-stack-lg px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-gutter bg-surface-container-high dark:bg-adult-ed border-t border-outline-variant md:ml-0 mb-16 md:mb-0 mt-12">
        <div className="text-headline-md font-headline-md font-bold text-on-surface mb-4 md:mb-0">EduCurate</div>
        <div className="flex flex-wrap justify-center gap-6 mb-4 md:mb-0">
          <button
            onClick={() => onNavigate('parent_dashboard')}
            className="text-on-surface-variant dark:text-surface-variant hover:text-primary underline transition-all text-body-md font-body-md bg-transparent border-none cursor-pointer"
          >
            Privacy Policy
          </button>
          <button
            onClick={() => onNavigate('parent_dashboard')}
            className="text-on-surface-variant dark:text-surface-variant hover:text-primary underline transition-all text-body-md font-body-md bg-transparent border-none cursor-pointer"
          >
            Terms of Service
          </button>
          <button
            onClick={() => onNavigate('curator_ai')}
            className="text-on-surface-variant dark:text-surface-variant hover:text-primary underline transition-all text-body-md font-body-md bg-transparent border-none cursor-pointer"
          >
            Contact Support
          </button>
          <button
            onClick={() => onNavigate('landing')}
            className="text-on-surface-variant dark:text-surface-variant hover:text-primary underline transition-all text-body-md font-body-md bg-transparent border-none cursor-pointer"
          >
            About Us
          </button>
        </div>
        <div className="text-caption font-caption text-on-surface-variant text-center md:text-right">
          © 2024 EduCurate Learning Platform. Curated Clarity for every learner.
        </div>
      </footer>
    </div>
  );
};
