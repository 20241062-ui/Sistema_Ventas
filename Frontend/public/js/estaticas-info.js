(async function() {
    const contenedor = document.getElementById('contenido-nosotros') || document.getElementById('contenedor-nosotros');
    const mensajeCarga = document.getElementById('mensaje-carga');
    
    const API_URL = 'https://sistemaventasback.vercel.app/api/public/nosotros';

    if (!contenedor) return;

    try {
        const response = await fetch(API_URL);
        const secciones = await response.json();

        if (secciones && secciones.length > 0) {
            contenedor.innerHTML = ''; 
            
            const tituloH1 = window.location.pathname.includes('AcercaDe') ? 'Acerca de Nosotros' : '¿Quiénes somos?';
            const h1 = document.createElement('h1');
            h1.textContent = tituloH1;
            h1.style.textAlign = 'center';
            contenedor.appendChild(h1);

            secciones.forEach(sec => {
                const h2 = document.createElement('h2');
                h2.textContent = sec.titulo; 

                const p = document.createElement('p');
                p.innerHTML = sec.contenido.replace(/\n/g, '<br>');

                contenedor.appendChild(h2);
                contenedor.appendChild(p);
            });
        } else {
            contenedor.innerHTML = '<h1>Información no disponible</h1>';
        }
    } catch (error) {
        console.error('Error:', error);
        contenedor.innerHTML = '<h1>Error de conexión</h1><p>No se pudo obtener la información del servidor.</p>';
    }
})();