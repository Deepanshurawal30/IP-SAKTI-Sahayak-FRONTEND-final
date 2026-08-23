import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

import IntroSequence from './components/intro/IntroSequence';
import LanguageSelect from './components/intro/LanguageSelect';
import ChoosePath from './components/intro/ChoosePath';
import WipeTransition from './components/intro/WipeTransition';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import PageTransition from './components/common/PageTransition';

import Home from './views/Home';
import AskSahayak from './views/AskSahayak';
import ProductAssessment from './views/ProductAssessment';
import PatentRiskAssessment from './views/PatentRiskAssessment';
import IPNavigator from './views/IPNavigator';
import ABS from './views/ABS';
import TraditionalKnowledge from './views/TraditionalKnowledge';
import KnowledgeCentre from './views/KnowledgeCentre';
import DocumentReader from './views/DocumentReader';
import Sources from './views/Sources';
import MyAssessments from './views/MyAssessments';
import Report from './views/Report';

const PHASE = {
  INTRO: 'intro',
  LANGUAGE: 'language',
  PATH: 'path',
  APP: 'app',
};

const API_BASE = import.meta.env.VITE_SAHAYAK_API_BASE || 'http://127.0.0.1:8000';

export default function App() {
  const [phase, setPhase] = useState(PHASE.INTRO);
  const [wiping, setWiping] = useState(false);
  const [pendingPhase, setPendingPhase] = useState(null);

  const [language, setLanguage] = useState(() => localStorage.getItem('sahayak_lang') || 'en');
  const [jurisdiction, setJurisdiction] = useState('india');
  const [currentView, setCurrentView] = useState('home');
  const [readerDoc, setReaderDoc] = useState('patents-act-1970');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking');

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 2500);
    fetch(`${API_BASE}/`, { signal: controller.signal })
      .then((res) => {
        if (!cancelled) setBackendStatus(res.ok ? 'online' : 'offline');
      })
      .catch(() => {
        if (!cancelled) setBackendStatus('offline');
      })
      .finally(() => window.clearTimeout(timer));
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  const goToPhase = (next) => {
    setPendingPhase(next);
    setWiping(true);
  };

  const finishWipe = () => {
    setWiping(false);
    if (pendingPhase) {
      setPhase(pendingPhase);
      setPendingPhase(null);
    }
  };

  const enterApp = () => {
    localStorage.setItem('sahayak_lang', language);
    goToPhase(PHASE.APP);
  };

  const navigate = (view, doc) => {
    if (view === 'reader' && doc) setReaderDoc(doc);
    if (view === 'home') setCurrentView('home');
    else setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openDocument = (docId) => {
    setReaderDoc(docId);
    setCurrentView('reader');
    window.scrollTo({ top: 0 });
  };

  if (phase === PHASE.INTRO) {
    return (
      <>
        <IntroSequence onEnter={() => goToPhase(PHASE.LANGUAGE)} onSkip={enterApp} />
        {wiping && <WipeTransition onComplete={finishWipe} />}
      </>
    );
  }

  if (phase === PHASE.LANGUAGE) {
    return (
      <>
        <LanguageSelect selected={language} onSelect={setLanguage} onContinue={() => goToPhase(PHASE.PATH)} />
        {wiping && <WipeTransition onComplete={finishWipe} />}
      </>
    );
  }

  if (phase === PHASE.PATH) {
    return (
      <>
        <ChoosePath
          language={language}
          onChoose={(view) => {
            setCurrentView(view);
            enterApp();
          }}
          onSkip={enterApp}
        />
        {wiping && <WipeTransition onComplete={finishWipe} />}
      </>
    );
  }

  return (
    <div id="app">
      <Sidebar currentView={currentView} onNavigate={navigate} open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <div id="main">
        <Topbar
          onOpenDrawer={() => setDrawerOpen(true)}
          onNavigateHome={() => navigate('home')}
          jurisdiction={jurisdiction}
          onJurisdictionChange={setJurisdiction}
          language={language}
          onLanguageChange={setLanguage}
        />

        <div id="view-root">
          <AnimatePresence mode="wait">
            <PageTransition key={currentView + (currentView === 'reader' ? readerDoc : '')}>
              {currentView === 'home' && <Home onNavigate={navigate} />}
              {currentView === 'chat' && <AskSahayak onNavigate={navigate} backendStatus={backendStatus} language={language} />}
              {currentView === 'assessment' && <ProductAssessment onNavigate={navigate} />}
              {currentView === 'patent-risk' && <PatentRiskAssessment />}
              {currentView === 'ipnav' && <IPNavigator onNavigate={navigate} />}
              {currentView === 'abs' && <ABS onNavigate={navigate} />}
              {currentView === 'tk' && <TraditionalKnowledge onNavigate={navigate} />}
              {currentView === 'knowledge' && <KnowledgeCentre onOpenDocument={openDocument} />}
              {currentView === 'reader' && <DocumentReader docId={readerDoc} onBack={() => navigate('knowledge')} />}
              {currentView === 'sources' && <Sources onOpenDocument={openDocument} />}
              {currentView === 'assessments' && <MyAssessments onNavigate={navigate} />}
              {currentView === 'report' && <Report onOpenDocument={openDocument} />}
            </PageTransition>
          </AnimatePresence>
        </div>

        <div className="disclaimer">
          <AlertTriangle />
          <div>
            This assistant provides information and source-based guidance, not legal advice. Regulatory and IP
            outcomes depend on facts and applicable law. Verify current requirements with the relevant authority
            or qualified professional.
          </div>
        </div>
        <div id="app-footer">IP-SAKTI Sahayak — Prototype for Smart India Hackathon 2026 · SIH26045 · Ministry of Ayush</div>
      </div>

      {wiping && <WipeTransition onComplete={finishWipe} />}
    </div>
  );
}