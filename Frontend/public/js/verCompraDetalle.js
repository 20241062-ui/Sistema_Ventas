document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const token = localStorage.getItem('token');

    if (!id) {
        alert("ID de compra no proporcionado");
        window.location.href = "adminCompras.html";
        return;
    }

    const API_URL = `https://sistemaventasback.vercel.app/api/compras/${id}`;

    try {
        const res = await fetch(API_URL, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("No se pudo obtener el detalle");

        const data = await res.json();
        const { compra, detalle } = data;

        // 1. Llenar cabecera
        document.getElementById("titulo-compra").textContent = `Detalle de Compra #${id}`;
        document.getElementById("rfc-proveedor").textContent = compra.RFC;
        document.getElementById("fecha-compra").textContent = new Date(compra.Fecha).toLocaleDateString('es-MX');
        document.getElementById("total-monto").textContent = `$${parseFloat(compra.TotalCompra).toFixed(2)}`;

        // 2. Llenar tabla de productos
        const tbody = document.getElementById("tabla-detalle-body");
        tbody.innerHTML = "";

        detalle.forEach(p => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${p.No_Serie}</td>
                <td>${p.producto}</td>
                <td>${p.descripcion || ''}</td>
                <td>${p.Cantidad}</td>
                <td>$${parseFloat(p.PrecioCompra).toFixed(2)}</td>
                <td>$${parseFloat(p.subtotal).toFixed(2)}</td>
            `;
            tbody.appendChild(tr);
        });

    } catch (error) {
        console.error("Error:", error);
        alert("Error al cargar el detalle de la compra");
    }
});