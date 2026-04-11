(async function() {
    const esAcercaDe = window.location.pathname.includes('AcercaDe');
    const contenedor = document.getElementById(esAcercaDe ? 'contenido-nosotros' : 'contenedor-nosotros');
    
    const API_URL = esAcercaDe 
        ? 'https://sistemaventasback.vercel.app/api/public/nosotros'
        : 'https://sistemaventasback.vercel.app/api/public/nosotros';

    if (!contenedor) return;

    try {
        const response = await fetch(API_URL);
        const secciones = await response.json();

        if (secciones && secciones.length > 0) {
            contenedor.innerHTML = `<h1>${esAcercaDe ? 'Acerca de Comercializadora Doble L' : '¿Quiénes somos?'}</h1>`;
            secciones.forEach(sec => {
                const h2 = document.createElement('h2');
                h2.textContent = sec.titulo || sec.vchtitulo;
                const p = document.createElement('p');
                p.innerHTML = (sec.contenido || sec.vchcontenido).replace(/\n/g, '<br>');
                contenedor.appendChild(h2);
                contenedor.appendChild(p);
            });
        }
    } catch (error) {
        console.error("Error cargando estáticas:", error);
        contenedor.innerHTML = '<h1>Error al cargar información</h1><p>Inténtelo más tarde.</p>';
    }
})();