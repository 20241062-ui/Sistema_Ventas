document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const API_BASE = 'https://sistemaventasback.vercel.app/api/admin';
    
    const selectMarca = document.getElementById('intid_Marca');
    const selectCat = document.getElementById('intid_Categoria');
    const form = document.getElementById('form-nuevo-producto');

    // --- 1. FUNCIÓN PARA CARGAR SELECTORES DESDE LA BD ---
    async function cargarSelectores() {
        try {
            // Cargar Marcas Reales
            const resMarcas = await fetch(`${API_BASE}/marcas`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const marcas = await resMarcas.json();
            
            selectMarca.innerHTML = '<option value="">-- Selecciona Marca --</option>';
            marcas.forEach(m => {
                selectMarca.innerHTML += `<option value="${m.intid_Marca}">${m.vchNombre}</option>`;
            });

            // Cargar Categorías Reales
            const resCat = await fetch(`${API_BASE}/categorias`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const categorias = await resCat.json();
            
            selectCat.innerHTML = '<option value="">-- Selecciona Categoría --</option>';
            categorias.forEach(c => {
                selectCat.innerHTML += `<option value="${c.intid_Categoria}">${c.vchNombre}</option>`;
            });

            console.log("Selectores cargados con éxito");
        } catch (error) {
            console.error("Error cargando selectores:", error);
            alert("Error al cargar marcas/categorías. Verifica tu conexión.");
        }
    }

    // --- 2. EVENTO PARA GUARDAR EL PRODUCTO ---
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Capturamos el nombre de la imagen
            const imagenInput = document.getElementById('vchImagen');
            const nombreImagen = imagenInput.files[0] ? imagenInput.files[0].name : 'default.jpg';

            // Armamos el objeto con los nombres EXACTOS del Modelo
            const producto = {
                vchNo_Serie: document.getElementById('vchNo_Serie').value.trim(),
                vchNombre: document.getElementById('vchNombre').value.trim(),
                vchDescripcion: document.getElementById('vchDescripcion').value.trim(),
                floPrecioCompra: parseFloat(document.getElementById('floPrecioCompra').value),
                floPrecioUnitario: parseFloat(document.getElementById('floPrecioUnitario').value),
                intStock: parseInt(document.getElementById('intStock').value) || 0,
                intid_Categoria: parseInt(selectCat.value),
                intid_Marca: parseInt(selectMarca.value),
                vchImagen: nombreImagen
            };

            try {
                const response = await fetch(`${API_BASE}/productos`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(producto)
                });

                const result = await response.json();

                if (response.ok) {
                    alert("✅ ¡Producto registrado con éxito!");
                    window.location.href = 'menuAdministrador.html';
                } else {
                    alert("❌ Error: " + (result.mensaje || "No se pudo guardar"));
                }
            } catch (error) {
                alert("⚠️ Error de conexión con el servidor.");
            }
        });
    }

    // Ejecutamos la carga de datos al abrir la página
    cargarSelectores();
});