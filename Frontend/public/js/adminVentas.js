document.addEventListener('DOMContentLoaded', async () => {

    const token = localStorage.getItem('token');
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    const API_URL = "https://sv-backend-api.vercel.app/api";

    if (!token || usuario.rol !== "Administrador") {
        alert("Acceso restringido");
        window.location.href = "../login.html";
        return;
    }

    const tbody = document.getElementById("tabla-ventas-body");
    const totalVentas = document.getElementById("total-ventas");

    const cargarVentas = async (buscar = "") => {

        try {

            const res = await fetch(`${API_URL}/ventas?buscar=${buscar}`, {

                headers: {
                    'Authorization': `Bearer ${token}`
                }

            });

            const data = await res.json();

            totalVentas.textContent = data.total;

            tbody.innerHTML = "";

            if (!data.ventas.length) {

                tbody.innerHTML = `
                <tr>
                    <td colspan="7">No hay ventas registradas</td>
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

        }

    };

    cargarVentas();

});