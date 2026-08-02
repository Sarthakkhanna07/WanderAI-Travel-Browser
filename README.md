# Wander AI — Travel Browser

> *Browse travel like you browse the web.*

A map-first AI travel discovery and planning platform. Combine a ChatGPT-style travel assistant, an interactive Mapbox map, AI-powered itinerary generation, a creator content hub, and a travel marketplace — all in one place.

**Live Demo:** [Wander AI](https://wanderai-browser.vercel.app/)

---

See [PRD.md](./PRD.md) for current feature status and roadmap.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | TailwindCSS v4, Framer Motion |
| Mapping | **Mapbox GL JS** |
| AI / LLM | **Groq** — `llama-3.1-8b-instant` |
| Database | Supabase (PostgreSQL) + Prisma ORM |
| Auth | Supabase Auth (email/password + Google OAuth) |
| Storage | Supabase Storage (`avatars` bucket) |
| Video | YouTube Data API v3 |

---

## 🚀 Quickstart

### Prerequisites
- Node.js 18+
- Accounts on: [Supabase](https://supabase.com), [Groq](https://console.groq.com), [Mapbox](https://account.mapbox.com)

### Steps

```bash
# 1. Clone and install
git clone https://github.com/yourusername/travel-browser.git
cd travel-browser
npm install

# 2. Set up environment variables
cp env.local.example .env.local
# Open .env.local and fill in your keys (see docs/SETUP.md for details)

# 3. Push the Prisma schema to Supabase
npm run db:generate
npm run db:push

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Required environment variables:**
```env
DATABASE_URL=                      # Supabase PostgreSQL connection string
NEXT_PUBLIC_SUPABASE_URL=          # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=     # Supabase anon key
SUPABASE_SERVICE_ROLE_KEY=         # Supabase service role key (server-only)
GROQ_API_KEY=                      # Groq API key
NEXT_PUBLIC_MAPBOX_TOKEN=          # Mapbox public token
YOUTUBE_API_KEY=                   # Optional: YouTube Data API key (video itinerary)
```

---

## 📁 Project Structure

```
travel-browser/
├── app/
│   ├── api/
│   │   ├── chat/route.ts                        # AI chat endpoint (Groq)
│   │   ├── chats/route.ts                       # Chat session list
│   │   ├── chats/[chatId]/route.ts              # Chat messages
│   │   ├── itineraries/route.ts                 # Public itineraries list
│   │   ├── itineraries/[id]/route.ts            # Single itinerary + pins
│   │   ├── itineraries/create/route.ts          # Manual itinerary creation
│   │   ├── itineraries/create-ai/route.ts       # AI prompt → itinerary
│   │   ├── itineraries/create-ai-from-video/    # YouTube → itinerary
│   │   ├── itineraries/my-drafts/route.ts       # User draft itineraries
│   │   ├── share/chat/route.ts                  # Shareable chat links
│   │   ├── share/itenary/route.ts               # Shareable itinerary links
│   │   └── users/create/route.ts                # User upsert (service role)
│   ├── auth/callback/route.ts                   # OAuth callback
│   ├── chat/page.tsx                            # AI travel assistant
│   ├── itineraries/page.tsx                     # Map + itinerary list
│   ├── itineraries/add-itineraries/ai/          # AI itinerary builder
│   ├── itineraries/add-itineraries/manual/      # Manual map editor
│   ├── itinerary/[id]/page.tsx                  # Public itinerary view
│   ├── explore/page.tsx                         # Discovery page
│   ├── following/page.tsx                       # Social feed
│   ├── marketplace/page.tsx                     # Travel marketplace
│   ├── marketplace/stay/[id]/page.tsx           # Stay detail
│   ├── profile/page.tsx                         # User profile
│   ├── login/page.tsx                           # Sign in
│   ├── signup/page.tsx                          # Sign up
│   └── page.tsx                                 # Landing page
├── components/
│   ├── map/          MapCanvas, MarkerPalette, MapSearchBar, ItineraryMap
│   ├── chat/         ChatBubble, ItenaryMenu
│   ├── following/    FollowingFeed, StoriesSection, MessagesPanel, ...
│   ├── sidebar/      Sidebar (collapsible navigation)
│   ├── share/        ShareModal
│   └── GlassCarousel.tsx
├── lib/
│   ├── ai/           itinerary-prompt.ts (Groq system prompts)
│   ├── supabase/     client.ts, server.ts
│   ├── video/        youtube.ts (URL parser + metadata fetcher)
│   ├── auth.ts       Auth helpers
│   ├── geocoding.ts  Mapbox geocoding wrapper
│   └── prisma.ts     Prisma client singleton
├── data/
│   └── stays.ts      Static mock stays for marketplace
├── prisma/
│   └── schema.prisma Database schema
├── types/
│   └── supabase.ts   TypeScript types
└── middleware.ts      Session refresh middleware
```

---

## 🗄️ Database Commands

```bash
npm run db:generate    # Regenerate Prisma client after schema changes
npm run db:push        # Push schema to Supabase (no migration file)
npm run db:migrate     # Run migrations (for production)
npm run db:studio      # Open Prisma Studio GUI at localhost:5555
```

---

## 📚 Documentation

| Doc | Purpose |
|---|---|
| [`docs/SETUP.md`](./docs/SETUP.md) | All service setup — Supabase, Groq, Mapbox, YouTube |
| [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) | Tech stack, DB schema, full file inventory, API reference |
| [`docs/CONTRIBUTING.md`](./docs/CONTRIBUTING.md) | Contributor workflow, code style, common tasks |
| [`docs/AI_ITINERARY.md`](./docs/AI_ITINERARY.md) | AI itinerary feature — prompt and video flows |
| [`docs/TESTING.md`](./docs/TESTING.md) | Manual testing procedures for all major features |
| [`PRD.md`](./PRD.md) | Product vision and feature roadmap |
| [`docs/archive/`](./docs/archive/) | Superseded docs kept for historical reference |

---

## 📄 License

This project is private and proprietary.

---

Made with ❤️ by the Wander AI team
