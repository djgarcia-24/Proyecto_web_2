const boton_oscuro = document.getElementById('cambio_de_modo');
const body = document.body;

// 1. AL CARGAR: Esto asegura que, si refrescas la página, se mantenga el color
const temaGuardado = localStorage.getItem('tema');
if (temaGuardado === 'oscuro') {
    body.classList.add('oscuro');
}

// 2. AL HACER CLIC: Esto cambia la vista Y guarda en memoria
boton_oscuro.addEventListener('click', () => {
    // Esto es lo que faltaba: aplica/quita la clase CSS
    body.classList.toggle('oscuro'); 

    // Guardamos el estado actual
    if (body.classList.contains('oscuro')) {
        localStorage.setItem('tema', 'oscuro');
    } else {
        localStorage.setItem('tema', 'claro');
    }
});



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

// --- FUNCIÓN DE ACTUALIZACIÓN DEL ESTADO DE RED REAL ---
async function actualizarIndicadorConexion() {
    const indicador = document.getElementById('indicador-conexion');
    if (!indicador) return;

    const textNode = indicador.querySelector('.badge-text');

    // 1. Primer filtro: Si el navegador reporta desconexión a nivel de hardware/sistema
    if (!navigator.onLine) {
        marcarOffline(indicador, textNode);
        return;
    }

    // 2. Segundo filtro: Sondeo activo (Heartbeat) por si hay red local pero sin internet real
    try {
        const controlador = new AbortController();
        const timeoutId = setTimeout(() => controlador.abort(), 2000); // 2 segundos máximo

        // Hacemos una consulta rápida a una URL del servidor para confirmar
        await fetch("https://servidor-proyecto-web-2.onrender.com", {
            method: "GET",
            mode: "no-cors",  // Evita problemas de CORS en verificaciones rápidas
            cache: "no-store", // Fuerza a ignorar cachés viejas
            signal: controlador.signal
        });
        
        clearTimeout(timeoutId);

        // Si responde, estamos realmente en línea
        indicador.classList.remove('offline');
        indicador.classList.add('online');
        if (textNode) textNode.textContent = 'En línea';
    } catch (error) {
        // Si falla la petición (por ejemplo, bloqueo de DevTools o sin acceso real a internet)
        marcarOffline(indicador, textNode);
    }
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
});
