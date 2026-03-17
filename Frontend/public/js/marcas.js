const API_URL = 'https://sistemaventasback.vercel.app/api/admin';
const token = localStorage.getItem('token');

document.addEventListener('DOMContentLoaded', () => {
    cargarMarcas();

    // Configurar el buscador
    const btnBuscar = document.getElementById('btnBuscar');
    const inputBuscar = document.getElementById('inputBuscar');

    if (btnBuscar) {
        btnBuscar.addEventListener('click', () => {
            cargarMarcas(inputBuscar.value);
        });
    }
});

async function cargarMarcas(busqueda = "") {
    const tabla = document.getElementById('tabla-marcas');
    try {
        const response = await fetch(`${API_URL}/marcas?buscar=${busqueda}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const marcas = await response.json();

        tabla.innerHTML = '';

        if (marcas.length === 0) {
            tabla.innerHTML = '<tr><td colspan="3">No se encontraron marcas.</td></tr>';
            return;
        }

        marcas.forEach(marca => {
            tabla.innerHTML += `
                <tr>
                    <td>${marca.intid_Marca}</td>
                    <td>${marca.vchNombre}</td>
                    <td>
                        <button class="guardar" onclick="irAEditar(${marca.intid_Marca})">Editar</button>
                        <button class="cancelar" onclick="eliminarMarca(${marca.intid_Marca})">Eliminar</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error al cargar marcas:", error);
    }
}

function irAEditar(id) {
    window.location.href = `marca_actualizar.html?id=${id}`;
}

async function eliminarMarca(id) {
    if (!confirm('¿Seguro de eliminar esta marca? (Se dará de baja)')) return;

    try {
        const response = await fetch(`${API_URL}/marcas/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const result = await response.json();
        if (result.status === "success") {
            alert(result.mensaje);
            cargarMarcas(); // Recargar la lista
        }
    } catch (error) {
        alert("Error al eliminar la marca");
    }
}