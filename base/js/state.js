export const URL_SERVIDOR = "https://servidor-proyecto-web-2.onrender.com";

// Base de datos local de respaldo / Mock DB (Garantiza resiliencia sin red)
export const MOCK_DB = {
  "daft punk": {
    artist: {
      id: 1,
      name: "Daft Punk",
      picture_medium:
        "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=200&auto=format&fit=crop",
      picture_big:
        "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=1200&auto=format&fit=crop",
      nb_fan: 3200000,
      bio: "Daft Punk fue un dúo de música electrónica francés formado en París en 1993 por Guy-Manuel de Homem-Christo y Thomas Bangalter. Revolucionaron el house francés y la música electrónica global utilizando sintetizadores, samplers y cascos de robot icónicos.",
    },
    albums: [
      {
        id: 101,
        title: "Discovery",
        cover_medium:
          "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&auto=format&fit=crop",
        release_date: "2001-03-12",
      },
      {
        id: 102,
        title: "Random Access Memories",
        cover_medium:
          "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=400&auto=format&fit=crop",
        release_date: "2013-05-17",
      },
    ],
    tracks: {
      101: [
        {
          id: 1011,
          title: "One More Time",
          duration: 320,
          preview:
            "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        },
        {
          id: 1012,
          title: "Aerodynamic",
          duration: 207,
          preview:
            "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        },
        {
          id: 1013,
          title: "Digital Love",
          duration: 298,
          preview:
            "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        },
      ],
      102: [
        {
          id: 1021,
          title: "Get Lucky (feat. Pharrell Williams)",
          duration: 249,
          preview:
            "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        },
        {
          id: 1022,
          title: "Instant Crush (feat. Julian Casablancas)",
          duration: 337,
          preview:
            "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
        },
      ],
    },
    genres: ["Electronic", "Dance"],
  },
  queen: {
    artist: {
      id: 2,
      name: "Queen",
      picture_medium:
        "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=200&auto=format&fit=crop",
      picture_big:
        "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=1200&auto=format&fit=crop",
      nb_fan: 12500000,
      bio: "Queen es una legendaria banda británica de rock formada en Londres en 1970 por Freddie Mercury, Brian May, Roger Taylor y John Deacon. Sus armonías vocales, solos orquestales de guitarra y himnos operísticos los volvieron inmortales.",
    },
    albums: [
      {
        id: 201,
        title: "A Night at the Opera",
        cover_medium:
          "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400&auto=format&fit=crop",
        release_date: "1975-11-21",
      },
      {
        id: 202,
        title: "News of the World",
        cover_medium:
          "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=400&auto=format&fit=crop",
        release_date: "1977-10-28",
      },
    ],
    tracks: {
      201: [
        {
          id: 2011,
          title: "Bohemian Rhapsody",
          duration: 355,
          preview:
            "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
        },
        {
          id: 2012,
          title: "Love of My Life",
          duration: 217,
          preview:
            "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
        },
      ],
      202: [
        {
          id: 2021,
          title: "We Will Rock You",
          duration: 121,
          preview:
            "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
        },
        {
          id: 2022,
          title: "We Are the Champions",
          duration: 179,
          preview:
            "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
        },
      ],
    },
    genres: ["Rock", "Classic"],
  },
  coldplay: {
    artist: {
      id: 3,
      name: "Coldplay",
      picture_medium:
        "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=200&auto=format&fit=crop",
      picture_big:
        "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1200&auto=format&fit=crop",
      nb_fan: 9600000,
      bio: "Coldplay es una banda de pop rock británica formada en Londres en 1996. Compuesta por Chris Martin, Jonny Buckland, Guy Berryman y Will Champion, sus espectáculos interactivos de luces y baladas los convirtieron en gigantes de estadios.",
    },
    albums: [
      {
        id: 301,
        title: "A Rush of Blood to the Head",
        cover_medium:
          "https://images.unsplash.com/photo-1487180142328-0c4e37023af5?q=80&w=400&auto=format&fit=crop",
        release_date: "2002-08-26",
      },
      {
        id: 302,
        title: "Parachutes",
        cover_medium:
          "https://images.unsplash.com/photo-1446057032654-9d8885b7a3f3?q=80&w=400&auto=format&fit=crop",
        release_date: "2000-07-10",
      },
    ],
    tracks: {
      301: [
        {
          id: 3011,
          title: "The Scientist",
          duration: 309,
          preview:
            "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
        },
        {
          id: 3012,
          title: "Clocks",
          duration: 307,
          preview:
            "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3",
        },
      ],
      302: [
        {
          id: 3021,
          title: "Yellow",
          duration: 269,
          preview:
            "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
        },
      ],
    },
    genres: ["Rock", "Pop", "Alternative"],
  },
  eminem: {
    artist: {
      id: 4,
      name: "Eminem",
      picture_medium:
        "https://images.unsplash.com/photo-1487180142328-0c4e37023af5?q=80&w=200&auto=format&fit=crop",
      picture_big:
        "https://images.unsplash.com/photo-1487180142328-0c4e37023af5?q=80&w=1200&auto=format&fit=crop",
      nb_fan: 15300000,
      bio: "Eminem, alter ego de Marshall Mathers, es una de las figuras más influyentes del hip hop internacional. Aclamado por su destreza lírica de alta velocidad y sus narrativas introspectivas y controversiales.",
    },
    albums: [
      {
        id: 401,
        title: "The Marshall Mathers LP",
        cover_medium:
          "https://images.unsplash.com/photo-1446057032654-9d8885b7a3f3?q=80&w=400&auto=format&fit=crop",
        release_date: "2000-05-23",
      },
    ],
    tracks: {
      401: [
        {
          id: 4011,
          title: "The Real Slim Shady",
          duration: 284,
          preview:
            "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3",
        },
        {
          id: 4012,
          title: "Stan",
          duration: 404,
          preview:
            "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3",
        },
      ],
    },
    genres: ["Hip Hop", "Rap"],
  },
};

export const CATEGORIES_DB = [
  {
    id: "electronic",
    name: "Electronic",
    icon: "fa-bolt",
    description: "Bajos y Sintetizadores",
  },
  {
    id: "rock",
    name: "Rock",
    icon: "fa-guitar",
    description: "Guitarras y Leyendas",
  },
  {
    id: "pop",
    name: "Pop",
    icon: "fa-microphone",
    description: "Éxitos Globales",
  },
  {
    id: "rap",
    name: "Rap",
    icon: "fa-headphones",
    description: "Frases y Beats",
  },
];

// Estado de sesión y control reactivo global de la aplicación (Módulo 3 integrado)
export let state = {
  currentUser: null,
  currentView: "explore",
  offlineQueue: [],
  currentArtist: null,
  favorites: [], // Colección privada de álbumes favoritos
  ratings: {}, // Almacenamiento local de calificaciones { albumId: estrellas_1_5 }
  currentPlayingTrack: null, // Objeto { track, album }
  isPlaying: false,
  volume: 0.7,
  searchHistory: [],
  showAllCategories: false,
  showAllArtists: false,
  ratingFilter: 0, // 0 significa mostrar todos los favoritos, 1-5 filtra exactamente
};

export const audioEl = document.getElementById("native-audio");
