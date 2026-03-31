const API_URL_CARRITO = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api/carrito'
    : 'https://sistemaventasback.vercel.app/api/carrito';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Manejo del Dropdown (Abrir/Cerrar)
    const cartIconBtn = document.getElementById('cart-icon-btn');
    const cartDropdown = document.getElementById('cart-dropdown');

    if (cartIconBtn && cartDropdown) {
        cartIconBtn.addEventListener('click', (e) => {
            e.preventDefault();
            cartDropdown.classList.toggle('active');
            actualizarInterfazCarrito();
        });

        // Cerrar al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!cartIconBtn.contains(e.target) && !cartDropdown.contains(e.target)) {
                cartDropdown.classList.remove('active');
            }
        });
    }

    actualizarInterfazCarrito();
});

// Función global para actualizar tanto el resumen (dropdown) como la página completa
async function actualizarInterfazCarrito() {
    const token = localStorage.getItem('token');
    const miniCartContainer = document.getElementById('mini-cart-items');
    const cartCount = document.getElementById('cart-count');
    
    // Elementos de la página carrito.html
    const itemsCarritoPage = document.getElementById('items-carrito');
    const resumenSeccion = document.getElementById('resumen-seccion');
    const tituloBolsa = document.getElementById('titulo-bolsa');

    if (!token) {
        // CASO: SIN SESIÓN (Mostrar cuadro de la imagen 1)
        if (miniCartContainer) {
            miniCartContainer.innerHTML = `
                <div class="cart-empty-state">
                    <p>Inicia sesión para ver tu bolsa y empezar a comprar.</p>
                    <a href="/ComercializadoraLL/login.html" class="btn-login-cart">Iniciar sesión</a>
                </div>`;
        }
        if (cartCount) cartCount.textContent = "0";
        if (itemsCarritoPage) itemsCarritoPage.innerHTML = "<p>Inicia sesión para ver tus productos.</p>";
        return;
    }

    try {
        const res = await fetch(API_URL_CARRITO, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const items = await res.json();

        // Actualizar contador
        if (cartCount) cartCount.textContent = items.length;

        // Renderizar en el Dropdown (Index)
        if (miniCartContainer) {
            if (items.length === 0) {
                miniCartContainer.innerHTML = '<p class="empty-msg">Tu bolsa está vacía.</p>';
            } else {
                let html = '<div class="mini-cart-list">';
                items.forEach(item => {
                    html += `
                        <div class="mini-item">
                            <img src="${item.vchImagen}" alt="${item.vchNombre}">
                            <div class="mini-info">
                                <p class="name">${item.vchNombre}</p>
                                <p class="price">$${parseFloat(item.floPrecioUnitario).toFixed(2)} x ${item.intCantidad}</p>
                            </div>
                        </div>`;
                });
                html += `</div>
                         <div class="mini-footer">
                            <button onclick="window.location.href='/ComercializadoraLL/publico/carrito.html'" class="btn-ver-carrito">Ver mi bolsa</button>
                         </div>`;
                miniCartContainer.innerHTML = html;
            }
        }

        // Renderizar en la Página (carrito.html)
        if (itemsCarritoPage) {
            if (items.length === 0) {
                itemsCarritoPage.innerHTML = "";
                if (tituloBolsa) tituloBolsa.textContent = "Tu bolsa está vacía.";
                if (resumenSeccion) resumenSeccion.style.display = "none";
            } else {
                if (tituloBolsa) tituloBolsa.textContent = "Tu bolsa.";
                if (resumenSeccion) resumenSeccion.style.display = "block";
                
                let subtotal = 0;
                itemsCarritoPage.innerHTML = items.map(item => {
                    const filaTotal = item.floPrecioUnitario * item.intCantidad;
                    subtotal += filaTotal;
                    return `
                        <div class="carrito-item">
                            <img src="${item.vchImagen}" alt="${item.vchNombre}">
                            <div class="item-detalles">
                                <h3>${item.vchNombre}</h3>
                                <p>ID: ${item.vchNo_Serie}</p>
                                <div class="item-controles">
                                    <span>Cantidad: ${item.intCantidad}</span>
                                    <button class="btn-eliminar" onclick="eliminarProducto('${item.intid_Carrito}')">Eliminar</button>
                                </div>
                            </div>
                            <div class="item-precio">
                                <p>$${parseFloat(item.floPrecioUnitario).toFixed(2)}</p>
                            </div>
                        </div>`;
                }).join('');

                document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
                document.getElementById('total-final').textContent = `$${subtotal.toFixed(2)}`;
            }
        }

    } catch (error) {
        console.error("Error carrito:", error);
    }
}

// Función para agregar (Se llama desde detalle.js o index.js)
async function agregarProductoCarrito() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert("Debes iniciar sesión para agregar productos.");
        return;
    }

    const vchNo_Serie = document.getElementById('det-id').value;
    if (!vchNo_Serie) return;

    try {
        const response = await fetch(`${API_URL_CARRITO}/agregar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ vchNo_Serie, intCantidad: 1 })
        });

        if (response.ok) {
            actualizarInterfazCarrito();
            // Abrir el dropdown automáticamente para mostrar que se agregó
            document.getElementById('cart-dropdown').classList.add('active');
        }
    } catch (error) {
        console.error("Error al agregar:", error);
    }
}

// Función para eliminar
async function eliminarProducto(id_carrito) {
    const token = localStorage.getItem('token');
    try {
        await fetch(`${API_URL_CARRITO}/${id_carrito}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        actualizarInterfazCarrito();
    } catch (error) {
        console.error("Error al eliminar:", error);
    }
}