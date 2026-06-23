"use client";

import { useI18n } from "@/components/providers/language-provider";

export function SeatLegend() {
  const { t } = useI18n();
  const items = [
    { label: t.seats.legend.available, cls: "border-gm-line bg-gm-bg-3" },
    { label: t.seats.legend.selected, cls: "border-emerald-400 bg-emerald-500" },
    { label: t.seats.legend.vip, cls: "border-gm-gold/40 bg-gm-gold/10" },
    { label: t.seats.legend.accessible, cls: "border-sky-400/40 bg-sky-400/10" },
    { label: t.seats.legend.occupied, cls: "border-transparent bg-gm-tx-3/40" },
  ];
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
      {items.map((it) => (
        <div key={it.label} className="flex items-center gap-2">
          <span className={`h-4 w-4 rounded-t-md rounded-b-sm border ${it.cls}`} />
          <span className="text-xs text-gm-tx-2">{it.label}</span>
        </div>
      ))}
    </div>
  );
}
