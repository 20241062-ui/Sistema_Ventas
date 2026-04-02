document.addEventListener("DOMContentLoaded", cargarDetalle)

async function cargarDetalle() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const token = localStorage.getItem('token');

    try {
        const res = await fetch(`https://sistemaventasback.vercel.app/api/compras/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("No se pudo obtener el detalle");

        const data = await res.json();
        const { compra, detalle } = data;

        document.querySelector("#id-compra").textContent = compra.id_Compra;
        document.querySelector("#proveedor").textContent = compra.RFC;
        document.querySelector("#fecha").textContent = new Date(compra.Fecha).toLocaleString();
        document.querySelector("#total").textContent = "$" + parseFloat(compra.TotalCompra).toFixed(2);

        const tbody = document.querySelector("#tabla-detalle-compra");
        tbody.innerHTML = "";

        detalle.forEach(d => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${d.No_Serie}</td>
                <td>${d.producto}</td>
                <td>$${parseFloat(d.PrecioCompra).toFixed(2)}</td>
                <td>${d.Cantidad}</td>
                <td>$${parseFloat(d.subtotal).toFixed(2)}</td>
            `;
            tbody.appendChild(fila);
        });
    } catch (error) {
        console.error("Error:", error);
        alert("Error al cargar el detalle de la compra.");
    }
}