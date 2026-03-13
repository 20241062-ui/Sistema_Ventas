document.addEventListener('DOMContentLoaded', async () => {

    const token = localStorage.getItem('token');

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const API_URL = "https://sistema-ventas-omega.vercel.app/api/admin";

    const res = await fetch(`${API_URL}/ventas/${id}`, {

        headers: {
            'Authorization': `Bearer ${token}`
        }

    });

    const data = await res.json();

    const venta = data.venta;
    const detalle = data.detalle;

    document.getElementById("titulo-venta").textContent = `Detalle de la Venta #${id}`;
    document.getElementById("cliente").textContent = venta.nombre_cliente;
    document.getElementById("fecha").textContent = venta.Fecha_Venta;
    document.getElementById("total-productos").textContent = detalle.length;
    document.getElementById("total").textContent = `$${venta.Total_Venta}`;

    const tbody = document.getElementById("tabla-detalle");

    detalle.forEach(p => {

        const tr = document.createElement("tr");

        tr.innerHTML = `
        <td>${p.No_Serie}</td>
        <td>${p.producto}</td>
        <td>${p.descripcion}</td>
        <td>$${p.PrecioUnitario}</td>
        <td>${p.Cantidad}</td>
        <td>$${p.Subtotal}</td>
        `;

        tbody.appendChild(tr);

    });

});