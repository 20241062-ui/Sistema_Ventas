
const loginForm = document.getElementById("loginForm");
const inputEmail = document.getElementById("user"); 
const inputPassword = document.getElementById("password");


loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

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


        if (result.success) {
            alert("¡Bienvenido/a " + (result.nombre || "") + "!");

           
            localStorage.setItem("usuario_rol", result.rol);
            localStorage.setItem("usuario_nombre", result.nombre);

           
            redirigirSegunRol(result.rol);

        } else {
           
            alert(result.message || "Credenciales incorrectas");
        }

    } catch (error) {
        console.error("Error en la conexión:", error);
        alert("No se pudo conectar con el servidor. Verifica que el Backend esté encendido.");
    }
});


function redirigirSegunRol(rol) {
    switch (rol) {
        case "Administrador":
            
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