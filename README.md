<div align="center">

# 🎨 Spectrum Art Platform

### AI-Powered Digital Art Gallery & Exhibition Management System

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express-4.19-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-pgvector-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.14-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![OpenAI](https://img.shields.io/badge/OpenAI-Embeddings-412991?logo=openai&logoColor=white)](https://openai.com/)
[![Turborepo](https://img.shields.io/badge/Turborepo-Monorepo-EF4444?logo=turborepo&logoColor=white)](https://turbo.build/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**A production-grade, full-stack monorepo platform for curating, discovering, and managing artwork — featuring AI-powered semantic search, automated content moderation, and a dedicated admin console with analytics dashboards.**

[Features](#-features) · [Architecture](#-architecture) · [Tech Stack](#-tech-stack) · [Setup](#-setup-instructions) · [API Docs](#-api-overview) · [Screenshots](#-screenshots)

</div>

---

## 📋 Overview

**Spectrum Art Platform** is a full-stack digital art gallery and exhibition management system built as a Turborepo monorepo with three independent applications and four shared packages.

### The Problem
Traditional art platforms lack intelligent discovery — artists upload work into a void, collectors struggle to find pieces that resonate, and gallery administrators manage everything through spreadsheets and email chains.

### The Solution
Spectrum solves this by combining:
- **AI-Powered Semantic Search** — natural-language queries matched against 1536-dimensional vector embeddings using pgvector
- **Automated Content Pipeline** — AI moderation, auto-tagging, and embedding generation on every artwork upload
- **Dual-Interface Architecture** — a public-facing gallery for collectors and a role-gated admin console for gallery managers
- **Comprehensive Exhibition Management** — curate, schedule, and archive exhibitions with linked artworks

### Target Users
| Role | Use Case |
|------|----------|
| **Art Collectors** | Browse, search, and curate personal collections of artworks |
| **Artists** | Showcase verified portfolios with AI-tagged pieces |
| **Gallery Administrators** | Manage content moderation, artist verification, exhibitions, and analytics |

---

## ✨ Features

### 🔐 Authentication & Authorization
- **Clerk-based authentication** with JWT token verification across all apps
- **Role-based access control** — CUSTOMER, ARTIST, and ADMIN roles enforced at both API and UI level
- **Protected routes** on frontend with automatic redirect-to-sign-in
- **Admin gating** via Clerk `publicMetadata.role` check — unauthorized users see a dedicated block page
- **Dev-mode JWT fallback** — graceful decode-only path when Clerk keys aren't configured

### 🤖 AI-Powered Features
- **Semantic vector search** — OpenAI `text-embedding-3-small` generates 1536-dim vectors stored via pgvector; cosine similarity search via `<=>` operator
- **AI auto-tagging** — GPT-3.5-Turbo extracts 3–5 descriptive tags from artwork title + description on upload
- **Content moderation** — OpenAI Moderation API screens descriptions before artwork creation; flagged content is rejected
- **Graceful AI degradation** — every AI call has a try/catch fallback (default tags, zero vectors, auto-approval) so the platform works without an API key

### 🖼️ Gallery & Discovery
- **Artwork collection** with grid/list toggle view modes
- **Multi-faceted filtering** — by category, artist, and free-text search (title, artist name, description)
- **Artwork detail pages** with full-size zoom, specifications, AI-generated tags, related artworks, and artist cards
- **Artist directory** with verified badges, portfolio counts, and profile pages
- **Lazy-loaded images** with skeleton placeholders and fallback error handling

### ❤️ Personalization
- **Favorites / Wishlist system** — toggle favorites on any artwork, synced to backend via authenticated API
- **Personal collection page** — view all saved artworks with bulk-clear capability
- **Optimistic UI updates** — React Query mutation with immediate cache invalidation

### 🏛️ Exhibition Management
- **Full CRUD for exhibitions** — create, update, delete with linked artwork IDs
- **Lifecycle status tracking** — UPCOMING → ACTIVE → COMPLETED
- **Featured exhibitions** with visual highlighting
- **Curator attribution** and location metadata

### 📊 Admin Dashboard
- **Real-time platform statistics** — artwork count, artist count, exhibition count, pending moderation queue
- **Content moderation panel** — approve/reject artworks with toggle
- **Artist management** — verify/unverify artists, edit bios, delete profiles (cascading artwork deletion)
- **Exhibition management** — full CRUD with status, date range, featured flag, and curator fields
- **Analytics dashboard** — visitor trends (area charts), artwork popularity (bar charts), artist distribution (pie charts), engagement metrics (line charts) via Recharts
- **Platform settings** page

### 🎨 UI/UX
- **Dark/Light/System theme** support via `next-themes` with smooth transitions
- **Collapsible sidebar navigation** with search integration
- **Responsive design** — mobile-first with breakpoints at md, lg, xl
- **Component library** — 25+ Radix UI primitives (Dialog, Select, Tabs, Toast, Accordion, etc.) styled via shadcn/ui
- **Loading states** — skeleton shimmer animations for every data fetch
- **Toast notifications** — via Sonner and Radix Toast for user feedback

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18, TypeScript 5.8, Vite 5 | SPA with SWC-powered HMR |
| **Styling** | Tailwind CSS 3.4, shadcn/ui, Radix UI | Utility-first CSS with accessible component primitives |
| **State Management** | TanStack React Query 5 | Server-state caching, mutations, optimistic updates |
| **Routing** | React Router DOM 6 | Client-side routing with nested layouts |
| **Forms** | React Hook Form + Zod | Type-safe form validation |
| **Charts** | Recharts 2 | Area, Bar, Line, Pie charts for analytics |
| **Backend** | Express 4, TypeScript, tsx | REST API with hot-reload dev server |
| **ORM** | Prisma 5 | Type-safe database client with raw SQL support |
| **Database** | PostgreSQL + pgvector | Relational storage with vector similarity search |
| **AI/ML** | OpenAI API (GPT-3.5, text-embedding-3-small, Moderations) | Semantic search, auto-tagging, content moderation |
| **Authentication** | Clerk (React SDK + Node SDK) | JWT-based auth with role management |
| **Build System** | Turborepo | Parallel builds, task caching, workspace orchestration |
| **Linting** | ESLint 9, typescript-eslint | Code quality enforcement |

---

## 🏗️ Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────┐
│                     TURBOREPO MONOREPO                   │
├──────────────┬──────────────┬────────────────────────────┤
│  @spectrum/  │  @spectrum/  │       @spectrum/server      │
│     web      │    admin     │       (Express API)         │
│  (Vite:8080) │  (Vite:8081) │       (Node:5001)           │
├──────────────┴──────────────┴────────────────────────────┤
│                   SHARED PACKAGES                        │
│  @spectrum/database  │  @spectrum/config  │  @spectrum/  │
│  (Prisma Client)     │                    │    types     │
└──────────┬───────────┴────────────────────┴──────────────┘
           │
           ▼
┌──────────────────────┐     ┌──────────────────────┐
│   PostgreSQL + pgvector   │     │     OpenAI API       │
│   (vector similarity)     │     │  (embeddings, tags,  │
│                           │     │   moderation)        │
└──────────────────────┘     └──────────────────────┘
           │
           ▼
┌──────────────────────┐
│      Clerk Auth      │
│  (JWT verification)  │
└──────────────────────┘
```

### Request Flow

```
User Action (React)
    │
    ▼
API Client (lib/api.ts) ── Bearer Token via Clerk useAuth()
    │
    ▼
Express Server (:5001)
    │
    ├── CORS Middleware
    ├── JSON Body Parser
    ├── Route Handler
    │     ├── requireAuth Middleware (Clerk JWT verification)
    │     ├── Prisma ORM Queries
    │     ├── OpenAI API Calls (embeddings, moderation, tagging)
    │     └── Response
    │
    └── Global Error Handler
```

### Frontend Architecture

Both `web` and `admin` apps follow the same layered pattern:

```
ClerkProvider          → Authentication context
  └── QueryClientProvider  → Server-state cache
       └── ThemeProvider       → Dark/light mode
            └── BrowserRouter      → Client routing
                 └── Layout            → Sidebar + Header + Outlet
                      └── Page             → Feature UI + React Query hooks
```

---

## 📁 Folder Structure

```
spectrum-art-platform/
├── apps/
│   ├── web/                          # Public-facing gallery SPA
│   │   ├── src/
│   │   │   ├── components/           # Reusable UI (ArtworkCard, Navigation, Sidebar)
│   │   │   │   └── ui/              # shadcn/ui primitives (25+ components)
│   │   │   ├── hooks/                # Custom hooks (use-toast, use-mobile)
│   │   │   ├── layouts/              # CustomerLayout with sidebar + header
│   │   │   ├── lib/                  # API client, utilities
│   │   │   ├── pages/                # Route pages (Home, Artworks, Artists, etc.)
│   │   │   ├── providers/            # ThemeProvider
│   │   │   ├── types/                # TypeScript interfaces (Gallery types)
│   │   │   ├── App.tsx               # Route definitions
│   │   │   └── main.tsx              # ClerkProvider entry point
│   │   ├── tailwind.config.ts        # Custom theme tokens
│   │   └── vite.config.ts            # Vite + SWC + path aliases
│   │
│   ├── admin/                        # Admin console SPA (role-gated)
│   │   ├── src/
│   │   │   ├── components/           # AdminSidebar, UnauthorizedPage
│   │   │   ├── layouts/              # AdminLayout
│   │   │   ├── lib/                  # Admin API client (full CRUD)
│   │   │   └── pages/admin/          # Dashboard, Artworks, Artists,
│   │   │                             # Exhibitions, Analytics, Settings
│   │   └── vite.config.ts            # Port 8081
│   │
│   └── server/                       # Express REST API
│       └── src/
│           ├── routes/               # artworks, users, exhibitions, admin
│           ├── middleware/            # Clerk JWT auth middleware
│           ├── lib/                   # OpenAI client configuration
│           └── index.ts              # Server bootstrap + health check
│
├── packages/
│   └── database/                     # Shared Prisma package
│       ├── prisma/
│       │   ├── schema.prisma         # 10 models, pgvector extension
│       │   └── seed.ts               # 50 artworks, 10 artists, 5 exhibitions
│       ├── scripts/
│       │   └── audit_images.ts       # Image URL health checker + auto-fixer
│       └── index.ts                  # Re-exports PrismaClient
│
├── turbo.json                        # Task pipeline configuration
├── package.json                      # Workspace root
└── .gitignore
```

---

## 🔌 API Overview

### Base URL
```
http://localhost:5001/api
```

### Endpoints

#### Artworks (`/api/artworks`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/artworks` | — | List all artworks with artist, category, tags |
| `GET` | `/artworks/categories` | — | List all categories |
| `GET` | `/artworks/:id` | — | Get single artwork by ID |
| `POST` | `/artworks` | — | Create artwork (triggers AI moderation + tagging + embedding) |
| `POST` | `/artworks/search` | — | **AI semantic search** — vector similarity via pgvector |
| `PUT` | `/artworks/:id` | ✅ | Update artwork fields |
| `DELETE` | `/artworks/:id` | ✅ | Delete artwork |

#### Users (`/api/users`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/users/artists` | — | List all artist profiles with artworks |
| `GET` | `/users/me` | ✅ | Get/auto-create current user profile |
| `GET` | `/users/favorites` | ✅ | Get user's wishlist artwork IDs |
| `POST` | `/users/favorites` | ✅ | Toggle artwork in favorites |

#### Exhibitions (`/api/exhibitions`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/exhibitions` | — | List all exhibitions |
| `GET` | `/exhibitions/:id` | — | Get single exhibition |
| `POST` | `/exhibitions` | ✅ | Create exhibition |
| `PUT` | `/exhibitions/:id` | ✅ | Update exhibition |
| `DELETE` | `/exhibitions/:id` | ✅ | Delete exhibition |

#### Admin (`/api/admin`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/admin/stats` | ✅ | Platform statistics (counts + pending moderation) |
| `PATCH` | `/admin/artworks/:id/moderate` | ✅ | Toggle artwork moderation status |
| `PATCH` | `/admin/artists/:id/verify` | ✅ | Toggle artist verification |
| `PATCH` | `/admin/artists/:id` | ✅ | Update artist bio |
| `DELETE` | `/admin/artists/:id` | ✅ | Delete artist + cascade artworks |

#### Health (`/api/health`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/health` | — | Database connectivity + environment check |

### Authentication Flow
```
1. User signs in via Clerk (React SDK)
2. Frontend obtains JWT via useAuth().getToken()
3. JWT sent as Bearer token in Authorization header
4. Server middleware verifies via ClerkExpressRequireAuth()
   └── Dev fallback: decodes JWT payload without verification
5. req.auth.userId populated for route handlers
```

---

## 🗄️ Database Design

### Entity Relationship Diagram

```
┌──────────┐    1:1     ┌───────────────┐    1:N     ┌──────────┐
│   User   │───────────▶│ ArtistProfile │───────────▶│  Artwork  │
│          │            │               │            │           │
│ id (PK)  │            │ id (PK)       │            │ id (PK)   │
│ email    │            │ userId (FK)   │            │ artistId  │
│ role     │            │ bio           │            │ title     │
│ createdAt│            │ isVerified    │            │ description│
└────┬─────┘            └───────────────┘            │ price     │
     │                                               │ imageUrl  │
     │ 1:N                                           │ categoryId│
     ├──────────▶ Order                              │ aiTags[]  │
     ├──────────▶ Review ◀───────── Artwork          │ embedding │
     ├──────────▶ AdminAction                        │ isModerated│
     ├──────────▶ Wishlist (artworkIds[])             └─────┬─────┘
     └──────────▶ Cart (artworkIds[])                       │
                                                            │ N:M
                                               ┌────────┐  │  ┌─────────┐
                                               │Category │◀─┘  │   Tag   │
                                               │ name    │     │  name   │
                                               └─────────┘     └─────────┘

┌─────────────┐
│  Exhibition  │  (standalone with artworkIds[] array)
│ title        │
│ status       │  UPCOMING | ACTIVE | COMPLETED
│ featured     │
│ curator      │
│ startDate    │
│ endDate      │
└──────────────┘
```

### Key Models (10 total)
| Model | Purpose | Key Fields |
|-------|---------|------------|
| **User** | Platform identity | `role` (CUSTOMER/ARTIST/ADMIN) |
| **ArtistProfile** | Extended artist data | `isVerified`, `bio` |
| **Artwork** | Core content entity | `embedding` (vector 1536), `aiTags[]`, `isModerated` |
| **Category** | Artwork classification | Painting, Sculpture, Photography, Digital, Mixed Media, Drawing |
| **Tag** | Flexible labeling | N:M relation with Artwork |
| **Review** | User ratings | `rating`, `comment` |
| **Wishlist** | User favorites | `artworkIds[]` array |
| **Cart** | Purchase staging | `artworkIds[]` array |
| **Order** | Transaction records | `total`, `status` |
| **Exhibition** | Curated events | `status`, `featured`, `artworkIds[]` |
| **AdminAction** | Audit trail | `action`, `targetId` |

### pgvector Integration
```sql
-- Extension enabled in Prisma schema
extensions = [vector]

-- Artwork embedding column
embedding  Unsupported("vector(1536)")?

-- Cosine similarity search (raw SQL via Prisma)
SELECT *, 1 - (embedding <=> $1::vector) as similarity
FROM "Artwork"
WHERE "isModerated" = true
ORDER BY embedding <=> $1::vector
LIMIT 10;
```

---

## 🚀 Setup Instructions

### Prerequisites
- **Node.js** ≥ 18
- **npm** ≥ 10
- **PostgreSQL** ≥ 15 with [pgvector](https://github.com/pgvector/pgvector) extension
- **OpenAI API Key** (optional — platform works without it)
- **Clerk Account** (optional for dev — JWT fallback available)

### 1. Clone & Install

```bash
git clone https://github.com/your-username/spectrum-art-platform.git
cd spectrum-art-platform
npm install
```

### 2. Configure Environment Variables

Create `.env` files in the following locations:

**`apps/server/.env`**
```env
PORT=5001
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/spectrum"
OPENAI_API_KEY=sk-your-openai-api-key
CLERK_SECRET_KEY=sk_test_your-clerk-secret-key
CLERK_PUBLISHABLE_KEY=pk_test_your-clerk-publishable-key
```

**`apps/web/.env`**
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your-clerk-publishable-key
VITE_API_URL=http://localhost:5001/api
```

**`apps/admin/.env`**
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your-clerk-publishable-key
VITE_API_URL=http://localhost:5001/api
```

### 3. Set Up Database

```bash
# Create the database
createdb spectrum

# Enable pgvector extension
psql spectrum -c "CREATE EXTENSION IF NOT EXISTS vector;"

# Generate Prisma client
cd packages/database
npx prisma generate

# Push schema to database
npx prisma db push

# Seed with sample data (50 artworks, 10 artists, 5 exhibitions)
npx prisma db seed
```

### 4. Run Development Servers

```bash
# From project root — starts all 3 apps simultaneously
npm run dev
```

| App | URL | Port |
|-----|-----|------|
| Web (Gallery) | http://localhost:8080 | 8080 |
| Admin Console | http://localhost:8081 | 8081 |
| API Server | http://localhost:5001 | 5001 |
| Health Check | http://localhost:5001/api/health | — |

---

## 📜 Scripts

### Root (Turborepo)
| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `turbo run dev` | Start all apps in parallel with hot-reload |
| `build` | `turbo run build` | Production build of all apps |

### Web / Admin (Vite)
| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `vite` | Dev server with HMR |
| `build` | `vite build` | Production bundle |
| `build:dev` | `vite build --mode development` | Dev-mode build |
| `lint` | `eslint .` | Run ESLint |
| `preview` | `vite preview` | Preview production build |

### Server
| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `tsx watch src/index.ts` | Hot-reload dev server |
| `build` | `tsc` | Compile TypeScript |
| `start` | `node dist/index.js` | Run production build |

### Database
| Script | Command | Description |
|--------|---------|-------------|
| `db:generate` | `prisma generate` | Regenerate Prisma client |
| `db:push` | `prisma db push` | Push schema changes to DB |
| `db:seed` | `ts-node prisma/seed.ts` | Seed database with sample data |

### Utility Scripts
| Script | Description |
|--------|-------------|
| `packages/database/scripts/audit_images.ts` | Audits all artwork image URLs via HEAD requests, reports broken links, and auto-replaces them with curated fallbacks |

---

## 🏭 Deployment

### Production Build
```bash
# Build all apps
npm run build

# Outputs:
# apps/web/dist/       → Static SPA (deploy to any CDN/static host)
# apps/admin/dist/     → Static SPA (deploy to any CDN/static host)
# apps/server/dist/    → Compiled Node.js (deploy to any Node host)
```

### Recommended Hosting
| Component | Recommended Platform |
|-----------|---------------------|
| Web + Admin | Vercel, Netlify, Cloudflare Pages |
| API Server | Railway, Render, AWS EC2, Fly.io |
| Database | Supabase (PostgreSQL + pgvector), Neon, Railway |

### Production Checklist
- [ ] Set real `CLERK_SECRET_KEY` (disables dev JWT fallback)
- [ ] Set `OPENAI_API_KEY` for AI features
- [ ] Configure CORS origins in `server/src/index.ts`
- [ ] Enable `NODE_ENV=production`
- [ ] Set up database connection pooling
- [ ] Configure rate limiting on API endpoints

---

## ⚡ Engineering Highlights

### AI Pipeline Architecture
Every artwork upload triggers a **three-stage AI pipeline** — each stage independently fault-tolerant:
1. **Moderation** → OpenAI Moderation API screens the description
2. **Auto-Tagging** → GPT-3.5-Turbo extracts semantic tags
3. **Embedding Generation** → `text-embedding-3-small` creates a 1536-dim vector

If any stage fails, the system falls back gracefully (default tags, zero vector, auto-approval) — the artwork is still created.

### Vector Search with pgvector
- Artwork embeddings stored as `vector(1536)` columns in PostgreSQL
- Search queries are embedded in real-time and matched using cosine distance (`<=>`)
- Raw SQL via Prisma `$queryRaw` for operations Prisma doesn't natively support
- Normalized mock vectors in seed data for consistent testing

### Monorepo Design with Turborepo
- **Shared `@spectrum/database` package** — Prisma client generated once, consumed by server
- **Task caching** — `turbo.json` defines build dependency graph with `.next/**` and `dist/**` outputs
- **Parallel dev servers** — all three apps start with a single `npm run dev`

### Authentication Strategy
- **Dual-mode auth middleware** — detects whether a real Clerk key is configured:
  - **Production**: Full Clerk JWT verification via `ClerkExpressRequireAuth()`
  - **Development**: Decodes JWT payload without signature verification (extracts `sub` claim)
- This means the entire platform is fully functional without a Clerk account during local development

### Server-State Management
- **React Query** handles all data fetching, caching, and mutation lifecycle
- **Optimistic updates** on favorites — cache is immediately updated before server confirms
- **Query key architecture** — consistent keys like `['artworks']`, `['favorites', userId]` for granular invalidation

### Performance Optimizations
- **SWC-based compilation** via `@vitejs/plugin-react-swc` (10-20x faster than Babel)
- **Lazy image loading** with `loading="lazy"` attribute on all artwork images
- **Skeleton loading states** — shimmer animations prevent layout shifts during data fetches
- **Parallel database queries** — admin stats endpoint uses `Promise.all()` for 5 concurrent counts
- **Efficient Prisma includes** — selective relation loading to minimize payload size

### Security Considerations
- **JWT-based authentication** — tokens scoped per-session, verified server-side
- **Role-based access control** — admin routes check `publicMetadata.role === 'ADMIN'`
- **Content moderation** — AI-powered screening before content enters the platform
- **Input validation** — Zod schemas on frontend, express-async-handler wraps all routes
- **Error isolation** — global Express error handler prevents stack trace leaks
- **CORS enabled** — configurable origin restrictions

---

## 🧩 Key Engineering Decisions

| Decision | Rationale |
|----------|-----------|
| **Turborepo monorepo** over polyrepo | Shared types, single install, unified dev command, atomic cross-package changes |
| **pgvector** over dedicated vector DB (Pinecone, Weaviate) | Collocates vectors with relational data — single query joins artwork metadata with similarity scores |
| **Clerk** over custom auth | Production-grade JWT auth with zero backend session management; built-in React components |
| **Prisma `$queryRaw`** for vector operations | Prisma doesn't support pgvector natively — raw SQL gives full control over `<=>` operator |
| **Separate `web` and `admin` apps** | Independent deployment, different auth requirements, isolated bundles, clear separation of concerns |
| **React Query** over Redux/Zustand | The app is server-state-heavy — React Query eliminates boilerplate for caching, refetching, and mutations |
| **Express** over Next.js API routes | The API serves multiple frontend clients (web + admin) — a standalone server is more flexible and independently deployable |
| **Graceful AI degradation** | Platform must work without API keys — every OpenAI call has a fallback path |

---

## 🧠 Challenges & Learnings

### Integrating pgvector with Prisma
Prisma lacks native support for PostgreSQL vector types. This required:
- Using `Unsupported("vector(1536)")` in the schema
- Performing all vector operations via `$queryRaw` and `$executeRaw`
- Manually casting embedding strings to `::vector` in raw SQL
- Generating normalized mock vectors in the seed script

### Building a Fault-Tolerant AI Pipeline
The three-stage artwork processing pipeline (moderation → tagging → embedding) needed independent failure handling. Early iterations had a single try/catch that would block artwork creation if any AI call failed. The final design wraps each stage independently, with sensible defaults.

### Dual-Mode Authentication
Supporting both full Clerk verification and dev-mode JWT decoding required careful middleware design. The key insight was detecting a "real" Clerk key by length and prefix (`sk_test_`/`sk_live_` with 50+ chars), then conditionally instantiating the Clerk middleware.

### Monorepo Package Sharing
Getting Prisma client generation to work across workspace boundaries required:
- Generating the client in `@spectrum/database`
- Re-exporting via a barrel `index.ts`
- Ensuring `prisma generate` runs before server build in the Turborepo dependency graph

---

## 🔮 Future Improvements

- [ ] **Real-time notifications** — WebSocket integration for moderation status updates
- [ ] **Image upload pipeline** — Cloudinary/S3 integration with automatic thumbnail generation
- [ ] **Full-text search** — PostgreSQL `tsvector` hybrid with vector similarity for combined search
- [ ] **Order & payment flow** — Stripe integration for artwork purchases
- [ ] **Artist onboarding** — self-service registration with portfolio submission workflow
- [ ] **Review system** — user ratings and comments on artworks (schema already supports this)
- [ ] **CI/CD pipeline** — GitHub Actions for lint, type-check, build, and deploy
- [ ] **Docker Compose** — single-command local development with PostgreSQL + pgvector
- [ ] **API rate limiting** — express-rate-limit middleware for production hardening
- [ ] **E2E testing** — Playwright tests for critical user flows

---

## 📸 Screenshots

> Add screenshots or GIFs of your application here.

### Gallery Home
<!-- ![Home Page](./screenshots/home.png) -->
`📷 Screenshot placeholder — Home page with hero section and featured artworks`

### Artwork Collection
<!-- ![Artworks Page](./screenshots/artworks.png) -->
`📷 Screenshot placeholder — Grid/list view with search and filters`

### Artwork Detail
<!-- ![Artwork Detail](./screenshots/artwork-detail.png) -->
`📷 Screenshot placeholder — Full artwork view with zoom, AI tags, and artist card`

### AI Semantic Search
<!-- ![Semantic Search](./screenshots/search.png) -->
`📷 Screenshot placeholder — Natural language search results via vector similarity`

### Admin Dashboard
<!-- ![Admin Dashboard](./screenshots/admin-dashboard.png) -->
`📷 Screenshot placeholder — Stats cards, quick actions, platform overview`

### Analytics
<!-- ![Analytics](./screenshots/analytics.png) -->
`📷 Screenshot placeholder — Charts for visitors, artworks, artists, engagement`

### Dark Mode
<!-- ![Dark Mode](./screenshots/dark-mode.png) -->
`📷 Screenshot placeholder — Full dark theme across gallery and admin`

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** with conventional commits (`git commit -m 'feat: add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Run `npm run lint` before committing
- Follow existing code patterns and naming conventions
- Add TypeScript types for all new code
- Test API endpoints via the health check before submitting

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 🌟 Why This Project Matters

Spectrum isn't a toy CRUD app — it demonstrates real-world engineering decisions that matter at scale:

- **AI integration** with production-grade error handling and graceful degradation
- **Vector databases** for semantic search — the same technology powering modern RAG systems
- **Monorepo architecture** used by teams at Vercel, Google, and Meta
- **Role-based multi-tenant system** with separate client applications
- **Type-safe full-stack TypeScript** from database schema to React components

It proves the ability to design, architect, and ship a **complete platform** — not just a frontend or just an API, but the entire system working together.

---

<div align="center">

**Built with ❤️ and a lot of TypeScript**

</div>
