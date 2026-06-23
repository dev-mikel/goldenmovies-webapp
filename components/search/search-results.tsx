"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search as SearchIcon, MapPin } from "lucide-react";
import { useI18n } from "@/components/providers/language-provider";
import { searchAll } from "@/lib/api-client";
import { MoviePosterCard } from "@/components/movies/movie-poster-card";
import type { Movie, Venue } from "@/lib/mock-data";

export function SearchResults({ initialQuery }: { initialQuery: string }) {
  const { t } = useI18n();
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<{ movies: Movie[]; venues: Venue[] }>({
    movies: [],
    venues: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- clear results when query empties
      setResults({ movies: [], venues: [] });
      return;
    }
    let active = true;
    setLoading(true);
    searchAll(query)
      .then((data) => {
        if (!active) return;
        setResults({ movies: data.movies, venues: data.venues });
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [query]);

  const noResults =
    !loading && query && results.movies.length === 0 && results.venues.length === 0;

  return (
    <>
      <div className="mb-3 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-gm-gold/10 text-gm-gold">
          <SearchIcon className="h-5 w-5" strokeWidth={1.7} />
        </span>
        <h1 className="font-display text-[42px] font-semibold leading-none">
          {t.search.title} <span className="text-gold-gradient">{t.search.titleAccent}</span>
        </h1>
      </div>

      <label className="mb-10 mt-6 flex h-12 w-full max-w-[640px] items-center gap-3 rounded-full border border-gm-line bg-gm-bg-2 px-5 focus-within:border-gm-gold/30">
        <SearchIcon className="h-5 w-5 shrink-0 text-gm-tx-3" strokeWidth={1.7} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.search.placeholder}
          className="w-full bg-transparent text-sm text-gm-tx-1 outline-hidden placeholder:text-gm-tx-3"
          autoFocus
        />
      </label>

      {query && (
        <p className="mb-8 text-sm text-gm-tx-2">
          {t.search.resultsFor}{" "}
          <span className="font-semibold text-gm-gold-1">&ldquo;{query}&rdquo;</span>
        </p>
      )}

      {results.movies.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-5 font-display text-[26px] font-semibold">{t.search.movies}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-[18px]">
            {results.movies.map((m) => (
              <MoviePosterCard key={m.id} movie={m} />
            ))}
          </div>
        </section>
      )}

      {results.venues.length > 0 && (
        <section>
          <h2 className="mb-5 font-display text-[26px] font-semibold">{t.search.venues}</h2>
          <div className="grid grid-cols-3 gap-6">
            {results.venues.map((v) => (
              <Link
                key={v.id}
                href={`/now-showing?venue=${v.id}`}
                className="group/v overflow-hidden rounded-2xl border border-gm-line bg-gm-bg-2 transition-[border-color,transform] duration-200 hover:-translate-y-1 hover:border-gm-gold/30"
              >
                <div className="relative h-[150px] w-full overflow-hidden">
                  <Image
                    src={v.photo}
                    alt={v.name}
                    fill
                    sizes="(max-width:768px) 100vw, 33vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 veil-b-tall" />
                </div>
                <div className="px-5 pb-5 pt-4">
                  <h3 className="font-display text-[20px] font-semibold leading-tight">
                    {v.name}
                  </h3>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-gm-tx-3">
                    <MapPin className="h-3 w-3" strokeWidth={1.7} />
                    {v.city}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {noResults && (
        <div className="grid h-[260px] place-items-center rounded-2xl border border-gm-line bg-gm-bg-2/40 text-gm-tx-3">
          {t.search.none}
        </div>
      )}
    </>
  );
}
