"use client";

import { Shield, Sparkles, Check } from "lucide-react";
import { useI18n } from "@/components/providers/language-provider";
import { CLUB_TIERS } from "@/lib/mock-data";

export function ClubLanding() {
  const { t, lang } = useI18n();

  return (
    <>
      {/* Hero */}
      <section className="club-hero-bg relative mb-12 overflow-hidden rounded-[22px] border border-gm-gold/30">
        <div className="flex max-w-3xl flex-col gap-5 px-[60px] py-16">
          <span className="inline-flex items-center gap-2 self-start rounded-full border border-gm-gold/30 bg-gm-gold/10 px-3.5 py-1.5 text-[11px] uppercase tracking-eyebrow-lg text-gm-gold">
            <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
            Membership
          </span>
          <h1 className="font-display text-display-lg font-semibold">
            {t.club.title} <em className="not-italic text-gold-gradient">{t.club.titleAccent}</em>
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-gm-tx-2">
            {t.club.subtitle}
          </p>
          <button className="btn-gold mt-2 inline-flex h-12 items-center gap-2.5 self-start px-7 text-sm">
            <Shield className="h-[18px] w-[18px]" strokeWidth={2} />
            {t.club.join}
          </button>
        </div>
      </section>

      {/* Tiers */}
      <div className="grid grid-cols-3 gap-6">
        {CLUB_TIERS.map((tier) => (
          <article
            key={tier.id}
            className="relative overflow-hidden rounded-2xl border bg-gm-bg-2 p-7"
            style={{
              borderColor: `${tier.accent}33`,
              boxShadow: `inset 0 0 80px ${tier.accent}11`,
            }}
          >
            <div
              className="absolute inset-x-0 top-0 h-1"
              style={{ background: tier.accent }}
            />
            <div className="flex items-center justify-between">
              <h3 className="font-display text-[28px] font-semibold" style={{ color: tier.accent }}>
                {tier.name}
              </h3>
              <Shield className="h-6 w-6" strokeWidth={1.5} style={{ color: tier.accent }} />
            </div>
            <p className="mt-2 text-xs uppercase tracking-eyebrow-md text-gm-tx-3">
              {tier.pointsRequired.toLocaleString()} {t.club.points}
            </p>
            <p className="mt-5 font-display text-[34px] font-semibold leading-none" style={{ color: tier.accent }}>
              {tier.monthlyPriceUSD === 0
                ? t.club.free
                : <>${tier.monthlyPriceUSD.toFixed(2)}<span className="ml-1 text-sm font-normal text-gm-tx-3">{t.club.perMonth}</span></>}
            </p>
            <div className="mt-6">
              <p className="mb-3 text-[11px] uppercase tracking-eyebrow-md text-gm-tx-3">
                {t.club.benefitsTitle}
              </p>
              <ul className="space-y-3">
                {tier.benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gm-tx-1">
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0"
                      strokeWidth={2.2}
                      style={{ color: tier.accent }}
                    />
                    <span>{lang === "es" ? b.es : b.en}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
