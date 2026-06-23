"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import { TrailerModal } from "@/components/ui/trailer-modal";
import { useI18n } from "@/components/providers/language-provider";
import { MOVIES, formatLabel, type Movie } from "@/lib/mock-data";

const FEATURED_SLUGS = [
  "mandalorian-and-grogu",
  "oppenheimer",
  "dune-part-two",
  "deadpool-and-wolverine",
];

/** Banner widescreen oficial servido localmente (WebP). */
const HERO_BANNERS: Record<string, string> = {
  "mandalorian-and-grogu": "/banners/mandalorian.webp",
  "oppenheimer": "/banners/oppenheimer.webp",
  "dune-part-two": "/banners/dune-part-two.webp",
  "deadpool-and-wolverine": "/banners/deadpool-and-wolverine.webp",
};
const ROTATE_MS = 2000;

const FEATURED_MOVIES: Movie[] = FEATURED_SLUGS
  .map((slug) => MOVIES.find((m) => m.slug === slug))
  .filter((m): m is Movie => Boolean(m));

export function Hero() {
  const { t, g } = useI18n();
  const [idx, setIdx] = useState(0);
  const [isHoverPaused, setIsHoverPaused] = useState(false);
  const [trailerOpen, setTrailerOpen] = useState(false);

  useEffect(() => {
    if (isHoverPaused || trailerOpen) return;
    const id = window.setInterval(() => {
      setIdx((i) => (i + 1) % FEATURED_MOVIES.length);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [isHoverPaused, trailerOpen]);

  const movie = FEATURED_MOVIES[idx];
  const isPlaybackPaused = isHoverPaused || trailerOpen;
  const goPrev = () => setIdx((i) => (i - 1 + FEATURED_MOVIES.length) % FEATURED_MOVIES.length);
  const goNext = () => setIdx((i) => (i + 1) % FEATURED_MOVIES.length);

  return (
    <>
      <section
        className="relative mb-3.5 h-[420px] overflow-hidden rounded-[22px] border border-gm-line"
        onMouseEnter={() => setIsHoverPaused(true)}
        onMouseLeave={() => setIsHoverPaused(false)}
      >
        {/* Background image, blended into the dark theme */}
        <div className="absolute inset-0">
          <Image
            key={movie.id}
            src={HERO_BANNERS[movie.slug] ?? movie.poster}
            alt={movie.title}
            fill
            sizes="100vw"
            priority
            className="object-cover opacity-90 transition-opacity duration-700"
          />
        </div>
        <div className="absolute inset-0 hero-vignette" />
        <div className="absolute inset-0 veil-l" />

        <div className="relative z-overlay flex h-full max-w-[680px] flex-col justify-center px-[60px]">
          <span className="mb-5 inline-flex items-center gap-2 self-start rounded-full border border-gm-gold/30 bg-gm-gold/10 px-3.5 py-1.5 text-[11px] uppercase tracking-eyebrow-lg text-gm-gold">
            ● {t.hero.tag}
          </span>

          <h1 className="mb-3.5 font-display text-display-md font-semibold">
            <em className="not-italic text-gold-gradient">{movie.title}</em>
          </h1>

          <div className="mb-6 flex items-center gap-[18px] text-[13.5px] text-gm-tx-2">
            <span>
              {Math.floor(movie.durationMin / 60)}h {movie.durationMin % 60}min
            </span>
            <Pip />
            <span>{formatLabel(movie.format)}</span>
            <Pip />
            <span>{g(movie.genre)}</span>
            <Pip />
            <span>{movie.certificate}</span>
          </div>

          <div className="flex gap-3.5">
            <button
              onClick={() => setTrailerOpen(true)}
              className="btn-gold inline-flex h-12 items-center gap-2.5 px-[26px] text-sm"
            >
              <Play className="h-[18px] w-[18px]" fill="var(--gm-gold-ink)" strokeWidth={0} />
              {t.hero.watchTrailer}
            </button>
            <Link
              href={`/movie/${movie.slug}`}
              className="inline-flex h-12 items-center rounded-full border border-gm-line bg-white/5 px-[26px] text-sm font-semibold text-gm-tx-1 transition-colors hover:border-gm-gold/30 hover:bg-white/[.07]"
            >
              {t.hero.buyTickets}
            </Link>
          </div>
        </div>

        {/* Carousel dots */}
        <div className="absolute bottom-6 left-[60px] z-overlay-hi flex gap-2">
          {FEATURED_MOVIES.map((m, i) => (
            <button
              key={m.id}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIdx(i)}
              className={`h-[7px] rounded-full transition-[width,background] duration-300 ${
                i === idx ? "w-6 bg-gold-gradient" : "w-[7px] bg-[#3a3a42]"
              }`}
            />
          ))}
        </div>

        {/* Prev / next arrows — centered vertically */}
        <button
          onClick={goPrev}
          aria-label="Previous slide"
          className="absolute left-3 top-1/2 z-overlay-hi grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-white/10 bg-black/30 text-white/80 backdrop-blur-sm transition-colors hover:border-gm-gold/40 hover:bg-black/50 hover:text-gm-gold-1"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={2} />
        </button>
        <button
          onClick={goNext}
          aria-label="Next slide"
          className="absolute right-3 top-1/2 z-overlay-hi grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-white/10 bg-black/30 text-white/80 backdrop-blur-sm transition-colors hover:border-gm-gold/40 hover:bg-black/50 hover:text-gm-gold-1"
        >
          <ChevronRight className="h-5 w-5" strokeWidth={2} />
        </button>

        {/* Progress bar — fills 0→100% over ROTATE_MS, resets per slide */}
        <div className="absolute inset-x-0 bottom-0 z-overlay-hi h-[3px] overflow-hidden bg-white/5">
          <div
            key={`${idx}-${isPlaybackPaused ? "p" : "r"}`}
            className="h-full origin-left bg-gold-gradient"
            style={{
              animation: `gm-hero-progress ${ROTATE_MS}ms linear forwards`,
              animationPlayState: isPlaybackPaused ? "paused" : "running",
            }}
          />
        </div>
      </section>

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
