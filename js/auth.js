import { state, URL_SERVIDOR, audioEl } from "./state.js";
import { showToast } from "./utils.js";
import { syncOfflineQueue } from "./ui.js";
import { renderDiscoveryPanel } from "./search.js";

// ==============================================
// MÓDULO 1: CONTROL DE AUTENTICACIÓN Y SESIÓN
// ==============================================
export async function handleLogin(event) {
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

export function finalizeLogin(username, token) {
  state.currentUser = username;
  localStorage.setItem("ucab_token", token);
  localStorage.setItem("ucab_user", username);

  document.getElementById("user-display").innerText = username;

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

export function handleLogout() {
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

export function loadSavedData() {
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
