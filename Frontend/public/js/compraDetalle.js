document.addEventListener('DOMContentLoaded', async () => {

    const token = localStorage.getItem('token');

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const API_URL = "https://sistema-ventas-omega.vercel.app/api/admin";

    try {

        const res = await fetch(`${API_URL}/compras/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if(!res.ok){
            alert("No se pudo cargar la compra");
            return;
        }

        const data = await res.json();

        const compra = data.compra;
        const detalle = data.detalle;

        document.getElementById("titulo-compra").textContent = `Detalle de la Compra #${id}`;
        document.getElementById("id-compra").textContent = compra.ID_Compra;
        document.getElementById("proveedor").textContent = compra.RFC_Proveedor;
        document.getElementById("fecha").textContent = compra.Fecha_Compra;
        document.getElementById("total").textContent = `$${compra.Total_Compra}`;

        const tbody = document.getElementById("tabla-detalle-compra");
        tbody.innerHTML = "";

        detalle.forEach(p => {

            const tr = document.createElement("tr");

            tr.innerHTML = `
            <td>${p.No_Serie}</td>
            <td>${p.producto}</td>
            <td>${p.descripcion}</td>
            <td>$${p.PrecioCompra}</td>
            <td>${p.Cantidad}</td>
            <td>$${p.Subtotal}</td>
            `;

            tbody.appendChild(tr);

        });

    } catch(error){
        console.error("Error cargando compra:", error);
    }

});