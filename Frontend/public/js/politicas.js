(async function() {
    const contenedor = document.getElementById('contenedor-politicas');
    const API_URL = 'https://sistemaventasback.vercel.app/api/public/politicas';

    if (!contenedor) return;

    try {
        const response = await fetch(API_URL);
        const politicas = await response.json();

        if (politicas.length > 0) {
            contenedor.innerHTML = '<h1 style="text-align:center;">Políticas de la Empresa</h1>';

            politicas.forEach(item => {
                const bloque = document.createElement('div');
                bloque.className = 'info-block';

                const h2 = document.createElement('h2');
                h2.textContent = item.vchtitulo;

                const p = document.createElement('p');
                p.innerHTML = item.vchcontenido.replace(/\n/g, '<br>');

                bloque.appendChild(h2);
                bloque.appendChild(p);
                
                contenedor.appendChild(bloque);
            });
        }
    } catch (error) {
        contenedor.innerHTML = '<p>Error al cargar las políticas.</p>';
    }
})();