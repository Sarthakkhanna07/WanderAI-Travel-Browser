# Testing Guide

> Manual testing procedures for Wander AI's core features.
> For the API reference, see [`ARCHITECTURE.md`](./ARCHITECTURE.md).

---

## 1. Setup Before Testing

```bash
npm run dev          # Start dev server at http://localhost:3000
```

Make sure your `.env.local` is populated (see [`SETUP.md`](./SETUP.md)).

---

## 2. Manual Itinerary Creation

**Route:** `/itineraries/add-itineraries/manual`  
**API:** `POST /api/itineraries/create`

### Steps

1. Log in at `/login`
2. Navigate to `/itineraries/add-itineraries/manual`
3. Enter a title (e.g., `"Weekend in Rishikesh"`)
4. Optionally add a description
5. Drag marker icons from the **Marker Palette** onto the map
6. Click each marker → add title and description in the sidebar
7. Click **"Save Itinerary"**

### Expected Behaviour

- Success message appears
- Data persists in Supabase (verify in Prisma Studio: `npm run db:studio`)
- Itinerary appears in `/profile` under "Drafts" tab

### Validation Rules

| Rule | Expected error |
|---|---|
| No title | "Title is required" |
| No pins on map | "Please add at least one pin" |
| Pin without title | "All pins must have a title" |
| Not logged in | 401 Unauthorized |

### Database Verification (SQL)

```sql
-- Check itinerary was created
SELECT * FROM itineraries WHERE title = 'Weekend in Rishikesh';

-- Check pins were created and ordered
SELECT ip.*
FROM itinerary_pins ip
JOIN itineraries i ON ip.itinerary_id = i.id
WHERE i.title = 'Weekend in Rishikesh'
ORDER BY ip.order_index;
```

### Testing Checklist

- [ ] Can create itinerary with title only
- [ ] Can create itinerary with title + description
- [ ] Validation: cannot save without title
- [ ] Validation: cannot save without at least one pin
- [ ] Can drag markers onto map
- [ ] Can edit pin titles and descriptions in sidebar
- [ ] Save succeeds and shows success message
- [ ] Data persists after page refresh
- [ ] Unauthenticated request returns 401

---

## 3. AI Itinerary from Prompt

**Route:** `/itineraries/add-itineraries/ai`  
**API:** `POST /api/itineraries/create-ai`

### Steps

1. Navigate to `/itineraries/add-itineraries/ai`
2. Select the **"Describe your trip"** tab
3. Enter a prompt (see examples below)
4. Click **"Generate Itinerary"**
5. Wait for processing (10–30 seconds depending on Groq response time)
6. On success, verify redirect to `/itineraries` or the new itinerary page

### Test Prompts

| Prompt | Min expected pins |
|---|---|
| `"3-day trip to Goa"` | 3 |
| `"5-day luxury Kerala backwaters tour with spa and ayurveda"` | 4 |
| `"Adventure trip to Manali for 4 days with trekking and snow activities"` | 3 |
| `"Heritage palaces and local street food in Jaipur, 3 days"` | 3 |
| `"Weekend in Pondicherry with French Quarter and beaches"` | 2 |

### Expected Behaviour

- Loading spinner shown during processing
- Itinerary created as **draft** (`is_public: false`)
- Pins appear in `/profile` under "Drafts"
- `stats.failedGeocodes` is 0 for well-known Indian cities

### Edge Cases

| Scenario | Expected |
|---|---|
| Vague prompt: `"somewhere nice"` | May produce 0 geocoded locations → error toast |
| Nonsense input: `"asjdflkasdjf"` | LLM may return empty locations → error |
| Very long prompt (500+ words) | Should still work; Groq context window is large |

---

## 4. AI Itinerary from YouTube Video

**Route:** `/itineraries/add-itineraries/ai`  
**API:** `POST /api/itineraries/create-ai-from-video`

> **Requires:** `YOUTUBE_API_KEY` set in `.env.local`

### Steps

1. Navigate to `/itineraries/add-itineraries/ai`
2. Select the **"Paste a YouTube link"** tab
3. Paste a travel vlog URL (e.g., a 5-day India travel vlog)
4. Click **"Generate Itinerary"**

### Test URLs (use real travel vlogs)

Use any public YouTube travel video — the system uses the video's **title, description, and tags** (not the audio/captions). Videos with detailed descriptions and location-tagged descriptions work best.

### Validation

| Scenario | Expected |
|---|---|
| Invalid URL format | "Please enter a valid YouTube URL" error |
| Private/deleted video | YouTube API returns error → 500 response |
| Missing `YOUTUBE_API_KEY` | 500 error immediately |
| Video with no location info in metadata | May produce few or no pins |

---

## 5. Authentication Flow

### Sign Up
1. Go to `/signup`
2. Choose **Traveler** or **Creator**
3. Enter name, username, email, password
4. Submit → check for redirect to `/chat`

### Log In
1. Go to `/login`
2. Enter credentials
3. Submit → redirect to `/chat`

### Protected Routes
Navigate to `/chat`, `/itineraries`, `/profile`, `/marketplace`, etc. without being logged in → should redirect to `/login`.

---

## 6. Network Debugging

Use browser DevTools → **Network tab** to inspect requests:

| Request | Expected status |
|---|---|
| `POST /api/chat` | 200 with `{ message: "...", chatId: "..." }` |
| `POST /api/itineraries/create` | 200 with `{ success: true, data: { itinerary, pins } }` |
| `POST /api/itineraries/create-ai` | 200 with stats |
| `GET /api/itineraries` | 200 array of public itineraries |
| `GET /api/chats` | 200 array of user chat sessions |

---

## 7. Database Inspection

```bash
npm run db:studio     # Opens Prisma Studio at http://localhost:5555
```

Key tables to inspect: `itineraries`, `itinerary_pins`, `Chat`, `Message`.

For Supabase-managed tables (`stays`, `shared_chats`, `reviews`), use the Supabase Dashboard → **Table Editor**.
