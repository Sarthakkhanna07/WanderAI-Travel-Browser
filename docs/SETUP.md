# Wander AI — Setup Guide

> All environment configuration and service setup in one place.
> When a service changes, this is the **only** file that needs updating.

---

## Prerequisites

- **Node.js** 18+
- **npm** 9+ (or yarn)
- Accounts on: [Supabase](https://supabase.com), [Groq](https://console.groq.com), [Mapbox](https://account.mapbox.com)
- Optional: [Google Cloud](https://console.cloud.google.com) (YouTube Data API, for video itinerary feature)

---

## 1. Clone & Install

```bash
git clone https://github.com/yourusername/travel-browser.git
cd travel-browser
npm install
```

---

## 2. Environment Variables

Create a `.env.local` file in the project root. Use `env.local.example` as your template.

```env
# ── Supabase ──────────────────────────────────────────────────────────────
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres?sslmode=require"
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT_REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"   # server-only, never expose to client

# ── Groq AI ───────────────────────────────────────────────────────────────
GROQ_API_KEY="your-groq-api-key"

# ── Mapbox ────────────────────────────────────────────────────────────────
NEXT_PUBLIC_MAPBOX_TOKEN="your-mapbox-public-token"

# ── YouTube (optional — only needed for video → itinerary feature) ─────────
YOUTUBE_API_KEY="your-youtube-data-api-key"
```

> ⚠️ **Never commit `.env.local` to git.** It is already in `.gitignore`.

---

## 3. Supabase Setup

### 3a. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) → **New Project**
2. Fill in:
   - **Project Name:** `wander-ai`
   - **Database Password:** save this securely
   - **Region:** closest to your users
3. Click **Create new project** and wait for provisioning

### 3b. Get Your Keys

In the Supabase dashboard:

| Key | Location |
|---|---|
| `DATABASE_URL` | Settings → Database → Connection string → URI |
| `NEXT_PUBLIC_SUPABASE_URL` | Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Settings → API → `anon` / `public` key |
| `SUPABASE_SERVICE_ROLE_KEY` | Settings → API → `service_role` key |

### 3c. Push Prisma Schema to Supabase

```bash
# Generate the Prisma client
npm run db:generate

# Push schema to your Supabase database (creates all tables)
npm run db:push
```

**Expected tables after push:**
- `users` · `itineraries` · `itinerary_pins` · `follows` · `saved_itineraries`
- `Chat` · `Message`

### 3d. Enable Authentication

- Supabase Auth is enabled by default.
- To disable email confirmation (for local dev): Dashboard → **Authentication** → **Settings** → disable "Confirm email".
- Google OAuth: Dashboard → **Authentication** → **Providers** → enable Google → add Client ID & Secret from Google Cloud Console.

### 3e. Storage Bucket

The profile page uploads avatars to a Supabase Storage bucket named `avatars`. Create it in Dashboard → **Storage** → **New bucket** → name: `avatars`, set to **Public**.

---

## 4. Groq AI Setup

Wander AI uses [Groq](https://groq.com/) for all LLM inference — the chat assistant, itinerary generation from prompts, and video-based itinerary extraction.

### 4a. Get an API Key

1. Sign up at [groq.com](https://groq.com/)
2. Navigate to [console.groq.com/keys](https://console.groq.com/keys)
3. Click **Create API Key** and copy it immediately (shown only once)

### 4b. Add to `.env.local`

```env
GROQ_API_KEY=your_groq_api_key_here
```

### 4c. Model in use

The app uses **`llama-3.1-8b-instant`** across all Groq calls:
- `app/api/chat/route.ts` — conversational travel assistant
- `app/api/itineraries/create-ai/route.ts` — prompt → itinerary JSON
- `app/api/itineraries/create-ai-from-video/route.ts` — video metadata → itinerary JSON

**Free tier limits:** ~14,400 requests/day. No credit card required.

---

## 5. Mapbox Setup

Mapbox powers all interactive maps, marker placement, location search, and driving route generation.

### 5a. Get a Token

1. Sign up at [account.mapbox.com](https://account.mapbox.com)
2. Go to **Tokens** → your default public token (or create one)
3. Copy the token

### 5b. Add to `.env.local`

```env
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
```

The token is **public** (prefixed `NEXT_PUBLIC_`) — it is safe to expose to the browser. Mapbox tokens can be scope-restricted in your Mapbox account for production use.

---

## 6. YouTube API Setup (Optional)

Only needed if you want the **"Create itinerary from YouTube video"** feature to work.

### 6a. Enable YouTube Data API v3

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select a project
3. Enable **YouTube Data API v3** (APIs & Services → Library)
4. Create credentials → **API Key**
5. Copy the key

### 6b. Add to `.env.local`

```env
YOUTUBE_API_KEY=your_youtube_api_key_here
```

> If `YOUTUBE_API_KEY` is not set, the video itinerary endpoint (`/api/itineraries/create-ai-from-video`) will fail gracefully with an error response.

---

## 7. Run the App

```bash
# Development server (with hot reload)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Database utilities:**
```bash
npm run db:generate    # Regenerate Prisma client after schema changes
npm run db:push        # Push schema changes to Supabase
npm run db:migrate     # Run migrations (production)
npm run db:studio      # Open Prisma Studio GUI
```

---

## 8. Troubleshooting

### Auth issues

| Error | Fix |
|---|---|
| "Invalid login credentials" | Check the user exists in Supabase Dashboard → Authentication → Users. Verify email is confirmed. |
| "Failed to fetch" | Check `NEXT_PUBLIC_SUPABASE_URL` and anon key in `.env.local`. Verify CORS in Supabase Dashboard. |
| "Redirect loop" | Ensure middleware isn't blocking auth routes. Check `middleware.ts` matcher config. |
| Google OAuth not working | Enable Google provider in Supabase Dashboard → Authentication → Providers. Add OAuth callback URL. |

### Database issues

| Error | Fix |
|---|---|
| "Can't connect to database" | Check `DATABASE_URL` in `.env.local`. Verify your IP is allowed (Supabase Settings → Database → Network). |
| "Schema not found" | Run `npm run db:generate` then `npm run db:push`. |
| "Connection pool error" | Free Supabase tier has connection limits. Use connection pooling URL for production. |

### AI issues

| Error | Fix |
|---|---|
| "API key is required" (Groq) | Set `GROQ_API_KEY` in `.env.local` and restart the dev server. |
| "Invalid API key" (Groq) | Verify no trailing whitespace in the key. Regenerate at console.groq.com if needed. |
| "Rate limit exceeded" (Groq) | Free tier resets every 24h. Upgrade or wait. |

### Map issues

| Error | Fix |
|---|---|
| Map not loading / blank | Check `NEXT_PUBLIC_MAPBOX_TOKEN` is set. Check browser console for "401 Unauthorized" from Mapbox. |
| Geocoding returns no results | The geocoder defaults to an India bounding box (`lib/geocoding.ts`). Location names should be specific (city + country). |
