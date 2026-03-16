document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const token = localStorage.getItem('token'); // Si usas autenticación

    const API_URL = "https://sistemaventasback.vercel.app/api/compras";

    // Solo ejecuta si hay un ID (Detalle)
    if (!id) {
        // Si no hay ID, verificamos si estamos en la página de lista
        // para no molestar al usuario con alertas innecesarias.
        const esPaginaDetalle = window.location.pathname.includes('compra_ver.html');
        if (esPaginaDetalle) {
            alert("ID de compra no proporcionado");
        }
        return; // Se detiene sin hacer el fetch
    }

    try {
        const res = await fetch(`${API_URL}/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!res.ok) throw new Error("No se pudo obtener el detalle de la compra");

        const data = await res.json();

        // --- 1. Llenar Información de la Cabecera ---
        // data.compra contiene los datos generales (RFC, Fecha, Total)
        const compra = data.compra;
        const productos = data.detalle || [];

        document.getElementById("titulo-compra").textContent = `Detalle de Compra #${id}`;
        document.getElementById("rfc-proveedor").textContent = compra.RFC;
        document.getElementById("fecha-compra").textContent = new Date(compra.Fecha).toLocaleDateString('es-MX');
        document.getElementById("total-monto").textContent = `$${parseFloat(compra.TotalCompra).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;

        // --- 2. Llenar la Tabla de Productos ---
        const tbody = document.getElementById("tabla-detalle-body");
        tbody.innerHTML = "";

        if (productos.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No hay productos en esta compra.</td></tr>`;
            return;
        }

        productos.forEach(p => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${p.No_Serie}</td>
                <td>${p.producto}</td>
                <td>${p.descripcion || ''}</td>
                <td>${p.Cantidad}</td>
                <td>$${parseFloat(p.PrecioCompra).toFixed(2)}</td>
                <td>$${parseFloat(p.subtotal).toFixed(2)}</td>
            `;
            tbody.appendChild(fila);
        });

    } catch (error) {
        console.error("Error:", error);
        alert("Error al cargar el detalle de la compra");
    }
});