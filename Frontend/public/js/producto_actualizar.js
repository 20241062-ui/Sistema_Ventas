document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const idProducto = params.get('id');
    const token = localStorage.getItem('token');
    const API_BASE = 'https://sistemaventasback.vercel.app/api';

    if (!idProducto) {
        window.location.href = 'menuAdministrador.html';
        return;
    }

    // 1. Función para cargar Selects (Marcas y Categorías)
    const cargarCatalogos = async () => {
        // Asumiendo que creaste rutas públicas o admin para obtener estas listas
        const [resMarcas, resCats] = await Promise.all([
            fetch(`${API_BASE}/public/marcas`),
            fetch(`${API_BASE}/public/categorias`)
        ]);
        
        const marcas = await resMarcas.json();
        const cats = await resCats.json();

        const selectMarca = document.getElementById('intid_Marca');
        const selectCat = document.getElementById('intid_Categoria');

        marcas.forEach(m => selectMarca.innerHTML += `<option value="${m.intid_Marca}">${m.vchNombre}</option>`);
        cats.forEach(c => selectCat.innerHTML += `<option value="${c.intid_Categoria}">${c.vchNombre}</option>`);
    };

    // 2. Función para cargar los datos del producto actual
    const cargarDatosProducto = async () => {
        const res = await fetch(`${API_BASE}/productos/detalle/${idProducto}`);
        const prod = await res.json();

        document.getElementById('vchNo_Serie').value = prod.vchNo_Serie;
        document.getElementById('vchNombre').value = prod.vchNombre;
        document.getElementById('vchDescripcion').value = prod.vchDescripcion;
        document.getElementById('floPrecioUnitario').value = prod.floPrecioUnitario;
        document.getElementById('intStock').value = prod.intStock;
        document.getElementById('floPrecioCompra').value = prod.floPrecioCompra;
        document.getElementById('intid_Marca').value = prod.intid_Marca;
        document.getElementById('intid_Categoria').value = prod.intid_Categoria;
        document.getElementById('imagen-preview').src = `https://comercializadorall.grupoctic.com/ComercializadoraLL/img/${prod.vchImagen}`;
    };

    await cargarCatalogos();
    await cargarDatosProducto();

    // 3. Evento para GUARDAR los cambios (PUT)
    document.getElementById('form-actualizar-producto').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        try {
            const res = await fetch(`${API_BASE}/admin/productos/${idProducto}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await res.json();
            if (res.ok) {
                alert("Producto actualizado con éxito");
                window.location.href = 'menuAdministrador.html';
            } else {
                alert("Error: " + result.mensaje);
            }
        } catch (error) {
            console.error("Error al actualizar:", error);
        }
    });
});