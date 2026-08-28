import React, { useState } from 'react';
import { AppView } from '../types';
import confetti from 'canvas-confetti';

interface AspiratorsPortalProps {
  onNavigate: (view: AppView) => void;
}

export const AspiratorsPortal: React.FC<AspiratorsPortalProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [challengeAnswer, setChallengeAnswer] = useState('');
  const [challengeSuccess, setChallengeSuccess] = useState(false);

  // Student Community comments state
  const [comments, setComments] = useState<Array<{ id: string; author: string; avatar: string; time: string; text: string; likes: number }>>([
    {
      id: 'c1',
      author: 'Maya S. (Explorer Level 5)',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvaB_9twUHkaWcUZsvVSY2gUCslhXIq0cgJrZgEoDKiQfFDHAMDrhsqX0du1mBxYGN7FsWXcfuwUQ9dQzzSLu-MkPyLquCyO1fqwEkAlOxGIUmKGrX0Bn_cJIJ_h6TwAy5CACtKd4x8Efmlxs3_UXPP3YmfyNB3EQ0JP_2g5C4NalRiO43t2dmLgOrD_boJVivpy_319fJl6By2Ibt0oIFAIQygHPvJr_-5bo7HcBKzaayUcm3IW1q',
      time: '2 hours ago',
      text: 'The interactive 3D simulation of Mars gravity in the Space quest was so fun! Can we have more astrophysics quizzes?',
      likes: 8
    },
    {
      id: 'c2',
      author: 'Lucas Tan (Explorer Level 3)',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCf6CXddibvXAVRe-7SgqIT8t-otAqPF9UzmPtbdGfEI56Qoj4XOz34vTMmxgLCrqN9n8slbI8hFChz-C_8h-VEd2hKGIphta02o3UpAQN5DdEvdwERVaqFtZRHMGYUj2b5HoMsqxXxQ5jM7x8nMLqgM9ks0BuFY8oLi6gABUGKNW6CjpQSpeh6Tt1vmmZXY1VDK6S5tXpQ_9DIqRawsuK1jdUrhkUWON63GuydLz75tLhnydUdbAjL',
      time: '5 hours ago',
      text: 'Just unlocked the Dino Expert badge after completing the Cretaceous period journey! 🦖',
      likes: 14
    }
  ]);
  const [newCommentText, setNewCommentText] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('quest_player');
    }
  };

  const handleChallengeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!challengeAnswer.trim()) return;
    setChallengeSuccess(true);
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 }
    });
    setTimeout(() => {
      setShowChallengeModal(false);
      setChallengeSuccess(false);
      setChallengeAnswer('');
    }, 1800);
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    const newEntry = {
      id: `c-${Date.now()}`,
      author: 'You (Aspirator Explorer)',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALH4lMQsn4vYJk079fD9AXrLslwWzvrlJdQOJ3qiELbUxHY4-q8tLDQfgnk_f2BSxkN_HYR8Fw_lFnfW2WNRFeIEF6BKWdyu9dhRmWqBp_D9PdQ1O9QG3jAfANCh_Y5M8kxB78yJ6PfmDSxNKiGeMc1oUyvL0Xu59Iiae5eMoR4UP2103FfmT0RVY-XsJSXw_fqpVyxmHi2ckRuXOX-w6ZARJEg6P4VXbggxPjJimDh0eTxQvc8epm',
      time: 'Just now',
      text: newCommentText.trim(),
      likes: 1
    };
    setComments([newEntry, ...comments]);
    setNewCommentText('');
  };

  return (
    <div className="bg-surface text-on-surface font-body-md text-body-md antialiased min-h-screen flex flex-col selection:bg-primary-ed selection:text-white">
      
      {/* TopNavBar */}
      <header className="bg-surface-container-lowest border-b border-outline-variant shadow-sm sticky top-0 z-50 transition-colors">
        <div className="flex justify-between items-center px-margin-desktop h-16 max-w-container-max mx-auto w-full">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => onNavigate('landing')}>
            <div className="text-headline-md font-headline-md font-bold text-primary flex items-baseline gap-2">
              EduCurate
              <span className="text-label-md font-label-md text-primary-ed bg-primary-fixed px-2 py-0.5 rounded-full">
                Aspirators
              </span>
            </div>
          </div>

          <nav className="hidden md:flex gap-8 items-center h-full">
            <button 
              onClick={() => onNavigate('landing')}
              className="text-on-surface-variant hover:text-primary transition-colors h-full flex items-center font-label-md text-label-md bg-transparent border-none cursor-pointer"
            >
              Dashboard
            </button>
            <button 
              onClick={() => onNavigate('aspirators')}
              className="text-primary border-b-2 border-primary pb-1 h-full flex items-center font-label-md text-label-md scale-95 transition-transform duration-150 font-bold bg-transparent border-none cursor-pointer"
            >
              Discovery
            </button>
            <button 
              onClick={() => onNavigate('learning_plan')}
              className="text-on-surface-variant hover:text-primary transition-colors h-full flex items-center font-label-md text-label-md bg-transparent border-none cursor-pointer"
            >
              My Library
            </button>
          </nav>

          <div className="flex items-center gap-4">
            <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" data-icon="search">search</span>
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-full bg-surface-container-low border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary text-body-md w-48 transition-all focus:w-64 outline-none text-on-surface" 
                placeholder="Search..." 
                type="text"
              />
            </form>
            <button 
              onClick={() => onNavigate('parent_dashboard')}
              className="bg-primary text-on-primary font-label-md text-label-md px-4 py-2 rounded-lg hover:bg-surface-tint transition-colors cursor-pointer border-none shadow-sm"
            >
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow pt-8 pb-16 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
        
        {/* Hero Section */}
        <section className="mb-stack-lg flex flex-col items-center text-center">
          <h1 className="font-display-lg text-display-lg text-primary mb-stack-sm md:mt-8">Hello, Aspirator!</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mb-stack-md">
            Welcome to your discovery portal. The universe is huge and full of exciting things to learn.
          </p>
          
          <form onSubmit={handleSearchSubmit} className="w-full max-w-2xl relative shadow-sm rounded-full">
            <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-primary text-3xl" data-icon="explore">explore</span>
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-14 py-4 rounded-full bg-surface-container-lowest border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim text-body-lg font-body-lg shadow-sm transition-all text-on-surface placeholder:text-on-surface-variant/70 outline-none" 
              placeholder="What do you want to discover today?" 
              type="text"
            />
            <button 
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-on-primary p-3 rounded-full hover:bg-surface-tint transition-transform hover:scale-105 shadow-md flex items-center justify-center cursor-pointer border-none"
            >
              <span className="material-symbols-outlined" data-icon="arrow_forward">arrow_forward</span>
            </button>
          </form>
        </section>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          
          {/* Main Content Area (9 cols) */}
          <div className="lg:col-span-9 flex flex-col gap-stack-lg">
            
            {/* Featured Quest */}
            <section>
              <h2 className="font-headline-md text-headline-md text-on-surface mb-stack-md flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary-ed" data-icon="local_activity" style={{ fontVariationSettings: "'FILL' 1" }}>local_activity</span>
                Quest of the Week
              </h2>
              
              <div 
                onClick={() => onNavigate('quest_player')}
                className="relative bg-surface-container-lowest border border-outline-variant rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col md:flex-row cursor-pointer"
              >
                <div className="w-full md:w-2/5 h-48 md:h-auto relative overflow-hidden">
                  <img 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    alt="Space Quest preview" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSL3AXFQ6pqnVC8ZsiTyUTfxXSs1-mHmWexqW9HKxQ6iCd8N7gltVCc2s-fH-s3Znh3FYbtZRqjhVGf0QTtE86YoACcSBILmqCP5JrajRnuCOgC9seeJ9QAawsdO4YCw78r3sCC2ccFLCRsrSjL1IOKZE-7k9jh-003CUJ0-jkOW3Ns5VMgz-OSwO3A8fNV3QWK-MbT3xmcUk-4wr2nNZ2MSAN31tjGAGjHcRFjPK5Jg7nUt4OLOKk"
                  />
                  <div className="absolute top-4 left-4 bg-secondary-ed text-white px-3 py-1 rounded-full font-label-md text-label-md shadow-md flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm" data-icon="rocket_launch">rocket_launch</span> Space
                  </div>
                </div>
                
                <div className="p-stack-lg flex flex-col justify-center w-full md:w-3/5 bg-gradient-to-br from-surface-container-lowest to-surface-container-low">
                  <h3 className="font-headline-lg text-headline-lg text-primary mb-2">The Secrets of Space</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-6 line-clamp-3">
                    Embark on a journey through the cosmos! Learn about black holes, how stars are born, and what it takes to be an astronaut on a mission to Mars.
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2 text-on-surface-variant">
                      <span className="material-symbols-outlined text-status-progress" data-icon="schedule">schedule</span>
                      <span className="font-label-md text-label-md font-semibold">45 mins</span>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate('quest_player');
                      }}
                      className="bg-primary text-on-primary font-label-md text-label-md px-6 py-3 rounded-xl hover:bg-surface-tint transition-all flex items-center gap-2 hover:-translate-y-1 shadow-sm cursor-pointer border-none font-bold"
                    >
                      Start Discovery
                      <span className="material-symbols-outlined" data-icon="play_arrow">play_arrow</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Subject Islands (Bento Grid Style) */}
            <section>
              <h2 className="font-headline-md text-headline-md text-on-surface mb-stack-md flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-ed" data-icon="map" style={{ fontVariationSettings: "'FILL' 1" }}>map</span>
                Explore the Subject Islands
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[160px]">
                
                {/* Nature & Animals */}
                <div 
                  onClick={() => onNavigate('quest_player')}
                  className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-4 relative overflow-hidden group hover:shadow-md transition-all cursor-pointer row-span-2 flex flex-col justify-end"
                >
                  <div className="absolute inset-0 z-0">
                    <div 
                      className="bg-cover bg-center w-full h-full opacity-40 group-hover:opacity-60 transition-opacity" 
                      style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAErgZdy6vPBAe9bunET-C-8sMA6QZeK6MiYV-3qEt9DkbsoMxsNryth7U5pGU4fukiFy_oVY3MG5Yw1wdmouZp5mUaXu_BTtgqzbTqpDgVeSm6Sdrddx5CoCKQqT-yudGolgW3mllgksE66hKx_w-zCEJ0fKggkbUgkcKiPEAfXNTSFlfyNuLIHobqTZgCDf5BRPrDprZJUK1zWup9aAJYfogvGxjeIRIo2rWVvjcHTxL75nGf6rCY')" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/80 to-transparent"></div>
                  </div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-status-complete/20 rounded-full flex items-center justify-center mb-3">
                      <span className="material-symbols-outlined text-status-complete text-3xl" data-icon="pets" style={{ fontVariationSettings: "'FILL' 1" }}>pets</span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-1 group-hover:text-status-complete transition-colors">Nature & Animals</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant text-sm">Discover the wild world.</p>
                  </div>
                </div>

                {/* Space & Stars */}
                <div 
                  onClick={() => onNavigate('quest_player')}
                  className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-4 relative overflow-hidden group hover:shadow-md transition-all cursor-pointer flex flex-col justify-end"
                >
                  <div className="absolute right-[-20px] top-[-20px] w-32 h-32 bg-secondary-ed/10 rounded-full group-hover:scale-150 transition-transform duration-500 pointer-events-none"></div>
                  <div className="relative z-10 flex items-center gap-4">
                    <div className="w-12 h-12 bg-secondary-ed/20 rounded-full flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-secondary-ed text-2xl" data-icon="public" style={{ fontVariationSettings: "'FILL' 1" }}>public</span>
                    </div>
                    <div>
                      <h3 className="font-label-md text-label-md text-on-surface group-hover:text-secondary-ed transition-colors text-lg font-bold">Space & Stars</h3>
                      <p className="font-caption text-caption text-on-surface-variant">Look to the skies.</p>
                    </div>
                  </div>
                </div>

                {/* Numbers & Logic */}
                <div 
                  onClick={() => onNavigate('curator_ai')}
                  className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-4 relative overflow-hidden group hover:shadow-md transition-all cursor-pointer flex flex-col justify-end"
                >
                  <div className="absolute right-[-20px] top-[-20px] w-32 h-32 bg-primary-ed/10 rounded-full group-hover:scale-150 transition-transform duration-500 pointer-events-none"></div>
                  <div className="relative z-10 flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-ed/20 rounded-full flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary-ed text-2xl" data-icon="calculate" style={{ fontVariationSettings: "'FILL' 1" }}>calculate</span>
                    </div>
                    <div>
                      <h3 className="font-label-md text-label-md text-on-surface group-hover:text-primary-ed transition-colors text-lg font-bold">Numbers & Logic</h3>
                      <p className="font-caption text-caption text-on-surface-variant">Solve the puzzles.</p>
                    </div>
                  </div>
                </div>

                {/* Stories & Writing */}
                <div 
                  onClick={() => onNavigate('learning_plan')}
                  className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-4 relative overflow-hidden group hover:shadow-md transition-all cursor-pointer sm:col-span-2 flex flex-col justify-end"
                >
                  <div className="absolute inset-y-0 right-0 w-1/2 opacity-30 group-hover:opacity-50 transition-opacity">
                    <img 
                      className="w-full h-full object-contain object-right" 
                      alt="Stories illustration" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuACvvs8cML94I1LIfBWa2xdQ4M7ebi5GWGCR2KLSkRlkSMlgFXj3Tog4BtDe70gvSyq5oa8GR0TNQKNgeRBu5OcY-l42210329_5Pzz4JUjqBS8VFy4IEdTcq1ZUN6PUocrRX8rq8zR5Sx8xIyhfLwGHTLE_93kK2K-R3GjmoBvI2IHbCBTuBm-x-s97Yj4TZmWWBn0p0C9DbUTi0mbmmPIqbpBHvbvVfgn-WsFxXFWoBVJLYILKqbK"
                    />
                  </div>
                  <div className="relative z-10 w-2/3">
                    <div className="w-12 h-12 bg-tertiary-fixed-dim/30 rounded-full flex items-center justify-center mb-2">
                      <span className="material-symbols-outlined text-tertiary-container text-2xl" data-icon="menu_book" style={{ fontVariationSettings: "'FILL' 1" }}>menu_book</span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-1 group-hover:text-tertiary-container transition-colors">Stories & Writing</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant text-sm">Craft your own adventures.</p>
                  </div>
                </div>

              </div>
            </section>

          </div>

          {/* Sidebar / My Progress (3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-stack-md">
            
            {/* My Progress Card */}
            <div className="bg-surface-container-lowest rounded-[24px] border border-outline-variant p-stack-md shadow-sm">
              <h3 className="font-headline-md text-headline-md text-on-surface mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary" data-icon="military_tech">military_tech</span>
                My Progress
              </h3>
              
              <div className="mb-6">
                <div className="flex justify-between items-end mb-2">
                  <span className="font-label-md text-label-md text-on-surface font-bold">Explorer Level 4</span>
                  <span className="font-caption text-caption text-on-surface-variant font-semibold">1,200 / 1,500 XP</span>
                </div>
                <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full bg-status-progress w-[80%] rounded-full"></div>
                </div>
              </div>

              <h4 className="font-label-md text-label-md text-on-surface mb-3 border-b border-outline-variant pb-2 font-bold">Recent Badges</h4>
              <div className="flex gap-2 flex-wrap mb-6">
                <div className="w-12 h-12 bg-secondary-fixed rounded-full flex items-center justify-center border-2 border-secondary-fixed-dim" title="Dino Expert">
                  <span className="material-symbols-outlined text-on-secondary-fixed" data-icon="cruelty_free">cruelty_free</span>
                </div>
                <div className="w-12 h-12 bg-primary-fixed rounded-full flex items-center justify-center border-2 border-primary-fixed-dim" title="Math Whiz">
                  <span className="material-symbols-outlined text-on-primary-fixed" data-icon="functions">functions</span>
                </div>
                <div className="w-12 h-12 bg-surface-container-high rounded-full flex items-center justify-center border-2 border-outline-variant border-dashed opacity-50" title="Locked Badge">
                  <span className="material-symbols-outlined text-on-surface-variant" data-icon="lock">lock</span>
                </div>
              </div>

              <h4 className="font-label-md text-label-md text-on-surface mb-3 border-b border-outline-variant pb-2 font-bold">Recent Discoveries</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-status-complete/20 flex items-center justify-center shrink-0 mt-1">
                    <span className="material-symbols-outlined text-status-complete text-sm" data-icon="done">done</span>
                  </div>
                  <div>
                    <p className="font-label-md text-label-md text-on-surface text-sm font-semibold">How do volcanoes work?</p>
                    <p className="font-caption text-caption text-on-surface-variant">Completed yesterday</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-surface-container-high flex items-center justify-center shrink-0 mt-1">
                    <span className="material-symbols-outlined text-primary text-sm" data-icon="play_arrow">play_arrow</span>
                  </div>
                  <div>
                    <p className="font-label-md text-label-md text-on-surface text-sm font-semibold">The Deep Ocean</p>
                    <p className="font-caption text-caption text-on-surface-variant">50% finished</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Daily Challenge Card */}
            <div className="bg-gradient-to-br from-primary-container to-surface-tint rounded-[24px] p-stack-md text-on-primary shadow-sm relative overflow-hidden">
              <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-8xl text-white/10" data-icon="lightbulb">lightbulb</span>
              <h4 className="font-headline-md text-headline-md mb-2 relative z-10 font-bold">Daily Challenge</h4>
              <p className="font-body-md text-body-md text-white/90 mb-4 relative z-10 text-sm">
                Can you name 3 planets made of gas? Earn 50 bonus XP!
              </p>
              <button 
                onClick={() => setShowChallengeModal(true)}
                className="bg-white text-primary font-label-md text-label-md px-4 py-2.5 rounded-lg w-full hover:bg-surface-bright transition-colors relative z-10 shadow-sm font-bold cursor-pointer border-none"
              >
                Accept Challenge
              </button>
            </div>

          </div>

        </div>

        {/* Student Community & Portal Feedback Section */}
        <section className="mt-stack-lg border-t border-outline-variant pt-8">
          <div className="flex items-center justify-between mb-stack-md flex-wrap gap-2">
            <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary-ed" data-icon="forum">forum</span>
              Portal Feedback & Student Community
            </h2>
            <span className="text-caption text-on-surface-variant font-semibold bg-surface-container-high px-3 py-1 rounded-full">
              Live Discussion
            </span>
          </div>

          {/* Interactive Community Comment Box */}
          <div className="bg-surface-container-low rounded-[24px] p-stack-md md:p-stack-lg border border-outline-variant shadow-sm space-y-6">
            
            {/* New Comment Input */}
            <form onSubmit={handlePostComment} className="flex gap-3 items-start">
              <img 
                className="w-10 h-10 rounded-full object-cover border border-outline-variant"
                alt="Avatar"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuALH4lMQsn4vYJk079fD9AXrLslwWzvrlJdQOJ3qiELbUxHY4-q8tLDQfgnk_f2BSxkN_HYR8Fw_lFnfW2WNRFeIEF6BKWdyu9dhRmWqBp_D9PdQ1O9QG3jAfANCh_Y5M8kxB78yJ6PfmDSxNKiGeMc1oUyvL0Xu59Iiae5eMoR4UP2103FfmT0RVY-XsJSXw_fqpVyxmHi2ckRuXOX-w6ZARJEg6P4VXbggxPjJimDh0eTxQvc8epm"
              />
              <div className="flex-1 space-y-2">
                <textarea 
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="Share your discovery insights or suggest next quests to explore..."
                  rows={2}
                  className="w-full p-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-body-md resize-none shadow-inner"
                />
                <div className="flex justify-end">
                  <button 
                    type="submit"
                    className="bg-primary text-on-primary font-label-md px-5 py-2 rounded-xl hover:bg-surface-tint transition-all cursor-pointer border-none font-bold shadow-sm"
                  >
                    Post Feedback
                  </button>
                </div>
              </div>
            </form>

            {/* Comment Thread List */}
            <div className="space-y-4 pt-4 border-t border-outline-variant/60">
              {comments.map((c) => (
                <div key={c.id} className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/80 flex gap-3.5 shadow-sm">
                  <img src={c.avatar} alt={c.author} className="w-9 h-9 rounded-full object-cover shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-on-surface text-label-md">{c.author}</span>
                      <span className="text-caption text-on-surface-variant font-medium">{c.time}</span>
                    </div>
                    <p className="text-body-md text-on-surface-variant mb-2">{c.text}</p>
                    <div className="flex items-center gap-4 text-caption text-on-surface-variant">
                      <button 
                        onClick={() => {
                          setComments(comments.map(item => item.id === c.id ? { ...item, likes: item.likes + 1 } : item));
                        }}
                        className="hover:text-primary flex items-center gap-1 font-semibold cursor-pointer border-none bg-transparent"
                      >
                        <span className="material-symbols-outlined text-[16px]">thumb_up</span>
                        {c.likes} Likes
                      </button>
                      <button className="hover:text-primary font-semibold cursor-pointer border-none bg-transparent">Reply</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

      </main>

      {/* Daily Challenge Modal */}
      {showChallengeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl w-full max-w-md p-6 text-on-surface shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary" data-icon="lightbulb">lightbulb</span>
                <h3 className="font-headline-md font-bold text-primary">Daily Challenge</h3>
              </div>
              <span className="bg-primary-fixed text-on-primary-fixed font-bold text-caption px-2.5 py-1 rounded-full">+50 XP</span>
            </div>

            <p className="text-body-md text-on-surface-variant">
              <strong>Question:</strong> Can you name 3 planets made of gas in our Solar System?
            </p>

            {challengeSuccess ? (
              <div className="p-4 rounded-2xl bg-status-complete/20 border border-status-complete text-status-complete font-bold text-center text-body-md">
                🎉 Correct! +50 XP added to Explorer Level 4!
              </div>
            ) : (
              <form onSubmit={handleChallengeSubmit} className="space-y-4">
                <input 
                  type="text"
                  value={challengeAnswer}
                  onChange={(e) => setChallengeAnswer(e.target.value)}
                  placeholder="e.g. Jupiter, Saturn, Uranus, Neptune"
                  className="w-full p-3 rounded-xl border border-outline-variant bg-surface-muted text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button 
                    type="button" 
                    onClick={() => setShowChallengeModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-outline-variant text-on-surface-variant font-bold text-label-md cursor-pointer hover:bg-surface-container-high"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-label-md cursor-pointer hover:bg-surface-tint shadow-sm"
                  >
                    Submit Answer
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-surface-container-high border-t border-outline-variant w-full py-stack-lg px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-gutter flat no shadows mt-auto">
        <div className="text-headline-md font-headline-md font-bold text-on-surface">EduCurate</div>
        <div className="font-body-md text-body-md text-on-surface-variant text-center">
          © 2026 EduCurate Learning Platform. Curated Clarity for every learner.
        </div>
        <nav className="flex gap-4 font-caption text-caption">
          <button onClick={() => onNavigate('landing')} className="text-on-surface-variant hover:text-primary underline transition-all bg-transparent border-none cursor-pointer">
            Privacy Policy
          </button>
          <button onClick={() => onNavigate('landing')} className="text-on-surface-variant hover:text-primary underline transition-all bg-transparent border-none cursor-pointer">
            Terms of Service
          </button>
          <button onClick={() => onNavigate('parent_dashboard')} className="text-on-surface-variant hover:text-primary underline transition-all bg-transparent border-none cursor-pointer">
            Guardian Controls
          </button>
          <button onClick={() => onNavigate('curator_ai')} className="text-on-surface-variant hover:text-primary underline transition-all bg-transparent border-none cursor-pointer">
            AI Guide
          </button>
        </nav>
      </footer>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-margin-mobile py-2 pb-safe bg-surface-container-lowest shadow-[0_-4px_20px_rgba(0,0,0,0.05)] shadow-lg rounded-t-xl border-t border-outline-variant">
        <button 
          onClick={() => onNavigate('landing')}
          className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1 active:bg-surface-variant transition-colors rounded-lg bg-transparent border-none cursor-pointer"
        >
          <span className="material-symbols-outlined mb-1" data-icon="home">home</span>
          <span className="font-label-md text-tiny">Home</span>
        </button>
        <button 
          onClick={() => onNavigate('aspirators')}
          className="flex flex-col items-center justify-center bg-primary-container text-on-primary rounded-2xl px-4 py-1 scale-90 transition-transform duration-200 border-none cursor-pointer"
        >
          <span className="material-symbols-outlined mb-1" data-icon="explore" style={{ fontVariationSettings: "'FILL' 1" }}>explore</span>
          <span className="font-label-md text-tiny font-bold">Explore</span>
        </button>
        <button 
          onClick={() => onNavigate('learning_plan')}
          className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1 active:bg-surface-variant transition-colors rounded-lg bg-transparent border-none cursor-pointer"
        >
          <span className="material-symbols-outlined mb-1" data-icon="local_library">local_library</span>
          <span className="font-label-md text-tiny">Library</span>
        </button>
        <button 
          onClick={() => onNavigate('parent_dashboard')}
          className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1 active:bg-surface-variant transition-colors rounded-lg bg-transparent border-none cursor-pointer"
        >
          <span className="material-symbols-outlined mb-1" data-icon="person">person</span>
          <span className="font-label-md text-tiny">Profile</span>
        </button>
      </nav>

    </div>
  );
};
