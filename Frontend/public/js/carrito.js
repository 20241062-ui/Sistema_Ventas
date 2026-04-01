const API_URL_CARRITO = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api/carrito'
    : 'https://sistemaventasback.vercel.app/api/carrito';

document.addEventListener('DOMContentLoaded', () => {
    const cartIconBtn = document.getElementById('cart-icon-btn');
    const cartDropdown = document.getElementById('cart-dropdown');

    if (cartIconBtn && cartDropdown) {
        cartIconBtn.onclick = (e) => {
            e.preventDefault();
            cartDropdown.classList.toggle('active');
            actualizarInterfazCarrito();
        };

        document.addEventListener('click', (e) => {
            if (!cartIconBtn.contains(e.target) && !cartDropdown.contains(e.target)) {
                cartDropdown.classList.remove('active');
            }
        });
    }
    actualizarInterfazCarrito();
});

async function actualizarInterfazCarrito() {
    const token = localStorage.getItem('token');
    const miniCartContainer = document.getElementById('mini-cart-items');
    const cartCount = document.getElementById('cart-count');
    const itemsCarritoPage = document.getElementById('items-carrito');
    const resumenSeccion = document.getElementById('resumen-seccion');
    const tituloBolsa = document.getElementById('titulo-bolsa');

    const esSubcarpeta = window.location.pathname.includes('/views/');
    const rutaLogin = esSubcarpeta ? 'login.html' : 'views/login.html';
    const rutaCarritoPage = esSubcarpeta ? 'carrito.html' : 'views/publico/carrito.html';

    // --- ESTADO SIN SESIÓN ---
    if (!token) {
        if (miniCartContainer) {
            miniCartContainer.innerHTML = `
                <div class="cart-empty-state">
                    <p class="empty-title">Inicia sesión para ver tu bolsa.</p>
                    <div class="mini-cart-footer">
                        <a href="${rutaLogin}" class="btn-bolsa">Iniciar sesión</a>
                    </div>
                </div>`;
        }
        if (cartCount) cartCount.textContent = "0";
        if (itemsCarritoPage) itemsCarritoPage.innerHTML = "<p style='text-align:center; padding:50px;'>Inicia sesión para ver tu carrito.</p>";
        return;
    }

    try {
        const res = await fetch(API_URL_CARRITO, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const items = await res.json();

        if (cartCount) cartCount.textContent = items.length;

        // --- RENDER MINI-CARRITO (DROPDOWN - Imagen 155331.png) ---
        if (miniCartContainer) {
            if (items.length === 0) {
                miniCartContainer.innerHTML = '<div class="cart-empty-state"><p class="empty-subtitle">Tu bolsa está vacía.</p></div>';
            } else {
                let html = '<div id="mini-items-list">';
                items.forEach(item => {
                    const img = item.vchImagen || 'https://res.cloudinary.com/dnu57rgek/image/upload/v1774479182/sin-imagen.png';
                    html += `
                        <div class="mini-item">
                            <img src="${img}">
                            <div class="mini-item-info">
                                <h4>${item.vchNombre}</h4>
                                <p>Cantidad: ${item.intCantidad}</p>
                            </div>
                        </div>`;
                });
                html += `</div>
                         <div class="mini-cart-footer">
                            <a href="${rutaCarritoPage}" class="btn-bolsa-border">Ver mi carrito (${items.length})</a>
                            <a href="#" class="btn-bolsa">Ir a pagar</a>
                         </div>`;
                miniCartContainer.innerHTML = html;
            }
        }

        // --- RENDER PÁGINA COMPLETA (carrito.html - Imagen 140502.jpg) ---
        if (itemsCarritoPage) {
            if (items.length === 0) {
                if(tituloBolsa) tituloBolsa.textContent = "Tu bolsa está vacía.";
                if (resumenSeccion) resumenSeccion.style.display = "none";
                itemsCarritoPage.innerHTML = "";
            } else {
                if(tituloBolsa) tituloBolsa.textContent = "Revisa tu bolsa.";
                if (resumenSeccion) resumenSeccion.style.display = "block";
                
                let subtotal = 0;
                itemsCarritoPage.innerHTML = items.map(item => {
                    const precio = parseFloat(item.floPrecioUnitario);
                    subtotal += (precio * item.intCantidad);
                    return `
                        <div class="item-carrito">
                            <div class="item-imagen"><img src="${item.vchImagen}"></div>
                            <div class="item-info">
                                <div class="info-detalles">
                                    <h2>${item.vchNombre}</h2>
                                    <p>Cantidad: ${item.intCantidad}</p>
                                    <button class="btn-eliminar" onclick="eliminarDelCarrito('${item.intid_Carrito}')">Eliminar</button>
                                </div>
                                <div class="item-precio">$${precio.toLocaleString('es-MX')}</div>
                            </div>
                        </div>`;
                }).join('');
                
                document.getElementById('subtotal').textContent = `$${subtotal.toLocaleString('es-MX')}`;
                document.getElementById('total-final').textContent = `$${subtotal.toLocaleString('es-MX')}`;
            }
        }
    } catch (error) { console.error(error); }
}

async function eliminarDelCarrito(id) {
    const token = localStorage.getItem('token');
    if (!confirm("¿Eliminar este producto?")) return;
    await fetch(`${API_URL_CARRITO}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    actualizarInterfazCarrito();
}