document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const API_URL = 'https://sistemaventasback.vercel.app/api/productos';
    
    if (!token || !usuario || usuario.rol !== 'Administrador') {
        alert("Acceso restringido. Por favor, inicia sesión como administrador.");
        window.location.href = '../login.html';
        return;
    }

    const menuUsuario = document.getElementById('menu-usuario-admin');
    if (menuUsuario) {
        menuUsuario.innerHTML = `
            <span style="display:block; padding:10px; font-weight:bold; color:#333;">
                Hola, ${usuario.nombre}
            </span>
            <a href="../index.html">Volver al Sitio</a>
            <a href="#" id="link-logout-admin" style="color: red;">Cerrar Sesión</a>
        `;

        document.getElementById('link-logout-admin').addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.clear(); 
            alert('Sesión administrativa finalizada.');
            window.location.href = '../index.html';
        });
    }

    
    let paginaActual = 1;
    let busquedaActual = "";

    const cargarDashboard = async (pagina = 1, buscar = "") => {
        try {
            const res = await fetch(`${API_URL}?pagina=${pagina}&buscar=${buscar}`, {
                headers: {
                    'Authorization': `Bearer ${token}`, 
                    'Content-Type': 'application/json'
                }
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.mensaje || "Error en la respuesta del servidor");
            }
            const data = await res.json();

            const total = document.getElementById('count-total');
            const activos = document.getElementById('count-activos');
            const inactivos = document.getElementById('count-inactivos');

            if (total) total.textContent = data.counts?.total || 0;
            if (activos) activos.textContent = data.counts?.activos || 0;
            if (inactivos) inactivos.textContent = data.counts?.inactivos || 0;

            const tbody = document.getElementById('tabla-productos-body');
            if (!tbody) return; 

            tbody.innerHTML = '';

            if (!data.productos || data.productos.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">No se encontraron productos registrados.</td></tr>';
                return;
            }

            data.productos.forEach(prod => {
                const tr = document.createElement('tr');
                if (prod.Estado == 0) tr.classList.add('fila-inactiva');

                tr.innerHTML = `
                <td><strong>${prod.vchNo_Serie}</strong></td>
                <td>${prod.vchNombre}</td>
                <td class="descripcion">${prod.vchDescripcion || 'Sin descripción'}</td>
                <td>$${parseFloat(prod.floPrecioUnitario).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                <td>${prod.intStock || 0}</td>
                <td>
                    <span class="badge ${prod.Estado == 1 ? 'status-active' : 'status-inactive'}">
                        ${prod.Estado == 1 ? 'Activo' : 'Inactivo'}
                    </span>
                </td>
                <td class="acciones">
                    <button class="btn-edit" onclick="window.location.href='producto_actualizar.html?id=${prod.vchNo_Serie}'"> Editar</button>
                    ${prod.Estado == 1
                        ? `<button class="btn-baja" onclick="cambiarEstado('${prod.vchNo_Serie}', 0)"> Baja</button>`
                        : `<button class="btn-alta" onclick="cambiarEstado('${prod.vchNo_Serie}', 1)"> Alta</button>`
                    }
                </td>
            `;
                tbody.appendChild(tr);
            });

            paginaActual = pagina;
            if (typeof renderPaginacion === "function") {
                renderPaginacion(data.pagination);
            }

        } catch (error) {
            console.error("Error detallado en cargarDashboard:", error);
            const tbody = document.getElementById('tabla-productos-body');
            if (tbody) {
                tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="color: red; text-align: center; padding: 20px;">
                        Error al conectar con el servidor: ${error.message}<br>
                        <small>Verifica que el Backend esté activo y la ruta sea correcta.</small>
                    </td>
                </tr>`;
            }
        }
    };

    const renderPaginacion = (nav) => {
        const cont = document.getElementById('contenedor-paginacion');
        if (!cont || !nav) return;
        cont.innerHTML = '';

        for (let i = 1; i <= nav.totalPages; i++) {
            const a = document.createElement('a');
            a.className = `pagina ${i === nav.currentPage ? 'activa' : ''}`;
            a.textContent = i;
            a.style.cursor = 'pointer';
            a.onclick = () => cargarDashboard(i, busquedaActual);
            cont.appendChild(a);
        }
    };

    const btnBuscar = document.getElementById('btn-buscar');
    const btnLimpiar = document.getElementById('btn-limpiar');
    const inputBuscar = document.getElementById('input-buscar');

    if (btnBuscar) {
        btnBuscar.onclick = () => {
            busquedaActual = inputBuscar.value.trim();
            btnLimpiar.style.display = busquedaActual ? 'inline-block' : 'none';
            cargarDashboard(1, busquedaActual);
        };
    }

    if (btnLimpiar) {
        btnLimpiar.onclick = () => {
            inputBuscar.value = "";
            busquedaActual = "";
            btnLimpiar.style.display = 'none';
            cargarDashboard(1);
        };
    }

    window.cambiarEstado = async (id, nuevoEstado) => {
        const accion = nuevoEstado === 1 ? 'Activar' : 'Dar de baja';
        if (!confirm(`¿Seguro que desea ${accion} este producto?`)) return;

        try {
            const res = await fetch(`${API_URL}/estado/${id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ estado: nuevoEstado })
            });

            if (res.ok) {
                cargarDashboard(paginaActual, busquedaActual);
            } else {
                alert("No se pudo actualizar el estado del producto.");
            }
        } catch (error) {
            console.error("Error al cambiar estado:", error);
        }
    };

    cargarDashboard();
});