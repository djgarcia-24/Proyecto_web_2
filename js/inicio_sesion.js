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

async function descargarFavoritosTrasLogin(token) {
  try {
    const respuesta = await fetch(`${URL_SERVIDOR}/obtenerFavoritos`, {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + token
      }
    });
    if (respuesta.ok) {
      const serverFavs = await respuesta.json();
      if (Array.isArray(serverFavs)) {
        const localFavs = serverFavs.map(fav => ({
          id: fav.id,
          titulo: fav.title || fav.titulo,
          artista: fav.artist || fav.artista || "Artista no disponible",
          portada: fav.cover || fav.portada || "",
          rating: fav.rating || 0,
          tracks: fav.tracks || [],
          sincronizado: true
        }));
        localStorage.setItem("lista_favoritos", JSON.stringify(localFavs));
        console.log("Favoritos sincronizados tras login con éxito:", localFavs.length);
      }
    }
  } catch (error) {
    console.error("Error sincronizando favoritos tras login:", error);
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

      console.log("antes de linea 80")


    if (!respuesta.ok) {
      throw new Error(datos.error || "Error en el servidor");
    }

    // Guardar token y correo en localStorage
    if (typeof  window.guardarDatosSesion === "function") {

      //DEBE IMPORTAR  FUNCION DE OTRO JS 

      window.guardarDatosSesion(datos.token, emailUsuario);

      console.log("linea 80")


      
    } else {
      localStorage.setItem("token_seguridad", datos.token);
      localStorage.setItem("correo_activo", emailUsuario);
    }

    // Mostrar feedback de descarga de biblioteca
    mostrarSpinner("Sincronizando biblioteca...");
    if (navigator.onLine) {
      await descargarFavoritosTrasLogin(datos.token);
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
