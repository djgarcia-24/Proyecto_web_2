// =========================================================================
// SINCRONIZADOR (sincronizador.js)
// Este archivo se encarga de subir al servidor de internet tus canciones
// favoritas y calificaciones que guardaste mientras no tenías conexión.
// =========================================================================

var URL_SERVIDOR = "https://servidor-proyecto-web-2.onrender.com";

// Función global para descargar favoritos desde el servidor y persistirlos localmente
window.descargarFavoritosDesdeServidor = function(token) {
    if (!token || navigator.onLine === false) {
        return Promise.reject("Sin conexión o sin token.");
    }
    return fetch(URL_SERVIDOR + "/Robfavoritos", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token
        }
    })
    .then(function(respuesta) {
        if (respuesta.ok === true) {
            return respuesta.json();
        }
        throw new Error("Error en la descarga de favoritos del servidor.");
    })
    .then(function(serverFavs) {
        if (Array.isArray(serverFavs)) {
            var favoritosLocales = typeof obtenerFavoritos === "function" ? obtenerFavoritos() : [];
            
            var localFavs = serverFavs.map(function(fav) {
                var localExistente = favoritosLocales.find(function(lf) {
                    return String(lf.id) === String(fav.id);
                });
                
                var ratingToUse = fav.rating || 0;
                var tracksToUse = fav.tracks || [];
                var sincronizadoToUse = true;

                if (localExistente) {
                    // Si la calificación local no está sincronizada o es mayor que la del servidor, la conservamos
                    if (localExistente.sincronizado === false || localExistente.rating > ratingToUse) {
                        ratingToUse = localExistente.rating;
                    }
                    if (localExistente.sincronizado === false) {
                        sincronizadoToUse = false;
                    }
                    // Si el servidor no trajo canciones pero localmente sí tenemos
                    if (localExistente.tracks && localExistente.tracks.length > 0 && tracksToUse.length === 0) {
                        tracksToUse = localExistente.tracks;
                    }
                }

                return {
                    id: fav.id,
                    titulo: fav.title || fav.titulo,
                    artista: fav.artist || fav.artista || "Artista no disponible",
                    portada: fav.cover || fav.portada || "",
                    rating: ratingToUse,
                    tracks: tracksToUse,
                    sincronizado: sincronizadoToUse
                };
            });

            // Conservar favoritos agregados localmente que aún no se han sincronizado
            favoritosLocales.forEach(function(localFav) {
                var existeEnServidor = serverFavs.some(function(sf) {
                    return String(sf.id) === String(localFav.id);
                });
                if (!existeEnServidor && localFav.sincronizado === false) {
                    localFavs.push(localFav);
                }
            });

            localStorage.setItem("lista_favoritos", JSON.stringify(localFavs));
            console.log("Favoritos sincronizados y fusionados desde el servidor: " + localFavs.length);
            return localFavs;
        }
    });
};

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