// =========================================================================
// GESTOR DE SESIÓN (gestor_sesion.js)
// Este archivo sirve para controlar quién ha iniciado sesión y limpiar los datos al salir.
// =========================================================================

// --- 1. GUARDAR LOS DATOS DE LA SESIÓN ---
// Esta función se ejecuta cuando el servidor nos dice que el correo y la contraseña son correctos.
// Guarda el token (la llave) y el correo en la memoria del navegador (localStorage).
function guardarDatosSesion(tokenRecibido, correoUsuario) {
    // localStorage.setItem guarda una etiqueta con su valor en la memoria del navegador.
    // Aunque cierres el navegador, estos datos se quedarán guardados allí.
    localStorage.setItem("token_seguridad", tokenRecibido);
    localStorage.setItem("correo_activo", correoUsuario);
}

// --- 2. OBTENER EL TOKEN DE SEGURIDAD ---
// Esta función sirve para pedirle a la memoria del navegador la "llave" (token) que guardamos antes.
// Se usa cuando queremos hacer consultas al servidor y demostrarle que ya iniciamos sesión.
function obtenerTokenActual() {
    // localStorage.getItem busca en la memoria la etiqueta que le pidamos y nos devuelve su valor.
    return localStorage.getItem("token_seguridad");
}

// --- 3. CERRAR SESIÓN DE FORMA SEGURA ---
// Esta función borra todas las llaves y correos de la memoria del navegador para que nadie más pueda usarlos.
// Al terminar, nos envía de vuelta a la página de inicio de sesión.
function cerrarSesionSegura() {
    // localStorage.removeItem borra específicamente la etiqueta que le indiquemos.
    localStorage.removeItem("token_seguridad");
    localStorage.removeItem("correo_activo");

    // Opcional: Si guardaste calificaciones o favoritos temporales y quieres limpiarlos,
    // puedes descomentar la siguiente línea para borrar absolutamente toda la memoria:
    // localStorage.clear();

    // Redireccionamos (enviamos) al usuario de vuelta a la pantalla para iniciar sesión
    window.location.href = "../inicio_sesion.html";
}

// --- 4. CONECTAR CON EL BOTÓN DEL MENÚ LATERAL (SIDEBAR) ---
// Este bloque de código se ejecuta automáticamente cuando la página web termina de cargar.
// Se encarga de buscar el botón de "Cerrar Sesión" en tu menú lateral y asignarle la función de arriba.
document.addEventListener("DOMContentLoaded", function () {
    // Buscamos en el HTML el botón que tenga el ID "cerrar_sesion"
    var botonCerrar = document.getElementById("cerrar_sesion");

    // Si encontramos el botón en la pantalla...
    if (botonCerrar) {
        // Le decimos al botón que, cuando alguien haga "clic" sobre él, ejecute nuestra función para cerrar sesión.
        botonCerrar.addEventListener("click", function () {
            cerrarSesionSegura();
        });
    }
});