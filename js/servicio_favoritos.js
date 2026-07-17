// =========================================================================
// SERVICIO DE FAVORITOS (servicio_favoritos.js)
// Este archivo toma el molde del HTML, lo duplica y lo llena con la
// información de tus canciones favoritas.
// =========================================================================

document.addEventListener("DOMContentLoaded", function () {

    // 1. Buscamos el contenedor donde se van a mostrar los favoritos en pantalla
    const gridFavoritos = document.querySelector(".grid-favoritos");

    // 2. Buscamos nuestro selector de filtro de estrellas
    const selectorFiltro = document.getElementById("filtro-rating");

    // 3. Buscamos el molde original de la tarjeta que dejamos preparado en el HTML
    var moldeOriginal = document.getElementById("molde-tarjeta");

    // SEGURIDAD: Si no estamos en la página de favoritos, salimos
    if (!gridFavoritos || !moldeOriginal) {
        return;
    }

    // --- FUNCIÓN PARA DIBUJAR LAS TARJETAS EN PANTALLA ---
    function renderizarFavoritos(calificacionFiltro) {
        // Limpiamos la pantalla para no duplicar tarjetas viejas
        gridFavoritos.innerHTML = "";

        // Obtenemos los favoritos guardados en la memoria local (de datos_locales.js)
        const favoritos = obtenerFavoritos();

        if (!favoritos || favoritos.length === 0) {
            gridFavoritos.innerHTML = '<p class="empty-state" style="grid-column: 1 / -1; text-align: center; color: #888; padding: 20px;">No tienes canciones guardadas en tus favoritos.</p>';
            return;
        }

        // Recorremos cada canción favorita guardada
        favoritos.forEach(function(cancion) {
            // Si el usuario aplicó un filtro y la canción no coincide con la calificación, la saltamos
            if (calificacionFiltro > 0 && cancion.rating !== calificacionFiltro) {
                return; 
            }

            // --- NUEVO MÉTODO DE CLONACIÓN DIRECTA DEL ARTÍCULO ---
            // En lugar de clonar el div contenedor "molde-tarjeta", buscamos directamente el <article> interno
            const articuloMolde = moldeOriginal.querySelector("article");
            if (!articuloMolde) return;

            // Clonamos únicamente el elemento <article> (así no arrastramos el "display: none" del div padre)
            const nuevaTarjeta = articuloMolde.cloneNode(true);

            // Nos aseguramos al 100% de que el elemento clonado sea visible en pantalla
            nuevaTarjeta.style.display = "flex"; 
            nuevaTarjeta.style.visibility = "visible";
            nuevaTarjeta.style.opacity = "1";

            // Buscamos los elementos internos del clon para cambiar sus datos por los reales
            const imagen = nuevaTarjeta.querySelector(".imagen-molde");
            const titulo = nuevaTarjeta.querySelector(".titulo-molde");
            const artista = nuevaTarjeta.querySelector(".artista-molde");
            const botonReproducir = nuevaTarjeta.querySelector(".boton-reproducir-molde");
            const botonEliminar = nuevaTarjeta.querySelector(".eliminar-cancion-molde");
            const contenedorEstrellas = nuevaTarjeta.querySelector(".contenedor-estrellas-molde");

            // Rellenamos el clon con la información real de la canción
            if (imagen) {
                imagen.src = cancion.portada || "https://via.placeholder.com/120";
            }
            if (titulo) {
                titulo.textContent = cancion.titulo;
            }
            if (artista) {
                artista.textContent = cancion.artista;
            }

            // Asignamos atributos de datos
            if (botonReproducir) {
                botonReproducir.setAttribute("data-audio", cancion.audio || "");
            }
            if (botonEliminar) {
                botonEliminar.setAttribute("data-id", cancion.id);
            }

            // --- DIBUJAR LAS ESTRELLAS ---
            if (contenedorEstrellas) {
                contenedorEstrellas.innerHTML = ""; // Limpiamos el contenedor
                for (let estrella = 1; estrella <= 5; estrella++) {
                    const elementoEstrella = document.createElement("span");
                    elementoEstrella.textContent = "★";
                    elementoEstrella.className = "estrella";
                    elementoEstrella.setAttribute("data-valor", estrella);
                    elementoEstrella.setAttribute("data-id", cancion.id);
                    elementoEstrella.style.cursor = "pointer";

                    // Coloreamos las estrellas activas
                    if (estrella <= cancion.rating) {
                        elementoEstrella.classList.add("activa");
                        elementoEstrella.style.color = "#ffcc00"; 
                    } else {
                        elementoEstrella.style.color = "#ccc"; 
                    }

                    contenedorEstrellas.appendChild(elementoEstrella);
                }
            }

            // Acción al hacer clic en "Eliminar"
            if (botonEliminar) {
                botonEliminar.addEventListener("click", function (evento) {
                    const idParaBorrar = evento.currentTarget.getAttribute("data-id");
                    eliminarFavoritoLocal(idParaBorrar);

                    // Refrescamos la pantalla usando el filtro actual
                    const filtroActual = obtenerFiltroSeleccionado();
                    renderizarFavoritos(filtroActual);
                });
            }

            // Acción al hacer clic en "Escuchar" (Pasando el botón como referencia)
            if (botonReproducir) {
                botonReproducir.addEventListener("click", function (evento) {
                    const urlAudio = evento.currentTarget.getAttribute("data-audio");
                    const boton = evento.currentTarget;
                    
                    if (window.AudioPlayer) {
                        window.AudioPlayer.reproducir(urlAudio, boton);
                    } else {
                        console.error("El objeto global window.AudioPlayer no está cargado.");
                    }
                });
            }

            // Funcionalidad de clic para calificar con estrellas
            if (contenedorEstrellas) {
                const estrellasCreadas = contenedorEstrellas.querySelectorAll(".estrella");
                estrellasCreadas.forEach(function(estrella) {
                    estrella.addEventListener("click", function (evento) {
                        const idCancion = evento.target.getAttribute("data-id");
                        const nuevaCalificacion = parseInt(evento.target.getAttribute("data-valor"));

                        const listaFavs = obtenerFavoritos();
                        const cancionEncontrada = listaFavs.find(fav => String(fav.id) === String(idCancion));

                        if (cancionEncontrada) {
                            // Guardamos la calificación actualizada
                            guardarFavoritoLocal(cancionEncontrada, nuevaCalificacion);

                            // Refrescamos la pantalla
                            const filtroActual = obtenerFiltroSeleccionado();
                            renderizarFavoritos(filtroActual);
                        }
                    });
                });
            }

            // Añadimos el nuevo <article> directamente al grid real de favoritos
            gridFavoritos.appendChild(nuevaTarjeta);
        });
    }

    // --- FUNCIÓN AUXILIAR PARA OBTENER EL FILTRO SELECCIONADO ---
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

    // Al cargar la página, mostramos todos los favoritos sin ningún filtro
    renderizarFavoritos(0);
});