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
    const inputBuscar = document.getElementById('input-buscar-ventas');
    const btnBuscar = document.getElementById('btn-buscar-ventas');

    const cargarVentas = async (buscar = "") => {
        try {
           
            tbody.innerHTML = '<tr><td colspan="7">Buscando ventas...</td></tr>';

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
                    <td colspan="7" style="text-align:center;">No se encontraron ventas con ese criterio.</td>
                </tr>`;
                return;
            }

            data.ventas.forEach(v => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td><strong>V-${v.id_Ventas}</strong></td>
                    <td>${v.nombre_cliente}</td>
                    <td>${v.Items}</td>
                    <td>$${parseFloat(v.Total_Venta).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                    <td>${v.Fecha_Venta}</td>
                    <td><span class="estado-completado">Completada</span></td>
                    <td>
                        <button class="guardar" 
                        onclick="window.location.href='venta_ver.html?id=${v.id_Ventas}'">
                        Ver Detalle
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);
            });

        } catch (error) {
            console.error("Error cargar ventas:", error);
            tbody.innerHTML = '<tr><td colspan="7" style="color:red;">Error al conectar con el servidor.</td></tr>';
        }
    };

    btnBuscar.onclick = () => {
        const valorBusqueda = inputBuscar.value.trim();
        cargarVentas(valorBusqueda);
    };

   inputBuscar.onkeypress = (e) => {
    if (e.key === 'Enter') {
        const valorBusqueda = inputBuscar.value.trim();
        cargarVentas(valorBusqueda);
    }
};

   
    cargarVentas();
});