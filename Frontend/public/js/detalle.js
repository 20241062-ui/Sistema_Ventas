const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api'
    : 'https://sistemaventasback.vercel.app/api';

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productoId = urlParams.get('producto_id');

    if (!productoId) {
        window.location.href = '../../index.html'; 
        return;
    }

    try {
        const response = await fetch(`${API_URL}/productos/detalle/${productoId}`);
        if (!response.ok) throw new Error("Producto no encontrado");
        const prod = await response.json();

        // Rellenar datos en el HTML
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
                const imgUrl = prod.vchImagen 
                    ? prod.vchImagen 
                    : 'https://res.cloudinary.com/dnu57rgek/image/upload/v1774479182/sin-imagen.png';

                imgContenedor.innerHTML = `
                    <img src="${imgUrl}" 
                        alt="${prod.vchNombre}" 
                        class="imagen-detalle-principal">
                `;
            }
        }
    } catch (error) {
        console.error("Error en detalle:", error);
        // Si hay error 500, revisa la consola del servidor (Node.js)
    }
});

// FUNCIÓN GLOBAL (Fuera del DOMContentLoaded para que el onclick la vea)
async function agregarProductoCarrito() {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Debes iniciar sesión para agregar productos.");
        return;
    }

    const vchNo_Serie = document.getElementById('det-id').value;
    
    try {
        const response = await fetch(`${API_URL}/carrito/agregar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ vchNo_Serie, intCantidad: 1 })
        });

        const data = await response.json();
        if (data.status === 'success') {
            alert("Producto agregado correctamente");
            // Llama a cargarCarrito si home.js o carrito.js están presentes
            if (typeof cargarCarrito === 'function') cargarCarrito();
        } else {
            alert("Error: " + data.mensaje);
        }
    } catch (error) {
        console.error("Error al agregar:", error);
        alert("Error de conexión con el servidor.");
    }
}