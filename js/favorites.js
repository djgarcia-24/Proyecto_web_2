import { state } from "./state.js";
import { showToast, formatTime } from "./utils.js";
import { syncUI } from "./ui.js";
import { executePlayback } from "./player.js";

// ==============================================
// MÓDULO 3: GESTIÓN DE FAVORITOS, CALIFICACIÓN Y FILTRADO (Colección)
// ==============================================
export function toggleAlbumFavorite(albumId, event) {
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

export function rateAlbum(albumId, rating, event) {
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

export function filterFavoritesByRating(stars) {
  state.ratingFilter = stars;

  const btns = document.querySelectorAll(".star-filter-btn");
  btns.forEach((btn) => btn.classList.remove("active"));

  const activeBtn = document.getElementById(
    `star-filter-${stars === 0 ? "all" : stars}`,
  );
  if (activeBtn) activeBtn.classList.add("active");

  renderFavoritesView();
}

export function renderFavoritesView() {
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
      tracksListHTML = `<p class="tracks-unavailable-placeholder">Pistas no disponibles</p>`;
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
        <p class="album-card-artist-highlight">${album.artistName}</p>
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
    grid.appendChild(card);
  });
}

export function playFavoriteTrack(albumId, trackId, event) {
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
