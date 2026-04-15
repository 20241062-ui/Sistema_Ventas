document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const API_URL = "https://sistemaventasback.vercel.app/api";

    const tbody = document.getElementById("tabla-ventas-body");
    const totalVentas = document.getElementById("total-ventas");

    const btnBuscar = document.getElementById('btn-buscar');
    const inputBuscar = document.getElementById('input-buscar');

    const cargarVentas = async (buscar = "") => {
        try {
            tbody.innerHTML = '<tr><td colspan="7">Cargando ventas...</td></tr>';

            const res = await fetch(`${API_URL}/ventas?buscar=${encodeURIComponent(buscar)}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await res.json();
            totalVentas.textContent = data.total || 0;
            tbody.innerHTML = "";

            if (!data.ventas || data.ventas.length === 0) {
                tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align:center;">No se encontraron ventas registradas.</td>
                </tr>`;
                return;
            }

            data.ventas.forEach(v => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>V-${v.id_Ventas}</td>
                    <td>${v.nombre_cliente}</td>
                    <td>${v.Items}</td>
                    <td>$${parseFloat(v.Total_Venta).toFixed(2)}</td>
                    <td>${v.Fecha_Venta}</td>
                    <td>Completada</td>
                    <td>
                        <button class="guardar"
                        onclick="window.location.href='venta_ver.html?id=${v.id_Ventas}'">
                        Ver
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);
            });

        } catch (error) {
            console.error("Error cargar ventas:", error);
            tbody.innerHTML = '<tr><td colspan="7" style="color:red; text-align:center;">Error al obtener los datos del servidor.</td></tr>';
        }
    };

    const btnLimpiar = document.getElementById('btn-limpiar');

    if (btnBuscar) {
        btnBuscar.addEventListener('click', () => {
            const valorBusqueda = inputBuscar.value;
            cargarVentas(valorBusqueda);
        });
    }
    if (inputBuscar) {
        inputBuscar.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                cargarVentas(inputBuscar.value);
            }
        });
    }

    cargarVentas();
});