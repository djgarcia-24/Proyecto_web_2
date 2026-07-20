// =========================================================================
// SERVICIO DE FAVORITOS (servicio_favoritos.js)
// Gestión y renderizado de álbumes favoritos con calificaciones y canciones.
// =========================================================================

// Helper JSONP para Deezer si no está definido
if (typeof queryDeezer !== "function") {
    window.queryDeezer = function(url, params = {}) {
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
    };
}

document.addEventListener("DOMContentLoaded", function () {

    const gridFavoritos = document.querySelector(".grid-favoritos");
    const selectorFiltro = document.getElementById("filtro-rating");
    var moldeOriginal = document.getElementById("molde-tarjeta");

    // SEGURIDAD: Si no estamos en la página de favoritos, salimos
    if (!gridFavoritos || !moldeOriginal) {
        return;
    }

    // --- FUNCIÓN PARA DIBUJAR LAS TARJETAS EN PANTALLA ---
    function renderizarFavoritos(calificacionFiltro) {
        gridFavoritos.innerHTML = "";

        // Obtener favoritos guardados localmente
        const favoritos = obtenerFavoritos();

        if (!favoritos || favoritos.length === 0) {
            gridFavoritos.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">💿❤️</div>
                    <h3 class="empty-state-title">Tu colección privada está vacía</h3>
                    <p class="empty-state-text">Busca tus artistas favoritos y guarda sus álbumes para verlos aquí.</p>
                </div>
            `;
            return;
        }

        // Filtrar favoritos
        const favoritosFiltrados = favoritos.filter(album => {
            if (calificacionFiltro > 0) {
                return album.rating === calificacionFiltro;
            }
            return true;
        });

        if (favoritosFiltrados.length === 0) {
            gridFavoritos.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">⭐🔍</div>
                    <h3 class="empty-state-title">Sin resultados para el filtro</h3>
                    <p class="empty-state-text">No tienes ningún álbum calificado con ${calificacionFiltro} estrellas.</p>
                </div>
            `;
            return;
        }

        favoritosFiltrados.forEach(function(album) {
            const articuloMolde = moldeOriginal.querySelector("article");
            if (!articuloMolde) return;

            // Clonar artículo molde
            const nuevaTarjeta = articuloMolde.cloneNode(true);
            nuevaTarjeta.style.display = "flex"; 
            nuevaTarjeta.style.visibility = "visible";
            nuevaTarjeta.style.opacity = "1";

            // Encontrar elementos internos
            const imagen = nuevaTarjeta.querySelector(".imagen-molde");
            const titulo = nuevaTarjeta.querySelector(".titulo-molde");
            const artista = nuevaTarjeta.querySelector(".artista-molde");
            const btnToggleTracks = nuevaTarjeta.querySelector(".boton-reproducir-molde");
            const btnEliminar = nuevaTarjeta.querySelector(".eliminar-cancion-molde");
            const contenedorEstrellas = nuevaTarjeta.querySelector(".contenedor-estrellas-molde");
            const contenedorTracks = nuevaTarjeta.querySelector(".acordeon-tracks-fav");

            // Cargar datos
            if (imagen) {
                imagen.src = album.portada || "../css/placeholder.png";
            }
            if (titulo) {
                titulo.textContent = album.titulo;
            }
            if (artista) {
                artista.textContent = album.artista;
            }

            // --- RENDERIZAR ESTRELLAS INTERACTIVAS (1-5) ---
            if (contenedorEstrellas) {
                contenedorEstrellas.innerHTML = "";
                for (let estrella = 1; estrella <= 5; estrella++) {
                    const elementoEstrella = document.createElement("span");
                    elementoEstrella.textContent = "★";
                    elementoEstrella.className = "estrella";
                    elementoEstrella.setAttribute("data-valor", estrella);
                    elementoEstrella.setAttribute("data-id", album.id);
                    elementoEstrella.style.cursor = "pointer";
                    elementoEstrella.style.fontSize = "1.2rem";
                    elementoEstrella.style.transition = "var(--transition-smooth)";

                    if (estrella <= album.rating) {
                        elementoEstrella.classList.add("activa");
                        elementoEstrella.style.color = "#ffcc00"; 
                    } else {
                        elementoEstrella.style.color = "#ccc"; 
                    }

                    // Evento al hacer clic en las estrellas
                    elementoEstrella.addEventListener("click", function (evento) {
                        const idAlbum = evento.target.getAttribute("data-id");
                        const nuevaCalificacion = parseInt(evento.target.getAttribute("data-valor"));

                        const listaFavs = obtenerFavoritos();
                        const albumEncontrado = listaFavs.find(fav => String(fav.id) === String(idAlbum));

                        if (albumEncontrado) {
                            guardarFavoritoLocal(albumEncontrado, nuevaCalificacion);
                            // Refrescar renderizado con el filtro actual
                            const filtroActual = obtenerFiltroSeleccionado();
                            renderizarFavoritos(filtroActual);
                        }
                    });

                    contenedorEstrellas.appendChild(elementoEstrella);
                }
            }

            // --- ACCIÓN ELIMINAR DE FAVORITOS ---
            if (btnEliminar) {
                btnEliminar.addEventListener("click", function () {
                    eliminarFavoritoLocal(album.id);
                    const filtroActual = obtenerFiltroSeleccionado();
                    renderizarFavoritos(filtroActual);
                });
            }

            // --- CONFIGURAR DESPLEGABLE DE CANCIONES (TRACKS) ---
            if (btnToggleTracks && contenedorTracks) {
                // Pre-renderizar las canciones dentro del contenedor oculto si existen
                if (album.tracks && album.tracks.length > 0) {
                    renderizarTracksLocales(album, contenedorTracks);
                }

                btnToggleTracks.addEventListener("click", function () {
                    const estaOculto = contenedorTracks.style.display === "none";
                    if (estaOculto) {
                        contenedorTracks.style.display = "block";
                        btnToggleTracks.textContent = "Ocultar Canciones";
                        btnToggleTracks.style.backgroundColor = "var(--color-primary-hover)";

                        // Carga dinámica si la lista de pistas está vacía
                        if (!album.tracks || album.tracks.length === 0) {
                            cargarTracksDinamicos(album, contenedorTracks);
                        }
                    } else {
                        contenedorTracks.style.display = "none";
                        btnToggleTracks.textContent = "Ver Canciones";
                        btnToggleTracks.style.backgroundColor = "var(--color-primary)";
                    }
                });
            }

            gridFavoritos.appendChild(nuevaTarjeta);
        });

        // Sincronizar estados de reproducción de botones con la canción activa
        if (window.AudioPlayer) {
            window.AudioPlayer.actualizarTodosLosBotonesDePagina();
        }
    }

    // --- FUNCIÓN AUXILIAR PARA RENDERIZAR CANCIONES DESDE LOCALSTORAGE ---
    function renderizarTracksLocales(album, contenedor) {
        contenedor.innerHTML = "";

        if (!album.tracks || album.tracks.length === 0) {
            contenedor.innerHTML = `<p class="status-message-info">No hay canciones guardadas para este álbum.</p>`;
            return;
        }

        const lista = document.createElement("ol");
        lista.className = "lista-canciones-album";

        album.tracks.forEach((track, index) => {
            const fila = document.createElement("li");
            fila.className = "cancion-fila";

            const mins = Math.floor((track.duracion || track.duration || 0) / 60);
            const secs = Math.floor((track.duracion || track.duration || 0) % 60).toString().padStart(2, '0');
            const duracionStr = `${mins}:${secs}`;

            fila.innerHTML = `
                <div class="cancion-col-info">
                    <span class="cancion-index mini">${index + 1}.</span>
                    <span class="cancion-titulo">${track.titulo || track.title}</span>
                </div>
                <div class="cancion-col-acciones mini">
                    <span class="cancion-duracion mini">${duracionStr}</span>
                    <button type="button" class="btn-play-track mini-btn neu-btn-active" data-audio="${track.preview}">▶️ Escuchar</button>
                </div>
            `;

            const playBtn = fila.querySelector(".btn-play-track");
            playBtn.addEventListener("click", () => {
                const trackInfo = {
                    id: track.id,
                    titulo: track.titulo || track.title,
                    artista: album.artista,
                    portada: album.portada,
                    audio: track.preview
                };
                if (window.AudioPlayer) {
                    window.AudioPlayer.reproducir(track.preview, trackInfo);
                } else {
                    console.error("AudioPlayer no cargado.");
                }
            });

            lista.appendChild(fila);
        });

        contenedor.appendChild(lista);
    }

    // --- CARGAR PISTAS DESDE LA API DE DEEZER DINÁMICAMENTE ---
    function cargarTracksDinamicos(album, contenedor) {
        contenedor.innerHTML = `
            <div class="loading-tracks-spinner">
                <div class="ucab-spinner"></div>
                <p>Cargando canciones...</p>
            </div>
        `;

        if (navigator.onLine === false) {
            contenedor.innerHTML = `<p class="status-message-error">Requiere conexión para listar canciones de este álbum.</p>`;
            return;
        }

        var queryFunc = typeof queryDeezer === "function" ? queryDeezer : window.queryDeezer;
        if (typeof queryFunc !== "function") {
            console.error("queryDeezer no está disponible.");
            contenedor.innerHTML = `<p class="status-message-error">Error interno: Buscador no disponible.</p>`;
            return;
        }

        queryFunc("https://api.deezer.com/album/" + album.id + "/tracks")
            .then(function(res) {
                if (res.data && res.data.length > 0) {
                    const tracksParaGuardar = res.data.map(function(t) {
                        return {
                            id: t.id,
                            titulo: t.title || t.titulo,
                            preview: t.preview,
                            duracion: t.duration || t.duracion
                        };
                    });

                    // Actualizar el objeto local actual
                    album.tracks = tracksParaGuardar;

                    // Actualizar en localStorage
                    var favoritos = obtenerFavoritos();
                    var index = favoritos.findIndex(function(f) {
                        return String(f.id) === String(album.id);
                    });
                    if (index > -1) {
                        favoritos[index].tracks = tracksParaGuardar;
                        favoritos[index].sincronizado = false; // Marcar para actualizar en el servidor
                        guardarFavoritos(favoritos);

                        // Intentar sincronizar con el servidor
                        if (typeof window.sincronizarConServidor === "function") {
                            window.sincronizarConServidor();
                        } else if (typeof sincronizarConServidor === "function") {
                            sincronizarConServidor();
                        }
                    }

                    renderizarTracksLocales(album, contenedor);
                } else {
                    contenedor.innerHTML = `<p class="status-message-info">No se encontraron canciones en este álbum.</p>`;
                }
            })
            .catch(function(err) {
                console.error("Error al obtener canciones del álbum desde favoritos:", err);
                contenedor.innerHTML = `<p class="status-message-error">Error al cargar canciones.</p>`;
            });
    }

    // --- OBTENER EL FILTRO SELECCIONADO ---
    function obtenerFiltroSeleccionado() {
        if (selectorFiltro) {
            return parseInt(selectorFiltro.value);
        }
        return 0; 
    }

    // --- ESCUCHAR CAMBIOS EN EL SELECTOR DE FILTRO ---
    if (selectorFiltro) {
        selectorFiltro.addEventListener("change", function () {
            const filtroSeleccionado = obtenerFiltroSeleccionado();
            renderizarFavoritos(filtroSeleccionado);
        });
    }

    // Renderizado inicial local
    renderizarFavoritos(0);

    // Sincronizar en segundo plano con el servidor si estamos online
    if (navigator.onLine === true && typeof obtenerTokenActual === "function" && typeof descargarFavoritosDesdeServidor === "function") {
        var tokenActivo = obtenerTokenActual();
        if (tokenActivo) {
            descargarFavoritosDesdeServidor(tokenActivo)
                .then(function() {
                    renderizarFavoritos(obtenerFiltroSeleccionado());
                })
                .catch(function(err) {
                    console.log("No se pudo refrescar los favoritos en segundo plano:", err);
                });
        }
    }
});