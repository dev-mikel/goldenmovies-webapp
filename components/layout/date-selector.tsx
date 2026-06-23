"use client";

import { ChevronDown, Check, Calendar } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n } from "@/components/providers/language-provider";
import { cn } from "@/lib/utils";

type Props = {
  value: string; // YYYY-MM-DD
  onChange: (date: string) => void;
  days?: number; // total days to offer (default 7)
};

const MS_PER_DAY = 86_400_000;

function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function buildDates(days: number): string[] {
  const out: string[] = [];
  const base = new Date();
  base.setHours(0, 0, 0, 0);
  for (let i = 0; i < days; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    out.push(toISODate(d));
  }
  return out;
}

function formatDateLabel(iso: string, lang: "en" | "es", t: ReturnType<typeof useI18n>["t"]): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((date.getTime() - today.getTime()) / MS_PER_DAY);
  if (diffDays === 0) return t.header.today;
  if (diffDays === 1) return t.header.tomorrow;
  const locale = lang === "es" ? "es-VE" : "en-US";
  return date.toLocaleDateString(locale, { weekday: "short", day: "numeric", month: "short" });
}

export function DateSelector({ value, onChange, days = 7 }: Props) {
  const { t, lang } = useI18n();
  const dates = buildDates(days);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex h-10 items-center gap-2.5 rounded-full border border-gm-gold/30 bg-gm-bg-2 py-0 pl-[18px] pr-1.5 transition-colors hover:border-gm-gold hover:bg-gm-bg-3">
          <div className="text-left">
            <div className="text-[11px] tracking-eyebrow-sm text-gm-tx-3">{t.header.date}</div>
            <div className="text-sm font-semibold capitalize text-gm-gold-1">
              {formatDateLabel(value, lang, t)}
            </div>
          </div>
          <span className="grid h-[26px] w-[26px] place-items-center rounded-full bg-gm-gold/10">
            <ChevronDown className="h-[15px] w-[15px] text-gm-gold" strokeWidth={2} />
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 border-gm-line bg-gm-bg-2">
        {dates.map((iso) => (
          <DropdownMenuItem
            key={iso}
            onClick={() => onChange(iso)}
            className={cn(
              "flex cursor-pointer items-center gap-2.5 text-gm-tx-1 focus:bg-gm-bg-hover",
              iso === value && "text-gm-gold-1",
            )}
          >
            <Calendar className="h-4 w-4 text-gm-tx-3" strokeWidth={1.7} />
            <span className="flex-1 capitalize">{formatDateLabel(iso, lang, t)}</span>
            {iso === value && <Check className="h-4 w-4 text-gm-gold" strokeWidth={2} />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
