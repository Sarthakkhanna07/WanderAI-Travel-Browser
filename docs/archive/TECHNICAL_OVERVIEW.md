# Wander AI - Technical Overview & Project Documentation

## 🎯 Project Overview

**Wander AI** is a full-stack travel discovery and planning platform that combines AI-powered conversational interfaces, map-first exploration, and social features to help users discover, plan, and share travel experiences.

**Tagline:** *Browse travel like you browse the web*

---

## 🏗️ Architecture & Tech Stack

### **Frontend Framework**
- **Next.js 16.0.0** (App Router)
  - Server-Side Rendering (SSR)
  - Server Components & Client Components
  - API Routes for backend functionality
  - File-based routing system
  - Middleware for authentication

### **Programming Language**
- **TypeScript 5.x**
  - Full type safety across the application
  - Strict mode enabled
  - Path aliases configured (`@/*`)

### **Styling & UI**
- **Tailwind CSS v4**
  - Utility-first CSS framework
  - Custom color schemes and design tokens
  - Responsive design (mobile-first)
  - Custom scrollbar hiding utilities

- **Framer Motion 12.23.24**
  - Smooth animations and transitions
  - Page transitions
  - Component animations
  - Gesture support

- **Lucide React 0.552.0**
  - Icon library for UI elements

### **Backend & Database**
- **Supabase**
  - Authentication (Email/Password, OAuth)
  - PostgreSQL database
  - Real-time subscriptions
  - File storage
  - Row Level Security (RLS)

- **Prisma 6.18.0**
  - ORM for database management
  - Type-safe database queries
  - Migration system
  - Database schema management

### **AI & Machine Learning**
- **Groq SDK 0.34.0**
  - Fast AI inference
  - Model: `llama3-8b-8192` (8B parameter Llama 3)
  - Used for conversational chat interface
  - Used for itinerary generation from prompts

- **OpenAI SDK 6.7.0**
  - Alternative AI provider (configured)
  - GPT models support

- **Google Generative AI 0.24.1**
  - Google's Gemini models support
  - Multi-modal AI capabilities

### **Maps & Geocoding**
- **Mapbox GL 3.16.0**
  - Interactive map rendering
  - Custom markers and pins
  - Route visualization
  - Geocoding API integration

### **Content Processing**
- **React Markdown 10.1.0**
  - Markdown rendering for AI responses
  - GitHub Flavored Markdown support
  - Syntax highlighting

- **Remark GFM 4.0.1**
  - GitHub Flavored Markdown extensions

### **Utilities**
- **UUID 13.0.0**
  - Unique identifier generation

---

## 📁 Project Structure

```
travel-browser/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── chat/                 # Chat API endpoints
│   │   ├── chats/                # Chat session management
│   │   ├── itineraries/          # Itinerary CRUD operations
│   │   │   ├── create/           # Manual itinerary creation
│   │   │   ├── create-ai/        # AI-powered itinerary creation
│   │   │   ├── create-ai-from-video/  # Video-based itinerary extraction
│   │   │   └── [id]/             # Individual itinerary operations
│   │   ├── share/                # Sharing functionality
│   │   └── users/                 # User management
│   ├── auth/                     # Authentication callbacks
│   ├── chat/                     # Chat interface pages
│   ├── explore/                  # Discovery page
│   ├── following/                # Social feed page
│   ├── itineraries/              # Itinerary management
│   ├── itinerary/                # Individual itinerary view
│   ├── map/                      # Map exploration page
│   ├── marketplace/              # Booking marketplace
│   ├── profile/                  # User profile page
│   └── page.tsx                   # Landing page
├── components/                   # React components
│   ├── chat/                     # Chat UI components
│   ├── following/                # Social feed components
│   ├── map/                      # Map-related components
│   ├── share/                    # Sharing modals
│   └── sidebar/                  # Navigation sidebar
├── lib/                          # Utility libraries
│   ├── ai/                       # AI prompt engineering
│   ├── supabase/                 # Supabase client setup
│   ├── video/                    # Video processing (YouTube)
│   ├── auth.ts                   # Authentication utilities
│   ├── geocoding.ts              # Mapbox geocoding
│   └── prisma.ts                 # Prisma client
├── prisma/                       # Database schema
│   └── schema.prisma             # Prisma schema definition
├── public/                       # Static assets
│   ├── icons/                    # SVG icons
│   └── [videos, images]          # Media files
├── types/                        # TypeScript type definitions
└── middleware.ts                 # Next.js middleware

```

---

## 🗄️ Database Schema (Prisma)

### **Core Models**

#### **User Model**
```prisma
- id: UUID (Primary Key)
- email: String (Unique)
- username: String? (Unique)
- full_name: String?
- avatar_url: String?
- user_type: UserType (TRAVELER | CREATOR)
- bio: String?
- created_at: DateTime
- updated_at: DateTime
```

#### **Itinerary Model**
```prisma
- id: UUID (Primary Key)
- title: String
- description: String?
- created_by: String (Foreign Key → User)
- is_public: Boolean
- thumbnail: String?
- created_at: DateTime
- updated_at: DateTime
```

#### **ItineraryPin Model**
```prisma
- id: UUID (Primary Key)
- itinerary_id: String (Foreign Key → Itinerary)
- latitude: Float
- longitude: Float
- title: String
- description: String?
- type: PinType (HOTEL | FOOD | ATTRACTION | CUSTOM | CAR | PIN)
- icon: PinIcon (PIN | CAR | HOTEL | FOOD | ATTRACTION)
- google_place_id: String?
- meta_json: Json?
- order_index: Int
- day: Int?
- date: DateTime?
- photos: String[]
- videos: String[]
- created_by: String (Foreign Key → User)
```

#### **Follow Model** (Social Features)
```prisma
- id: UUID (Primary Key)
- follower_id: String (Foreign Key → User)
- following_id: String (Foreign Key → User)
- created_at: DateTime
```

#### **SavedItinerary Model** (Bookmarks)
```prisma
- id: UUID (Primary Key)
- user_id: String (Foreign Key → User)
- itinerary_id: String
- created_at: DateTime
```

#### **Chat Model** (Conversations)
```prisma
- id: String (CUID)
- title: String
- userId: String (Foreign Key → User)
- createdAt: DateTime
- updatedAt: DateTime
```

#### **Message Model** (Chat Messages)
```prisma
- id: String (CUID)
- content: String (Text)
- sender: String ("user" | "ai")
- chatId: String (Foreign Key → Chat)
- createdAt: DateTime
```

---

## 🔑 Key Features Implemented

### **1. Authentication System**
- **Email/Password Authentication**
  - Sign up with user type selection (Creator/Traveler)
  - Login with email verification
  - Password reset functionality
  - Session management

- **OAuth Integration**
  - Google Sign-In support
  - OAuth callback handling

- **Protected Routes**
  - Middleware-based route protection
  - Automatic session refresh
  - Redirect handling for unauthenticated users

### **2. AI-Powered Chat Interface**
- **Conversational AI**
  - Natural language travel queries
  - Context-aware responses
  - Markdown rendering for formatted responses
  - Chat history persistence

- **AI Models Used**
  - Groq (Llama 3 8B) - Primary chat model
  - OpenAI GPT - Alternative provider
  - Google Gemini - Multi-modal support

### **3. Itinerary Management**

#### **AI Itinerary Creation**
- Natural language prompt processing
- Automatic location extraction
- Geocoding integration (Mapbox)
- Structured JSON parsing
- Pin creation with metadata

#### **Video-Based Itinerary Extraction**
- YouTube video URL processing
- Caption extraction and analysis
- Location extraction from video content
- Automatic pin generation

#### **Manual Itinerary Creation**
- Drag-and-drop pin placement
- Rich text editing
- Media upload support
- Custom pin types and icons

### **4. Map Integration**
- **Mapbox GL Integration**
  - Interactive map rendering
  - Custom marker system
  - Pin clustering for dense areas
  - Route visualization
  - Search functionality

- **Geocoding**
  - Location name to coordinates conversion
  - Batch geocoding support
  - India-focused by default (configurable)
  - Error handling for failed geocodes

### **5. Social Features**

#### **Following System**
- Follow/Unfollow creators
- Following feed with infinite scroll
- Suggested creators sidebar
- User profile pages

#### **Stories Feature**
- Instagram-like stories section
- Video/image story support
- Story viewer with navigation
- Progress indicators
- Blurred background overlay

#### **Messages System**
- Glass-morphism message panel
- In-panel chat interface
- Fixed messages per conversation
- Real-time message display

### **6. Explore & Discovery**
- Trending destinations
- Top creators showcase
- Category-based filtering
- Card-based grid layout
- Infinite scroll implementation

### **7. Profile Management**
- Public profile pages
- Itinerary showcase
- Stats display (views, saves)
- Draft management
- Profile editing

### **8. Marketplace**
- Stay booking interface
- Travel package listings
- Coins system (prepared)
- Booking integration (prepared)

---

## 🔌 API Endpoints

### **Chat APIs**
- `POST /api/chat` - Send message to AI
- `GET /api/chats` - Get all chat sessions
- `GET /api/chats/[chatId]` - Get specific chat
- `POST /api/chats` - Create new chat session

### **Itinerary APIs**
- `GET /api/itineraries` - List all itineraries
- `GET /api/itineraries/[id]` - Get specific itinerary
- `POST /api/itineraries/create` - Create manual itinerary
- `POST /api/itineraries/create-ai` - Create AI-generated itinerary
- `POST /api/itineraries/create-ai-from-video` - Extract itinerary from video
- `GET /api/itineraries/my-drafts` - Get user's draft itineraries

### **User APIs**
- `POST /api/users/create` - Create user profile

### **Sharing APIs**
- `POST /api/share/chat` - Share chat session
- `POST /api/share/itenary` - Share itinerary

---

## 🎨 UI/UX Design Principles

### **Design System**
- **Color Scheme:** Light theme with white backgrounds
- **Typography:** Clean, modern fonts
- **Spacing:** Consistent padding and margins
- **Borders:** Rounded corners (rounded-2xl standard)
- **Shadows:** Subtle elevation (shadow-sm, shadow-md)

### **Component Patterns**
- **Glass Morphism:** Used in message panels
- **Card-based Layout:** For itineraries and content
- **Infinite Scroll:** For feeds and lists
- **Smooth Animations:** Framer Motion transitions
- **Responsive Design:** Mobile-first approach

### **Key UI Components**
- Sidebar navigation
- Chat bubbles with markdown
- Map markers with custom icons
- Story viewer with video player
- Message panel with glass effect
- Itinerary cards with hover effects

---

## 🔐 Security & Authentication

### **Authentication Flow**
1. User signs up → Supabase Auth creates user
2. User profile created in database
3. Session stored in cookies
4. Middleware refreshes sessions
5. Protected routes check authentication

### **Security Measures**
- Row Level Security (RLS) in Supabase
- Server-side authentication checks
- Protected API routes
- Environment variable management
- Secure cookie handling

---

## 🚀 Deployment Considerations

### **Environment Variables Required**
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Database
DATABASE_URL=

# AI Services
GROQ_API_KEY=
OPENAI_API_KEY=
GOOGLE_GENERATIVE_AI_API_KEY=

# Maps
NEXT_PUBLIC_MAPBOX_TOKEN=

# YouTube (Optional)
YOUTUBE_API_KEY=
```

### **Build Commands**
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run start` - Production server
- `npm run lint` - Code linting

### **Database Migrations**
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run migrations
- `npm run db:studio` - Open Prisma Studio

---

## 📊 Performance Optimizations

### **Frontend**
- Server Components for reduced client bundle
- Image optimization (Next.js Image component)
- Code splitting with dynamic imports
- Lazy loading for heavy components
- Infinite scroll for large lists

### **Backend**
- Database indexing on frequently queried fields
- API route optimization
- Caching strategies (prepared)
- Batch operations for geocoding

---

## 🧪 Testing & Quality

### **Type Safety**
- Full TypeScript coverage
- Prisma type generation
- Strict TypeScript configuration
- Type-safe API routes

### **Code Quality**
- ESLint configuration
- Next.js recommended rules
- Consistent code formatting

---

## 🔮 Future Enhancements (Prepared/Planned)

1. **Real-time Features**
   - WebSocket integration for live updates
   - Real-time chat messaging
   - Live collaboration on itineraries

2. **Advanced AI Features**
   - Multi-modal AI (image + text)
   - Voice input/output
   - Personalized recommendations

3. **Payment Integration**
   - Stripe/Razorpay integration
   - Coins system implementation
   - Subscription management

4. **Social Features**
   - Comments and reactions
   - Groups and communities
   - Event planning

5. **Analytics**
   - User behavior tracking
   - Itinerary performance metrics
   - Creator analytics dashboard

---

## 📚 Documentation Files

- `PRD.md` - Product Requirements Document
- `PLAN.md` - Development Plan
- `AUTH_SETUP.md` - Authentication setup guide
- `SUPABASE_SETUP.md` - Supabase configuration
- `GROQSETUP.md` - Groq AI setup guide
- `AI_ITINERARY_IMPLEMENTATION.md` - AI itinerary feature docs
- `MAP_PLAN.md` - Map integration plan
- `BEGINNER_GUIDE.md` - Getting started guide

---

## 🛠️ Development Workflow

1. **Setup**
   ```bash
   npm install
   cp env.local.example .env.local
   # Add environment variables
   npm run db:push
   npm run dev
   ```

2. **Development**
   - Use TypeScript for type safety
   - Follow Next.js App Router patterns
   - Use Server Components when possible
   - Implement proper error handling

3. **Database Changes**
   ```bash
   # Edit prisma/schema.prisma
   npm run db:push
   npm run db:generate
   ```

4. **Deployment**
   ```bash
   npm run build
   npm run start
   ```

---

## 📝 Key Technical Decisions

1. **Next.js 16 App Router** - Modern React patterns, better performance
2. **Supabase + Prisma** - Type-safe database with easy migrations
3. **Groq AI** - Fast inference for better UX
4. **Mapbox** - Powerful mapping with good free tier
5. **Framer Motion** - Smooth animations without performance issues
6. **Tailwind CSS** - Rapid UI development with consistency

---

## 🎓 Learning Resources

- Next.js 16 Documentation
- Supabase Documentation
- Prisma Documentation
- Mapbox GL JS Documentation
- Groq API Documentation
- Framer Motion Documentation

---

**Last Updated:** 2024
**Project Status:** Active Development
**Version:** 0.1.0

