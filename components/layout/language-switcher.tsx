"use client";

import { Check, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LANGS } from "@/lib/i18n";
import { useI18n } from "@/components/providers/language-provider";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const { lang, setLang } = useI18n();
  const current = LANGS.find((l) => l.code === lang)!;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Change language"
          className="flex h-10 items-center gap-2 rounded-full border border-gm-line bg-gm-bg-2 px-3.5 text-gm-tx-2 transition-colors hover:border-[#33333d] hover:bg-gm-bg-3 hover:text-gm-tx-1"
        >
          <Globe className="h-[17px] w-[17px]" strokeWidth={1.7} />
          <span className="text-[13px] font-semibold tracking-wide">{current.short}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44 border-gm-line bg-gm-bg-2">
        {LANGS.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => setLang(l.code)}
            className={cn(
              "flex cursor-pointer items-center gap-2.5 text-gm-tx-1 focus:bg-gm-bg-hover",
              l.code === lang && "text-gm-gold-1"
            )}
          >
            <span className="grid h-5 w-7 place-items-center rounded border border-gm-line text-[10px] font-bold text-gm-tx-2">
              {l.short}
            </span>
            <span className="flex-1">{l.label}</span>
            {l.code === lang && <Check className="h-4 w-4 text-gm-gold" strokeWidth={2} />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
