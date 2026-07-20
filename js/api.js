// =========================================================================
// API INTEGRACIONES DE DEEZER (api.js)
// Gestión del flujo de búsqueda de artistas y panel de detalle.
// =========================================================================

const inputBusqueda = document.getElementById('input_busqueda');
const botonBuscar = document.getElementById('buscar');
const gridResultados = document.getElementById('resultados');
const buscadorMain = document.getElementById('buscador-main');
const detalleArtista = document.getElementById('detalle-artista');

// 1. Eventos de escucha para búsqueda
if (botonBuscar) {
    botonBuscar.addEventListener('click', buscarMusica);
}
if (inputBusqueda) {
    inputBusqueda.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') buscarMusica();
    });
}

// 2. Helper genérico JSONP basado en Promesas
function queryDeezer(url, params = {}) {
    return new Promise((resolve, reject) => {
        const callbackName = `deezer_cb_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
        window[callbackName] = function (data) {
            resolve(data);
            delete window[callbackName];
        };

        const script = document.createElement("script");
        const allParams = { ...params, output: "jsonp", callback: callbackName };
        const queryString = Object.keys(allParams)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(allParams[key])}`)
            .join("&");
        
        script.src = `${url}?${queryString}`;
        script.onerror = (err) => {
            reject(err);
            delete window[callbackName];
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
        script.onload = () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
        document.body.appendChild(script);
    });
}

// 3. Función principal de búsqueda de artistas
async function buscarMusica() {
    const termino = inputBusqueda.value.trim();
    if (!termino) {
        gridResultados.innerHTML = `
            <div class="empty-state-container large-state">
                <div class="empty-state-icon">🔍✏️</div>
                <h3 class="empty-state-title">Búsqueda vacía</h3>
                <p class="empty-state-text">Escribe el nombre de un artista en el buscador para explorar su música.</p>
            </div>
        `;
        return;
    }

    // Verificar si estamos desconectados (Offline)
    if (navigator.onLine === false) {
        gridResultados.innerHTML = `
            <div class="empty-state-container large-state offline-state">
                <div class="empty-state-icon large-icon">📡🚫</div>
                <h3 class="empty-state-title large-title">Búsqueda no disponible sin conexión</h3>
                <p class="empty-state-text large-text">
                    Actualmente no tienes conexión a internet para explorar nuevos artistas. Puedes seguir calificando o escuchando tus álbumes guardados.
                </p>
                <a href="favoritos.html" class="empty-state-btn">Ir a Mis Favoritos</a>
            </div>
        `;
        return;
    }

    // Spinner indicador de carga
    gridResultados.innerHTML = `
        <div class="cargando-wrapper">
            <div class="ucab-spinner"></div>
            <p>Buscando artistas...</p>
        </div>
    `;

    try {
        const res = await queryDeezer("https://api.deezer.com/search/artist", { q: termino, limit: 15 });
        gridResultados.innerHTML = "";

        if (res.data && res.data.length > 0) {
            res.data.forEach(artista => {
                const tarjeta = document.createElement("div");
                tarjeta.className = "tarjeta artista-card";
                
                // Formatear el contador de fans
                const fansText = artista.nb_fan ? `${artista.nb_fan.toLocaleString()} fans` : 'Fans no disponibles';

                tarjeta.innerHTML = `
                    <img src="${artista.picture_medium}" alt="Foto de ${artista.name}">
                    <h3>${artista.name}</h3>
                    <p class="fans-count">${fansText}</p>
                    <button type="button" class="btn-ver-detalle btn-ver-albumes-artista neu-btn-active">Ver Álbumes</button>
                `;

                tarjeta.querySelector('.btn-ver-detalle').addEventListener('click', () => {
                    cargarDetalleArtista(artista);
                });

                gridResultados.appendChild(tarjeta);
            });
        } else {
            gridResultados.innerHTML = `
                <div class="empty-state-container large-state">
                    <div class="empty-state-icon">🔍❌</div>
                    <h3 class="empty-state-title">Resultados no encontrados</h3>
                    <p class="empty-state-text">No pudimos encontrar ningún artista que coincida con "${termino}". Revisa la ortografía.</p>
                </div>
            `;
        }
    } catch (err) {
        console.error("Error al buscar artistas:", err);
        gridResultados.innerHTML = `<p class="status-message-error">Error en el servicio de Deezer. Inténtalo de nuevo.</p>`;
    }
}

// 4. Panel de detalle del artista
async function cargarDetalleArtista(artista) {
    // Alternar vistas
    buscadorMain.style.display = "none";
    detalleArtista.style.display = "block";
    detalleArtista.innerHTML = `
        <div class="cargando-wrapper">
            <div class="ucab-spinner"></div>
            <p>Cargando álbumes del artista...</p>
        </div>
    `;

    try {
        const albumsRes = await queryDeezer(`https://api.deezer.com/artist/${artista.id}/albums`, { limit: 30 });
        
        // Estructurar el panel del detalle del artista
        detalleArtista.innerHTML = `
            <div class="detalle-header-wrapper">
                <button type="button" id="btn-volver-buscador" class="btn-volver">← Volver al Buscador</button>
                <div class="artista-profile-header">
                    <img class="artista-avatar" src="${artista.picture_medium}" alt="Foto de ${artista.name}" />
                    <div class="artista-profile-info">
                        <h2 class="artista-detalle-nombre">${artista.name}</h2>
                        <p class="artista-fans">${artista.nb_fan ? artista.nb_fan.toLocaleString() : '0'} fans en Deezer</p>
                    </div>
                </div>
            </div>
            
            <h3 class="artista-detalle-seccion-titulo">Discografía / Álbumes</h3>
            <div class="grid-container" id="grid-albums-artista"></div>
        `;

        // Añadir evento al botón de volver
        document.getElementById("btn-volver-buscador").addEventListener("click", () => {
            detalleArtista.style.display = "none";
            buscadorMain.style.display = "block";
        });

        const gridAlbums = document.getElementById("grid-albums-artista");

        if (albumsRes.data && albumsRes.data.length > 0) {
            albumsRes.data.forEach(album => {
                const tarjetaAlbum = document.createElement("div");
                tarjetaAlbum.className = "tarjeta album-card-detalle";

                // Consultar favoritos localmente
                const favoritos = typeof obtenerFavoritos === 'function' ? obtenerFavoritos() : [];
                const esFavorito = favoritos.some(fav => String(fav.id) === String(album.id));
                
                const anioLanzamiento = album.release_date ? album.release_date.split("-")[0] : "N/A";

                tarjetaAlbum.innerHTML = `
                    <div class="artista-album-tarjeta-portada-wrapper">
                        <img src="${album.cover_medium}" alt="Portada de ${album.title}">
                        <button type="button" class="boton_favorito artista-album-favorito-btn ${esFavorito ? 'guardado' : ''}" aria-label="Favorito">${esFavorito ? '❤️' : '🤍'}</button>
                    </div>
                    <h3 class="artista-album-titulo">${album.title}</h3>
                    <p class="artista-album-anio">${anioLanzamiento}</p>
                    
                    <button type="button" class="btn-toggle-tracks btn-album-ver-canciones neu-btn-active" data-album-id="${album.id}">Ver Canciones</button>
                    <div class="acordeon-tracks oculto" id="tracks-${album.id}"></div>
                `;

                // Configurar botón Favorito del álbum
                const btnFav = tarjetaAlbum.querySelector(".boton_favorito");
                btnFav.addEventListener("click", async (e) => {
                    e.stopPropagation();
                    const favs = obtenerFavoritos();
                    const estaEnFavs = favs.some(fav => String(fav.id) === String(album.id));

                    if (estaEnFavs) {
                        eliminarFavoritoLocal(album.id);
                        btnFav.classList.remove("guardado");
                        btnFav.textContent = "🤍";
                    } else {
                        // Cambiar a corazón rojo
                        btnFav.classList.add("guardado");
                        btnFav.textContent = "❤️";

                        // Para resiliencia offline, descargamos las pistas del álbum inmediatamente al agregarlo a favoritos
                        let tracksParaGuardar = [];
                        try {
                            const tracksRes = await queryDeezer(`https://api.deezer.com/album/${album.id}/tracks`);
                            if (tracksRes.data) {
                                tracksParaGuardar = tracksRes.data.map(t => ({
                                    id: t.id,
                                    titulo: t.title,
                                    preview: t.preview,
                                    duracion: t.duration
                                }));
                            }
                        } catch (errTracks) {
                            console.error("Error obteniendo tracks para persistir favorito:", errTracks);
                        }

                        // Guardamos el nombre del artista en el objeto álbum para persistirlo correctamente
                        album.artista = artista.name;

                        guardarFavoritoLocal(album, 0, tracksParaGuardar);
                    }
                });

                // Configurar acordeón de pistas
                const btnToggle = tarjetaAlbum.querySelector(".btn-toggle-tracks");
                const contenedorTracks = tarjetaAlbum.querySelector(`#tracks-${album.id}`);
                
                btnToggle.addEventListener("click", () => {
                    const estaOculto = contenedorTracks.style.display === "none";
                    if (estaOculto) {
                        contenedorTracks.style.display = "block";
                        btnToggle.textContent = "Ocultar Canciones";
                        mostrarTracksEnAlbum(album, contenedorTracks, artista.name);
                    } else {
                        contenedorTracks.style.display = "none";
                        btnToggle.textContent = "Ver Canciones";
                    }
                });

                gridAlbums.appendChild(tarjetaAlbum);
            });
        } else {
            gridAlbums.innerHTML = `<p class="status-message-info">Este artista no cuenta con álbumes registrados.</p>`;
        }

    } catch (err) {
        console.error("Error al cargar detalle del artista:", err);
        detalleArtista.innerHTML = `
            <div class="cargando-wrapper">
                <button type="button" id="btn-volver-error" class="btn-volver">← Volver al Buscador</button>
                <p class="status-message-error">No se pudieron cargar los datos del artista. Revisa tu conexión.</p>
            </div>
        `;
        document.getElementById("btn-volver-error").addEventListener("click", () => {
            detalleArtista.style.display = "none";
            buscadorMain.style.display = "block";
        });
    }
}

// 5. Renderizar pistas dentro de la tarjeta de álbum
async function mostrarTracksEnAlbum(album, contenedor, nombreArtista) {
    // Si ya hay contenido cargado, salimos
    if (contenedor.children.length > 0 && !contenedor.querySelector('.loading-tracks-spinner')) return;

    // Spinner interno
    contenedor.innerHTML = `
        <div class="loading-tracks-spinner">
            <div class="ucab-spinner"></div>
            <p>Cargando canciones...</p>
        </div>
    `;

    // Si estamos offline y es favorito, podemos cargarlo localmente de favoritos
    if (!navigator.onLine) {
        const favoritos = typeof obtenerFavoritos === 'function' ? obtenerFavoritos() : [];
        const albumFav = favoritos.find(fav => String(fav.id) === String(album.id));
        
        if (albumFav && albumFav.tracks && albumFav.tracks.length > 0) {
            renderizarListaDeTracks(albumFav.tracks, contenedor, album, nombreArtista);
            return;
        } else {
            contenedor.innerHTML = `<p class="status-message-error">Requiere conexión para listar canciones de este álbum.</p>`;
            return;
        }
    }

    try {
        const res = await queryDeezer(`https://api.deezer.com/album/${album.id}/tracks`);
        contenedor.innerHTML = "";
        
        if (res.data && res.data.length > 0) {
            renderizarListaDeTracks(res.data, contenedor, album, nombreArtista);
        } else {
            contenedor.innerHTML = `<p class="status-message-info">No se encontraron canciones en este álbum.</p>`;
        }
    } catch (err) {
        console.error("Error al obtener canciones del álbum:", err);
        contenedor.innerHTML = `<p class="status-message-error">Error al cargar canciones.</p>`;
    }
}

// Helper para renderizar la lista de canciones en el contenedor
function renderizarListaDeTracks(tracks, contenedor, album, nombreArtista) {
    contenedor.innerHTML = "";
    
    // Lista ordenada / Contenedor semántico de canciones
    const lista = document.createElement("ol");
    lista.className = "lista-canciones-album";

    tracks.forEach((track, index) => {
        const fila = document.createElement("li");
        fila.className = "cancion-fila";

        const duracionMinSeg = track.duracion 
            ? `${Math.floor(track.duracion / 60)}:${(track.duracion % 60).toString().padStart(2, '0')}`
            : (track.duration 
                ? `${Math.floor(track.duration / 60)}:${(track.duration % 60).toString().padStart(2, '0')}`
                : "0:00");

        fila.innerHTML = `
            <div class="cancion-col-info">
                <span class="cancion-index">${index + 1}.</span>
                <span class="cancion-titulo">${track.title || track.titulo}</span>
            </div>
            <div class="cancion-col-acciones">
                <span class="cancion-duracion">${duracionMinSeg}</span>
                <button type="button" class="btn-play-track neu-btn-active" data-audio="${track.preview}">▶️ Escuchar</button>
            </div>
        `;

        // Evento para reproducir track individual
        const playBtn = fila.querySelector(".btn-play-track");
        playBtn.addEventListener("click", () => {
            const trackInfo = {
                id: track.id,
                titulo: track.title || track.titulo,
                artista: nombreArtista,
                portada: album.cover_medium || album.portada,
                audio: track.preview
            };
            if (window.AudioPlayer) {
                window.AudioPlayer.reproducir(track.preview, trackInfo);
            } else {
                console.error("AudioPlayer no inicializado.");
            }
        });

        lista.appendChild(fila);
    });

    contenedor.appendChild(lista);
    
    // Forzar actualización de estados de los botones recién dibujados si la canción está sonando
    if (window.AudioPlayer) {
        window.AudioPlayer.actualizarTodosLosBotonesDePagina();
    }
}
