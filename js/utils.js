// ==============================================
// COMUNICACIÓN ASÍNCRONA SEGURA (Proxy CORS Guardrail)
// ==============================================
export async function fetchJSON(targetUrl) {
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
export function showToast(title, desc, type = "success") {
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

export function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}
