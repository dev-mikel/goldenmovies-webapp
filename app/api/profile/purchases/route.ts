import { NextResponse } from "next/server";
import { PURCHASES } from "@/lib/profile-data";

export async function GET() {
  return NextResponse.json(PURCHASES);
}
