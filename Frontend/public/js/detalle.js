document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productoId = urlParams.get('producto_id');

    if (!productoId) {
        window.location.href = '../../index.html'; 
        return;
    }

    const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:3000/api'
        : 'https://sistemaventasback.vercel.app/api';

    try {
        const response = await fetch(`${API_URL}/productos/detalle/${productoId}`);
        if (!response.ok) throw new Error("Producto no encontrado");
        const prod = await response.json();

        // Llenar la interfaz
        document.title = `${prod.vchNombre} - Doble L`;
        document.getElementById('det-marca').textContent = prod.Marca || "Genérico";
        document.getElementById('det-nombre').textContent = prod.vchNombre;
        document.getElementById('det-precio').textContent = `$${parseFloat(prod.floPrecioUnitario).toLocaleString('es-MX', {minimumFractionDigits: 2})}`;
        document.getElementById('det-descripcion').textContent = prod.vchDescripcion;
        
        // Guardar el No_Serie en el input hidden para usarlo después
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
    } catch (error) {
        console.error("Error al cargar detalle:", error);
        window.location.href = '../../index.html';
    }
});

// FUNCIÓN GLOBAL PARA EL BOTÓN "COMPRAR AHORA"
async function agregarProductoCarrito() {
    const token = localStorage.getItem("token");
    
    if (!token) {
        alert("Por favor, inicia sesión para añadir productos a tu bolsa.");
        return;
    }

    const vchNo_Serie = document.getElementById('det-id').value;
    
    const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:3000/api'
        : 'https://sistemaventasback.vercel.app/api';

    try {
        const response = await fetch(`${API_URL}/carrito/agregar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ 
                vchNo_Serie: vchNo_Serie, 
                intCantidad: 1 
            })
        });

        const data = await response.json();
        
        if (data.status === 'success') {
            alert("¡Producto añadido a la bolsa!");
            
            // Si tienes el script de carrito.js cargado en esta página, 
            // esto actualizará el contador del header automáticamente.
            if (typeof cargarCarrito === 'function') {
                cargarCarrito();
            }
        } else {
            alert("Error: " + (data.mensaje || "No se pudo agregar"));
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Hubo un problema al conectar con el servidor.");
    }
}