// =========================================================================
// SERVICIO DE FAVORITOS (servicio_favoritos.js)
// Gestión y renderizado de álbumes favoritos con calificaciones y canciones.
// =========================================================================

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
                <div class="empty-state" style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 40px 20px;">
                    <div style="font-size: 3rem; margin-bottom: 15px;">💿❤️</div>
                    <h3 style="font-family: var(--font-syne); color: var(--text-main); font-size: 1.2rem; margin-bottom: 5px;">Tu colección privada está vacía</h3>
                    <p style="font-size: 0.9rem;">Busca tus artistas favoritos y guarda sus álbumes para verlos aquí.</p>
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
                <div class="empty-state" style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 40px 20px;">
                    <div style="font-size: 3rem; margin-bottom: 15px;">⭐🔍</div>
                    <h3 style="font-family: var(--font-syne); color: var(--text-main); font-size: 1.2rem; margin-bottom: 5px;">Sin resultados para el filtro</h3>
                    <p style="font-size: 0.9rem;">No tienes ningún álbum calificado con ${calificacionFiltro} estrellas.</p>
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
                // Pre-renderizar las canciones dentro del contenedor oculto
                renderizarTracksLocales(album, contenedorTracks);

                btnToggleTracks.addEventListener("click", function () {
                    const estaOculto = contenedorTracks.style.display === "none";
                    if (estaOculto) {
                        contenedorTracks.style.display = "block";
                        btnToggleTracks.textContent = "Ocultar Canciones";
                        btnToggleTracks.style.backgroundColor = "var(--color-primary-hover)";
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
            contenedor.innerHTML = `<p style="font-size: 0.85rem; color: var(--text-muted); text-align: center; padding: 5px;">No hay canciones guardadas para este álbum.</p>`;
            return;
        }

        const lista = document.createElement("ol");
        lista.className = "lista-canciones-album";
        lista.style.listStyle = "none";
        lista.style.padding = "0";
        lista.style.margin = "0";

        album.tracks.forEach((track, index) => {
            const fila = document.createElement("li");
            fila.className = "cancion-fila";
            fila.style.display = "flex";
            fila.style.justifyContent = "space-between";
            fila.style.alignItems = "center";
            fila.style.padding = "6px 0";
            fila.style.borderBottom = "1px solid var(--border-opacity)";
            fila.style.fontSize = "0.85rem";

            const mins = Math.floor((track.duracion || track.duration || 0) / 60);
            const secs = Math.floor((track.duracion || track.duration || 0) % 60).toString().padStart(2, '0');
            const duracionStr = `${mins}:${secs}`;

            fila.innerHTML = `
                <div style="display: flex; align-items: center; gap: 8px; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                    <span style="color: var(--text-muted); font-size: 0.75rem; width: 14px; text-align: right;">${index + 1}.</span>
                    <span class="cancion-titulo" style="font-weight: 500; overflow: hidden; text-overflow: ellipsis;">${track.titulo || track.title}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 10px; margin-left: 10px;">
                    <span style="font-size: 0.75rem; color: var(--text-muted);">${duracionStr}</span>
                    <button type="button" class="btn-play-track neu-btn-active" data-audio="${track.preview}" style="background: var(--color-primary); color: var(--color-btn-text); border: none; padding: 3px 8px; border-radius: var(--radius-pill); font-size: 0.7rem; cursor: pointer; font-weight: 600; min-width: 70px;">▶️ Escuchar</button>
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