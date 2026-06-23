"use client";

import Link from "next/link";
import Image from "next/image";
import { Play, Star, Clock } from "lucide-react";
import { useI18n } from "@/components/providers/language-provider";
import type { Movie } from "@/lib/mock-data";

type Props = {
  movie: Movie;
  /** Hide rating/duration row and show release date instead. */
  releaseMode?: boolean;
  /** Custom CTA label on the bottom badge. */
  cta?: string;
  /** Where the card links to (defaults to /movie/[slug]). */
  href?: string;
};

export function MoviePosterCard({ movie, releaseMode, cta, href }: Props) {
  const { t, g, lang } = useI18n();
  const link = href ?? `/movie/${movie.slug}`;

  const release = movie.releaseDate
    ? new Date(movie.releaseDate).toLocaleDateString(lang === "es" ? "es-VE" : "en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <Link
      href={link}
      className="@container/card group/p flex flex-col cursor-pointer"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-md border border-gm-line transition-[transform,border-color,box-shadow] duration-200 group-hover/p:-translate-y-1.5 group-hover/p:border-gm-gold/30 group-hover/p:shadow-[0_18px_40px_rgba(0,0,0,.5)]">
        <Image
          src={movie.poster}
          alt={movie.title}
          fill
          sizes="(max-width:768px) 50vw, (max-width:1200px) 25vw, 20vw"
          className="object-cover"
        />
        <div className="absolute inset-0 veil-b" />
        {/* Format badge — hide when slot is too narrow to render legibly */}
        <span className="absolute left-2.5 top-2.5 z-overlay hidden @[140px]/card:inline-block rounded-md border border-gm-gold/30 bg-gm-bg-0/70 px-2.5 py-1 text-[10px] tracking-eyebrow text-gm-gold-1 backdrop-blur">
          {movie.format}
        </span>
        <div className="absolute inset-0 z-overlay grid place-items-center opacity-0 transition-opacity duration-200 group-hover/p:opacity-100">
          <span className="grid h-[50px] w-[50px] place-items-center rounded-full bg-gold-gradient shadow-brand-xl">
            <Play className="h-5 w-5 text-gm-gold-ink" fill="var(--gm-gold-ink)" strokeWidth={0} />
          </span>
        </div>
      </div>
      <h4 className="mt-3 truncate text-[13px] @[160px]/card:text-[14.5px] font-semibold">{movie.title}</h4>
      {releaseMode ? (
        <div className="mt-1 flex items-center gap-2 text-xs text-gm-tx-3">
          <span className="text-gm-gold-1">{t.comingSoonPage.releaseDate}</span>
          <span>{release}</span>
        </div>
      ) : (
        <div className="mt-0.5 flex items-center gap-2 text-xs text-gm-tx-3">
          <span className="flex items-center gap-1 text-gm-gold">
            <Star className="h-3 w-3" fill="currentColor" strokeWidth={0} />
            {movie.rating}
          </span>
          <span>· {g(movie.genre)}</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" strokeWidth={1.7} />
            {movie.durationMin}m
          </span>
        </div>
      )}
      {cta && (
        <span className="mt-3 inline-flex w-fit items-center rounded-full bg-gm-gold/10 px-3 py-1 text-xs font-semibold text-gm-gold-1">
          {cta}
        </span>
      )}
    </Link>
  );
}
