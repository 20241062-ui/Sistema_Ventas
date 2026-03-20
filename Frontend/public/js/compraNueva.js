let carrito = [];
const token = localStorage.getItem('token');
const API_BASE = "https://sistemaventasback.vercel.app/api";

document.addEventListener('DOMContentLoaded', () => {
    cargarProveedores();
    cargarProductos();
});


async function cargarProveedores() {
    const select = document.getElementById("vchRFC");
    try {
        const res = await fetch(`${API_BASE}/compras/aux/proveedores`);
        const proveedores = await res.json();

        select.innerHTML = '<option value="">Seleccione un proveedor...</option>';
        proveedores.forEach(p => {
            const opt = document.createElement("option");
            opt.value = p.vchRFC;
            
            
            opt.dataset.correo = p.vchCorreo || ""; 
            opt.dataset.nombre = p.vchRazon_Social || p.vchNombre;
            
            opt.textContent = p.vchRazon_Social || p.vchNombre;
            select.appendChild(opt);
        });
    } catch (error) {
        console.error("Error al cargar proveedores:", error);
        select.innerHTML = '<option value="">Error al cargar proveedores</option>';
    }
}


async function cargarProductos() {
    const select = document.getElementById("select-producto");
    try {
        const res = await fetch(`${API_BASE}/compras/aux/productos`);
        const productos = await res.json();

        select.innerHTML = '<option value="">Seleccione un producto...</option>';
        
        if (Array.isArray(productos)) {
            productos.forEach(p => {
                const opt = document.createElement("option");
                opt.value = p.vchNo_Serie; 
                opt.textContent = p.vchNombre;
                select.appendChild(opt);
            });
        }
    } catch (error) {
        console.error("Error al cargar productos:", error);
        select.innerHTML = '<option value="">Error al cargar productos</option>';
    }
}


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


window.finalizarCompra = async function() {
    const selectProv = document.getElementById("vchRFC");
    const rfc = selectProv.value;

    if (!rfc) return alert("Debe seleccionar un proveedor.");
    if (carrito.length === 0) return alert("El carrito está vacío.");

    
    const selectedOption = selectProv.options[selectProv.selectedIndex];
    const correoProveedor = selectedOption.dataset.correo;
    const nombreProveedor = selectedOption.dataset.nombre;

    if (!correoProveedor) {
        alert("El proveedor seleccionado no tiene un correo electrónico registrado. No se podrá enviar la notificación.");
    }

    const datosCompra = {
        rfc: rfc,
        nombreProveedor: nombreProveedor, 
        correoProveedor: correoProveedor, 
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
            alert("✅ Compra registrada y notificación enviada al proveedor con éxito.");
            window.location.href = "compra.html";
        } else {
            const error = await res.json();
            alert("Error: " + error.mensaje);
        }
    } catch (error) {
        console.error("Error al finalizar compra:", error);
        alert("No se pudo conectar con el servidor.");
    }
};