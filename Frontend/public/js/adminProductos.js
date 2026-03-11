document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const API_URL = 'https://sistema-ventas-omega.vercel.app/api/admin';

    if (!token) {
        window.location.href = '../login.html';
        return;
    }

    let paginaActual = 1;
    let busquedaActual = "";

    const cargarDashboard = async (pagina = 1, buscar = "") => {
        try {
            const res = await fetch(`${API_URL}/productos?pagina=${pagina}&buscar=${buscar}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();

            // 1. Actualizar Cards
            document.getElementById('count-total').textContent = data.counts.total;
            document.getElementById('count-activos').textContent = data.counts.activos;
            document.getElementById('count-inactivos').textContent = data.counts.inactivos;

            // 2. Llenar Tabla
            const tbody = document.getElementById('tabla-productos-body');
            tbody.innerHTML = '';

            data.productos.forEach(prod => {
                const tr = document.createElement('tr');
                if (prod.Estado == 0) tr.classList.add('inactivo');
                
                tr.innerHTML = `
                    <td>${prod.vchNo_Serie}</td>
                    <td>${prod.vchNombre}</td>
                    <td class="descripcion">${prod.vchDescripcion}</td>
                    <td>$${parseFloat(prod.floPrecioUnitario).toLocaleString('es-MX', {minimumFractionDigits:2})}</td>
                    <td>${prod.intStock}</td>
                    <td>${prod.Estado == 1 ? 'Activo' : 'Inactivo'}</td>
                    <td class="acciones">
                        <button class="guardar" onclick="window.location.href='producto_actualizar.html?id=${prod.vchNo_Serie}'">Editar</button>
                        ${prod.Estado == 1 
                            ? `<button class="cancelar" onclick="cambiarEstado('${prod.vchNo_Serie}', 0)">Baja</button>`
                            : `<button class="activar" onclick="cambiarEstado('${prod.vchNo_Serie}', 1)">Activar</button>`
                        }
                    </td>
                `;
                tbody.appendChild(tr);
            });

            // 3. Paginación
            renderPaginacion(data.pagination);

        } catch (error) {
            console.error("Error cargando dashboard:", error);
        }
    };

    const renderPaginacion = (nav) => {
        const cont = document.getElementById('contenedor-paginacion');
        cont.innerHTML = '';
        for (let i = 1; i <= nav.totalPages; i++) {
            const a = document.createElement('a');
            a.className = `pagina ${i === nav.currentPage ? 'activa' : ''}`;
            a.textContent = i;
            a.onclick = () => cargarDashboard(i, busquedaActual);
            cont.appendChild(a);
        }
    };

    // Buscador
    document.getElementById('btn-buscar').onclick = () => {
        busquedaActual = document.getElementById('input-buscar').value;
        document.getElementById('btn-limpiar').style.display = busquedaActual ? 'inline-block' : 'none';
        cargarDashboard(1, busquedaActual);
    };

    document.getElementById('btn-limpiar').onclick = () => {
        document.getElementById('input-buscar').value = "";
        busquedaActual = "";
        document.getElementById('btn-limpiar').style.display = 'none';
        cargarDashboard(1);
    };

    window.cambiarEstado = async (id, nuevoEstado) => {
        if (!confirm(`¿Desea ${nuevoEstado === 1 ? 'Activar' : 'Dar de baja'} este producto?`)) return;
        await fetch(`${API_URL}/productos/estado/${id}`, {
            method: 'PATCH',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ estado: nuevoEstado })
        });
        cargarDashboard(paginaActual, busquedaActual);
    };

    cargarDashboard();
});