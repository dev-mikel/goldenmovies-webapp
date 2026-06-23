import { NextResponse } from "next/server";
import { ACHIEVEMENTS } from "@/lib/profile-data";

export async function GET() {
  return NextResponse.json(ACHIEVEMENTS);
}
