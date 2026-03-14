document.addEventListener('DOMContentLoaded', async () => {
    const contenedor = document.getElementById('contenedor-faq');
    const API_URL = 'https://sv-backend-api.vercel.app/api/public/faq';

    try {
        const response = await fetch(API_URL);
        const preguntas = await response.json();

        if (preguntas.length > 0) {
            contenedor.innerHTML = '<h1>Preguntas Frecuentes</h1>';

            preguntas.forEach(item => {
                const h2 = document.createElement('h2');
                h2.textContent = item.vchpregunta;

                const p = document.createElement('p');
                p.innerHTML = item.vchrespuesta.replace(/\n/g, '<br>');

                contenedor.appendChild(h2);
                contenedor.appendChild(p);
            });
        } else {
            document.getElementById('mensaje-carga').textContent = 'No hay preguntas frecuentes registradas.';
        }
    } catch (error) {
        console.error('Error al cargar FAQ:', error);
        document.getElementById('mensaje-carga').textContent = 'Error al conectar con el servidor.';
    }
});