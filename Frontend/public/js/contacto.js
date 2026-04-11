(async function() {
    const API_INFO = "https://sistemaventasback.vercel.app/api/public/contacto-info";
    const API_MENSAJE = "https://sistemaventasback.vercel.app/api/public/enviar-mensaje";

    try {
        const res = await fetch(API_INFO);
        const info = await res.json();

        const tel = info['teléfono'] || info['telefono'];
        const mail = info['correo'] || info['email'];

        if (tel) document.getElementById('info-tel').textContent = tel;
        if (mail) document.getElementById('info-correo').textContent = mail;

    } catch (error) {
        console.error("Error al cargar info de contacto:", error);
    }

    const form = document.getElementById("form-contacto");
    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            btn.disabled = true;
            btn.textContent = 'Enviando...';

            const payload = {
                nombre: form.nombre.value,
                correo: form.correo.value,
                mensaje: form.mensaje.value
            };

            try {
                const res = await fetch(API_MENSAJE, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
                const resultado = await res.json();

                if (resultado.success) {
                    alert(resultado.message);
                    form.reset();
                } else {
                    alert("Error: " + resultado.message);
                }
            } catch (error) {
                alert("Hubo un problema al enviar el mensaje.");
            } finally {
                btn.disabled = false;
                btn.textContent = 'Enviar';
            }
        });
    }
})();