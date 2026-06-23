import { NextResponse } from "next/server";
import { CONCESSIONS, type ConcessionCategory } from "@/lib/mock-data";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") as ConcessionCategory | null;
  const result = category
    ? CONCESSIONS.filter((c) => c.category === category)
    : CONCESSIONS;
  return NextResponse.json(result);
}
