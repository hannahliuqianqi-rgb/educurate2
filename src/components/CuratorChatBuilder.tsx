import React, { useState, useRef, useEffect } from 'react';
import { AppView } from '../types';
import confetti from 'canvas-confetti';

interface CuratorChatBuilderProps {
  onNavigate: (view: AppView) => void;
}

interface MessageItem {
  id: string;
  sender: 'ai' | 'user';
  text?: string;
  type?: 'text' | 'plan';
  avatar?: string;
  planData?: {
    title: string;
    video: {
      title: string;
      meta: string;
      image: string;
    };
    book: {
      title: string;
      meta: string;
    };
    interactive: {
      title: string;
      meta: string;
    };
  };
}

export const CuratorChatBuilder: React.FC<CuratorChatBuilderProps> = ({ onNavigate }) => {
  // Mode: 'form' (Step-by-Step Form) vs 'chat' (Talk to AI Mentor)
  const [setupMode, setSetupMode] = useState<'form' | 'chat'>('form');

  // Form State
  const [ageGroup, setAgeGroup] = useState('early_childhood');
  const [topic, setTopic] = useState('');
  const [proficiency, setProficiency] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [duration, setDuration] = useState('30 Days');
  const [dailyEffort, setDailyEffort] = useState('30 mins/day');

  // Chat State
  const [inputText, setInputText] = useState('');
  const [selectedCuration, setSelectedCuration] = useState<number>(0);
  const [isTyping, setIsTyping] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: 'Hello! What topic would you like to master today?',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAp3CEID42mMDCnbk8kYudBG6T-I1320kNwOTGkkys_eH0mgyr1Jfi4ITg3ZkouVC8aRbg6n693mAY_ZKOTItquTZRwWX06eMybu5_i4McNT7f-D-DF4p1C1jiNtzA857C0XUE24CgKP3p26Sf8H3L2YqtvJbOAS-SYMVdN_dmR9VjcKrCwyykXuTcZpDW-GUxX5qI2Frwu9Uj27gc13vVDInfPYi88k7Pvb_gNOY2GB3Gfd3rzEwg1'
    },
    {
      id: 'm2',
      sender: 'user',
      text: 'Astrophysics for beginners.',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALH4lMQsn4vYJk079fD9AXrLslwWzvrlJdQOJ3qiELbUxHY4-q8tLDQfgnk_f2BSxkN_HYR8Fw_lFnfW2WNRFeIEF6BKWdyu9dhRmWqBp_D9PdQ1O9QG3jAfANCh_Y5M8kxB78yJ6PfmDSxNKiGeMc1oUyvL0Xu59Iiae5eMoR4UP2103FfmT0RVY-XsJSXw_fqpVyxmHi2ckRuXOX-w6ZARJEg6P4VXbggxPjJimDh0eTxQvc8epm'
    },
    {
      id: 'm3',
      sender: 'ai',
      text: "Great choice! To tailor the depth, what's your current proficiency and how much time can you commit weekly?",
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAp3CEID42mMDCnbk8kYudBG6T-I1320kNwOTGkkys_eH0mgyr1Jfi4ITg3ZkouVC8aRbg6n693mAY_ZKOTItquTZRwWX06eMybu5_i4McNT7f-D-DF4p1C1jiNtzA857C0XUE24CgKP3p26Sf8H3L2YqtvJbOAS-SYMVdN_dmR9VjcKrCwyykXuTcZpDW-GUxX5qI2Frwu9Uj27gc13vVDInfPYi88k7Pvb_gNOY2GB3Gfd3rzEwg1'
    },
    {
      id: 'm4',
      sender: 'user',
      text: 'Adult beginner, 3 hours a week.',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALH4lMQsn4vYJk079fD9AXrLslwWzvrlJdQOJ3qiELbUxHY4-q8tLDQfgnk_f2BSxkN_HYR8Fw_lFnfW2WNRFeIEF6BKWdyu9dhRmWqBp_D9PdQ1O9QG3jAfANCh_Y5M8kxB78yJ6PfmDSxNKiGeMc1oUyvL0Xu59Iiae5eMoR4UP2103FfmT0RVY-XsJSXw_fqpVyxmHi2ckRuXOX-w6ZARJEg6P4VXbggxPjJimDh0eTxQvc8epm'
    },
    {
      id: 'm5',
      sender: 'ai',
      type: 'plan',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAp3CEID42mMDCnbk8kYudBG6T-I1320kNwOTGkkys_eH0mgyr1Jfi4ITg3ZkouVC8aRbg6n693mAY_ZKOTItquTZRwWX06eMybu5_i4McNT7f-D-DF4p1C1jiNtzA857C0XUE24CgKP3p26Sf8H3L2YqtvJbOAS-SYMVdN_dmR9VjcKrCwyykXuTcZpDW-GUxX5qI2Frwu9Uj27gc13vVDInfPYi88k7Pvb_gNOY2GB3Gfd3rzEwg1',
      planData: {
        title: 'Draft Learning Plan',
        video: {
          title: 'Crash Course Astronomy',
          meta: '12 mins • YouTube',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASWd8TvXdUxfNFv8wJDq2M-pnD97CQ5Tbq1zjdE3sagNcTBAyjFkpfH_VDU_GKkjN_5YWsml-XXIpKJI0g5y0kMY8e26k-Wu9IPk6U_5VQ0u2aCWvZWKI9faH_IfJiWYr1f5vdP_cPi568mbPWQ_hA4lg2f_DUpXeu9VWXalOFo6zfujhD_cUhHIAsTRTeIUaWq_mflPuQWP7hjW6IfkTagFF1e9Sh15CcAf5Pvebdd05na3Kba1fW'
        },
        book: {
          title: 'Astrophysics in a Hurry',
          meta: '224 pages'
        },
        interactive: {
          title: 'Scale of the Universe',
          meta: '15 mins'
        }
      }
    }
  ]);

  useEffect(() => {
    if (setupMode === 'chat') {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, setupMode]);

  const handleInputResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 128)}px`;
    }
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    const newUserMsg: MessageItem = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: userText,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALH4lMQsn4vYJk079fD9AXrLslwWzvrlJdQOJ3qiELbUxHY4-q8tLDQfgnk_f2BSxkN_HYR8Fw_lFnfW2WNRFeIEF6BKWdyu9dhRmWqBp_D9PdQ1O9QG3jAfANCh_Y5M8kxB78yJ6PfmDSxNKiGeMc1oUyvL0Xu59Iiae5eMoR4UP2103FfmT0RVY-XsJSXw_fqpVyxmHi2ckRuXOX-w6ZARJEg6P4VXbggxPjJimDh0eTxQvc8epm'
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const newAiMsg: MessageItem = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `Understood! I have updated your learning parameters for "${userText}". Would you like me to generate specific checkpoint quizzes or adapt the weekly pacing?`,
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAp3CEID42mMDCnbk8kYudBG6T-I1320kNwOTGkkys_eH0mgyr1Jfi4ITg3ZkouVC8aRbg6n693mAY_ZKOTItquTZRwWX06eMybu5_i4McNT7f-D-DF4p1C1jiNtzA857C0XUE24CgKP3p26Sf8H3L2YqtvJbOAS-SYMVdN_dmR9VjcKrCwyykXuTcZpDW-GUxX5qI2Frwu9Uj27gc13vVDInfPYi88k7Pvb_gNOY2GB3Gfd3rzEwg1'
      };
      setMessages(prev => [...prev, newAiMsg]);
    }, 1200);
  };

  const handleFormGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 }
    });
    setToastMessage('Personalized Learning Plan Generated!');
    setTimeout(() => {
      setToastMessage(null);
      onNavigate('learning_plan');
    }, 1200);
  };

  const handleConfirmPlan = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    setToastMessage('Plan added to your Library!');
    setTimeout(() => {
      setToastMessage(null);
      onNavigate('learning_plan');
    }, 1200);
  };

  const handleRefinePlan = () => {
    setInputText('Can you add more interactive simulations and hands-on exercises?');
    textareaRef.current?.focus();
  };

  return (
    <div className="flex min-h-screen bg-background font-body-md text-body-md text-on-background relative selection:bg-primary-ed selection:text-white">
      
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-primary text-on-primary px-5 py-3 rounded-2xl shadow-2xl font-bold flex items-center gap-2 animate-fade-in-up">
          <span className="material-symbols-outlined">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* SideNavBar (Desktop) */}
      <nav className="hidden md:flex flex-col fixed left-0 top-0 h-full p-stack-md z-40 w-64 bg-surface-muted border-r border-outline-variant">
        <div className="mb-stack-lg flex items-center gap-3 px-2 cursor-pointer" onClick={() => onNavigate('landing')}>
          <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
            <img 
              alt="EduCurate Mentor Logo" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_7hYpmxO4RPVjHquhRUHn9AGWYmElz5-DH-YSWT689k42d7CaFU5kpRf2pBGfbowcUQAN-mUfunCdo08cupvoBATMWMdsuIS_zfqwQfWP1b6k8QyA6pdF-EBRr9KWVbIuLr-JkXRbieM1w9PUU7CP4EM_1VM3JoKYX95x_8fX_x2wotv1EZF8F57EMFzXW2h3LTVja3KN3WcLwWex1on2mybh63q4GIHbc9lxJYPyhxpXX6wvZGvw" 
            />
          </div>
          <div>
            <h1 className="text-headline-md font-headline-md font-bold text-primary tracking-tight">EduCurate</h1>
            <p className="text-caption font-caption text-on-surface-variant">Your Digital Mentor</p>
          </div>
        </div>

        <ul className="flex flex-col gap-1 flex-1">
          <li>
            <button 
              onClick={() => onNavigate('landing')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-all text-left cursor-pointer bg-transparent border-none"
            >
              <span className="material-symbols-outlined" data-icon="home">home</span>
              <span className="text-label-md font-label-md">Home</span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => setSetupMode('chat')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-primary font-bold bg-primary-container/10 translate-x-1 transition-transform shadow-sm border border-primary/10 text-left cursor-pointer"
            >
              <span className="material-symbols-outlined text-primary" data-icon="psychology_alt" style={{ fontVariationSettings: "'FILL' 1" }}>psychology_alt</span>
              <span className="text-label-md font-label-md">AI Guide</span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => onNavigate('learning_plan')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-all text-left cursor-pointer bg-transparent border-none"
            >
              <span className="material-symbols-outlined" data-icon="auto_stories">auto_stories</span>
              <span className="text-label-md font-label-md">Learning Paths</span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => onNavigate('aspirators')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-all text-left cursor-pointer bg-transparent border-none"
            >
              <span className="material-symbols-outlined" data-icon="explore">explore</span>
              <span className="text-label-md font-label-md">Discovery</span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => onNavigate('parent_dashboard')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-all text-left cursor-pointer bg-transparent border-none"
            >
              <span className="material-symbols-outlined" data-icon="settings">settings</span>
              <span className="text-label-md font-label-md">Settings</span>
            </button>
          </li>
        </ul>

        <div className="mt-auto">
          <button 
            onClick={() => {
              setSetupMode('form');
              setTopic('');
            }}
            className="w-full py-3 px-4 bg-primary text-on-primary rounded-lg text-label-md font-label-md hover:bg-primary/90 transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer border-none"
          >
            <span className="material-symbols-outlined">add</span>
            Start New Lesson
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        
        {/* TopNavBar (Mobile Header) */}
        <header className="md:hidden bg-surface-container-lowest border-b border-outline-variant px-margin-mobile h-16 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('landing')}>
            <h1 className="text-headline-md font-headline-md font-bold text-primary">EduCurate</h1>
          </div>
          <button 
            onClick={() => onNavigate('parent_dashboard')}
            className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant cursor-pointer p-0 bg-transparent"
          >
            <img 
              alt="Student profile avatar" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCf6CXddibvXAVRe-7SgqIT8t-otAqPF9UzmPtbdGfEI56Qoj4XOz34vTMmxgLCrqN9n8slbI8hFChz-C_8h-VEd2hKGIphta02o3UpAQN5DdEvdwERVaqFtZRHMGYUj2b5HoMsqxXxQ5jM7x8nMLqgM9ks0BuFY8oLi6gABUGKNW6CjpQSpeh6Tt1vmmZXY1VDK6S5tXpQ_9DIqRawsuK1jdUrhkUWON63GuydLz75tLhnydUdbAjL" 
            />
          </button>
        </header>

        {/* Setup Content */}
        {setupMode === 'form' ? (
          /* STEP-BY-STEP FORM VIEW */
          <main className="flex-1 p-margin-mobile md:p-margin-desktop max-w-3xl mx-auto w-full pb-20">
            
            {/* Mode Switcher Tabs */}
            <div className="mb-stack-lg flex flex-col gap-4">
              <div className="flex bg-surface-container-high p-1 rounded-xl w-fit">
                <button 
                  onClick={() => setSetupMode('form')}
                  className="flex items-center gap-2 px-6 py-2 rounded-lg bg-surface-container-lowest text-primary shadow-sm font-label-md text-label-md transition-all cursor-pointer border-none"
                >
                  <span className="material-symbols-outlined text-[20px]">assignment</span>
                  Step-by-Step Form
                </button>
                <button 
                  onClick={() => setSetupMode('chat')}
                  className="flex items-center gap-2 px-6 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container font-label-md text-label-md transition-all cursor-pointer border-none bg-transparent"
                >
                  <span className="material-symbols-outlined text-[20px]">forum</span>
                  Talk to AI Mentor
                </button>
              </div>
              <div className="h-[1px] bg-outline-variant w-full"></div>
            </div>

            <div className="mb-stack-lg">
              <h2 className="text-headline-lg font-headline-lg text-on-surface mb-2 font-bold">Create Learning Plan</h2>
              <p className="text-body-md font-body-md text-on-surface-variant">
                Provide a few details to generate a structured, personalized curriculum.
              </p>
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
            <form onSubmit={handleFormGenerate} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-lg shadow-sm flex flex-col gap-stack-md">
              
              {/* Age Group */}
              <div className="flex flex-col gap-2">
                <label className="text-label-md font-label-md text-on-surface font-semibold">Target Audience / Age Group</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  <label className="cursor-pointer">
                    <input 
                      type="radio" 
                      name="age_group" 
                      checked={ageGroup === 'early_childhood'} 
                      onChange={() => setAgeGroup('early_childhood')} 
                      className="peer sr-only" 
                    />
                    <div className="p-3 border border-outline-variant rounded-lg peer-checked:border-primary peer-checked:bg-primary-container/10 peer-checked:ring-1 peer-checked:ring-primary transition-all hover:bg-surface-container flex items-center justify-between">
                      <span className="text-body-md font-body-md text-on-surface">Early Childhood</span>
                      <span className="material-symbols-outlined text-primary hidden peer-checked:block" data-icon="check_circle" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </div>
                  </label>

                  <label className="cursor-pointer">
                    <input 
                      type="radio" 
                      name="age_group" 
                      checked={ageGroup === 'primary'} 
                      onChange={() => setAgeGroup('primary')} 
                      className="peer sr-only" 
                    />
                    <div className="p-3 border border-outline-variant rounded-lg peer-checked:border-primary peer-checked:bg-primary-container/10 peer-checked:ring-1 peer-checked:ring-primary transition-all hover:bg-surface-container flex items-center justify-between">
                      <span className="text-body-md font-body-md text-on-surface">Primary Education</span>
                      <span className="material-symbols-outlined text-primary hidden peer-checked:block" data-icon="check_circle" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </div>
                  </label>

                  <label className="cursor-pointer">
                    <input 
                      type="radio" 
                      name="age_group" 
                      checked={ageGroup === 'teenagers'} 
                      onChange={() => setAgeGroup('teenagers')} 
                      className="peer sr-only" 
                    />
                    <div className="p-3 border border-outline-variant rounded-lg peer-checked:border-primary peer-checked:bg-primary-container/10 peer-checked:ring-1 peer-checked:ring-primary transition-all hover:bg-surface-container flex items-center justify-between">
                      <span className="text-body-md font-body-md text-on-surface">Teenagers (Secondary)</span>
                      <span className="material-symbols-outlined text-primary hidden peer-checked:block" data-icon="check_circle" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </div>
                  </label>

                  <label className="cursor-pointer">
                    <input 
                      type="radio" 
                      name="age_group" 
                      checked={ageGroup === 'adults'} 
                      onChange={() => setAgeGroup('adults')} 
                      className="peer sr-only" 
                    />
                    <div className="p-3 border border-outline-variant rounded-lg peer-checked:border-primary peer-checked:bg-primary-container/10 peer-checked:ring-1 peer-checked:ring-primary transition-all hover:bg-surface-container flex items-center justify-between">
                      <span className="text-body-md font-body-md text-on-surface">University & Beyond</span>
                      <span className="material-symbols-outlined text-primary hidden peer-checked:block" data-icon="check_circle" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </div>
                  </label>

                </div>
              </div>

              {/* Topic of Interest */}
              <div className="flex flex-col gap-2">
                <label className="text-label-md font-label-md text-on-surface font-semibold" htmlFor="topic">Primary Topic of Interest</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                  <input 
                    id="topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-outline-variant bg-surface-muted focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-body-md font-body-md text-on-surface placeholder:text-outline" 
                    placeholder="e.g., Quantum Physics, Renaissance Art, Python Programming" 
                    type="text"
                  />
                </div>
              </div>

              {/* Proficiency Level */}
              <div className="flex flex-col gap-2">
                <label className="text-label-md font-label-md text-on-surface font-semibold">Current Proficiency Level</label>
                <div className="flex bg-surface-muted rounded-lg p-1 border border-outline-variant">
                  <button
                    type="button"
                    onClick={() => setProficiency('beginner')}
                    className={`flex-1 py-2 rounded-md font-label-md text-label-md transition-all cursor-pointer border-none ${
                      proficiency === 'beginner' 
                        ? 'bg-surface-container-lowest shadow-sm text-primary font-bold' 
                        : 'bg-transparent text-on-surface-variant'
                    }`}
                  >
                    Beginner
                  </button>
                  <button
                    type="button"
                    onClick={() => setProficiency('intermediate')}
                    className={`flex-1 py-2 rounded-md font-label-md text-label-md transition-all cursor-pointer border-none ${
                      proficiency === 'intermediate' 
                        ? 'bg-surface-container-lowest shadow-sm text-primary font-bold' 
                        : 'bg-transparent text-on-surface-variant'
                    }`}
                  >
                    Intermediate
                  </button>
                  <button
                    type="button"
                    onClick={() => setProficiency('advanced')}
                    className={`flex-1 py-2 rounded-md font-label-md text-label-md transition-all cursor-pointer border-none ${
                      proficiency === 'advanced' 
                        ? 'bg-surface-container-lowest shadow-sm text-primary font-bold' 
                        : 'bg-transparent text-on-surface-variant'
                    }`}
                  >
                    Advanced
                  </button>
                </div>
              </div>

              {/* Learning Commitment */}
              <div className="flex flex-col gap-2">
                <label className="text-label-md font-label-md text-on-surface font-semibold">Learning Commitment</label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-caption font-caption text-on-surface-variant">Duration</span>
                    <select 
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full p-3 rounded-lg border border-outline-variant bg-surface-muted focus:ring-2 focus:ring-primary focus:border-primary outline-none text-body-md font-body-md text-on-surface"
                    >
                      <option>7 Days</option>
                      <option>14 Days</option>
                      <option>30 Days</option>
                      <option>60 Days</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-caption font-caption text-on-surface-variant">Daily Effort</span>
                    <select 
                      value={dailyEffort}
                      onChange={(e) => setDailyEffort(e.target.value)}
                      className="w-full p-3 rounded-lg border border-outline-variant bg-surface-muted focus:ring-2 focus:ring-primary focus:border-primary outline-none text-body-md font-body-md text-on-surface"
                    >
                      <option>15 mins/day</option>
                      <option>30 mins/day</option>
                      <option>1 hour/day</option>
                      <option>2+ hours/day</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Form Action */}
              <div className="pt-stack-md mt-stack-sm border-t border-outline-variant flex justify-end">
                <button 
                  type="submit" 
                  className="px-6 py-3 bg-primary text-on-primary rounded-lg text-label-md font-label-md hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2 cursor-pointer border-none font-bold"
                >
                  <span className="material-symbols-outlined" data-icon="auto_awesome">auto_awesome</span>
                  Generate My Plan
                </button>
              </div>

            </form>
          </main>
        ) : (
          /* TALK TO AI MENTOR VIEW */
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            
            {/* Left Panel: Active Curations */}
            <aside className="hidden lg:flex w-1/3 bg-surface border-r border-outline-variant flex-col overflow-y-auto">
              <div className="p-stack-md border-b border-outline-variant">
                <div className="flex bg-surface-container-high p-1 rounded-xl w-full mb-3">
                  <button 
                    onClick={() => setSetupMode('form')}
                    className="flex-1 py-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container font-label-md text-caption transition-all cursor-pointer border-none bg-transparent"
                  >
                    Form Mode
                  </button>
                  <button 
                    onClick={() => setSetupMode('chat')}
                    className="flex-1 py-1.5 rounded-lg bg-surface-container-lowest text-primary shadow-sm font-label-md text-caption transition-all cursor-pointer border-none font-bold"
                  >
                    AI Mentor
                  </button>
                </div>
                <h2 className="text-headline-md font-headline-md text-on-surface">Active Curations</h2>
                <p className="text-caption font-caption text-on-surface-variant mt-1">Your personalized learning journeys</p>
              </div>
              
              <div className="p-stack-md space-y-stack-md">
                
                {/* Curation Card 1 */}
                <div 
                  onClick={() => {
                    setSelectedCuration(0);
                    onNavigate('learning_plan');
                  }}
                  className={`bg-surface-container-lowest border rounded-xl p-stack-md hover:-translate-y-1 hover:shadow-lg transition-all cursor-pointer ${
                    selectedCuration === 0 ? 'border-primary shadow-sm' : 'border-outline-variant'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-primary-container text-on-primary-container text-caption font-caption px-2 py-1 rounded font-semibold">Science</span>
                    <span className="text-caption font-caption text-on-surface-variant font-medium">In Progress</span>
                  </div>
                  <h3 className="text-body-lg font-body-lg font-bold text-on-surface mb-1">Introduction to Quantum Physics</h3>
                  <p className="text-caption font-caption text-on-surface-variant mb-3">Exploring the fundamentals of quantum mechanics suitable for high school level.</p>
                  <div className="w-full bg-surface-container-high rounded-full h-2">
                    <div className="bg-status-progress h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>

                {/* Curation Card 2 */}
                <div 
                  onClick={() => {
                    setSelectedCuration(1);
                    onNavigate('quest_player');
                  }}
                  className={`bg-surface-container-lowest border rounded-xl p-stack-md hover:-translate-y-1 hover:shadow-lg transition-all cursor-pointer ${
                    selectedCuration === 1 ? 'border-primary shadow-sm' : 'border-outline-variant'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-secondary-container text-on-secondary-container text-caption font-caption px-2 py-1 rounded font-semibold">History</span>
                    <span className="text-caption font-caption text-status-todo font-medium">Not Started</span>
                  </div>
                  <h3 className="text-body-lg font-body-lg font-bold text-on-surface mb-1">The Roman Empire: Rise & Fall</h3>
                  <p className="text-caption font-caption text-on-surface-variant mb-3">A comprehensive look at ancient Rome, curated for adult learners.</p>
                  <div className="w-full bg-surface-container-high rounded-full h-2">
                    <div className="bg-status-todo h-2 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                </div>

              </div>
            </aside>

            {/* Right Panel: AI Chat Canvas */}
            <section className="flex-1 flex flex-col bg-surface-container-lowest relative overflow-hidden h-[calc(100vh-64px)] md:h-screen">
              
              {/* Header */}
              <div className="p-stack-md border-b border-outline-variant flex items-center justify-between bg-surface-container-lowest z-10">
                <div className="flex items-center gap-3">
                  <img 
                    className="w-10 h-10 rounded-full bg-surface-container-high p-1 shadow-sm object-cover" 
                    alt="Curator AI" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC90POUBX-7mTPyhiIm87smNg9gdboj0EAPqmNx4DQVmeSSF-QwLoVRTWDcGoLPR46RyinzHrEZVSDDmqqvx_VJO8Q-AXThaDzDvoyoE5BNv7Z7N39K238INQjdGvI87B0LzQf4uvXPNshpmb9bvbAYXZM2vxt1ZoMQ6Iu69xn8_LT5gTEgRC8xrCenlpCAseqr2AXrCPzfn0wRjms52S6tBfr72CwZurBkHETHu05nxun8yKMqb4C0"
                  />
                  <div>
                    <h2 className="text-body-lg font-body-lg font-bold text-on-surface">Curator AI</h2>
                    <span className="text-caption font-caption text-status-complete flex items-center gap-1 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-status-complete inline-block"></span> Online
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setSetupMode('form')}
                    className="px-3 py-1.5 rounded-lg border border-outline-variant text-caption font-bold text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer bg-transparent"
                  >
                    Switch to Form
                  </button>
                  <button 
                    onClick={() => onNavigate('learning_plan')}
                    className="text-on-surface-variant hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-container-low cursor-pointer border-none bg-transparent"
                  >
                    <span className="material-symbols-outlined" data-icon="more_vert">more_vert</span>
                  </button>
                </div>
              </div>

              {/* Chat Thread */}
              <div className="flex-1 overflow-y-auto p-stack-md lg:p-stack-lg space-y-stack-md bg-surface-muted/50 pb-36">
                
                {/* Stepper Header */}
                <div className="mb-stack-lg bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex justify-between items-center shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-status-complete text-body-md" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    <span className="text-label-md text-on-surface font-semibold">Goal</span>
                  </div>
                  <div className="h-px flex-1 bg-outline-variant mx-2"></div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-status-complete text-body-md" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    <span className="text-label-md text-on-surface font-semibold">Proficiency</span>
                  </div>
                  <div className="h-px flex-1 bg-outline-variant mx-2"></div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-status-complete text-body-md" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    <span className="text-label-md text-on-surface font-semibold">Schedule</span>
                  </div>
                  <div className="h-px flex-1 bg-outline-variant mx-2"></div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center text-[10px] font-bold">4</span>
                    <span className="text-label-md text-primary font-bold">Plan</span>
                  </div>
                </div>

                {/* Message list */}
                {messages.map((msg) => {
                  if (msg.type === 'plan' && msg.planData) {
                    return (
                      <div key={msg.id} className="flex gap-3 max-w-3xl message-in">
                        <img className="w-8 h-8 rounded-full flex-shrink-0 mt-1 object-cover" src={msg.avatar} alt="AI" />
                        <div className="bg-surface-container text-on-surface p-4 rounded-2xl rounded-tl-sm shadow-sm w-full">
                          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-outline-variant">
                            <span className="material-symbols-outlined text-primary">draft</span>
                            <h3 className="text-label-md font-bold text-primary uppercase tracking-wider">{msg.planData.title}</h3>
                          </div>
                          <p className="text-body-md mb-4">I've curated this starting point based on your 3-hour weekly window:</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-sm mb-4">
                            
                            {/* Video card */}
                            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm col-span-1 md:col-span-2 flex flex-col md:flex-row">
                              <div className="md:w-1/3 h-28 md:h-auto bg-surface-variant relative">
                                <img className="w-full h-full object-cover" src={msg.planData.video.image} alt={msg.planData.video.title} />
                                <span className="absolute top-2 right-2 bg-primary text-on-primary text-[10px] font-bold px-2 py-1 rounded">VIDEO</span>
                              </div>
                              <div className="p-stack-sm md:w-2/3 flex flex-col justify-center">
                                <h4 className="text-label-md font-bold text-on-surface">{msg.planData.video.title}</h4>
                                <p className="text-caption text-on-surface-variant">{msg.planData.video.meta}</p>
                              </div>
                            </div>

                            {/* Book card */}
                            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-sm flex flex-col">
                              <span className="text-[10px] font-bold text-tertiary mb-1">BOOK</span>
                              <h4 className="text-label-md font-bold text-on-surface">{msg.planData.book.title}</h4>
                              <p className="text-caption text-on-surface-variant">{msg.planData.book.meta}</p>
                            </div>

                            {/* Interactive card */}
                            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-sm flex flex-col">
                              <span className="text-[10px] font-bold text-secondary mb-1">INTERACTIVE</span>
                              <h4 className="text-label-md font-bold text-on-surface">{msg.planData.interactive.title}</h4>
                              <p className="text-caption text-on-surface-variant">{msg.planData.interactive.meta}</p>
                            </div>

                          </div>

                          {/* Plan buttons */}
                          <div className="flex flex-col sm:flex-row gap-2">
                            <button 
                              onClick={handleConfirmPlan}
                              className="flex-1 py-2.5 bg-primary text-on-primary rounded-lg text-label-md font-bold hover:bg-surface-tint transition-colors cursor-pointer border-none shadow-sm"
                            >
                              Confirm & Add to Library
                            </button>
                            <button 
                              onClick={handleRefinePlan}
                              className="flex-1 py-2.5 border border-primary text-primary rounded-lg text-label-md font-bold hover:bg-primary-container/10 transition-colors cursor-pointer bg-transparent"
                            >
                              Refine Plan
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  if (msg.sender === 'user') {
                    return (
                      <div key={msg.id} className="flex gap-3 max-w-3xl ml-auto justify-end message-out">
                        <div className="bg-primary text-on-primary p-4 rounded-2xl rounded-tr-sm shadow-sm">
                          <p className="text-body-md">{msg.text}</p>
                        </div>
                        <img className="w-8 h-8 rounded-full flex-shrink-0 mt-1 object-cover" src={msg.avatar} alt="User" />
                      </div>
                    );
                  }

                  return (
                    <div key={msg.id} className="flex gap-3 max-w-3xl message-in">
                      <img className="w-8 h-8 rounded-full flex-shrink-0 mt-1 object-cover" src={msg.avatar} alt="AI" />
                      <div className="bg-surface-container text-on-surface p-4 rounded-2xl rounded-tl-sm shadow-sm">
                        <p className="text-body-md">{msg.text}</p>
                      </div>
                    </div>
                  );
                })}

                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex gap-3 max-w-3xl message-in">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                    </div>
                    <div className="bg-surface-container text-on-surface px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-primary animate-bounce"></span>
                      <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                      <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                    </div>
                  </div>
                )}

                <div ref={chatBottomRef} />
              </div>

              {/* Input Area */}
              <div className="absolute bottom-0 left-0 w-full p-stack-md bg-surface-container-lowest border-t border-outline-variant shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-safe mb-16 md:mb-0 z-20">
                <form 
                  onSubmit={handleSendMessage}
                  className="max-w-3xl mx-auto flex items-end gap-2 bg-surface-muted border border-outline-variant rounded-xl p-2 focus-within:border-primary transition-colors"
                >
                  <button 
                    type="button" 
                    onClick={() => setInputText('Please add more video walkthroughs.')}
                    className="p-2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer border-none bg-transparent"
                  >
                    <span className="material-symbols-outlined" data-icon="add_circle">add_circle</span>
                  </button>
                  
                  <textarea 
                    ref={textareaRef}
                    value={inputText}
                    onChange={(e) => {
                      setInputText(e.target.value);
                      handleInputResize();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="flex-1 bg-transparent border-none focus:outline-none resize-none max-h-32 text-body-md font-body-md p-2 placeholder:text-outline text-on-surface" 
                    placeholder="Ask your mentor something..." 
                    rows={1}
                  />
                  
                  <button 
                    type="submit" 
                    className="p-2 bg-primary text-on-primary rounded-lg hover:bg-surface-tint transition-colors shadow-sm cursor-pointer border-none flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined" data-icon="send">send</span>
                  </button>
                </form>
              </div>

            </section>

          </div>
        )}

      </div>

      {/* BottomNavBar (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-margin-mobile py-2 pb-safe bg-surface-container-lowest shadow-[0_-4px_20px_rgba(0,0,0,0.05)] rounded-t-xl shadow-lg border-t border-outline-variant">
        <button 
          onClick={() => onNavigate('landing')}
          className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1 active:bg-surface-variant cursor-pointer border-none bg-transparent"
        >
          <span className="material-symbols-outlined" data-icon="home">home</span>
          <span className="text-caption font-caption">Home</span>
        </button>
        <button 
          onClick={() => onNavigate('curator_ai')}
          className="flex flex-col items-center justify-center bg-primary-container text-on-primary rounded-2xl px-4 py-1 scale-90 transition-transform duration-200 cursor-pointer border-none"
        >
          <span className="material-symbols-outlined" data-icon="chat_bubble" style={{ fontVariationSettings: "'FILL' 1" }}>chat_bubble</span>
          <span className="text-caption font-caption font-bold">Guide</span>
        </button>
        <button 
          onClick={() => onNavigate('aspirators')}
          className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1 active:bg-surface-variant cursor-pointer border-none bg-transparent"
        >
          <span className="material-symbols-outlined" data-icon="search">search</span>
          <span className="text-caption font-caption">Explore</span>
        </button>
        <button 
          onClick={() => onNavigate('learning_plan')}
          className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1 active:bg-surface-variant cursor-pointer border-none bg-transparent"
        >
          <span className="material-symbols-outlined" data-icon="local_library">local_library</span>
          <span className="text-caption font-caption">Library</span>
        </button>
      </nav>

    </div>
  );
};
