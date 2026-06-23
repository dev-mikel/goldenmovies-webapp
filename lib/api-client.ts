/* ============================================================
   GoldenMovies — API client (Fase 4)
   Wrappers tipados sobre los route handlers de /api. Los Server
   Components leen la capa de datos directamente (sin salto HTTP);
   los Client Components usan estas funciones.
   ============================================================ */

import type {
  Movie,
  ShowtimeGroup,
  Venue,
  Concession,
  ConcessionCategory,
  Promotion,
} from "./mock-data";

async function getJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GET ${url} → ${res.status}`);
  return res.json();
}

export async function fetchMovies(params?: {
  format?: string;
  genre?: string;
  upcoming?: boolean;
  presale?: boolean;
}): Promise<Movie[]> {
  const qs = new URLSearchParams();
  if (params?.format && params.format !== "all") qs.set("format", params.format);
  if (params?.genre && params.genre !== "all") qs.set("genre", params.genre);
  if (params?.upcoming) qs.set("upcoming", "true");
  if (params?.presale) qs.set("presale", "true");
  const q = qs.toString();
  return getJSON<Movie[]>(`/api/movies${q ? `?${q}` : ""}`);
}

export async function fetchMovie(
  slug: string,
): Promise<{ movie: Movie; showtimes: ShowtimeGroup[] }> {
  return getJSON(`/api/movies/${slug}`);
}

export async function fetchVenues(params?: {
  city?: string;
  tech?: string;
}): Promise<Venue[]> {
  const qs = new URLSearchParams();
  if (params?.city) qs.set("city", params.city);
  if (params?.tech) qs.set("tech", params.tech);
  const q = qs.toString();
  return getJSON<Venue[]>(`/api/venues${q ? `?${q}` : ""}`);
}

export async function fetchConcessions(
  category?: ConcessionCategory,
): Promise<Concession[]> {
  const q = category ? `?category=${category}` : "";
  return getJSON<Concession[]>(`/api/concessions${q}`);
}

export async function fetchPromotions(): Promise<Promotion[]> {
  return getJSON<Promotion[]>("/api/promotions");
}

export async function searchAll(q: string): Promise<{
  movies: Movie[];
  venues: Venue[];
  query: string;
}> {
  return getJSON(`/api/search?q=${encodeURIComponent(q)}`);
}

/* ── Profile sub-resources ── */

export async function fetchPurchases() {
  return getJSON<
    { id: string; movie: string; venue: string; date: string; seats: string; total: string; format: string }[]
  >("/api/profile/purchases");
}

export async function fetchWallet() {
  return getJSON<{
    balance: string;
    movements: { id: string; label: string; date: string; amount: string }[];
  }>("/api/profile/wallet");
}

export async function fetchAchievements() {
  return getJSON<{ id: string; en: string; es: string; unlocked: boolean }[]>(
    "/api/profile/achievements",
  );
}

export async function fetchClub() {
  return getJSON<{ tier: string; points: number }>("/api/profile/club");
}
