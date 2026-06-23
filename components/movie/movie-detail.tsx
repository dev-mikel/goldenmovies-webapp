"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Play, Star, Clock, Calendar } from "lucide-react";
import { TrailerModal } from "@/components/ui/trailer-modal";
import { CitySelector } from "@/components/layout/city-selector";
import { DateSelector } from "@/components/layout/date-selector";
import { useI18n } from "@/components/providers/language-provider";
import { useCity } from "@/components/providers/city-provider";
import { formatLabel, type Movie, type ShowtimeGroup } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function MovieDetail({
  movie,
  showtimes,
}: {
  movie: Movie;
  showtimes: ShowtimeGroup[];
}) {
  const { t, g } = useI18n();
  const { city } = useCity();
  const [date, setDate] = useState<string>(todayISO);
  const [selected, setSelected] = useState<{ venue: string; format: string; time: string; subtitled: boolean } | null>(null);
  const [trailerOpen, setTrailerOpen] = useState(false);

  const cityShowtimes = useMemo(
    () => showtimes.filter((s) => s.city === city),
    [showtimes, city]
  );

  const seatsHref = useMemo(() => {
    if (!selected) return null;
    const params = new URLSearchParams({
      v: selected.venue,
      f: selected.format,
      t: selected.time,
      sub: selected.subtitled ? "1" : "0",
      d: date,
    });
    return `/movie/${movie.slug}/seats?${params.toString()}`;
  }, [selected, movie.slug, date]);

  return (
    <>
      <Link
        href="/now-showing"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gm-tx-2 transition-colors hover:text-gm-gold"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={2} />
        {t.detail.back}
      </Link>

      {/* Top: poster + info */}
      <div className="flex gap-10">
        <div className="relative h-[420px] w-[280px] shrink-0 overflow-hidden rounded-2xl border border-gm-line">
          <Image
            src={movie.poster}
            alt={movie.title}
            fill
            sizes="280px"
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 veil-b-soft" />
          <span className="absolute left-3 top-3 rounded-md border border-gm-gold/30 bg-gm-bg-0/70 px-2.5 py-1 text-[10px] tracking-eyebrow text-gm-gold-1 backdrop-blur">
            {movie.format}
          </span>
          <div className="absolute inset-0 grid place-items-center">
            <button
              onClick={() => setTrailerOpen(true)}
              aria-label="Watch trailer"
              className="grid h-16 w-16 place-items-center rounded-full bg-gold-gradient shadow-brand-xl transition-transform hover:scale-105"
            >
              <Play className="h-6 w-6 text-gm-gold-ink" fill="var(--gm-gold-ink)" strokeWidth={0} />
            </button>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="font-display text-display-sm font-semibold">{movie.title}</h1>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gm-tx-2">
            <span className="flex items-center gap-1.5 text-gm-gold">
              <Star className="h-4 w-4" fill="currentColor" strokeWidth={0} />
              <span className="font-semibold">{movie.rating}</span>
            </span>
            <Pip />
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" strokeWidth={1.7} />
              {movie.durationMin} {t.nowShowingPage.runtime}
            </span>
            <Pip />
            <span>{g(movie.genre)}</span>
            <Pip />
            <span className="rounded border border-gm-line px-2 py-0.5 text-xs">{movie.certificate}</span>
            <Pip />
            <span>{movie.year}</span>
          </div>

          <button
            onClick={() => setTrailerOpen(true)}
            className="btn-gold mt-6 inline-flex h-12 items-center gap-2.5 px-7 text-sm"
          >
            <Play className="h-[18px] w-[18px]" fill="var(--gm-gold-ink)" strokeWidth={0} />
            {t.detail.trailer}
          </button>

          <Section title={t.detail.synopsis}>
            <p className="max-w-2xl leading-relaxed text-gm-tx-2">{movie.synopsis}</p>
          </Section>

          <div className="mt-7 grid max-w-2xl grid-cols-2 gap-6">
            <Meta label={t.detail.director} value={movie.director} />
            <Meta label={t.detail.cast} value={movie.cast.join(", ")} />
          </div>
        </div>
      </div>

      {/* Showtimes */}
      {movie.upcoming ? (
        <section className="mt-12 border-t border-gm-line/60 pt-9">
          <div className="flex items-center gap-2.5 mb-4">
            <Calendar className="h-5 w-5 text-gm-gold" strokeWidth={1.7} />
            <h2 className="font-display text-[30px] font-semibold">{t.detail.showtimes}</h2>
          </div>
          <div className="grid h-[160px] place-items-center rounded-xl border border-gm-line bg-gm-bg-2/50 text-sm text-gm-tx-3 text-center px-6">
            {t.detail.upcomingNotice}
          </div>
        </section>
      ) : (
        <section className="mt-12 border-t border-gm-line/60 pt-9">
          <div className="mb-1 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <Calendar className="h-5 w-5 text-gm-gold" strokeWidth={1.7} />
              <h2 className="font-display text-[30px] font-semibold">{t.detail.showtimes}</h2>
            </div>
            <div className="flex items-center gap-2.5">
              <CitySelector />
              <DateSelector value={date} onChange={setDate} />
            </div>
          </div>
          <p className="mb-6 text-sm text-gm-tx-3">{t.detail.pickShowtime}</p>

          {cityShowtimes.length === 0 && (
            <div className="grid h-[160px] place-items-center rounded-xl border border-gm-line bg-gm-bg-2/50 text-sm text-gm-tx-3">
              {t.theatersPage.none}
            </div>
          )}

          <div className="flex flex-col gap-3">
            {cityShowtimes.map((group) => (
              <div
                key={group.venue}
                className="rounded-xl border border-gm-line bg-gm-bg-2 px-6 py-4"
              >
                <div className="mb-3 font-semibold">{group.venue}</div>
                <div className="flex flex-col gap-2">
                  {group.entries.map((e) => {
                    const id = `${e.format}-${e.subtitled ? "sub" : "or"}-${e.time}`;
                    const isOn =
                      selected?.venue === group.venue &&
                      selected?.time === e.time &&
                      selected?.format === e.format &&
                      selected?.subtitled === e.subtitled;
                    return (
                      <button
                        key={`${group.venue}-${id}`}
                        onClick={() =>
                          setSelected({
                            venue: group.venue,
                            format: e.format,
                            time: e.time,
                            subtitled: e.subtitled,
                          })
                        }
                        className={cn(
                          "flex items-center gap-4 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors",
                          isOn
                            ? "border-gm-gold bg-gold-gradient text-gm-gold-ink"
                            : "border-gm-line bg-gm-bg-3 text-gm-tx-1 hover:border-gm-gold/40 hover:text-gm-gold-1"
                        )}
                      >
                        <span className="w-16 text-left tabular-nums">{e.time}</span>
                        <span className="flex-1 text-left text-xs uppercase tracking-eyebrow-sm text-gm-gold-1 group-hover:text-current">
                          {formatLabel(e.format, e.subtitled)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Takes the user to the seat map with the chosen showtime.
              Checkout/payments remain out of scope. */}
          {seatsHref ? (
            <Link
              href={seatsHref}
              className="btn-gold mt-7 inline-flex h-12 items-center px-8 text-sm"
            >
              {t.detail.book}
            </Link>
          ) : (
            <button
              disabled
              className="mt-7 inline-flex h-12 cursor-not-allowed items-center rounded-full border border-gm-line bg-gm-bg-2 px-8 text-sm font-semibold text-gm-tx-3"
            >
              {t.detail.book}
            </button>
          )}
        </section>
      )}

      <TrailerModal
        open={trailerOpen}
        onClose={() => setTrailerOpen(false)}
        title={movie.title}
        videoId={movie.trailerVideoId}
      />
    </>
  );
}

const Pip = () => <span className="h-1 w-1 rounded-full bg-gm-tx-3" />;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-8">
      <h2 className="mb-2.5 font-display text-2xl font-semibold">{title}</h2>
      {children}
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="mb-1 text-xs uppercase tracking-eyebrow-md text-gm-tx-3">{label}</div>
      <div className="text-[15px] text-gm-tx-1">{value}</div>
    </div>
  );
}
