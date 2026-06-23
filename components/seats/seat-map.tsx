"use client";

import { useI18n } from "@/components/providers/language-provider";
import { AISLE_AFTER, type Seat } from "@/lib/seat-data";
import { cn } from "@/lib/utils";

type Props = {
  room: Seat[][];
  selected: Set<string>;
  onToggle: (seat: Seat) => void;
};

export function SeatMap({ room, selected, onToggle }: Props) {
  const { t } = useI18n();

  return (
    <div className="rounded-2xl border border-gm-line bg-gm-bg-2/50 p-8">
      {/* Screen */}
      <div className="mx-auto mb-10 max-w-[560px]">
        <div
          className="h-2.5 rounded-[50%] bg-gold-gradient opacity-80"
          style={{ boxShadow: "0 14px 40px -6px rgba(212,175,55,.55)" }}
        />
        <p className="mt-3 text-center text-[11px] uppercase tracking-[0.4em] text-gm-tx-3">
          {t.seats.screen}
        </p>
      </div>

      {/* Grid */}
      <div className="flex flex-col items-center gap-2.5">
        {room.map((rowSeats) => (
          <div key={rowSeats[0].row} className="flex items-center gap-2.5">
            <span className="w-4 text-center text-[11px] font-semibold text-gm-tx-3">
              {rowSeats[0].row}
            </span>
            <div className="flex gap-1.5">
              {rowSeats.map((seat) => (
                <span key={seat.id} className={seat.col === AISLE_AFTER + 1 ? "ml-6" : ""}>
                  <SeatBtn
                    seat={seat}
                    isSelected={selected.has(seat.id)}
                    onToggle={onToggle}
                  />
                </span>
              ))}
            </div>
            <span className="w-4 text-center text-[11px] font-semibold text-gm-tx-3">
              {rowSeats[0].row}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SeatBtn({
  seat,
  isSelected,
  onToggle,
}: {
  seat: Seat;
  isSelected: boolean;
  onToggle: (s: Seat) => void;
}) {
  const occupied = seat.status === "occupied";

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const key = e.key;
    if (key !== "ArrowLeft" && key !== "ArrowRight" && key !== "ArrowUp" && key !== "ArrowDown") {
      return;
    }
    e.preventDefault();
    const map: Record<string, [number, number]> = {
      ArrowLeft: [0, -1],
      ArrowRight: [0, 1],
      ArrowUp: [-1, 0],
      ArrowDown: [1, 0],
    };
    const [dr, dc] = map[key];
    const all = Array.from(document.querySelectorAll<HTMLButtonElement>("[data-seat-id]"));
    const current = all.find((el) => el.dataset.seatId === seat.id);
    if (!current) return;
    const row = current.dataset.row!;
    const col = Number(current.dataset.col);
    const rows = Array.from(new Set(all.map((el) => el.dataset.row!)));
    const rowIdx = rows.indexOf(row);
    const target = all.find((el) => {
      return (
        el.dataset.row === rows[rowIdx + dr] &&
        Number(el.dataset.col) === col + dc
      );
    });
    target?.focus();
  };

  return (
    <button
      type="button"
      data-seat-id={seat.id}
      data-row={seat.row}
      data-col={seat.col}
      onClick={() => { if (!occupied) onToggle(seat); }}
      onKeyDown={onKeyDown}
      title={`${seat.id} · ${seat.type}`}
      aria-disabled={occupied || undefined}
      aria-label={`Seat ${seat.id}, ${seat.type}${occupied ? ", occupied" : ""}`}
      className={cn(
        "relative h-7 w-7 rounded-t-md rounded-b-sm border text-[9px] font-semibold transition-all duration-150 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-gm-gold focus-visible:ring-offset-2 focus-visible:ring-offset-gm-bg-2",
        // state-based visual style
        isSelected &&
          "scale-110 border-emerald-400 bg-emerald-500 text-white shadow-[0_4px_12px_rgba(16,185,129,.45)]",
        !isSelected && !occupied && seat.type === "vip" &&
          "border-gm-gold/40 bg-gm-gold/10 text-gm-gold-1 hover:border-gm-gold hover:bg-gm-gold/20",
        !isSelected && !occupied && seat.type === "accessible" &&
          "border-sky-400/40 bg-sky-400/10 text-sky-300 hover:border-sky-400 hover:bg-sky-400/20",
        !isSelected && !occupied && seat.type === "standard" &&
          "border-gm-line bg-gm-bg-3 text-gm-tx-2 hover:border-gm-gold/50 hover:text-gm-tx-1",
        occupied && "cursor-not-allowed border-transparent bg-gm-tx-3/40 text-gm-tx-3"
      )}
    >
      {seat.type === "accessible" && !isSelected && !occupied ? "♿" : ""}
    </button>
  );
}
