import React, { useState } from 'react';
import { Layers, Code2, Image as ImageIcon, Sparkles, MousePointer, HelpCircle, X, ExternalLink, Check, Copy } from 'lucide-react';
import { AppView } from '../types';

interface StitchCanvasGuideProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

export const StitchCanvasGuide: React.FC<StitchCanvasGuideProps> = ({ currentView, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <>
      {/* Floating Canvas Guide Pill */}
      <button
        id="stitch-guide-trigger"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white font-medium rounded-full shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-105 transition-all cursor-pointer border border-white/20"
      >
        <HelpCircle className="w-5 h-5 animate-pulse" />
        <span className="text-sm font-semibold">Where to find it in Stitch Canvas?</span>
      </button>

      {/* Modal / Flyout Guide */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Finding Assets & Code in Google Stitch Canvas</h3>
                  <p className="text-xs text-slate-400">Step-by-step location guide for frames, HTML markup, and image assets</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Step 1: Canvas Artboards */}
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 mt-0.5">
                    <MousePointer className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white text-sm flex items-center justify-between">
                      <span>1. Screen Frames & Artboards on the Canvas</span>
                      <span className="text-xs text-blue-400 font-mono">Center Workspace</span>
                    </h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      All generated UI views (Landing, Junior Dashboard, Aspirators Portal, Quests, AI Curator, and Parent Dashboard) are rendered as separate rectangular artboards directly in the infinite canvas.
                    </p>
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      <button onClick={() => { onNavigate('landing'); setIsOpen(false); }} className="text-xs px-2.5 py-1 bg-slate-700 hover:bg-blue-600 rounded text-slate-200 transition">🌐 Landing View</button>
                      <button onClick={() => { onNavigate('junior'); setIsOpen(false); }} className="text-xs px-2.5 py-1 bg-slate-700 hover:bg-amber-600 rounded text-slate-200 transition">🦁 Junior Dashboard</button>
                      <button onClick={() => { onNavigate('aspirators'); setIsOpen(false); }} className="text-xs px-2.5 py-1 bg-slate-700 hover:bg-emerald-600 rounded text-slate-200 transition">🚀 Aspirators Portal</button>
                      <button onClick={() => { onNavigate('quest_player'); setIsOpen(false); }} className="text-xs px-2.5 py-1 bg-slate-700 hover:bg-purple-600 rounded text-slate-200 transition">🔭 Science Quest</button>
                      <button onClick={() => { onNavigate('curator_ai'); setIsOpen(false); }} className="text-xs px-2.5 py-1 bg-slate-700 hover:bg-indigo-600 rounded text-slate-200 transition">🤖 Curator AI</button>
                      <button onClick={() => { onNavigate('parent_dashboard'); setIsOpen(false); }} className="text-xs px-2.5 py-1 bg-slate-700 hover:bg-rose-600 rounded text-slate-200 transition">🛡️ Parent Portal</button>
                      <button onClick={() => { onNavigate('api_explorer'); setIsOpen(false); }} className="text-xs px-2.5 py-1 bg-slate-700 hover:bg-cyan-600 rounded text-slate-200 transition">⚡ API Services Gateway</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: HTML & Code Inspector */}
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 mt-0.5">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white text-sm flex items-center justify-between">
                      <span>2. Finding the HTML Code in Stitch</span>
                      <span className="text-xs text-emerald-400 font-mono">Right Panel → &lt;&gt; Code Tab</span>
                    </h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      1. Click on any screen frame on the Stitch canvas to select it.<br />
                      2. Look at the <strong>top right inspector panel</strong> and switch from "Design" to <strong>"Code" / "&lt;&gt;"</strong>.<br />
                      3. You can click <strong>"Copy HTML / React"</strong> directly from that panel.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3: Images and Asset URLs */}
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 mt-0.5">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white text-sm flex items-center justify-between">
                      <span>3. Finding the Generated Images & Icons</span>
                      <span className="text-xs text-purple-400 font-mono">Image Source &lt;img src="..."&gt;</span>
                    </h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Stitch hosts generated graphics on Google Cloud CDN links (such as <code className="text-purple-300 bg-slate-900 px-1 py-0.5 rounded">lh3.googleusercontent.com/aida-public/...</code>). In the Code tab or by right-clicking on any image in the canvas, you can choose <strong>"Copy Image Address"</strong> or inspect the <code className="text-purple-300">&lt;img src="..."&gt;</code> tag.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 4: Left Layers Navigator */}
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 mt-0.5">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white text-sm flex items-center justify-between">
                      <span>4. Left Sidebar "Layers" Panel</span>
                      <span className="text-xs text-amber-400 font-mono">Left Sidebar</span>
                    </h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      On the far left column of Stitch, the Layers tree lists all screens. Double-clicking any screen name in the left panel automatically zooms your viewport directly to that artboard on the canvas.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setIsOpen(false)}
                className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition cursor-pointer"
              >
                Got it, let's explore the app!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
