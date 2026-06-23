"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { useI18n } from "@/components/providers/language-provider";
import { useCurrency } from "@/components/providers/currency-provider";
import { fetchConcessions } from "@/lib/api-client";
import type { Concession, ConcessionCategory } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type Filter = ConcessionCategory | "all";

export function ConcessionsCatalog() {
  const { t } = useI18n();
  const { format } = useCurrency();
  const [items, setItems] = useState<Concession[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    let active = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard data-fetching loading flag
    setLoading(true);
    fetchConcessions(filter === "all" ? undefined : filter)
      .then((data) => active && setItems(data))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [filter]);

  const cats: { id: Filter; label: string }[] = [
    { id: "all", label: t.concessionsPage.categories.all },
    { id: "combo", label: t.concessionsPage.categories.combo },
    { id: "popcorn", label: t.concessionsPage.categories.popcorn },
    { id: "drink", label: t.concessionsPage.categories.drink },
    { id: "candy", label: t.concessionsPage.categories.candy },
  ];

  return (
    <>
      <div className="mb-3">
        <h1 className="font-display text-[42px] font-semibold leading-none">
          {t.concessionsPage.title} <span className="text-gold-gradient">{t.concessionsPage.titleAccent}</span>
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-gm-tx-2">{t.concessionsPage.subtitle}</p>
      </div>

      <div className="mb-8 mt-6 flex flex-wrap gap-2.5">
        {cats.map((c) => (
          <button
            key={c.id}
            onClick={() => setFilter(c.id)}
            className={cn(
              "h-9 rounded-full border px-4 text-[13px] font-medium transition-colors",
              filter === c.id
                ? "border-gm-gold/40 bg-gm-gold/10 text-gm-gold-1"
                : "border-gm-line bg-gm-bg-2 text-gm-tx-2 hover:border-[#33333d] hover:text-gm-tx-1",
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} />)
          : items.map((it) => (
              <article
                key={it.id}
                className="group/c overflow-hidden rounded-2xl border border-gm-line bg-gm-bg-2 transition-[border-color,transform] duration-200 hover:-translate-y-1 hover:border-gm-gold/30"
              >
                <div className="relative h-[180px] w-full overflow-hidden">
                  <Image
                    src={it.image}
                    alt={it.name}
                    fill
                    sizes="(max-width:768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover/c:scale-105"
                  />
                </div>
                <div className="flex flex-col gap-3 p-5">
                  <div>
                    <h3 className="font-display text-[20px] font-semibold leading-tight">
                      {it.name}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-gm-tx-3">
                      {it.description}
                    </p>
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="font-display text-[22px] font-semibold text-gold-gradient">
                      {format(it.priceUSD)}
                    </span>
                    <button className="inline-flex h-9 items-center gap-1.5 rounded-full bg-gm-gold/10 px-3.5 text-[13px] font-semibold text-gm-gold-1 transition-colors hover:bg-gm-gold/20">
                      <Plus className="h-4 w-4" strokeWidth={2} />
                      {t.concessionsPage.add}
                    </button>
                  </div>
                </div>
              </article>
            ))}
      </div>
    </>
  );
}

function Skeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gm-line bg-gm-bg-2">
      <div className="h-[180px] animate-pulse bg-gm-bg-3" />
      <div className="space-y-2 p-5">
        <div className="h-5 w-2/3 animate-pulse rounded bg-gm-bg-3" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-gm-bg-3" />
        <div className="mt-3 h-7 w-1/3 animate-pulse rounded bg-gm-bg-3" />
      </div>
    </div>
  );
}
