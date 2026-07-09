const URL_SERVIDOR = "https://servidor-proyecto-web-2.onrender.com";

async function obtenerUsuario() {
    try {
        const respuesta = await fetch(`${URL_SERVIDOR}/usuario-uno`);
        const datos = await respuesta.json();
        
        // ¡Aquí lo imprimes en tu consola!
        console.log("El usuario recibido es:", datos);
    } catch (error) {
        console.error("Hubo un error al conectar:", error);
    }
}







const boton = document.getElementById('iniciar_sesion');

boton.addEventListener('click', function(event) {
    event.preventDefault(); 
    
    // Simplemente llamamos a la función
    obtenerUsuario();

})