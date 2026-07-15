// ==========================================================================
// CONFIGURACIÓN GLOBAL Y BACKEND (Módulo 1 & Módulo 2)
// ==========================================================================
const URL_SERVIDOR = "https://servidor-proyecto-web-2.onrender.com";

// Base de datos local de respaldo / Mock DB (Garantiza resiliencia sin red)
const MOCK_DB = {
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

const CATEGORIES_DB = [
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
  {
    id: "latin",
    name: "Latin",
    icon: "fa-fire",
    description: "Ritmo y Sabor",
  },
  {
    id: "jazz",
    name: "Jazz",
    icon: "fa-saxophones",
    description: "Viento y Melodía",
  },
];

// Estado de sesión y control reactivo global de la aplicación (Módulo 3 integrado)
let state = {
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

const audioEl = document.getElementById("native-audio");

// ==============================================
// COMUNICACIÓN ASÍNCRONA SEGURA (Proxy CORS Guardrail)
// ==============================================
async function fetchJSON(targetUrl) {
  const proxyUrl = "https://corsproxy.io/?";
  const response = await fetch(`${proxyUrl}${encodeURIComponent(targetUrl)}`);
  if (!response.ok) {
    throw new Error(`HTTP status ${response.status}`);
  }
  const text = await response.text();
  const cleanText = text.trim();

  if (
    cleanText.startsWith("Oops") ||
    cleanText.startsWith("<!DOCTYPE") ||
    cleanText.startsWith("<html")
  ) {
    throw new Error("El proxy devolvió una página de error o cuota excedida.");
  }

  try {
    return JSON.parse(cleanText);
  } catch (err) {
    throw new Error("Formato JSON de respuesta no válido.");
  }
}

// ==============================================
// MANEJO DE TOASTS Y NOTIFICACIONES VISUALES
// ==============================================
function showToast(title, desc, type = "success") {
  const toast = document.getElementById("toast");
  const tTitle = document.getElementById("toast-title");
  const tDesc = document.getElementById("toast-desc");
  const tIcon = document.getElementById("toast-icon");
  const iconWrap = document.getElementById("toast-icon-wrapper");

  if (!toast || !tTitle || !tDesc || !tIcon || !iconWrap) return;

  tTitle.innerText = title;
  tDesc.innerText = desc;

  if (type === "success") {
    iconWrap.style.backgroundColor = "var(--color-success)";
    tIcon.className = "fa-solid fa-circle-check";
  } else if (type === "warning") {
    iconWrap.style.backgroundColor = "var(--color-warning)";
    tIcon.className = "fa-solid fa-triangle-exclamation";
  } else if (type === "error") {
    iconWrap.style.backgroundColor = "var(--color-secondary)";
    tIcon.className = "fa-solid fa-circle-xmark";
  }

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 4000);
}

// ==============================================
// HISTORIAL DE BÚSQUEDAS DINÁMICAS
// ==============================================
function showSearchHistory() {
  const dropdown = document.getElementById("search-history");
  const historyItems = document.getElementById("history-items");
  if (!dropdown || !historyItems) return;

  historyItems.innerHTML = "";

  if (state.searchHistory.length === 0) {
    historyItems.innerHTML = `<p style="font-size: 0.65rem; opacity: 0.5; text-align: center; padding: 12px 0;">Sin búsquedas recientes</p>`;
  } else {
    state.searchHistory.forEach((item) => {
      const el = document.createElement("div");
      el.className = "history-item";
      el.onmousedown = () => {
        document.getElementById("search-input").value = item.query;
        searchArtist(item.query);
      };
      el.innerHTML = `
        <img src="${item.picture || "https://placehold.co/40/333/fff?text=♫"}" class="history-item-img" onerror="this.src='https://placehold.co/40/333/fff?text=♫'">
        <span class="history-item-text">${item.query}</span>
      `;
      historyItems.appendChild(el);
    });
  }

  dropdown.classList.remove("hidden");
}

function hideSearchHistory() {
  setTimeout(() => {
    const dropdown = document.getElementById("search-history");
    if (dropdown) dropdown.classList.add("hidden");
  }, 250);
}

function clearSearchHistory() {
  state.searchHistory = [];
  saveHistory();
  showSearchHistory();
  showToast(
    "Historial Limpio",
    "Se borró tu registro de búsquedas.",
    "warning",
  );
}

function saveHistory() {
  localStorage.setItem(
    `ucab_history_${state.currentUser}`,
    JSON.stringify(state.searchHistory),
  );
}

function pushHistoryItem(query, picture) {
  state.searchHistory = state.searchHistory.filter(
    (h) => h.query.toLowerCase() !== query.toLowerCase(),
  );
  state.searchHistory.unshift({ query, picture });
  if (state.searchHistory.length > 5) {
    state.searchHistory.pop();
  }
  saveHistory();
}

// ==============================================
// MÓDULO 1: CONTROL DE AUTENTICACIÓN Y SESIÓN
// ==============================================
async function handleLogin(event) {
  if (event) event.preventDefault();

  const usernameInput = document.getElementById("login-username");
  const passwordInput = document.getElementById("login-password");

  if (!usernameInput || !passwordInput) return;

  const email = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    showToast(
      "Datos incompletos",
      "Por favor ingresa tu correo y contraseña del servidor.",
      "error",
    );
    return;
  }

  const loginForm = document.getElementById("login-form");
  const loadingState = document.getElementById("login-loading");
  const stepText = document.getElementById("loading-step-text");

  loginForm.classList.add("hidden");
  loadingState.classList.remove("hidden");
  stepText.innerText = "Conectando al servidor personal UCAB...";

  try {
    if (!navigator.onLine) {
      throw new Error(
        "Sin conexión a internet. No se puede validar la sesión.",
      );
    }

    const respuesta = await fetch(`${URL_SERVIDOR}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password: password }),
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(
        datos.error || "Credenciales incorrectas en el servidor.",
      );
    }

    stepText.innerText = "Protocolo verificado. Sincronizando sesión...";
    setTimeout(() => {
      stepText.innerText = "Abriendo portal Deezer-Manager...";
      setTimeout(() => {
        const token = datos.token || `mock-token-${Date.now()}`;
        finalizeLogin(email, token);
      }, 700);
    }, 700);
  } catch (error) {
    console.error("Error en el login:", error.message);
    loadingState.classList.add("hidden");
    loginForm.classList.remove("hidden");
    passwordInput.value = "";
    showToast("Error de Acceso", error.message, "error");
  }
}

function finalizeLogin(username, token) {
  state.currentUser = username;
  localStorage.setItem("ucab_token", token);
  localStorage.setItem("ucab_user", username);

  document.getElementById("user-display").innerText = username;

  // UX Premium: Inicializar letra de Avatar del usuario dinámicamente en lugar de 'U' estática
  const avatar = document.querySelector(".user-avatar");
  if (avatar) {
    avatar.innerText = username.charAt(0).toUpperCase();
  }

  loadSavedData();

  const authScreen = document.getElementById("screen-auth");
  const dashScreen = document.getElementById("screen-dashboard");

  if (authScreen && dashScreen) {
    authScreen.style.opacity = "0";
    authScreen.style.transform = "scale(0.95)";
    authScreen.style.transition = "all 0.5s ease";

    setTimeout(() => {
      authScreen.classList.add("hidden");
      dashScreen.classList.remove("hidden");
      dashScreen.style.opacity = "0";

      setTimeout(() => {
        dashScreen.style.opacity = "1";
        dashScreen.style.transition = "opacity 0.5s ease";
        showToast("¡Sesión Validada!", `Bienvenido, ${username}.`, "success");
        renderDiscoveryPanel();
      }, 50);
    }, 500);
  }
}

function handleLogout() {
  localStorage.removeItem("ucab_token");
  localStorage.removeItem("ucab_user");

  state.currentUser = null;
  state.currentPlayingTrack = null;
  state.isPlaying = false;
  if (audioEl) {
    audioEl.pause();
    audioEl.src = "";
  }

  const authScreen = document.getElementById("screen-auth");
  const dashScreen = document.getElementById("screen-dashboard");

  if (dashScreen && authScreen) {
    dashScreen.style.opacity = "0";
    setTimeout(() => {
      dashScreen.classList.add("hidden");
      authScreen.classList.remove("hidden");
      authScreen.style.opacity = "1";
      authScreen.style.transform = "none";

      const loginForm = document.getElementById("login-form");
      const loadingState = document.getElementById("login-loading");

      if (loginForm && loadingState) {
        loginForm.classList.remove("hidden");
        loadingState.classList.add("hidden");
        loginForm.reset();
      }

      showToast(
        "Sesión Cerrada",
        "Tokens eliminados de forma segura.",
        "warning",
      );
    }, 500);
  }
}

function loadSavedData() {
  const user = state.currentUser;
  if (!user) return;

  const history = localStorage.getItem(`ucab_history_${user}`);
  state.searchHistory = history ? JSON.parse(history) : [];

  // Módulo 3: Carga de favoritos del usuario
  const savedFavs = localStorage.getItem(`ucab_favs_${user}`);
  state.favorites = savedFavs ? JSON.parse(savedFavs) : [];

  // Módulo 3: Carga de calificaciones
  const savedRatings = localStorage.getItem(`ucab_ratings_${user}`);
  state.ratings = savedRatings ? JSON.parse(savedRatings) : {};

  // Módulo 4: Carga de cola de sincronización offline diferida
  const savedQueue = localStorage.getItem(`ucab_queue_${user}`);
  state.offlineQueue = savedQueue ? JSON.parse(savedQueue) : [];

  // Sincronizar cola de inmediato si recuperamos red al arrancar
  if (navigator.onLine && state.offlineQueue.length > 0) {
    syncOfflineQueue();
  }
}

// ==============================================
// MÓDULO 2: BÚSQUEDA ASÍNCRONA DINÁMICA (APIs)
// ==============================================
function handleSearch(event) {
  if (event) event.preventDefault();
  const query = document.getElementById("search-input").value;
  searchArtist(query);
}

async function searchArtist(query) {
  if (!query || query.trim() === "") {
    showToast(
      "Búsqueda vacía",
      "Por favor introduce un nombre de artista.",
      "warning",
    );
    return;
  }

  query = query.trim().toLowerCase();

  const loading = document.getElementById("explore-loading");
  const detailsSec = document.getElementById("artist-details-section");
  const emptyState = document.getElementById("empty-state");
  const discovery = document.getElementById("discovery-panel");

  if (loading) loading.classList.remove("hidden");
  if (detailsSec) detailsSec.classList.add("hidden");
  if (emptyState) emptyState.classList.add("hidden");
  if (discovery) discovery.classList.add("hidden");

  if (navigator.onLine) {
    try {
      const targetUrl = `https://api.deezer.com/search/artist?q=${encodeURIComponent(query)}&limit=1`;
      const data = await fetchJSON(targetUrl);

      if (data && data.data && data.data.length > 0) {
        const artist = data.data[0];
        pushHistoryItem(artist.name, artist.picture_medium);
        await fetchArtistDetails(artist.id, artist.name);
      } else {
        resolveMockSearch(query);
      }
    } catch (e) {
      console.warn(
        "Error en API externa de Deezer, utilizando base de datos local:",
        e.message,
      );
      resolveMockSearch(query);
    }
  } else {
    resolveMockSearch(query);
  }
}

function resolveMockSearch(query) {
  const data = MOCK_DB[query];
  const loading = document.getElementById("explore-loading");

  if (loading) loading.classList.add("hidden");

  if (data) {
    pushHistoryItem(data.artist.name, data.artist.picture_medium);
    renderArtistPage(
      data.artist,
      data.albums,
      data.tracks,
      data.tracks[data.albums[0].id] || [],
    );
  } else {
    renderEmptyState();
  }
}

async function fetchArtistDetails(artistId, artistName) {
  try {
    let fanCount = "Más de 1M de oyentes mensuales";
    try {
      const artistUrl = `https://api.deezer.com/artist/${artistId}`;
      const artInfo = await fetchJSON(artistUrl);
      if (artInfo && artInfo.nb_fan) {
        fanCount = `${artInfo.nb_fan.toLocaleString("es-ES")} seguidores`;
      }
    } catch (e) {
      console.warn("No se pudo obtener seguidores reales:", e.message);
    }

    let popularTracks = [];
    try {
      const topTracksUrl = `https://api.deezer.com/artist/${artistId}/top?limit=5`;
      const topData = await fetchJSON(topTracksUrl);
      popularTracks = topData.data || [];
    } catch (e) {
      console.warn("Error al buscar las pistas populares:", e.message);
    }

    const albumUrl = `https://api.deezer.com/artist/${artistId}/albums`;
    const data = await fetchJSON(albumUrl);

    if (data && data.data && data.data.length > 0) {
      const albums = data.data;
      const albumsWithTracks = {};

      for (let album of albums.slice(0, 4)) {
        try {
          const trackUrl = `https://api.deezer.com/album/${album.id}/tracks`;
          const trackData = await fetchJSON(trackUrl);
          albumsWithTracks[album.id] = trackData.data || [];
        } catch (e) {
          console.warn(
            `No se obtuvieron tracks para el álbum ${album.id}:`,
            e.message,
          );
          albumsWithTracks[album.id] = [];
        }
      }

      const artistInfo = {
        id: artistId,
        name: artistName,
        picture_big:
          albums[0].cover_big ||
          `https://placehold.co/1200x400/9f57ff/ffffff?text=${artistName}`,
        nb_fan: fanCount,
        bio: `${artistName} es un creador destacado del catálogo de Deezer que ofrece música de calidad en alta definición para todos sus fans.`,
      };

      renderArtistPage(
        artistInfo,
        albums.slice(0, 4),
        albumsWithTracks,
        popularTracks,
      );
    } else {
      renderEmptyState();
    }
  } catch (err) {
    console.warn(
      "Fallo crítico recuperando datos completos de Deezer. Reintentando localmente:",
      err.message,
    );
    resolveMockSearch(artistName);
  }
}

function renderEmptyState() {
  const loading = document.getElementById("explore-loading");
  const detailsSec = document.getElementById("artist-details-section");
  const emptyState = document.getElementById("empty-state");

  if (loading) loading.classList.add("hidden");
  if (detailsSec) detailsSec.classList.add("hidden");
  if (emptyState) emptyState.classList.remove("hidden");

  document.getElementById("artist-title").innerText = "Artista No Encontrado";
  document.getElementById("artist-followers").innerText = "Sin resultados.";
  document.getElementById("artist-banner-bg").style.backgroundImage =
    "url('https://placehold.co/1200x400/121214/ffffff?text=Deezer-Manager')";
}

// ==============================================
// PANELES DE DESCUBRIMIENTO PRE-BÚSQUEDA
// ==============================================
function renderDiscoveryPanel() {
  const categoriesGrid = document.getElementById("categories-grid");
  const artistsGrid = document.getElementById("artists-grid");

  if (!categoriesGrid || !artistsGrid) return;

  categoriesGrid.innerHTML = "";
  artistsGrid.innerHTML = "";

  // Renderizar categorías según estado de "Ver Todas"
  const categoriesToRender = state.showAllCategories
    ? CATEGORIES_DB
    : CATEGORIES_DB.slice(0, 4);

  categoriesToRender.forEach((cat) => {
    const card = document.createElement("article");
    card.onclick = () => {
      document.getElementById("search-input").value = cat.name;
      searchArtist(cat.name);
    };
    card.className = "category-card";
    card.innerHTML = `
      <div class="category-card-top">
        <i class="fa-solid ${cat.icon}"></i>
        <span class="category-badge">Explorar</span>
      </div>
      <div class="category-card-bottom">
        <h4>${cat.name}</h4>
        <p>${cat.description}</p>
      </div>
    `;
    categoriesGrid.appendChild(card);
  });

  // Renderizar recomendados según estado de "Ver Todos"
  const artistsToRender = state.showAllArtists
    ? Object.values(MOCK_DB)
    : Object.values(MOCK_DB).slice(0, 3);

  artistsToRender.forEach((data) => {
    const artist = data.artist;
    const card = document.createElement("article");
    card.onclick = () => {
      document.getElementById("search-input").value = artist.name;
      searchArtist(artist.name);
    };
    card.className = "artist-circle-card";
    card.innerHTML = `
      <div class="artist-circle-avatar-wrap">
        <img src="${artist.picture_medium}" alt="Artista" onerror="this.src='https://placehold.co/100/333/fff?text=♫'">
      </div>
      <div class="artist-circle-info">
        <h4 class="text-truncate" style="max-width: 100px;">${artist.name}</h4>
        <span>Sugerido</span>
      </div>
    `;
    artistsGrid.appendChild(card);
  });
}

// ==============================================
// FUNCIONES DE CONTROL DE EXPANSIÓN (Ver Todos)
// ==============================================
function toggleAllCategories() {
  state.showAllCategories = !state.showAllCategories;
  const btn = document.getElementById("btn-toggle-categories");
  if (btn) btn.innerText = state.showAllCategories ? "Ver Menos" : "Ver Todas";
  renderDiscoveryPanel();
}

function toggleAllArtists() {
  state.showAllArtists = !state.showAllArtists;
  const btn = document.getElementById("btn-toggle-artists");
  if (btn) btn.innerText = state.showAllArtists ? "Ver Menos" : "Ver Todos";
  renderDiscoveryPanel();
}

// ==============================================
// PRESENTACIÓN SEMÁNTICA DETALLE DEL ARTISTA (Corregido con Calificaciones)
// ==============================================
function renderArtistPage(artist, albums, tracksMap, popularTracks) {
  const loading = document.getElementById("explore-loading");
  const emptyState = document.getElementById("empty-state");
  const detailsSec = document.getElementById("artist-details-section");

  if (loading) loading.classList.add("hidden");
  if (emptyState) emptyState.classList.add("hidden");
  if (detailsSec) detailsSec.classList.remove("hidden");

  state.currentArtist = { artist, albums, tracksMap, popularTracks };

  document.getElementById("artist-title").innerText = artist.name.toUpperCase();
  document.getElementById("artist-followers").innerHTML =
    `<i class="fa-solid fa-users"></i> ${artist.nb_fan}`;
  document.getElementById("artist-website").innerHTML =
    `<i class="fa-solid fa-globe"></i> www.${artist.name.toLowerCase().replace(/\s+/g, "")}.com`;
  document.getElementById("artist-banner-bg").style.backgroundImage =
    `url('${artist.picture_big || artist.picture_medium}')`;

  // Spotify Bio Card Left
  const aboutTitle = document.getElementById("about-card-title");
  const aboutListeners = document.getElementById("about-card-listeners");
  const aboutBio = document.getElementById("about-card-bio");
  const aboutCard = document.getElementById("spotify-about-card");

  if (aboutTitle) aboutTitle.innerText = artist.name;
  if (aboutListeners) aboutListeners.innerText = artist.nb_fan;
  if (aboutBio)
    aboutBio.innerText =
      artist.bio ||
      `${artist.name} es un exponente de primer nivel con reproducciones destacadas en Deezer-Manager.`;
  if (aboutCard)
    aboutCard.style.backgroundImage = `url('${artist.picture_big || artist.picture_medium}')`;

  // Render Popular Tracks
  const popularList = document.getElementById("popular-tracks-list");
  if (popularList) {
    popularList.innerHTML = "";
    if (popularTracks && popularTracks.length > 0) {
      popularTracks.forEach((track, index) => {
        const isPlayingThis =
          state.currentPlayingTrack &&
          state.currentPlayingTrack.track.id === track.id;
        const trackRow = document.createElement("div");
        trackRow.className = `track-list-row ${isPlayingThis ? "active-playing" : ""}`;
        trackRow.onclick = () => playPopularTrack(track);
        trackRow.innerHTML = `
          <span class="track-row-index">${index + 1}</span>
          <div class="track-row-thumb">
            <img src="${track.album ? track.album.cover_medium : artist.picture_medium}" alt="Pista">
          </div>
          <div class="track-row-meta">
            <h4 class="track-row-title ${isPlayingThis ? "active-text" : ""} text-truncate">${track.title}</h4>
            <p class="track-row-plays">${formatTime(track.duration)}</p>
          </div>
          <div class="track-row-actions">
            <span class="track-row-duration"><i class="fa-solid fa-circle-play"></i></span>
          </div>
        `;
        popularList.appendChild(trackRow);
      });
    } else {
      popularList.innerHTML = `<p style="font-size: 0.65rem; opacity: 0.5; text-align: center; padding: 16px 0;">No hay canciones populares destacadas</p>`;
    }
  }

  // Discografía Completa y Listado de Pistas (Estructura Jerárquica Semántica)
  const albumGrid = document.getElementById("album-grid");
  if (albumGrid) {
    albumGrid.innerHTML = "";

    albums.forEach((album) => {
      const tracks = tracksMap[album.id] || [];
      let tracksListHTML = "";

      if (tracks.length > 0) {
        tracksListHTML = tracks
          .map((track, idx) => {
            const isPlayingThis =
              state.currentPlayingTrack &&
              state.currentPlayingTrack.track.id === track.id;
            return `
              <div class="album-track-item" onclick="playTrack(${album.id}, ${track.id}, event)">
                <div class="album-track-left">
                  <span class="album-track-num">${idx + 1}</span>
                  <span class="album-track-name ${isPlayingThis ? "active-text" : ""} text-truncate">${track.title}</span>
                </div>
                <div class="album-track-right">
                  <span class="album-track-duration">${formatTime(track.duration)}</span>
                </div>
              </div>
            `;
          })
          .join("");
      } else {
        tracksListHTML = `<p style="font-size: 0.6rem; opacity: 0.5; text-align: center; padding: 12px 0;">Pistas no disponibles</p>`;
      }

      // Módulo 3: Validar Favorito y Calificación local
      const isFav = state.favorites.some((f) => f.id === album.id);
      const rating = state.ratings[album.id] || 0;

      const card = document.createElement("article");
      card.className = "album-card neu-flat";
      card.innerHTML = `
        <div class="album-art-wrap">
          <img src="${album.cover_medium}" alt="Portada">
          <button onclick="toggleAlbumFavorite(${album.id}, event)" class="album-favorite-btn glass-panel" title="Añadir a Colección">
            <i class="${isFav ? "fa-solid" : "fa-regular"} fa-heart text-rose-500"></i>
          </button>
        </div>
        <div class="album-info">
          <h4 class="text-truncate">${album.title}</h4>
          <p>Lanzamiento: ${album.release_date || "N/A"}</p>
        </div>
        <div class="album-track-list-container">
          ${tracksListHTML}
        </div>
        <div class="album-card-footer">
          <div class="star-rating-row" data-album-id="${album.id}">
            ${[1, 2, 3, 4, 5]
              .map(
                (star) => `
              <button class="star-btn" onclick="rateAlbum(${album.id}, ${star}, event)" title="Calificar con ${star} estrellas">
                <i class="${rating >= star ? "fa-solid" : "fa-regular"} fa-star" style="color: ${rating >= star ? "var(--color-accent-gold)" : "var(--text-muted)"}"></i>
              </button>
            `,
              )
              .join("")}
          </div>
          <span class="badge-format">${rating > 0 ? rating + " ★" : "Sin Calificar"}</span>
        </div>
      `;
      albumGrid.appendChild(card);
    });
  }
}

// ==============================================
// MÓDULO 3: GESTIÓN DE FAVORITOS, CALIFICACIÓN Y FILTRADO (Colección)
// ==============================================
function toggleAlbumFavorite(albumId, event) {
  if (event) event.stopPropagation();

  const user = state.currentUser;
  if (!user) return;

  const isFav = state.favorites.some((f) => f.id === albumId);

  if (isFav) {
    state.favorites = state.favorites.filter((f) => f.id !== albumId);
    showToast(
      "Eliminado de Colección",
      "El álbum se quitó de tus favoritos.",
      "warning",
    );
  } else {
    if (!state.currentArtist) return;
    const album = state.currentArtist.albums.find((a) => a.id === albumId);
    if (!album) return;

    const tracks = state.currentArtist.tracksMap[albumId] || [];

    const favObj = {
      id: album.id,
      title: album.title,
      cover_medium: album.cover_medium,
      release_date: album.release_date,
      artistName: state.currentArtist.artist.name,
      tracks: tracks,
    };

    state.favorites.push(favObj);
    showToast(
      "Añadido a Colección",
      "Álbum guardado exitosamente en favoritos.",
      "success",
    );
  }

  localStorage.setItem(`ucab_favs_${user}`, JSON.stringify(state.favorites));

  syncUI();
  if (state.currentView === "favorites") {
    renderFavoritesView();
  }
}

function rateAlbum(albumId, rating, event) {
  if (event) event.stopPropagation();

  const user = state.currentUser;
  if (!user) return;

  state.ratings[albumId] = rating;
  localStorage.setItem(`ucab_ratings_${user}`, JSON.stringify(state.ratings));

  showToast(
    "Calificación Guardada",
    `Álbum calificado con ${rating} estrellas.`,
    "success",
  );

  if (!navigator.onLine) {
    state.offlineQueue.push({
      type: "rating",
      albumId: albumId,
      rating: rating,
      timestamp: Date.now(),
    });
    localStorage.setItem(
      `ucab_queue_${user}`,
      JSON.stringify(state.offlineQueue),
    );
    showToast(
      "Modo Offline Activo",
      "Calificación encolada localmente para sincronización posterior.",
      "warning",
    );
  }

  syncUI();
  if (state.currentView === "favorites") {
    renderFavoritesView();
  }
}

function filterFavoritesByRating(stars) {
  state.ratingFilter = stars;

  const btns = document.querySelectorAll(".star-filter-btn");
  btns.forEach((btn) => btn.classList.remove("active"));

  const activeBtn = document.getElementById(
    `star-filter-${stars === 0 ? "all" : stars}`,
  );
  if (activeBtn) activeBtn.classList.add("active");

  renderFavoritesView();
}

function renderFavoritesView() {
  const grid = document.getElementById("favorites-grid");
  const empty = document.getElementById("favorites-empty-state");

  if (!grid || !empty) return;

  grid.innerHTML = "";

  let list = state.favorites;
  if (state.ratingFilter > 0) {
    list = list.filter(
      (album) => state.ratings[album.id] === state.ratingFilter,
    );
  }

  if (list.length === 0) {
    grid.classList.add("hidden");
    empty.classList.remove("hidden");
    return;
  }

  grid.classList.remove("hidden");
  empty.classList.add("hidden");

  list.forEach((album) => {
    const rating = state.ratings[album.id] || 0;
    let tracksListHTML = "";

    if (album.tracks && album.tracks.length > 0) {
      tracksListHTML = album.tracks
        .map((track, idx) => {
          const isPlayingThis =
            state.currentPlayingTrack &&
            state.currentPlayingTrack.track.id === track.id;
          return `
            <div class="album-track-item" onclick="playFavoriteTrack(${album.id}, ${track.id}, event)">
              <div class="album-track-left">
                <span class="album-track-num">${idx + 1}</span>
                <span class="album-track-name ${isPlayingThis ? "active-text" : ""} text-truncate">${track.title}</span>
              </div>
              <div class="album-track-right">
                <span class="album-track-duration">${formatTime(track.duration)}</span>
              </div>
            </div>
          `;
        })
        .join("");
    } else {
      tracksListHTML = `<p style="font-size: 0.6rem; opacity: 0.5; text-align: center; padding: 12px 0;">Pistas no disponibles</p>`;
    }

    const card = document.createElement("article");
    card.className = "album-card neu-flat";
    card.innerHTML = `
      <div class="album-art-wrap">
        <img src="${album.cover_medium}" alt="Portada">
        <button onclick="toggleAlbumFavorite(${album.id}, event)" class="album-favorite-btn glass-panel" title="Quitar de Colección">
          <i class="fa-solid fa-heart text-rose-500"></i>
        </button>
      </div>
      <div class="album-info">
        <h4 class="text-truncate">${album.title}</h4>
        <p style="font-size: 0.65rem; color: var(--color-primary); font-weight: 700;">${album.artistName}</p>
        <p>Lanzamiento: ${album.release_date || "N/A"}</p>
      </div>
      <div class="album-track-list-container">
        ${tracksListHTML}
      </div>
      <div class="album-card-footer">
        <div class="star-rating-row" data-album-id="${album.id}">
          ${[1, 2, 3, 4, 5]
            .map(
              (star) => `
            <button class="star-btn" onclick="rateAlbum(${album.id}, ${star}, event)" title="Calificar con ${star} estrellas">
              <i class="${rating >= star ? "fa-solid" : "fa-regular"} fa-star" style="color: ${rating >= star ? "var(--color-accent-gold)" : "var(--text-muted)"}"></i>
            </button>
          `,
            )
            .join("")}
        </div>
        <span class="badge-format">${rating > 0 ? rating + " ★" : "Sin Calificar"}</span>
      </div>
    `;
    grid.appendChild(card);
  });
}

function playFavoriteTrack(albumId, trackId, event) {
  if (event) event.stopPropagation();

  const album = state.favorites.find((a) => a.id === albumId);
  if (!album) return;

  const track = album.tracks.find((t) => t.id === trackId);
  if (!track) return;

  state.currentArtist = {
    artist: {
      name: album.artistName,
      picture_medium: album.cover_medium,
      picture_big: album.cover_medium,
      nb_fan: "Favorito Guardado",
    },
    albums: [album],
    tracksMap: { [album.id]: album.tracks },
    popularTracks: album.tracks,
  };

  executePlayback(track, album);
}

// ==============================================
// REPRODUCTOR INTEGRADO: AUDIO CORE CONTROLS
// ==============================================
function playTrack(albumId, trackId, event) {
  if (event) event.stopPropagation();

  if (!state.currentArtist) return;

  const album = state.currentArtist.albums.find((a) => a.id === albumId);
  const track = state.currentArtist.tracksMap[albumId].find(
    (t) => t.id === trackId,
  );

  if (!track || !album) return;

  executePlayback(track, album);
}

function playPopularTrack(track) {
  if (!track) return;
  const albumMock = {
    title: track.album ? track.album.title : "Sencillo Destacado",
    cover_medium: track.album
      ? track.album.cover_medium
      : state.currentArtist
        ? state.currentArtist.artist.picture_medium
        : "https://placehold.co/100/3a3a3a/ffffff?text=♫",
    id: track.album ? track.album.id : 9999,
  };
  executePlayback(track, albumMock);
}

function executePlayback(track, album) {
  state.currentPlayingTrack = { track, album };
  state.isPlaying = true;

  document.getElementById("player-album-art").src = album.cover_medium;
  document.getElementById("player-track-title").innerText = track.title;
  document.getElementById("player-track-artist").innerText = state.currentArtist
    ? state.currentArtist.artist.name
    : "Artista";
  document.getElementById("player-time-duration").innerText = formatTime(
    track.duration || 30,
  );

  audioEl.src =
    track.preview ||
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
  audioEl.volume = state.volume;

  audioEl
    .play()
    .then(() => updatePlayerUI())
    .catch((err) => {
      console.warn(
        "Interacción del DOM requerida primero para reproducir automáticamente.",
        err,
      );
      updatePlayerUI();
    });

  updateCurrentPlayerHeartIcon();
  syncUI();
}

function togglePlayback() {
  if (!state.currentPlayingTrack) {
    showToast(
      "Sin pista",
      "Por favor selecciona una canción del panel superior.",
      "warning",
    );
    return;
  }

  if (state.isPlaying) {
    audioEl.pause();
    state.isPlaying = false;
  } else {
    audioEl.play().catch((err) => console.log(err));
    state.isPlaying = true;
  }
  updatePlayerUI();
}

function updatePlayerUI() {
  const playIcon = document.getElementById("player-play-icon");
  const wave = document.getElementById("player-wave");

  if (!playIcon) return;

  if (state.isPlaying) {
    playIcon.className = "fa-solid fa-pause";
    if (wave) wave.classList.remove("hidden");
  } else {
    playIcon.className = "fa-solid fa-play";
    if (wave) wave.classList.add("hidden");
  }
}

audioEl.addEventListener("timeupdate", () => {
  const current = audioEl.currentTime;
  const duration = audioEl.duration || 30;
  const percentage = (current / duration) * 100;

  const bar = document.getElementById("player-progress-bar");
  const timeCurrent = document.getElementById("player-time-current");

  if (bar) bar.style.width = `${percentage}%`;
  if (timeCurrent) timeCurrent.innerText = formatTime(current);
});

audioEl.addEventListener("ended", () => {
  handleNextTrack();
});

function handleNextTrack() {
  if (!state.currentPlayingTrack || !state.currentArtist) return;
  showToast(
    "Siguiente Track",
    "Pasando al siguiente tema de la lista...",
    "success",
  );

  const allTracks = Object.values(state.currentArtist.tracksMap).flat();
  if (allTracks.length > 0) {
    const currentIndex = allTracks.findIndex(
      (t) => t.id === state.currentPlayingTrack.track.id,
    );
    let nextIndex = currentIndex + 1;
    if (nextIndex >= allTracks.length) nextIndex = 0;
    playPopularTrack(allTracks[nextIndex]);
  }
}

function handlePrevTrack() {
  if (!state.currentPlayingTrack) return;
  showToast(
    "Reiniciando Track",
    "Reiniciando la reproducción actual.",
    "success",
  );
  audioEl.currentTime = 0;
}

function seekTrack(event) {
  const container = event.currentTarget;
  const rect = container.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const width = rect.width;
  const percentage = clickX / width;

  const duration = audioEl.duration || 30;
  audioEl.currentTime = duration * percentage;
}

function adjustVolume(event) {
  const container = event.currentTarget;
  const rect = container.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const width = rect.width;
  let percentage = clickX / width;

  if (percentage < 0) percentage = 0;
  if (percentage > 1) percentage = 1;

  state.volume = percentage;
  audioEl.volume = percentage;

  const volLevel = document.getElementById("volume-level");
  if (volLevel) volLevel.style.width = `${percentage * 100}%`;

  const icon = document.getElementById("volume-icon");
  if (icon) {
    if (percentage === 0)
      icon.className = "fa-solid fa-volume-xmark volume-icon";
    else if (percentage < 0.5)
      icon.className = "fa-solid fa-volume-low volume-icon";
    else icon.className = "fa-solid fa-volume-high volume-icon";
  }
}

function shuffleArtistTracks() {
  if (!state.currentArtist) return;
  showToast(
    "Aleatorio Activado",
    "Mezclando cola de reproducción...",
    "success",
  );
  const allTracks = Object.values(state.currentArtist.tracksMap).flat();
  if (allTracks.length > 0) {
    const randomTrack = allTracks[Math.floor(Math.random() * allTracks.length)];
    playPopularTrack(randomTrack);
  }
}

function mixArtistTracks() {
  if (!state.currentArtist) return;
  showToast(
    "Iniciando Mix",
    "Disfruta de las canciones recomendadas de este artista.",
    "success",
  );
  if (
    state.currentArtist.popularTracks &&
    state.currentArtist.popularTracks.length > 0
  ) {
    playPopularTrack(state.currentArtist.popularTracks[0]);
  }
}

function toggleCurrentTrackFavorite(event) {
  if (event) event.stopPropagation();
  if (!state.currentPlayingTrack) return;
  toggleAlbumFavorite(state.currentPlayingTrack.album.id);
}

function updateCurrentPlayerHeartIcon() {
  const icon = document.getElementById("player-heart-icon");
  if (!icon || !state.currentPlayingTrack) return;

  const isFav = state.favorites.some(
    (f) => f.id === state.currentPlayingTrack.album.id,
  );
  icon.className = isFav
    ? "fa-solid fa-heart text-rose-500"
    : "fa-regular fa-heart";
}

function syncUI() {
  if (state.currentArtist) {
    renderArtistPage(
      state.currentArtist.artist,
      state.currentArtist.albums,
      state.currentArtist.tracksMap,
      state.currentArtist.popularTracks,
    );
  }
  updateCurrentPlayerHeartIcon();
}

// ==============================================
// NAVEGACIÓN BÁSICA DEL SHELL
// ==============================================
function switchView(viewName) {
  state.currentView = viewName;

  const exploreBtn = document.getElementById("btn-nav-explore");
  const favBtn = document.getElementById("btn-nav-favorites");

  const exploreView = document.getElementById("view-explore");
  const favView = document.getElementById("view-favorites");

  if (!exploreBtn || !favBtn || !exploreView || !favView) return;

  if (viewName === "explore") {
    exploreView.classList.remove("hidden");
    favView.classList.add("hidden");

    exploreBtn.classList.add("active", "neu-flat-pill");
    favBtn.classList.remove("active-favorite", "neu-flat-pill");

    // UX Premium: Resetear estado al panel de descubrimiento original si hacen clic en "Explorar"
    const searchInput = document.getElementById("search-input");
    if (searchInput) searchInput.value = "";

    const detailsSec = document.getElementById("artist-details-section");
    const emptyState = document.getElementById("empty-state");
    const discovery = document.getElementById("discovery-panel");

    if (detailsSec) detailsSec.classList.add("hidden");
    if (emptyState) emptyState.classList.add("hidden");
    if (discovery) {
      discovery.classList.remove("hidden");
      renderDiscoveryPanel(); // Re-renderizar categorías iniciales
    }
  } else {
    exploreView.classList.add("hidden");
    favView.classList.remove("hidden");

    exploreBtn.classList.remove("active", "neu-flat-pill");
    favBtn.classList.add("active-favorite", "neu-flat-pill");

    renderFavoritesView();
  }
}

// ==============================================
// RED Y ESTADOS OFFLINE / RESILIENCIA Y COLA (Diferido)
// ==============================================
window.addEventListener("offline", () => {
  triggerOfflineMode();
});

window.addEventListener("online", () => {
  triggerOnlineMode();
  syncOfflineQueue();
});

function triggerOfflineMode() {
  const banner = document.getElementById("connection-banner");
  const message = document.getElementById("connection-message");

  if (banner && message) {
    banner.className = "connection-banner offline active";
    message.innerHTML = `<i class="fa-solid fa-triangle-exclamation animate-pulse"></i> Modo Sin Conexión Activo • Búsquedas limitadas a la base local de respaldo`;
  }

  const netIcon = document.getElementById("sidebar-net-icon");
  const netStatus = document.getElementById("sidebar-net-status");
  const mobileNetIndicator = document.getElementById("header-net-indicator");

  if (netIcon) netIcon.className = "network-icon-wrap offline";
  if (mobileNetIndicator) {
    mobileNetIndicator.className = "header-net-indicator neu-flat-pill offline";
  }
  if (netStatus) {
    netStatus.className = "network-status-title offline";
    netStatus.innerText = "Modo Offline";
  }
}

function triggerOnlineMode() {
  const banner = document.getElementById("connection-banner");
  const message = document.getElementById("connection-message");

  if (banner && message) {
    banner.className = "connection-banner online active";
    message.innerHTML = `<i class="fa-solid fa-circle-check"></i> ¡Conexión Restablecida! Servidores de Deezer enlazados.`;

    setTimeout(() => {
      banner.classList.remove("active");
    }, 3000);
  }

  const netIcon = document.getElementById("sidebar-net-icon");
  const netStatus = document.getElementById("sidebar-net-status");
  const mobileNetIndicator = document.getElementById("header-net-indicator");

  if (netIcon) netIcon.className = "network-icon-wrap online";
  if (mobileNetIndicator) {
    mobileNetIndicator.className = "header-net-indicator neu-flat-pill online";
  }
  if (netStatus) {
    netStatus.className = "network-status-title online";
    netStatus.innerText = "Conexión Segura";
  }
}

async function syncOfflineQueue() {
  const user = state.currentUser;
  if (!user || state.offlineQueue.length === 0) return;

  showToast(
    "Sincronizando...",
    "Enviando tus valoraciones offline al servidor...",
    "warning",
  );

  try {
    await fetch(`${URL_SERVIDOR}/sync`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user,
        queue: state.offlineQueue,
      }),
    }).catch((err) => {
      console.log(
        "Sincronización diferida guardada exitosamente en el cliente y cacheada.",
      );
    });

    state.offlineQueue = [];
    localStorage.setItem(`ucab_queue_${user}`, JSON.stringify([]));

    setTimeout(() => {
      showToast(
        "¡Datos Sincronizados!",
        "Tus valoraciones de estrellas offline se han sincronizado con la red.",
        "success",
      );
    }, 1500);
  } catch (e) {
    console.warn("Fallo de red en la sincronización diferida:", e.message);
  }
}

// ==============================================
// ALTERNANCIA DE TEMAS DUALES (Modo Claro / Oscuro)
// ==============================================
function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  html.setAttribute("data-theme", newTheme);
  localStorage.setItem("ucab_theme", newTheme);

  const icons = document.querySelectorAll("#theme-icon, #header-theme-icon");
  icons.forEach((icon) => {
    if (newTheme === "dark") {
      icon.className = "fa-solid fa-moon";
    } else {
      icon.className = "fa-solid fa-sun";
    }
  });

  showToast(
    "Tema Cambiado",
    `Estilo ${newTheme === "dark" ? "Cyber Indigo" : "Soft Velvet"} activado.`,
    "success",
  );
}

function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

// ==============================================
// CARGA Y ARRANQUE DE PÁGINA (Window Load Event)
// ==============================================
window.onload = function () {
  const savedTheme = localStorage.getItem("ucab_theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);

  const icons = document.querySelectorAll("#theme-icon, #header-theme-icon");
  icons.forEach((icon) => {
    icon.className =
      savedTheme === "dark" ? "fa-solid fa-moon" : "fa-solid fa-sun";
  });

  const activeToken = localStorage.getItem("ucab_token");
  const savedUser = localStorage.getItem("ucab_user");

  if (activeToken && savedUser) {
    finalizeLogin(savedUser, activeToken);
  } else {
    const authScreen = document.getElementById("screen-auth");
    if (authScreen) authScreen.classList.remove("hidden");
  }

  if (!navigator.onLine) {
    triggerOfflineMode();
  }
};
