import { NextResponse } from "next/server";
import { PROFILE_DEFAULTS } from "@/lib/profile-data";
import { ServerProfileSchema, readJsonBody } from "@/lib/validation";

const MAX_PROFILE_BYTES = 8 * 1024; // 8 KB is more than enough for the profile form payload

export async function GET() {
  return NextResponse.json(PROFILE_DEFAULTS);
}

export async function PATCH(req: Request) {
  const body = await readJsonBody<unknown>(req, MAX_PROFILE_BYTES);
  if (!body.ok) {
    return NextResponse.json({ ok: false, error: body.error }, { status: body.status });
  }
  const parsed = ServerProfileSchema.safeParse(body.data);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Validation failed", issues: parsed.error.issues },
      { status: 422 },
    );
  }
  // In production, persist here. In the demo, just echo back the validated data.
  return NextResponse.json({ ok: true, saved: parsed.data });
}
