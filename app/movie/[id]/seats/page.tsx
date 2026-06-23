import { notFound } from "next/navigation";
import { getMovieBySlug, getShowtimes } from "@/lib/mock-data";
import { SeatSelection } from "@/components/seats/seat-selection";

export const metadata = { title: "Select seats — GoldenMovies" };

export default async function SeatsPage(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ v?: string; f?: string; t?: string }>;
}) {
  const { id } = await props.params;
  const sp = await props.searchParams;
  const movie = getMovieBySlug(id);
  if (!movie) notFound();

  // Showtime params come via query (?v=venue&f=format&t=time) or fall back to the first entry.
  // Values are validated against actual catalog entries.
  const groups = getShowtimes(movie);
  const first = groups[0];
  const firstEntry = first.entries[0];
  const validVenues  = new Set(groups.map((g) => g.venue));
  const validTimes   = new Set(groups.flatMap((g) => g.entries.map((e) => e.time)));
  const validFormats = new Set<string>(["IMAX", "DOLBY", "DOLBY3D"]);
  const venue  = sp.v && validVenues.has(sp.v)   ? sp.v   : first.venue;
  const format = sp.f && validFormats.has(sp.f)  ? sp.f   : firstEntry.format;
  const time   = sp.t && validTimes.has(sp.t)    ? sp.t   : firstEntry.time;

  return (
    <SeatSelection
      movieSlug={movie.slug}
      movieTitle={movie.title}
      venue={venue}
      format={format}
      time={time}
    />
  );
}
