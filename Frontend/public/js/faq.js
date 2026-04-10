(async function() {
    const contenedor = document.getElementById('contenedor-faq');
    const mensajeCarga = document.getElementById('mensaje-carga');
    const API_URL = "https://sistemaventasback.vercel.app/api/public/faq";

    try {
        const res = await fetch(API_URL);
        const faqs = await res.json();

        if (faqs && faqs.length > 0) {
            if (mensajeCarga) mensajeCarga.remove();
            
            faqs.forEach(f => {
                const div = document.createElement('div');
                div.className = 'faq-item';
                div.innerHTML = `
                    <h3 style="margin-top:20px; color:#333;">${f.vchpregunta}</h3>
                    <p style="padding-bottom:10px; border-bottom:1px solid #ddd;">${f.vchrespuesta}</p>
                `;
                contenedor.appendChild(div);
            });
        } else {
            if (mensajeCarga) mensajeCarga.textContent = 'No hay preguntas disponibles.';
        }
    } catch (error) {
        if (mensajeCarga) mensajeCarga.textContent = 'Error de conexión.';
    }
})();