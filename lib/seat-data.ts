/* ============================================================
   GoldenMovies — Seat engine
   Static room layout: seat types and a fixed set of 15 occupied
   seats, identical for every showtime.
   ============================================================ */

export type SeatType = "standard" | "vip" | "accessible";
export type SeatStatus = "available" | "occupied";

export type Seat = {
  id: string; // e.g. "E7"
  row: string;
  col: number;
  type: SeatType;
  status: SeatStatus;
};

export const ROWS = ["A", "B", "C", "D", "E", "F", "G", "H", "J"];
export const COLS = 14; // 7 + aisle gap + 7
export const AISLE_AFTER = 7; // visual gap inserted after column 7
export const MAX_SEATS = 8;

export const PRICES: Record<SeatType, number> = {
  standard: 4.5,
  vip: 8.0,
  accessible: 4.5,
};

/** Ticket audience category. */
export type TicketAudience = "adult" | "child" | "senior";
export const AUDIENCES: TicketAudience[] = ["adult", "child", "senior"];

/** Price multiplier per audience category — children and seniors get 50% off. */
export const AUDIENCE_MULTIPLIER: Record<TicketAudience, number> = {
  adult: 1,
  child: 0.5,
  senior: 0.5,
};

export const CURRENCY = { symbol: "$", code: "USD" };

// 15 pre-sold seats — same for every showtime. Mix of VIP and standard;
// accessible corners (J1, J2, J13, J14) intentionally left free.
const OCCUPIED_SEAT_IDS = new Set([
  "A3", "A11",
  "B7", "B12",
  "C5", "C9",
  "D2", "D13",
  "E6", "E10",
  "F4", "F8",
  "G7", "G11",
  "H6",
]);

function seatType(row: string, col: number): SeatType {
  if (row === "J" && (col <= 2 || col >= COLS - 1)) return "accessible";
  // VIP: central rows and central columns
  if (["E", "F", "G"].includes(row) && col >= 4 && col <= COLS - 3) return "vip";
  return "standard";
}

/** Builds the static room layout. Same result for every call. */
export function buildRoom(): Seat[][] {
  return ROWS.map((row) =>
    Array.from({ length: COLS }, (_, i) => {
      const col = i + 1;
      const id = `${row}${col}`;
      return { id, row, col, type: seatType(row, col), status: OCCUPIED_SEAT_IDS.has(id) ? "occupied" : "available" } satisfies Seat;
    })
  );
}

export function priceOf(type: SeatType): number {
  return PRICES[type];
}

/** Final price after applying the audience multiplier (adult / child / senior). */
export function priceForSeat(type: SeatType, audience: TicketAudience): number {
  return PRICES[type] * AUDIENCE_MULTIPLIER[audience];
}

export function money(n: number): string {
  return `${CURRENCY.symbol}${n.toFixed(2)}`;
}
