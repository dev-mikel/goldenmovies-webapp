import { NextResponse } from "next/server";
import { CLUB } from "@/lib/profile-data";

export async function GET() {
  return NextResponse.json(CLUB);
}
