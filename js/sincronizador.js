// =========================================================================
// SINCRONIZADOR (sincronizador.js)
// Este archivo se encarga de subir al servidor de internet tus canciones
// favoritas y calificaciones que guardaste mientras no tenías conexión.
// =========================================================================

var URL_SERVIDOR = "https://servidor-proyecto-web-2.onrender.com";

// Aseguramos que la función sea visible globalmente en el navegador
window.sincronizarConServidor = function() {
    if (navigator.onLine === false) { 
        return;
    }

    var favoritos = obtenerFavoritos(); 
    var tokenSeguridad = obtenerTokenActual(); 

    for (var i = 0; i < favoritos.length; i = i + 1) {
        var cancion = favoritos[i];

        if (cancion.sincronizado === false) {
            enviarCancionAlServidor(cancion, tokenSeguridad, i);
        }
    }
};

function enviarCancionAlServidor(cancion, token, posicionEnLista) {
    var datosParaEnviar = {
        id: cancion.id,
        title: cancion.titulo,
        artist: cancion.artista,
        cover: cancion.portada,
        rating: cancion.rating 
    };

    fetch(URL_SERVIDOR + "/Robfavoritos", { 
        method: "POST", 
        headers: {
            "Content-Type": "application/json", 
            "Authorization": "Bearer " + token 
        },
        body: JSON.stringify(datosParaEnviar) 
    })
    .then(function(respuesta) {
        if (respuesta.ok === true) { 
            var favoritosActualizados = obtenerFavoritos();

            if (favoritosActualizados[posicionEnLista]) {
                favoritosActualizados[posicionEnLista].sincronizado = true;
                guardarFavoritos(favoritosActualizados);
                console.log("Se sincronizó con éxito: " + cancion.titulo);
            }
        } else {
            console.log("El servidor rechazó la sincronización de: " + cancion.titulo);
        }
    })
    .catch(function(error) {
        console.log("Error de conexión al sincronizar: " + error.message); 
    });
}

window.addEventListener("online", function() {
    console.log("¡Volvió el internet! Iniciando sincronización automática...");
    window.sincronizarConServidor();
});