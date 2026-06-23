import { Suspense } from "react";
import { NowShowingGrid } from "@/components/now-showing/now-showing-grid";

export const metadata = {
  title: "Now Showing — GoldenMovies",
  description: "Browse every film currently on screen at GoldenMovies.",
};

export default function NowShowingPage() {
  return (
    <Suspense
      fallback={
        <div className="grid h-[60vh] place-items-center text-gm-tx-3">…</div>
      }
    >
      <NowShowingGrid />
    </Suspense>
  );
}
