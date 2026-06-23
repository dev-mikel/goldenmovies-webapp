"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useI18n } from "@/components/providers/language-provider";
import { PersonalDataForm } from "./personal-data-form";
import {
  PurchasesTab,
  WalletTab,
  AchievementsTab,
  ClubTab,
} from "./profile-tabs";
import { PROFILE_DEFAULTS } from "@/lib/profile-data";
import { cn } from "@/lib/utils";

type TabKey = "personal" | "purchases" | "wallet" | "achievements" | "club";

export function ProfileView() {
  const { t } = useI18n();
  const [tab, setTab] = useState<TabKey>("personal");

  const tabs: { key: TabKey; label: string }[] = [
    { key: "personal", label: t.profile.tabs.personal },
    { key: "purchases", label: t.profile.tabs.purchases },
    { key: "wallet", label: t.profile.tabs.wallet },
    { key: "achievements", label: t.profile.tabs.achievements },
    { key: "club", label: t.profile.tabs.club },
  ];

  // ID de miembro codificado en el QR (mock).
  const memberQR = `GOLDENMOVIES:${PROFILE_DEFAULTS.idPrefix}-${PROFILE_DEFAULTS.idNumber}`;

  return (
    <>
      {/* Header con QR */}
      <div className="mb-8 flex items-center gap-6">
        <div className="grid h-24 w-24 shrink-0 place-items-center rounded-2xl border border-gm-line bg-white p-2.5">
          <QRCodeSVG value={memberQR} size={72} bgColor="#ffffff" fgColor="#0d0d10" level="M" />
        </div>
        <div>
          <h1 className="font-display text-[40px] font-semibold leading-none">{t.profile.title}</h1>
          <p className="mt-2 text-sm text-gm-tx-2">
            {PROFILE_DEFAULTS.firstName} {PROFILE_DEFAULTS.lastName}
          </p>
          <p className="mt-0.5 text-xs uppercase tracking-eyebrow-md text-gm-tx-3">
            {t.profile.memberId}: {PROFILE_DEFAULTS.idPrefix}-{PROFILE_DEFAULTS.idNumber}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8 flex gap-1 border-b border-gm-line/60">
        {tabs.map((tb) => (
          <button
            key={tb.key}
            onClick={() => setTab(tb.key)}
            className={cn(
              "-mb-px border-b-2 px-4 pb-3.5 pt-1 text-[13.5px] font-semibold transition-colors",
              tab === tb.key
                ? "border-gm-gold text-gm-gold-1"
                : "border-transparent text-gm-tx-3 hover:text-gm-tx-1"
            )}
          >
            {tb.label}
          </button>
        ))}
      </div>

      {/* Panels */}
      {tab === "personal" && <PersonalDataForm />}
      {tab === "purchases" && <PurchasesTab />}
      {tab === "wallet" && <WalletTab />}
      {tab === "achievements" && <AchievementsTab />}
      {tab === "club" && <ClubTab />}
    </>
  );
}
