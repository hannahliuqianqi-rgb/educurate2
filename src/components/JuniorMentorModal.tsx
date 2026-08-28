import React, { useState } from 'react';
import { X, Mic, Volume2, Sparkles, Music, BookOpen, Smile, Play, Star } from 'lucide-react';

interface JuniorMentorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JuniorMentorModal: React.FC<JuniorMentorModalProps> = ({ isOpen, onClose }) => {
  const [isListening, setIsListening] = useState(false);
  const [mentorText, setMentorText] = useState("Hi, Leo! 👋 What shall we play today? Ask me about roaring lions, blue whales, or rocket ships!");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTopicClick = (topic: string, reply: string) => {
    setSelectedCategory(topic);
    setMentorText(reply);
    
    // Play Web Speech synthesis if available
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(reply);
      utterance.rate = 0.95;
      utterance.pitch = 1.2; // cute kid-friendly tone
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleMic = () => {
    if (!isListening) {
      setIsListening(true);
      setMentorText("I'm listening! Tell me what you're curious about... 🎧");
      setTimeout(() => {
        setIsListening(false);
        const kidReplies = [
          "Lions live in big family groups called prides! The daddy lion has a big fluffy mane! 🦁",
          "Space is super big and full of glowing twinkling stars! Can you count 5 stars with me? ⭐",
          "Blue is everywhere! Look at the ocean and the blue sky. What is your favorite blue toy? 🐳"
        ];
        const randomReply = kidReplies[Math.floor(Math.random() * kidReplies.length)];
        setMentorText(randomReply);
        
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(randomReply);
          utterance.rate = 0.95;
          utterance.pitch = 1.2;
          window.speechSynthesis.speak(utterance);
        }
      }, 3000);
    } else {
      setIsListening(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-sky-400 via-indigo-600 to-purple-800 p-6 text-white shadow-2xl border-4 border-white/40 overflow-hidden font-['Fredoka',sans-serif]">
        
        {/* Playful Floating Circles & Stars */}
        <div className="absolute top-2 left-6 w-12 h-12 bg-white/20 rounded-full blur-sm pointer-events-none" />
        <div className="absolute bottom-10 right-4 w-16 h-16 bg-amber-400/30 rounded-full blur-md pointer-events-none" />
        <div className="absolute top-1/2 left-2 text-2xl animate-bounce">⭐</div>
        <div className="absolute top-20 right-8 text-2xl animate-pulse">✨</div>

        {/* Top Header */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/30">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span className="text-sm font-bold tracking-wide">Leo's AI Playmate</span>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 border border-white/40 flex items-center justify-center text-white transition cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Mascot Robot Centerpiece */}
        <div className="my-6 flex flex-col items-center justify-center text-center relative z-10">
          <div className="relative group">
            {/* Robot Mascot Body */}
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-tr from-amber-300 via-orange-400 to-yellow-200 border-4 border-white shadow-xl flex items-center justify-center text-5xl sm:text-6xl animate-bounce duration-1000">
              🤖
            </div>
            {/* Antenna / Sparkle */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-white text-indigo-700 text-xs font-extrabold shadow">
              READY!
            </div>
          </div>

          {/* Speech Bubble */}
          <div className="mt-5 relative w-full bg-white text-slate-800 rounded-3xl p-5 shadow-xl border-4 border-amber-300">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-b-8 border-b-white" />
            <p className="text-base sm:text-lg font-bold leading-snug">
              {mentorText}
            </p>
          </div>
        </div>

        {/* Category Play Buttons */}
        <div className="grid grid-cols-3 gap-2.5 my-4 relative z-10">
          <button
            onClick={() => handleTopicClick("Animals", "Roar! Lion cubs love wrestling and playing tag on the warm grass. Want to hear a lion roar? 🦁")}
            className="p-3 rounded-2xl bg-white/20 hover:bg-white/30 border-2 border-white/40 flex flex-col items-center gap-1 transition cursor-pointer hover:scale-105"
          >
            <span className="text-2xl">🦁</span>
            <span className="text-xs font-bold">Animals</span>
          </button>

          <button
            onClick={() => handleTopicClick("Space", "3... 2... 1... Blast off! 🚀 Rockets burn fuel super fast to fly high above the fluffy clouds!")}
            className="p-3 rounded-2xl bg-white/20 hover:bg-white/30 border-2 border-white/40 flex flex-col items-center gap-1 transition cursor-pointer hover:scale-105"
          >
            <span className="text-2xl">🚀</span>
            <span className="text-xs font-bold">Space</span>
          </button>

          <button
            onClick={() => handleTopicClick("Stories", "Once upon a time, a tiny blue dragon named Pip discovered a cave made of glowing crystal candies! 📖")}
            className="p-3 rounded-2xl bg-white/20 hover:bg-white/30 border-2 border-white/40 flex flex-col items-center gap-1 transition cursor-pointer hover:scale-105"
          >
            <span className="text-2xl">📖</span>
            <span className="text-xs font-bold">Storytime</span>
          </button>
        </div>

        {/* Interactive Talk Action */}
        <div className="mt-6 flex flex-col items-center gap-3 relative z-10">
          <button
            onClick={toggleMic}
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-white flex items-center justify-center text-white transition-all transform cursor-pointer ${
              isListening
                ? 'bg-rose-500 scale-110 shadow-2xl shadow-rose-500/80 animate-pulse'
                : 'bg-gradient-to-tr from-amber-400 to-orange-500 shadow-xl shadow-orange-500/50 hover:scale-110'
            }`}
          >
            <Mic className={`w-8 h-8 sm:w-10 sm:h-10 ${isListening ? 'animate-bounce' : ''}`} />
          </button>
          <span className="text-xs sm:text-sm font-bold tracking-wide text-white/90">
            {isListening ? "Listening to Leo... Tap to send!" : "Tap the Big Mic & Talk to Me!"}
          </span>
        </div>

      </div>
    </div>
  );
};
