(async function() {
    const API_URL = "https://sistemaventasback.vercel.app/api/public/contacto";

    try {
        const res = await fetch(API_URL);
        const datos = await res.json();

        datos.forEach(item => {
            if (item.vchcampo.toLowerCase().includes('tel')) {
                const el = document.getElementById('info-tel');
                if (el) el.textContent = item.vchvalor;
            }
            if (item.vchcampo.toLowerCase().includes('corr') || item.vchcampo.toLowerCase().includes('email')) {
                const el = document.getElementById('info-correo');
                if (el) el.textContent = item.vchvalor;
            }
        });
    } catch (error) {
        console.error("Error al cargar contacto:", error);
    }

    const form = document.getElementById("form-contacto");
    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const formData = Object.fromEntries(new FormData(form).entries());
            alert(`Gracias ${formData.nombre}, hemos recibido tu mensaje.`);
            form.reset();
        });
    }
})();