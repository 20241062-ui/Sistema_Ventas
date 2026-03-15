document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const idProducto = params.get('id');
    const token = localStorage.getItem('token');
    const API_BASE = 'https://sistemaventasback.vercel.app/api';

    if (!idProducto) {
        alert("No se especificó un ID de producto.");
        window.location.href = 'menuAdministrador.html';
        return;
    }

    // 1. Cargar las Marcas y Categorías reales
    const cargarCatalogos = async () => {
        try {
            const [resMarcas, resCats] = await Promise.all([
                fetch(`${API_BASE}/public/marcas`),
                fetch(`${API_BASE}/public/categorias`)
            ]);
            
            const marcas = await resMarcas.json();
            const cats = await resCats.json();

            const selectMarca = document.getElementById('intid_Marca');
            const selectCat = document.getElementById('intid_Categoria');

            // Limpiar opciones estáticas si las hubiera
            selectMarca.innerHTML = '<option value="">Seleccione Marca</option>';
            selectCat.innerHTML = '<option value="">Seleccione Categoría</option>';

            marcas.forEach(m => {
                selectMarca.innerHTML += `<option value="${m.intid_Marca}">${m.vchNombre}</option>`;
            });
            cats.forEach(c => {
                selectCat.innerHTML += `<option value="${c.intid_Categoria}">${c.vchNombre}</option>`;
            });
        } catch (error) {
            console.error("Error al cargar catálogos:", error);
        }
    };

    // 2. Cargar todos los campos del producto
    const cargarDatosProducto = async () => {
        try {
            const res = await fetch(`${API_BASE}/productos/detalle/${idProducto}`);
            if (!res.ok) throw new Error("Producto no encontrado en la base de datos");
            
            const prod = await res.json();

            // Rellenar campos básicos
            document.getElementById('vchNo_Serie').value = prod.vchNo_Serie;
            document.getElementById('vchNombre').value = prod.vchNombre;
            document.getElementById('floPrecioUnitario').value = prod.floPrecioUnitario;
            
            // Rellenar campos adicionales (Los que hacían falta)
            document.getElementById('vchDescripcion').value = prod.vchDescripcion || "";
            document.getElementById('floPrecioCompra').value = prod.floPrecioCompra || 0;
            document.getElementById('intStock').value = prod.intStock || 0;

            // Seleccionar Marca y Categoría (Esto funciona porque cargamos catálogos antes)
            document.getElementById('intid_Marca').value = prod.intid_Marca;
            document.getElementById('intid_Categoria').value = prod.intid_Categoria;

            // Actualizar vista previa de imagen
            const preview = document.getElementById('imagen-preview');
            if (preview) {
                preview.src = prod.vchImagen 
                    ? `https://comercializadorall.grupoctic.com/ComercializadoraLL/img/${prod.vchImagen}`
                    : `https://comercializadorall.grupoctic.com/ComercializadoraLL/img/sin-imagen.png`;
            }

        } catch (error) {
            alert(error.message);
            window.location.href = 'menuAdministrador.html';
        }
    };

    // Orden de ejecución CRÍTICO
    await cargarCatalogos();
    await cargarDatosProducto();

    // 3. Manejar el envío (UPDATE)
    document.getElementById('form-actualizar-producto').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        // Aseguramos que el ID se envíe aunque el input sea readonly
        data.vchNo_Serie = idProducto;

        try {
            const res = await fetch(`${API_BASE}/admin/productos/${idProducto}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                alert("¡Producto actualizado exitosamente!");
                window.location.href = 'menuAdministrador.html';
            } else {
                const err = await res.json();
                alert("Error: " + (err.mensaje || "No se pudo actualizar"));
            }
        } catch (error) {
            alert("Error de conexión con el servidor.");
        }
    });
});