import { state, MOCK_DB, CATEGORIES_DB } from "./state.js";
import { fetchJSON, showToast } from "./utils.js";
import { renderArtistPage } from "./ui.js";

// ==============================================
// HISTORIAL DE BÚSQUEDAS DINÁMICAS
// ==============================================
export function showSearchHistory() {
  const dropdown = document.getElementById("search-history");
  const historyItems = document.getElementById("history-items");
  if (!dropdown || !historyItems) return;

  historyItems.innerHTML = "";

  if (state.searchHistory.length === 0) {
    historyItems.innerHTML = `<p class="search-history-empty">Sin búsquedas recientes</p>`;
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

export function hideSearchHistory() {
  setTimeout(() => {
    const dropdown = document.getElementById("search-history");
    if (dropdown) dropdown.classList.add("hidden");
  }, 250);
}

export function clearSearchHistory() {
  state.searchHistory = [];
  saveHistory();
  showSearchHistory();
  showToast(
    "Historial Limpio",
    "Se borró tu registro de búsquedas.",
    "warning",
  );
}

export function saveHistory() {
  localStorage.setItem(
    `ucab_history_${state.currentUser}`,
    JSON.stringify(state.searchHistory),
  );
}

export function pushHistoryItem(query, picture) {
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
// MÓDULO 2: BÚSQUEDA ASÍNCRONA DINÁMICA (APIs)
// ==============================================
export function handleSearch(event) {
  if (event) event.preventDefault();
  const query = document.getElementById("search-input").value;
  searchArtist(query);
}

export async function searchArtist(query) {
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

export function resolveMockSearch(query) {
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

export async function fetchArtistDetails(artistId, artistName) {
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

export function renderEmptyState() {
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
export function renderDiscoveryPanel() {
  const categoriesGrid = document.getElementById("categories-grid");
  const artistsGrid = document.getElementById("artists-grid");

  if (!categoriesGrid || !artistsGrid) return;

  categoriesGrid.innerHTML = "";
  artistsGrid.innerHTML = "";

  CATEGORIES_DB.forEach((cat) => {
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

  Object.values(MOCK_DB).forEach((data) => {
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
        <h4 class="text-truncate artist-circle-name-limit">${artist.name}</h4>
        <span>Sugerido</span>
      </div>
    `;
    artistsGrid.appendChild(card);
  });
}
