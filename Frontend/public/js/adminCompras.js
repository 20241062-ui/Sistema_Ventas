document.addEventListener("DOMContentLoaded", () => {
    cargarCompras();
    const btnBuscar = document.getElementById('btn-buscar');
    const inputBuscar = document.getElementById('input-buscar');

    if (btnBuscar) {
        btnBuscar.addEventListener('click', () => {
            cargarCompras(inputBuscar.value);
        });
    }

    if (inputBuscar) {
        inputBuscar.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                cargarCompras(inputBuscar.value);
            }
        });
    }
});

async function cargarCompras(buscar = "") {
    const tabla = document.querySelector("#tabla-compras-body");
    const totalElemento = document.querySelector("#total-compras");
    const token = localStorage.getItem('token');

    try {
        // IMPORTANTE: Enviamos el parámetro 'buscar' a tu API
        const url = `https://sistemaventasback.vercel.app/api/compras?buscar=${encodeURIComponent(buscar)}`;
        
        const res = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Error al obtener la lista de compras");

        const data = await res.json();

        if (tabla) {
            tabla.innerHTML = "";
            
            if (!data.compras || data.compras.length === 0) {
                tabla.innerHTML = `<tr><td colspan="5" style="text-align:center;">No se encontraron resultados.</td></tr>`;
            } else {
                data.compras.forEach(c => {
                    const fecha = new Date(c.Fecha).toLocaleDateString('es-MX');
                    const total = parseFloat(c.TotalCompra).toFixed(2);
                    
                    const fila = document.createElement("tr");
                    fila.innerHTML = `
                        <td>${c.id_Compra}</td>
                        <td>${c.RFC}</td>
                        <td>$${total}</td>
                        <td>${fecha}</td>
                        <td>
                            <button class="guardar" onclick="irADetalle(${c.id_Compra})">
                                Ver
                            </button>
                        </td>
                    `;
                    tabla.appendChild(fila);
                });
            }
        }

        if (totalElemento) totalElemento.textContent = data.total || 0;

    } catch (error) {
        console.error("Error:", error);
        if (tabla) tabla.innerHTML = `<tr><td colspan="5" style="color:red; text-align:center;">Error al cargar datos.</td></tr>`;
    }
}


window.irADetalle = function(id) {
    window.location.href = `compra_ver.html?id=${id}`;
};