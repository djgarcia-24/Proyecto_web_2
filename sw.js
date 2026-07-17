// =========================================================================
// SERVICE WORKER - DEEZER-MANAGER (sw.js)
// Este script permite cachear los recursos del sitio web para cargarlo offline.
// =========================================================================

const NOMBRE_CACHE = "deezer-manager-cache-v1";

// Recursos estáticos que se van a guardar en la caché al instalar el Service Worker
const RECURSOS_ESTATICOS = [
  "./",
  "./index.html",
  "./offline/offline.html",
  "./offline/manifest.json",
  "./html/buscador.html",
  "./html/favoritos.html",
  "./css/juan/style.css",
  "./css/juan/style_caja_de_artista.css",
  "./js/inicio_sesion.js",
  "./js/sidebar.js",
  "./js/botones_laterales.js",
  "./js/api.js",
  "./js/gestor_sesion.js",
  "./js/datos_locales.js",
  "./js/sincronizador.js",
  "./js/player.js",
  "./js/servicio_favoritos.js"
];

// 1. INSTALACIÓN: Guardamos en caché todos los recursos estáticos iniciales
self.addEventListener("install", (evento) => {
  evento.waitUntil(
    caches.open(NOMBRE_CACHE).then((cache) => {
      console.log("[Service Worker] Precachando archivos estáticos...");
      return cache.addAll(RECURSOS_ESTATICOS);
    }).then(() => self.skipWaiting())
  );
});

// 2. ACTIVACIÓN: Limpiamos cachés antiguas si las hubiera
self.addEventListener("activate", (evento) => {
  evento.waitUntil(
    caches.keys().then((claves) => {
      return Promise.all(
        claves.map((clave) => {
          if (clave !== NOMBRE_CACHE) {
            console.log("[Service Worker] Eliminando caché antigua:", clave);
            return caches.delete(clave);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. INTERCEPTACIÓN DE FETCH: Estrategia Network-First con Fallback a Caché y Página Offline
self.addEventListener("fetch", (evento) => {
  const url = new URL(evento.request.url);

  // Evitamos interceptar peticiones externas como la API de Deezer, que requieren red obligatoria,
  // o llamadas al backend de Render, que se manejan por lógica JS offline.
  if (url.origin !== self.location.origin) {
    return;
  }

  evento.respondWith(
    fetch(evento.request)
      .then((respuestaRed) => {
        // Si la petición es exitosa, guardamos una copia de los recursos en la caché
        if (respuestaRed && respuestaRed.status === 200 && respuestaRed.type === "basic") {
          const respuestaParaCache = respuestaRed.clone();
          caches.open(NOMBRE_CACHE).then((cache) => {
            cache.put(evento.request, respuestaParaCache);
          });
        }
        return respuestaRed;
      })
      .catch(() => {
        // Si falla la red (offline), buscamos en la caché local
        return caches.match(evento.request).then((respuestaCache) => {
          if (respuestaCache) {
            return respuestaCache;
          }

          // Si el recurso no está en caché y es una navegación HTML, devolvemos la página offline por defecto
          if (evento.request.headers.get("accept").includes("text/html")) {
            return caches.match("./offline/offline.html");
          }

          // Si es cualquier otro recurso y no hay red ni caché, fallamos normalmente
          return Promise.reject("Recurso no disponible offline.");
        });
      })
  );
});
