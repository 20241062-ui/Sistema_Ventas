document.addEventListener('DOMContentLoaded', async () => {
    // 1. Obtener el ID de la URL (ej: ?producto_id=VCH2007100)
    const urlParams = new URLSearchParams(window.location.search);
    const productoId = urlParams.get('producto_id');

    if (!productoId) {
        window.location.href = '../index.html';
        return;
    }

    const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:3000/api'
        : 'https://sistema-ventas-omega.vercel.app/api';

    try {
        const response = await fetch(`${API_URL}/productos/detalle/${productoId}`);
        const prod = await response.json();

        if (response.ok) {
            // Inyectar datos en el HTML
            document.title = `${prod.vchNombre} - Doble L`;
            document.getElementById('det-marca').textContent = prod.Marca;
            document.getElementById('det-nombre').textContent = prod.vchNombre;
            document.getElementById('det-precio').textContent = `$${parseFloat(prod.floPrecioUnitario).toLocaleString('es-MX', {minimumFractionDigits: 2})}`;
            document.getElementById('det-descripcion').textContent = prod.vchDescripcion;
            document.getElementById('det-id').value = prod.vchNo_Serie;

            const imgContenedor = document.getElementById('contenedor-img');
            imgContenedor.innerHTML = `<img src="https://comercializadorall.grupoctic.com/ComercializadoraLL/img/${prod.vchImagen || 'sin-imagen.png'}" alt="${prod.vchNombre}">`;
        } else {
            alert("Producto no encontrado");
            window.location.href = '../index.html';
        }
    } catch (error) {
        console.error("Error:", error);
    }
});