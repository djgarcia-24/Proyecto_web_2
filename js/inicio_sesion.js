// ==========================================================================
// PUNTO DE ENTRADA PRINCIPAL (Entry Point Modular)
// ==========================================================================
import { loadComponents } from "./loader.js";
import { state } from "./state.js";
import { showToast, formatTime } from "./utils.js";
import {
  handleLogin,
  handleLogout,
  finalizeLogin,
  loadSavedData,
} from "./auth.js";
import {
  showSearchHistory,
  hideSearchHistory,
  clearSearchHistory,
  handleSearch,
  searchArtist,
  renderDiscoveryPanel,
} from "./search.js";
import {
  toggleAlbumFavorite,
  rateAlbum,
  filterFavoritesByRating,
  renderFavoritesView,
  playFavoriteTrack,
} from "./favorites.js";
import {
  playTrack,
  playPopularTrack,
  togglePlayback,
  handleNextTrack,
  handlePrevTrack,
  seekTrack,
  adjustVolume,
  shuffleArtistTracks,
  mixArtistTracks,
  toggleCurrentTrackFavorite,
} from "./player.js";
import {
  switchView,
  toggleTheme,
  triggerOfflineMode,
  triggerOnlineMode,
  syncOfflineQueue,
  syncUI,
  renderArtistPage,
} from "./ui.js";

// Exponer funciones globales al objeto window para mantener la compatibilidad
// con los manejadores de eventos en línea definidos en el HTML (p.ej. onclick, onsubmit)
window.handleLogin = handleLogin;
window.handleLogout = handleLogout;
window.showSearchHistory = showSearchHistory;
window.hideSearchHistory = hideSearchHistory;
window.clearSearchHistory = clearSearchHistory;
window.handleSearch = handleSearch;
window.searchArtist = searchArtist;
window.toggleAlbumFavorite = toggleAlbumFavorite;
window.rateAlbum = rateAlbum;
window.filterFavoritesByRating = filterFavoritesByRating;
window.playFavoriteTrack = playFavoriteTrack;
window.playTrack = playTrack;
window.playPopularTrack = playPopularTrack;
window.togglePlayback = togglePlayback;
window.handleNextTrack = handleNextTrack;
window.handlePrevTrack = handlePrevTrack;
window.seekTrack = seekTrack;
window.adjustVolume = adjustVolume;
window.shuffleArtistTracks = shuffleArtistTracks;
window.mixArtistTracks = mixArtistTracks;
window.toggleCurrentTrackFavorite = toggleCurrentTrackFavorite;
window.switchView = switchView;
window.toggleTheme = toggleTheme;

// ==============================================
// REGISTRO DE EVENTOS DE RED Y CONEXIÓN
// ==============================================
window.addEventListener("offline", () => {
  triggerOfflineMode();
});

window.addEventListener("online", () => {
  triggerOnlineMode();
  syncOfflineQueue();
});

// ==============================================
// CARGA Y ARRANQUE DE PÁGINA (Window Load Event)
// ==============================================
window.onload = async function () {
  try {
    // 1. Cargar componentes HTML modulares de forma asíncrona
    await loadComponents();

    // 2. Ejecutar la inicialización normal de la interfaz
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
  } catch (err) {
    console.error("Fallo durante la inicialización de módulos:", err);
  }
};
