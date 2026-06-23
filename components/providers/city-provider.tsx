"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { CITIES, USER, type City } from "@/lib/mock-data";

type Ctx = {
  city: City;
  setCity: (c: City) => void;
  cities: readonly City[];
};

const CityContext = createContext<Ctx | null>(null);

export function CityProvider({ children }: { children: React.ReactNode }) {
  const [city, setCityState] = useState<City>(USER.city);

  useEffect(() => {
    const saved = window.localStorage.getItem("gm-city");
    if (saved !== null && (CITIES as readonly string[]).includes(saved)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage hydration after SSR
      setCityState(saved as City);
    }
  }, []);

  const setCity = (c: City) => {
    setCityState(c);
    window.localStorage.setItem("gm-city", c);
  };

  return (
    <CityContext.Provider value={{ city, setCity, cities: CITIES }}>
      {children}
    </CityContext.Provider>
  );
}

export function useCity() {
  const ctx = useContext(CityContext);
  if (!ctx) throw new Error("useCity must be used within CityProvider");
  return ctx;
}
