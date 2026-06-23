"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  /** YouTube video ID (defaults to a generic cinematic trailer). */
  videoId?: string;
};

const YOUTUBE_ID_RE = /^[A-Za-z0-9_-]{11}$/;

export function TrailerModal({ open, onClose, title, videoId = "dQw4w9WgXcQ" }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const safeVideoId = YOUTUBE_ID_RE.test(videoId) ? videoId : "dQw4w9WgXcQ";

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${title} trailer`}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
      className="fixed inset-0 z-modal grid place-items-center bg-black/80 px-6 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-[960px] overflow-hidden rounded-2xl border border-gm-line bg-gm-bg-0 shadow-[0_30px_80px_rgba(0,0,0,.5)]">
        <div className="flex items-center justify-between border-b border-gm-line/60 px-5 py-3.5">
          <span className="text-sm font-semibold text-gm-tx-1">{title}</span>
          <button
            onClick={onClose}
            aria-label="Close trailer"
            className="grid h-9 w-9 place-items-center rounded-full text-gm-tx-2 transition-colors hover:bg-gm-bg-2 hover:text-gm-tx-1"
          >
            <X className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>
        <div className="relative aspect-video w-full bg-black">
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${safeVideoId}?autoplay=1&rel=0`}
            title={`${title} trailer`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
