let carrito = [];
const token = localStorage.getItem('token');
const API_BASE = "https://sistemaventasback.vercel.app/api";

document.addEventListener('DOMContentLoaded', () => {
    cargarProveedores();
    cargarProductos();
});

// 1. Cargar proveedores en el Select
async function cargarProveedores() {
    try {
        const res = await fetch(`${API_BASE}/public/proveedores`); // Ajusta a tu ruta de proveedores
        const proveedores = await res.json();
        const select = document.getElementById("vchRFC");
        
        select.innerHTML = '<option value="">Seleccione un proveedor...</option>';
        proveedores.forEach(p => {
            const opt = document.createElement("option");
            opt.value = p.vchRFC;
            opt.textContent = `${p.vchNombre} ${p.vchApellido_Paterno} (${p.vchRazon_Social || 'Sin Razón Social'})`;
            select.appendChild(opt);
        });
    } catch (error) {
        console.error("Error cargando proveedores:", error);
    }
}

// 2. Cargar productos en el Select
async function cargarProductos() {
    try {
        const res = await fetch(`${API_BASE}/productos`); // Usamos tu ruta de productos ya configurada
        const data = await res.json();
        const select = document.getElementById("select-producto");
        
        select.innerHTML = '<option value="">Seleccione un producto...</option>';
        data.productos.forEach(p => {
            const opt = document.createElement("option");
            opt.value = p.vchNo_Serie;
            opt.textContent = p.vchNombre;
            select.appendChild(opt);
        });
    } catch (error) {
        console.error("Error cargando productos:", error);
    }
}

// 3. Añadir producto a la lista temporal (Carrito)
window.añadirAlCarrito = function() {
    const select = document.getElementById("select-producto");
    const inputCant = document.getElementById("cantidad");
    const inputPrecio = document.getElementById("precio");

    if (!select.value || inputCant.value <= 0 || inputPrecio.value <= 0) {
        alert("Por favor, complete todos los campos del producto con valores válidos.");
        return;
    }

    const item = {
        no_serie: select.value,
        nombre: select.options[select.selectedIndex].text,
        cantidad: parseInt(inputCant.value),
        precio: parseFloat(inputPrecio.value),
        subtotal: parseInt(inputCant.value) * parseFloat(inputPrecio.value)
    };

    carrito.push(item);
    actualizarTabla();
    
    // Limpiar campos de entrada
    inputCant.value = "";
    inputPrecio.value = "";
    select.value = "";
};

function actualizarTabla() {
    const tbody = document.getElementById("tabla-carrito");
    const totalDoc = document.getElementById("total-compra");
    let totalAcumulado = 0;

    tbody.innerHTML = "";

    carrito.forEach((item, index) => {
        totalAcumulado += item.subtotal;
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${item.nombre}</td>
            <td>${item.cantidad}</td>
            <td>$${item.precio.toFixed(2)}</td>
            <td>$${item.subtotal.toFixed(2)}</td>
            <td><button class="cancelar" onclick="quitarDelCarrito(${index})">Quitar</button></td>
        `;
        tbody.appendChild(tr);
    });

    totalDoc.textContent = `$${totalAcumulado.toFixed(2)}`;
}

window.quitarDelCarrito = function(index) {
    carrito.splice(index, 1);
    actualizarTabla();
};

// 4. Enviar todo al Backend (Finalizar)
window.finalizarCompra = async function() {
    const rfc = document.getElementById("vchRFC").value;

    if (!rfc) return alert("Debe seleccionar un proveedor.");
    if (carrito.length === 0) return alert("El carrito está vacío.");

    const datosCompra = {
        rfc: rfc,
        total: carrito.reduce((sum, item) => sum + item.subtotal, 0),
        productos: carrito
    };

    try {
        const res = await fetch(`${API_BASE}/compras`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(datosCompra)
        });

        if (res.ok) {
            alert("✅ Compra registrada y stock actualizado con éxito.");
            window.location.href = "compra.html";
        } else {
            const error = await res.json();
            alert("Error: " + error.mensaje);
        }
    } catch (error) {
        alert("No se pudo conectar con el servidor.");
    }
};