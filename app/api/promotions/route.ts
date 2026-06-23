import { NextResponse } from "next/server";
import { PROMOTIONS } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json(PROMOTIONS);
}
