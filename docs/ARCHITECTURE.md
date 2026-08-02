# Wander AI — Architecture Reference

> **Scope:** This is the single authoritative reference for what is *actually built and running* in the codebase.
> For the product vision and planned features see [`PRD.md`](../PRD.md).
> For environment setup see [`SETUP.md`](./SETUP.md).

---

## 1. Tech Stack

| Layer | Technology | Version | Notes |
|---|---|---|---|
| Framework | Next.js (App Router) | 16.0.0 | SSR + API routes |
| Language | TypeScript | 5.x | Strict mode |
| Styling | TailwindCSS | v4 | `@tailwindcss/postcss` |
| Animations | Framer Motion | 12.x | Page & component transitions |
| Icons | Lucide React | 0.552.0 | UI icon set |
| ORM | Prisma | 6.18.0 | Type-safe queries, PostgreSQL |
| Database / Auth | Supabase | 2.76.1 | PostgreSQL, Auth, Storage (`avatars` bucket) |
| SSR Auth | @supabase/ssr | 0.7.0 | Cookie-based session handling |
| Mapping | Mapbox GL JS | 3.16.0 | Interactive map, custom markers, routing |
| Geocoding | Mapbox Geocoding API | — | `api.mapbox.com/geocoding/v5/mapbox.places/` |
| Routing (directions) | Mapbox Directions API | — | `api.mapbox.com/directions/v5/mapbox/driving/` |
| AI / LLM | Groq SDK | 0.34.0 | Model: `llama-3.1-8b-instant` |
| Video metadata | YouTube Data API v3 | — | Video title, description, tags |
| Markdown render | react-markdown + remark-gfm | 10.x / 4.x | Chat bubble formatting |

> **Note (Ola Maps):** An empty `app/api/olamaps/` directory exists in the repo but contains no implementation. The entire mapping stack is Mapbox.

---

## 2. Database Schema

All models live in [`prisma/schema.prisma`](../prisma/schema.prisma) and map to a Supabase PostgreSQL database. Additional Supabase-only tables (`stays`, `reviews`, `stays_submissions`, `shared_chats`, `place_cache`) are managed directly via Supabase without Prisma.

### `User` / `users`
| Field | Type | Notes |
|---|---|---|
| `id` | UUID | PK — matches Supabase Auth UID |
| `email` | String | Unique |
| `username` | String | Unique |
| `full_name`, `avatar_url`, `bio` | String? | Profile fields |
| `user_type` | Enum | `TRAVELER` \| `CREATOR` |

### `Itinerary` / `itineraries`
| Field | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `title`, `description` | String | |
| `thumbnail` | String? | |
| `is_public` | Boolean | `false` = draft |
| `created_by` | FK → User | |

### `ItineraryPin` / `itinerary_pins`
| Field | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `itinerary_id` | FK → Itinerary | |
| `latitude`, `longitude` | Float | |
| `title`, `description` | String | |
| `type` | Enum | `HOTEL \| FOOD \| ATTRACTION \| CUSTOM \| CAR \| PIN` |
| `icon` | Enum | `PIN \| CAR \| HOTEL \| FOOD \| ATTRACTION` |
| `order_index`, `day` | Int | Ordering and day grouping |
| `date` | DateTime? | |
| `photos`, `videos` | String[] | URLs |
| `google_place_id` | String? | Optional Google Places linkage |
| `meta_json` | Json? | AI metadata, FAQs, confidence scores |
| `created_by` | FK → User | |

### `Chat` / `Message`
- `Chat`: `id` (cuid), `title`, `userId` (FK → User), timestamps
- `Message`: `id` (cuid), `content` (Text), `sender` ("user" \| "ai"), `chatId` (FK → Chat), timestamp

### `Follow` / `follows`
Tracks follower/following relationships between Users.

### `SavedItinerary` / `saved_itineraries`
Bookmarked itineraries per user.

### Supabase-only tables (no Prisma model)
- `stays` — Marketplace stay listings
- `reviews` — Community reviews
- `stays_submissions` — Partner stay application forms
- `shared_chats` — Shareable link records for chats and itineraries

---

## 3. File Inventory

### Configuration
| File | Purpose |
|---|---|
| `package.json` | Dependencies and scripts |
| `tsconfig.json` | TypeScript config |
| `next.config.ts` | Next.js config |
| `middleware.ts` | Session refresh via `@supabase/ssr` on every request |
| `prisma/schema.prisma` | PostgreSQL schema |

### Core Libraries (`lib/`)
| File | Purpose |
|---|---|
| `lib/prisma.ts` | PrismaClient singleton |
| `lib/auth.ts` | `signUp`, `signIn`, `signOut`, `getCurrentUser`, `signInWithGoogle`. Calls `/api/users/create` on signup. |
| `lib/supabase/client.ts` | Browser-side Supabase client |
| `lib/supabase/server.ts` | Server-side Supabase client (cookie-based) |
| `lib/geocoding.ts` | Mapbox Geocoding API — `geocodeLocation`, `geocodeMultipleLocations` (India bounding box default) |
| `lib/video/youtube.ts` | YouTube URL parser + metadata fetcher via YouTube Data API v3 |
| `lib/ai/itinerary-prompt.ts` | Groq system prompts for structured JSON itinerary extraction; JSON parse helper with code-fence stripping |
| `data/stays.ts` | Static mock stays dataset (`MOCK_STAYS`) for marketplace — Manali, Goa, Munnar, Jaisalmer, etc. |

### API Routes (`app/api/`)
| Route | Method | Purpose |
|---|---|---|
| `/api/chat` | POST | Groq chat: generates title, stores message, fetches 10-msg context, calls LLM, stores reply |
| `/api/chats` | GET | All user chat sessions ordered by date |
| `/api/chats/[chatId]` | GET | Messages for a specific chat (ownership verified) |
| `/api/itineraries` | GET | All public itineraries with creator details |
| `/api/itineraries/[id]` | GET | Single itinerary + pins |
| `/api/itineraries/create` | POST | Create manual itinerary & pins via `prisma.$transaction` |
| `/api/itineraries/create-ai` | POST | Prompt → Groq LLM → geocode via Mapbox → create draft itinerary + pins |
| `/api/itineraries/create-ai-from-video` | POST | YouTube URL → video metadata → Groq LLM → geocode → create draft itinerary + pins |
| `/api/itineraries/my-drafts` | GET | Current user's private draft itineraries |
| `/api/share/chat` | POST | Generate shareable URL for a chat session |
| `/api/share/itenary` | POST | Generate shareable URL for an itinerary |
| `/api/users/create` | POST | Service-role upsert of user record into `public.users` (with username conflict retry) |
| `/api/auth/callback` | GET | OAuth callback handler (Google Sign-In redirect) |

### UI Components (`components/`)
| Component | Purpose |
|---|---|
| `components/sidebar/Sidebar.tsx` | Primary collapsible nav sidebar; shows recent 4 chats, user stats, Wander Coins, popover profile menu |
| `components/map/MapCanvas.tsx` | Core Mapbox GL JS component: marker drag-and-drop, custom SVG icons, freehand path drawing, driving directions line, undo/redo history stack |
| `components/map/ItineraryMap.tsx` | Read-only Mapbox map — displays itinerary stops + connecting routes |
| `components/map/MapSearchBar.tsx` | Debounced Mapbox places autocomplete search bar |
| `components/map/MarkerPalette.tsx` | Draggable palette: Start, End, Pin, Hotel, Food, Attraction, Bike, Rickshaw, Car, Plane, Train |
| `components/chat/ChatBubble.tsx` | Message bubble with markdown tables (`remarkGfm`), typewriter animation, draft itinerary callout card |
| `components/chat/ItenaryMenu.tsx` | Floating menu: "Make Itinerary with AI" vs "Make Itinerary Manually" |
| `components/GlassCarousel.tsx` | Glassmorphism image carousel for landing page (crossfade + blur) |
| `components/share/ShareModal.tsx` | Share link modal — Twitter, WhatsApp, Email |
| `components/following/*` | `FollowingFeed`, `MessagesPanel`, `PeopleYouFollow`, `StoriesSection`, `StoryViewer`, `SuggestedCreators` |

### App Pages (`app/`)
| Page | Route | What it does |
|---|---|---|
| `app/page.tsx` | `/` | Landing page: `GlassCarousel`, creator video cards, value props, CTAs |
| `app/login/page.tsx` | `/login` | Sign-in with train video background, email/password, Google OAuth button |
| `app/signup/page.tsx` | `/signup` | Sign-up with dynamic video bg switching (TRAVELER vs CREATOR) |
| `app/chat/page.tsx` | `/chat` | AI travel assistant: conversation UI, mode switch (Normal / Make Itinerary), suggestion chips, recommendations grid |
| `app/itineraries/page.tsx` | `/itineraries` | Map discovery: `MapCanvas` + `MapSearchBar` + FAB for itinerary creation |
| `app/itineraries/add-itineraries/ai/page.tsx` | `/itineraries/add-itineraries/ai` | AI itinerary builder: text prompt + YouTube link inputs |
| `app/itineraries/add-itineraries/manual/page.tsx` | `/itineraries/add-itineraries/manual` | Manual itinerary editor: full Mapbox canvas, marker drag-and-drop, path drawing, draft/public save |
| `app/itinerary/[id]/page.tsx` | `/itinerary/:id` | Public itinerary view: hero banner, creator profile, journey map, places list, timeline, budget |
| `app/explore/page.tsx` | `/explore` | Category-based itinerary discovery + search filtering |
| `app/following/page.tsx` | `/following` | Social feed: creator stories, posts, suggested creators, messaging panel |
| `app/marketplace/page.tsx` | `/marketplace` | Fullscreen intro video, stay search, featured stays with Wander Coins discounts, cab service, stay submission form |
| `app/marketplace/stay/[id]/page.tsx` | `/marketplace/stay/:id` | Stay details: photo gallery lightbox, prices, external booking links, reviews |
| `app/profile/page.tsx` | `/profile` | Profile: cover photo, avatar upload to Supabase Storage, stats, tabbed itinerary lists (Created / Followed / Saved / Drafts), settings modal |

---

## 4. Key Data Flows

### AI Chat Flow
```
User message → POST /api/chat
  → fetch last 10 messages (context)
  → if new chat: Groq generates 3-5 word title
  → store user message
  → Groq llama-3.1-8b-instant completes
  → store AI reply
  → return response
```

### AI Itinerary from Prompt
```
User prompt → POST /api/itineraries/create-ai
  → Groq LLM → structured JSON (title, locations, activities)
  → lib/geocoding.ts → Mapbox batch geocode all locations
  → prisma.itinerary.create (draft, is_public: false)
  → prisma.itineraryPin.createMany
  → return itinerary + pin count stats
```

### AI Itinerary from YouTube Video
```
YouTube URL → POST /api/itineraries/create-ai-from-video
  → lib/video/youtube.ts → YouTube Data API v3 (title, description, tags)
  → Groq LLM → structured JSON
  → Mapbox batch geocode
  → Prisma create itinerary + pins
```

### Manual Itinerary Save
```
User drags pins + fills form → POST /api/itineraries/create
  → prisma.$transaction([itinerary.create, itineraryPin.createMany])
  → returns created itinerary
```

---

## 5. Resolved Doc-vs-Code Discrepancies

These issues existed in older documentation and are now corrected:

| Claim in old docs | Actual implementation |
|---|---|
| "Using Ola Maps API" (README, BEGINNER_GUIDE) | Mapbox GL JS (`mapbox-gl` v3.16.0) exclusively |
| "Using OpenAI GPT-4" (PLAN, TECHNICAL_OVERVIEW) | Groq SDK (`groq-sdk` v0.34.0), model `llama-3.1-8b-instant` |
| "Google Maps API for mapping" (PRD) | Mapbox GL JS for all map rendering |
| `app/api/olamaps/` referenced as active | Directory exists but is empty / unused |
| Chat API uses `llama3-8b-8192` (GROQSETUP) | Actual model string: `llama-3.1-8b-instant` |
| Database: only Supabase (PLAN) | Dual layer: Prisma ORM for itinerary transactions + Supabase JS for chats, user upserts, profiles |
| Video itinerary "not yet implemented" (old AI_ITINERARY doc) | `create-ai-from-video` route is fully implemented |
