# AI Itinerary Creation

> Covers both itinerary creation modes: **from a text prompt** and **from a YouTube video URL**.
> Both are fully implemented and available from `/itineraries/add-itineraries/ai`.

---

## Overview

Users describe a trip in plain English (or paste a YouTube link), and the system automatically:
1. Calls the Groq LLM to extract a structured itinerary
2. Geocodes each location via Mapbox
3. Creates a draft itinerary with pins in the database
4. Redirects to the itinerary page

---

## Architecture

```
User Input
    │
    ├─ Text Prompt ──────────→ POST /api/itineraries/create-ai
    │                               ↓
    └─ YouTube URL ──────────→ POST /api/itineraries/create-ai-from-video
                                    ↓
                          YouTube Data API v3
                          (title, description, tags)
                                    ↓
                         [both paths continue here]
                                    ↓
                         Groq llama-3.1-8b-instant
                         (structured JSON extraction)
                                    ↓
                         Mapbox Geocoding API
                         (location name → lat/lng)
                                    ↓
                         Prisma: Itinerary + ItineraryPin create
                                    ↓
                         Response: itinerary + stats
```

---

## Files Involved

| File | Role |
|---|---|
| `app/itineraries/add-itineraries/ai/page.tsx` | UI: prompt input + YouTube link input, loading states, error handling |
| `app/api/itineraries/create-ai/route.ts` | Prompt → Groq → geocode → DB |
| `app/api/itineraries/create-ai-from-video/route.ts` | YouTube URL → metadata → Groq → geocode → DB |
| `lib/ai/itinerary-prompt.ts` | System prompt definitions + JSON parsing helper (strips code fences) |
| `lib/geocoding.ts` | Mapbox Geocoding API wrapper (`geocodeLocation`, `geocodeMultipleLocations`) |
| `lib/video/youtube.ts` | YouTube URL parser (handles `watch`, `shorts`, `embed`, `youtu.be`) + metadata fetcher |

---

## API: `POST /api/itineraries/create-ai`

**Request:**
```json
{
  "prompt": "5-day trip to Kerala with backwaters and local food",
  "isPublic": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "itinerary": { "id": "...", "title": "...", "description": "..." },
    "pins": [ { "title": "Alleppey", "latitude": 9.49, "longitude": 76.32, ... } ],
    "stats": {
      "totalLocations": 5,
      "geocodedLocations": 5,
      "failedGeocodes": 0
    }
  }
}
```

---

## API: `POST /api/itineraries/create-ai-from-video`

**Request:**
```json
{
  "videoUrl": "https://www.youtube.com/watch?v=XXXXXXXXXXX",
  "isPublic": false
}
```

The route parses the URL via `lib/video/youtube.ts`, fetches the video's title, description, and tags from the YouTube Data API, then feeds that context to the same Groq prompt pipeline as the text prompt flow.

**Requires:** `YOUTUBE_API_KEY` in environment variables. See [`SETUP.md`](./SETUP.md).

---

## What the AI Extracts

Using `lib/ai/itinerary-prompt.ts` system prompt, the LLM returns a JSON object with:

```json
{
  "title": "5-Day Kerala Backwaters Escape",
  "description": "...",
  "duration": 5,
  "locations": [
    {
      "name": "Alleppey Backwaters",
      "city": "Alleppey",
      "country": "India",
      "day": 1,
      "order": 1,
      "type": "ATTRACTION",
      "activities": ["Houseboat cruise", "Village walk"],
      "tips": ["Book houseboat in advance"],
      "description": "..."
    }
  ],
  "budget": "mid-range",
  "bestSeason": "October–March"
}
```

---

## Geocoding

`lib/geocoding.ts` wraps the Mapbox Geocoding API:
- Processes all locations in parallel (`Promise.all`)
- Default bounding box: India (configurable)
- Pins with failed geocodes are **skipped** (not added), and the count is reported in `stats.failedGeocodes`
- A minimum of 1 successfully geocoded pin is required for a successful response

---

## Pin Storage

Created pins include:
- Coordinates (lat/lng from Mapbox)
- Type and icon from AI extraction (`HOTEL`, `FOOD`, `ATTRACTION`, `CUSTOM`, `PIN`)
- Rich description combining activities, tips, and AI notes
- `meta_json` with raw AI metadata (model, prompt snippets, confidence context)
- `order_index` and `day` for timeline ordering

---

## Environment Variables

| Variable | Required | Used for |
|---|---|---|
| `GROQ_API_KEY` | ✅ | LLM itinerary extraction |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | ✅ | Location geocoding |
| `YOUTUBE_API_KEY` | Video flow only | Video metadata fetch |

See [`SETUP.md`](./SETUP.md) for how to obtain these.

---

## Example Prompts

| Prompt | Expected output |
|---|---|
| `"3-day weekend trip to Goa"` | ~3 locations (beaches, markets) |
| `"5-day luxury Kerala backwaters tour with spa and ayurveda"` | ~5 locations, type mix |
| `"Adventure trip to Manali for 4 days with trekking and snow activities"` | ~4 locations, ATTRACTION type |
| `"Heritage palaces and street food in Jaipur for 3 days"` | ~4 locations, city-focused |

---

## Error Handling

| Scenario | Behaviour |
|---|---|
| LLM returns malformed JSON | Parser retries with code-fence stripping; if still invalid → 400 error |
| All geocodes fail | 400 error: "No locations could be geocoded" |
| Some geocodes fail | Successful locations are saved; `failedGeocodes` count reported |
| Missing `GROQ_API_KEY` | 500 error immediately |
| Invalid YouTube URL | 400 error with format hint |
| YouTube API quota exceeded | 500 error with message |

---

## Future Enhancements

- Preview and edit AI itinerary before saving
- Multi-turn refinement ("make it more budget-friendly")
- Instagram Reels / TikTok video support
- Google Places photo enrichment for generated pins
- AI confidence score display per pin
