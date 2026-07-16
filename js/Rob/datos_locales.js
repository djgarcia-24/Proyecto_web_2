// =========================================================================
// DATOS LOCALES Y OFFLINE (datos_locales.js)
// Este archivo guarda tus canciones favoritas y calificaciones en la memoria
// del navegador para que funcionen aunque no tengas internet.
// =========================================================================

// --- 1. OBTENER LA LISTA DE FAVORITOS ---
function obtenerFavoritos() {
    var textoGuardado = localStorage.getItem("lista_favoritos");
    if (textoGuardado === null) {
        return [];
    }
    return JSON.parse(textoGuardado);
}

// --- 2. GUARDAR LA LISTA DE FAVORITOS ---
function guardarFavoritos(listaParaGuardar) {
    var textoConvertido = JSON.stringify(listaParaGuardar);
    localStorage.setItem("lista_favoritos", textoConvertido);
}

// --- 3. AGREGAR O ACTUALIZAR UNA CANCIÓN FAVORITA ---
function guardarFavoritoLocal(album, calificacion) {
    var favoritos = obtenerFavoritos();

    // Verificamos de forma segura la estructura del objeto entrante
    const nombreArtista = (album.artist && album.artist.name) ? album.artist.name : (album.artista || "Artista no disponible");
    const tituloCancion = album.title || album.titulo;

    var nuevaCancion = {
        id: album.id,
        titulo: tituloCancion,
        artista: nombreArtista,
        portada: album.cover_medium || album.portada,
        audio: album.preview || album.audio, 
        rating: calificacion,               
        sincronizado: false                 
    };

    var posicionEncontrada = -1;
    for (var i = 0; i < favoritos.length; i = i + 1) {
        if (favoritos[i].id === album.id) {
            posicionEncontrada = i;
        }
    }

    if (posicionEncontrada > -1) {
        favoritos[posicionEncontrada].rating = calificacion;
        favoritos[posicionEncontrada].sincronizado = false;
    } else {
        favoritos.push(nuevaCancion);
    }

    guardarFavoritos(favoritos);

    // Intentamos sincronizar solo si la función existe globalmente
    if (navigator.onLine === true) {
        if (typeof window.sincronizarConServidor === "function") {
            window.sincronizarConServidor();
        } else if (typeof sincronizarConServidor === "function") {
            sincronizarConServidor();
        }
    }
}

// --- 4. ELIMINAR UNA CANCIÓN DE FAVORITOS ---
function eliminarFavoritoLocal(idAlbum) {
    var favoritos = obtenerFavoritos();
    var listaNueva = [];

    for (var i = 0; i < favoritos.length; i = i + 1) {
        if (String(favoritos[i].id) !== String(idAlbum)) { // Comparación segura de tipos string/number
            listaNueva.push(favoritos[i]);
        }
    }

    guardarFavoritos(listaNueva);
}