// public/js/faq.js
(async function() {
    const contenedor = document.getElementById('contenedor-faq');
    const API_URL = "https://sistemaventasback.vercel.app/api/public/faq";

    if (!contenedor) return;

    try {
        const res = await fetch(API_URL);
        const faqs = await res.json();

        if (faqs.length > 0) {
            contenedor.innerHTML = '<h1 style="text-align:center;">Preguntas Frecuentes</h1>';
            faqs.forEach(f => {
                const div = document.createElement('div');
                div.className = 'card-contacto';
                div.innerHTML = `
                    <h3 style="color:#8a2be2;">${f.vchpregunta}</h3>
                    <p>${f.vchrespuesta}</p>
                `;
                contenedor.appendChild(div);
            });
        }
    } catch (error) {
        contenedor.innerHTML = '<p>Error al cargar las preguntas.</p>';
    }
})();