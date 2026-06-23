"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type CurrencyCode = "USD" | "VES" | "EUR";

type CurrencyInfo = {
  code: CurrencyCode;
  symbol: string;
  /** Cuántas unidades equivalen a 1 USD (tasa mock). */
  rate: number;
  /** Localización de formato. */
  locale: string;
};

const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  USD: { code: "USD", symbol: "$", rate: 1, locale: "en-US" },
  VES: { code: "VES", symbol: "Bs.", rate: 36, locale: "es-VE" },
  EUR: { code: "EUR", symbol: "€", rate: 0.92, locale: "es-ES" },
};

type Ctx = {
  currency: CurrencyInfo;
  setCurrency: (code: CurrencyCode) => void;
  /** Convierte un valor en USD a la moneda activa y lo formatea con su símbolo. */
  format: (usd: number) => string;
};

const CurrencyContext = createContext<Ctx | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [code, setCode] = useState<CurrencyCode>("USD");

  useEffect(() => {
    const saved = window.localStorage.getItem("gm-currency");
    if (saved === "USD" || saved === "VES" || saved === "EUR") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage hydration after SSR
      setCode(saved);
    }
  }, []);

  const setCurrency = (c: CurrencyCode) => {
    setCode(c);
    window.localStorage.setItem("gm-currency", c);
  };

  const currency = CURRENCIES[code];

  const format = (usd: number) => {
    const value = usd * currency.rate;
    if (currency.code === "VES") {
      return `${currency.symbol} ${value.toLocaleString("es-VE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    }
    return `${currency.symbol}${value.toLocaleString(currency.locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, format }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}
