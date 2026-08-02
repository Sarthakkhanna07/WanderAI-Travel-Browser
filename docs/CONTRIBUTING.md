# Contributing to Wander AI

Welcome! This guide covers everything you need to start contributing to the project.

> **Before reading this:** Make sure you've completed the [setup guide](./SETUP.md) and understand the [project architecture](./ARCHITECTURE.md).

---

## 1. Project Overview (Quick)

**Wander AI** is a map-first AI travel planning platform built with:
- **Next.js 16** (App Router) + TypeScript
- **Mapbox GL JS** for interactive maps
- **Groq** (`llama-3.1-8b-instant`) for AI features
- **Supabase** (PostgreSQL + Auth + Storage) + **Prisma ORM**

The app lets users chat with an AI travel assistant, create itineraries on an interactive map, follow creators, and browse a travel marketplace.

---

## 2. Getting Started

```bash
# 1. Clone & install
git clone https://github.com/yourusername/travel-browser.git
cd travel-browser
npm install

# 2. Set up environment (see docs/SETUP.md)
cp env.local.example .env.local
# Fill in your keys

# 3. Push DB schema
npm run db:push

# 4. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 3. Common Contribution Tasks

### Adding a New Page

1. Create `app/your-route/page.tsx`
2. Mark as `"use client"` only if you need browser APIs / React state
3. Wrap content in the `<Sidebar>` layout (follow the pattern in `app/chat/page.tsx`)
4. Test navigation from the sidebar

### Adding a New API Route

1. Create `app/api/your-route/route.ts`
2. Export `GET`, `POST`, etc. as named async functions
3. Always call `createServerClient()` from `lib/supabase/server.ts` for auth
4. Return `NextResponse.json()` consistently

### Modifying the Database Schema

```bash
# 1. Edit prisma/schema.prisma
# 2. Regenerate the Prisma client
npm run db:generate
# 3. Push changes to Supabase
npm run db:push
```

> **Important:** Never edit the Supabase Dashboard tables directly — always go through Prisma schema → push.

### Adding New Mapbox Features

Map components live in `components/map/`. The core component is `MapCanvas.tsx`.

- Initialize Mapbox only inside `useEffect` (it is browser-only)
- Use `"use client"` on any component that imports `mapbox-gl`
- Use `useRef` to hold the map instance — never store it in React state

### Adding a New AI Feature

1. Define your system prompt in `lib/ai/` (follow `itinerary-prompt.ts` pattern)
2. Create an API route that calls the Groq SDK:
   ```typescript
   import Groq from "groq-sdk";
   const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
   const completion = await groq.chat.completions.create({
     model: "llama-3.1-8b-instant",
     messages: [systemMsg, userMsg],
   });
   ```
3. Always validate and parse the LLM JSON response — use the helper in `lib/ai/itinerary-prompt.ts` as a reference

---

## 4. Code Style

| Rule | Detail |
|---|---|
| **TypeScript** | All files must be typed. No `any` unless unavoidable. |
| **Comments** | Add a JSDoc comment on every exported function |
| **Naming** | Components: `PascalCase`. Utils/hooks: `camelCase`. Files: `PascalCase` for components, `camelCase` for utils |
| **Error handling** | Every `async` function must have `try/catch`. API routes return structured `{ error: "..." }` responses. |
| **Imports** | Use `@/` path alias (e.g., `@/lib/prisma`, `@/components/sidebar/Sidebar`) |

---

## 5. Folder Conventions

```
app/                    Pages and API routes (Next.js App Router)
  api/                  Backend endpoints
  [feature]/page.tsx    Page components

components/             Reusable UI components
  map/                  Mapbox components
  chat/                 Chat UI
  sidebar/              Navigation
  following/            Social feed

lib/                    Utilities and helpers
  ai/                   LLM prompt engineering
  supabase/             Supabase client setup
  video/                YouTube processing
  auth.ts               Auth helpers
  geocoding.ts          Mapbox geocoding

data/                   Static data (mock stays, etc.)
types/                  Shared TypeScript types
prisma/                 Database schema
public/                 Static assets (icons, images, videos)
docs/                   Project documentation (you are here)
```

---

## 6. Important Notes

- **Never commit `.env.local`** — it contains API keys
- **Mapbox is the only map provider** — do not add Ola Maps or Google Maps (there is an empty `app/api/olamaps/` dir; ignore it)
- **Groq is the only LLM** — do not add OpenAI or Gemini SDK calls to new features without discussion
- **Test your feature** before pushing — see [`docs/TESTING.md`](./TESTING.md) for manual testing steps
- **Prisma + Supabase dual layer** — Use Prisma for itinerary CRUD. Use Supabase JS directly for auth, user upserts, and marketplace tables

---

## 7. Useful Commands Reference

```bash
npm run dev            # Start development server
npm run build          # Production build
npm run lint           # Run ESLint
npm run db:generate    # Regenerate Prisma client
npm run db:push        # Push schema to Supabase
npm run db:studio      # Open Prisma Studio (database GUI)
npm run db:migrate     # Run migrations (production)
```
