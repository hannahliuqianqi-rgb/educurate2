import React, { useState } from 'react';
import { 
  ArrowLeft, 
  BookOpen, 
  Tv, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  Lock, 
  Star, 
  Save, 
  Play, 
  Pause, 
  Volume2, 
  RotateCcw, 
  Send,
  MessageSquare,
  ThumbsUp,
  Sliders,
  ChevronRight
} from 'lucide-react';
import { QUEST_STEPS } from '../data/mockData';
import { AppView } from '../types';
import confetti from 'canvas-confetti';
import { DisqusComments } from './DisqusComments';

interface QuestPlayerProps {
  onNavigate: (view: AppView) => void;
}

export const QuestPlayer: React.FC<QuestPlayerProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'read' | 'watch'>('read');
  const [journalText, setJournalText] = useState(
    "Key Note: A star is in hydrostatic equilibrium when the outward thermal pressure from nuclear fusion perfectly balances the inward pull of its own gravity."
  );
  const [journalSaved, setJournalSaved] = useState(true);
  const [rating, setRating] = useState<number | null>(4);
  const [difficultyFeedback, setDifficultyFeedback] = useState<'easy' | 'perfect' | 'hard'>('perfect');
  const [mentorModalOpen, setMentorModalOpen] = useState(false);
  const [mentorQuestion, setMentorQuestion] = useState('');
  const [mentorAnswer, setMentorAnswer] = useState<string | null>(null);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [steps, setSteps] = useState(QUEST_STEPS);
  const [currentStepIndex, setCurrentStepIndex] = useState(1); // Step 2 is index 1

  const handleJournalChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJournalText(e.target.value);
    setJournalSaved(false);
    setTimeout(() => setJournalSaved(true), 800);
  };

  const handleApplyAIPrompt = () => {
    const promptSummary = "\n\n[AI Prompt Summary]: Hydrostatic equilibrium acts like a cosmic thermostat. If the core cools, gravity compresses it to heat it up again!";
    setJournalText(prev => prev + promptSummary);
    setJournalSaved(true);
  };

  const handleAskMentor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mentorQuestion.trim()) return;
    setMentorAnswer(
      `Great question! In our Sun, 600 million tons of hydrogen fuse into 596 million tons of helium every second. The missing 4 million tons turn pure energy according to Einstein's E=mc²!`
    );
  };

  const handleAdvanceStep = () => {
    if (currentStepIndex < steps.length - 1) {
      const newSteps = [...steps];
      newSteps[currentStepIndex].status = 'completed';
      newSteps[currentStepIndex + 1].status = 'active';
      setSteps(newSteps);
      setCurrentStepIndex(prev => prev + 1);
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      
      {/* Top Quest Bar */}
      <div className="sticky top-16 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('aspirators')}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                  SCIENCE QUEST
                </span>
                <span className="text-xs text-slate-400 font-medium">The Secrets of Space</span>
              </div>
              <h1 className="text-base sm:text-lg font-bold text-white font-['Outfit']">
                Step {currentStepIndex + 1}: {steps[currentStepIndex].title}
              </h1>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMentorModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Ask AI Mentor</span>
            </button>

            <button
              onClick={handleAdvanceStep}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-purple-500/20 transition cursor-pointer"
            >
              <span>{currentStepIndex === steps.length - 1 ? "Complete Quest" : "Next Step"}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Main Quest Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left / Main Column (8 Cols): Content Area (Read vs Watch) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* View Mode Toggle */}
            <div className="flex items-center justify-between bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveTab('read')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeTab === 'read'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Curated Reading</span>
                </button>

                <button
                  onClick={() => setActiveTab('watch')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeTab === 'watch'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Tv className="w-4 h-4" />
                  <span>Video Lesson (11 min)</span>
                </button>
              </div>

              <div className="text-xs text-slate-400 pr-3 font-mono">
                ⏱️ Estimated Time: 15 min
              </div>
            </div>

            {/* Tab 1: Reading Mode */}
            {activeTab === 'read' && (
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl leading-relaxed text-slate-200">
                
                {/* Hero Illustration / Diagram Box */}
                <div className="relative rounded-2xl bg-gradient-to-tr from-slate-950 via-purple-950/60 to-indigo-950 border border-purple-500/30 p-6 sm:p-8 text-center overflow-hidden">
                  <div className="absolute -top-12 -right-12 w-40 h-40 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 shadow-2xl shadow-orange-500/50 flex items-center justify-center text-4xl animate-pulse">
                      ☀️
                    </div>
                    <h3 className="text-lg font-bold text-white mt-4 font-['Outfit']">
                      Hydrostatic Equilibrium in the Core
                    </h3>
                    <p className="text-xs text-slate-300 max-w-md mt-1">
                      Inward Gravitational Pull ⬇️ is constantly resisted by Outward Thermonuclear Radiation Pressure ⬆️
                    </p>
                  </div>
                </div>

                {/* Section Content */}
                <div className="space-y-4 text-sm sm:text-base text-slate-300 leading-relaxed">
                  <h2 className="text-xl font-bold text-white font-['Outfit']">
                    1. The Main Sequence: A Star’s Golden Years
                  </h2>
                  <p>
                    Once a protostar’s core temperature reaches approximately <strong>15 million Kelvin</strong>, hydrogen nuclei begin smashing together at tremendous velocities, fusing into helium. This process, called <strong>nuclear fusion</strong>, releases incomprehensible amounts of energy.
                  </p>
                  <p>
                    For roughly 90% of its life, a star exists in a state known as the <em>Main Sequence</em>. Our Sun is currently in this stable middle age, having spent the last 4.6 billion years calmly fusing hydrogen in its core.
                  </p>

                  {/* Key Concept Callout Box */}
                  <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-700/50 space-y-2">
                    <div className="flex items-center gap-2 text-purple-300 font-bold text-xs uppercase tracking-wider">
                      <Sparkles className="w-4 h-4" />
                      <span>Key Concept: The Cosmic Thermostat</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200">
                      If the star's core ever compresses and heats up, fusion accelerates, pushing the star outward to cool it back down. If the core expands, fusion slows, and gravity compresses it back. This self-regulating balance keeps stars stable for billions of years!
                    </p>
                  </div>

                  <h3 className="text-lg font-bold text-white font-['Outfit'] pt-2">
                    2. Star Classification: From Cool Red Dwarfs to Blazing Blue Giants
                  </h3>
                  <p>
                    Astronomers categorize stars along the <strong>Hertzsprung-Russell Diagram</strong> using spectral classes: <em>O, B, A, F, G, K, M</em> (remembered as <em>"Oh Be A Fine Girl/Guy, Kiss Me"</em>). Massive blue O-type stars burn through their fuel in a few million years, while tiny red M-type dwarfs can burn slowly for trillions of years!
                  </p>
                </div>

              </div>
            )}

            {/* Tab 2: Video Mode */}
            {activeTab === 'watch' && (
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
                
                {/* Simulated Video Player */}
                <div className="relative aspect-video rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between p-6 overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />
                  
                  {/* Top Video Overlay */}
                  <div className="relative z-10 flex items-center justify-between text-xs text-white/90">
                    <span className="font-semibold bg-black/50 px-2.5 py-1 rounded-lg backdrop-blur">
                      Crash Course Astronomy • Episode 24
                    </span>
                    <span className="bg-purple-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                      1080p HD
                    </span>
                  </div>

                  {/* Center Play Button */}
                  <div className="relative z-10 flex items-center justify-center">
                    <button
                      onClick={() => setIsPlayingVideo(!isPlayingVideo)}
                      className="w-16 h-16 rounded-full bg-purple-600/90 hover:bg-purple-500 text-white flex items-center justify-center shadow-2xl shadow-purple-500/50 hover:scale-110 transition cursor-pointer"
                    >
                      {isPlayingVideo ? (
                        <Pause className="w-8 h-8 fill-white" />
                      ) : (
                        <Play className="w-8 h-8 fill-white translate-x-0.5" />
                      )}
                    </button>
                  </div>

                  {/* Bottom Video Controls Bar */}
                  <div className="relative z-10 space-y-2">
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 w-1/3 rounded-full" />
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <div className="flex items-center gap-3">
                        <button onClick={() => setIsPlayingVideo(!isPlayingVideo)} className="hover:text-white cursor-pointer">
                          {isPlayingVideo ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>
                        <span>04:15 / 11:45</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded">Speed 1.0x</span>
                        <Volume2 className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Video Transcript Highlight */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1 text-xs">
                  <span className="text-purple-400 font-bold uppercase tracking-wider">Live Transcript</span>
                  <p className="text-slate-300">
                    "...and so when you look up at our daytime sky, you're observing a nuclear explosion held completely intact by its own immense mass and gravity!"
                  </p>
                </div>

              </div>
            )}

          </div>

          {/* Right Column (4 Cols): Interactive Journal & Adaptive Feedback */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* My Journal Card */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-purple-400" />
                  <h3 className="font-bold text-white text-sm">My Explorer Journal</h3>
                </div>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Save className="w-3 h-3 text-emerald-400" />
                  {journalSaved ? 'Saved' : 'Saving...'}
                </span>
              </div>

              <textarea
                value={journalText}
                onChange={handleJournalChange}
                rows={6}
                placeholder="Write your notes, insights, or questions..."
                className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-purple-500 leading-relaxed resize-none"
              />

              {/* AI Suggestion Helper */}
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> AI Summary Helper
                  </span>
                  <button
                    onClick={handleApplyAIPrompt}
                    className="text-[11px] text-purple-400 hover:text-purple-300 font-bold cursor-pointer"
                  >
                    + Insert Note
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  "Try summarizing how gravitational equilibrium prevents a star from collapsing."
                </p>
              </div>
            </div>

            {/* Rate Lesson & Adaptive Calibration */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-emerald-400" />
                  <span>Adaptive Lesson Feedback</span>
                </h3>
              </div>

              <p className="text-xs text-slate-400">
                How did this step feel? The AI curator will adjust future exercises automatically.
              </p>

              {/* Difficulty Options */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setDifficultyFeedback('easy')}
                  className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    difficultyFeedback === 'easy'
                      ? 'bg-sky-500 text-slate-950 font-extrabold shadow-sm'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Too Easy
                </button>

                <button
                  onClick={() => setDifficultyFeedback('perfect')}
                  className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    difficultyFeedback === 'perfect'
                      ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-sm'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Just Right
                </button>

                <button
                  onClick={() => setDifficultyFeedback('hard')}
                  className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    difficultyFeedback === 'hard'
                      ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Too Hard
                </button>
              </div>

              {/* Star Rating */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-slate-400">Lesson Rating:</span>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      onClick={() => setRating(s)}
                      className="cursor-pointer transition-transform hover:scale-125"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          rating && s <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quest Map Progress */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
              <h3 className="font-bold text-white text-sm">Quest Map</h3>
              <div className="space-y-2.5">
                {steps.map((step, idx) => (
                  <div
                    key={step.id}
                    onClick={() => {
                      if (step.status !== 'locked') setCurrentStepIndex(idx);
                    }}
                    className={`p-3 rounded-xl border flex items-center justify-between text-xs transition cursor-pointer ${
                      idx === currentStepIndex
                        ? 'bg-purple-950/60 border-purple-500/50 text-white font-bold'
                        : step.status === 'completed'
                        ? 'bg-slate-800/60 border-slate-700/60 text-slate-300'
                        : 'bg-slate-950/40 border-slate-800 text-slate-500 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {step.status === 'completed' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : step.status === 'active' ? (
                        <div className="w-4 h-4 rounded-full bg-purple-500 animate-ping" />
                      ) : (
                        <Lock className="w-4 h-4 text-slate-500" />
                      )}
                      <span>{step.id}. {step.title}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{step.duration}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Interactive Community Discussion Thread for Quest */}
          <div className="mt-12 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-purple-400" />
                  <span>Quest Discussions &amp; Student Questions</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Discuss stellar equilibrium, share astrophysics insights, or ask questions to fellow peers.
                </p>
              </div>
            </div>
            <DisqusComments 
              pageIdentifier="educurate-quest-player"
              pageTitle="EduCurate - Stellar Astrophysics Quest Community"
              pageUrl="https://educurate-vy74.vercel.app/#quest_player"
            />
          </div>

        </div>
      </div>

      {/* AI Mentor Popover Drawer / Modal */}
      {mentorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-purple-500/40 rounded-3xl w-full max-w-lg p-6 text-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-purple-400 font-bold">
                <Sparkles className="w-5 h-5" />
                <span>AI Astrophysics Mentor</span>
              </div>
              <button
                onClick={() => setMentorModalOpen(false)}
                className="text-xs text-slate-400 hover:text-white px-2 py-1 bg-slate-800 rounded-lg cursor-pointer"
              >
                Close
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Ask anything about stellar fusion, the life cycle of stars, or how our Sun generates light!
            </p>

            <form onSubmit={handleAskMentor} className="space-y-3">
              <input
                type="text"
                placeholder="e.g., How much hydrogen does the Sun fuse every second?"
                value={mentorQuestion}
                onChange={(e) => setMentorQuestion(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <span>Ask Question</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            {mentorAnswer && (
              <div className="p-4 rounded-xl bg-purple-950/60 border border-purple-800/60 text-xs text-purple-200 space-y-2 animate-fadeIn">
                <p className="font-bold text-purple-300">Mentor Explanation:</p>
                <p className="leading-relaxed">{mentorAnswer}</p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
