document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productoId = urlParams.get('producto_id');

    if (!productoId) {
        window.location.href = '../../index.html'; 
        return;
    }

    const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:3000/api'
        : 'https://sv-backend-api.vercel.app/api';

    try {
        const response = await fetch(`${API_URL}/productos/detalle/${productoId}`);
        if (!response.ok) throw new Error("Producto no encontrado");
        const prod = await response.json();

        if (document.getElementById('det-nombre')) {
            document.title = `${prod.vchNombre} - Doble L`;
            document.getElementById('det-marca').textContent = prod.Marca || "Genérico";
            document.getElementById('det-nombre').textContent = prod.vchNombre;
            document.getElementById('det-precio').textContent = `$${parseFloat(prod.floPrecioUnitario).toLocaleString('es-MX', {minimumFractionDigits: 2})}`;
            document.getElementById('det-descripcion').textContent = prod.vchDescripcion;
            
            const inputId = document.getElementById('det-id');
            if (inputId) inputId.value = prod.vchNo_Serie;

            const imgContenedor = document.getElementById('contenedor-img');
            if (imgContenedor) {
                const nombreImagen = prod.vchImagen || 'sin-imagen.png';
                imgContenedor.innerHTML = `
                    <img src="https://comercializadorall.grupoctic.com/ComercializadoraLL/img/${nombreImagen}" 
                        alt="${prod.vchNombre}" 
                        class="imagen-detalle-principal">
                `;
            }
        }
    } catch (error) {
        console.error("Error:", error);
        window.location.href = '../../index.html';
    }
});