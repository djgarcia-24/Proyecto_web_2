const URL_SERVIDOR = "https://servidor-proyecto-web-2.onrender.com";

// Cargar tema guardado para que inicio_sesion2.html también use dark/light
const temaGuardado = localStorage.getItem('tema');
if (temaGuardado === 'oscuro') {
  document.body.classList.add('oscuro');
}

// Elementos del DOM
const spinner = document.getElementById("spinner");
const loadingText = document.getElementById("loading-step-text");
const seccionLogin = document.getElementById("seccion-login");
const seccionFinal = document.getElementById("seccion-final");

function mostrarSpinner(mensaje = "Conectando al servidor...") {
  if (loadingText) loadingText.textContent = mensaje;
  if (spinner) spinner.hidden = false;
  
  // Ocultar formulario y h2 para que no ocupen espacio
  const formulario = document.getElementById("form-login");
  if (formulario) formulario.style.display = "none";
  
  const titulo = seccionLogin ? seccionLogin.querySelector("h2") : null;
  if (titulo) titulo.style.display = "none";
}

function ocultarSpinner() {
  if (spinner) spinner.hidden = true;
  
  // Volver a mostrar formulario y h2 si falla
  const formulario = document.getElementById("form-login");
  if (formulario) formulario.style.display = "block";
  
  const titulo = seccionLogin ? seccionLogin.querySelector("h2") : null;
  if (titulo) titulo.style.display = "block";
}

async function iniciarSesion(emailUsuario, passwordUsuario) {
  try {
    mostrarSpinner("Validando credenciales...");

    const respuesta = await fetch(`${URL_SERVIDOR}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: emailUsuario, password: passwordUsuario }),
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(datos.error || "Error en el servidor");
    }

    ocultarSpinner();
    seccionLogin.hidden = true;
    seccionFinal.hidden = false;

    setTimeout(() => {
      window.location.href = "./html2/buscador.html";
    }, 1500);

    return true;
  } catch (error) {
    ocultarSpinner();
    alert("Error: " + error.message);
    return false;
  }
}

// Evento del botón
const boton = document.getElementById("iniciar_sesion");
boton.addEventListener("click", function (event) {
  event.preventDefault();

  const email = document.getElementById("email_text").value.trim();
  const password = document.getElementById("password_text").value.trim();

  if (email === "" || password === "") {
    alert("Error: los datos no pueden estar vacíos");
    return;
  }

  iniciarSesion(email, password);
});
