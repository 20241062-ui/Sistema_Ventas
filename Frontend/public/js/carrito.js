const API_URL_CARRITO = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api/carrito'
    : 'https://sistemaventasback.vercel.app/api/carrito';

document.addEventListener('DOMContentLoaded', () => {
    const cartIconBtn = document.getElementById('cart-icon-btn');
    const cartDropdown = document.getElementById('cart-dropdown');

    // 1. Lógica del Dropdown (Mini-carrito)
    if (cartIconBtn && cartDropdown) {
        cartIconBtn.onclick = (e) => {
            e.preventDefault();
            cartDropdown.classList.toggle('active');
            actualizarInterfazCarrito();
        };

        // Cerrar al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!cartIconBtn.contains(e.target) && !cartDropdown.contains(e.target)) {
                cartDropdown.classList.remove('active');
            }
        });
    }

    // Actualización inicial
    actualizarInterfazCarrito();
});

async function actualizarInterfazCarrito() {
    const token = localStorage.getItem('token');
    const miniCartContainer = document.getElementById('mini-cart-items');
    const cartCount = document.getElementById('cart-count');
    
    // Elementos de la página completa (carrito.html)
    const itemsCarritoPage = document.getElementById('items-carrito');
    const resumenSeccion = document.getElementById('resumen-seccion');
    const tituloBolsa = document.getElementById('titulo-bolsa');

    // Detectar profundidad de carpeta para las rutas de los enlaces
    const esSubcarpeta = window.location.pathname.includes('/publico/');
    const rutaCarritoPage = esSubcarpeta ? 'carrito.html' : 'publico/carrito.html';
    const rutaLogin = esSubcarpeta ? '../login.html' : 'login.html';
    const rutaPago = esSubcarpeta ? 'pago.html' : 'publico/pago.html';

    if (!token) {
        if (miniCartContainer) {
            miniCartContainer.innerHTML = `
                <div style="padding: 20px; text-align: center;">
                    <p style="color: #1d1d1f; margin-bottom: 15px;">Inicia sesión para ver tu bolsa.</p>
                    <a href="${rutaLogin}" style="background:#000; color:#fff; padding:8px 12px; border-radius:8px; text-decoration:none;">Iniciar sesión</a>
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
        
        if (!res.ok) throw new Error("Error al obtener datos");
        const items = await res.json();

        // Actualizar contador global
        if (cartCount) cartCount.textContent = items.length;

        // --- RENDER MINI-CARRITO (DROPDOWN) ---
        if (miniCartContainer) {
            if (items.length === 0) {
                miniCartContainer.innerHTML = '<p style="padding:20px; text-align:center; color:#888;">Tu bolsa está vacía.</p>';
            } else {
                let html = '<div style="max-height: 300px; overflow-y: auto;">';
                items.forEach(item => {
                    const img = item.vchImagen || 'https://res.cloudinary.com/dnu57rgek/image/upload/v1774479182/sin-imagen.png';
                    html += `
                        <div style="display: flex; align-items: center; gap: 10px; padding: 10px; border-bottom: 1px solid #eee;">
                            <img src="${img}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">
                            <div style="flex: 1;">
                                <h4 style="margin:0; font-size: 13px;">${item.vchNombre}</h4>
                                <p style="margin:0; font-size: 11px; color:#666;">$${parseFloat(item.floPrecioUnitario).toFixed(2)} x ${item.intCantidad}</p>
                            </div>
                            <button onclick="eliminarDelCarrito('${item.intid_Carrito}')" style="background:none; border:none; color:red; cursor:pointer; font-size:18px;">&times;</button>
                        </div>`;
                });
                html += `</div>
                         <div style="padding: 15px; display: flex; flex-direction: column; gap: 10px;">
                            <a href="${rutaCarritoPage}" style="text-align:center; border: 1px solid #000; padding: 8px; text-decoration:none; color:#000; border-radius:8px; font-size:14px;">Revisar la bolsa</a>
                            <a href="${rutaPago}" style="text-align:center; background:#000; color:#fff; padding:10px; border-radius:8px; text-decoration:none; font-size:14px;">Pagar ahora</a>
                         </div>`;
                miniCartContainer.innerHTML = html;
            }
        }

        // --- RENDER PÁGINA COMPLETA (carrito.html) ---
        if (itemsCarritoPage) {
            if (items.length === 0) {
                itemsCarritoPage.innerHTML = "";
                if(tituloBolsa) tituloBolsa.textContent = "Tu bolsa está vacía.";
                if (resumenSeccion) resumenSeccion.style.display = "none";
            } else {
                if(tituloBolsa) tituloBolsa.textContent = "Tu bolsa.";
                if (resumenSeccion) resumenSeccion.style.display = "block";
                
                let subtotal = 0;
                itemsCarritoPage.innerHTML = items.map(item => {
                    const totalFila = item.floPrecioUnitario * item.intCantidad;
                    subtotal += totalFila;
                    const img = item.vchImagen || 'https://res.cloudinary.com/dnu57rgek/image/upload/v1774479182/sin-imagen.png';
                    return `
                        <div class="item-carrito">
                            <div class="item-imagen"><img src="${img}"></div>
                            <div class="item-info">
                                <div class="info-detalles">
                                    <h2>${item.vchNombre}</h2>
                                    <p>Cantidad: ${item.intCantidad}</p>
                                    <button class="btn-eliminar" onclick="eliminarDelCarrito('${item.intid_Carrito}')">Eliminar</button>
                                </div>
                                <div class="item-precio">$${parseFloat(item.floPrecioUnitario).toFixed(2)}</div>
                            </div>
                        </div>`;
                }).join('');
                
                const subtotalElem = document.getElementById('subtotal');
                const totalFinalElem = document.getElementById('total-final');
                if(subtotalElem) subtotalElem.textContent = `$${subtotal.toLocaleString('es-MX', {minimumFractionDigits:2})}`;
                if(totalFinalElem) totalFinalElem.textContent = `$${subtotal.toLocaleString('es-MX', {minimumFractionDigits:2})}`;
            }
        }
    } catch (error) {
        console.error("Error al cargar carrito:", error);
    }
}

async function agregarProductoCarrito() {
    const token = localStorage.getItem('token');
    const esSubcarpeta = window.location.pathname.includes('/publico/');
    const rutaLogin = esSubcarpeta ? '../login.html' : 'login.html';

    if (!token) {
        alert("Debes iniciar sesión para agregar productos.");
        window.location.href = rutaLogin;
        return;
    }

    const inputId = document.getElementById('det-id');
    const vchNo_Serie = inputId ? inputId.value : null;

    if (!vchNo_Serie) {
        alert("Error: No se pudo identificar el producto.");
        return;
    }

    try {
        const response = await fetch(`${API_URL_CARRITO}/agregar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ vchNo_Serie, intCantidad: 1 })
        });

        const data = await response.json();
        if (response.ok) {
            await actualizarInterfazCarrito();
            const cartDropdown = document.getElementById('cart-dropdown');
            if (cartDropdown) cartDropdown.classList.add('active'); // Mostrar el mini-carrito al agregar
        } else {
            alert(data.mensaje || "Error al agregar");
        }
    } catch (error) {
        console.error("Error al agregar:", error);
        alert("Error de conexión con el servidor.");
    }
}

async function eliminarDelCarrito(id_carrito) {
    const token = localStorage.getItem('token');
    if (!token) return;
    if (!confirm("¿Eliminar este producto de la bolsa?")) return;

    try {
        const res = await fetch(`${API_URL_CARRITO}/${id_carrito}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
            actualizarInterfazCarrito();
        } else {
            const data = await res.json();
            alert(data.mensaje || "Error al eliminar");
        }
    } catch (error) {
        console.error("Error al eliminar:", error);
    }
}
