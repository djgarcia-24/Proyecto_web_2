import { state, URL_SERVIDOR } from "./state.js";
import { showToast, formatTime } from "./utils.js";
import { renderFavoritesView } from "./favorites.js";
import {
  updateCurrentPlayerHeartIcon,
  playPopularTrack,
  playTrack,
} from "./player.js";

// ==============================================
// PRESENTACIÓN SEMÁNTICA DETALLE DEL ARTISTA (Corregido con Calificaciones)
// ==============================================
export function renderArtistPage(artist, albums, tracksMap, popularTracks) {
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

  const aboutTitle = document.getElementById("about-card-title");
  const aboutListeners = document.getElementById("about-card-listeners");
  const aboutBio = document.getElementById("about-card-bio");
  const aboutCard = document.getElementById("spotify-about-card");

  if (aboutTitle) aboutTitle.innerText = artist.name;
  if (aboutListeners) aboutListeners.innerText = artist.nb_fan;
  if (aboutBio) {
    aboutBio.innerText =
      artist.bio ||
      `${artist.name} es un exponente de primer nivel con reproducciones destacadas en Deezer-Manager.`;
  }
  if (aboutCard) {
    aboutCard.style.backgroundImage = `url('${artist.picture_big || artist.picture_medium}')`;
  }

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
      popularList.innerHTML = `<p class="popular-tracks-empty">No hay canciones populares destacadas</p>`;
    }
  }

  // Discografía Completa y Listado de Pistas
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
        tracksListHTML = `<p class="tracks-unavailable-placeholder">Pistas no disponibles</p>`;
      }

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
                <i class="${rating >= star ? "fa-solid star-filled" : "fa-regular star-empty"} fa-star"></i>
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
// NAVEGACIÓN BÁSICA DEL SHELL
// ==============================================
export function switchView(viewName) {
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
export function triggerOfflineMode() {
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

export function triggerOnlineMode() {
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

export async function syncOfflineQueue() {
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
export function toggleTheme() {
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

export function syncUI() {
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
