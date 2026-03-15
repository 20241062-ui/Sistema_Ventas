document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const idProducto = params.get('id'); // Obtiene el ID de la URL
    const token = localStorage.getItem('token');
    const API_BASE = 'https://sistemaventasback.vercel.app/api';

    if (!idProducto) {
        alert("No se especificó un ID de producto.");
        window.location.href = 'menuAdministrador.html';
        return;
    }

    // 1. Cargar las Marcas y Categorías reales de la base de datos
    const cargarCatalogos = async () => {
        try {
            const [resMarcas, resCats] = await Promise.all([
                fetch(`${API_BASE}/public/marcas`), // Asegúrate de tener estas rutas
                fetch(`${API_BASE}/public/categorias`)
            ]);
            
            const marcas = await resMarcas.json();
            const cats = await resCats.json();

            const selectMarca = document.getElementById('intid_Marca');
            const selectCat = document.getElementById('intid_Categoria');

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

    // 2. Cargar los datos actuales del producto para rellenar el formulario
    const cargarDatosProducto = async () => {
        try {
            const res = await fetch(`${API_BASE}/productos/detalle/${idProducto}`);
            if (!res.ok) throw new Error("Producto no encontrado");
            
            const prod = await res.json();

            // Rellenar los campos del formulario
            document.getElementById('vchNo_Serie').value = prod.vchNo_Serie;
            document.getElementById('vchNombre').value = prod.vchNombre;
            document.getElementById('floPrecioUnitario').value = prod.floPrecioUnitario;
            
            // Seleccionar la marca y categoría correcta
            document.getElementById('intid_Marca').value = prod.intid_Marca;
            document.getElementById('intid_Categoria').value = prod.intid_Categoria;

            // Si tienes el campo de imagen, actualiza la previa
            const preview = document.getElementById('imagen-preview');
            if (preview && prod.vchImagen) {
                preview.src = `https://comercializadorall.grupoctic.com/ComercializadoraLL/img/${prod.vchImagen}`;
            }
        } catch (error) {
            alert(error.message);
            window.location.href = 'menuAdministrador.html';
        }
    };

    // Ejecutar cargas iniciales
    await cargarCatalogos();
    await cargarDatosProducto();

    // 3. Manejar el envío del formulario (UPDATE)
    document.getElementById('form-actualizar-producto').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        // Agregamos manualmente el No. Serie porque es readonly y a veces no se incluye en FormData
        const data = Object.fromEntries(formData.entries());
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
                alert("Error al actualizar: " + err.mensaje);
            }
        } catch (error) {
            alert("Error de conexión con el servidor.");
        }
    });
});