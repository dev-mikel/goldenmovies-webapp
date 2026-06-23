"use client";

import { ChevronDown, Check, MapPin } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCity } from "@/components/providers/city-provider";
import { useI18n } from "@/components/providers/language-provider";
import { cn } from "@/lib/utils";

export function CitySelector() {
  const { city, setCity, cities } = useCity();
  const { t } = useI18n();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex h-10 items-center gap-2.5 rounded-full border border-gm-gold/30 bg-gm-bg-2 py-0 pl-[18px] pr-1.5 transition-colors hover:border-gm-gold hover:bg-gm-bg-3">
          <div className="text-left">
            <div className="text-[11px] tracking-eyebrow-sm text-gm-tx-3">{t.header.city}</div>
            <div className="text-sm font-semibold text-gm-gold-1">{city}</div>
          </div>
          <span className="grid h-[26px] w-[26px] place-items-center rounded-full bg-gm-gold/10">
            <ChevronDown className="h-[15px] w-[15px] text-gm-gold" strokeWidth={2} />
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 border-gm-line bg-gm-bg-2"
      >
        {cities.map((c) => (
          <DropdownMenuItem
            key={c}
            onClick={() => setCity(c)}
            className={cn(
              "flex cursor-pointer items-center gap-2.5 text-gm-tx-1 focus:bg-gm-bg-hover",
              c === city && "text-gm-gold-1",
            )}
          >
            <MapPin className="h-4 w-4 text-gm-tx-3" strokeWidth={1.7} />
            <span className="flex-1">{c}</span>
            {c === city && <Check className="h-4 w-4 text-gm-gold" strokeWidth={2} />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
