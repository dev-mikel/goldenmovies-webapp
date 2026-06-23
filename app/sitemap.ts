import type { MetadataRoute } from "next";
import { MOVIES } from "@/lib/mock-data";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = [
    "",
    "/now-showing",
    "/theaters",
    "/concessions",
    "/coming-soon",
    "/presale",
    "/club",
    "/profile",
    "/search",
  ].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const movieRoutes = MOVIES.map((m) => ({
    url: `${BASE}/movie/${m.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...movieRoutes];
}
