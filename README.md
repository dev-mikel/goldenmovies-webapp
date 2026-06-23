<h1 align="center">🎬 Premium Cinema Booking — Engineering Case Study</h1>

<p align="center"><em>A full-stack, bilingual cinema-booking experience built with Next.js 16 App Router, React 19 Server Components, and Tailwind CSS v4.</em></p>

<p align="center">
  <img src="https://img.shields.io/badge/status-Completed-brightgreen?style=for-the-badge" alt="status">
  <img src="https://img.shields.io/badge/Next.js-16.2.6-black?logo=next.js&style=for-the-badge" alt="Next.js">
  <img src="https://img.shields.io/badge/React-19.2.6-149ECA?logo=react&style=for-the-badge" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.9.3-3178C6?logo=typescript&style=for-the-badge" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.3.0-38BDF8?logo=tailwindcss&style=for-the-badge" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/license-MIT-green?style=for-the-badge" alt="License">
  <a href="./docs"><img src="https://img.shields.io/badge/docs-read-0066CC?style=for-the-badge&logo=readthedocs&logoColor=white" alt="Documentation"></a>
</p>

---

<video src="https://github.com/user-attachments/assets/3f355b8b-7202-40bf-a730-f844ec967806" controls muted autoplay loop playsinline width="100%"></video>

## Table of Contents

1. [Overview](#1-overview)
2. [Walkthrough](#2-walkthrough)
3. [Architecture](#3-architecture)
4. [Tech Stack](#4-tech-stack)
5. [Getting Started](#5-getting-started)
6. [Project Structure](#6-project-structure)
7. [Author](#7-author)

## 1. Overview

### 1.1 The problem

Booking a cinema seat online is too often a clunky, slow, English-only flow. GoldenMovies shows how a premium cinema chain can offer a fast, bilingual, mobile-friendly booking journey — discover a film, pick a seat, and review the total — without friction.

### 1.2 Key features

- **Find a film fast** — browse Now Showing, Coming Soon and Pre-sale, search across films *and* venues, filter by city, format and genre.
- **See exactly what you're getting** — synopsis, director, cast, age certificate and an embedded trailer before you commit.
- **Pick seats with confidence** — a visual room map with VIP, standard and accessible seats, clear per-ticket pricing, and keyboard navigation.
- **Know the total up front** — a live order summary with per-seat audience pricing (Adult / Child / Senior), service fee and grand total.
- **Use it in your language** — instant EN / ES switch with no page reload.
- **Have a personal space** — purchase history, a wallet with a member QR code, loyalty tier, and an editable profile.

## 2. Walkthrough

**Home — Hero carousel & browsing**

<video src="https://github.com/user-attachments/assets/e392a360-0aee-40e2-a19b-e89c3a5c9bf4" controls muted autoplay loop playsinline width="100%"></video>

**Movie & Seat — showtimes, room layout & seat selection**

<video src="https://github.com/user-attachments/assets/1e7c4403-3f63-4ed1-80c8-1b6876b68365" controls muted autoplay loop playsinline width="100%"></video>

**Menu Bar — now showing, theaters, concessions & coming soon**

<video src="https://github.com/user-attachments/assets/f87efcb6-42c7-4b1a-9e29-7a9ca8cc6f17" controls muted autoplay loop playsinline width="100%"></video>

**Profile — account, purchases, translate button, notifications**

<video src="https://github.com/user-attachments/assets/042928cd-d190-43d4-a663-57c546ae1e72" controls muted autoplay loop playsinline width="100%"></video>

## 3. Architecture

This is a **frontend engineering case study** — the infrastructure is kept minimal on purpose so the interesting questions stay on the UI side. The system follows a single-VPS, three-layer architecture where everything runs in one Node.js process.

### 3.1 System overview

![Container diagram](public/container.svg)

Three layers, each with a distinct responsibility:

- **Browser** — React 19 client components handle interactivity. Only the components that genuinely need DOM access or event handlers ship JavaScript to the browser.
- **Next.js 16 App Router** — routing, page rendering (SSG + SSR), and API endpoints in a single process. Server Components render to HTML with zero client JS; Client Components hydrate where needed.
- **In-memory store** — `lib/` holds all data, types, and logic with no framework imports. Fully portable — swap it for PostgreSQL and only the Route Handler internals change.

### 3.2 Rendering & component model

Every decision below answers the same question: *how far can we push server rendering before we genuinely need the client?*

**Rendering strategy**

Film pages use **Static Site Generation** (`generateStaticParams` + `generateMetadata`). When a user lands on a film page, the response is fully rendered — title, description, OpenGraph image, showtimes, and seat map wrapper are all in the first HTML byte. SSR was discarded because film catalog data does not change in real time and there was no reason to pay the render cost on every request.

The remaining pages (browsing grids, profile, concessions, club) use a mix of SSR (first load) and client-side data fetching for interactivity (filters, sorting, search).

```typescript
// app/movie/[id]/page.tsx
export function generateStaticParams() {
  return MOVIES.map((m) => ({ id: m.slug }));
}

export async function generateMetadata(props): Promise<Metadata> {
  const movie = getMovieBySlug(id);
  return {
    title: `${movie.title} (${movie.year}) — GoldenMovies`,
    description: movie.synopsis,
    // openGraph, twitter cards …
  };
}
```

**RSC / Client boundary**

Every page file starts as a Server Component. It becomes a Client Component only when it needs event handlers, browser APIs, or React Context:

- **Navigation and layout** (`header`, `sidebar`, `app-shell`) — respond to scroll position, active route, and open/closed state.
- **Browsing grids** (`now-showing-grid`, `theaters-grid`, `upcoming-grid`) — apply filters and sorting client-side so the user does not wait for a full page reload on every interaction.
- **Seat map + order summary** — share booking state (selected seats, audience type per seat, running total). That state is temporary and user-specific; it has no reason to round-trip to the server.
- **Profile form** — React Hook Form requires DOM access; it cannot run on the server.
- **Context providers** (`LanguageProvider`, `CityProvider`, `CurrencyProvider`) — React Context requires a client runtime to distribute state across the tree.

**Data access — two paths**

Data reaches components through two paths, and choosing which one for each page was a core decision:

1. **Server-rendered pages** (film detail, seat selector) — read data directly on the server via `lib/mock-data.ts`. The user never sees a loading state for synopsis, showtimes, or seat map; it is all in the first HTML response. This matters most on the pages where a user decides whether to buy — a spinner at that moment is a friction point that loses the booking.

2. **Interactive components** (browsing grids, filters, profile) — fetch data through `lib/api-client.ts`, typed wrappers over the `/api/*` Route Handlers. They behave identically to a real API. Replace the in-memory store with PostgreSQL and none of these components change — only the Route Handler internals do.

**Seat map as a client island**

The seat map holds all booking state locally — selected seats, audience category per seat (adult / child / senior), and the running total — with nothing pushed upward to a global store. In production, a server-side seat-locking layer using Redis (see [§ 3.5 Production roadmap](#35-production-roadmap)) would prevent two users from booking the same seat simultaneously, but the component's interface is designed so that adding that layer does not require rewriting the UX logic.

**Zero-dependency i18n**

A single typed dictionary in `lib/i18n.ts` replaces next-intl and i18next — both of which bring routing conventions, their own config format, and additional bundle weight. The EN/ES switch is instant via React Context with no page reload. Missing translation keys are compile errors, not blank strings at runtime. The same dictionary feeds Zod schemas so validation messages automatically follow the active language.

**Dual-layer validation**

The profile form validates on the client with React Hook Form + Zod (fast feedback) and again on the server with the same schema inside `PATCH /api/profile` (the server never trusts the client). Both layers import `buildProfileSchema()` from `lib/validation.ts`. The discarded alternatives: Yup (predates TypeScript-native design), Formik (more overhead, more re-renders), Valibot (newer, smaller, similar API — a valid alternative but Zod's ecosystem maturity won out).

```typescript
// lib/validation.ts
export function buildProfileSchema(t: T) {            // client: i18n error messages
  return z.object({ firstName, lastName, email, dob, favoriteCity, ... });
}

export const ServerProfileSchema = z.strictObject({  // server: no i18n messages
  firstName: z.string().trim().min(2).max(NAME_MAX),
  // same field shapes as client schema
});
```

**Typed API client**

`lib/api-client.ts` centralizes the entire API surface — `fetchMovies()`, `fetchVenues()`, `searchAll()`, etc. — in one file. If a URL or response shape changes, there is one place to update. The discarded alternative was calling `fetch('/api/movies')` inline per component, which scatters API knowledge across 20+ files and strips TypeScript of its ability to catch shape mismatches automatically.

**Styling**

**Tailwind CSS v4** with CSS-first config (`@theme` in `globals.css` — no JS config file). Design tokens live as plain CSS variables, visible in DevTools and editable without importing a JS object. v3 would have worked but kept the design system in JavaScript and built significantly slower. CSS Modules require a separate file per component and do not colocate styles with markup. styled-components / Emotion add a runtime and a per-render hydration cost.

**UI primitives**

**shadcn/ui** copies component source into `components/ui/` instead of installing a library. We own that code, can edit it freely, and nothing unused is included. MUI and Chakra were discarded — both bundle their visual language into the app and require fighting library defaults to customize. For a project using two primitives (dropdown menu, trailer modal), a runtime library was not justified.

### 3.3 Cross-cutting concerns

Security is configured once, not bolted on per endpoint:

- **Rate limiting** — `proxy.ts` enforces a per-IP sliding-window limit (120 req/min) on all `/api/*` routes. Defense in depth: Nginx applies a stricter limit at the edge (see [`docs/nginx.md`](./docs/nginx.md)).

```typescript
// proxy.ts
const WINDOW_MS   = 60_000;  // 1-minute sliding window
const MAX_PER_WIN = 120;     // requests per IP per window

const counters = new Map<string, { n: number; reset: number }>();
```

- **Security headers** — `next.config.ts` sets CSP, HSTS, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, and `Permissions-Policy` on every response.
- **Image & frame policies** — CSP `img-src` allows only three remote hosts; `frame-src` is locked to `youtube-nocookie.com` for embedded trailers.

### 3.4 Scope boundaries

**Intentionally out of scope** for this case study: external database, payment gateway, real authentication, and CI/CD. These are addressed in [§ 3.5 Production roadmap](#35-production-roadmap) as architectural recommendations for production.

**Deployment topology**

Single-VPS reference (Nginx reverse proxy, TLS via Certbot, systemd unit) documented in [`docs/nginx.md`](./docs/nginx.md). The flow: **Nginx terminates TLS → proxies to `next start -p 3000` under systemd → Node.js serves pages + API from in-memory data.**

### 3.5 Production roadmap

The current implementation uses an in-memory data layer with no persistence, no authentication, and no payment processing — all deliberate scope decisions for a frontend-focused case study. This section proposes the production backend architecture that would support the same UI at scale, grounded in the existing codebase, data model, and infrastructure choices.

**Database**

**PostgreSQL** replaces the in-memory store. The existing data model is already relational by nature and maps cleanly to a normalized schema:

- **Read-heavy catalog** — `movies`, `venues`, `showtimes`, `concessions`, and `promotions` tables. These change infrequently (a few updates per day when new films or combos are added) and benefit from aggressive caching.
- **Write-sensitive booking core** — `bookings`, `booked_seats`, `seat_locks` tables. Every seat selection triggers a write; concurrent writes on the same showtime must be serialized to prevent double-booking.
- **User domain** — `users`, `purchases`, `wallet_transactions`, `achievements`, `club_memberships`. The profile form, purchase history, wallet balance, and loyalty tier all map to persistent, auditable tables.

**Why not MongoDB**: the domain is relational at its core — a booking ties a user to specific seats at a specific showtime at a specific venue. Document databases handle denormalized reads well but struggle with the multi-document transactional consistency that seat booking demands.

**Caching & real-time seat locking**

**Redis** serves three purposes:

1. **Rate limiting** — replaces the in-memory `Map` in `proxy.ts` with a Redis-backed sliding window. Survives process restarts; accurate across multiple Node.js instances if the deployment scales horizontally.
2. **Seat locking with TTL** — when a user selects a seat, a Redis key `lock:<showtimeId>:<seatId>` is set with a 5-minute TTL. The client refreshes the lock via a keep-alive endpoint while the user is on the seat-selection page. If the user navigates away or the tab is closed, the lock expires automatically and the seat is released — no orphaned locks.
3. **Catalog cache** — movie listings, venue details, and showtimes are cached with a 5-minute TTL since they change infrequently. Reduces database load on the most-hit endpoints.

Seat-locking flow:

1. Client selects a seat → `POST /api/showtimes/:id/seats/lock` → Redis `SET NX` with TTL
2. Client refreshes lock → `PUT /api/showtimes/:id/seats/lock` → Redis `EXPIRE`
3. Client releases → `DELETE /api/showtimes/:id/seats/lock` → Redis `DEL`
4. Unused lock expires → Redis key TTL elapses → seat is free again

**Authentication**

**NextAuth.js v5 (Auth.js)** with JWT sessions. The existing `User` mock (`lib/profile-data.ts`) and profile form (`PATCH /api/profile`) show the shape of the user model. Adding Auth.js places a session check in the `proxy.ts` middleware for `/api/profile/*` routes, while keeping catalog endpoints (`/api/movies`, `/api/venues`, `/api/search`) public.

- **Credentials provider** — email + password for the cinema chain's own user base.
- **OAuth providers** (Google, Apple) — lower-friction sign-up for casual users.
- **Session strategy** — JWT (stateless, no database lookup per request). Suitable for a single-region deployment; switch to database sessions if multi-region becomes necessary.

**API layer migration**

The existing Route Handlers already follow the pattern a real API would use. Migrating from in-memory to PostgreSQL requires changes **only inside each handler** — the function signatures, response shapes, and typed API client remain identical:

| Handler | Current | Proposed |
|---|---|---|
| `GET /api/movies` | `MOVIES.filter(...)` | `SELECT * FROM movies WHERE ...` |
| `GET /api/movies/[slug]` | `getMovieBySlug(slug)` | `SELECT ... JOIN showtimes ...` |
| `GET /api/search` | in-memory filter over `MOVIES` + `VENUES` | PostgreSQL full-text search (`tsvector`) |
| `PATCH /api/profile` | echo-back | `UPDATE users SET ... WHERE id = $1` |
| `GET /api/profile/purchases` | static array | `SELECT ... FROM purchases WHERE user_id = $1` |

**Payment integration**

**Stripe Checkout** (`@stripe/react-stripe-js` on the client, `stripe` Node SDK on the server). After seat locks are confirmed, a `POST /api/checkout` handler creates a Stripe session for the locked seats and returns a redirect URL. The webhook `POST /api/webhooks/stripe` finalizes the booking — converting locks into permanent `booked_seats` rows — when Stripe confirms payment. This keeps payment processing outside the application's critical path: the app never touches card data.

**Traffic profile & scaling**

A cinema booking app has a predictable traffic shape that informs infrastructure sizing:

- **Steady-state browsing** — cacheable reads with low concurrency during weekday daytime hours.
- **Peak spikes** — weekend evenings (Friday–Sunday, 6–10 PM) and opening weekends for blockbuster releases. Traffic can 3–5× the weekday baseline, concentrated on seat-selection and booking endpoints.
- **Bottleneck** — the seat map. Every user selecting seats for the same showtime competes for the same Redis lock keys. The lock TTL (5 min) bounds the worst case; realistically far fewer concurrent holders exist.

A single VPS (4 vCPU, 8 GB RAM) running Nginx → Next.js → PostgreSQL + Redis can comfortably handle the steady-state load with room for peak. Horizontal scaling becomes relevant only when concurrent seat bookings for a single showtime exceed what a single Redis instance serializes — a threshold that a regional cinema chain is unlikely to hit.

**Infrastructure evolution**

From the current single-VPS reference in [`docs/nginx.md`](./docs/nginx.md), the production path is:

1. **Add PostgreSQL + Redis** on the same VPS (or move to a managed DB like Supabase / Railway for zero-maintenance).
2. **Add Auth.js** — session middleware in `proxy.ts`, protected profile routes, JWT sessions.
3. **Add Stripe** — checkout endpoint + webhook handler.
4. **Scale horizontally** — if needed, place the Next.js server behind a load balancer with Redis and PostgreSQL on separate nodes. The architecture supports this because state lives in Redis/PostgreSQL, not in the Node.js process.

## 4. Tech Stack

Each choice targets maximum capability with minimum runtime weight — no external services, no UI library lock-in, no JS framework on the server where it isn't needed.

| Layer | Technology | Why this over alternatives |
|---|---|---|
| Framework | **Next.js 16 App Router** | SSR, SSG, and API routes in a single process with no extra server. vs Remix: covers similar ground, but App Router's RSC model eliminates the HTTP round-trip for server-rendered pages. vs Vite + React: client-only, no SSR, no SEO. |
| Language | **TypeScript 5** | Types flow end-to-end: `Movie` is defined once in `lib/mock-data.ts` and reused in route handlers, `api-client.ts`, and every component without casting. Shape mismatches are caught at compile time. |
| Styling | **Tailwind CSS v4** | CSS-first config (`@theme` in `globals.css`, no JS config file). v4's JIT engine is ~10× faster than v3. vs CSS Modules: utility colocation without context-switching. vs styled-components / Emotion: zero runtime, zero hydration cost. |
| Components | **shadcn/ui + Radix** | Component source is copied into `components/ui/` — no runtime library, no forced design system, unused primitives simply aren't included. vs MUI / Chakra: both add significant bundle weight and enforce their own visual language. |
| Forms & validation | **React Hook Form + Zod** | RHF uses uncontrolled inputs — minimal re-renders, no controlled state per keystroke. Zod provides TypeScript-native schema inference: the same schema validates on the client (RHF) and the server (`PATCH /api/profile`), with error messages pulled from the active i18n dictionary. vs Yup: predates TypeScript-first design. vs Formik: more overhead, more re-renders. |
| Infra | **Nginx + Certbot + systemd** (VPS) | TLS termination, reverse proxy, and process supervision with no cloud vendor lock-in. See [`docs/nginx.md`](./docs/nginx.md). |

## 5. Getting Started

See [`docs/install.md`](./docs/install.md) for the full setup, validation, deployment, and troubleshooting guide.

### 5.1 Prerequisites

| Tool | Version |
|---|---|
| Node.js | 20.x or newer (Active LTS) |
| npm | ships with Node |
| Git | any recent version |

### 5.2 Installation

```bash
git clone <repository-url> goldenmovies
cd goldenmovies
npm install
```

### 5.3 Configuration

No environment variables are required to run the app. Two are recognized:

| Variable | Required | Description |
|---|---|---|
| `OMDB_API_KEY` | No | OMDb API key — the catalog ships pre-generated in `lib/movies-data.json` (25 films), so it is not needed to run. |
| `NEXT_PUBLIC_SITE_URL` | No | Public base URL for sitemap, OpenGraph, and canonical links. Defaults to `http://localhost:3000`. Must be set before `npm run build` for public deploys. |

```bash
cp .env.example .env.local   # edit .env.local — never commit real values
```

### 5.4 Run

```bash
npm run dev      # development server  →  http://localhost:3000
npm run build    # production build
npm run start    # serve production build  →  http://localhost:3000
npm run lint     # ESLint (must pass before deploying)
```

## 6. Project Structure

```
goldenmovies-webapp/
├── app/                              # Next.js App Router — routes, pages, API handlers
│   ├── api/
│   │   ├── movies/                   # GET /api/movies  ·  GET /api/movies/[slug]
│   │   ├── venues/                   # GET /api/venues
│   │   ├── search/                   # GET /api/search
│   │   ├── concessions/              # GET /api/concessions
│   │   ├── cities/                   # GET /api/cities
│   │   ├── promotions/               # GET /api/promotions
│   │   └── profile/                  # GET|PATCH /api/profile · purchases · wallet · club
│   ├── movie/[id]/                   # Film detail page (SSG + dynamic metadata)
│   │   └── seats/                    # Seat selection & order summary
│   ├── now-showing/ coming-soon/ presale/ theaters/ concessions/ search/ club/ profile/
│   ├── layout.tsx                    # Root layout — wraps providers + app shell
│   └── page.tsx                      # Home
├── components/
│   ├── layout/                       # Header, sidebar, app-shell, city/date/language controls
│   ├── home/                         # Hero carousel, movie rails, quick-access tiles
│   ├── movie/ movies/                # Film detail view, poster card
│   ├── seats/                        # Seat map, order summary, seat legend
│   ├── profile/                      # Profile form (RHF + Zod), tabs, wallet view
│   ├── providers/                    # LanguageProvider · CityProvider · CurrencyProvider
│   └── ui/                           # shadcn/ui primitives (dropdown-menu, trailer modal)
├── lib/                              # Framework-independent shared logic
│   ├── mock-data.ts                  # Entity types + all in-memory data (movies, venues, nav…)
│   ├── movies-data.json              # Film catalog, imported by mock-data.ts
│   ├── seat-data.ts                  # Seat engine: buildRoom() → Seat[][], types, prices
│   ├── profile-data.ts               # Simulated profile, loyalty tier, purchases, wallet
│   ├── api-client.ts                 # Typed fetch wrappers — Client Components only
│   ├── i18n.ts                       # EN/ES dictionary + useLanguage hook
│   ├── validation.ts                 # Zod schemas — shared client/server, i18n error messages
│   └── utils.ts                      # cn() helper (clsx + tailwind-merge)
├── archive/
│   └── container.d2                  # D2 source for the architecture diagram
├── public/                           # Static assets: banners, logo SVG
├── docs/
│   ├── install.md                    # Setup, configuration, validation, deployment
│   └── nginx.md                      # Nginx vhost, systemd unit, Certbot, verification
├── proxy.ts                          # Middleware — per-IP sliding-window rate limiter
└── next.config.ts                    # Security headers (CSP, HSTS, …) + image domains
```

## 7. Author

**Miguel Ladines** · [@dev-mikel](https://github.com/dev-mikel)  
Electronics Engineer · AI Developer | Automation & Systems Integration
