# illume

**The AI tutor that finds exactly what you don't understand by making you explain it first.**

illume is an AI-powered diagnostic tutor for students ages 8–14. Instead of quizzing students or handing them answers, it asks them to explain a topic in their own words, then uses AI to pinpoint the exact conceptual gaps in their understanding. Gaps are displayed as visual "Glow Spots" that light up as each concept is mastered.

Built for the SPEED August AI Challenge.

---

## Why illume is different

| Generic AI Tutor | illume |
|---|---|
| "75% — Try again" | "You understand glucose, need chlorophyll" |
| Explains everything | Targets the exact gap with an analogy |
| Percentage score | Visual cards that physically light up |
| "Keep practicing" | Celebration when all concepts are mastered |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + custom design system |
| UI Primitives | shadcn/ui, Base UI |
| AI Backend | Groq API (OpenAI-compatible) |
| AI Models | gpt-oss-120b, with fallback to gpt-oss-20b and qwen3.6-27b |
| State | Zustand with localStorage persistence |
| Charts | Recharts |
| Icons | Lucide React |
| Analytics | Vercel Analytics |
| Package Manager | pnpm |
| Deployment | Vercel |

---

## How It Works

1. A student is given a topic and a question, and answers by explaining the concept in their own words.
2. The answer is sent to the Groq API, which returns a structured diagnostic: a mastery score, an overall status, and a set of specific "Glow Spots" — the individual concepts the student does or does not understand.
3. Mastered concepts appear as lit, glowing cards. Unmastered concepts appear dim and clickable.
4. Clicking a dim Glow Spot reveals a short, analogy-based micro-lesson. Once the student confirms they understand, the spot lights up.
5. When every concept is lit, a celebration screen appears and the session is marked complete.
6. All sessions persist locally, feeding a dashboard with a mastery trend chart and a "Concept Constellation" — a visual map of every concept studied, rendered with a blur-to-focus effect based on mastery level.

---

## Project Structure

```
illume-main/
├── app/
│   ├── layout.tsx                 # Root layout (fonts, cookie banner, analytics)
│   ├── page.tsx                   # Dashboard (dark theme, constellation UI)
│   ├── globals.css                # Design system tokens + Lamp Glow system
│   ├── not-found.tsx              # 404 page
│   ├── diagnose/
│   │   └── page.tsx               # Core AI diagnostic flow
│   ├── api/
│   │   └── illume/
│   │       └── route.ts           # POST endpoint — Groq AI integration
│   └── (marketing)/                # Route group — public pages
│       ├── layout.tsx
│       ├── page.tsx                # Marketing homepage
│       ├── students/
│       ├── parents/
│       └── educators/
├── components/
│   ├── Bud.tsx                     # SVG mascot (5 moods)
│   ├── GlowSpotCard.tsx            # Concept card (dim/lit states)
│   ├── CelebrationScreen.tsx       # Victory modal + confetti
│   ├── SiteHeader.tsx
│   ├── SiteFooter.tsx
│   ├── CookieBanner.tsx
│   ├── FriendlyErrorState.tsx
│   ├── LegalPageLayout.tsx
│   └── ui/
│       └── button.tsx
├── lib/
│   ├── utils.ts
│   ├── store/
│   │   └── diagnostics-store.ts    # Zustand store + helper functions
│   └── supabase/
│       ├── client.ts               # Reserved for future auth
│       └── server.ts               # Reserved for future auth
└── Documentation/
    ├── README.md
    ├── DEPLOYMENT.md
    ├── FRONTEND_WORKFLOWS.md
    ├── PROJECT_SUMMARY.md
    └── TEST_THIS_NOW.md
```

---

## Route Map

| Route | Type | Description |
|---|---|---|
| `/` | Dashboard | Progress view: constellation, trend chart, recent topics |
| `/diagnose` | App | Core AI diagnostic flow |
| `/api/illume` | API (POST) | Groq AI integration endpoint |
| `/(marketing)` | Marketing | Homepage hero and feature showcase |
| `/(marketing)/students` | Marketing | Student landing page |
| `/(marketing)/parents` | Marketing | Parent landing page |
| `/(marketing)/educators` | Marketing | Educator landing page |

---

## Design System

**Typography**
- Display: Fredoka (headings)
- Body: Inter (UI text)
- Data: IBM Plex Mono (numbers, stats)

**Color Palette**
- Primary: `#F5A524` (amber) — brand, CTAs, lit glow state
- Secondary: `#3730A3` (indigo) — accents, follow-up prompts
- Status colors: teal for resolved, amber for in progress, coral for a gap

**Lamp Glow System**

A signature visual motif built from three CSS constructs:
- `.lamp-glow` — a radial-gradient blur behind mastered concepts
- `.lamp-bloom` — a one-shot animation that plays when a concept resolves
- `.focus-dot` — dashboard constellation dots, encoded with blur and opacity based on mastery percentage

All animations respect `prefers-reduced-motion`.

---

## Getting Started

### Prerequisites

- Node.js 18 or later
- pnpm
- A Groq API key

### Installation

```bash
git clone <repository-url>
cd illume-main
pnpm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```bash
GROQ_API_KEY=gsk_your_key_here
```

### Run Locally

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`.

---

## Current Limitations

- No authentication — all data is stored in localStorage, per browser
- Single-round diagnosis — one submission per session, no adaptive follow-up yet
- Supabase client and server files are scaffolded but not yet wired in
- No server-side persistence — sessions are lost if browser data is cleared
- Marketing page auth links currently point to a placeholder route

---

## Roadmap

- Supabase authentication (anonymous and email/password)
- Multi-round adaptive diagnostic flow (2–4 questions per topic)
- Parent and educator dashboards
- Class management tools for teachers
- Progress reports and analytics
- Email notifications
- Mobile apps (React Native)

---

## License

Specify a license for this project before publishing publicly.
