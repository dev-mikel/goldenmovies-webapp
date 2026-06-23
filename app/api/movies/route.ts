import { NextResponse } from "next/server";
import { MOVIES } from "@/lib/mock-data";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const format = searchParams.get("format");
  const genre = searchParams.get("genre");
  const upcoming = searchParams.get("upcoming");
  const presale = searchParams.get("presale");

  let result = MOVIES;
  if (upcoming === "true") {
    result = result.filter((m) => m.upcoming === true);
  } else if (presale === "true") {
    result = result.filter((m) => m.presale === true);
  } else {
    // Now showing (default): exclude future releases not yet in theaters.
    result = result.filter((m) => !m.upcoming);
  }
  if (format) result = result.filter((m) => m.format === format);
  if (genre) result = result.filter((m) => m.genre === genre);

  return NextResponse.json(result);
}
