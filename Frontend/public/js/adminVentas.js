document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const API_URL = "https://sistemaventasback.vercel.app/api";

    if (!token || !usuario || usuario.rol !== "Administrador") {
        alert("Acceso restringido");
        window.location.href = "../login.html";
        return;
    }

    const tbody = document.getElementById("tabla-ventas-body");
    const totalVentas = document.getElementById("total-ventas");
    
    // Referencias para la búsqueda
    const inputBuscar = document.getElementById('input-buscar-ventas');
    const btnBuscar = document.getElementById('btn-buscar-ventas');

    const cargarVentas = async (buscar = "") => {
        try {
            // Limpiamos la tabla y ponemos un mensaje de carga
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

    // Lógica del botón Buscar (Igual que en productos)
    if (btnBuscar) {
        btnBuscar.onclick = () => {
            const busquedaActual = inputBuscar.value.trim();
            cargarVentas(busquedaActual);
        };
    }

    // Carga inicial
    cargarVentas();
});