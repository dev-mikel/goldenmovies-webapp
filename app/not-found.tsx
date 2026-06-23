import Link from "next/link";
import { Home, Clapperboard } from "lucide-react";

export default function NotFound() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="max-w-md text-center">
        <p className="mb-3 text-xs uppercase tracking-[0.22em] text-gm-gold-1">
          Error 404
        </p>
        <h1 className="font-display text-[80px] font-semibold leading-none text-gold-gradient">
          Lost reel
        </h1>
        <p className="mt-5 text-sm leading-relaxed text-gm-tx-2">
          The page you&apos;re looking for has rolled off the projector. It may
          have moved or never existed.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-gold-gradient px-5 text-sm font-semibold text-gm-gold-ink shadow-brand transition-transform hover:-translate-y-0.5"
          >
            <Home className="h-4 w-4" strokeWidth={2} />
            Back home
          </Link>
          <Link
            href="/now-showing"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-gm-line bg-white/5 px-5 text-sm font-semibold text-gm-tx-1 transition-colors hover:border-gm-gold/30"
          >
            <Clapperboard className="h-4 w-4" strokeWidth={2} />
            See now showing
          </Link>
        </div>
      </div>
    </div>
  );
}
