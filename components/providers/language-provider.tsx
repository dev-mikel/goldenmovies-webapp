"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { DICT, DEFAULT_LANG, type Lang } from "@/lib/i18n";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (typeof DICT)[Lang];
  /** traduce un género del set cerrado */
  g: (genre: string) => string;
};

const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  // persistencia ligera (no afecta el SSR; default English en el server)
  useEffect(() => {
    const saved = window.localStorage.getItem("gm-lang");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- legitimate localStorage hydration after SSR
    if (saved === "en" || saved === "es") setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    window.localStorage.setItem("gm-lang", l);
    document.documentElement.lang = l;
  };

  const value: Ctx = {
    lang,
    setLang,
    t: DICT[lang],
    g: (genre) => DICT[lang].genres[genre] ?? genre,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useI18n must be used within LanguageProvider");
  return ctx;
}
