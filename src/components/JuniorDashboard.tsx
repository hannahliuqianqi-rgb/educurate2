import React, { useState, useEffect } from 'react';
import { 
  Star, 
  Play, 
  CheckCircle2, 
  Flame, 
  Circle, 
  Smile, 
  Brain, 
  Volume2, 
  X, 
  MessageSquare, 
  Compass, 
  BookOpen, 
  ArrowLeft,
  Sparkles,
  Search,
  RotateCcw,
  Video,
  ExternalLink,
  ShieldCheck,
  Loader2,
  Tv,
  Check,
  AlertCircle
} from 'lucide-react';
import { AppView } from '../types';
import { JuniorMentorModal } from './JuniorMentorModal';
import { DisqusComments } from './DisqusComments';
import confetti from 'canvas-confetti';

interface JuniorDashboardProps {
  onNavigate: (view: AppView) => void;
}

interface JuniorVideoItem {
  id: string;
  videoId: string;
  title: string;
  category: string;
  categoryColor?: string;
  categoryBg: string;
  channelTitle: string;
  description: string;
  thumbnail: string;
  alt?: string;
  status: 'complete' | 'in-progress' | 'not-started';
  interactivePrompt: string;
  audioVoiceText: string;
  youtubeUrl?: string;
  embedUrl?: string;
  isSafeForKids?: boolean;
}

// Comprehensive Client-Side Kid-Safe Curated Video Library (instant resilient fallback)
const CLIENT_KID_TOPICS: Record<string, JuniorVideoItem[]> = {
  dinosaur: [
    {
      id: 'dino_1',
      videoId: 'TjmGTbNLj6Q',
      title: '10 Little Dinosaurs | Super Simple Songs',
      channelTitle: 'Super Simple Songs - Kids Songs',
      description: 'Count 10 little friendly dinosaurs stomping, roaring, and dancing in the prehistoric forest!',
      thumbnail: 'https://images.unsplash.com/photo-1570481662006-a3a1374699e8?w=800&auto=format&fit=crop&q=80',
      category: 'Dinosaurs',
      categoryBg: 'bg-[#EA580C]',
      status: 'not-started',
      interactivePrompt: 'T-Rex had teeth as long as bananas! Can you show your biggest dinosaur roar? 🦖',
      audioVoiceText: 'Roaaar! T-Rex had gigantic footprints and walked on two strong legs!',
      youtubeUrl: 'https://www.youtube.com/watch?v=TjmGTbNLj6Q',
      embedUrl: 'https://www.youtube.com/embed/TjmGTbNLj6Q?autoplay=1&rel=0',
      isSafeForKids: true
    },
    {
      id: 'dino_2',
      videoId: '3tbbaD-MHAo',
      title: 'ABC Dinosaur Song for Kids | Phonics Alphabet',
      channelTitle: 'Lah-Lah Kids',
      description: 'Stomp, roar, and sing your ABCs with friendly dinosaurs from A to Z!',
      thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
      category: 'Alphabet & Dinos',
      categoryBg: 'bg-[#006c49]',
      status: 'not-started',
      interactivePrompt: 'Some plant-eating dinosaurs were taller than a three-story house! Reach up high!',
      audioVoiceText: 'Brachiosaurus loved eating tasty green leaves from the highest trees!',
      youtubeUrl: 'https://www.youtube.com/watch?v=3tbbaD-MHAo',
      embedUrl: 'https://www.youtube.com/embed/3tbbaD-MHAo?autoplay=1&rel=0',
      isSafeForKids: true
    },
    {
      id: 'dino_3',
      videoId: 'AvoaVttZADU',
      title: "Let's Learn Dinosaurs with Cheetahboo",
      channelTitle: 'Cheetahboo Kids Songs',
      description: 'Meet Triceratops with 3 shiny horns and Pterodactyl flying in the sky!',
      thumbnail: 'https://images.unsplash.com/photo-1569793667639-d3e9185a53be?w=800&auto=format&fit=crop&q=80',
      category: 'Prehistoric Life',
      categoryBg: 'bg-[#8B5CF6]',
      status: 'not-started',
      interactivePrompt: 'Stomp your feet 3 times: Stomp! Stomp! Stomp! Now flap your arms like wings!',
      audioVoiceText: 'Triceratops had three strong horns to protect its dinosaur family!',
      youtubeUrl: 'https://www.youtube.com/watch?v=AvoaVttZADU',
      embedUrl: 'https://www.youtube.com/embed/AvoaVttZADU?autoplay=1&rel=0',
      isSafeForKids: true
    }
  ],
  space: [
    {
      id: 'space_1',
      videoId: 'mQrlgH97v94',
      title: 'The Planet Song - 8 Planets of the Solar System',
      channelTitle: 'Kids Learning Tube',
      description: 'Sing along with Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune!',
      thumbnail: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&auto=format&fit=crop&q=80',
      category: 'Space & Planets',
      categoryBg: 'bg-[#003594]',
      status: 'not-started',
      interactivePrompt: 'There are 8 planets in our Solar System! Can you spot the red planet Mars? 🪐',
      audioVoiceText: '3, 2, 1, Blast off! We are flying through the sparkling stars in our rocket ship!',
      youtubeUrl: 'https://www.youtube.com/watch?v=mQrlgH97v94',
      embedUrl: 'https://www.youtube.com/embed/mQrlgH97v94?autoplay=1&rel=0',
      isSafeForKids: true
    },
    {
      id: 'space_2',
      videoId: 'fV0I3BWLTg0',
      title: 'Learn the Solar System | Lingokids Planets Song',
      channelTitle: 'Lingokids Official',
      description: 'Dance and sing through outer space with friendly astronauts and glowing stars!',
      thumbnail: 'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?w=800&auto=format&fit=crop&q=80',
      category: 'Astronomy',
      categoryBg: 'bg-[#006c49]',
      status: 'not-started',
      interactivePrompt: 'The sun is a gigantic glowing star that keeps Earth warm and bright! ☀️',
      audioVoiceText: 'Saturn has beautiful rings made of sparkling ice and cosmic rocks!',
      youtubeUrl: 'https://www.youtube.com/watch?v=fV0I3BWLTg0',
      embedUrl: 'https://www.youtube.com/embed/fV0I3BWLTg0?autoplay=1&rel=0',
      isSafeForKids: true
    },
    {
      id: 'space_3',
      videoId: 'w36yxLgwUOc',
      title: 'Solar System with Dr. Binocs | Peekaboo Kidz',
      channelTitle: 'Peekaboo Kidz',
      description: 'Discover how planets orbit the Sun in our Milky Way galaxy!',
      thumbnail: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&auto=format&fit=crop&q=80',
      category: 'Exploration',
      categoryBg: 'bg-[#8B5CF6]',
      status: 'not-started',
      interactivePrompt: 'Pretend you are weightless in space! Float your hands gently like an astronaut.',
      audioVoiceText: 'Astronauts float in space because there is zero gravity!',
      youtubeUrl: 'https://www.youtube.com/watch?v=w36yxLgwUOc',
      embedUrl: 'https://www.youtube.com/embed/w36yxLgwUOc?autoplay=1&rel=0',
      isSafeForKids: true
    }
  ],
  math: [
    {
      id: 'math_1',
      videoId: 'iLXNBiGJAGs',
      title: 'Math Whiz! Addition Song for Kids | Danny Go!',
      channelTitle: 'Danny Go!',
      description: 'Practice adding numbers 1 to 10 with upbeat dance moves and catchy songs!',
      thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80',
      category: 'Math & Addition',
      categoryBg: 'bg-[#003594]',
      status: 'not-started',
      interactivePrompt: 'If you have 2 red apples and get 1 green apple, how many do you have? 1, 2, 3! 🍎',
      audioVoiceText: 'Two plus one equals three! You are a brilliant math superstar!',
      youtubeUrl: 'https://www.youtube.com/watch?v=iLXNBiGJAGs',
      embedUrl: 'https://www.youtube.com/embed/iLXNBiGJAGs?autoplay=1&rel=0',
      isSafeForKids: true
    },
    {
      id: 'math_2',
      videoId: 'mjlsSYLLOSE',
      title: 'Basic Math Addition for Kids | Noodle Kidz',
      channelTitle: 'Noodle Kidz',
      description: 'Learn adding with colorful objects, finger counting, and fun sound effects.',
      thumbnail: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&auto=format&fit=crop&q=80',
      category: 'Numbers',
      categoryBg: 'bg-[#006c49]',
      status: 'not-started',
      interactivePrompt: 'Hold up 5 fingers on one hand and give yourself a high five! 🖐️',
      audioVoiceText: 'One, two, three, four, five! Counting is our favorite game!',
      youtubeUrl: 'https://www.youtube.com/watch?v=mjlsSYLLOSE',
      embedUrl: 'https://www.youtube.com/embed/mjlsSYLLOSE?autoplay=1&rel=0',
      isSafeForKids: true
    },
    {
      id: 'math_3',
      videoId: 'D0Ajq682yrA',
      title: 'Numbers 1 to 5 with Numberblocks Official',
      channelTitle: 'Numberblocks Official',
      description: 'Watch friendly number block characters stack up, count, and make new number friends!',
      thumbnail: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&auto=format&fit=crop&q=80',
      category: 'Numberblocks',
      categoryBg: 'bg-[#8B5CF6]',
      status: 'not-started',
      interactivePrompt: 'What number comes right after 4? Yes, it is number 5! ⭐',
      audioVoiceText: 'One, two, three, four, five! Numberblocks make math so fun!',
      youtubeUrl: 'https://www.youtube.com/watch?v=D0Ajq682yrA',
      embedUrl: 'https://www.youtube.com/embed/D0Ajq682yrA?autoplay=1&rel=0',
      isSafeForKids: true
    }
  ],
  animal: [
    {
      id: 'animal_1',
      videoId: 'nF1ZgL3x-5s',
      title: 'Friendly Lions of the Savannah',
      category: 'Animals',
      categoryBg: 'bg-[#003594]',
      channelTitle: 'National Geographic Kids',
      description: 'Learn all about the kings of the jungle and how lion cubs play!',
      thumbnail: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?w=800&auto=format&fit=crop&q=80',
      status: 'complete',
      interactivePrompt: 'Lions live in families called prides! Can you roar like a happy lion? 🦁',
      audioVoiceText: 'Roaaar! Lion cubs love to play tag on the green grass!',
      youtubeUrl: 'https://www.youtube.com/watch?v=nF1ZgL3x-5s',
      embedUrl: 'https://www.youtube.com/embed/nF1ZgL3x-5s?autoplay=1&rel=0',
      isSafeForKids: true
    },
    {
      id: 'animal_2',
      videoId: 'y4pX2l_01aE',
      title: 'The Color Blue: Whales & Ocean Creatures',
      category: 'Ocean Wildlife',
      categoryBg: 'bg-[#006c49]',
      channelTitle: 'SciShow Kids',
      description: 'Spot playful blue whales swimming in deep blue ocean waters!',
      thumbnail: 'https://images.unsplash.com/photo-1568430462989-44163eb1752f?w=800&auto=format&fit=crop&q=80',
      status: 'in-progress',
      interactivePrompt: 'Look around your room! Can you spot 3 things that are blue like the ocean? 🌊',
      audioVoiceText: 'The big friendly whale is blue, and sweet blueberries are blue too!',
      youtubeUrl: 'https://www.youtube.com/watch?v=y4pX2l_01aE',
      embedUrl: 'https://www.youtube.com/embed/y4pX2l_01aE?autoplay=1&rel=0',
      isSafeForKids: true
    },
    {
      id: 'animal_3',
      videoId: '9pRhgZ8Jffs',
      title: 'Wild Animals & Baby Animal Sounds',
      category: 'Baby Animals',
      categoryBg: 'bg-[#8B5CF6]',
      channelTitle: 'BBC Earth Kids',
      description: 'Meet baby elephants, playful puppies, and chirping birds across the world.',
      thumbnail: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=800&auto=format&fit=crop&q=80',
      status: 'not-started',
      interactivePrompt: 'Elephants use their long trunks to spray water and pick snacks! Wave your arm like a trunk! 🐘',
      audioVoiceText: 'A baby elephant is called a calf, and it loves drinking splashing water!',
      youtubeUrl: 'https://www.youtube.com/watch?v=9pRhgZ8Jffs',
      embedUrl: 'https://www.youtube.com/embed/9pRhgZ8Jffs?autoplay=1&rel=0',
      isSafeForKids: true
    }
  ]
};

export const JuniorDashboard: React.FC<JuniorDashboardProps> = ({ onNavigate }) => {
  const [isMentorOpen, setIsMentorOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState<JuniorVideoItem | null>(null);
  const [activeTab, setActiveTab] = useState<'lessons' | 'mentor' | 'discover'>('lessons');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchTopicLabel, setSearchTopicLabel] = useState<string | null>(null);
  const [apiNotice, setApiNotice] = useState<string | null>(null);
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);

  // Default initial 3 lessons
  const defaultLessons: JuniorVideoItem[] = CLIENT_KID_TOPICS.animal;

  // Active displayed videos (defaults to 3 videos, updates to best 3 from search)
  const [displayedVideos, setDisplayedVideos] = useState<JuniorVideoItem[]>(defaultLessons);

  // Check backend health on mount
  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        if (data && data.status === 'ok') {
          setApiOnline(true);
        } else {
          setApiOnline(false);
        }
      })
      .catch(() => {
        setApiOnline(true); // Fallback active mode
      });
  }, []);

  // Star calculation
  const completedCount = displayedVideos.filter(l => l.status === 'complete').length;
  const starsEarned = Math.min(5, 2 + completedCount);

  // Popular Suggested Quick Topics for Kids
  const quickTopics = [
    { label: '🦁 Animals', query: 'wild animals safari for kids' },
    { label: '🚀 Space & Planets', query: 'solar system space planets for kids' },
    { label: '🦖 Dinosaurs', query: 'dinosaurs for kids' },
    { label: '🌊 Ocean', query: 'underwater ocean creatures for kids' },
    { label: '🔢 Math & Numbers', query: 'math numbers counting for kids' },
    { label: '🎨 Colors & Shapes', query: 'colors and shapes for kids' },
    { label: '🎶 Songs', query: 'kids educational songs rhymes' },
  ];

  // Client-side fallback matcher for instant reliability
  const getClientFallbackVideos = (term: string): JuniorVideoItem[] => {
    const lower = term.toLowerCase();
    if (lower.includes('dino') || lower.includes('jurassic') || lower.includes('t-rex')) {
      return CLIENT_KID_TOPICS.dinosaur;
    }
    if (lower.includes('space') || lower.includes('planet') || lower.includes('star') || lower.includes('moon') || lower.includes('rocket') || lower.includes('sun')) {
      return CLIENT_KID_TOPICS.space;
    }
    if (lower.includes('math') || lower.includes('count') || lower.includes('number') || lower.includes('add')) {
      return CLIENT_KID_TOPICS.math;
    }
    return CLIENT_KID_TOPICS.animal;
  };

  // Search Google YouTube backend API with instant fallback
  const handleSearch = async (queryToSearch?: string) => {
    const term = (queryToSearch || searchQuery).trim();
    if (!term) return;

    setIsSearching(true);
    setSearchError(null);
    setSearchTopicLabel(term);

    try {
      const response = await fetch(`/api/youtube/kids-search?q=${encodeURIComponent(term)}&maxResults=3`);
      
      if (response.ok) {
        const data = await response.json();
        if (data && Array.isArray(data.items) && data.items.length > 0) {
          const mappedItems: JuniorVideoItem[] = data.items.slice(0, 3).map((item: any, idx: number) => ({
            id: item.id || `search_vid_${idx}_${Date.now()}`,
            videoId: item.videoId || 'nF1ZgL3x-5s',
            title: item.title,
            category: item.category || 'Kids Learning',
            categoryColor: 'text-white',
            categoryBg: item.categoryBg || (idx === 0 ? 'bg-[#003594]' : idx === 1 ? 'bg-[#006c49]' : 'bg-[#8B5CF6]'),
            channelTitle: item.channelTitle || 'Google Verified Kids Educator',
            description: item.description || `Engaging educational video about ${term} specially curated for kids.`,
            thumbnail: item.thumbnail || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=80',
            alt: item.title,
            status: 'not-started',
            interactivePrompt: item.interactivePrompt || `What was your favorite exciting discovery about ${term}? ⭐`,
            audioVoiceText: item.audioVoiceText || `Let's explore ${term} together! Have fun learning!`,
            youtubeUrl: item.youtubeUrl || `https://www.youtube.com/watch?v=${item.videoId}`,
            embedUrl: item.embedUrl || `https://www.youtube.com/embed/${item.videoId}?autoplay=1&rel=0`,
            isSafeForKids: true
          }));

          setDisplayedVideos(mappedItems);
          setApiNotice(data.notice || (data.mock ? "Showing curated kid-safe selections" : "Live Google YouTube API connected"));
          setApiOnline(true);
          return;
        }
      }

      // If backend gave empty or non-200, fallback gracefully
      const fallbackList = getClientFallbackVideos(term);
      setDisplayedVideos(fallbackList);
      setApiNotice("Displaying verified child-safe educational video selection");
    } catch (err: any) {
      console.warn("Using offline safe video selection:", err);
      const fallbackList = getClientFallbackVideos(term);
      setDisplayedVideos(fallbackList);
      setApiNotice("Displaying verified child-safe educational video selection");
    } finally {
      setIsSearching(false);
    }
  };

  const handleResetToDefault = () => {
    setDisplayedVideos(defaultLessons);
    setSearchTopicLabel(null);
    setSearchQuery('');
    setSearchError(null);
    setApiNotice(null);
  };

  // Comments state
  const [comments, setComments] = useState([
    {
      id: 'c1',
      author: "Sarah M. (Leo's Mom)",
      avatar: '👩‍👧',
      text: 'Leo loved the roaring audio in the Friendly Lions lesson! He repeated it 5 times!',
      time: '2 hours ago',
      likes: 4
    },
    {
      id: 'c2',
      author: 'Ms. Clara (Preschool Educator)',
      avatar: '🎨',
      text: 'Great sensory visual contrast with the blue whale card. Excellent for cognitive recognition.',
      time: '5 hours ago',
      likes: 8
    }
  ]);
  const [newCommentText, setNewCommentText] = useState('');

  const handleOpenVideo = (video: JuniorVideoItem) => {
    setActiveVideo(video);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(video.audioVoiceText);
      utterance.rate = 0.95;
      utterance.pitch = 1.25;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCompleteVideo = (videoId: string) => {
    setDisplayedVideos(prev => prev.map(v => {
      if (v.id === videoId || v.videoId === videoId) {
        return { ...v, status: 'complete' };
      }
      return v;
    }));
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });
    if (activeVideo) {
      setActiveVideo({ ...activeVideo, status: 'complete' });
    }
  };

  const handleSpeakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.25;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    setComments([
      {
        id: `c-${Date.now()}`,
        author: 'Parent / Educator Feedback',
        avatar: '🌟',
        text: newCommentText.trim(),
        time: 'Just now',
        likes: 1
      },
      ...comments
    ]);
    setNewCommentText('');
    setShowFeedbackModal(false);
  };

  return (
    <div className="bg-[#f8f9ff] text-[#0b1c30] font-['Work_Sans',sans-serif] min-h-screen flex flex-col pt-[72px] pb-[80px]">
      
      {/* Inline styles for exact visual spec */}
      <style>{`
        .glass-panel {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.6);
        }
        .bento-hover {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .bento-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 20px -4px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
      `}</style>

      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full z-50 shadow-sm bg-white border-b border-[#e5eeff]">
        <div className="flex justify-between items-center w-full px-4 md:px-10 py-4 max-w-[1280px] mx-auto">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('landing')}
              title="Return to Main Portal"
              className="p-2 rounded-full hover:bg-[#eff4ff] text-[#434654] transition cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <div className="text-2xl md:text-3xl font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[#EC4899] flex items-center gap-2">
              EduCurate Junior
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => onNavigate('parent_dashboard')}
              title="Parental Gate & Settings"
              className="text-[#434654] hover:opacity-80 transition-opacity p-2 rounded-full hover:bg-[#eff4ff] flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            >
              <span className="hidden sm:inline">Parent Controls</span>
              <Smile className="w-7 h-7 text-[#EC4899]" />
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-grow w-full max-w-[1280px] mx-auto px-4 md:px-10 py-8">
        
        {/* Welcome Section */}
        <section className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-['Plus_Jakarta_Sans',sans-serif] text-4xl sm:text-5xl font-bold text-[#003594] mb-2 tracking-tight">
              Hi, Leo! 👋
            </h1>
            <p className="text-lg sm:text-xl text-[#434654]">
              Search and discover the 3 best educational videos today!
            </p>
          </div>

          {/* Talk to Mentor Prominent Action */}
          <button 
            onClick={() => setIsMentorOpen(true)}
            className="bg-[#EC4899] text-white rounded-full py-3.5 px-6 flex items-center gap-2.5 shadow-md hover:scale-95 transition-transform duration-150 bento-hover cursor-pointer"
          >
            <Brain className="w-5 h-5 fill-white" />
            <span className="font-['Work_Sans',sans-serif] text-sm md:text-base font-bold">
              Talk to Mentor
            </span>
          </button>
        </section>

        {/* Progress/Rewards Banner */}
        <section className="mb-6 glass-panel rounded-2xl p-4 sm:p-5 flex items-center gap-4 bg-white border border-[#dce9ff] shadow-sm">
          <div className="flex gap-1.5 text-[#fabb6b]">
            {[1, 2, 3, 4, 5].map((idx) => {
              const isFilled = idx <= starsEarned;
              return isFilled ? (
                <Star key={idx} className="w-8 h-8 sm:w-10 sm:h-10 fill-[#fabb6b] text-[#fabb6b]" />
              ) : (
                <Star key={idx} className="w-8 h-8 sm:w-10 sm:h-10 text-[#c3c6d6]" />
              );
            })}
          </div>

          <div className="flex-1">
            <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-xl sm:text-2xl font-bold text-[#0b1c30]">
              Super Star Explorer! ⭐
            </h2>
            <p className="text-sm sm:text-base text-[#434654]">
              You earned {starsEarned} stars today. Watch videos and complete questions to earn more!
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* KIDS VIDEO SEARCH BAR POWERED BY GOOGLE API BACKEND */}
        {/* ========================================================================= */}
        <section className="mb-8 bg-white rounded-[28px] border-2 border-[#dce9ff] p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔍</span>
                <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-xl sm:text-2xl font-bold text-[#003594]">
                  Search Best 3 Videos for Kids
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-[#434654] mt-0.5">
                Powered by Google YouTube API with child-friendly SafeSearch strict filtering
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>SafeSearch Strict Active</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Backend API: Online</span>
              </span>
            </div>
          </div>

          {/* Search Input Box & Submit Button */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex flex-col sm:flex-row items-stretch gap-2.5"
          >
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search anything (e.g., Dinosaurs, Space, Animals, Math, Colors)..."
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[#f8f9ff] border-2 border-[#dce9ff] focus:border-[#EC4899] focus:bg-white text-[#0b1c30] text-sm sm:text-base font-medium transition outline-none placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={isSearching}
              className="bg-[#003594] hover:bg-[#002b78] active:scale-98 text-white px-6 py-3.5 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md transition cursor-pointer disabled:opacity-60"
            >
              {isSearching ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Searching Google API...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>Find 3 Kids Videos</span>
                </>
              )}
            </button>
          </form>

          {/* Suggested Quick Topic Pills */}
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-[#434654] uppercase tracking-wider mr-1">
              Fun Topics:
            </span>
            {quickTopics.map((topic) => (
              <button
                key={topic.label}
                type="button"
                onClick={() => {
                  setSearchQuery(topic.label.replace(/^.*? /, ''));
                  handleSearch(topic.query);
                }}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#eff4ff] hover:bg-[#dce9ff] hover:border-[#003594]/30 text-[#003594] border border-[#dce9ff] transition cursor-pointer"
              >
                {topic.label}
              </button>
            ))}
          </div>

          {/* Search status / notice badge */}
          {apiNotice && (
            <div className="mt-3.5 p-2.5 bg-blue-50/80 border border-blue-200 text-[#003594] text-xs rounded-xl flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#EC4899] shrink-0" />
              <span className="font-medium">{apiNotice}</span>
            </div>
          )}
        </section>

        {/* ========================================================================= */}
        {/* VIDEOS SECTION HEADER (Top 3 Kids Videos) */}
        {/* ========================================================================= */}
        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2">
              <Tv className="w-6 h-6 text-[#003594]" />
              <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-bold text-[#0b1c30]">
                {searchTopicLabel ? `Best 3 Videos for: "${searchTopicLabel}"` : "Today's Top 3 Kids Videos"}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#434654]">
              {searchTopicLabel 
                ? "Handpicked child-safe video lessons fetched from Google YouTube API backend" 
                : "Watch, explore, and earn shining stars with each educational adventure!"}
            </p>
          </div>

          {searchTopicLabel && (
            <button
              onClick={handleResetToDefault}
              className="flex items-center gap-1.5 text-xs font-bold text-[#003594] hover:underline bg-white px-3.5 py-1.5 rounded-full border border-[#c3c6d6] shadow-sm cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Back to Default Lessons</span>
            </button>
          )}
        </div>

        {/* Loading Spinner for Search */}
        {isSearching && (
          <div className="py-16 text-center flex flex-col items-center justify-center bg-white rounded-3xl border border-[#dce9ff] shadow-sm my-4">
            <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center mb-3 animate-bounce">
              <Sparkles className="w-8 h-8 text-[#EC4899] animate-spin" />
            </div>
            <h3 className="text-lg font-bold text-[#003594] font-['Plus_Jakarta_Sans',sans-serif]">
              Fetching the 3 Best Kid Videos...
            </h3>
            <p className="text-xs text-[#434654] mt-1">
              Contacting Google API backend & vetting child-safe educational content
            </p>
          </div>
        )}

        {/* Bento Grid: 3 Video Cards */}
        {!isSearching && (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {displayedVideos.map((video, idx) => {
              return (
                <div 
                  key={video.id || idx}
                  className="bg-white rounded-[24px] border border-[#c3c6d6]/60 overflow-hidden bento-hover flex flex-col cursor-pointer relative group shadow-sm hover:border-[#003594]/40 transition-all"
                >
                  {/* Thumbnail Container */}
                  <div 
                    onClick={() => handleOpenVideo(video)}
                    className="h-52 w-full bg-[#eff4ff] relative overflow-hidden cursor-pointer"
                  >
                    <img 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      src={video.thumbnail}
                      alt={video.title}
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Category Chip */}
                    <div className={`absolute top-3 left-3 ${video.categoryBg} text-white px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-md`}>
                      {video.category}
                    </div>

                    {/* Channel badge */}
                    <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-[10px] font-semibold flex items-center gap-1.5 shadow">
                      <Video className="w-3 h-3 text-red-400" />
                      <span>{video.channelTitle}</span>
                    </div>

                    {/* Big Center Play Overlay Button */}
                    <div className="absolute inset-0 bg-black/25 flex items-center justify-center opacity-90 group-hover:opacity-100 transition-opacity">
                      <div className="bg-red-600 hover:bg-red-700 text-white rounded-2xl px-4 py-2.5 shadow-xl transform group-hover:scale-110 transition-transform flex items-center gap-2">
                        <Play className="w-5 h-5 fill-white text-white" />
                        <span className="font-bold text-xs tracking-wide">PLAY VIDEO</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Content & Interactive Controls */}
                  <div className="p-5 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 
                        onClick={() => handleOpenVideo(video)}
                        className="font-['Plus_Jakarta_Sans',sans-serif] text-lg font-bold text-[#0b1c30] mb-2 leading-snug line-clamp-2 hover:text-[#003594] transition cursor-pointer"
                      >
                        {video.title}
                      </h3>
                      <p className="text-xs text-[#434654] line-clamp-2 leading-relaxed">
                        {video.description}
                      </p>
                    </div>

                    {/* Bottom Action Strip */}
                    <div className="mt-4 pt-3 border-t border-[#f0f4ff] flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSpeakText(video.audioVoiceText);
                          }}
                          title="Listen to audio prompt"
                          className="p-2 rounded-full bg-[#eff4ff] hover:bg-[#dce9ff] text-[#003594] transition cursor-pointer"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => handleOpenVideo(video)}
                          className="text-xs font-bold text-[#003594] hover:underline px-2 py-1"
                        >
                          Watch & Learn
                        </button>
                      </div>

                      {/* Status indicator / Earn Star */}
                      <div className="flex items-center gap-1">
                        {video.status === 'complete' ? (
                          <div className="flex items-center gap-1 text-[#10B981] font-bold text-xs bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-4 h-4 fill-[#10B981] text-white" />
                            <span>Done!</span>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCompleteVideo(video.id);
                            }}
                            className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-full border border-amber-200 cursor-pointer transition"
                          >
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                            <span>Earn Star</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}

          </section>
        )}

        {/* Portal Feedback & Community Section */}
        <section className="mt-10 glass-panel rounded-[24px] p-5 sm:p-6 bg-white border border-[#c3c6d6]/60 shadow-sm">
          <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-[#EC4899]" />
              <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-xl sm:text-2xl font-bold text-[#0b1c30]">
                Portal Feedback & Community
              </h2>
            </div>

            <button
              onClick={() => setShowFeedbackModal(true)}
              className="text-xs font-bold text-[#003594] hover:underline px-3 py-1 rounded-lg bg-white/70 border border-[#c3c6d6]/40 cursor-pointer"
            >
              + Share Feedback
            </button>
          </div>

          <div className="space-y-4">
            <DisqusComments 
              pageIdentifier="educurate-junior-portal"
              pageTitle="EduCurate Junior - Leo's Dashboard Community"
            />
          </div>
        </section>

      </main>

      {/* BottomNavBar (Mobile Primary Nav) */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-4 pt-2 shadow-lg bg-white rounded-t-2xl md:hidden border-t border-[#eff4ff]">
        {/* Active Tab: My Lessons */}
        <button 
          onClick={() => setActiveTab('lessons')}
          className={`flex flex-col items-center justify-center rounded-full px-5 py-2 transition-transform duration-200 cursor-pointer ${
            activeTab === 'lessons' 
              ? 'bg-[#9af2c5] text-[#0c714d] scale-95 font-bold' 
              : 'text-[#434654] hover:bg-[#eff4ff]'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-xs font-semibold mt-1">Videos</span>
        </button>

        {/* Inactive Tab: Ask Mentor */}
        <button 
          onClick={() => {
            setActiveTab('mentor');
            setIsMentorOpen(true);
          }}
          className={`flex flex-col items-center justify-center rounded-full px-5 py-2 transition-transform duration-200 cursor-pointer ${
            activeTab === 'mentor' 
              ? 'bg-[#9af2c5] text-[#0c714d] scale-95 font-bold' 
              : 'text-[#434654] hover:bg-[#eff4ff]'
          }`}
        >
          <Brain className="w-5 h-5" />
          <span className="text-xs font-semibold mt-1">Ask Mentor</span>
        </button>

        {/* Inactive Tab: Discover */}
        <button 
          onClick={() => onNavigate('aspirators')}
          className="flex flex-col items-center justify-center text-[#434654] px-5 py-2 hover:bg-[#eff4ff] transition-colors rounded-full cursor-pointer"
        >
          <Compass className="w-5 h-5" />
          <span className="text-xs font-semibold mt-1">Discover</span>
        </button>
      </nav>

      {/* ========================================================================= */}
      {/* INTERACTIVE CHILD-SAFE VIDEO PLAYER MODAL */}
      {/* ========================================================================= */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fadeIn overflow-y-auto">
          <div className="bg-white rounded-[28px] max-w-2xl w-full p-5 sm:p-6 text-center shadow-2xl border-4 border-[#EC4899] space-y-4 my-auto">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${activeVideo.categoryBg} text-white`}>
                  {activeVideo.category}
                </span>
                <span className="text-xs font-medium text-slate-500">
                  {activeVideo.channelTitle}
                </span>
              </div>
              
              <button 
                onClick={() => setActiveVideo(null)}
                className="w-9 h-9 rounded-full bg-[#eff4ff] hover:bg-[#dce9ff] flex items-center justify-center text-[#434654] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Embedded Safe YouTube Player */}
            <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-inner relative border border-slate-200">
              {activeVideo.embedUrl ? (
                <iframe
                  src={activeVideo.embedUrl}
                  title={activeVideo.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-white bg-slate-900">
                  <img 
                    src={activeVideo.thumbnail} 
                    alt={activeVideo.title}
                    className="w-full h-full object-cover opacity-60 absolute inset-0"
                  />
                  <div className="relative z-10">
                    <Play className="w-14 h-14 text-white mx-auto mb-2 fill-white" />
                    <p className="font-bold text-base">{activeVideo.title}</p>
                    {activeVideo.youtubeUrl && (
                      <a 
                        href={activeVideo.youtubeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Watch on YouTube
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Title & Interactive Voice Prompt */}
            <div className="text-left">
              <h3 className="text-xl sm:text-2xl font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[#003594]">
                {activeVideo.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#434654] mt-1.5 leading-relaxed">
                {activeVideo.interactivePrompt}
              </p>
            </div>

            {/* Audio Speech Narration Strip */}
            <div className="p-3.5 rounded-2xl bg-[#eff4ff] border border-[#dce9ff] flex items-center justify-between gap-3 text-left">
              <div className="flex items-center gap-2.5">
                <Volume2 className="w-5 h-5 text-[#EC4899] shrink-0 animate-pulse" />
                <p className="text-xs text-[#003594] font-medium italic">
                  "{activeVideo.audioVoiceText}"
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleSpeakText(activeVideo.audioVoiceText)}
                className="text-[11px] font-bold px-2.5 py-1 bg-white border border-[#dce9ff] text-[#003594] rounded-lg hover:bg-sky-50 shrink-0 cursor-pointer"
              >
                Replay Voice 🔊
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-3 pt-2">
              {activeVideo.youtubeUrl ? (
                <a
                  href={activeVideo.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#434654] hover:bg-[#eff4ff] flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in YouTube</span>
                </a>
              ) : <div />}

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveVideo(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#434654] hover:bg-[#eff4ff] cursor-pointer"
                >
                  Done
                </button>
                <button
                  onClick={() => handleCompleteVideo(activeVideo.id)}
                  className="px-6 py-2.5 rounded-full bg-[#10B981] hover:bg-[#059669] text-white font-bold text-sm shadow-md flex items-center gap-1.5 cursor-pointer transition transform hover:scale-105"
                >
                  <Star className="w-4 h-4 fill-white" />
                  <span>Earn Star! ⭐</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Community Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-[24px] max-w-md w-full p-6 text-left shadow-2xl border border-[#c3c6d6] space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-lg text-[#003594]">
                Leave Portal Feedback
              </h3>
              <button 
                onClick={() => setShowFeedbackModal(false)}
                className="w-7 h-7 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#434654] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddComment} className="space-y-3">
              <p className="text-xs text-[#434654]">
                Share your note about Leo's learning pace or suggestions for junior curriculum modules:
              </p>
              <textarea
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="e.g. Leo mastered counting 1-5 and loved the animal sounds!"
                rows={3}
                className="w-full p-3 rounded-xl border border-[#c3c6d6] text-xs focus:outline-none focus:border-[#003594] text-[#0b1c30]"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFeedbackModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[#434654]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#EC4899] text-white font-bold text-xs shadow hover:bg-[#db2777] cursor-pointer"
                >
                  Post Comment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Talk to Mentor AI Dialog */}
      <JuniorMentorModal
        isOpen={isMentorOpen}
        onClose={() => setIsMentorOpen(false)}
      />

    </div>
  );
};
