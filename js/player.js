import { state, audioEl } from "./state.js";
import { showToast, formatTime } from "./utils.js";
import { toggleAlbumFavorite } from "./favorites.js";
import { syncUI } from "./ui.js";

// ==============================================
// REPRODUCTOR INTEGRADO: AUDIO CORE CONTROLS
// ==============================================
export function playTrack(albumId, trackId, event) {
  if (event) event.stopPropagation();

  if (!state.currentArtist) return;

  const album = state.currentArtist.albums.find((a) => a.id === albumId);
  const track = state.currentArtist.tracksMap[albumId].find(
    (t) => t.id === trackId,
  );

  if (!track || !album) return;

  executePlayback(track, album);
}

export function playPopularTrack(track) {
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

export function executePlayback(track, album) {
  state.currentPlayingTrack = { track, album };
  state.isPlaying = true;

  const cover = document.getElementById("player-album-art");
  const title = document.getElementById("player-track-title");
  const artist = document.getElementById("player-track-artist");
  const duration = document.getElementById("player-time-duration");

  if (cover) cover.src = album.cover_medium;
  if (title) title.innerText = track.title;
  if (artist) {
    artist.innerText = state.currentArtist
      ? state.currentArtist.artist.name
      : "Artista";
  }
  if (duration) {
    duration.innerText = formatTime(track.duration || 30);
  }

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

export function togglePlayback() {
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

export function updatePlayerUI() {
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

export function handleNextTrack() {
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

export function handlePrevTrack() {
  if (!state.currentPlayingTrack) return;
  showToast(
    "Reiniciando Track",
    "Reiniciando la reproducción actual.",
    "success",
  );
  audioEl.currentTime = 0;
}

export function seekTrack(event) {
  const container = event.currentTarget;
  const rect = container.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const width = rect.width;
  const percentage = clickX / width;

  const duration = audioEl.duration || 30;
  audioEl.currentTime = duration * percentage;
}

export function adjustVolume(event) {
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

export function shuffleArtistTracks() {
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

export function mixArtistTracks() {
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

export function toggleCurrentTrackFavorite(event) {
  if (event) event.stopPropagation();
  if (!state.currentPlayingTrack) return;
  toggleAlbumFavorite(state.currentPlayingTrack.album.id);
}

export function updateCurrentPlayerHeartIcon() {
  const icon = document.getElementById("player-heart-icon");
  if (!icon || !state.currentPlayingTrack) return;

  const isFav = state.favorites.some(
    (f) => f.id === state.currentPlayingTrack.album.id,
  );
  icon.className = isFav
    ? "fa-solid fa-heart text-rose-500"
    : "fa-regular fa-heart";
}

// Configuración de listeners del elemento de audio
if (audioEl) {
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
}
