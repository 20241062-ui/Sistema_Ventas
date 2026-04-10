(async function() {
    const contenedor = document.getElementById('contenedor-nosotros');
    const API_URL = 'https://sistemaventasback.vercel.app/api/public/nosotros';

    try {
        const response = await fetch(API_URL);
        const secciones = await response.json();

        if (secciones && secciones.length > 0) {
            contenedor.innerHTML = '<h1>¿Quiénes somos?</h1>';
            secciones.forEach(sec => {
                const h2 = document.createElement('h2');
                h2.textContent = sec.titulo;
                const p = document.createElement('p');
                p.innerHTML = sec.contenido.replace(/\n/g, '<br>');
                contenedor.appendChild(h2);
                contenedor.appendChild(p);
            });
        }
    } catch (error) {
        const h1 = document.getElementById('titulo-pagina');
        if (h1) h1.textContent = 'Error al cargar información.';
    }
})();