# IP-SAKTI Sahayak — Frontend Handoff

This phase rebuilt the frontend as a real React + Vite application, using the
uploaded `ip-sakti-sahayak.html` single-file prototype as the design and
content reference. The prototype's design tokens (forest green / ivory /
saffron), CSS architecture, section content, and mock data were carried over
and extended rather than replaced. No backend, Gemini, RAG, or database code
was touched or created — this is a UI-only deliverable.

## 1. What was changed / built

- Converted the single-file HTML/vanilla-JS prototype into a componentised
  React 19 + Vite app (`src/`), keeping the original CSS variables, color
  palette and most class names so the visual identity carries over exactly.
- Added a new **cinematic intro experience** that did not exist before:
  title reveal → language selection → "Choose your path" → bottom-up wipe
  into the main app shell. Skippable, and skipped automatically for
  returning users.
- Rebuilt every view as a React component with Framer Motion page
  transitions, staggered entrances, and consistent hover/focus states.
- Added a reusable animation system (`src/lib/variants.js`) instead of
  ad-hoc transitions per component.
- Added reusable empty/error/loading-skeleton components for future API
  wiring (`src/components/common/States.jsx`).
- Added a `PatentRiskResult` component built to the `{ score, riskLevel,
  factors }` shape described in the brief, with animated radial score and
  progress bars.
- Added a very light Three.js ambient particle field
  (`@react-three/fiber`) used only behind the intro and the home hero —
  nowhere else, and it respects `prefers-reduced-motion`.

## 2. Existing pages (all present, ported from the prototype)

| View | Component | Status |
|---|---|---|
| Intro sequence | `components/intro/IntroSequence.jsx` | New — done |
| Language selection | `components/intro/LanguageSelect.jsx` | New — done |
| Choose your path | `components/intro/ChoosePath.jsx` | New — done |
| Home | `views/Home.jsx` | Done |
| Ask Sahayak | `views/AskSahayak.jsx` | Done |
| Product Assessment | `views/ProductAssessment.jsx` | Done (6-step wizard) |
| Patent Risk Assessment | `views/PatentRiskAssessment.jsx` | Done (9-field intake + result) |
| IP Navigator | `views/IPNavigator.jsx` | Done |
| ABS & Biodiversity | `views/ABS.jsx` | Done |
| Traditional Knowledge | `views/TraditionalKnowledge.jsx` | Done |
| Knowledge Centre | `views/KnowledgeCentre.jsx` | Done |
| Document Reader (+ AI side panel) | `views/DocumentReader.jsx` | Done |
| Sources | `views/Sources.jsx` | Done |
| My Assessments | `views/MyAssessments.jsx` | Done |
| Report | `views/Report.jsx` | Done (print-friendly via `window.print()`) |

## 3. Existing / reusable components

- `components/common/SourceCard.jsx` — authoritative source card, used in
  chat, sources, reader, report, ABS.
- `components/common/Wizard.jsx` — generic step wizard shell, used by both
  Product Assessment and Patent Risk Assessment.
- `components/common/PatentRiskResult.jsx` — visual-only, structured for a
  real API payload.
- `components/common/States.jsx` — `EmptyState`, `ErrorState`,
  `BackendUnavailable`, `Skeleton`, `ChatLoading`, `CardLoading`,
  `AssessmentLoading`, `ReportLoading`, `SourceLoading`.
- `components/common/PageTransition.jsx` — wraps every view with the
  standard opacity/y/scale page transition.
- `components/common/BrandMark.jsx` — the leaf mark, shared by sidebar and
  intro.
- `components/layout/Sidebar.jsx`, `components/layout/Topbar.jsx`.
- `components/three/ParticleField.jsx` — ambient background, intro + home
  hero only.

## 4. Animation system

`src/lib/variants.js` exports: `fadeIn`, `fadeUp`, `scaleIn`,
`staggerContainer(stagger, delay)`, `staggerItem`, `pageTransition`,
`cardHover`, `cardTap`, `chatUserMsg`, `chatAiMsg`. Every view composes
these instead of writing bespoke Framer Motion configs, so timing and
easing stay consistent (`EASE` / `EASE_OUT` cubic-béziers, 180–600ms
durations).

## 5. Design system

All tokens live in `src/styles/tokens.css`:
- Colors: `--ivory`, `--forest`, `--forest-deep`, `--charcoal`, `--saffron`,
  `--saffron-light`, `--sand`, `--line`, plus semantic `--ok` / `--warn` /
  `--low`.
- Radius: `--radius-sm` / `--radius` / `--radius-lg`.
- Shadows: `--shadow`, `--shadow-lg`.
- Motion: `--ease`, `--ease-out`, `--dur-sm/md/lg`.

Layered stylesheets, imported in this order from `src/styles/index.css`:
`tokens.css` → `shell.css` (sidebar/topbar/app shell) → `intro.css`
(intro/language/choose-path) → `views.css` (everything else). Tailwind v4
is included via `@tailwindcss/vite` and imported first, available for
incremental utility use, but the existing design-token CSS remains the
primary system to preserve the exact visual identity from the prototype.

## 6. Three.js usage

Only `ParticleField` (`@react-three/fiber` + `three`), a few hundred
points with slow drift, used behind the intro screen and the home hero.
Nothing else in the app uses Three.js or WebGL, by design, to keep every
other route fast. The component returns `null` under
`prefers-reduced-motion: reduce`.

## 7. Framer Motion usage

Used throughout for page transitions (`AnimatePresence` + `PageTransition`
in `App.jsx`), staggered card/list entrances, the intro letter-reveal, the
language-card selection glow, the bottom-up wipe transition
(`WipeTransition.jsx`), chat message reveals, the patent-risk radial/bar
animations, and the document-reader AI side panel slide-in.

## 8. Responsive behavior

- Sidebar collapses to an off-canvas drawer under 900px (`#menu-toggle`,
  `#drawer-overlay`), opened from the topbar.
- `grid-3` / `grid-2` collapse to a single column under 900px.
- Language grid: 4 → 3 → 2 columns at 900px / 560px breakpoints.
- Knowledge Centre and Document Reader layouts collapse from two columns
  to one under 900px.
- Long strings (URLs, source titles) can't force horizontal overflow —
  `min-width:0` is applied to every flex/grid child that holds dynamic
  text (carried over from the original prototype's fix and extended).

## 9. Accessibility

- Every interactive element is a real `<button>` (not a styled `<div>`),
  including cards, chips, suggestion pills, and nav items.
- Visible focus ring via `:focus-visible` using the saffron accent.
- `aria-current="page"` on the active nav item, `aria-pressed` on language
  cards, `aria-label` on icon-only buttons.
- `@media (prefers-reduced-motion: reduce)` collapses all transition/
  animation durations globally, and disables the Three.js particle field.

## 10. Important files

- `src/App.jsx` — phase state machine (`intro` → `language` → `path` →
  `app`) and the main view router.
- `src/data/mockData.js` — **all** placeholder/reference content, clearly
  commented as UI-only, not connected to any backend.
- `src/lib/variants.js` — the animation system.
- `src/styles/*.css` — the design system, layered.

## 11. Build command

```bash
npm install
npm run build   # vite build → dist/
npm run lint    # eslint .
```

**Note on this handoff:** the sandbox this frontend was built in has no
network access, so `npm install` / `npm run build` / `npm run lint` could
not actually be executed here. Every `.jsx`/`.js` file was instead
syntax-checked individually with esbuild (transform-only, no module
resolution) and came back clean — but a real `npm install && npm run
build` should be the first thing run after unzipping, and any dependency-
resolution issues (for example if a pinned version in `package.json`
doesn't exist on the registry) should be treated as expected first-run
work, not a regression.

## 11a. Intro persistence — fixed

Earlier drafts of `App.jsx` wrote a `sahayak_returning` flag to
`localStorage` on first completing (or skipping) the intro, and read that
flag on load to decide whether to start at `PHASE.INTRO` or jump straight
to `PHASE.APP`. That caused the intro to permanently disappear after the
first visit. This has been removed:

- `phase` now **always** initializes to `PHASE.INTRO` — no localStorage
  check.
- `enterApp()` no longer sets any "seen" / "returning" flag. It only
  persists the chosen language (`sahayak_lang`), which does not affect
  whether the intro shows.

The app has a single route (`/`) with no client-side router — every load
(fresh tab, reload, or refresh mid-app) re-mounts `App` from scratch with
in-memory state, so every load now shows the full intro → language →
choose-path → app sequence, including a refresh that happens mid-intro
(it simply restarts the sequence) or mid-app (it returns to the intro,
which is the intended behavior here since there are no distinct URLs per
view to preserve).

If a future phase adds a real router (e.g. React Router) with distinct
URLs per view, this is the place to special-case deep links so a refresh
on `/chat` doesn't bounce back to the intro — but that's out of scope for
this fix.

## 12. Known limitations

- Backend status (`checking` / `online` / `offline` in Ask Sahayak) is a
  reachability check against `VITE_SAHAYAK_API_BASE` (defaults to
  `http://127.0.0.1:8000/health`) — it does not call any real endpoint
  logic beyond that.
- Ask Sahayak's answers, the Patent Risk score, the Report content, and
  the Document Reader's AI panel are static, clearly-labelled placeholder
  content (see `src/data/mockData.js` and the inline comments in
  `AskSahayak.jsx` / `PatentRiskAssessment.jsx`). None of it is generated.
- Product Assessment's "Complete assessment" step shows a placeholder
  confirmation screen rather than a real classification result.
- Knowledge Centre filters are visual only (not yet wired to filter the
  document list).
- No automated tests were added in this phase.

## 13. Future backend integration points

- `AskSahayak.jsx` — replace `buildDemoAnswer()` with a real API call;
  the rendered shape already expects `{ lead, why, confidence, sources,
  nextSteps }`.
- `PatentRiskAssessment.jsx` / `components/common/PatentRiskResult.jsx` —
  replace `SAMPLE_RISK_RESULT` with a live POST of the 9 intake fields,
  response shape `{ score, riskLevel, factors: [{label, value, tone}] }`.
- `Report.jsx` — replace the static `SECTIONS` array with a real report
  payload `{ report, sources, assessment }`.
- `DocumentReader.jsx` — replace `READER_DOCS` with real document content
  from the Knowledge Centre API; the AI side panel already POSTs a
  question/response pair shape.
- `App.jsx` — `API_BASE` / `VITE_SAHAYAK_API_BASE` is the single place to
  point the app at a real backend.
