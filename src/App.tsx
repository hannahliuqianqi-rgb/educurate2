/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppView } from './types';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { JuniorDashboard } from './components/JuniorDashboard';
import { AspiratorsPortal } from './components/AspiratorsPortal';
import { QuestPlayer } from './components/QuestPlayer';
import { CuratorChatBuilder } from './components/CuratorChatBuilder';
import { LearningPlanDetail } from './components/LearningPlanDetail';
import { ParentDashboard } from './components/ParentDashboard';
import { ApiExplorer } from './components/ApiExplorer';
import { StitchCanvasGuide } from './components/StitchCanvasGuide';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('landing');

  const handleNavigate = (view: AppView) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-primary selection:text-white">
      {/* Top Main Navigation Bar for Sub-Pages */}
      {currentView !== 'landing' && currentView !== 'curator_ai' && currentView !== 'learning_plan' && currentView !== 'aspirators' && currentView !== 'junior' && (
        <Navbar currentView={currentView} onNavigate={handleNavigate} />
      )}

      {/* Main View Display */}
      <main className="flex-1">
        {currentView === 'landing' && <LandingPage onNavigate={handleNavigate} />}
        {currentView === 'junior' && <JuniorDashboard onNavigate={handleNavigate} />}
        {currentView === 'aspirators' && <AspiratorsPortal onNavigate={handleNavigate} />}
        {currentView === 'quest_player' && <QuestPlayer onNavigate={handleNavigate} />}
        {currentView === 'curator_ai' && <CuratorChatBuilder onNavigate={handleNavigate} />}
        {currentView === 'learning_plan' && <LearningPlanDetail onNavigate={handleNavigate} />}
        {currentView === 'parent_dashboard' && <ParentDashboard onNavigate={handleNavigate} />}
        {currentView === 'api_explorer' && <ApiExplorer />}
      </main>

      {/* Quick Interactive Guide on Finding Screens & HTML Code in Google Stitch Canvas */}
      <StitchCanvasGuide currentView={currentView} onNavigate={handleNavigate} />

      {/* Footer for Sub-Pages */}
      {currentView !== 'landing' && currentView !== 'curator_ai' && currentView !== 'learning_plan' && currentView !== 'aspirators' && currentView !== 'junior' && (
        <footer className="border-t border-slate-800/80 bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-400">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white font-['Outfit']">EduCurate</span>
              <span>• Verified Adaptive Pedagogy</span>
            </div>
            <p className="text-slate-400">
              Engineered for high-trust learning from Early Childhood to University & Beyond.
            </p>
            <div className="flex items-center gap-4 text-slate-400">
              <button onClick={() => handleNavigate('parent_dashboard')} className="hover:text-white transition cursor-pointer">Guardian Controls</button>
              <button onClick={() => handleNavigate('curator_ai')} className="hover:text-white transition cursor-pointer">AI Curator</button>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
