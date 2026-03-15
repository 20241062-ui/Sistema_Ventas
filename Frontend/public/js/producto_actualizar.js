document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const idProducto = params.get('id');
    const token = localStorage.getItem('token');
    const API_BASE = 'https://sistemaventasback.vercel.app/api';

    console.log("Iniciando carga para el producto ID:", idProducto);

    if (!idProducto) {
        alert("No se especificó un ID de producto.");
        window.location.href = 'menuAdministrador.html';
        return;
    }

    // 1. CARGAR CATÁLOGOS (Marcas y Categorías)
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

            marcas.forEach(m => {
                const opt = document.createElement('option');
                opt.value = m.intid_Marca;
                opt.textContent = m.vchNombre;
                selectMarca.appendChild(opt);
            });

            cats.forEach(c => {
                const opt = document.createElement('option');
                opt.value = c.intid_Categoria;
                opt.textContent = c.vchNombre;
                selectCat.appendChild(opt);
            });
            console.log("✅ Catálogos cargados");
        } catch (error) {
            console.error("❌ Error en catálogos:", error);
        }
    };

    // 2. CARGAR DATOS DEL PRODUCTO
    const cargarDatosProducto = async () => {
        try {
            const res = await fetch(`${API_BASE}/productos/detalle/${idProducto}`);
            if (!res.ok) throw new Error("No se pudo obtener el detalle del producto");
            
            const prod = await res.json();
            console.log("📦 Datos recibidos del servidor:", prod);

            // FUNCIÓN DE ASIGNACIÓN SEGURA
            const llenar = (id, valor) => {
                const el = document.getElementById(id);
                if (el) {
                    el.value = valor !== undefined && valor !== null ? valor : "";
                    console.log(`Asignado ${id} = ${valor}`);
                } else {
                    console.error(`⚠️ No se encontró el ID '${id}' en el HTML`);
                }
            };

            // Mapeo exacto de los campos
            llenar('vchNo_Serie', prod.vchNo_Serie);
            llenar('vchNombre', prod.vchNombre);
            llenar('vchDescripcion', prod.vchDescripcion);
            llenar('floPrecioUnitario', prod.floPrecioUnitario);
            llenar('floPrecioCompra', prod.floPrecioCompra);
            llenar('intStock', prod.intStock);
            llenar('intid_Marca', prod.intid_Marca);
            llenar('intid_Categoria', prod.intid_Categoria);

            // Imagen
            const imgPreview = document.getElementById('imagen-preview');
            if (imgPreview && prod.vchImagen) {
                imgPreview.src = `https://comercializadorall.grupoctic.com/ComercializadoraLL/img/${prod.vchImagen}`;
            }

        } catch (error) {
            console.error("❌ Error al cargar producto:", error);
        }
    };

    // EJECUCIÓN EN ORDEN
    await cargarCatalogos();
    await cargarDatosProducto();
});