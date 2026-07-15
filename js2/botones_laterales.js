const boton_oscuro = document.getElementById('cambio_de_modo');
const body = document.body;
const themeText = document.getElementById('theme-text');
const themeIcon = document.getElementById('theme-icon');

function updateThemeUI() {
    const isDark = body.classList.contains('oscuro');
    if (themeText) {
        themeText.textContent = isDark ? 'Modo Claro' : 'Modo Oscuro';
    }
    if (themeIcon) {
        themeIcon.textContent = isDark ? '☀️' : '🌙';
    }
}

// 1. AL CARGAR: Esto asegura que, si refrescas la página, se mantenga el color
const temaGuardado = localStorage.getItem('tema');
if (temaGuardado === 'oscuro') {
    body.classList.add('oscuro');
}
updateThemeUI();

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
        updateThemeUI();
    });
}

const boton_cerrar = document.getElementById('cerrar_sesion');
if (boton_cerrar) {
    boton_cerrar.addEventListener('click', () => {
        window.location.href = "../inicio_sesion2.html"; // Redirigir a inicio_sesion2.html (opción 2)
    });
}
