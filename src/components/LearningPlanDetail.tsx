import React, { useState } from 'react';
import { AppView } from '../types';
import confetti from 'canvas-confetti';

interface LearningPlanDetailProps {
  onNavigate: (view: AppView) => void;
}

export const LearningPlanDetail: React.FC<LearningPlanDetailProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'form' | 'chat'>('form');
  const [ageGroup, setAgeGroup] = useState<string>('early_childhood');
  const [topic, setTopic] = useState<string>('Quantum Physics & Quantum Circuits');
  const [proficiency, setProficiency] = useState<string>('intermediate');
  const [duration, setDuration] = useState<string>('30 Days');
  const [dailyEffort, setDailyEffort] = useState<string>('30 mins/day');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleGeneratePlan = (e: React.FormEvent) => {
    e.preventDefault();
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });
    setToastMessage('Personalized Learning Plan successfully generated!');
    setTimeout(() => {
      setToastMessage(null);
      onNavigate('curator_ai');
    }, 1200);
  };

  return (
    <div className="bg-background text-on-background h-full font-body-md text-body-md overflow-x-hidden antialiased flex min-h-screen">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-primary text-on-primary px-5 py-3 rounded-2xl shadow-2xl font-bold flex items-center gap-2 animate-fade-in-up">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* SideNavBar */}
      <nav className="bg-surface-muted border-r border-outline-variant docked left-0 h-full w-64 hidden md:flex flex-col fixed left-0 top-0 h-full p-stack-md z-40">
        <div className="mb-stack-lg flex items-center gap-3 px-2 cursor-pointer" onClick={() => onNavigate('landing')}>
          <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
            <img 
              alt="EduCurate Mentor Logo" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_7hYpmxO4RPVjHquhRUHn9AGWYmElz5-DH-YSWT689k42d7CaFU5kpRf2pBGfbowcUQAN-mUfunCdo08cupvoBATMWMdsuIS_zfqwQfWP1b6k8QyA6pdF-EBRr9KWVbIuLr-JkXRbieM1w9PUU7CP4EM_1VM3JoKYX95x_8fX_x2wotv1EZF8F57EMFzXW2h3LTVja3KN3WcLwWex1on2mybh63q4GIHbc9lxJYPyhxpXX6wvZGvw"
            />
          </div>
          <div>
            <h1 className="text-headline-md font-headline-md font-bold text-primary tracking-tight leading-tight">EduCurate</h1>
            <p className="text-caption font-caption text-on-surface-variant">Your Digital Mentor</p>
          </div>
        </div>

        <ul className="flex flex-col gap-1 flex-1">
          <li>
            <button 
              onClick={() => onNavigate('landing')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-all text-left cursor-pointer border-none bg-transparent"
            >
              <span className="material-symbols-outlined" data-icon="home">home</span>
              <span className="text-label-md font-label-md">Home</span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => onNavigate('curator_ai')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-primary font-bold bg-primary-container/10 translate-x-1 transition-transform shadow-sm border border-primary/10 text-left cursor-pointer"
            >
              <span className="material-symbols-outlined" data-icon="psychology_alt" style={{ fontVariationSettings: "'FILL' 1" }}>psychology_alt</span>
              <span className="text-label-md font-label-md">AI Guide</span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => onNavigate('learning_plan')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-all text-left cursor-pointer border-none bg-transparent"
            >
              <span className="material-symbols-outlined" data-icon="auto_stories">auto_stories</span>
              <span className="text-label-md font-label-md">Learning Paths</span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => onNavigate('aspirators')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-all text-left cursor-pointer border-none bg-transparent"
            >
              <span className="material-symbols-outlined" data-icon="explore">explore</span>
              <span className="text-label-md font-label-md">Discovery</span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => onNavigate('parent_dashboard')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-all text-left cursor-pointer border-none bg-transparent"
            >
              <span className="material-symbols-outlined" data-icon="settings">settings</span>
              <span className="text-label-md font-label-md">Settings</span>
            </button>
          </li>
        </ul>

        <div className="mt-auto">
          <button 
            onClick={() => onNavigate('curator_ai')}
            className="w-full py-3 px-4 bg-primary text-on-primary rounded-lg text-label-md font-label-md hover:bg-primary/90 transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer border-none"
          >
            <span className="material-symbols-outlined">add</span>
            Start New Lesson
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        
        {/* TopNavBar (Mobile Only) */}
        <header className="md:hidden bg-surface-container-lowest border-b border-outline-variant px-margin-mobile h-16 flex items-center justify-between sticky top-0 z-30">
          <h1 className="text-headline-md font-headline-md font-bold text-primary cursor-pointer" onClick={() => onNavigate('landing')}>EduCurate</h1>
          <button 
            onClick={() => onNavigate('parent_dashboard')}
            className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant cursor-pointer border-none bg-transparent p-0"
          >
            <img 
              alt="Student profile avatar" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCf6CXddibvXAVRe-7SgqIT8t-otAqPF9UzmPtbdGfEI56Qoj4XOz34vTMmxgLCrqN9n8slbI8hFChz-C_8h-VEd2hKGIphta02o3UpAQN5DdEvdwERVaqFtZRHMGYUj2b5HoMsqxXxQ5jM7x8nMLqgM9ks0BuFY8oLi6gABUGKNW6CjpQSpeh6Tt1vmmZXY1VDK6S5tXpQ_9DIqRawsuK1jdUrhkUWON63GuydLz75tLhnydUdbAjL"
            />
          </button>
        </header>

        {/* Form Content */}
        <main className="flex-1 p-margin-mobile md:p-margin-desktop max-w-3xl mx-auto w-full py-8 md:py-12">
          
          {/* Top Toggle Tabs */}
          <div className="mb-stack-lg flex flex-col gap-4">
            <div className="flex bg-surface-container-high p-1 rounded-xl w-fit">
              <button 
                onClick={() => setActiveTab('form')}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg font-label-md text-label-md transition-all cursor-pointer border-none ${
                  activeTab === 'form' 
                    ? 'bg-surface-container-lowest text-primary shadow-sm' 
                    : 'text-on-surface-variant hover:bg-surface-container bg-transparent'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">assignment</span>
                Step-by-Step Form
              </button>
              <button 
                onClick={() => onNavigate('curator_ai')}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg font-label-md text-label-md transition-all cursor-pointer border-none ${
                  activeTab === 'chat' 
                    ? 'bg-surface-container-lowest text-primary shadow-sm' 
                    : 'text-on-surface-variant hover:bg-surface-container bg-transparent'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">forum</span>
                Talk to AI Mentor
              </button>
            </div>
            <div className="h-[1px] bg-outline-variant w-full"></div>
          </div>

          {/* Title Header */}
          <div className="mb-stack-lg">
            <h2 className="text-headline-lg font-headline-lg text-on-surface mb-2">Create Learning Plan</h2>
            <p className="text-body-md font-body-md text-on-surface-variant">Provide a few details to generate a structured, personalized curriculum.</p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-stack-lg">
            <div className="flex justify-between text-label-md font-label-md text-on-surface-variant mb-2 px-1">
              <span className="text-primary font-bold">Demographics</span>
              <span>Interests</span>
              <span>Schedule</span>
            </div>
            <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden flex gap-1">
              <div className="h-full w-1/3 bg-status-progress rounded-full"></div>
              <div className="h-full w-1/3 bg-transparent rounded-full"></div>
              <div className="h-full w-1/3 bg-transparent rounded-full"></div>
            </div>
          </div>

          {/* Form */}
          <form 
            onSubmit={handleGeneratePlan}
            className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-lg shadow-sm flex flex-col gap-stack-md"
          >
            {/* Age Group */}
            <div className="flex flex-col gap-2">
              <label className="text-label-md font-label-md text-on-surface">Target Audience / Age Group</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                <label className="cursor-pointer" onClick={() => setAgeGroup('early_childhood')}>
                  <input 
                    checked={ageGroup === 'early_childhood'} 
                    onChange={() => setAgeGroup('early_childhood')}
                    className="peer sr-only" 
                    name="age_group" 
                    type="radio"
                  />
                  <div className="p-3 border border-outline-variant rounded-lg peer-checked:border-primary peer-checked:bg-primary-container/10 peer-checked:ring-1 peer-checked:ring-primary transition-all hover:bg-surface-container flex items-center justify-between">
                    <span className="text-body-md font-body-md text-on-surface">Early Childhood</span>
                    <span className="material-symbols-outlined text-primary hidden peer-checked:block" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  </div>
                </label>

                <label className="cursor-pointer" onClick={() => setAgeGroup('primary')}>
                  <input 
                    checked={ageGroup === 'primary'} 
                    onChange={() => setAgeGroup('primary')}
                    className="peer sr-only" 
                    name="age_group" 
                    type="radio"
                  />
                  <div className="p-3 border border-outline-variant rounded-lg peer-checked:border-primary peer-checked:bg-primary-container/10 peer-checked:ring-1 peer-checked:ring-primary transition-all hover:bg-surface-container flex items-center justify-between">
                    <span className="text-body-md font-body-md text-on-surface">Primary Education</span>
                    <span className="material-symbols-outlined text-primary hidden peer-checked:block" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  </div>
                </label>

                <label className="cursor-pointer" onClick={() => setAgeGroup('teen')}>
                  <input 
                    checked={ageGroup === 'teen'} 
                    onChange={() => setAgeGroup('teen')}
                    className="peer sr-only" 
                    name="age_group" 
                    type="radio"
                  />
                  <div className="p-3 border border-outline-variant rounded-lg peer-checked:border-primary peer-checked:bg-primary-container/10 peer-checked:ring-1 peer-checked:ring-primary transition-all hover:bg-surface-container flex items-center justify-between">
                    <span className="text-body-md font-body-md text-on-surface">Teenagers (Secondary)</span>
                    <span className="material-symbols-outlined text-primary hidden peer-checked:block" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  </div>
                </label>

                <label className="cursor-pointer" onClick={() => setAgeGroup('adult')}>
                  <input 
                    checked={ageGroup === 'adult'} 
                    onChange={() => setAgeGroup('adult')}
                    className="peer sr-only" 
                    name="age_group" 
                    type="radio"
                  />
                  <div className="p-3 border border-outline-variant rounded-lg peer-checked:border-primary peer-checked:bg-primary-container/10 peer-checked:ring-1 peer-checked:ring-primary transition-all hover:bg-surface-container flex items-center justify-between">
                    <span className="text-body-md font-body-md text-on-surface">University & Beyond</span>
                    <span className="material-symbols-outlined text-primary hidden peer-checked:block" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  </div>
                </label>

              </div>
            </div>

            {/* Topic of Interest */}
            <div className="flex flex-col gap-2">
              <label className="text-label-md font-label-md text-on-surface" htmlFor="topic">Primary Topic of Interest</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                <input 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-outline-variant bg-surface-muted focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-body-md font-body-md text-on-surface placeholder:text-outline" 
                  id="topic" 
                  placeholder="e.g., Quantum Physics, Renaissance Art, Python Programming" 
                  type="text"
                />
              </div>
            </div>

            {/* Proficiency Level */}
            <div className="flex flex-col gap-2">
              <label className="text-label-md font-label-md text-on-surface">Current Proficiency Level</label>
              <div className="flex bg-surface-muted rounded-lg p-1 border border-outline-variant">
                
                <label className="flex-1 text-center cursor-pointer" onClick={() => setProficiency('beginner')}>
                  <input 
                    checked={proficiency === 'beginner'} 
                    onChange={() => setProficiency('beginner')}
                    className="peer sr-only" 
                    name="proficiency" 
                    type="radio"
                  />
                  <div className="py-2 rounded-md peer-checked:bg-surface-container-lowest peer-checked:shadow-sm peer-checked:text-primary font-label-md text-label-md text-on-surface-variant transition-all">
                    Beginner
                  </div>
                </label>

                <label className="flex-1 text-center cursor-pointer" onClick={() => setProficiency('intermediate')}>
                  <input 
                    checked={proficiency === 'intermediate'} 
                    onChange={() => setProficiency('intermediate')}
                    className="peer sr-only" 
                    name="proficiency" 
                    type="radio"
                  />
                  <div className="py-2 rounded-md peer-checked:bg-surface-container-lowest peer-checked:shadow-sm peer-checked:text-primary font-label-md text-label-md text-on-surface-variant transition-all">
                    Intermediate
                  </div>
                </label>

                <label className="flex-1 text-center cursor-pointer" onClick={() => setProficiency('advanced')}>
                  <input 
                    checked={proficiency === 'advanced'} 
                    onChange={() => setProficiency('advanced')}
                    className="peer sr-only" 
                    name="proficiency" 
                    type="radio"
                  />
                  <div className="py-2 rounded-md peer-checked:bg-surface-container-lowest peer-checked:shadow-sm peer-checked:text-primary font-label-md text-label-md text-on-surface-variant transition-all">
                    Advanced
                  </div>
                </label>

              </div>
            </div>

            {/* Learning Duration & Effort */}
            <div className="flex flex-col gap-2">
              <label className="text-label-md font-label-md text-on-surface">Learning Commitment</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="flex flex-col gap-1">
                  <span className="text-caption font-caption text-on-surface-variant">Duration</span>
                  <select 
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full p-3 rounded-lg border border-outline-variant bg-surface-muted focus:ring-2 focus:ring-primary focus:border-primary outline-none text-body-md font-body-md text-on-surface appearance-none"
                  >
                    <option value="7 Days">7 Days</option>
                    <option value="14 Days">14 Days</option>
                    <option value="30 Days">30 Days</option>
                    <option value="60 Days">60 Days</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-caption font-caption text-on-surface-variant">Daily Effort</span>
                  <select 
                    value={dailyEffort}
                    onChange={(e) => setDailyEffort(e.target.value)}
                    className="w-full p-3 rounded-lg border border-outline-variant bg-surface-muted focus:ring-2 focus:ring-primary focus:border-primary outline-none text-body-md font-body-md text-on-surface appearance-none"
                  >
                    <option value="15 mins/day">15 mins/day</option>
                    <option value="30 mins/day">30 mins/day</option>
                    <option value="1 hour/day">1 hour/day</option>
                    <option value="2+ hours/day">2+ hours/day</option>
                  </select>
                </div>

              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-stack-md mt-stack-sm border-t border-outline-variant flex justify-end">
              <button 
                type="submit" 
                className="px-6 py-3 bg-primary text-on-primary rounded-lg text-label-md font-label-md hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2 cursor-pointer border-none"
              >
                <span className="material-symbols-outlined" data-icon="auto_awesome">auto_awesome</span>
                Generate My Plan
              </button>
            </div>

          </form>
        </main>

      </div>
    </div>
  );
};
