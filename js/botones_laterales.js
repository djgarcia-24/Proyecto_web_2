const boton_oscuro = document.getElementById('cambio_de_modo');
const body = document.body;

function actualizarTextoTema() {
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');
    if (!themeIcon || !themeText) return;

    if (body.classList.contains('oscuro')) {
        themeIcon.textContent = "☀️";
        themeText.textContent = "Modo Claro";
    } else {
        themeIcon.textContent = "🌓";
        themeText.textContent = "Modo Oscuro";
    }
}

// 1. AL CARGAR: Esto asegura que, si refrescas la página, se mantenga el color
const temaGuardado = localStorage.getItem('tema');
if (temaGuardado === 'oscuro') {
    body.classList.add('oscuro');
}

// 2. AL HACER CLIC: Esto cambia la vista Y guarda en memoria
if (boton_oscuro) {
    boton_oscuro.addEventListener('click', () => {
        body.classList.toggle('oscuro'); 

        // Guardamos el estado actual
        if (body.classList.contains('oscuro')) {
            localStorage.setItem('tema', 'oscuro');
        } else {
            localStorage.setItem('tema', 'claro');
        }
        actualizarTextoTema();
    });
}



const boton_cerrar = document.getElementById('cerrar_sesion');
if (boton_cerrar) {
    boton_cerrar.addEventListener('click', () => {
        // Llama a la función global segura si existe, de lo contrario limpia localmente
        if (typeof cerrarSesionSegura === 'function') {
            cerrarSesionSegura();
        } else {
            localStorage.removeItem("token_seguridad");
            localStorage.removeItem("correo_activo");
            window.location.href = "../index.html";
        }
    });
}


function marcarOffline(indicador, textNode) {
    if (indicador) {
        indicador.classList.remove('online');
        indicador.classList.add('offline');
    }
    if (textNode) {
        textNode.textContent = 'Modo Offline';
    }
}

// Registrar eventos de red para actualización en tiempo real
window.addEventListener('online', actualizarIndicadorConexion);
window.addEventListener('offline', actualizarIndicadorConexion);

// Inicializar el indicador cuando se cargue el DOM
document.addEventListener('DOMContentLoaded', () => {
    actualizarIndicadorConexion();
    actualizarTextoTema();
});
