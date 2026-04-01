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

    const esSubcarpeta = window.location.pathname.includes('/publico/');
    const rutaLogin = esSubcarpeta ? '../login.html' : 'login.html';
    const rutaCarritoPage = esSubcarpeta ? 'carrito.html' : 'publico/carrito.html';
    const rutaPago = esSubcarpeta ? 'pago.html' : 'publico/pago.html';

    if (!token) {
        if (miniCartContainer) miniCartContainer.innerHTML = `<div style="padding: 20px; text-align: center;"><p>Inicia sesión.</p></div>`;
        if (cartCount) cartCount.textContent = "0";
        return;
    }

    try {
        const res = await fetch(API_URL_CARRITO, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!res.ok) return;
        const items = await res.json();

        if (cartCount) cartCount.textContent = items.length;

        // Render Mini-Carrito
        if (miniCartContainer) {
            if (items.length === 0) {
                miniCartContainer.innerHTML = '<p style="padding:20px; text-align:center;">Bolsa vacía.</p>';
            } else {
                let html = '<div style="max-height: 300px; overflow-y: auto;">';
                items.forEach(item => {
                    const img = item.vchImagen || 'https://res.cloudinary.com/dnu57rgek/image/upload/v1774479182/sin-imagen.png';
                    html += `
                        <div style="display: flex; align-items: center; gap: 10px; padding: 10px; border-bottom: 1px solid #eee;">
                            <img src="${img}" style="width: 40px; height: 40px; object-fit: cover;">
                            <div style="flex: 1;">
                                <h4 style="margin:0; font-size: 12px;">${item.vchNombre}</h4>
                                <p style="margin:0; font-size: 11px;">$${parseFloat(item.floPrecioUnitario).toFixed(2)}</p>
                            </div>
                            <button onclick="eliminarDelCarrito('${item.intid_Carrito}')" style="border:none; color:red; cursor:pointer;">&times;</button>
                        </div>`;
                });
                html += `</div><div style="padding: 10px; display: grid; gap: 5px;">
                            <a href="${rutaCarritoPage}" style="text-align:center; border: 1px solid #000; padding: 5px; border-radius: 5px; text-decoration:none; color:#000;">Ver bolsa</a>
                         </div>`;
                miniCartContainer.innerHTML = html;
            }
        }

        // Render Página Completa
        if (itemsCarritoPage) {
            if (items.length === 0) {
                itemsCarritoPage.innerHTML = "<p>Tu bolsa está vacía.</p>";
                if (resumenSeccion) resumenSeccion.style.display = "none";
            } else {
                if (resumenSeccion) resumenSeccion.style.display = "block";
                let subtotal = 0;
                itemsCarritoPage.innerHTML = items.map(item => {
                    subtotal += item.floPrecioUnitario * item.intCantidad;
                    return `
                        <div class="item-carrito" style="display:flex; gap:20px; margin-bottom:20px; border-bottom:1px solid #eee; padding-bottom:10px;">
                            <img src="${item.vchImagen}" style="width:100px;">
                            <div>
                                <h2>${item.vchNombre}</h2>
                                <p>Cantidad: ${item.intCantidad}</p>
                                <p>Precio: $${parseFloat(item.floPrecioUnitario).toFixed(2)}</p>
                                <button onclick="eliminarDelCarrito('${item.intid_Carrito}')">Eliminar</button>
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

async function agregarProductoCarrito() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert("Inicia sesión primero.");
        return;
    }

    const vchNo_Serie = document.getElementById('det-id')?.value;
    if (!vchNo_Serie) return alert("Producto no identificado.");

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
            document.getElementById('cart-dropdown')?.classList.add('active');
        }
    } catch (err) { console.error(err); }
}

async function eliminarDelCarrito(id) {
    const token = localStorage.getItem('token');
    try {
        await fetch(`${API_URL_CARRITO}/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        actualizarInterfazCarrito();
    } catch (err) { console.error(err); }
}