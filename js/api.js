const inputBusqueda = document.getElementById('input_busqueda');
const botonBuscar = document.getElementById('buscar');


const gridResultados = document.getElementById('resultados');



// 1. Eventos de escucha
botonBuscar.addEventListener('click', buscarMusica);
inputBusqueda.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') buscarMusica();
});

// 2. Función de búsqueda (usando JSONP en lugar de fetch)
function buscarMusica() {
    const termino = inputBusqueda.value.trim();
    if (!termino) return;

    // Verificar si estamos desconectados (Offline)
    if (navigator.onLine === false) {
        gridResultados.innerHTML = `
            <div class="empty-state-container" style="grid-column: 1 / -1; text-align: center; padding: 45px 20px; background: var(--bg-surface); border-radius: var(--radius-lg); box-shadow: var(--shadow-flat); border: 1px solid var(--border-color);">
                <div style="font-size: 3.5rem; margin-bottom: 15px;">📡🚫</div>
                <h3 style="margin-bottom: 10px; font-family: var(--font-syne); color: var(--text-main); font-size: 1.3rem;">Búsqueda no disponible sin conexión</h3>
                <p style="max-width: 420px; margin: 0 auto 20px; font-size: 0.95rem; line-height: 1.6; color: var(--text-muted);">
                    Actualmente no tienes conexión a internet para explorar nuevos artistas. Puedes seguir calificando o escuchando tus álbumes guardados.
                </p>
                <a href="favoritos.html" style="display: inline-block; background: var(--color-primary); color: var(--color-btn-text); padding: 10px 24px; border-radius: var(--radius-pill); text-decoration: none; font-weight: 600; font-size: 0.9rem; transition: var(--transition-smooth);">Ir a Mis Favoritos</a>
            </div>
        `;
        return;
    }

    // Mensaje de carga
    gridResultados.innerHTML = '<p style="grid-column: 1 / -1; text-align: center;">Cargando álbumes...</p>';

    // Creamos una etiqueta <script> dinámicamente
    const script = document.createElement('script');
    
    // Le decimos a Deezer: "Devuélveme JSONP y cuando termines, ejecuta mi función 'recibirDatosDeezer'"
    script.src = `https://api.deezer.com/search/album?q=${termino}&limit=21&output=jsonp&callback=recibirDatosDeezer`;
    
    // Al agregar el script al body, el navegador hace la petición automáticamente saltándose el CORS
    document.body.appendChild(script);
    
    // Limpiamos la etiqueta script después de usarla para no ensuciar el HTML
    script.onload = () => document.body.removeChild(script);
}

// 3. Esta es la función que Deezer llamará desde sus servidores (Debe estar pegada a "window")
window.recibirDatosDeezer = function(data) {
    gridResultados.innerHTML = ''; // Limpiamos el texto de "Cargando..."

    // Si la búsqueda tiene éxito y trae datos
    if (data.data && data.data.length > 0) {
        data.data.forEach(album => agregarATarjeta(album, gridResultados));
    } else {
        gridResultados.innerHTML = '<p style="grid-column: 1 / -1; text-align: center;">No se encontraron resultados.</p>';
    }
};



// 4. Pintar la caja en el Grid
function agregarATarjeta(album, grid) {
    const tarjeta = document.createElement('div');
    tarjeta.className = 'tarjeta';
    
    // Consultar si ya está guardado en favoritos localmente
    const favoritos = typeof obtenerFavoritos === 'function' ? obtenerFavoritos() : [];
    const esFavorito = favoritos.some(fav => String(fav.id) === String(album.id));
    
    tarjeta.innerHTML = `
        <img src="${album.cover_medium}" alt="Portada de ${album.title}">
        <h3>${album.title}</h3>
        <p>${album.artist.name}</p>
        <button type="button" class="boton_favorito ${esFavorito ? 'guardado' : ''}" aria-label="Favorito">${esFavorito ? '❤️' : '🤍'}</button>
    `;

    // --- CORRECCIÓN IMPORTANTE ---
    // Buscamos el botón DENTRO de la tarjeta que acabamos de crear
    const botonFavorito = tarjeta.querySelector('.boton_favorito');

    // Le asignamos el evento de clic a ESE botón en específico
    botonFavorito.addEventListener('click', () => {
        const favoritosActuales = obtenerFavoritos();
        const estaEnFavoritos = favoritosActuales.some(fav => String(fav.id) === String(album.id));

        if (estaEnFavoritos) {
            // Si ya es favorito, lo quitamos
            eliminarFavoritoLocal(album.id);
            botonFavorito.classList.remove('guardado');
            botonFavorito.textContent = '🤍';
        } else {
            // Si no es favorito, lo agregamos
            guardarFavoritoLocal(album, 0); 
            botonFavorito.classList.add('guardado');
            botonFavorito.textContent = '❤️';
        }
    });

    grid.appendChild(tarjeta);
}
