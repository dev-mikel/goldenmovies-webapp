import { NextResponse } from "next/server";
import { VENUES, type Format } from "@/lib/mock-data";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city");
  const tech = searchParams.get("tech") as Format | null;

  let result = VENUES;
  if (city) result = result.filter((v) => v.city === city);
  if (tech) result = result.filter((v) => v.technologies.includes(tech));
  return NextResponse.json(result);
}
