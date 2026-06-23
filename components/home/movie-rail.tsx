"use client";

import { ChevronRight } from "lucide-react";
import type { Movie } from "@/lib/mock-data";
import { useI18n } from "@/components/providers/language-provider";
import { MoviePosterCard } from "@/components/movies/movie-poster-card";

export function MovieRail({
  title,
  titleAccent,
  movies,
}: {
  title: string;
  titleAccent?: string;
  movies: Movie[];
}) {
  const { t } = useI18n();
  return (
    <section>
      <div className="mb-5 flex items-end justify-between">
        <h2 className="font-display text-[32px] font-semibold tracking-[0.01em]">
          {title} {titleAccent && <span className="text-gold-gradient">{titleAccent}</span>}
        </h2>
        <button className="flex items-center gap-1.5 text-[13px] font-medium text-gm-tx-2 transition-colors hover:text-gm-gold">
          {t.home.seeAll} <ChevronRight className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-[18px]">
        {movies.map((m) => (
          <MoviePosterCard key={m.id} movie={m} />
        ))}
      </div>
    </section>
  );
}
