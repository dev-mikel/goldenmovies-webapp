import { z } from "zod";
import type { DICT } from "./i18n";

type T = (typeof DICT)["en"];

/* Hard limits enforced on both client AND server — defense in depth. */
const NAME_MAX = 60;
const EMAIL_MAX = 254;
const ADDR_MAX = 120;
const APT_MAX = 30;
const CITY_MAX = 60;
const GENRES_MAX = 30;

const MIN_AGE_YEARS = 13;
const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;

function yearsSince(iso: string): number {
  return (Date.now() - new Date(iso).getTime()) / MS_PER_YEAR;
}

/**
 * Profile form schema with localized validation messages.
 * Built from the active i18n dictionary so error messages appear
 * in the currently selected language.
 */
export function buildProfileSchema(t: T) {
  const e = t.profile.err;

  return z.object({
    firstName: z.string().trim().min(2, e.nameMin).max(NAME_MAX),
    lastName: z.string().trim().min(2, e.nameMin).max(NAME_MAX),
    email: z.email(e.email).trim().min(1, e.required).max(EMAIL_MAX),
    dob: z
      .string()
      .min(1, e.required)
      .max(20)
      .refine((v) => !Number.isNaN(Date.parse(v)), e.dobInvalid)
      .refine((v) => new Date(v) <= new Date(), e.dobFuture)
      .refine((v) => yearsSince(v) >= MIN_AGE_YEARS, e.ageMin),
    favoriteCity: z.string().min(1, e.required).max(CITY_MAX),
    idPrefix: z.enum(["V", "E", "J", "P"]),
    // Venezuelan ID (Cédula/RIF): 6–9 digits
    idNumber: z.string().regex(/^\d{6,9}$/, e.idDigits),
    phonePrefix: z.enum(["0412", "0414", "0416", "0424", "0426"]),
    // Phone local number: exactly 7 digits after the area prefix
    phoneNumber: z.string().regex(/^\d{7}$/, e.phoneDigits),
    currency: z.string().min(1, e.required).max(10),
    // Address fields are optional in the demo — they do not block saving
    state: z.string().max(CITY_MAX).optional(),
    city: z.string().max(CITY_MAX).optional(),
    municipality: z.string().max(CITY_MAX).optional(),
    street: z.string().max(ADDR_MAX).optional(),
    apt: z.string().max(APT_MAX).optional(),
    genres: z.array(z.string().max(40)).max(GENRES_MAX),
  });
}

export type ProfileForm = z.infer<ReturnType<typeof buildProfileSchema>>;

/**
 * Server-side schema: same shape as the client schema but without i18n messages.
 * Applied in the PATCH /api/profile handler — the server never trusts the client.
 */
export const ServerProfileSchema = z.strictObject({
  firstName: z.string().trim().min(2).max(NAME_MAX),
  lastName: z.string().trim().min(2).max(NAME_MAX),
  email: z.email().trim().min(1).max(EMAIL_MAX),
  dob: z
    .string()
    .min(1)
    .max(20)
    .refine((v) => !Number.isNaN(Date.parse(v)))
    .refine((v) => new Date(v) <= new Date())
    .refine((v) => yearsSince(v) >= MIN_AGE_YEARS),
  favoriteCity: z.string().min(1).max(CITY_MAX),
  idPrefix: z.enum(["V", "E", "J", "P"]),
  idNumber: z.string().regex(/^\d{6,9}$/),
  phonePrefix: z.enum(["0412", "0414", "0416", "0424", "0426"]),
  phoneNumber: z.string().regex(/^\d{7}$/),
  currency: z.string().min(1).max(10),
  state: z.string().max(CITY_MAX).optional(),
  city: z.string().max(CITY_MAX).optional(),
  municipality: z.string().max(CITY_MAX).optional(),
  street: z.string().max(ADDR_MAX).optional(),
  apt: z.string().max(APT_MAX).optional(),
  genres: z.array(z.string().max(40)).max(GENRES_MAX),
});

/** Reads the request body text, capping its size before parsing JSON. */
export async function readJsonBody<T>(
  req: Request,
  maxBytes: number,
): Promise<{ ok: true; data: T } | { ok: false; status: number; error: string }> {
  const ct = req.headers.get("content-type") ?? "";
  if (!ct.includes("application/json")) {
    return { ok: false, status: 415, error: "Unsupported Media Type" };
  }
  const lenHeader = req.headers.get("content-length");
  if (lenHeader && Number(lenHeader) > maxBytes) {
    return { ok: false, status: 413, error: "Payload too large" };
  }
  let text: string;
  try {
    text = await req.text();
  } catch {
    return { ok: false, status: 400, error: "Invalid body" };
  }
  if (text.length > maxBytes) {
    return { ok: false, status: 413, error: "Payload too large" };
  }
  try {
    return { ok: true, data: JSON.parse(text) as T };
  } catch {
    return { ok: false, status: 400, error: "Invalid JSON" };
  }
}
