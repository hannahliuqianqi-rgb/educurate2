import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Flame, 
  Clock, 
  Sliders, 
  CheckCircle2, 
  Sparkles, 
  BrainCircuit, 
  AlertCircle, 
  Eye, 
  Lock, 
  User, 
  Check, 
  ArrowLeft,
  ChevronRight
} from 'lucide-react';
import { PARENT_ADAPTATION_LOGS, APPROVED_CONTENT_QUEUE } from '../data/mockData';
import { AppView, ParentAdaptationLog } from '../types';

interface ParentDashboardProps {
  onNavigate: (view: AppView) => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({ onNavigate }) => {
  const [logs, setLogs] = useState<ParentAdaptationLog[]>(PARENT_ADAPTATION_LOGS);
  const [selectedLog, setSelectedLog] = useState<ParentAdaptationLog | null>(null);
  const [screenLimit, setScreenLimit] = useState('45 min');
  const [strictFilter, setStrictFilter] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      
      {/* Top Banner */}
      <div className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('landing')}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                  GUARDIAN & PARENT PORTAL
                </span>
                <span className="text-xs text-slate-400">Real-Time Supervision</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] mt-1">
                Leo's Learning Oversight
              </h1>
            </div>
          </div>

          {/* Child Profile Switcher */}
          <div className="flex items-center gap-3 bg-slate-900 border border-slate-700 px-4 py-2 rounded-2xl shadow-inner">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-sm">
              🦁
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-white leading-tight">Leo (Age 6)</p>
              <p className="text-[10px] text-amber-400 font-medium">Early Childhood & Aspirator</p>
            </div>
          </div>

        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>Daily Screen Time</span>
              <Clock className="w-4 h-4 text-sky-400" />
            </div>
            <p className="text-2xl font-black text-white font-['Outfit']">32 / {screenLimit}</p>
            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-sky-400 w-[70%]" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>Learning Streak</span>
              <Flame className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-black text-white font-['Outfit']">12 Days Active</p>
            <p className="text-[11px] text-emerald-400 font-medium">+450 Stars Collected</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>Verified Safe Content</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-black text-white font-['Outfit']">100% Curated</p>
            <p className="text-[11px] text-slate-400 font-medium">0 Distraction Algorithms</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>AI Adaptation Rate</span>
              <BrainCircuit className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-2xl font-black text-white font-['Outfit']">3 Modulations</p>
            <p className="text-[11px] text-purple-300 font-medium">All logged below for audit</p>
          </div>

        </div>

        {/* 2-Column Split: AI Adaptation Log + Approved Queue & Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column (7 cols): "How the AI is Adapting" */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-purple-400" />
                <h3 className="text-xl font-bold text-white font-['Outfit']">How the AI is Adapting</h3>
              </div>
              <span className="text-xs text-slate-400">Transparent pedagogical audit log</span>
            </div>

            <div className="space-y-3">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition shadow-xl space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-purple-400 font-semibold">{log.time}</span>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold">
                      {log.metric}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-white">{log.title}</h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{log.description}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="text-xs text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Review Adaptation Reason</span>
                    </button>
                    <span className="text-[11px] text-slate-500">Autonomous Level 1</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column (5 cols): Content Queue & Quick Controls */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Approved Content Queue */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-base">Approved Content Queue</h4>
                <span className="text-xs text-emerald-400 font-semibold">3 in Queue</span>
              </div>

              <div className="space-y-2.5">
                {APPROVED_CONTENT_QUEUE.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-white">{item.title}</p>
                      <p className="text-[10px] text-slate-400">{item.category} • {item.ageRating}</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono">
                      {item.approvedDate}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Guardian Controls */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5 shadow-xl">
              <h4 className="font-bold text-white text-base">Guardian Controls</h4>

              {/* Time Limit Setting */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Daily Screen Time Cap</label>
                <div className="grid grid-cols-3 gap-2">
                  {['30 min', '45 min', '60 min'].map((time) => (
                    <button
                      key={time}
                      onClick={() => setScreenLimit(time)}
                      className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                        screenLimit === time
                          ? 'bg-rose-600 text-white shadow'
                          : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white">Strict Curated Content Only</p>
                    <p className="text-[10px] text-slate-400">Blocks unverified external links</p>
                  </div>
                  <button
                    onClick={() => setStrictFilter(!strictFilter)}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      strictFilter ? 'bg-emerald-500' : 'bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                        strictFilter ? 'left-6' : 'left-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white">AI Voice Playmate Active</p>
                    <p className="text-[10px] text-slate-400">Allows speech input with mascot robot</p>
                  </div>
                  <button
                    onClick={() => setVoiceEnabled(!voiceEnabled)}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      voiceEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                        voiceEnabled ? 'left-6' : 'left-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* Review Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-purple-500/40 rounded-3xl w-full max-w-md p-6 text-slate-200 shadow-2xl space-y-4">
            <h3 className="font-bold text-white text-base">{selectedLog.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{selectedLog.description}</p>
            <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/40 text-xs text-purple-300">
              <strong>Pedagogical Rationale:</strong> Maintains positive reinforcement loop while preventing cognitive fatigue.
            </div>
            <button
              onClick={() => setSelectedLog(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
