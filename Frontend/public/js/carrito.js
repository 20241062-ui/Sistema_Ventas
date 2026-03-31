const API_URL_CARRITO = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api/carrito'
    : 'https://sistemaventasback.vercel.app/api/carrito';

document.addEventListener('DOMContentLoaded', () => {
    const cartIconBtn = document.getElementById('cart-icon-btn');
    const cartDropdown = document.getElementById('cart-dropdown');

    if (cartIconBtn && cartDropdown) {
        // Abrir/Cerrar el recuadro negro
        cartIconBtn.onclick = (e) => {
            e.preventDefault();
            cartDropdown.classList.toggle('active');
            actualizarInterfazCarrito();
        };

        // Cerrar si hacen clic fuera
        document.addEventListener('click', (e) => {
            if (!cartIconBtn.contains(e.target) && !cartDropdown.contains(e.target)) {
                cartDropdown.classList.remove('active');
            }
        });
    }

    // Carga inicial (contador y resumen)
    actualizarInterfazCarrito();
});

// 1. FUNCIÓN PARA MOSTRAR LOS PRODUCTOS (O EL LOGIN)
async function actualizarInterfazCarrito() {
    const token = localStorage.getItem('token');
    const miniCartContainer = document.getElementById('mini-cart-items');
    const cartCount = document.getElementById('cart-count');
    
    // Elementos de la página carrito.html (la bolsa completa)
    const itemsCarritoPage = document.getElementById('items-carrito');
    const resumenSeccion = document.getElementById('resumen-seccion');

    if (!token) {
        if (miniCartContainer) {
            miniCartContainer.innerHTML = `
                <div class="cart-empty-state" style="padding: 20px; text-align: center;">
                    <p style="color: white; margin-bottom: 15px;">Inicia sesión para ver tu bolsa y empezar a comprar.</p>
                    <a href="login.html" class="btn-superior" style="display: block; text-decoration: none; background: #fff; color: #000; padding: 10px; border-radius: 5px; font-weight: bold;">Iniciar sesión</a>
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

        // Render para el RESUMEN (Dropdown negro)
        if (miniCartContainer) {
            if (items.length === 0) {
                miniCartContainer.innerHTML = '<p style="padding: 20px; color: white; text-align:center;">Tu bolsa está vacía.</p>';
            } else {
                let html = '<div class="mini-cart-scroll" style="max-height: 300px; overflow-y: auto;">';
                items.forEach(item => {
                    html += `
                        <div class="item-mini" style="display: flex; align-items: center; gap: 10px; padding: 10px; border-bottom: 1px solid #333;">
                            <img src="${item.vchImagen}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">
                            <div style="flex: 1;">
                                <p style="color: white; font-size: 14px; margin: 0; font-weight: bold;">${item.vchNombre}</p>
                                <p style="color: #aaa; font-size: 12px; margin: 0;">$${parseFloat(item.floPrecioUnitario).toFixed(2)} x ${item.intCantidad}</p>
                            </div>
                            <button onclick="eliminarDelCarrito('${item.intid_Carrito}')" style="background:none; border:none; color:#ff4d4d; cursor:pointer; font-size:18px;">&times;</button>
                        </div>`;
                });
                html += `</div>
                         <div style="padding: 10px;">
                            <button onclick="window.location.href='carrito.html'" style="width: 100%; padding: 12px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">Ver mi bolsa completa</button>
                         </div>`;
                miniCartContainer.innerHTML = html;
            }
        }

        // Render para la PÁGINA COMPLETA (carrito.html)
        if (itemsCarritoPage) {
            if (items.length === 0) {
                itemsCarritoPage.innerHTML = "<h2 style='text-align:center;'>Tu bolsa está vacía</h2>";
                if (resumenSeccion) resumenSeccion.style.display = "none";
            } else {
                if (resumenSeccion) resumenSeccion.style.display = "block";
                let subtotal = 0;
                itemsCarritoPage.innerHTML = items.map(item => {
                    const totalFila = item.floPrecioUnitario * item.intCantidad;
                    subtotal += totalFila;
                    return `
                        <div class="carrito-item">
                            <img src="${item.vchImagen}" alt="${item.vchNombre}">
                            <div class="item-detalles">
                                <h3>${item.vchNombre}</h3>
                                <p>Serie: ${item.vchNo_Serie}</p>
                                <div class="item-controles">
                                    <span>Cantidad: ${item.intCantidad}</span>
                                    <button class="btn-eliminar" onclick="eliminarDelCarrito('${item.intid_Carrito}')">Eliminar</button>
                                </div>
                            </div>
                            <div class="item-precio">
                                <p>$${parseFloat(item.floPrecioUnitario).toFixed(2)}</p>
                            </div>
                        </div>`;
                }).join('');
                
                if(document.getElementById('subtotal')) document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
                if(document.getElementById('total-final')) document.getElementById('total-final').textContent = `$${subtotal.toFixed(2)}`;
            }
        }
    } catch (error) {
        console.error("Error al cargar carrito:", error);
    }
}

// 2. FUNCIÓN PARA AGREGAR (Se activa al dar clic en "Comprar ahora")
async function agregarProductoCarrito() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert("Debes iniciar sesión para agregar productos.");
        window.location.href = "../login.html";
        return;
    }

    const vchNo_Serie = document.getElementById('det-id').value;
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
            actualizarInterfazCarrito();
            // Abrir el resumen para que el usuario vea que se agregó
            document.getElementById('cart-dropdown').classList.add('active');
        } else {
            alert(data.mensaje || "Error al agregar");
        }
    } catch (error) {
        console.error("Error al agregar:", error);
    }
}

// 3. FUNCIÓN PARA ELIMINAR
async function eliminarDelCarrito(id_carrito) {
    const token = localStorage.getItem('token');
    if (!confirm("¿Eliminar este producto de la bolsa?")) return;

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