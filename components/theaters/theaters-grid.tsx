"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ChevronRight } from "lucide-react";
import { useI18n } from "@/components/providers/language-provider";
import { fetchVenues } from "@/lib/api-client";
import { formatLabel, type Venue } from "@/lib/mock-data";

export function TheatersGrid() {
  const { t } = useI18n();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard data-fetching loading flag
    setLoading(true);
    fetchVenues()
      .then((data) => active && setVenues(data))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <div className="mb-3">
        <h1 className="font-display text-[42px] font-semibold leading-none">
          {t.theatersPage.title} <span className="text-gold-gradient">{t.theatersPage.titleAccent}</span>
        </h1>
      </div>
      <p className="mb-8 text-sm text-gm-tx-2">{t.theatersPage.subtitle}</p>

      {!loading && venues.length === 0 ? (
        <div className="grid h-[280px] place-items-center rounded-2xl border border-gm-line bg-gm-bg-2/50 text-gm-tx-3">
          {t.theatersPage.none}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} />)
            : venues.map((v) => <TheaterCard key={v.id} venue={v} cta={t.theatersPage.seeShowtimes} />)}
        </div>
      )}
    </>
  );
}

function TheaterCard({ venue, cta }: { venue: Venue; cta: string }) {
  return (
    <Link
      href={`/now-showing?venue=${venue.id}`}
      className="group/v overflow-hidden rounded-2xl border border-gm-line bg-gm-bg-2 transition-[border-color,transform] duration-200 hover:-translate-y-1 hover:border-gm-gold/30"
    >
      <div className="relative h-[170px] w-full overflow-hidden">
        <Image
          src={venue.photo}
          alt={venue.name}
          fill
          sizes="(max-width:768px) 100vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover/v:scale-105"
        />
        <div className="absolute inset-0 veil-b-tall" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {venue.technologies.map((tech) => (
            <span
              key={tech}
              className="rounded-md border border-gm-gold/30 bg-gm-bg-0/70 px-2 py-0.5 text-[10px] tracking-eyebrow text-gm-gold-1 backdrop-blur"
            >
              {formatLabel(tech)}
            </span>
          ))}
        </div>
      </div>
      <div className="px-5 pb-5 pt-4">
        <h3 className="font-display text-[22px] font-semibold leading-tight">{venue.name}</h3>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-gm-tx-3">
          <MapPin className="h-3 w-3" strokeWidth={1.7} />
          {venue.address ?? venue.city}
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-gm-gold-1">
          {cta}
          <ChevronRight className="h-4 w-4" strokeWidth={2} />
        </span>
      </div>
    </Link>
  );
}

function Skeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gm-line bg-gm-bg-2">
      <div className="h-[170px] animate-pulse bg-gm-bg-3" />
      <div className="space-y-2 p-5">
        <div className="h-5 w-2/3 animate-pulse rounded bg-gm-bg-3" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-gm-bg-3" />
      </div>
    </div>
  );
}
