const API_URL_CARRITO = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api' 
    : 'https://sistemaventasback.vercel.app/api';

document.addEventListener('DOMContentLoaded', () => {
    cargarCarrito();

    // Lógica para abrir/cerrar el dropdown del carrito en el index
    const cartIcon = document.getElementById('cart-icon-btn');
    const cartDropdown = document.getElementById('cart-dropdown');
    if (cartIcon && cartDropdown) {
        cartIcon.addEventListener('click', (e) => {
            e.preventDefault();
            cartDropdown.classList.toggle('active');
        });
    }
});

async function cargarCarrito() {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const response = await fetch(`${API_URL_CARRITO}/carrito`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const items = await response.json();

        if (Array.isArray(items)) {
            actualizarInterfazCarrito(items);
        }
    } catch (error) {
        console.error("Error al cargar carrito:", error);
    }
}

function actualizarInterfazCarrito(items) {
   
    const contador = document.getElementById('cart-count');
    if (contador) contador.textContent = items.length;

    const contenedorPagina = document.getElementById('items-carrito');
    if (contenedorPagina) {
        renderizarPaginaCompleta(items);
    }

    const miniCart = document.getElementById('mini-cart-items');
    if (miniCart) {
        renderizarMiniCart(items);
    }
}

function renderizarPaginaCompleta(items) {
    const contenedor = document.getElementById('items-carrito');
    const titulo = document.getElementById('titulo-bolsa');
    const resumen = document.getElementById('resumen-seccion');
    const subtotalText = document.getElementById('subtotal');
    const totalText = document.getElementById('total-final');

    if (items.length === 0) {
        titulo.textContent = "Tu bolsa está vacía.";
        resumen.style.display = 'none';
        contenedor.innerHTML = '';
        return;
    }

    titulo.textContent = "Tu bolsa de compra.";
    resumen.style.display = 'block';
    
    let total = 0;
    contenedor.innerHTML = items.map(item => {
        total += item.floPrecioUnitario * item.intCantidad;
        return `
            <div class="item-carrito">
                <div class="item-imagen">
                    <img src="${item.vchImagen || 'https://res.cloudinary.com/dnu57rgek/image/upload/v1774479182/sin-imagen.png'}" alt="${item.vchNombre}">
                </div>
                <div class="item-info">
                    <div class="info-detalles">
                        <h2>${item.vchNombre}</h2>
                        <p>Cantidad: ${item.intCantidad}</p>
                        <button class="btn-eliminar" onclick="eliminarItem(${item.intid_Carrito})">Eliminar</button>
                    </div>
                    <div class="item-precio">
                        $${(item.floPrecioUnitario * item.intCantidad).toLocaleString('es-MX')}
                    </div>
                </div>
            </div>
        `;
    }).join('');

    subtotalText.textContent = `$${total.toLocaleString('es-MX')}`;
    totalText.textContent = `$${total.toLocaleString('es-MX')}`;
}

async function eliminarItem(id) {
    const token = localStorage.getItem('token');
    if (!confirm("¿Eliminar este producto?")) return;

    try {
        const res = await fetch(`${API_URL_CARRITO}/carrito/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) cargarCarrito();
    } catch (error) {
        console.error("Error al eliminar:", error);
    }
}