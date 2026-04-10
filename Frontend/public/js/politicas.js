(async function() {
    const contenedor = document.getElementById('contenedor-politicas');
    const mensajeCarga = document.getElementById('mensaje-carga');
    const API_URL = 'https://sistemaventasback.vercel.app/api/public/politicas';

    try {
        const response = await fetch(API_URL);
        const politicas = await response.json();

        if (politicas && politicas.length > 0) {
            if (mensajeCarga) mensajeCarga.remove();
            
            politicas.forEach(item => {
                const h2 = document.createElement('h2');
                h2.textContent = item.vchtitulo;
                const p = document.createElement('p');
                p.innerHTML = item.vchcontenido.replace(/\n/g, '<br>');
                contenedor.appendChild(h2);
                contenedor.appendChild(p);
            });
        } else {
            if (mensajeCarga) mensajeCarga.textContent = 'No hay políticas registradas.';
        }
    } catch (error) {
        if (mensajeCarga) mensajeCarga.textContent = 'Error al conectar con el servidor.';
    }
})();