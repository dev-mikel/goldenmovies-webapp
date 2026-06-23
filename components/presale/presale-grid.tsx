"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { useI18n } from "@/components/providers/language-provider";
import { fetchMovies } from "@/lib/api-client";
import { MoviePosterCard } from "@/components/movies/movie-poster-card";
import type { Movie } from "@/lib/mock-data";

export function PresaleGrid() {
  const { t } = useI18n();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchMovies({ presale: true })
      .then((data) => active && setMovies(data))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <div className="mb-3 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-gm-gold/10 text-gm-gold">
          <Clock className="h-5 w-5" strokeWidth={1.7} />
        </span>
        <h1 className="font-display text-[42px] font-semibold leading-none">
          {t.presalePage.title} <span className="text-gold-gradient">{t.presalePage.titleAccent}</span>
        </h1>
      </div>
      <p className="mb-8 text-sm text-gm-tx-2">{t.presalePage.subtitle}</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-[18px]">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <PosterSkeleton key={i} />)
          : movies.map((m) => (
              <MoviePosterCard key={m.id} movie={m} releaseMode cta={t.presalePage.bookNow} />
            ))}
      </div>
    </>
  );
}

function PosterSkeleton() {
  return (
    <div>
      <div className="aspect-[2/3] animate-pulse rounded-md bg-gm-bg-3" />
      <div className="mt-3 h-4 w-2/3 animate-pulse rounded bg-gm-bg-3" />
      <div className="mt-1.5 h-3 w-1/2 animate-pulse rounded bg-gm-bg-3" />
    </div>
  );
}
