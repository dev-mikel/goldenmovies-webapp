"use client";

import { Ticket, ChevronRight, Check } from "lucide-react";
import { useI18n } from "@/components/providers/language-provider";
import { useCurrency } from "@/components/providers/currency-provider";
import { AUDIENCES, MAX_SEATS, priceForSeat, type Seat, type TicketAudience } from "@/lib/seat-data";
import { cn } from "@/lib/utils";

type SelectedSeat = { seat: Seat; audience: TicketAudience };

type Props = {
  movieTitle: string;
  venue: string;
  format: string;
  time: string;
  selectedSeats: SelectedSeat[];
  onAudienceChange: (seatId: string, audience: TicketAudience) => void;
  confirmed: boolean;
  onContinue: () => void;
};

const FEE_RATE = 0.05;

export function OrderSummary({
  movieTitle,
  venue,
  format,
  time,
  selectedSeats,
  onAudienceChange,
  confirmed,
  onContinue,
}: Props) {
  const { t } = useI18n();
  const { format: money } = useCurrency();

  const subtotal = selectedSeats.reduce(
    (sum, { seat, audience }) => sum + priceForSeat(seat.type, audience),
    0,
  );
  const fees = subtotal * FEE_RATE;
  const total = subtotal + fees;

  return (
    <aside className="sticky top-[92px] flex h-fit flex-col rounded-2xl border border-gm-line bg-gm-bg-2/60">
      <div className="border-b border-gm-line/60 p-6">
        <h3 className="font-display text-2xl font-semibold leading-tight">{movieTitle}</h3>
        <p className="mt-1.5 text-sm text-gm-tx-2">
          {venue} · <span className="text-gm-gold-1">{format}</span> · {time}
        </p>
      </div>

      <div className="p-6">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-semibold text-gm-tx-2">{t.seats.yourSelection}</span>
          <span className="text-xs text-gm-tx-3">{selectedSeats.length}/{MAX_SEATS}</span>
        </div>

        {selectedSeats.length === 0 ? (
          <p className="py-6 text-center text-sm text-gm-tx-3">{t.seats.none}</p>
        ) : (
          <div className="flex flex-col gap-2">
            {selectedSeats
              .slice()
              .sort((a, b) => a.seat.id.localeCompare(b.seat.id))
              .map(({ seat, audience }) => (
                <div
                  key={seat.id}
                  className="rounded-lg border border-gm-line bg-gm-bg-3 px-3.5 py-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2.5">
                      <span className="grid h-7 w-7 place-items-center rounded-md bg-gm-gold/15 text-xs font-bold text-gm-gold-1">
                        {seat.id}
                      </span>
                      <span className="text-xs text-gm-tx-2">{t.seats.types[seat.type]}</span>
                    </span>
                    <span className="text-sm font-medium">{money(priceForSeat(seat.type, audience))}</span>
                  </div>
                  <div className="mt-2 flex gap-1">
                    {AUDIENCES.map((a) => (
                      <button
                        key={a}
                        onClick={() => onAudienceChange(seat.id, a)}
                        className={cn(
                          "flex-1 rounded-md border px-1.5 py-1 text-[10.5px] font-medium tracking-tight transition-colors",
                          audience === a
                            ? "border-gm-gold/60 bg-gm-gold/15 text-gm-gold-1"
                            : "border-gm-line bg-gm-bg-2 text-gm-tx-3 hover:border-gm-gold/30 hover:text-gm-tx-1",
                        )}
                      >
                        {t.seats.audience[a]}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {selectedSeats.length > 0 && (
        <div className="border-t border-gm-line/60 p-6">
          <Line label={t.seats.subtotal} value={money(subtotal)} />
          <Line label={t.seats.fees} value={money(fees)} muted />
          <div className="my-3 h-px bg-gm-line/60" />
          <div className="flex items-center justify-between">
            <span className="font-semibold">{t.seats.total}</span>
            <span className="font-display text-3xl font-semibold text-gold-gradient">{money(total)}</span>
          </div>

          {confirmed ? (
            <div className="mt-5 rounded-xl border border-gm-gold/30 bg-gm-gold/10 p-4">
              <div className="flex items-center gap-2 font-semibold text-gm-gold-1">
                <Check className="h-4 w-4 text-gm-gold" strokeWidth={2.5} />
                {t.seats.confirmTitle}
              </div>
              <p className="mt-2 text-xs leading-relaxed text-gm-tx-2">{t.seats.confirmNote}</p>
            </div>
          ) : (
            <button
              onClick={onContinue}
              className="btn-gold mt-5 inline-flex h-12 w-full items-center justify-center gap-2 text-sm"
            >
              <Ticket className="h-[18px] w-[18px]" strokeWidth={2} />
              {t.seats.continue}
              <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
            </button>
          )}
        </div>
      )}
    </aside>
  );
}

function Line({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className={cn("flex items-center justify-between py-1 text-sm", muted ? "text-gm-tx-3" : "text-gm-tx-2")}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
