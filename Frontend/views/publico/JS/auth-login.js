// 1. REFERENCIAS DEL DOM (Asegúrate de que los IDs coincidan con tu HTML)

const loginForm = document.getElementById("loginForm");
const inputEmail = document.getElementById("user"); // En tu HTML el id es 'user'
const inputPassword = document.getElementById("password");

// 2. ENVÍO DEL FORMULARIO
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Creamos el objeto con los datos del formulario
    const datosLogin = {
        user: inputEmail.value,
        password: inputPassword.value
    };

    console.log("Enviando datos a la API...", datosLogin);

    try {
        const response = await fetch("http://localhost:3000/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datosLogin)
        });

        const result = await response.json();

        // 4. MANEJO DE LA RESPUESTA
        if (result.success) {
            alert("¡Bienvenido/a " + (result.nombre || "") + "!");

            // Guardamos el token o rol si es necesario
            localStorage.setItem("usuario_rol", result.rol);
            localStorage.setItem("usuario_nombre", result.nombre);

            // Redireccionamos según el rol que viene de tblusuario
            redirigirSegunRol(result.rol);

        } else {
            // Si el servidor responde con error (usuario no encontrado o clave mal)
            alert(result.message || "Credenciales incorrectas");
        }

    } catch (error) {
        console.error("Error en la conexión:", error);
        alert("No se pudo conectar con el servidor. Verifica que el Backend esté encendido.");
    }
});

// 5. FUNCIÓN DE REDIRECCIÓN (Basada en tus roles de tblusuario)
function redirigirSegunRol(rol) {
    switch (rol) {
        case "Administrador":
            // Agregamos ../ para salir de 'publico' e ir a 'admin'
            window.location.href = "../views/admin/menuAdministrador.html"; 
            break;
        case "Vendedor":
            window.location.href = "../views/admin/menuAdministrador.html";
            break;
        case "Encargado":
            window.location.href = "../views/admin/menuAdministrador.html";
            break;
        default:
            window.location.href = ".../views/index.html"; 
            break;
    }
}