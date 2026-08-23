# IP-SAKTI Sahayak — Frontend

Premium, cinematic frontend for **IP-SAKTI Sahayak**, an Ayurveda + Intellectual
Property + Regulatory Intelligence platform. Built with React 19, Vite, Tailwind
CSS v4, Framer Motion and a light touch of Three.js (via `@react-three/fiber`).

This repository is **frontend only**. There is no backend, no Gemini/RAG
integration, and no real scoring logic here — every "AI answer", source, and
patent-risk score you see is clearly-labelled static UI content, structured to
match the shape a real API will eventually return.

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # production build → dist/
npm run lint     # eslint
```

## Experience flow

1. **Intro sequence** — cinematic full-screen title reveal (skippable, and
   skipped automatically for returning users via `localStorage`).
2. **Language selection** — a dark, tactile grid of 13 languages with a
   saffron/gold selected state.
3. **Choose your path** — a light, staggered card grid leading into the app.
4. **Main app shell** — sidebar + topbar + the product's core views.

## Project structure

```
src/
  components/
    common/     shared UI: SourceCard, Wizard, PatentRiskResult, loading/empty/error states
    intro/      IntroSequence, LanguageSelect, ChoosePath, WipeTransition
    layout/     Sidebar, Topbar
    three/      ParticleField (ambient Three.js background)
  views/        Home, AskSahayak, ProductAssessment, PatentRiskAssessment,
                IPNavigator, ABS, TraditionalKnowledge, KnowledgeCentre,
                DocumentReader, Sources, MyAssessments, Report
  data/         mockData.js — static reference content only
  lib/          variants.js — the shared Framer Motion animation system
  styles/       tokens.css, shell.css, intro.css, views.css
```

See `docs/FRONTEND_HANDOFF.md` for the full handoff notes, including future
backend integration points.
