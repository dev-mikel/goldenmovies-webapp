"use client";

import Link from "next/link";
import { Clapperboard, Popcorn, Clock, Shield, type LucideIcon } from "lucide-react";
import { useI18n } from "@/components/providers/language-provider";

export function QuickAccess() {
  const { t } = useI18n();
  const QUICK: { title: string; desc: string; href: string; icon: LucideIcon; glow: string }[] = [
    { title: t.quick.nowShowing, desc: t.quick.nowShowingDesc, href: "/now-showing", icon: Clapperboard, glow: "rgba(212,175,55,.4)" },
    { title: t.quick.concessions, desc: t.quick.concessionsDesc, href: "/concessions", icon: Popcorn, glow: "rgba(120,90,200,.35)" },
    { title: t.quick.presale, desc: t.quick.presaleDesc, href: "/presale", icon: Clock, glow: "rgba(80,140,160,.35)" },
    { title: t.quick.club, desc: t.quick.clubDesc, href: "/club", icon: Shield, glow: "rgba(160,100,60,.35)" },
  ];

  return (
    <section className="my-[26px] mb-10 grid grid-cols-4 gap-3.5">
      {QUICK.map((q) => {
        const Icon = q.icon;
        return (
          <Link
            key={q.href}
            href={q.href}
            className="group/q relative flex h-[118px] flex-col justify-end overflow-hidden rounded-lg border border-gm-line bg-gm-bg-2 px-[22px] py-5 transition-[transform,border-color] duration-200 hover:-translate-y-1 hover:border-gm-gold/30"
          >
            <div
              className="absolute inset-0 opacity-50"
              style={{ background: `radial-gradient(80% 120% at 85% 15%,${q.glow},transparent 70%)` }}
            />
            <Icon className="absolute right-5 top-[18px] h-6 w-6 text-gm-tx-3 transition-colors group-hover/q:text-gm-gold" strokeWidth={1.5} />
            <h3 className="relative text-lg font-semibold">{q.title}</h3>
            <p className="relative mt-0.5 text-[12.5px] text-gm-tx-2">{q.desc}</p>
          </Link>
        );
      })}
    </section>
  );
}
