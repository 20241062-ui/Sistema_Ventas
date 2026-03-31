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

        document.addEventListener('click', (e) => {
            if (!cartIconBtn.contains(e.target) && !cartDropdown.contains(e.target)) {
                cartDropdown.classList.remove('active');
            }
        });
    }

    // Ejecución inicial para actualizar contadores y contenido
    actualizarInterfazCarrito();
});

async function actualizarInterfazCarrito() {
    const token = localStorage.getItem('token');
    const miniCartContainer = document.getElementById('mini-cart-items');
    const cartCount = document.getElementById('cart-count');
    
    // Elementos de la página carrito.html (pueden no existir en home.html)
    const itemsCarritoPage = document.getElementById('items-carrito');
    const resumenSeccion = document.getElementById('resumen-seccion');
    const tituloBolsa = document.getElementById('titulo-bolsa');

    // Caso: No hay sesión iniciada
    if (!token) {
        if (miniCartContainer) {
            miniCartContainer.innerHTML = `
                <div class="cart-empty-state" style="padding: 20px; text-align: center;">
                    <p style="color: #1d1d1f; margin-bottom: 15px;">Inicia sesión para ver tu bolsa.</p>
                    <a href="login.html" class="btn-bolsa">Iniciar sesión</a>
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

        // Actualizar el globo del contador (común en todas las páginas)
        if (cartCount) cartCount.textContent = items.length;

        // --- RENDER PARA EL DROPDOWN (Mini Cart) ---
        if (miniCartContainer) {
            if (items.length === 0) {
                miniCartContainer.innerHTML = '<div class="cart-empty-state"><p style="padding:20px; text-align:center; color:#888;">Tu bolsa está vacía.</p></div>';
            } else {
                let html = '<div class="mini-cart-scroll" style="max-height: 300px; overflow-y: auto;">';
                items.forEach(item => {
                    html += `
                        <div class="mini-item" style="display: flex; align-items: center; gap: 10px; padding: 10px; border-bottom: 1px solid #eee;">
                            <img src="${item.vchImagen}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">
                            <div style="flex: 1;">
                                <h4 style="margin:0; font-size: 14px; color:#000;">${item.vchNombre}</h4>
                                <p style="margin:0; font-size: 12px; color:#666;">$${parseFloat(item.floPrecioUnitario).toFixed(2)} x ${item.intCantidad}</p>
                            </div>
                            <button onclick="eliminarDelCarrito('${item.intid_Carrito}')" style="background:none; border:none; color:red; cursor:pointer; font-size:18px;">&times;</button>
                        </div>`;
                });
                html += `</div>
                         <div class="mini-cart-footer" style="padding: 15px; display: flex; flex-direction: column; gap: 10px;">
                            <a href="publico/carrito.html" class="btn-bolsa-border" style="text-align:center; display:block; border: 1px solid #000; padding: 8px; text-decoration:none; color:#000; border-radius:8px;">Revisar la bolsa</a>
                            <button onclick="window.location.href='pago.html'" class="btn-bolsa" style="background:#000; color:#fff; border:none; padding:10px; border-radius:8px; cursor:pointer;">Pagar</button>
                         </div>`;
                miniCartContainer.innerHTML = html;
            }
        }

        // --- RENDER PARA LA PÁGINA COMPLETA (carrito.html) ---
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
                    return `
                        <div class="item-carrito">
                            <div class="item-imagen"><img src="${item.vchImagen}"></div>
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
                if(subtotalElem) subtotalElem.textContent = `$${subtotal.toFixed(2)}`;
                if(totalFinalElem) totalFinalElem.textContent = `$${subtotal.toFixed(2)}`;
            }
        }
    } catch (error) {
        console.error("Error al cargar carrito:", error);
    }
}

// Función para agregar (usada en la vista de detalle)
async function agregarProductoCarrito() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert("Debes iniciar sesión para agregar productos.");
        window.location.href = "../login.html";
        return;
    }

    const inputId = document.getElementById('det-id');
    const vchNo_Serie = inputId ? inputId.value : null;

    if (!vchNo_Serie) {
        alert("Error: No se pudo obtener el ID del producto.");
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
            if (cartDropdown) cartDropdown.classList.add('active');
        } else {
            alert(data.mensaje || "Error al agregar");
        }
    } catch (error) {
        console.error("Error al agregar:", error);
    }
}

// Función para eliminar
async function eliminarDelCarrito(id_carrito) {
    const token = localStorage.getItem('token');
    if (!token || !confirm("¿Eliminar este producto de la bolsa?")) return;

    try {
        const res = await fetch(`${API_URL_CARRITO}/${id_carrito}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
            actualizarInterfazCarrito();
        }
    } catch (error) {
        console.error("Error al eliminar:", error);
    }
}