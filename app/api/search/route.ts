import { NextResponse } from "next/server";
import { MOVIES, VENUES } from "@/lib/mock-data";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim().toLowerCase();

  if (!q) {
    return NextResponse.json({ movies: [], venues: [], query: "" });
  }

  const movies = MOVIES.filter((m) => {
    return (
      m.title.toLowerCase().includes(q) ||
      m.director.toLowerCase().includes(q) ||
      m.cast.some((c) => c.toLowerCase().includes(q)) ||
      m.genre.toLowerCase().includes(q)
    );
  });

  const venues = VENUES.filter((v) => {
    return (
      v.name.toLowerCase().includes(q) ||
      v.city.toLowerCase().includes(q) ||
      v.technologies.some((t) => t.toLowerCase().includes(q))
    );
  });

  return NextResponse.json({ movies, venues, query: q });
}
