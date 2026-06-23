"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { LanguageSwitcher } from "./language-switcher";
import { NotificationsBell } from "./notifications-bell";
import { useI18n } from "@/components/providers/language-provider";
import { USER } from "@/lib/mock-data";

export function Header() {
  const { t } = useI18n();
  const router = useRouter();
  const [q, setQ] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = q.trim();
    if (v) router.push(`/search?q=${encodeURIComponent(v)}`);
  };

  return (
    <header className="sticky top-0 z-sticky flex h-[var(--header-h)] items-center justify-between border-b border-gm-line/50 bg-gm-bg-1/70 px-10 backdrop-blur-xl backdrop-saturate-150">
      <div className="flex items-center gap-7">
        <Link href="/" aria-label="GoldenMovies home" className="flex items-center gap-3">
          <Image
            src="/golden_movies.svg"
            alt="GoldenMovies"
            width={70}
            height={70}
            priority
            className="h-[70px] w-[70px] rounded-md"
          />
          <span className="text-gold-gradient whitespace-nowrap font-display text-[24px] font-semibold tracking-[0.04em]">
            Golden Movies
          </span>
        </Link>

        <form
          onSubmit={onSubmit}
          className="group flex h-10 w-[300px] cursor-text items-center gap-2.5 rounded-full border border-gm-line bg-gm-bg-2 px-4 transition-colors focus-within:border-gm-gold/30 focus-within:bg-gm-bg-3 hover:border-[#33333d]"
        >
          <button
            type="submit"
            aria-label="Search"
            className="grid place-items-center text-gm-tx-3 transition-colors hover:text-gm-gold-1"
          >
            <Search className="h-[17px] w-[17px]" strokeWidth={1.7} />
          </button>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t.header.search}
            className="w-full bg-transparent text-[13.5px] text-gm-tx-1 outline-hidden placeholder:text-gm-tx-3"
          />
        </form>
      </div>

      <div className="flex items-center gap-4">
        <LanguageSwitcher />
        <NotificationsBell />
        <button className="grid h-10 w-10 place-items-center rounded-full bg-gm-bg-3 text-[13px] font-bold text-gm-gold-1 shadow-[0_0_0_1.5px_var(--gm-gold-deep)] transition-shadow hover:shadow-[0_0_0_1.5px_var(--gm-gold),0_0_16px_rgba(212,175,55,.25)]">
          {USER.initials}
        </button>
      </div>
    </header>
  );
}
