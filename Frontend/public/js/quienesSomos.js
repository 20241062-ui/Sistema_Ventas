document.addEventListener('DOMContentLoaded', async () => {
    const contenedor = document.getElementById('contenedor-nosotros');
    const API_URL = 'https://sistema-ventas-omega.vercel.app/api/public/nosotros';

    try {
        const response = await fetch(API_URL);
        const secciones = await response.json();

        if (secciones.length > 0) {
            contenedor.innerHTML = '<h1>¿Quiénes somos?</h1>';

            secciones.forEach(sec => {
                const h2 = document.createElement('h2');
                h2.textContent = sec.titulo;

                const p = document.createElement('p');
                // Respetamos los saltos de línea de la base de datos
                p.innerHTML = sec.contenido.replace(/\n/g, '<br>');

                contenedor.appendChild(h2);
                contenedor.appendChild(p);
            });
        } else {
            document.getElementById('titulo-pagina').textContent = 'Información no disponible por el momento.';
        }
    } catch (error) {
        console.error('Error al cargar Nosotros:', error);
        document.getElementById('titulo-pagina').textContent = 'Error de conexión con el servidor.';
    }
});