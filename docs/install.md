# Premium Cinema Booking — Installation & Deployment Guide

Complete guide to install, run, validate, and deploy the project. Every command is verified against the current repository state.

The app runs fully offline with an in-memory data layer — no database, cache, or external service is required.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Local development](#local-development)
5. [Validation](#validation)
6. [Deployment](#deployment)
7. [Troubleshooting](#troubleshooting)
8. [Project structure](#project-structure)

## Prerequisites

| Tool | Version | Notes |
|---|---|---|
| Node.js | 20.x or newer (Active LTS) | Required by Next.js 16 + React 19. No `.nvmrc` or `engines` field in the repo — any Active LTS will work. |
| npm | Ships with Node | `package-lock.json` is present, so npm is the expected package manager. |
| Git | Any recent version | To clone the repository. |

An OMDb API key is **optional** — see [Configuration](#configuration).

## Installation

```bash
git clone <repository-url> goldenmovies
cd goldenmovies
npm install
```

## Configuration

No environment variables are required to run the app. Two are recognized:

| Variable | Required | Description |
|---|---|---|
| `OMDB_API_KEY` | No | OMDb API key for fetching movie metadata and posters. The catalog ships pre-generated in `lib/movies-data.json` (25 films), so this key is not needed to run. No seed script is currently wired in `package.json`. |
| `NEXT_PUBLIC_SITE_URL` | No | Public base URL used for canonical links, OpenGraph tags, `sitemap.xml`, and `robots.txt` (see `app/layout.tsx`, `app/sitemap.ts`, `app/robots.ts`). Defaults to `http://localhost:3000` when unset. **Must be set before `npm run build` for any public deployment.** |

To set a value, copy the template and edit it. Never commit real secrets — `.env*` files (except `.env.example`) are git-ignored:

```bash
cp .env.example .env.local
```

## Local development

| Script | What it does |
|---|---|
| `npm run dev` | Starts the development server on `http://localhost:3000` using Turbopack (the default bundler in Next.js 16). |
| `npm run build` | Produces a production build in `.next/`. |
| `npm run start` | Serves the last production build on `http://localhost:3000`. Always run after `npm run build`. |
| `npm run lint` | Runs ESLint via `eslint-config-next`. No errors should be present before deploying. |
| `npm run erase` | Removes `.next/` and `node_modules/`. Useful when switching branches or debugging stale builds. |

> There is no Docker setup in this repository — the app runs directly via the npm scripts above.

## Validation

There is no automated test suite. Use the build, the linter, and the following smoke checks to validate a deployment. Run these against a **production** build (`npm run build && npm run start`):

```bash
# 1. Lint and production build must both succeed with no errors
npm run lint
npm run build

# 2. Verify security headers are present (configured in next.config.ts)
curl -sI http://localhost:3000 | grep -iE \
  "content-security-policy|strict-transport|x-frame|x-content|referrer|permissions"

# 3. Verify the rate limiter fires (proxy.ts: 120 req/min/IP)
for i in $(seq 1 130); do
  curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/api/movies
done | sort | uniq -c
# Expected: a block of 200s, then 429s once the per-minute limit is exceeded.
```

> On localhost the rate limiter keys on `X-Forwarded-For` / `X-Real-IP` and falls back to a shared `"unknown"` bucket, so the loop above will trip the limit from a single machine.

## Deployment

The repository includes a single-VPS reference configuration for **Debian** in [`nginx.md`](./nginx.md). The intended topology:

1. **Build** on the server: `npm ci && npm run build`
2. **Run** `next start -p 3000` under a **systemd** unit (`User=www-data`, raised `LimitNOFILE`, `MemoryMax`)
3. **Front with Nginx** as a reverse proxy that terminates TLS via **Certbot / Let's Encrypt**, enforces edge rate limits, and hides its version (`server_tokens off`)

Before deploying to a public host, set `NEXT_PUBLIC_SITE_URL` to the public origin so the sitemap, robots, and OpenGraph URLs are correct.

> **Read before copying the infra config:** `nginx.md` predates the current build in two ways. It refers to the rate limiter as `middleware.ts`, but the file is now **`proxy.ts`** (the behavior is otherwise as described). It also contains Nginx location blocks for SSE and seat-lock endpoints (`/api/showtimes/.../seats/stream`, `/lock`, `/release`) that **do not exist** in this case study — they map to a real-time booking roadmap, not the current code. The TLS, systemd, Certbot, and `server_tokens` sections apply as-is.

See [`nginx.md`](./nginx.md) for the complete Nginx vhost, systemd unit, Certbot steps, and a post-deploy verification checklist.

## Troubleshooting

| Symptom | Cause & fix |
|---|---|
| `429 Too Many Requests` during local testing | The rate limiter in `proxy.ts` (120 req/min/IP) is firing. On localhost all requests share one `"unknown"` bucket. Adjust `MAX_PER_WIN` in `proxy.ts` if needed. |
| A remote image won't load | The host must appear in both `images.remotePatterns` in `next.config.ts` **and** the `img-src` directive in the CSP. Currently allowed: `m.media-amazon.com`, `images.unsplash.com`, `picsum.photos`. |
| A trailer won't embed | CSP `frame-src` allows only `youtube-nocookie.com`. YouTube video IDs are also validated against an 11-character pattern; non-matching IDs are rejected by design. |
| Port 3000 already in use | Run on another port: `npm run dev -- -p 3001`, or free the port. |
| Sitemap / OpenGraph URLs point to `localhost` in production | Set `NEXT_PUBLIC_SITE_URL` to the public origin **before** `npm run build`. |
| Stale build or dependency errors | Run `npm run erase && npm install` to clear `.next/` and `node_modules/`, then rebuild. |

## Project structure

```
project-root/
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
│   └── layout.tsx                    # Root layout — wraps providers + app shell
├── components/
│   ├── layout/                       # Header, sidebar, app-shell, city/date/language controls
│   ├── home/                         # Hero carousel, movie rails, quick-access tiles
│   ├── movie/ movies/                # Film detail view, poster card
│   ├── seats/                        # Seat map, order summary, seat legend
│   ├── profile/                      # Profile form (RHF + Zod), tabs, wallet view
│   ├── providers/                    # LanguageProvider · CityProvider · CurrencyProvider
│   └── ui/                           # shadcn/ui primitives (dropdown-menu, trailer modal)
├── lib/                              # Framework-independent shared logic
│   ├── mock-data.ts                  # Entity types + all in-memory data
│   ├── movies-data.json              # Film catalog, imported by mock-data.ts
│   ├── seat-data.ts                  # Seat engine: buildRoom() → Seat[][], types, prices
│   ├── profile-data.ts               # Simulated profile, loyalty tier, purchases, wallet
│   ├── api-client.ts                 # Typed fetch wrappers — Client Components only
│   ├── i18n.ts                       # EN/ES dictionary + useLanguage hook
│   └── validation.ts                 # Zod schemas — shared client/server, i18n error messages
├── docs/                             # Deployment & implementation guides
├── proxy.ts                          # Middleware — per-IP sliding-window rate limiter
└── next.config.ts                    # Security headers (CSP, HSTS, …) + image domains
```
