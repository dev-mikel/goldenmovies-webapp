import { SearchResults } from "@/components/search/search-results";

export const metadata = { title: "Search — GoldenMovies" };

export default async function SearchPage(props: {
  searchParams: Promise<{ q?: string }>;
}) {
  const sp = await props.searchParams;
  const q = sp.q?.trim() ?? "";
  return <SearchResults initialQuery={q} />;
}
