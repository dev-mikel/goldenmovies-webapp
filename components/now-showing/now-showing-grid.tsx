"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Play, Star, Clock } from "lucide-react";
import { useI18n } from "@/components/providers/language-provider";
import { useCity } from "@/components/providers/city-provider";
import { fetchMovies, fetchVenues } from "@/lib/api-client";
import { FORMATS, formatLabel, type Format, type Movie, type Venue } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function NowShowingGrid() {
  const { t, g } = useI18n();
  const { city } = useCity();
  const searchParams = useSearchParams();
  const venueId = searchParams.get("venue");

  const [format, setFormat] = useState<Format | "all">("all");
  const [genre, setGenre] = useState<string>("all");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [venue, setVenue] = useState<Venue | null>(null);

  useEffect(() => {
    let active = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard data-fetching loading flag
    setLoading(true);
    fetchMovies({ format })
      .then((data) => active && setMovies(data))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [format]);

  // When ?venue= is present, resolve the venue to show context and filter movies
  // down to those the venue can screen (based on its supported formats/technologies).
  useEffect(() => {
    if (!venueId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- clearing venue context when ?venue= drops from URL
      setVenue(null);
      return;
    }
    let active = true;
    fetchVenues({ city }).then((list) => {
      if (!active) return;
      setVenue(list.find((v) => v.id === venueId) ?? null);
    });
    return () => {
      active = false;
    };
  }, [venueId, city]);

  const genres = useMemo(
    () => Array.from(new Set(movies.map((m) => m.genre))),
    [movies],
  );

  const filtered = useMemo(() => {
    let list = movies;
    if (genre !== "all") list = list.filter((m) => m.genre === genre);
    if (venue) {
      // Every venue offers at least Dolby Digital, so every movie always has
      // at least one available showtime at any venue (subtitled or dubbed).
      list = list.filter((m) =>
        venue.technologies.includes(m.format) || venue.technologies.includes("DOLBY")
      );
    }
    return list;
  }, [movies, genre, venue]);

  return (
    <>
      <div className="mb-7 flex items-end justify-between">
        <div>
          <h1 className="font-display text-[42px] font-semibold leading-none">
            {t.nowShowingPage.title} <span className="text-gold-gradient">{t.nowShowingPage.subtitle}</span>
          </h1>
          {venue && (
            <p className="mt-2 text-sm text-gm-tx-3">
              {venue.name} · <span className="text-gm-tx-2">{venue.city}</span>
            </p>
          )}
        </div>
        <span className="text-sm text-gm-tx-3">
          {loading ? "…" : `${filtered.length} ${t.nowShowingPage.results}`}
        </span>
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-2.5">
        <Chip active={format === "all"} onClick={() => setFormat("all")}>
          {t.nowShowingPage.allFormats}
        </Chip>
        {FORMATS.map((f) => (
          <Chip key={f} active={format === f} onClick={() => setFormat(f)}>
            {formatLabel(f)}
          </Chip>
        ))}
        <span className="mx-1 h-5 w-px bg-gm-line" />
        <Chip active={genre === "all"} onClick={() => setGenre("all")}>
          {t.nowShowingPage.allGenres}
        </Chip>
        {genres.map((gen) => (
          <Chip key={gen} active={genre === gen} onClick={() => setGenre(gen)}>
            {g(gen)}
          </Chip>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : filtered.map((m) => (
              <Link
                key={m.id}
                href={`/movie/${m.slug}`}
                className="group/c flex gap-4 rounded-xl border border-gm-line bg-gm-bg-2 p-3.5 transition-[border-color,transform] duration-200 hover:-translate-y-1 hover:border-gm-gold/30"
              >
                <div className="relative h-[150px] w-[100px] shrink-0 overflow-hidden rounded-md">
                  <Image
                    src={m.poster}
                    alt={m.title}
                    fill
                    sizes="100px"
                    className="object-cover"
                  />
                  <span className="absolute left-1.5 top-1.5 rounded border border-gm-gold/30 bg-gm-bg-0/70 px-1.5 py-0.5 text-[9px] tracking-wide text-gm-gold-1 backdrop-blur">
                    {formatLabel(m.format)}
                  </span>
                  <div className="absolute inset-0 grid place-items-center opacity-0 transition-opacity group-hover/c:opacity-100">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-gold-gradient">
                      <Play className="h-4 w-4 text-gm-gold-ink" fill="var(--gm-gold-ink)" strokeWidth={0} />
                    </span>
                  </div>
                </div>
                <div className="flex min-w-0 flex-col">
                  <h3 className="truncate text-[15px] font-semibold">{m.title}</h3>
                  <p className="mt-0.5 text-xs text-gm-tx-3">{g(m.genre)} · {m.certificate}</p>
                  <div className="mt-2 flex items-center gap-3 text-xs text-gm-tx-2">
                    <span className="flex items-center gap-1 text-gm-gold">
                      <Star className="h-3 w-3" fill="currentColor" strokeWidth={0} />
                      {m.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" strokeWidth={1.7} />
                      {m.durationMin} {t.nowShowingPage.runtime}
                    </span>
                  </div>
                  <span className="mt-auto inline-flex w-fit items-center rounded-full bg-gm-gold/10 px-3 py-1 text-xs font-semibold text-gm-gold-1">
                    {t.nowShowingPage.book}
                  </span>
                </div>
              </Link>
            ))}
      </div>
    </>
  );
}

function SkeletonCard() {
  return (
    <div className="flex gap-4 rounded-xl border border-gm-line bg-gm-bg-2 p-3.5">
      <div className="h-[150px] w-[100px] shrink-0 animate-pulse rounded-md bg-gm-bg-3" />
      <div className="flex flex-1 flex-col gap-2 pt-1">
        <div className="h-4 w-3/4 animate-pulse rounded bg-gm-bg-3" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-gm-bg-3" />
        <div className="mt-2 h-3 w-2/3 animate-pulse rounded bg-gm-bg-3" />
      </div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "h-9 rounded-full border px-4 text-[13px] font-medium transition-colors",
        active
          ? "border-gm-gold/40 bg-gm-gold/10 text-gm-gold-1"
          : "border-gm-line bg-gm-bg-2 text-gm-tx-2 hover:border-[#33333d] hover:text-gm-tx-1",
      )}
    >
      {children}
    </button>
  );
}
