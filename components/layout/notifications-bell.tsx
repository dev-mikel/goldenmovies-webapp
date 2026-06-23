"use client";

import { Bell, Ticket, Sparkles, Clock } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n } from "@/components/providers/language-provider";

type Notification = {
  id: string;
  icon: "ticket" | "spark" | "clock";
  title: { en: string; es: string };
  body: { en: string; es: string };
  at: string;
};

const NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    icon: "ticket",
    title: { en: "Your order is confirmed", es: "Tu orden está confirmada" },
    body: {
      en: "Golden Fury · Líder · Sat 8:15 PM · F7, F8",
      es: "Golden Fury · Líder · sáb 8:15 PM · F7, F8",
    },
    at: "2h",
  },
  {
    id: "n2",
    icon: "spark",
    title: { en: "New release available", es: "Nuevo estreno disponible" },
    body: {
      en: "Echoes of Tomorrow opens July 22 — pre-sale now",
      es: "Echoes of Tomorrow estrena el 22 de julio — preventa abierta",
    },
    at: "1d",
  },
  {
    id: "n3",
    icon: "clock",
    title: { en: "2x1 Tuesdays this week", es: "2x1 los martes esta semana" },
    body: {
      en: "Bring a friend at no extra cost on standard formats",
      es: "Trae a un amigo sin costo extra en formatos estándar",
    },
    at: "3d",
  },
];

const IconMap = {
  ticket: Ticket,
  spark: Sparkles,
  clock: Clock,
};

export function NotificationsBell() {
  const { lang } = useI18n();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Notifications"
          className="relative grid h-10 w-10 place-items-center rounded-full border border-gm-line bg-gm-bg-2 text-gm-tx-2 transition-colors hover:border-[#33333d] hover:bg-gm-bg-3 hover:text-gm-tx-1"
        >
          <span className="absolute right-[9px] top-2 h-[7px] w-[7px] rounded-full bg-gm-gold shadow-[0_0_0_2px_var(--gm-bg-2)]" />
          <Bell className="h-[18px] w-[18px]" strokeWidth={1.7} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[340px] border-gm-line bg-gm-bg-2 p-0"
      >
        <div className="border-b border-gm-line/60 px-4 py-3 text-[13px] font-semibold text-gm-tx-1">
          {lang === "es" ? "Notificaciones" : "Notifications"}
        </div>
        <ul className="max-h-[420px] overflow-y-auto">
          {NOTIFICATIONS.map((n) => {
            const Icon = IconMap[n.icon];
            return (
              <li
                key={n.id}
                className="flex gap-3 border-b border-gm-line/40 px-4 py-3 last:border-b-0 hover:bg-gm-bg-3/50"
              >
                <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gm-gold/10 text-gm-gold">
                  <Icon className="h-4 w-4" strokeWidth={1.8} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[13px] font-semibold text-gm-tx-1">
                      {n.title[lang]}
                    </p>
                    <span className="shrink-0 text-[11px] text-gm-tx-3">
                      {n.at}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs leading-relaxed text-gm-tx-3">
                    {n.body[lang]}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
