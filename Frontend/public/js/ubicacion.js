(async function() {
    const select = document.getElementById('sucursalSelect');
    const mapa = document.getElementById('mapaSucursal');
    const card = document.getElementById('cardSucursal');
    const mensajeCarga = document.getElementById('mensaje-carga');
    const contenido = document.getElementById('contenido-ubicacion');

    const API_URL = 'https://sistemaventasback.vercel.app/api/public/sucursales';

    try {
        const response = await fetch(API_URL);
        const sucursales = await response.json();

        if (sucursales && sucursales.length > 0) {
            if (mensajeCarga) mensajeCarga.style.display = 'none';
            if (contenido) contenido.style.display = 'block';

            sucursales.forEach(s => {
                const option = document.createElement('option');
                option.value = s.vchlink_mapa;
                option.textContent = s.vchnombre;
                option.dataset.direccion = s.vchdireccion;
                option.dataset.telefono = s.vchtelefono;
                option.dataset.horario = s.vchhorario;
                select.appendChild(option);
            });

            const actualizarVista = (opt) => {
                mapa.src = opt.value;
                card.innerHTML = `
                    <h2 style="margin-top:0;">${opt.textContent}</h2>
                    <p><strong>📍 Dirección:</strong> ${opt.dataset.direccion}</p>
                    <p><strong>📞 Teléfono:</strong> ${opt.dataset.telefono}</p>
                    <p><strong>🕒 Horario:</strong> ${opt.dataset.horario}</p>
                `;
            };

            actualizarVista(select.options[0]);
            select.addEventListener('change', () => actualizarVista(select.selectedOptions[0]));
        }
    } catch (error) {
        if (mensajeCarga) mensajeCarga.textContent = 'Error de conexión.';
    }
})();