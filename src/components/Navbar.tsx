import React from 'react';
import { 
  Compass, 
  Sparkles, 
  UserCheck, 
  Search, 
  GraduationCap, 
  Bot, 
  Gamepad2, 
  ShieldCheck, 
  Atom, 
  Bell, 
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { AppView } from '../types';

interface NavbarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-3 cursor-pointer group select-none flex-shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-amber-500 flex items-center justify-center shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold tracking-tight text-white font-['Outfit']">EduCurate</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30">AI</span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">Trusted Learning for Every Age</span>
            </div>
          </div>

          {/* Center View Selector Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/90 border border-slate-800 rounded-full p-1 shadow-inner">
            <button
              onClick={() => onNavigate('landing')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                currentView === 'landing'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => onNavigate('junior')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                currentView === 'junior' || currentView === 'junior_mentor'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-amber-400/90 hover:text-amber-300 hover:bg-slate-800'
              }`}
            >
              <span>🦁 Junior (3-7)</span>
            </button>

            <button
              onClick={() => onNavigate('aspirators')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                currentView === 'aspirators'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <span>🚀 Aspirators (7-12)</span>
            </button>

            <button
              onClick={() => onNavigate('quest_player')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                currentView === 'quest_player'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Science Quest</span>
            </button>

            <button
              onClick={() => onNavigate('curator_ai')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                currentView === 'curator_ai'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Curator AI</span>
            </button>

            <button
              onClick={() => onNavigate('learning_plan')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                currentView === 'learning_plan'
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Atom className="w-3.5 h-3.5" />
              <span>Quantum Plan</span>
            </button>

            <button
              onClick={() => onNavigate('parent_dashboard')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                currentView === 'parent_dashboard'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Parent Portal</span>
            </button>

            <button
              onClick={() => onNavigate('api_explorer')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                currentView === 'api_explorer'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-cyan-400/90 hover:text-cyan-300 hover:bg-slate-800'
              }`}
            >
              <span>⚡ API Gateway</span>
            </button>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2.5">
            {/* Quick Mobile Dropdown / Selector */}
            <div className="lg:hidden">
              <select
                value={currentView}
                onChange={(e) => onNavigate(e.target.value as AppView)}
                className="bg-slate-800 text-slate-200 text-xs rounded-lg border border-slate-700 px-2.5 py-1.5 font-medium"
              >
                <option value="landing">🌐 Landing View</option>
                <option value="junior">🦁 Junior (Ages 3-7)</option>
                <option value="aspirators">🚀 Aspirators (Ages 7-12)</option>
                <option value="quest_player">🔭 Science Quest</option>
                <option value="curator_ai">🤖 Curator AI Planner</option>
                <option value="learning_plan">⚛️ Quantum Computing Plan</option>
                <option value="parent_dashboard">🛡️ Parent Dashboard</option>
                <option value="api_explorer">⚡ API Services Gateway</option>
              </select>
            </div>

            {/* Notifications */}
            <button className="relative p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition cursor-pointer">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-400 rounded-full ring-2 ring-slate-950"></span>
            </button>

            {/* Active Profile */}
            <div 
              onClick={() => onNavigate('parent_dashboard')}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 text-slate-200 cursor-pointer transition"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center font-bold text-xs text-slate-950 shadow-sm">
                L
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-white leading-tight">Leo (Age 6)</p>
                <p className="text-[10px] text-amber-400">Level 4 Explorer</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
