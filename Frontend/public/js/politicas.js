document.addEventListener('DOMContentLoaded', async () => {
    const contenedor = document.getElementById('contenedor-politicas');
    const API_URL = 'https://sistemaventasback.vercel.app/api/public/politicas';

    try {
        const response = await fetch(API_URL);
        const politicas = await response.json();

        if (politicas.length > 0) {
            // Limpiamos el mensaje de carga, pero mantenemos el H1
            contenedor.innerHTML = '<h1>Políticas de la Empresa</h1>';

            politicas.forEach(item => {
                const h2 = document.createElement('h2');
                h2.textContent = item.vchtitulo;

                const p = document.createElement('p');
                // nl2br de PHP equivale a reemplazar los saltos de línea por <br>
                p.innerHTML = item.vchcontenido.replace(/\n/g, '<br>');

                contenedor.appendChild(h2);
                contenedor.appendChild(p);
            });
        } else {
            document.getElementById('mensaje-carga').textContent = 'No hay políticas registradas.';
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('mensaje-carga').textContent = 'Error al conectar con el servidor.';
    }
});