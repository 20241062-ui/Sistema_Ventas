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
                tr.innerHTML = `
                    <td>${marca.intid_Marca}</td>
                    <td>${marca.vchNombre}</td>
                    <td>
                        <button class="guardar" onclick="window.location.href='marca_actualizar.html?id=${marca.intid_Marca}'">Editar</button>
                        <button class="cancelar" onclick="eliminarMarcaLogica(${marca.intid_Marca})">Baja</button>
                    </td>
                `;
                tablaBody.appendChild(tr);
            });
        } catch (error) {
            console.error("Error al cargar marcas:", error);
        }
    };

    window.eliminarMarcaLogica = async (id) => {
        if (!confirm('¿Deseas dar de baja esta marca?')) return;
        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                alert("Marca desactivada correctamente.");
                cargarMarcas();
            }
        } catch (error) {
            alert("Error al procesar la baja.");
        }
    };
     if (btnBuscar) {
        btnBuscar.addEventListener('click', () => cargarMarcas(inputBuscar.value));
    }

    cargarMarcas();
});