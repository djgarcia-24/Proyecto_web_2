// =========================================================================
// REPRODUCTOR DE AUDIO GLOBAL (player.js)
// Este archivo crea y gestiona una única instancia de audio para que no se
// solapen los sonidos al hacer clic en diferentes canciones.
// =========================================================================

(function () {
    // Creamos una única etiqueta <audio> en memoria para todo el sitio web
    const elementoAudio = new Audio();
    
    // Almacenamos el botón que está reproduciendo actualmente para poder cambiar su texto/icono
    let botonActivo = null;

    // Creamos el objeto global AudioPlayer
    window.AudioPlayer = {
        
        reproducir: function (urlAudio, botonPresionado) {
            console.log("Intentando reproducir:", urlAudio);

            // 1. Seguridad: Verificar si la URL de audio es válida
            if (!urlAudio || urlAudio.trim() === "" || urlAudio === "undefined") {
                alert("Esta canción no cuenta con una vista previa de audio disponible.");
                return;
            }

            // 2. Si es la misma canción que ya está sonando: la pausamos
            if (elementoAudio.src === urlAudio && !elementoAudio.paused) {
                elementoAudio.pause();
                this.actualizarBoton(botonPresionado, false);
                return;
            }

            // 3. Si hay un botón activo reproduciendo otra canción, lo restauramos a su estado original
            if (botonActivo && botonActivo !== botonPresionado) {
                this.actualizarBoton(botonActivo, false);
            }

            // 4. Asignamos el nuevo botón activo y la nueva canción
            botonActivo = botonPresionado;

            try {
                // Si cambiamos de canción, cargamos la nueva URL
                if (elementoAudio.src !== urlAudio) {
                    elementoAudio.src = urlAudio;
                }

                // Reproducimos el audio
                elementoAudio.play()
                    .then(() => {
                        console.log("Reproducción iniciada con éxito.");
                        this.actualizarBoton(botonActivo, true);
                    })
                    .catch(error => {
                        console.error("Error al reproducir el archivo de audio:", error);
                        alert("No se pudo reproducir el audio. Verifica el formato del enlace o que el archivo exista en tu ruta.");
                        this.actualizarBoton(botonActivo, false);
                    });

            } catch (err) {
                console.error("Ocurrió un error inesperado en el reproductor:", err);
            }
        },

        // Función de utilidad para cambiar dinámicamente el texto del botón
        actualizarBoton: function (boton, estaReproduciendo) {
            if (!boton) return;
            
            if (estaReproduciendo) {
                boton.innerHTML = "⏸️ Pausar";
                boton.classList.add("reproduciendo"); // Por si quieres darle estilos CSS especiales
            } else {
                boton.innerHTML = "▶️ Escuchar";
                boton.classList.remove("reproduciendo");
            }
        }
    };

    // Evento automático: Cuando la canción termine, restaurar el botón a "▶️ Escuchar"
    elementoAudio.addEventListener("ended", function () {
        if (botonActivo) {
            window.AudioPlayer.actualizarBoton(botonActivo, false);
            botonActivo = null;
        }
    });

})();