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
                tablaBody.innerHTML = '<tr><td colspan="3" style="text-align:center;">No se encontraron categorías.</td></tr>';
                return;
            }

            categorias.forEach(cat => {
                const tr = document.createElement('tr');
                if(cat.Estado === 0) tr.classList.add('inactivo');

                tr.innerHTML = `
                    <td>${cat.intid_Categoria}</td>
                    <td>${cat.vchNombre}</td>
                    <td>
                        <button class="guardar" onclick="window.location.href='categoria_actualizar.html?id=${cat.intid_Categoria}'">Editar</button>
                        
                        ${cat.Estado === 1 
                            ? `<button class="cancelar" onclick="gestionarEstado(${cat.intid_Categoria}, 'baja')">Baja</button>`
                            : `<button class="activar" onclick="gestionarEstado(${cat.intid_Categoria}, 'activar')" style="background-color: #28a745; color: white;">Activar</button>`
                        }
                    </td>
                `;
                tablaBody.appendChild(tr);
            });
        } catch (error) {
            console.error("Error al cargar categorías:", error);
        }
    };

    window.gestionarEstado = async (id, accion) => {
        const confirmar = confirm(`¿Seguro que desea ${accion === 'activar' ? 'reactivar' : 'dar de baja'} esta categoría?`);
        if (!confirmar) return;
        
        try {
            const esBaja = accion === 'baja';
            const url = esBaja ? `${API_URL}/${id}` : `${API_URL}/${id}/activar`;
            const metodo = esBaja ? 'DELETE' : 'PATCH';

            const res = await fetch(url, {
                method: metodo,
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const data = await res.json();
            if (res.ok) {
                alert(data.mensaje); 
                cargarCategorias(); 
            } else {
                alert("Error: " + data.mensaje);
            }
        } catch (error) {
            alert("Error de conexión al procesar la categoría.");
        }
    };

    if (btnBuscar) {
        btnBuscar.addEventListener('click', () => cargarCategorias(inputBuscar.value));
    }

    cargarCategorias();
});