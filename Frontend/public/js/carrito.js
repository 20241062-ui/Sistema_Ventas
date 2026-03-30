document.addEventListener("DOMContentLoaded", () => {
    cargarCarrito();
});

async function cargarCarrito() {
    const token = localStorage.getItem("token");
    try {
        const res = await fetch("https://sistemaventasback.vercel.app/api/carrito", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const items = await res.json();
        
       
        if(document.getElementById("items-carrito")) {
            renderCarritoPrincipal(items);
        }
               
        renderMiniCarrito(items);
        
    } catch (error) {
        console.error("Error:", error);
    }
}

function renderCarritoPrincipal(items) {
    const contenedor = document.getElementById("items-carrito");
    const resumen = document.getElementById("resumen-seccion");
    const titulo = document.getElementById("titulo-bolsa");

    if (items.length === 0) {
        titulo.innerText = "Tu bolsa está vacía.";
        resumen.style.display = "none";
        return;
    }

    titulo.innerText = "Revisa tu bolsa.";
    resumen.style.display = "block";
    
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

    document.getElementById("subtotal").innerText = `$${total.toLocaleString('es-MX')}`;
    document.getElementById("total-final").innerText = `$${total.toLocaleString('es-MX')}`;
}

function renderMiniCarrito(items) {
    const miniContenedor = document.getElementById("mini-cart-items");
    const countLabel = document.getElementById("cart-count");
    
    countLabel.innerText = items.length;

    if (items.length === 0) {
        miniContenedor.innerHTML = "<p>Tu bolsa está vacía.</p>";
        return;
    }

    miniContenedor.innerHTML = items.slice(0, 3).map(item => `
        <div style="display:flex; align-items:center; gap:10px; margin-bottom:10px;">
            <img src="${item.vchImagen}" width="40">
            <span style="font-size:14px;">${item.vchNombre}</span>
        </div>
    `).join("");
}

async function eliminarProducto(id) {
    
    const res = await fetch(`https://sistemaventasback.vercel.app/api/carrito/${id}`, {
        method: 'DELETE',
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
    });
    if(res.ok) cargarCarrito();
}