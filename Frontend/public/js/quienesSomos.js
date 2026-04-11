(async function() {
    const contenedor = document.getElementById('contenedor-nosotros');
    const API_URL = 'https://sistemaventasback.vercel.app/api/informacion';

    if (!contenedor) return;

    try {
        const response = await fetch(API_URL);
        const datos = await response.json();

        if (datos && datos.length > 0) {
            contenedor.innerHTML = '<h1>Nuestra Identidad</h1>';

            datos.forEach(item => {
                if (item.Estado == 1 || item.estado == 1) {
                    const h2 = document.createElement('h2');
                    h2.textContent = item.vchtitulo;

                    const p = document.createElement('p');
                    p.innerHTML = item.vchcontenido.replace(/\n/g, '<br>');

                    contenedor.appendChild(h2);
                    contenedor.appendChild(p);
                }
            });
        } else {
            contenedor.innerHTML = '<h1>Información no disponible</h1>';
        }
    } catch (error) {
        console.error("Error cargando identidad:", error);
        contenedor.innerHTML = '<h1>Error de conexión</h1>';
    }
})();