import { NextResponse } from "next/server";
import { CITIES } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json(CITIES);
}
