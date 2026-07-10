const URL_SERVIDOR = "https://servidor-proyecto-web-2.onrender.com";


async function iniciarSesion(emailUsuario, passwordUsuario) {
    try {
        // Configuramos el fetch para que mande un paquete POST cerrado
        const respuesta = await fetch(`${URL_SERVIDOR}/login`, {
            method: "POST", 
            headers: {
                "Content-Type": "application/json" // Le avisamos al servidor que va un JSON adentro
            },
            body: JSON.stringify({ 
                email: emailUsuario, 
                password: passwordUsuario 
            }) // Metemos los datos dentro del remolque
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            // Si el servidor responde con 401 (error), lanzamos el mensaje aquí
            throw new Error(datos.error);
        }

        console.log("Servidor dice:", datos.mensaje);
        alert("¡Entraste con éxito!");
        return true

    } catch (error) {
        console.error("Error en el login:", error.message);
        alert("Error: " + error.message);
    }
}







const boton = document.getElementById('iniciar_sesion');

boton.addEventListener('click', function(event) {
    event.preventDefault(); 

    const email = document.getElementById('email_text').value;
    const  password = document.getElementById('password_text').value;
    console.log(email, password);


    //ZONA DE SPINNER
    if (iniciarSesion(email, password) ){
       window.location.href = './html/buscador.html';
    }

})