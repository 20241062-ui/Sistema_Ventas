document.addEventListener('DOMContentLoaded', async () => {
    // 1. Obtener el ID de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const productoId = urlParams.get('producto_id');

    // Validación de ID (ajustado el path para que funcione desde la carpeta views/publico/)
    if (!productoId) {
        window.location.href = '../../index.html'; 
        return;
    }

    const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:3000/api'
        : 'https://sistema-ventas-omega.vercel.app/api';

    try {
        const response = await fetch(`${API_URL}/productos/detalle/${productoId}`);
        
        if (!response.ok) {
            throw new Error("Producto no encontrado");
        }

        const prod = await response.json();

        // 2. Inyectar datos en el HTML
        // Verificamos que los elementos existan antes de asignarles valor
        if (document.getElementById('det-nombre')) {
            document.title = `${prod.vchNombre} - Doble L`;
            document.getElementById('det-marca').textContent = prod.Marca || "Genérico";
            document.getElementById('det-nombre').textContent = prod.vchNombre;
            document.getElementById('det-precio').textContent = `$${parseFloat(prod.floPrecioUnitario).toLocaleString('es-MX', {minimumFractionDigits: 2})}`;
            document.getElementById('det-descripcion').textContent = prod.vchDescripcion;
            
            // Importante: El input hidden para el ID de compra
            const inputId = document.getElementById('det-id');
            if (inputId) inputId.value = prod.vchNo_Serie;

            // 3. Manejo de la imagen
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
        console.error("Error cargando el detalle:", error);
        // Opcional: mostrar un mensaje en el HTML en lugar de un alert
        alert("Hubo un problema al cargar el producto. Volviendo al inicio.");
        window.location.href = '../../index.html';
    }
});