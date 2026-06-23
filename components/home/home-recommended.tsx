"use client";

import { MovieRail } from "./movie-rail";
import { RECOMMENDED } from "@/lib/mock-data";
import { useI18n } from "@/components/providers/language-provider";

export function HomeRecommended() {
  const { t } = useI18n();
  return <MovieRail title={t.home.recommended} titleAccent={t.home.forYou} movies={RECOMMENDED} />;
}
