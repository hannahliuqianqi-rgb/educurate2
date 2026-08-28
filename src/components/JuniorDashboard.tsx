import React, { useState } from 'react';
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
  Send,
  ThumbsUp,
  RotateCcw
} from 'lucide-react';
import { AppView } from '../types';
import { JuniorMentorModal } from './JuniorMentorModal';
import confetti from 'canvas-confetti';

interface JuniorDashboardProps {
  onNavigate: (view: AppView) => void;
}

interface JuniorLesson {
  id: string;
  title: string;
  category: 'Animals' | 'Colors' | 'Math';
  categoryColor: string;
  categoryBg: string;
  description: string;
  image: string;
  alt: string;
  status: 'complete' | 'in-progress' | 'not-started';
  interactivePrompt: string;
  audioVoiceText: string;
}

export const JuniorDashboard: React.FC<JuniorDashboardProps> = ({ onNavigate }) => {
  const [isMentorOpen, setIsMentorOpen] = useState(false);
  const [activeLesson, setActiveLesson] = useState<JuniorLesson | null>(null);
  const [activeTab, setActiveTab] = useState<'lessons' | 'mentor' | 'discover'>('lessons');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  // Lesson state
  const [lessons, setLessons] = useState<JuniorLesson[]>([
    {
      id: 'lions',
      title: 'Friendly Lions',
      category: 'Animals',
      categoryColor: 'text-white',
      categoryBg: 'bg-[#003594]',
      description: 'Learn all about the kings of the jungle!',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAp8zsxXsLmX0aXCOK9l9oTrv9-uGiGjg_kIm8JEkWClEcN8HkrGmEXDR0cFk-553jo1LNCQ-E1WwvnLUJKZ6zbDT__N8jPLEfAcNprRcFHtqE9idJJ_1tplTFNiKinkO4wJhO6aB03qeoovHOOaXyRcuWhpxkAAv4xHvMuIhSBAw5aYVhWvr1DGF_DdgBsIKkwljkSHIgYo0tmWp7bepep-n1mzCe6S_TsOxRY_vA9QmcWvpIeXM_z',
      alt: 'A bright, colorful cartoon illustration of friendly, smiling lions playing in a sunny savannah.',
      status: 'complete',
      interactivePrompt: 'Lions live in families called prides! Can you roar like a happy lion?',
      audioVoiceText: 'Roaaar! Lion cubs love to play tag on the grass!'
    },
    {
      id: 'colors',
      title: 'The Color Blue',
      category: 'Colors',
      categoryColor: 'text-white',
      categoryBg: 'bg-[#006c49]',
      description: 'Can you find everything that is blue?',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtTP7YOj_uilkGxUtPjpQ6iN_gpNHmIscsaKFJsPJLRr-6Zc0DNZLSLOYbEc6xNkrKIRlGhC4lcq8Wfi6Fvat8fFOfIx1o5e3BYgTwJtP3oM6mK3JZgKib2ZVOKa1FlVlYlTW3I9ZX3uG3zW3RU1PejjeX7Wr11sVCvA_T0-S6YHtQYF2xOI58aSqikDC5RY3r9h0YajpfWIC4UkgwmqVOnhJXLSXSSPudgJT8T8I6W1PbTg5nuFP5',
      alt: 'A vibrant, minimalist digital painting showcasing various objects that are blue: a cartoon blue whale, blueberry, and balloon.',
      status: 'in-progress',
      interactivePrompt: 'Look around your room! Can you spot 3 things that are blue like the ocean?',
      audioVoiceText: 'The big friendly whale is blue, and delicious blueberries are blue too!'
    },
    {
      id: 'numbers',
      title: 'Numbers 1-5',
      category: 'Math',
      categoryColor: 'text-white',
      categoryBg: 'bg-[#8B5CF6]',
      description: "Let's count together! One, two, three...",
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzYerK8N9hAjVq6qa4dXLRnrKPGKo3dfx6Pwtu68Ufv6DzR8nLlNdFcV7P1KUMVkl326a0aKE8vsmIxfK1B9IpmIcEISmEBFagMugBArzjD9Z_mhD3IUVNlVzlU9PA4wx0IEyBHTDNx9EV2SVwq1H96bXGIop8q1sEe0rhIo01NnlucLaoSOt2x5OfWdDDIQpmND0N1WsN_aFwvDdBR7vUxuCow685ap4vJ6fSq9ISZGsiKq8Dfnr5',
      alt: 'Large, chunky, 3D rendered numbers 1 through 5 arranged playfully in a bright studio environment.',
      status: 'not-started',
      interactivePrompt: 'Hold up your hand! Let us count all 5 fingers: 1, 2, 3, 4, 5!',
      audioVoiceText: 'Counting is super fun! One, two, three, four, five!'
    }
  ]);

  // Star calculation
  const completedCount = lessons.filter(l => l.status === 'complete').length;
  const starsEarned = Math.min(5, 2 + completedCount);

  // Comments state
  const [comments, setComments] = useState([
    {
      id: 'c1',
      author: 'Sarah M. (Leo\'s Mom)',
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

  const handleOpenLesson = (lesson: JuniorLesson) => {
    setActiveLesson(lesson);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(lesson.audioVoiceText);
      utterance.rate = 0.95;
      utterance.pitch = 1.25;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCompleteLesson = (lessonId: string) => {
    setLessons(prev => prev.map(l => {
      if (l.id === lessonId) {
        return { ...l, status: 'complete' };
      }
      return l;
    }));
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });
    setActiveLesson(null);
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
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.5);
        }
        .bento-hover {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .bento-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
      `}</style>

      {/* TopAppBar (Web & Mobile context) */}
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
              className="text-[#434654] hover:opacity-80 transition-opacity p-2 rounded-full hover:bg-[#eff4ff] flex items-center gap-1.5 text-xs font-semibold"
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
        <section className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-['Plus_Jakarta_Sans',sans-serif] text-4xl sm:text-5xl font-bold text-[#003594] mb-2 tracking-tight">
              Hi, Leo! 👋
            </h1>
            <p className="text-lg sm:text-xl text-[#434654]">
              Ready to learn something fun today?
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

        {/* Progress/Rewards Banner (Simplified for Junior) */}
        <section className="mb-8 glass-panel rounded-2xl p-4 sm:p-5 flex items-center gap-4 bg-[#e5eeff] border border-[#dce9ff] shadow-sm">
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
              Super Star!
            </h2>
            <p className="text-sm sm:text-base text-[#434654]">
              You earned {starsEarned} stars today. Keep going!
            </p>
          </div>
        </section>

        {/* Bento Grid: Lesson Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {lessons.map((lesson) => {
            return (
              <div 
                key={lesson.id}
                onClick={() => handleOpenLesson(lesson)}
                className="bg-white rounded-[24px] border border-[#c3c6d6]/60 overflow-hidden bento-hover flex flex-col cursor-pointer relative group shadow-sm hover:border-[#003594]/40"
              >
                {/* Image Canvas Header */}
                <div className="h-48 w-full bg-[#eff4ff] relative overflow-hidden">
                  <img 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    data-alt={lesson.alt} 
                    src={lesson.image}
                    alt={lesson.title}
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Category Chip */}
                  <div className={`absolute top-4 left-4 ${lesson.categoryBg} ${lesson.categoryColor} px-3.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-sm`}>
                    {lesson.category}
                  </div>

                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="bg-white text-[#003594] rounded-full p-3.5 shadow-lg transform group-hover:scale-110 transition-transform">
                      <Play className="w-7 h-7 fill-[#003594] text-[#003594] ml-0.5" />
                    </button>
                  </div>
                </div>

                {/* Card Content & State */}
                <div className="p-4 sm:p-5 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-xl font-bold text-[#0b1c30] mb-1">
                      {lesson.title}
                    </h3>
                    <p className="text-sm text-[#434654]">
                      {lesson.description}
                    </p>
                  </div>

                  {/* Simplified Junior Status Icon Indicator */}
                  <div className="mt-4 flex justify-end items-center">
                    {lesson.status === 'complete' && (
                      <div className="flex items-center gap-1 text-[#10B981] font-semibold text-xs">
                        <CheckCircle2 className="w-7 h-7 fill-[#10B981] text-white" />
                      </div>
                    )}
                    {lesson.status === 'in-progress' && (
                      <div className="flex items-center gap-1 text-[#fabb6b]">
                        <Flame className="w-7 h-7 fill-[#fabb6b] text-[#fabb6b] animate-pulse" />
                      </div>
                    )}
                    {lesson.status === 'not-started' && (
                      <div className="flex items-center gap-1 text-[#737685]">
                        <Circle className="w-6 h-6 text-[#737685]" />
                      </div>
                    )}
                  </div>
                </div>

              </div>
            );
          })}

        </section>

        {/* Portal Feedback & Community Section */}
        <section className="mt-10 glass-panel rounded-[24px] p-5 sm:p-6 bg-[#e5eeff] border border-[#c3c6d6]/60 shadow-sm">
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

          <div className="bg-white rounded-2xl p-5 border-2 border-dashed border-[#c3c6d6] flex flex-col items-center justify-center text-center space-y-3">
            <MessageSquare className="w-10 h-10 text-[#c3c6d6]" />
            <div>
              <p className="text-base sm:text-lg text-[#434654] font-bold">
                Disqus Comments & Parent Community
              </p>
              <p className="text-xs sm:text-sm text-[#737685] mt-0.5">
                Share milestones, voice recordings, and curriculum feedback with educators!
              </p>
            </div>

            {/* Rendered Live Comments */}
            <div className="w-full max-w-xl text-left mt-3 space-y-3">
              {comments.map((c) => (
                <div key={c.id} className="p-3.5 rounded-xl bg-[#f8f9ff] border border-[#eff4ff] text-xs space-y-1">
                  <div className="flex items-center justify-between text-[#003594] font-bold">
                    <span className="flex items-center gap-1.5">
                      <span>{c.avatar}</span>
                      <span>{c.author}</span>
                    </span>
                    <span className="text-[10px] text-[#737685] font-normal">{c.time}</span>
                  </div>
                  <p className="text-[#434654] text-xs">{c.text}</p>
                </div>
              ))}
            </div>
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
          <span className="text-xs font-semibold mt-1">My Lessons</span>
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

      {/* Interactive Lesson Play Modal */}
      {activeLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-[28px] max-w-md w-full p-6 text-center shadow-2xl border-4 border-[#EC4899] space-y-4">
            
            <div className="flex justify-between items-center">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${activeLesson.categoryBg} text-white`}>
                {activeLesson.category}
              </span>
              <button 
                onClick={() => setActiveLesson(null)}
                className="w-8 h-8 rounded-full bg-[#eff4ff] hover:bg-[#dce9ff] flex items-center justify-center text-[#434654]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="w-28 h-28 mx-auto rounded-2xl overflow-hidden shadow-md">
              <img 
                src={activeLesson.image} 
                alt={activeLesson.title} 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer"
              />
            </div>

            <div>
              <h3 className="text-2xl font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[#003594]">
                {activeLesson.title}
              </h3>
              <p className="text-sm text-[#434654] mt-2 leading-relaxed">
                {activeLesson.interactivePrompt}
              </p>
            </div>

            {/* Audio Speech Simulation */}
            <div className="p-3.5 rounded-2xl bg-[#eff4ff] border border-[#dce9ff] flex items-center gap-3 text-left">
              <Volume2 className="w-6 h-6 text-[#EC4899] shrink-0 animate-pulse" />
              <p className="text-xs text-[#003594] font-medium italic">
                "{activeLesson.audioVoiceText}"
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setActiveLesson(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#434654] hover:bg-[#eff4ff]"
              >
                Close
              </button>
              <button
                onClick={() => handleCompleteLesson(activeLesson.id)}
                className="px-6 py-2.5 rounded-full bg-[#10B981] hover:bg-[#059669] text-white font-bold text-sm shadow-md flex items-center gap-1.5 cursor-pointer transition transform hover:scale-105"
              >
                <Star className="w-4 h-4 fill-white" />
                <span>Earn Star! ⭐</span>
              </button>
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
                className="w-7 h-7 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#434654]"
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
