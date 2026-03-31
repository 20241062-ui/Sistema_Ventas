const API_BASE = "https://sistemaventasback.vercel.app/api";
const IMG_BASE = "https://comercializadorall.grupoctic.com/ComercializadoraLL/img/";

document.addEventListener("DOMContentLoaded", () => {
    cargarCarrito();

    // Lógica del Dropdown (Mini Carrito)
    const cartBtn = document.getElementById("cart-icon-btn");
    const cartDropdown = document.getElementById("cart-dropdown");

    if (cartBtn && cartDropdown) {
        cartBtn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            cartDropdown.classList.toggle("show");
        });

        document.addEventListener("click", (e) => {
            if (!cartBtn.contains(e.target) && !cartDropdown.contains(e.target)) {
                cartDropdown.classList.remove("show");
            }
        });
    }
});

async function cargarCarrito() {
    const token = localStorage.getItem("token");
    const miniContenedor = document.getElementById("mini-cart-items");
    const countLabel = document.getElementById("cart-count");
    
    // 1. Resetear contador
    if (countLabel) countLabel.innerText = "0";

    // 2. Si no hay token, mostrar estado "Iniciar Sesión"
    if (!token) {
        if (miniContenedor) {
            miniContenedor.innerHTML = `
                <div class="cart-empty-state">
                    <p class="empty-title">Tu bolsa está vacía.</p>
                    <p class="empty-subtitle">Inicia sesión para ver tu bolsa.</p>
                </div>
                <div class="mini-cart-footer">
                    <a href="login.html" class="btn-bolsa">Iniciar sesión</a>
                </div>`;
        }
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/carrito`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (res.status === 401 || res.status === 403) {
            localStorage.removeItem("token");
            return;
        }

        const items = await res.json();
        if (countLabel) countLabel.innerText = items.length;

        // 3. Renderizar Mini Carrito (Dropdown) si existe
        if (miniContenedor) renderMiniCarrito(items);

        // 4. Renderizar Carrito Principal (Página completa) solo si existe el contenedor
        if (document.getElementById("items-carrito")) {
            renderCarritoPrincipal(items);
        }

    } catch (error) {
        console.error("Error crítico en el carrito:", error);
    }
}

function renderMiniCarrito(items) {
    const miniContenedor = document.getElementById("mini-cart-items");
    if (items.length === 0) {
        miniContenedor.innerHTML = `
            <div class="cart-empty-state"><p class="empty-title">Tu bolsa está vacía.</p></div>
            <div class="mini-cart-footer"><a href="index.html" class="btn-bolsa">Comprar ahora</a></div>`;
        return;
    }

    let html = `<h3>Artículos añadidos a tu bolsa</h3><div class="mini-items-list">`;
    html += items.map(item => `
        <div class="mini-item">
            <img src="${IMG_BASE}${item.vchImagen}" alt="${item.vchNombre}">
            <div class="mini-item-info">
                <h4>${item.vchNombre}</h4>
                <p>$${parseFloat(item.floPrecioUnitario).toLocaleString('es-MX')}</p>
            </div>
        </div>`).join("");
    
    html += `</div>
        <div class="mini-cart-footer">
            <a href="publico/carrito.html" class="btn-bolsa-border">Revisar la bolsa (${items.length})</a>
            <a href="checkout.html" class="btn-bolsa">Ir a pagar</a>
        </div>`;
    miniContenedor.innerHTML = html;
}

function renderCarritoPrincipal(items) {
    const contenedor = document.getElementById("items-carrito");
    const resumen = document.getElementById("resumen-seccion");
    const titulo = document.getElementById("titulo-bolsa");

    if (items.length === 0) {
        if (titulo) titulo.innerText = "Tu bolsa está vacía.";
        if (resumen) resumen.style.display = "none";
        contenedor.innerHTML = "";
        return;
    }

    if (titulo) titulo.innerText = "Revisa tu bolsa.";
    if (resumen) resumen.style.display = "block";

    let total = 0;
    contenedor.innerHTML = items.map(item => {
        const sub = item.floPrecioUnitario * item.intCantidad;
        total += sub;
        return `
            <div class="item-carrito">
                <div class="item-imagen"><img src="${IMG_BASE}${item.vchImagen}"></div>
                <div class="item-info">
                    <div class="info-detalles">
                        <h2>${item.vchNombre}</h2>
                        <p>Cantidad: ${item.intCantidad}</p>
                        <button class="btn-eliminar" onclick="eliminarProducto(${item.intid_Carrito})">Eliminar</button>
                    </div>
                    <div class="item-precio">$${sub.toLocaleString('es-MX')}</div>
                </div>
            </div>`;
    }).join("");

    document.getElementById("subtotal").innerText = `$${total.toLocaleString('es-MX')}`;
    document.getElementById("total-final").innerText = `$${total.toLocaleString('es-MX')}`;
}

async function eliminarProducto(id) {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE}/carrito/${id}`, {
        method: 'DELETE',
        headers: { "Authorization": `Bearer ${token}` }
    });
    if (res.ok) cargarCarrito();
}