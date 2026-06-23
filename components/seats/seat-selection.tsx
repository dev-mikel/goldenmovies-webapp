"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useI18n } from "@/components/providers/language-provider";
import { SeatMap } from "./seat-map";
import { SeatLegend } from "./seat-legend";
import { OrderSummary } from "./order-summary";
import { buildRoom, MAX_SEATS, type Seat, type TicketAudience } from "@/lib/seat-data";

const OVER_LIMIT_NOTICE_MS = 2200;

type Props = {
  movieSlug: string;
  movieTitle: string;
  venue: string;
  format: string;
  time: string;
};

export function SeatSelection({
  movieSlug,
  movieTitle,
  venue,
  format,
  time,
}: Props) {
  const { t } = useI18n();

  const [room] = useState(() => buildRoom());
  const [selected, setSelected] = useState<Map<string, TicketAudience>>(new Map());
  const [confirmed, setConfirmed] = useState(false);
  const [overLimit, setOverLimit] = useState(false);

  const seatById = useMemo(() => {
    const map = new Map<string, Seat>();
    room.flat().forEach((s) => map.set(s.id, s));
    return map;
  }, [room]);

  const toggle = (seat: Seat) => {
    setConfirmed(false);
    const isAdding = !selected.has(seat.id);
    if (isAdding && selected.size >= MAX_SEATS) {
      setOverLimit(true);
      window.setTimeout(() => setOverLimit(false), OVER_LIMIT_NOTICE_MS);
      return;
    }
    setSelected((prev) => {
      const next = new Map(prev);
      if (next.has(seat.id)) {
        next.delete(seat.id);
      } else {
        next.set(seat.id, "adult");
      }
      return next;
    });
  };

  const setSeatAudience = (seatId: string, audience: TicketAudience) => {
    setSelected((prev) => {
      if (!prev.has(seatId)) return prev;
      const next = new Map(prev);
      next.set(seatId, audience);
      return next;
    });
  };

  const selectedSeats = useMemo(
    () =>
      [...selected.entries()]
        .map(([id, audience]) => {
          const seat = seatById.get(id);
          return seat ? { seat, audience } : null;
        })
        .filter((x): x is { seat: Seat; audience: TicketAudience } => x !== null),
    [selected, seatById],
  );

  return (
    <>
      <Link
        href={`/movie/${movieSlug}`}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gm-tx-2 transition-colors hover:text-gm-gold"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={2} />
        {t.seats.back}
      </Link>

      <div className="mb-6 flex items-end justify-between">
        <h1 className="font-display text-[42px] font-semibold leading-none">
          {t.seats.title} <span className="text-gold-gradient">{t.seats.titleAccent}</span>
        </h1>
      </div>

      <div className="grid grid-cols-[1fr_360px] gap-7">
        <div>
          <SeatMap room={room} selected={new Set(selected.keys())} onToggle={toggle} />

          <div className="mt-6 flex items-center justify-between">
            <SeatLegend />
            {overLimit && <span className="text-xs font-medium text-amber-400">{t.seats.max}</span>}
          </div>
        </div>

        <OrderSummary
          movieTitle={movieTitle}
          venue={venue}
          format={format}
          time={time}
          selectedSeats={selectedSeats}
          onAudienceChange={setSeatAudience}
          confirmed={confirmed}
          onContinue={() => setConfirmed(true)}
        />
      </div>
    </>
  );
}
