document.addEventListener('DOMContentLoaded', async () => {
    const API_URL = 'https://sistemaventasback.vercel.app/api/admin/categorias';
    const token = localStorage.getItem('token');

    const tablaBody = document.getElementById('tabla-categorias-body');
    const totalLabel = document.getElementById('total-categorias');
    const btnBuscar = document.getElementById('btn-buscar');
    const inputBuscar = document.getElementById('input-buscar');

    const cargarCategorias = async (buscar = "") => {
        try {
            const res = await fetch(`${API_URL}?buscar=${encodeURIComponent(buscar)}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const categorias = await res.json();
            
            if (!tablaBody) return;
            
            tablaBody.innerHTML = '';
            totalLabel.textContent = categorias.length;

            if (categorias.length === 0) {
                tablaBody.innerHTML = '<tr><td colspan="3" style="text-align:center;">No hay categorías activas.</td></tr>';
                return;
            }

            categorias.forEach(cat => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${cat.intid_Categoria}</td>
                    <td>${cat.vchNombre}</td>
                    <td>
                        <button class="guardar" onclick="window.location.href='categoria_actualizar.html?id=${cat.intid_Categoria}'">Editar</button>
                        <button class="cancelar" onclick="eliminarLogico(${cat.intid_Categoria})">Eliminar</button>
                    </td>
                `;
                tablaBody.appendChild(tr);
            });
        } catch (error) {
            console.error("Error al cargar categorías:", error);
        }
    };

    // Función global para la Baja Lógica (Estado = 0)
    window.eliminarLogico = async (id) => {
        if (!confirm('¿Seguro que desea eliminar esta categoría?')) return;
        
        try {
            // Usamos el método DELETE que configuramos en el adminRoutes
            // El cual ejecuta: UPDATE tblcategoria SET Estado = 0 ...
            const res = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE', 
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const data = await res.json();
            if (res.ok) {
                alert(data.mensaje); // "Categoría eliminada correctamente"
                cargarCategorias(); // Recargar la lista
            } else {
                alert("Error: " + data.mensaje);
            }
        } catch (error) {
            alert("Error de conexión al intentar eliminar.");
        }
    };

    if (btnBuscar) {
        btnBuscar.addEventListener('click', () => cargarCategorias(inputBuscar.value));
    }

    cargarCategorias();
});