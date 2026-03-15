document.addEventListener("DOMContentLoaded", cargarCompras);

async function cargarCompras() {
    const tabla = document.querySelector("#tabla-compras-body");
    const totalElemento = document.querySelector("#total-compras");

    try {
        const res = await fetch("https://sistemaventasback.vercel.app/api/compras");
        if (!res.ok) {
            throw new Error(`Error en la petición: ${res.status}`);
        }
        const data = await res.json();

        tabla.innerHTML = "";

        if (!data.compras || data.compras.length === 0) {
            tabla.innerHTML = `<tr><td colspan="5" style="text-align:center;">No hay compras registradas.</td></tr>`;
            totalElemento.textContent = "0";
            return;
        }

        data.compras.forEach(c => {
            const fila = document.createElement("tr");
            
            const fechaFormateada = new Date(c.Fecha).toLocaleDateString('es-MX');

            fila.innerHTML = `
                <td>${c.id_Compra}</td>
                <td>${c.RFC}</td>
                <td>$${parseFloat(c.TotalCompra).toLocaleString('es-MX', {minimumFractionDigits: 2})}</td>
                <td>${fechaFormateada}</td>
                <td>
                    <button class="guardar" onclick="verCompra(${c.id_Compra})">
                        Ver
                    </button>
                </td>
            `;
            tabla.appendChild(fila);
        });

        totalElemento.textContent = data.total;

    } catch (error) {
        console.error("Error cargando compras:", error);
        tabla.innerHTML = `<tr><td colspan="5" style="text-align:center; color:red;">Error al conectar con el servidor.</td></tr>`;
    }
}

function verCompra(id) {
    window.location.href = `compra_ver.html?id=${id}`; 
}