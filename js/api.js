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
    
    tarjeta.innerHTML = `
        <img src="${album.cover_medium}" alt="Portada de ${album.title}">
        <h3>${album.title}</h3>
        <p>${album.artist.name}</p>
        <button type="button" class="boton_favorito">❤️</button>

    `;

    // --- CORRECCIÓN IMPORTANTE ---
    // Buscamos el botón DENTRO de la tarjeta que acabamos de crear
    const botonFavorito = tarjeta.querySelector('.boton_favorito');

    // Le asignamos el evento de clic a ESE botón en específico
    botonFavorito.addEventListener('click', () => {
        // Usamos la función de datos_locales.js para guardar el álbum con 0 estrellas iniciales
        guardarFavoritoLocal(album, 0); 
        alert(`"${album.title}" se ha añadido a tus favoritos.`);
    });

    grid.appendChild(tarjeta);
}
