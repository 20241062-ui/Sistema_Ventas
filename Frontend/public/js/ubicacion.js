document.addEventListener('DOMContentLoaded', async () => {
    const select = document.getElementById('sucursalSelect');
    const mapa = document.getElementById('mapaSucursal');
    const card = document.getElementById('cardSucursal');
    const mensajeCarga = document.getElementById('mensaje-carga');
    const contenido = document.getElementById('contenido-ubicacion');

    const API_URL = 'https://sv-backend-api.vercel.app/api/public/sucursales';

    try {
        const response = await fetch(API_URL);
        const sucursales = await response.json();

        if (sucursales.length > 0) {
            mensajeCarga.style.display = 'none';
            contenido.style.display = 'block';

            sucursales.forEach((s, index) => {
                const option = document.createElement('option');
                option.value = s.vchlink_mapa;
                option.textContent = s.vchnombre;
                option.dataset.direccion = s.vchdireccion;
                option.dataset.ciudad = s.vchciudad;
                option.dataset.telefono = s.vchtelefono;
                option.dataset.horario = s.vchhorario;
                select.appendChild(option);
            });

            const actualizarVista = (s) => {
                mapa.src = s.value;
                card.innerHTML = `
                    <h2>${s.textContent}</h2>
                    <p><strong>Dirección:</strong> ${s.dataset.direccion}</p>
                    <p><strong>Ciudad:</strong> ${s.dataset.ciudad}</p>
                    <p><strong>Teléfono:</strong> ${s.dataset.telefono}</p>
                    <p><strong>Horario:</strong> ${s.dataset.horario}</p>
                `;
            };

            actualizarVista(select.options[0]);

            select.addEventListener('change', () => {
                actualizarVista(select.selectedOptions[0]);
            });

        } else {
            mensajeCarga.textContent = 'No hay sucursales registradas.';
        }
    } catch (error) {
        console.error('Error:', error);
        mensajeCarga.textContent = 'Error de conexión con el servidor.';
    }
});