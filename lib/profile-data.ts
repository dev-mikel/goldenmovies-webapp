/* ============================================================
   GoldenMovies — Local data (Phase 2)
   Venezuelan geography for cascading address selectors (demo subset),
   ID and phone prefixes, currencies, preferred genres, and profile mocks.
   ============================================================ */

export const ID_PREFIXES = ["V", "E", "J", "P"] as const;
export const PHONE_PREFIXES = ["0412", "0414", "0416", "0424", "0426"] as const;

export const CURRENCIES = [
  { code: "USD", label: "US Dollar ($)" },
  { code: "VES", label: "Bolívares (Bs.)" },
  { code: "EUR", label: "Euro (€)" },
] as const;

/** Subset of Venezuelan geography used to drive the cascading address selectors. */
export const VE_GEO: {
  state: string;
  cities: { city: string; municipalities: string[] }[];
}[] = [
  {
    state: "Distrito Capital",
    cities: [{ city: "Caracas", municipalities: ["Libertador"] }],
  },
  {
    state: "Miranda",
    cities: [
      { city: "Caracas (Este)", municipalities: ["Chacao", "Baruta", "Sucre", "El Hatillo"] },
      { city: "Los Teques", municipalities: ["Guaicaipuro"] },
    ],
  },
  {
    state: "Carabobo",
    cities: [
      { city: "Valencia", municipalities: ["Valencia", "Naguanagua", "San Diego"] },
      { city: "Puerto Cabello", municipalities: ["Puerto Cabello"] },
    ],
  },
  {
    state: "Zulia",
    cities: [{ city: "Maracaibo", municipalities: ["Maracaibo", "San Francisco"] }],
  },
  {
    state: "Lara",
    cities: [{ city: "Barquisimeto", municipalities: ["Iribarren", "Palavecino"] }],
  },
];

/** Preferred genres for the profile form (broader set than the now-showing catalog). */
export const PREF_GENRES: { id: string; en: string; es: string }[] = [
  { id: "musical", en: "Musical", es: "Musical" },
  { id: "biography", en: "Biography", es: "Biografía" },
  { id: "sports", en: "Sports", es: "Deportivo" },
  { id: "alt", en: "Alternative content", es: "Contenido alternativo" },
  { id: "theater", en: "Theater", es: "Teatro" },
  { id: "action", en: "Action", es: "Acción" },
  { id: "adventure", en: "Adventure", es: "Aventura" },
  { id: "comedy", en: "Comedy", es: "Comedia" },
  { id: "animated", en: "Animated", es: "Animada" },
  { id: "documentary", en: "Documentary", es: "Documental" },
  { id: "drama", en: "Drama", es: "Drama" },
  { id: "thriller", en: "Thriller", es: "Suspenso" },
  { id: "horror", en: "Horror", es: "Terror" },
  { id: "historical", en: "Historical", es: "Histórica" },
];

/** Default values for the profile form (mock logged-in user). */
export const PROFILE_DEFAULTS = {
  firstName: "Carlos",
  lastName: "Mendoza",
  email: "carlos.mendoza@example.com",
  dob: "1990-08-24",
  favoriteCity: "Caracas",
  idPrefix: "V" as (typeof ID_PREFIXES)[number],
  idNumber: "15847362",
  phonePrefix: "0414" as (typeof PHONE_PREFIXES)[number],
  phoneNumber: "5234781",
  currency: "VES",
  state: "",
  city: "",
  municipality: "",
  street: "",
  apt: "",
  genres: ["action"] as string[],
};

/* ── Mock data for the secondary profile tabs ── */
export const PURCHASES = [
  { id: "o1", movie: "Oppenheimer", venue: "Tolón", date: "2026-05-22", seats: "F7, F8", total: "Bs. 480,00", format: "IMAX" },
  { id: "o2", movie: "Inside Out 2", venue: "Millennium", date: "2026-05-10", seats: "C4", total: "Bs. 210,00", format: "Dolby 3D" },
  { id: "o3", movie: "Dune: Part Two", venue: "Sambil Caracas", date: "2026-04-28", seats: "H12, H13", total: "Bs. 360,00", format: "Dolby Digital" },
];

export const WALLET = {
  balance: "Bs. 1.250,00",
  movements: [
    { id: "w1", label: "Top-up", date: "2026-05-20", amount: "+ Bs. 1.000,00" },
    { id: "w2", label: "Oppenheimer — tickets", date: "2026-05-22", amount: "- Bs. 480,00" },
    { id: "w3", label: "Concessions — combo", date: "2026-05-22", amount: "- Bs. 120,00" },
  ],
};

export const ACHIEVEMENTS = [
  { id: "a1", en: "First ticket", es: "Primer boleto", unlocked: true },
  { id: "a2", en: "Weekend regular", es: "Habitual de finde", unlocked: true },
  { id: "a3", en: "Premium formats", es: "Formatos premium", unlocked: true },
  { id: "a4", en: "Marathon (3 in a day)", es: "Maratón (3 en un día)", unlocked: false },
  { id: "a5", en: "Critic (10 reviews)", es: "Crítico (10 reseñas)", unlocked: false },
  { id: "a6", en: "Gold member", es: "Miembro Gold", unlocked: false },
];

export const CLUB = { tier: "Gold", points: 2480 };
