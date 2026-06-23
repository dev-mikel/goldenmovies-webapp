import { NextResponse } from "next/server";
import { getMovieBySlug, getShowtimes } from "@/lib/mock-data";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ slug: string }> }
) {
  const { slug } = await ctx.params;
  const movie = getMovieBySlug(slug);
  if (!movie) {
    return NextResponse.json({ error: "Movie not found" }, { status: 404 });
  }
  return NextResponse.json({ movie, showtimes: getShowtimes(movie) });
}
