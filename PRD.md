# Product Requirements Document (PRD)
## Wander AI - Travel Browser

> **This is the product vision and forward-looking roadmap.**
> Status tags below reflect the current build reality.
> For what is *actually implemented*, see [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md).

---

## 🎯 Product Vision

**Wander AI** is a map-first travel discovery platform that transforms how people explore, plan, and experience travel. We treat travel information like the web: searchable, navigable, and composable.

**Tagline:** *Browse travel like you browse the web.*

---

## 📋 Problem Statement

### Current Pain Points

1. **Fragmented Information**
   - Travel content is scattered across YouTube, Instagram, blogs, booking sites, and review platforms
   - Users jump between 5-7 apps to plan a single trip
   - No unified interface to discover, compare, and synthesize travel content

2. **Static, Inflexible Content**
   - Itineraries are rigid documents with limited interactivity
   - Cannot easily remix or personalize creator content
   - No way to combine multiple sources into one cohesive plan

3. **Discovery is Passive**
   - Users can only consume content, not interact or build upon it
   - No conversational way to explore options
   - Map integrations are afterthoughts, not primary interfaces

4. **Planning is Overwhelming**
   - Information overload without context
   - No AI-powered assistance to synthesize creator content
   - Manual work to extract actionable items from videos/posts

### Market Opportunity

- **$7.8 Trillion** global travel market (2024)
- **Gen Z & Millennials** increasingly rely on creator content for travel decisions
- **AI adoption** in travel expected to grow 400% by 2027
- Gap exists between **content consumption** and **actual trip planning**

---

## 💡 Solution: Travel Browser

Wander AI provides a unified platform that combines:

1. **Conversational AI Interface** (ChatGPT-style)
   - Natural language travel queries
   - Visual, structured responses
   - Context-aware recommendations

2. **Map-First Exploration** (Google Maps-like)
   - All itineraries pinned on interactive map
   - Search, filter, and discover visually
   - Route optimization and clustering for better UX

3. **Creator Content Hub**
   - Import itineraries from YouTube/Instagram videos (AI extraction)
   - Remix and personalize creator content
   - Build custom itineraries manually

4. **Community & Marketplace**
   - Follow creators and travelers
   - Discover trending destinations
   - Integrated booking marketplace with coins system

### Key Differentiators

- **Browser Metaphor:** Open multiple trips, compare routes, extract actions — like tabs in a browser
- **AI-Powered Synthesis:** Automatically extract and structure travel data from video captions
- **Map-Native UX:** Visual exploration is primary, not secondary
- **Creator Economy:** Built for content creators to monetize authentic travel experiences

---

## 🎨 Design Philosophy

### Visual Identity

- **Minimal, White, Premium UI**
  - Inspired by Apple, Notion, Linear, and modern SaaS dashboards
  - Typography-first layout with subtle depth
  - Consistent spacing, grid, and hierarchy
  - Clean, calm, elegant aesthetic

### Core Principles

1. **Discoverability** > Completeness
2. **Conversational Flow** > Traditional Navigation
3. **Visual Context** > Text Lists
4. **Creator Empowerment** > User Dependency

---

## 🚀 Core Features

### 1. Landing Page (`wander.ai`) — `Shipped ✅`

**Purpose:** First impression, clear value proposition, entry point

**Elements:**
- Hero section with value statement
- "Browse travel like you browse the web" messaging
- Two CTA buttons: **Login** | **Sign Up**
- Auto-redirect to `/chat` if user is already logged in

**User Flow:**
- New user → Click Sign Up → Auth flow with Creator/Traveler selection
- Returning user → Auto-redirect to `/chat`

---

### 2. Chat Interface (`wander.ai/chat`) — `Shipped ✅`

**Purpose:** Primary AI assistant for travel discovery and planning

**Layout:**
- **Top Right:** Profile icon (dropdown: View Profile / Logout)
- **Center:** ChatGPT-style conversational interface
- **Bottom Right:** Plus icon (⊕) for creating itineraries

**Features:**
- Natural language travel queries
- Visual, structured responses (cards, lists, map previews)
- Context-aware suggestions
- Chat history persistence

**Plus Icon Options:**
1. **"Make Itinerary with AI"** → Route to `/add-itineraries/ai`
2. **"Make Itinerary Manually"** → Route to `/add-itineraries/manual`

---

### 3. Map View (`wander.ai/map`) — `Shipped ✅` *(Mapbox GL JS — interactive map, markers, routes, drag-and-drop)*

**Purpose:** Visual exploration of all itineraries and destinations

**Layout:**
- Full-screen interactive map
- All user and creator itineraries pinned
- Search bar for locations
- Filter options (date, category, creator, etc.)

**Challenges & Solutions:**
- **Heavy Data Loading:** Pagination, lazy loading, clustering for dense areas
- **Visual Clutter:** Smart clustering when multiple itineraries overlap
- **Performance:** Map tiles optimization, pre-fetching, caching

**Pin Interaction:**
- Click pin → Sidebar opens with itinerary details
- Details include: user/creator-added content, photos, videos, AI-generated FAQs
- "Extra AI Ask" options for deeper queries about location

---

### 4. Explore (`wander.ai/explore`) — `Shipped ✅`

**Purpose:** Discovery hub for trending content and categories

**Categories:**
- **Top Creators** (Most followed, highest-rated)
- **Trending Destinations** (Most viewed, most saved)
- **Best Itineraries** (Highest-rated, most remixed)
- **Underrated Gems** (Hidden destinations gaining traction)
- **By Interest** (Adventure, Culture, Food, Budget, Luxury, etc.)
- **By Season** (Asking AI: "What to visit in December?")

**Layout:**
- Card-based grid (Pinterest-style)
- Each card: Preview image, creator, destination, quick stats
- Click card → Opens detailed itinerary view

---

### 5. Following (`wander.ai/following`) — `Shipped ✅` *(stories, feed, suggested creators, messaging panel)*

**Purpose:** Social feed for followed creators and saved content

**Sections:**
- **People You Follow** (Latest itineraries from followed creators)
- **Your Groups** (Collaborative trip planning)
- **Saved Itineraries** (Personal collection)
- **Active Chats** (Conversations with creators/travelers)

**Content Type:**
- Timeline of updates
- Notifications for new content from followed creators
- Quick actions: Save, Remix, Share

---

### 6. Marketplace (`wander.ai/marketplace`) — `In Progress 🔄` *(UI built, stays mock data; live booking APIs not yet integrated)*

**Purpose:** Integrated booking and travel services marketplace

**Features:**
- **Flight Bookings** (Partnerships with MakeMyTrip, Goibibo)
- **Hotel Reservations** (Brand partnerships)
- **Travel Packages** (Curated offers)
- **Coins System** (Similar to CRED)
  - Earn coins through engagement (saves, shares, reviews)
  - Redeem coins for discounts and exclusive offers
  - Premium subscriptions (199/- for pro features)

**Monetization:**
- Commission from bookings
- Premium subscription (Pro Features)
- Brand partnerships and sponsored content

---

### 7. Profile (`wander.ai/profile`) — `Shipped ✅`

**Purpose:** User dashboard and content management

**Sections:**
- **Public Profile** (For creators)
- **My Itineraries** (Created itineraries: published/draft)
- **Saved Items** (Bookmarked content)
- **Following** (People and groups)
- **Stats** (Views, saves, remixes of your content)
- **Settings** (Account, privacy, notifications)

---

### 8. Add Itinerary - AI (`wander.ai/add-itineraries/ai`) — `Shipped ✅` *(text prompt + YouTube video link, both implemented)*

**Purpose:** Automatically extract and structure travel content from video

**Workflow:**
1. User pastes YouTube/Instagram video URL
2. AI extracts captions and transcript
3. LLM processes content to identify:
   - Locations visited
   - Activities, restaurants, attractions
   - Timeline and duration
   - Recommendations and tips
4. AI adds pins to map automatically
5. User reviews and edits generated itinerary
6. Option to publish publicly or keep private

**AI Capabilities:**
- Natural language understanding for location extraction
- Context-aware pin placement on map
- FAQ generation based on video content
- "Extra AI Ask" for deeper insights

---

### 9. Add Itinerary - Manual (`wander.ai/add-itineraries/manual`) — `Shipped ✅`

**Purpose:** User-created custom itineraries

**Workflow:**
1. User searches/adds locations manually
2. Pins appear on map
3. Click pin → Sidebar opens for details
4. Add: Title, description, photos, videos, notes
5. Set duration, date, category
6. Option to publish publicly or keep private

**Features:**
- Drag-and-drop pin placement
- Rich text editor for descriptions
- Media upload (photos, videos)
- Template library for common itineraries

---

## 🏗️ Technical Architecture

### Tech Stack

**Frontend:**
- **Framework:** Next.js 14 (App Router)
- **Styling:** TailwindCSS v4
- **UI Components:** ShadCN/UI
- **Animations:** Framer Motion
- **TypeScript:** Full type safety

**Backend:**
- **Authentication:** Supabase Auth
- **Database:** Supabase PostgreSQL
- **File Storage:** Supabase Storage
- **API:** Next.js API Routes

**Third-Party Integrations:**
- **Maps:** Google Maps API / Mapbox
- **AI:** OpenAI GPT-4 for conversational interface
- **Video Processing:** YouTube API, Instagram API (future)
- **Payment:** Stripe / Razorpay

### Folder Structure

```
travel-browser/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── signup/
│   ├── (main)/
│   │   ├── chat/
│   │   ├── map/
│   │   ├── explore/
│   │   ├── following/
│   │   ├── marketplace/
│   │   └── profile/
│   ├── add-itineraries/
│   │   ├── ai/
│   │   └── manual/
│   ├── api/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/ (ShadCN components)
│   ├── chat/
│   ├── map/
│   ├── sidebar/
│   └── topbar/
├── lib/
│   ├── supabase/
│   ├── ai/
│   └── utils/
├── types/
└── public/
```

---

## 🎯 Success Metrics

### User Engagement
- Daily Active Users (DAU)
- Itineraries created per user
- Average session duration
- Content remix rate

### Creator Growth
- Number of creators on platform
- Average views per creator itinerary
- Creator retention rate

### Business Metrics
- Marketplace conversion rate
- Premium subscription conversion
- Coins redemption rate
- Revenue per user

---

## 🚧 Out of Scope (MVP)

- Mobile app (focus on web initially)
- Offline mode
- Live chat with creators
- Group collaboration features
- Advanced route optimization
- Travel insurance marketplace

---

## 📝 Notes

- **Product Name:** Wander AI (Wander.AI)
- **Brand:** Travel Browser
- **Competition:** Lonely Planet, TripAdvisor, Pinterest Travel, Instagram Travel
- **Differentiation:** Map-first + AI + Creator content synthesis

---

**Document Version:** 1.1
**Last Updated:** August 2026
**Status:** Active Development

**Status legend:** `Shipped ✅` — fully implemented · `In Progress 🔄` — partially built · `Planned 📋` — not yet started

