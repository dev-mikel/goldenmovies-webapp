import { NextResponse } from "next/server";
import { WALLET } from "@/lib/profile-data";

export async function GET() {
  return NextResponse.json(WALLET);
}
