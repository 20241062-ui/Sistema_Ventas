document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const API_URL = "https://sistemaventasback.vercel.app/api/ventas";

    if (!id) {
        console.error("No se encontró el ID de la venta en la URL");
        alert("ID de venta no proporcionado.");
        return;
    }

    const tbody = document.getElementById("tabla-detalle");

    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            throw new Error(`Error en el servidor: ${res.status}`);
        }

        const data = await res.json();

        const venta = data.venta;
        const detalle = data.detalle || [];

        if (!venta) {
            alert("No se encontró la información de esta venta.");
            return;
        }

        
        document.getElementById("titulo-venta").textContent = `Detalle de la Venta #${id}`;
        
        
        document.getElementById("cliente").textContent = venta.vchNombreCliente || venta.nombre_cliente || "N/A";
        document.getElementById("fecha").textContent = venta.dtFechaVenta || venta.Fecha_Venta || "N/A";
        document.getElementById("total-productos").textContent = detalle.length;
        
       
        const totalVenta = parseFloat(venta.floTotalVenta || venta.Total_Venta || 0);
        document.getElementById("total").textContent = `$${totalVenta.toFixed(2)}`;

       
        if (tbody) {
            tbody.innerHTML = ""; 

            if (detalle.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No hay productos registrados en esta venta.</td></tr>';
                return;
            }

            detalle.forEach(p => {
                const tr = document.createElement("tr");
                
                
                const precio = parseFloat(p.floPrecioUnitario || p.PrecioUnitario || 0).toFixed(2);
                const subtotal = parseFloat(p.floSubtotal || p.Subtotal || 0).toFixed(2);

                tr.innerHTML = `
                    <td>${p.vchNo_Serie || p.No_Serie || 'N/A'}</td>
                    <td>${p.vchNombre || p.producto || 'Sin nombre'}</td>
                    <td>${p.vchDescripcion || p.descripcion || ''}</td>
                    <td>$${precio}</td>
                    <td>${p.intCantidad || p.Cantidad || 0}</td>
                    <td>$${subtotal}</td>
                `;
                tbody.appendChild(tr);
            });
        }

    } catch (error) {
        console.error("Error en el detalle:", error);
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="6" style="color:red; text-align:center;">Error al cargar: ${error.message}</td></tr>`;
        }
    }
});