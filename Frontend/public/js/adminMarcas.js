document.addEventListener('DOMContentLoaded', async () => {
    const API_URL = 'https://sistemaventasback.vercel.app/api/admin/marcas';
    const token = localStorage.getItem('token');
    const tablaBody = document.getElementById('tabla-marcas-body');
    const btnBuscar = document.getElementById('btnBuscar');
    const inputBuscar = document.getElementById('inputBuscar');

    const cargarMarcas = async (buscar = "") => {
        try {
            const res = await fetch(`${API_URL}?buscar=${encodeURIComponent(buscar)}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const marcas = await res.json();

            if (!tablaBody) return;
            tablaBody.innerHTML = '';

            marcas.forEach(marca => {
                const tr = document.createElement('tr');

                const estaActiva = marca.Estado === 1;
                const textoBoton = estaActiva ? "Desactivar" : "Activar";
                const claseBoton = estaActiva ? "cancelar" : "guardar";

                tr.innerHTML = `
                    <td>${marca.intid_Marca}</td>
                    <td>${marca.vchNombre}</td>
                    <td>
                        <button class="guardar" onclick="window.location.href='marca_actualizar.html?id=${marca.intid_Marca}'">Editar</button>
                        <button class="${claseBoton}" onclick="toggleEstadoMarca(${marca.intid_Marca}, ${marca.Estado})">
                            ${textoBoton}
                        </button>
                    </td>
                `;
                tablaBody.appendChild(tr);
            });
        } catch (error) {
            console.error("Error al cargar marcas:", error);
        }
    };

    window.toggleEstadoMarca = async (id, estadoActual) => {
        const accion = estadoActual === 1 ? 'desactivar' : 'activar';
        if (!confirm(`¿Deseas ${accion} esta marca?`)) return;

        try {
            const res = await fetch(`${API_URL}/estado/${id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ estadoActual })
            });

            if (res.ok) {
                alert(`Marca ${accion}ada correctamente.`);
                location.reload();
            }
        } catch (error) {
            alert("Error al procesar el cambio de estado.");
        }
    };
    if (btnBuscar) {
        btnBuscar.addEventListener('click', () => cargarMarcas(inputBuscar.value));
    }

    cargarMarcas();
});