const API_URL_CARRITO = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api' 
    : 'https://sistemaventasback.vercel.app/api';

document.addEventListener('DOMContentLoaded', () => {
    cargarCarrito();

   
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

async function agregarProductoCarrito() {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Debes iniciar sesión para agregar productos.");
        return;
    }

    const inputId = document.getElementById('det-id');
    if (!inputId || !inputId.value) {
        alert("Error: No se encontró el ID del producto.");
        return;
    }

    const vchNo_Serie = inputId.value;
    
    try {
        const response = await fetch(`${API_URL_CARRITO}/carrito/agregar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ vchNo_Serie, intCantidad: 1 })
        });

        const data = await response.json();
        if (data.status === 'success') {
            alert("✅ Producto añadido");
            cargarCarrito(); 
        } else {
            alert("Error: " + data.mensaje);
        }
    } catch (error) {
        alert("Error de conexión");
    }
}

function actualizarInterfazCarrito(items) {
    const contador = document.getElementById('cart-count');
    if (contador) contador.textContent = items.length;

   
    if (document.getElementById('items-carrito')) {
        renderizarPaginaCompleta(items);
    }


    const miniCart = document.getElementById('mini-cart-items');
    if (miniCart) {
        if (items.length === 0) {
            miniCart.innerHTML = '<p style="padding:10px;">Tu bolsa está vacía</p>';
        } else {
            miniCart.innerHTML = items.slice(0, 3).map(item => `
                <div class="mini-item">
                    <span>${item.vchNombre} x ${item.intCantidad}</span>
                </div>
            `).join('') + '<a href="publico/carrito.html" class="ver-mas">Ver todo</a>';
        }
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
        if(resumen) resumen.style.display = 'none';
        contenedor.innerHTML = '';
        return;
    }

    if(titulo) titulo.textContent = "Tu bolsa de compra.";
    if(resumen) resumen.style.display = 'block';
    
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
                    <div class="item-precio">$${(item.floPrecioUnitario * item.intCantidad).toLocaleString('es-MX')}</div>
                </div>
            </div>`;
    }).join('');

    if(subtotalText) subtotalText.textContent = `$${total.toLocaleString('es-MX')}`;
    if(totalText) totalText.textContent = `$${total.toLocaleString('es-MX')}`;
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
        console.error(error);
    }
}