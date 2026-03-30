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

  
    if (!token) {
        if (countLabel) countLabel.innerText = "0";
        if (miniContenedor) {
            miniContenedor.innerHTML = `
                <div class="cart-no-session" style="text-align: center; padding: 20px;">
                    <p style="font-size: 14px; color: #1d1d1f; margin-bottom: 15px;">
                        Para ver tu bolsa e iniciar una compra, inicia sesión.
                    </p>
                    <a href="login.html" class="btn-login-cart" style="
                        display: inline-block;
                        background-color: #0071e3;
                        color: white;
                        padding: 8px 20px;
                        border-radius: 8px;
                        text-decoration: none;
                        font-size: 13px;
                        font-weight: bold;">Iniciar sesión</a>
                </div>
            `;
        }
        return;
    }

   
    try {
        const res = await fetch("https://sistemaventasback.vercel.app/api/carrito", {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Error en la petición");

        const items = await res.json();
        
      
        if (countLabel) countLabel.innerText = items.length;

       
        if (document.getElementById("items-carrito")) {
            renderCarritoPrincipal(items);
        }
               
        
        renderMiniCarrito(items);
        
    } catch (error) {
        console.error("Error al cargar carrito:", error);
        if (miniContenedor) {
            miniContenedor.innerHTML = '<p class="empty-cart-msg">Error al conectar con el servidor.</p>';
        }
    }
}

function renderMiniCarrito(items) {
    const miniContenedor = document.getElementById("mini-cart-items");
    const cartDropdown = document.getElementById("cart-dropdown");
    if (!miniContenedor) return;

    if (items.length === 0) {
        miniContenedor.innerHTML = `
            <div class="empty-cart-msg">
                <p>Tu bolsa está vacía.</p>
            </div>`;
        return;
    }

   
    let html = items.map(item => `
        <div class="mini-item">
            <img src="${item.vchImagen}" alt="${item.vchNombre}">
            <div class="mini-item-info">
                <h4>${item.vchNombre}</h4>
                <p>$${parseFloat(item.floPrecioUnitario).toLocaleString('es-MX')}</p>
            </div>
        </div>
    `).join("");

    
    html += `
        <div style="margin-top: 15px;">
            <a href="carrito.html" class="btn-bolsa">Revisar la bolsa</a>
        </div>
    `;

    miniContenedor.innerHTML = html;
}

async function cargarCarrito() {
    const token = localStorage.getItem("token");
    const miniContenedor = document.getElementById("mini-cart-items");
    const countLabel = document.getElementById("cart-count");

    if (!token) {
        if (countLabel) countLabel.innerText = "0";
        if (miniContenedor) {
            miniContenedor.innerHTML = `
                <div class="cart-no-session" style="text-align: center;">
                    <p style="font-size: 14px; margin-bottom: 15px;">Inicia sesión para ver tu bolsa.</p>
                    <a href="login.html" class="btn-bolsa" style="background-color: #1d1d1f;">Iniciar sesión</a>
                </div>
            `;
        }
        return;
    }

    try {
        const res = await fetch("https://sistemaventasback.vercel.app/api/carrito", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const items = await res.json();
        
        if (countLabel) countLabel.innerText = items.length;
        
        // Renderizar mini carrito
        renderMiniCarrito(items);

        // Si estamos en la página de carrito full, renderizar también
        if (document.getElementById("items-carrito")) {
            renderCarritoPrincipal(items);
        }
        
    } catch (error) {
        console.error("Error:", error);
    }
}

function renderCarritoPrincipal(items) {
    const contenedor = document.getElementById("items-carrito");
    const resumen = document.getElementById("resumen-seccion");
    const titulo = document.getElementById("titulo-bolsa");

    if (!contenedor) return;

    if (items.length === 0) {
        titulo.innerText = "Tu bolsa está vacía.";
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