import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MOVIES, getMovieBySlug, getShowtimes } from "@/lib/mock-data";
import { MovieDetail } from "@/components/movie/movie-detail";

// Pre-renders every movie page at build time (SSG): indexable & fast.
export function generateStaticParams() {
  return MOVIES.map((m) => ({ id: m.slug }));
}

// Metadata dinámica por película → SEO real.
export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await props.params;
  const movie = getMovieBySlug(id);
  if (!movie) return { title: "Not found — GoldenMovies" };
  return {
    title: `${movie.title} (${movie.year}) — GoldenMovies`,
    description: movie.synopsis,
    openGraph: {
      title: `${movie.title} — GoldenMovies`,
      description: movie.synopsis,
      type: "video.movie",
    },
  };
}

export default async function MoviePage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const movie = getMovieBySlug(id);
  if (!movie) notFound();

  const showtimes = getShowtimes(movie);
  return <MovieDetail movie={movie} showtimes={showtimes} />;
}
