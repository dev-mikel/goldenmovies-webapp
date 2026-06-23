"use client";

import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { LanguageProvider } from "@/components/providers/language-provider";
import { CityProvider } from "@/components/providers/city-provider";
import { CurrencyProvider } from "@/components/providers/currency-provider";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <CityProvider>
        <CurrencyProvider>
          <div className="flex min-h-screen bg-gm-bg-1">
            <Sidebar />
            <div className="ml-[var(--side-w-collapsed)] flex min-w-0 flex-1 flex-col">
              <Header />
              <main className="w-full px-10 pb-16 pt-8">{children}</main>
            </div>
          </div>
        </CurrencyProvider>
      </CityProvider>
    </LanguageProvider>
  );
}
