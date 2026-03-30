document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "../login.html";
        return;
    }
    cargarCarrito();
});

async function cargarCarrito() {
    try {
        const res = await fetch("https://sistemaventasback.vercel.app/api/carrito", {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });
        const items = await res.json();
        renderCarrito(items);
    } catch (error) {
        console.error("Error al cargar carrito:", error);
    }
}

function renderCarrito(items) {
    const contenedor = document.getElementById("items-carrito");
    const titulo = document.getElementById("titulo-bolsa");
    const resumen = document.getElementById("resumen-seccion");

    if (!items || items.length === 0) {
        titulo.innerText = "Tu bolsa está vacía.";
        contenedor.innerHTML = "";
        resumen.style.display = "none";
        return;
    }

    titulo.innerText = "Tu bolsa.";
    resumen.style.display = "block";
    
    let total = 0;
    contenedor.innerHTML = items.map(item => {
        // CORRECCIÓN: Usamos floPrecioUnitario que es como viene de la DB
        const precio = parseFloat(item.floPrecioUnitario) || 0;
        const subtotalItem = precio * item.intCantidad;
        total += subtotalItem;

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
                        $${subtotalItem.toLocaleString('es-MX', {minimumFractionDigits: 2})}
                    </div>
                </div>
            </div>
        `;
    }).join("");

    document.getElementById("subtotal").innerText = `$${total.toLocaleString('es-MX', {minimumFractionDigits: 2})}`;
    document.getElementById("total-final").innerText = `$${total.toLocaleString('es-MX', {minimumFractionDigits: 2})}`;
}

// NUEVA FUNCIÓN: Para que el botón de eliminar funcione
async function eliminarDelCarrito(id) {
    if (!confirm("¿Eliminar este producto de la bolsa?")) return;

    try {
        const res = await fetch(`https://sistemaventasback.vercel.app/api/carrito/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });

        if (res.ok) {
            cargarCarrito(); // Recarga la lista
        } else {
            alert("No se pudo eliminar el producto");
        }
    } catch (error) {
        console.error("Error al eliminar:", error);
    }
}