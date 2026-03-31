document.addEventListener("DOMContentLoaded", () => {
    cargarCarrito();

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

    if (countLabel) countLabel.innerText = "0";
    if (!token) {
        if (miniContenedor) {
            miniContenedor.innerHTML = `<p class="empty-subtitle">Inicia sesión para ver tu bolsa.</p>`;
        }
        return; 
    }

    try {
        const res = await fetch("https://sistemaventasback.vercel.app/api/carrito", {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (res.status === 401 || res.status === 403) {
            localStorage.removeItem("token");
            return;
        }

        if (!res.ok) throw new Error("Error en la petición");
        const items = await res.json();
        
        if (countLabel) countLabel.innerText = items.length;

        if (miniContenedor) renderMiniCarrito(items);

        if (document.getElementById("items-carrito")) {
            renderCarritoPrincipal(items);
        }
        
    } catch (error) {
        console.error("Error al cargar carrito:", error);
    }
}

function renderMiniCarrito(items) {
    const miniContenedor = document.getElementById("mini-cart-items");
    if (!miniContenedor) return;

    if (items.length === 0) {
        miniContenedor.innerHTML = `
            <div class="cart-empty-state">
                <p class="empty-title">Tu bolsa está vacía.</p>
            </div>
            <div class="mini-cart-footer">
                <a href="index.html" class="btn-bolsa">Continuar comprando</a>
            </div>`;
        return;
    }

    let html = `<div class="mini-items-list">` + 
    items.map((item) => `
        <div class="mini-item">
            <img src="${item.vchImagen}" alt="${item.vchNombre}">
            <div class="mini-item-info">
                <h4>${item.vchNombre}</h4>
                <p>$${parseFloat(item.floPrecioUnitario).toLocaleString('es-MX')}</p>
            </div>
        </div>
    `).join("") + `</div>`;

    html += `
        <div class="mini-cart-footer">
            <a href="publico/carrito.html" class="btn-bolsa">Revisar la bolsa</a>
        </div>
    `;

    miniContenedor.innerHTML = html;
}

function renderCarritoPrincipal(items) {
    const contenedor = document.getElementById("items-carrito");
    const resumen = document.getElementById("resumen-seccion");
    const titulo = document.getElementById("titulo-bolsa");

    if (!contenedor) return;

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
        const subtotal = item.floPrecioUnitario * item.intCantidad;
        total += subtotal;
        return `
            <div class="item-carrito">
                <div class="item-imagen">
                    <img src="${item.vchImagen}" alt="${item.vchNombre}">
                </div>
                <div class="item-info">
                    <div class="info-detalles">
                        <h2>${item.vchNombre}</h2>
                        <p>Cantidad: ${item.intCantidad}</p>
                        <button class="btn-eliminar" onclick="eliminarProducto(${item.intid_Carrito})">Eliminar</button>
                    </div>
                    <div class="item-precio">
                        $${subtotal.toLocaleString('es-MX')}
                    </div>
                </div>
            </div>
        `;
    }).join("");

    const subtotalDom = document.getElementById("subtotal");
    const totalDom = document.getElementById("total-final");
    
    if (subtotalDom) subtotalDom.innerText = `$${total.toLocaleString('es-MX')}`;
    if (totalDom) totalDom.innerText = `$${total.toLocaleString('es-MX')}`;
}

async function eliminarProducto(id) {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
        const res = await fetch(`https://sistemaventasback.vercel.app/api/carrito/${id}`, {
            method: 'DELETE',
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
            cargarCarrito();
        }
    } catch (error) {
        console.error("Error al eliminar:", error);
    }
}