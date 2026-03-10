const formulario = document.getElementById("signupForm");

formulario.addEventListener("submit", async (e) => {

    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const apellidoP = document.getElementById("apellidoP").value;
    const apellidoM = document.getElementById("apellidoM").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const nombre_completo = nombre + " " + apellidoP + " " + apellidoM;

    try {

        const respuesta = await fetch("http://localhost:3000/api/register", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email,
                password,
                nombre_completo
            })

        });

        const data = await respuesta.json();

        if (respuesta.ok) {

            alert("Usuario registrado correctamente");

            window.location.href = "login.html";

        } else {

            alert(data.message);

        }

    } catch (error) {

        console.error(error);

        alert("Error al registrar usuario");

    }

});