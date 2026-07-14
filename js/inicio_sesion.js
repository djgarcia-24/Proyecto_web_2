const URL_SERVIDOR = "https://servidor-proyecto-web-2.onrender.com";

// Elementos del DOM
const spinner = document.getElementById("spinner");
const loadingText = document.getElementById("loading-step-text");
const seccionLogin = document.getElementById("seccion-login");
const seccionFinal = document.getElementById("seccion-final");

function mostrarSpinner(mensaje = "Conectando al servidor...") {
  if (loadingText) loadingText.textContent = mensaje;
  if (spinner) spinner.hidden = false;
  if (seccionLogin) {
    // 👇 CAMBIO IMPORTANTE: usar querySelectorAll
    const elementos = seccionLogin.querySelectorAll("form, .logo, h2");
    elementos.forEach((el) => (el.style.opacity = "0.5"));
  }
}

function ocultarSpinner() {
  if (spinner) spinner.hidden = true;
  if (seccionLogin) {
    // Esto ya está bien (usa querySelectorAll)
    const elementos = seccionLogin.querySelectorAll("form, .logo, h2");
    elementos.forEach((el) => (el.style.opacity = "1"));
  }
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
      window.location.href = "./html/buscador.html";
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
