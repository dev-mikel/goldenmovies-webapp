"use client";

import { useEffect, useState } from "react";
import { Ticket, Wallet, Award, Shield, Lock, Loader2 } from "lucide-react";
import { useI18n } from "@/components/providers/language-provider";
import {
  fetchPurchases,
  fetchWallet,
  fetchAchievements,
  fetchClub,
} from "@/lib/api-client";
import { cn } from "@/lib/utils";

type Purchase = Awaited<ReturnType<typeof fetchPurchases>>[number];
type WalletData = Awaited<ReturnType<typeof fetchWallet>>;
type Achievement = Awaited<ReturnType<typeof fetchAchievements>>[number];
type ClubData = Awaited<ReturnType<typeof fetchClub>>;

export function PurchasesTab() {
  const { data, loading } = useFetch<Purchase[]>(fetchPurchases, []);
  if (loading) return <TabSkeleton />;
  return (
    <div className="overflow-hidden rounded-2xl border border-gm-line bg-gm-bg-2/60">
      {data.map((p, i) => (
        <div
          key={p.id}
          className={cn(
            "flex items-center gap-5 px-7 py-5",
            i > 0 && "border-t border-gm-line/40",
          )}
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gm-gold/10 text-gm-gold">
            <Ticket className="h-5 w-5" strokeWidth={1.7} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="font-semibold">{p.movie}</div>
            <div className="mt-0.5 text-xs text-gm-tx-3">
              {p.venue} · {p.format} · {p.date} · {p.seats}
            </div>
          </div>
          <span className="text-sm font-semibold text-gm-gold-1">{p.total}</span>
        </div>
      ))}
    </div>
  );
}

export function WalletTab() {
  const { t } = useI18n();
  const { data, loading } = useFetch<WalletData>(fetchWallet, {
    balance: "—",
    movements: [],
  });
  if (loading) return <TabSkeleton />;
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl border border-gm-gold/30 bg-gm-bg-2 p-7">
        <div
          className="absolute inset-0 opacity-40"
          style={{ background: "radial-gradient(80% 140% at 90% 10%,rgba(212,175,55,.35),transparent 65%)" }}
        />
        <div className="relative flex items-center gap-3 text-gm-tx-2">
          <Wallet className="h-5 w-5 text-gm-gold" strokeWidth={1.7} />
          <span className="text-sm">{t.profile.walletBalance}</span>
        </div>
        <div className="relative mt-3 font-display text-[44px] font-semibold text-gold-gradient">
          {data.balance}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gm-line bg-gm-bg-2/60">
        <div className="border-b border-gm-line/60 px-7 py-4 text-sm font-semibold text-gm-tx-2">
          {t.profile.walletMovements}
        </div>
        {data.movements.map((m, i) => (
          <div
            key={m.id}
            className={cn("flex items-center justify-between px-7 py-4", i > 0 && "border-t border-gm-line/40")}
          >
            <div>
              <div className="text-sm font-medium">{m.label}</div>
              <div className="mt-0.5 text-xs text-gm-tx-3">{m.date}</div>
            </div>
            <span
              className={cn(
                "text-sm font-semibold",
                m.amount.startsWith("+") ? "text-gm-gold-1" : "text-gm-tx-2",
              )}
            >
              {m.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AchievementsTab() {
  const { t, lang } = useI18n();
  const { data, loading } = useFetch<Achievement[]>(fetchAchievements, []);
  if (loading) return <TabSkeleton />;
  const unlocked = data.filter((a) => a.unlocked).length;
  return (
    <div>
      <p className="mb-5 text-sm text-gm-tx-3">
        {unlocked}/{data.length} {t.profile.achievementsUnlocked}
      </p>
      <div className="grid grid-cols-3 gap-4">
        {data.map((a) => (
          <div
            key={a.id}
            className={cn(
              "flex flex-col items-center gap-3 rounded-2xl border p-6 text-center transition-colors",
              a.unlocked
                ? "border-gm-gold/30 bg-gm-bg-2"
                : "border-gm-line bg-gm-bg-1 opacity-60",
            )}
          >
            <span
              className={cn(
                "grid h-14 w-14 place-items-center rounded-full",
                a.unlocked ? "bg-gold-gradient text-gm-gold-ink" : "bg-gm-bg-3 text-gm-tx-3",
              )}
            >
              {a.unlocked ? <Award className="h-6 w-6" strokeWidth={1.8} /> : <Lock className="h-5 w-5" strokeWidth={1.8} />}
            </span>
            <span className="text-sm font-medium">{lang === "es" ? a.es : a.en}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ClubTab() {
  const { t } = useI18n();
  const { data, loading } = useFetch<ClubData>(fetchClub, { tier: "—", points: 0 });
  if (loading) return <TabSkeleton />;
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gm-gold/30 bg-gm-bg-2 p-8">
      <div
        className="absolute inset-0 opacity-40"
        style={{ background: "radial-gradient(90% 160% at 85% 0%,rgba(212,175,55,.3),transparent 60%)" }}
      />
      <div className="relative flex items-center gap-3">
        <Shield className="h-7 w-7 text-gm-gold" strokeWidth={1.6} />
        <span className="font-display text-3xl font-semibold">GoldenMovies Club</span>
      </div>
      <div className="relative mt-7 grid grid-cols-2 gap-6">
        <Stat label={t.profile.clubTier} value={data.tier} />
        <Stat label={t.profile.clubPoints} value={data.points.toLocaleString()} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gm-line bg-gm-bg-3/60 px-5 py-4">
      <div className="text-xs uppercase tracking-eyebrow-md text-gm-tx-3">{label}</div>
      <div className="mt-1 font-display text-3xl font-semibold text-gold-gradient">{value}</div>
    </div>
  );
}

function TabSkeleton() {
  return (
    <div className="grid h-40 place-items-center rounded-2xl border border-gm-line bg-gm-bg-2/40">
      <Loader2 className="h-6 w-6 animate-spin text-gm-tx-3" />
    </div>
  );
}

function useFetch<T>(fn: () => Promise<T>, initial: T) {
  const [data, setData] = useState<T>(initial);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    fn()
      .then((d) => active && setData(d))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [fn]);
  return { data, loading };
}
