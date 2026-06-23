/* ============================================================
   GoldenMovies — i18n (Fase 0/1)
   i18n ligero sin dependencias. Default: English.
   Los títulos de películas/géneros son data (mock) y no se
   traducen aquí salvo el set cerrado de géneros.
   ============================================================ */

export type Lang = "en" | "es";
export const DEFAULT_LANG: Lang = "en";

export const LANGS: { code: Lang; label: string; short: string }[] = [
  { code: "en", label: "English", short: "EN" },
  { code: "es", label: "Español", short: "ES" },
];

type Dict = {
  nav: {
    discover: string;
    account: string;
    menu: string;
    home: string;
    nowShowing: string;
    theaters: string;
    concessions: string;
    comingSoon: string;
    presale: string;
    profile: string;
    club: string;
    logout: string;
  };
  header: { city: string; search: string; language: string; date: string; today: string; tomorrow: string };
  hero: {
    tag: string;
    watchTrailer: string;
    buyTickets: string;
  };
  quick: {
    nowShowing: string;
    nowShowingDesc: string;
    concessions: string;
    concessionsDesc: string;
    presale: string;
    presaleDesc: string;
    club: string;
    clubDesc: string;
  };
  home: { recommended: string; forYou: string; seeAll: string };
  nowShowingPage: {
    title: string;
    subtitle: string;
    allFormats: string;
    allGenres: string;
    results: string;
    book: string;
    runtime: string;
  };
  detail: {
    back: string;
    synopsis: string;
    cast: string;
    director: string;
    showtimes: string;
    pickShowtime: string;
    trailer: string;
    book: string;
    upcomingNotice: string;
  };
  profile: {
    title: string;
    memberId: string;
    tabs: {
      personal: string;
      purchases: string;
      wallet: string;
      achievements: string;
      club: string;
    };
    personalSection: string;
    f: {
      firstName: string;
      lastName: string;
      email: string;
      dob: string;
      favoriteCity: string;
      idDoc: string;
      phone: string;
      currency: string;
      address: string;
      state: string;
      city: string;
      municipality: string;
      street: string;
      apt: string;
      genres: string;
    };
    ph: {
      selectState: string;
      selectCity: string;
      selectMunicipality: string;
      street: string;
      apt: string;
    };
    save: string;
    saving: string;
    saved: string;
    reset: string;
    err: {
      required: string;
      email: string;
      nameMin: string;
      dobInvalid: string;
      dobFuture: string;
      ageMin: string;
      idDigits: string;
      phoneDigits: string;
      saveFailed: string;
    };
    purchasesEmpty: string;
    walletBalance: string;
    walletMovements: string;
    achievementsUnlocked: string;
    clubTier: string;
    clubPoints: string;
  };
  seats: {
    back: string;
    title: string;
    titleAccent: string;
    screen: string;
    legend: {
      available: string;
      selected: string;
      occupied: string;
      vip: string;
      accessible: string;
    };
    yourSelection: string;
    none: string;
    max: string;
    perTicket: string;
    subtotal: string;
    fees: string;
    total: string;
    continue: string;
    confirmTitle: string;
    confirmNote: string;
    types: { standard: string; vip: string; accessible: string };
    audience: { label: string; adult: string; child: string; senior: string };
  };
  theatersPage: {
    title: string;
    titleAccent: string;
    subtitle: string;
    seeShowtimes: string;
    none: string;
  };
  concessionsPage: {
    title: string;
    titleAccent: string;
    subtitle: string;
    add: string;
    categories: {
      all: string;
      combo: string;
      popcorn: string;
      drink: string;
      candy: string;
    };
  };
  comingSoonPage: {
    title: string;
    titleAccent: string;
    subtitle: string;
    releaseDate: string;
    notify: string;
  };
  presalePage: {
    title: string;
    titleAccent: string;
    subtitle: string;
    bookNow: string;
    releaseDate: string;
  };
  club: {
    title: string;
    titleAccent: string;
    subtitle: string;
    join: string;
    points: string;
    benefitsTitle: string;
    perMonth: string;
    free: string;
  };
  search: {
    title: string;
    titleAccent: string;
    placeholder: string;
    resultsFor: string;
    movies: string;
    venues: string;
    none: string;
  };
  genres: Record<string, string>;
};

export const DICT: Record<Lang, Dict> = {
  en: {
    nav: {
      discover: "Discover",
      account: "My account",
      menu: "Menu",
      home: "Home",
      nowShowing: "Now showing",
      theaters: "Theaters",
      concessions: "Concessions",
      comingSoon: "Coming soon",
      presale: "Pre-sale",
      profile: "My profile",
      club: "GoldenMovies Club",
      logout: "Log out",
    },
    header: { city: "City", search: "Search movies, theaters…", language: "Language", date: "Date", today: "Today", tomorrow: "Tomorrow" },
    hero: { tag: "Featured release", watchTrailer: "Watch trailer", buyTickets: "Buy tickets" },
    quick: {
      nowShowing: "Now showing",
      nowShowingDesc: "What's on screen today",
      concessions: "Concessions",
      concessionsDesc: "Combos & snacks",
      presale: "Pre-sale",
      presaleDesc: "Secure your seat",
      club: "GoldenMovies Club",
      clubDesc: "Premium perks",
    },
    home: { recommended: "Recommended", forYou: "for you", seeAll: "See all" },
    nowShowingPage: {
      title: "Now",
      subtitle: "showing",
      allFormats: "All formats",
      allGenres: "All genres",
      results: "results",
      book: "Book",
      runtime: "min",
    },
    detail: {
      back: "Back",
      synopsis: "Synopsis",
      cast: "Cast",
      director: "Director",
      showtimes: "Showtimes",
      pickShowtime: "Pick a showtime to continue",
      trailer: "Watch trailer",
      book: "Book tickets",
      upcomingNotice: "This film is not yet in theaters. Showtimes will be available from the release date.",
    },
    profile: {
      title: "My profile",
      memberId: "Member ID",
      tabs: {
        personal: "Personal data",
        purchases: "My purchases",
        wallet: "My wallet",
        achievements: "My achievements",
        club: "GoldenMovies Club",
      },
      personalSection: "Personal data",
      f: {
        firstName: "First name",
        lastName: "Last name",
        email: "Email",
        dob: "Date of birth",
        favoriteCity: "Favorite city",
        idDoc: "ID document",
        phone: "Phone",
        currency: "Preferred currency",
        address: "Address",
        state: "State",
        city: "City",
        municipality: "Municipality",
        street: "Avenue / Street",
        apt: "House / Apartment",
        genres: "Preferred genres",
      },
      ph: {
        selectState: "Select a state",
        selectCity: "Select a city",
        selectMunicipality: "Select a municipality",
        street: "Avenue / Street",
        apt: "House / Apartment",
      },
      save: "Save changes",
      saving: "Saving…",
      saved: "Changes saved",
      reset: "Reset",
      err: {
        required: "This field is required",
        email: "Enter a valid email",
        nameMin: "Must be at least 2 characters",
        dobInvalid: "Enter a valid date",
        dobFuture: "Date can't be in the future",
        ageMin: "You must be at least 13 years old",
        idDigits: "Enter 6 to 9 digits",
        phoneDigits: "Enter exactly 7 digits",
        saveFailed: "Could not save changes. Try again.",
      },
      purchasesEmpty: "No purchases yet",
      walletBalance: "Balance",
      walletMovements: "Recent movements",
      achievementsUnlocked: "unlocked",
      clubTier: "Tier",
      clubPoints: "Points",
    },
    seats: {
      back: "Back to movie",
      title: "Select your",
      titleAccent: "seats",
      screen: "Screen",
      legend: {
        available: "Available",
        selected: "Selected",
        occupied: "Occupied",
        vip: "VIP",
        accessible: "Accessible",
      },
      yourSelection: "Your selection",
      none: "No seats selected yet",
      max: "Maximum 8 seats per order",
      perTicket: "per ticket",
      subtotal: "Subtotal",
      fees: "Service fee",
      total: "Total",
      continue: "Continue",
      confirmTitle: "Seats reserved (demo)",
      confirmNote:
        "This is where seat locks would be committed and checkout would begin. Payments are out of scope for this demo.",
      types: { standard: "Standard", vip: "VIP", accessible: "Accessible" },
      audience: { label: "Ticket type", adult: "Adult", child: "Child", senior: "Senior" },
    },
    theatersPage: {
      title: "Our",
      titleAccent: "theaters",
      subtitle: "Premium venues across the country",
      seeShowtimes: "See showtimes",
      none: "No theaters in this city yet",
    },
    concessionsPage: {
      title: "GoldenMovies",
      titleAccent: "concessions",
      subtitle: "Combos, popcorn and drinks crafted for the big screen",
      add: "Add",
      categories: {
        all: "All",
        combo: "Combos",
        popcorn: "Popcorn",
        drink: "Drinks",
        candy: "Candy",
      },
    },
    comingSoonPage: {
      title: "Coming",
      titleAccent: "soon",
      subtitle: "The next releases on GoldenMovies screens",
      releaseDate: "Opens",
      notify: "Notify me",
    },
    presalePage: {
      title: "Pre-sale",
      titleAccent: "tickets",
      subtitle: "Secure your seat before opening weekend",
      bookNow: "Book pre-sale",
      releaseDate: "Opens",
    },
    club: {
      title: "GoldenMovies",
      titleAccent: "Club",
      subtitle: "Earn points, unlock perks, live cinema differently",
      join: "Join the club",
      points: "points",
      benefitsTitle: "Benefits",
      perMonth: "/month",
      free: "Free",
    },
    search: {
      title: "Search",
      titleAccent: "results",
      placeholder: "Search movies, theaters, directors…",
      resultsFor: "Results for",
      movies: "Movies",
      venues: "Theaters",
      none: "No matches found",
    },
    genres: {
      Suspenso: "Thriller",
      Aventura: "Adventure",
      Acción: "Action",
      Comedia: "Comedy",
      "Sci-Fi": "Sci-Fi",
      Drama: "Drama",
      Musical: "Musical",
    },
  },
  es: {
    nav: {
      discover: "Descubrir",
      account: "Mi cuenta",
      menu: "Menú",
      home: "Inicio",
      nowShowing: "Cartelera",
      theaters: "Cines",
      concessions: "Caramelería",
      comingSoon: "Próximos estrenos",
      presale: "Preventa",
      profile: "Mi perfil",
      club: "GoldenMovies Club",
      logout: "Cerrar sesión",
    },
    header: { city: "Ciudad", search: "Buscar películas, sedes…", language: "Idioma", date: "Fecha", today: "Hoy", tomorrow: "Mañana" },
    hero: { tag: "Estreno destacado", watchTrailer: "Ver tráiler", buyTickets: "Comprar boletos" },
    quick: {
      nowShowing: "Cartelera",
      nowShowingDesc: "Lo que está en pantalla hoy",
      concessions: "Caramelería",
      concessionsDesc: "Combos y snacks",
      presale: "Preventa",
      presaleDesc: "Asegura tu butaca",
      club: "GoldenMovies Club",
      clubDesc: "Beneficios premium",
    },
    home: { recommended: "Recomendado", forYou: "para ti", seeAll: "Ver todo" },
    nowShowingPage: {
      title: "En",
      subtitle: "cartelera",
      allFormats: "Todos los formatos",
      allGenres: "Todos los géneros",
      results: "resultados",
      book: "Comprar",
      runtime: "min",
    },
    detail: {
      back: "Regresar",
      synopsis: "Sinopsis",
      cast: "Reparto",
      director: "Director",
      showtimes: "Funciones",
      pickShowtime: "Elige una función para continuar",
      trailer: "Ver tráiler",
      book: "Comprar boletos",
      upcomingNotice: "Esta película aún no está en cartelera. Las funciones estarán disponibles a partir de la fecha de estreno.",
    },
    profile: {
      title: "Mi perfil",
      memberId: "ID de miembro",
      tabs: {
        personal: "Datos personales",
        purchases: "Mis compras",
        wallet: "Mi wallet",
        achievements: "Mis logros",
        club: "GoldenMovies Club",
      },
      personalSection: "Datos personales",
      f: {
        firstName: "Nombre",
        lastName: "Apellido",
        email: "Correo electrónico",
        dob: "Fecha de nacimiento",
        favoriteCity: "Ciudad favorita",
        idDoc: "Cédula de identidad",
        phone: "Teléfono",
        currency: "Moneda de preferencia",
        address: "Dirección",
        state: "Estado",
        city: "Ciudad",
        municipality: "Municipio",
        street: "Avenida / Calle",
        apt: "Casa / Apartamento",
        genres: "Géneros preferidos",
      },
      ph: {
        selectState: "Seleccione un estado",
        selectCity: "Seleccione una ciudad",
        selectMunicipality: "Seleccione un municipio",
        street: "Avenida / Calle",
        apt: "Casa / Apartamento",
      },
      save: "Guardar cambios",
      saving: "Guardando…",
      saved: "Cambios guardados",
      reset: "Restablecer",
      err: {
        required: "Este campo es obligatorio",
        email: "Ingrese un correo válido",
        nameMin: "Debe tener al menos 2 caracteres",
        dobInvalid: "Ingrese una fecha válida",
        dobFuture: "La fecha no puede ser futura",
        ageMin: "Debe tener al menos 13 años",
        idDigits: "Ingrese de 6 a 9 dígitos",
        phoneDigits: "Ingrese exactamente 7 dígitos",
        saveFailed: "No se pudieron guardar los cambios. Intente de nuevo.",
      },
      purchasesEmpty: "Aún no tienes compras",
      walletBalance: "Saldo",
      walletMovements: "Movimientos recientes",
      achievementsUnlocked: "desbloqueados",
      clubTier: "Nivel",
      clubPoints: "Puntos",
    },
    seats: {
      back: "Volver a la película",
      title: "Elige tus",
      titleAccent: "asientos",
      screen: "Pantalla",
      legend: {
        available: "Disponible",
        selected: "Seleccionado",
        occupied: "Ocupado",
        vip: "VIP",
        accessible: "Accesible",
      },
      yourSelection: "Tu selección",
      none: "Aún no has elegido asientos",
      max: "Máximo 8 asientos por orden",
      perTicket: "por entrada",
      subtotal: "Subtotal",
      fees: "Cargo por servicio",
      total: "Total",
      continue: "Continuar",
      confirmTitle: "Asientos reservados (demo)",
      confirmNote:
        "Aquí se confirmarían los locks de asientos y empezaría el checkout. Los pagos están fuera del alcance de este demo.",
      types: { standard: "Estándar", vip: "VIP", accessible: "Accesible" },
      audience: { label: "Tipo de boleto", adult: "Adulto", child: "Niño", senior: "Adulto mayor" },
    },
    theatersPage: {
      title: "Nuestros",
      titleAccent: "cines",
      subtitle: "Sedes premium en todo el país",
      seeShowtimes: "Ver funciones",
      none: "Aún no hay sedes en esta ciudad",
    },
    concessionsPage: {
      title: "Caramelería",
      titleAccent: "GoldenMovies",
      subtitle: "Combos, cotufas y bebidas para tu experiencia en pantalla grande",
      add: "Añadir",
      categories: {
        all: "Todo",
        combo: "Combos",
        popcorn: "Cotufas",
        drink: "Bebidas",
        candy: "Dulces",
      },
    },
    comingSoonPage: {
      title: "Próximos",
      titleAccent: "estrenos",
      subtitle: "Lo que viene a las pantallas GoldenMovies",
      releaseDate: "Estrena",
      notify: "Avísame",
    },
    presalePage: {
      title: "Boletos en",
      titleAccent: "preventa",
      subtitle: "Asegura tu butaca antes del fin de semana de estreno",
      bookNow: "Comprar preventa",
      releaseDate: "Estrena",
    },
    club: {
      title: "GoldenMovies",
      titleAccent: "Club",
      subtitle: "Acumula puntos, desbloquea beneficios, vive el cine diferente",
      join: "Unirme al club",
      points: "puntos",
      benefitsTitle: "Beneficios",
      perMonth: "/mes",
      free: "Gratis",
    },
    search: {
      title: "Resultados de",
      titleAccent: "búsqueda",
      placeholder: "Buscar películas, sedes, directores…",
      resultsFor: "Resultados para",
      movies: "Películas",
      venues: "Sedes",
      none: "No se encontraron coincidencias",
    },
    genres: {
      Suspenso: "Suspenso",
      Aventura: "Aventura",
      Acción: "Acción",
      Comedia: "Comedia",
      "Sci-Fi": "Ciencia ficción",
      Drama: "Drama",
      Musical: "Musical",
    },
  },
};
