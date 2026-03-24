document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const token = localStorage.getItem('token');

    
    if (!id) {
        alert("ID de compra no proporcionado");
        window.location.href = "compra.html"; 
        return;
    }

   
    const API_URL = `https://sistemaventasback.vercel.app/api/compras/${id}`;

    try {
        const res = await fetch(API_URL, {
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) throw new Error("No se pudo obtener el detalle de la base de datos");

        const data = await res.json();
        const { compra, detalle } = data;

        
        if(document.getElementById("titulo-compra"))
            document.getElementById("titulo-compra").textContent = `Detalle de la Compra #${id}`;
        
        
        if(document.getElementById("id-compra"))
            document.getElementById("id-compra").textContent = compra.id_Compra;
        
      
        if(document.getElementById("proveedor"))
            document.getElementById("proveedor").textContent = compra.RFC;
        
       
        if(document.getElementById("fecha"))
            document.getElementById("fecha").textContent = new Date(compra.Fecha).toLocaleDateString('es-MX');
        
       
        if(document.getElementById("total"))
            document.getElementById("total").textContent = `$${parseFloat(compra.TotalCompra).toLocaleString('es-MX', {minimumFractionDigits: 2})}`;

       
        const tbody = document.getElementById("tabla-detalle-compra");
        
        if (tbody) {
            tbody.innerHTML = ""; 

            if (detalle.length === 0) {
                tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No hay productos registrados en esta compra.</td></tr>`;
                return;
            }

            detalle.forEach(p => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${p.No_Serie}</td>
                    <td>${p.producto}</td>
                    <td>${p.descripcion || ''}</td>
                    <td>$${parseFloat(p.PrecioCompra).toFixed(2)}</td>
                    <td>${p.Cantidad}</td>
                    <td>$${parseFloat(p.subtotal).toFixed(2)}</td>
                `;
                tbody.appendChild(tr);
            });
        }

    } catch (error) {
        console.error("Error detallado:", error);
        alert("Error al cargar el detalle: " + error.message);
    }
});