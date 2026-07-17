// =========================================================================
// REPRODUCTOR DE AUDIO GLOBAL (player.js)
// Este archivo crea y gestiona una única instancia de audio e inyecta la
// interfaz del reproductor de barra inferior con persistencia de sesión.
// =========================================================================

(function () {
    // Única instancia de audio en memoria para el sitio web
    const elementoAudio = new Audio();
    
    // Elementos del DOM inyectados
    let barraFlotante = null;
    let imgPortada = null;
    let txtTitulo = null;
    let txtArtista = null;
    let btnPlayFlotante = null;
    let txtTiempoActual = null;
    let txtTiempoTotal = null;
    let sliderProgreso = null;
    let sliderVolumen = null;

    // Helper para formatear segundos en formato MM:SS
    function formatearTiempo(segundos) {
        if (isNaN(segundos) || segundos === Infinity) return "0:00";
        const mins = Math.floor(segundos / 60);
        const secs = Math.floor(segundos % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // Objeto global AudioPlayer
    window.AudioPlayer = {
        
        inicializar: function () {
            // 1. Evitar duplicar la inyección
            if (document.getElementById("barra-reproductor-flotante")) return;

            // 2. Inyectar HTML del reproductor al final de la página
            const contenedor = document.createElement("div");
            contenedor.id = "barra-reproductor-flotante";
            contenedor.className = "reproductor-flotante oculto";
            contenedor.innerHTML = `
                <div class="info-reproductor">
                    <img id="img-reproductor" src="" alt="Portada" />
                    <div class="texto-reproductor">
                        <div id="titulo-reproductor" class="titulo-reproductor">Cargando...</div>
                        <div id="artista-reproductor" class="artista-reproductor">Artista</div>
                    </div>
                </div>
                <div class="controles-reproductor">
                    <button type="button" id="btn-reproductor-play" class="btn-play">▶️</button>
                    <span id="tiempo-actual" class="txt-tiempo">0:00</span>
                    <input type="range" id="progreso-reproductor" class="slider-tiempo" min="0" max="100" value="0" />
                    <span id="tiempo-total" class="txt-tiempo">0:00</span>
                </div>
                <div class="volumen-reproductor">
                    <span class="vol-icono">🔊</span>
                    <input type="range" id="volumen-reproductor" class="slider-volumen" min="0" max="1" step="0.1" value="1" />
                </div>
            `;
            document.body.appendChild(contenedor);

            // 3. Capturar referencias a los elementos del DOM inyectados
            barraFlotante = document.getElementById("barra-reproductor-flotante");
            imgPortada = document.getElementById("img-reproductor");
            txtTitulo = document.getElementById("titulo-reproductor");
            txtArtista = document.getElementById("artista-reproductor");
            btnPlayFlotante = document.getElementById("btn-reproductor-play");
            txtTiempoActual = document.getElementById("tiempo-actual");
            txtTiempoTotal = document.getElementById("tiempo-total");
            sliderProgreso = document.getElementById("progreso-reproductor");
            sliderVolumen = document.getElementById("volumen-reproductor");

            // 4. Asignar controladores de eventos interactivos
            this.vincularEventosDOM();

            // 5. Rehidratar estado de reproducción si hay datos guardados
            this.rehidratarEstado();
        },

        vincularEventosDOM: function () {
            // Control Play/Pause del botón flotante
            btnPlayFlotante.addEventListener("click", () => {
                if (elementoAudio.paused) {
                    elementoAudio.play().catch(console.error);
                } else {
                    elementoAudio.pause();
                }
            });

            // Control de búsqueda en la barra de progreso (seek)
            sliderProgreso.addEventListener("input", () => {
                if (elementoAudio.duration) {
                    const nuevoTiempo = (sliderProgreso.value / 100) * elementoAudio.duration;
                    elementoAudio.currentTime = nuevoTiempo;
                }
            });

            // Control del volumen
            sliderVolumen.addEventListener("input", () => {
                elementoAudio.volume = sliderVolumen.value;
                localStorage.setItem("reproductor_volumen", sliderVolumen.value);
            });

            // Restaurar volumen guardado
            const volGuardado = localStorage.getItem("reproductor_volumen");
            if (volGuardado !== null) {
                elementoAudio.volume = parseFloat(volGuardado);
                sliderVolumen.value = volGuardado;
            }

            // Vincular eventos del elemento <audio>
            elementoAudio.addEventListener("play", () => {
                btnPlayFlotante.textContent = "⏸️";
                this.actualizarTodosLosBotonesDePagina();
            });

            elementoAudio.addEventListener("pause", () => {
                btnPlayFlotante.textContent = "▶️";
                this.actualizarTodosLosBotonesDePagina();
            });

            elementoAudio.addEventListener("ended", () => {
                btnPlayFlotante.textContent = "▶️";
                sliderProgreso.value = 0;
                txtTiempoActual.textContent = "0:00";
                sessionStorage.removeItem("reproductor_tiempo");
                this.actualizarTodosLosBotonesDePagina();
            });

            elementoAudio.addEventListener("timeupdate", () => {
                if (elementoAudio.duration) {
                    const porcentaje = (elementoAudio.currentTime / elementoAudio.duration) * 100;
                    sliderProgreso.value = porcentaje;
                    txtTiempoActual.textContent = formatearTiempo(elementoAudio.currentTime);
                    sessionStorage.setItem("reproductor_tiempo", elementoAudio.currentTime);
                }
            });

            elementoAudio.addEventListener("durationchange", () => {
                txtTiempoTotal.textContent = formatearTiempo(elementoAudio.duration);
            });

            elementoAudio.addEventListener("loadedmetadata", () => {
                txtTiempoTotal.textContent = formatearTiempo(elementoAudio.duration);
            });
        },

        reproducir: function (urlAudio, trackInfo) {
            console.log("Intentando reproducir:", urlAudio);

            if (!urlAudio || urlAudio.trim() === "" || urlAudio === "undefined") {
                alert("Esta canción no cuenta con una vista previa de audio disponible.");
                return;
            }

            // Si es la misma canción: pausamos o reproducimos
            if (elementoAudio.src === urlAudio) {
                if (!elementoAudio.paused) {
                    elementoAudio.pause();
                } else {
                    elementoAudio.play().catch(error => {
                        console.error("Fallo al reproducir:", error);
                        if (!navigator.onLine) {
                            alert("No se puede reproducir esta canción sin conexión a internet (no está en la caché local).");
                        } else {
                            alert("No se pudo reproducir el archivo de audio. Verifica tu conexión.");
                        }
                    });
                }
                return;
            }

            // Cambiar canción
            elementoAudio.src = urlAudio;
            
            // Persistir track activo en sessionStorage
            sessionStorage.setItem("reproductor_actual", JSON.stringify(trackInfo));
            sessionStorage.setItem("reproductor_tiempo", 0);

            // Mostrar el reproductor y actualizar UI
            this.mostrarTrackUI(trackInfo);

            elementoAudio.play()
                .then(() => {
                    this.actualizarTodosLosBotonesDePagina();
                })
                .catch(error => {
                    console.error("Error al arrancar la reproducción:", error);
                    if (!navigator.onLine) {
                        alert("No se puede reproducir esta canción sin conexión a internet (no está en la caché local).");
                    } else {
                        alert("No se pudo reproducir el archivo de audio. Verifica tu conexión o disponibilidad de la pista.");
                    }
                    this.actualizarTodosLosBotonesDePagina();
                });
        },

        mostrarTrackUI: function (trackInfo) {
            if (!barraFlotante) return;
            
            imgPortada.src = trackInfo.portada || "../css/placeholder.png";
            txtTitulo.textContent = trackInfo.titulo;
            txtArtista.textContent = trackInfo.artista;
            
            barraFlotante.classList.remove("oculto");
        },

        rehidratarEstado: function () {
            const trackGuardado = sessionStorage.getItem("reproductor_actual");
            if (trackGuardado) {
                const trackInfo = JSON.parse(trackGuardado);
                this.mostrarTrackUI(trackInfo);
                
                elementoAudio.src = trackInfo.audio;
                
                const tiempoGuardado = sessionStorage.getItem("reproductor_tiempo");
                if (tiempoGuardado) {
                    elementoAudio.currentTime = parseFloat(tiempoGuardado);
                }

                // Sincronizar barra de reproducción
                elementoAudio.addEventListener("loadedmetadata", () => {
                    if (tiempoGuardado) {
                        const porcentaje = (parseFloat(tiempoGuardado) / elementoAudio.duration) * 100;
                        sliderProgreso.value = porcentaje;
                        txtTiempoActual.textContent = formatearTiempo(parseFloat(tiempoGuardado));
                    }
                });

                this.actualizarTodosLosBotonesDePagina();
            }
        },

        actualizarTodosLosBotonesDePagina: function () {
            const trackGuardado = sessionStorage.getItem("reproductor_actual");
            if (!trackGuardado) return;

            const trackInfo = JSON.parse(trackGuardado);
            const urlActiva = trackInfo.audio;
            const estaReproduciendo = !elementoAudio.paused;

            // Buscar botones con data-audio en el DOM actual
            const botones = document.querySelectorAll("[data-audio]");
            botones.forEach(btn => {
                const urlBtn = btn.getAttribute("data-audio");
                if (urlBtn === urlActiva) {
                    if (estaReproduciendo) {
                        btn.innerHTML = "⏸️ Pausar";
                        btn.classList.add("reproduciendo");
                    } else {
                        btn.innerHTML = "▶️ Escuchar";
                        btn.classList.remove("reproduciendo");
                    }
                } else {
                    btn.innerHTML = "▶️ Escuchar";
                    btn.classList.remove("reproduciendo");
                }
            });
        },

        obtenerTrackActivo: function () {
            const trackGuardado = sessionStorage.getItem("reproductor_actual");
            return trackGuardado ? JSON.parse(trackGuardado) : null;
        }
    };

    // Auto-inicializar al cargar el DOM
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => window.AudioPlayer.inicializar());
    } else {
        window.AudioPlayer.inicializar();
    }

})();