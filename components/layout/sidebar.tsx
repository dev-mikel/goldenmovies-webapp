"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu } from "lucide-react";
import { NAV_ITEMS } from "@/lib/mock-data";
import { useI18n } from "@/components/providers/language-provider";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useI18n();
  const discover = NAV_ITEMS.filter((i) => i.section === "discover");
  const account = NAV_ITEMS.filter((i) => i.section === "account");

  return (
    <aside
      className={cn(
        "group fixed inset-y-0 left-0 z-sidebar flex flex-col overflow-hidden",
        "w-[var(--side-w-collapsed)] hover:w-[var(--side-w)]",
        "border-r border-gm-line/50 bg-gm-bg-0",
        "transition-[width] duration-300 ease-[cubic-bezier(.4,0,.2,1)]"
      )}
    >
      {/* Menu button — alineado con la grilla de NavLink */}
      <div className="flex h-[var(--header-h)] shrink-0 items-center border-b border-gm-line/50 p-[14px]">
        <button
          type="button"
          className={cn(
            "flex h-[46px] w-full items-center gap-4 whitespace-nowrap rounded-md px-[15px]",
            "bg-gm-gold/10 text-gm-gold-1 transition-colors",
            "hover:bg-gm-gold/15",
          )}
        >
          <Menu className="h-5 w-5 shrink-0" strokeWidth={1.8} />
          <span className="text-sm font-semibold opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            {t.nav.menu}
          </span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-[3px] overflow-y-auto p-[14px]">
        <SectionLabel>{t.nav.discover}</SectionLabel>
        {discover.map((item) => (
          <NavLink key={item.href} item={item} label={t.nav[item.navKey]} active={pathname === item.href} />
        ))}
        <SectionLabel>{t.nav.account}</SectionLabel>
        {account.map((item) => (
          <NavLink key={item.href} item={item} label={t.nav[item.navKey]} active={pathname === item.href} />
        ))}
      </nav>

      {/* Footer */}
      <div className="shrink-0 border-t border-gm-line/50 p-[14px]">
        <button className="flex h-[46px] w-full items-center gap-4 whitespace-nowrap rounded-md px-[15px] text-gm-tx-2 transition-colors hover:bg-gm-bg-2 hover:text-gm-tx-1">
          <LogOut className="h-5 w-5 shrink-0" strokeWidth={1.6} />
          <span className="text-sm font-medium opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            {t.nav.logout}
          </span>
        </button>
      </div>
    </aside>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="whitespace-nowrap px-[14px] pb-1.5 pt-3.5 text-[10px] uppercase tracking-eyebrow-xl text-gm-tx-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
      {children}
    </div>
  );
}

function NavLink({
  item,
  label,
  active,
}: {
  item: (typeof NAV_ITEMS)[number];
  label: string;
  active: boolean;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={cn(
        "relative flex h-[46px] items-center gap-4 whitespace-nowrap rounded-md px-[15px] transition-colors",
        active
          ? "bg-gm-gold/10 text-gm-gold-1"
          : "text-gm-tx-2 hover:bg-gm-bg-2 hover:text-gm-tx-1"
      )}
    >
      {active && (
        <span className="absolute left-0 top-1/2 h-[22px] w-[3px] -translate-y-1/2 rounded-r-[3px] bg-gold-gradient" />
      )}
      <Icon className="h-5 w-5 shrink-0" strokeWidth={1.6} />
      <span className="text-sm font-medium opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        {label}
      </span>
    </Link>
  );
}
