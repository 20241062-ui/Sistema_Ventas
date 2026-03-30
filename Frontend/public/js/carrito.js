document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "../login.html";
        return;
    }
    cargarCarrito();
});

async function cargarCarrito() {
    const res = await fetch("https://sistemaventasback.vercel.app/api/carrito", {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
    });
    const items = await res.json();
    renderCarrito(items);
}

function renderCarrito(items) {
    const contenedor = document.getElementById("items-carrito");
    const titulo = document.getElementById("titulo-bolsa");
    const resumen = document.getElementById("resumen-seccion");

    if (items.length === 0) {
        titulo.innerText = "Tu bolsa está vacía.";
        resumen.style.display = "none";
        return;
    }

    titulo.innerText = "Tu bolsa.";
    resumen.style.display = "block";
    
    let total = 0;
    contenedor.innerHTML = items.map(item => {
        total += item.fltPrecio * item.intCantidad;
        return `
            <div class="item-carrito">
                <div class="item-imagen">
                    <img src="${item.vchImagen}" alt="${item.vchNombre}">
                </div>
                <div class="item-info">
                    <div class="info-detalles">
                        <h2>${item.vchNombre}</h2>
                        <p>Cantidad: ${item.intCantidad}</p>
                        <button class="btn-eliminar" onclick="eliminarDelCarrito(${item.intid_Carrito})">Eliminar</button>
                    </div>
                    <div class="item-precio">
                        $${(item.fltPrecio * item.intCantidad).toLocaleString()}
                    </div>
                </div>
            </div>
        `;
    }).join("");

    document.getElementById("subtotal").innerText = `$${total.toLocaleString()}`;
    document.getElementById("total-final").innerText = `$${total.toLocaleString()}`;
}