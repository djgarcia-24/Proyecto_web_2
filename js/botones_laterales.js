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
boton_cerrar.addEventListener('click', () => {
    window.location.href = "../inicio_sesion.html";
});
