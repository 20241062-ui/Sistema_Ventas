const formulario = document.getElementById("signupForm");
const API_BASE_URL = "https://sistemaventasback.vercel.app/api";

formulario.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const apellidoP = document.getElementById("apellidoP").value;
    const apellidoM = document.getElementById("apellidoM").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const respuesta = await fetch(`${API_BASE_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nombre,
                paterno: apellidoP,
                materno: apellidoM,
                correo: email, 
                password
            })
        });

        const data = await respuesta.json();

        if (respuesta.ok) {
            alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
            window.location.href = "login.html";
        } else {
            alert(data.message || "Error en el registro");
        }
    } catch (error) {
        console.error(error);
        alert("Error de conexión con el servidor de Vercel");
    }
});