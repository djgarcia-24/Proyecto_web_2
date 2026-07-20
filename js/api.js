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
            <div class="empty-state-container" style="grid-column: 1 / -1; text-align: center; padding: 45px 20px;">
                <div style="font-size: 3rem; margin-bottom: 15px;">🔍✏️</div>
                <h3 style="color: var(--text-main); font-size: 1.2rem; font-family: var(--font-syne);">Búsqueda vacía</h3>
                <p style="color: var(--text-muted); font-size: 0.95rem;">Escribe el nombre de un artista en el buscador para explorar su música.</p>
            </div>
        `;
        return;
    }

    // Verificar si estamos desconectados (Offline)
    if (navigator.onLine === false) {
        gridResultados.innerHTML = `
            <div class="empty-state-container" style="grid-column: 1 / -1; text-align: center; padding: 45px 20px; background: var(--bg-surface); border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
                <div style="font-size: 3.5rem; margin-bottom: 15px;">📡🚫</div>
                <h3 style="margin-bottom: 10px; font-family: var(--font-syne); color: var(--text-main); font-size: 1.3rem;">Búsqueda no disponible sin conexión</h3>
                <p style="max-width: 420px; margin: 0 auto 20px; font-size: 0.95rem; line-height: 1.6; color: var(--text-muted);">
                    Actualmente no tienes conexión a internet para explorar nuevos artistas. Puedes seguir calificando o escuchando tus álbumes guardados.
                </p>
                <a href="favoritos.html" style="display: inline-block; background: var(--color-primary); color: var(--color-btn-text); padding: 10px 24px; border-radius: var(--radius-pill); text-decoration: none; font-weight: 600; font-size: 0.9rem;">Ir a Mis Favoritos</a>
            </div>
        `;
        return;
    }

    // Spinner indicador de carga
    gridResultados.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px;">
            <div class="ucab-spinner" style="margin: 0 auto 15px;"></div>
            <p style="color: var(--text-muted);">Buscando artistas...</p>
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
                    <button type="button" class="btn-ver-detalle neu-btn-active" style="margin-top: 15px; width: 100%; padding: 10px; border-radius: var(--radius-pill); border: 1px solid var(--border-color); background: var(--color-primary); color: var(--color-btn-text); font-weight: 600; cursor: pointer;">Ver Álbumes</button>
                `;

                tarjeta.querySelector('.btn-ver-detalle').addEventListener('click', () => {
                    cargarDetalleArtista(artista);
                });

                gridResultados.appendChild(tarjeta);
            });
        } else {
            gridResultados.innerHTML = `
                <div class="empty-state-container" style="grid-column: 1 / -1; text-align: center; padding: 45px 20px;">
                    <div style="font-size: 3rem; margin-bottom: 15px;">🔍❌</div>
                    <h3 style="color: var(--text-main); font-size: 1.2rem; font-family: var(--font-syne);">Resultados no encontrados</h3>
                    <p style="color: var(--text-muted); font-size: 0.95rem;">No pudimos encontrar ningún artista que coincida con "${termino}". Revisa la ortografía.</p>
                </div>
            `;
        }
    } catch (err) {
        console.error("Error al buscar artistas:", err);
        gridResultados.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; color: red;">Error en el servicio de Deezer. Inténtalo de nuevo.</p>`;
    }
}

// 4. Panel de detalle del artista
async function cargarDetalleArtista(artista) {
    // Alternar vistas
    buscadorMain.style.display = "none";
    detalleArtista.style.display = "block";
    detalleArtista.innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <div class="ucab-spinner" style="margin: 0 auto 15px;"></div>
            <p style="color: var(--text-muted);">Cargando álbumes del artista...</p>
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
                        <h2 class="artista-nombre" style="font-family: var(--font-syne); font-size: 2.2rem; color: var(--color-primary);">${artista.name}</h2>
                        <p class="artista-fans">${artista.nb_fan ? artista.nb_fan.toLocaleString() : '0'} fans en Deezer</p>
                    </div>
                </div>
            </div>
            
            <h3 class="seccion-titulo" style="margin-top: 30px; margin-bottom: 20px; font-family: var(--font-syne); font-size: 1.5rem;">Discografía / Álbumes</h3>
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
                    <div style="position: relative;">
                        <img src="${album.cover_medium}" alt="Portada de ${album.title}">
                        <button type="button" class="boton_favorito ${esFavorito ? 'guardado' : ''}" aria-label="Favorito" style="top: 15px; right: 15px;">${esFavorito ? '❤️' : '🤍'}</button>
                    </div>
                    <h3 style="font-size: 1.1rem; margin-top: 10px;">${album.title}</h3>
                    <p style="font-size: 0.85rem; color: var(--text-muted);">${anioLanzamiento}</p>
                    
                    <button type="button" class="btn-toggle-tracks neu-btn-active" data-album-id="${album.id}" style="margin-top: 15px; width: 100%; padding: 8px 12px; border-radius: var(--radius-pill); border: 1px solid var(--border-color); background: var(--bg-surface); color: var(--text-main); font-weight: 600; cursor: pointer; transition: var(--transition-smooth);">Ver Canciones</button>
                    <div class="acordeon-tracks oculto" id="tracks-${album.id}" style="display: none; margin-top: 15px; text-align: left; border-top: 1px solid var(--border-opacity); padding-top: 10px;"></div>
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
            gridAlbums.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; color: var(--text-muted);">Este artista no cuenta con álbumes registrados.</p>`;
        }

    } catch (err) {
        console.error("Error al cargar detalle del artista:", err);
        detalleArtista.innerHTML = `
            <div style="padding: 20px; text-align: center;">
                <button type="button" id="btn-volver-error" class="btn-volver">← Volver al Buscador</button>
                <p style="color: red; margin-top: 20px;">No se pudieron cargar los datos del artista. Revisa tu conexión.</p>
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
        <div class="loading-tracks-spinner" style="text-align: center; padding: 15px;">
            <div class="ucab-spinner" style="width: 24px; height: 24px; border-width: 3px; margin: 0 auto 5px;"></div>
            <p style="font-size: 0.8rem; color: var(--text-muted);">Cargando canciones...</p>
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
            contenedor.innerHTML = `<p style="font-size: 0.85rem; color: red; text-align: center; padding: 10px;">Requiere conexión para listar canciones de este álbum.</p>`;
            return;
        }
    }

    try {
        const res = await queryDeezer(`https://api.deezer.com/album/${album.id}/tracks`);
        contenedor.innerHTML = "";
        
        if (res.data && res.data.length > 0) {
            renderizarListaDeTracks(res.data, contenedor, album, nombreArtista);
        } else {
            contenedor.innerHTML = `<p style="font-size: 0.85rem; color: var(--text-muted); text-align: center; padding: 10px;">No se encontraron canciones en este álbum.</p>`;
        }
    } catch (err) {
        console.error("Error al obtener canciones del álbum:", err);
        contenedor.innerHTML = `<p style="font-size: 0.85rem; color: red; text-align: center; padding: 10px;">Error al cargar canciones.</p>`;
    }
}

// Helper para renderizar la lista de canciones en el contenedor
function renderizarListaDeTracks(tracks, contenedor, album, nombreArtista) {
    contenedor.innerHTML = "";
    
    // Lista ordenada / Contenedor semántico de canciones
    const lista = document.createElement("ol");
    lista.className = "lista-canciones-album";
    lista.style.listStyle = "none";
    lista.style.padding = "0";
    lista.style.margin = "0";

    tracks.forEach((track, index) => {
        const fila = document.createElement("li");
        fila.className = "cancion-fila";
        fila.style.display = "flex";
        fila.style.justifyContent = "space-between";
        fila.style.alignItems = "center";
        fila.style.padding = "8px 4px";
        fila.style.borderBottom = "1px solid var(--border-opacity)";
        fila.style.fontSize = "0.9rem";

        const duracionMinSeg = track.duracion 
            ? `${Math.floor(track.duracion / 60)}:${(track.duracion % 60).toString().padStart(2, '0')}`
            : (track.duration 
                ? `${Math.floor(track.duration / 60)}:${(track.duration % 60).toString().padStart(2, '0')}`
                : "0:00");

        fila.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                <span style="color: var(--text-muted); font-size: 0.8rem; width: 18px; text-align: right;">${index + 1}.</span>
                <span class="cancion-titulo" style="font-weight: 500; overflow: hidden; text-overflow: ellipsis;">${track.title || track.titulo}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 12px; margin-left: 10px;">
                <span style="font-size: 0.8rem; color: var(--text-muted);">${duracionMinSeg}</span>
                <button type="button" class="btn-play-track neu-btn-active" data-audio="${track.preview}" style="background: var(--color-primary); color: var(--color-btn-text); border: none; padding: 4px 10px; border-radius: var(--radius-pill); font-size: 0.75rem; cursor: pointer; font-weight: 600; min-width: 76px;">▶️ Escuchar</button>
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
