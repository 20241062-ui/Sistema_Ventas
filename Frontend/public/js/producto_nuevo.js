const cloudname = "dnu57rgek";
const preset = "Precet_5C";

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const API_BASE = 'https://sistemaventasback.vercel.app/api/admin';
    
    const selectMarca = document.getElementById('intid_Marca');
    const selectCat = document.getElementById('intid_Categoria');
    const form = document.getElementById('form-nuevo-producto');

    async function cargarSelectores() {
        try {
            const resMarcas = await fetch(`${API_BASE}/marcas`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const marcas = await resMarcas.json();
            
            if (selectMarca) {
                selectMarca.innerHTML = '<option value="">-- Selecciona Marca --</option>';
                marcas.forEach(m => {
                    selectMarca.innerHTML += `<option value="${m.intid_Marca}">${m.vchNombre}</option>`;
                });
            }

            const resCat = await fetch(`${API_BASE}/categorias`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const categorias = await resCat.json();
            
            if (selectCat) {
                selectCat.innerHTML = '<option value="">-- Selecciona Categoría --</option>';
                categorias.forEach(c => {
                    selectCat.innerHTML += `<option value="${c.intid_Categoria}">${c.vchNombre}</option>`;
                });
            }

        } catch (error) {
            console.error("Error cargando selectores:", error);
        }
    }

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const imagenInput = document.getElementById('vchImagen');
            let imagenUrl = "";

            if (imagenInput && imagenInput.files[0]) {
                const file = imagenInput.files[0];
                const formDataCloud = new FormData();
                formDataCloud.append("file", file);
                formDataCloud.append("upload_preset", preset);

                try {
                    const resCloud = await fetch(`https://api.cloudinary.com/v1_1/${cloudname}/image/upload`, {
                        method: "POST",
                        body: formDataCloud
                    });
                    const cloudData = await resCloud.json();
                    imagenUrl = cloudData.secure_url;
                } catch (error) {
                    alert("Error subiendo imagen a Cloudinary");
                    return;
                }
            } else {
                imagenUrl = "https://res.cloudinary.com/dnu57rgek/image/upload/v1774479182/sin-imagen.png";
            }

            const producto = {
                vchNo_Serie: document.getElementById('vchNo_Serie').value.trim(),
                vchNombre: document.getElementById('vchNombre').value.trim(),
                vchDescripcion: document.getElementById('vchDescripcion').value.trim(),
                floPrecioCompra: parseFloat(document.getElementById('floPrecioCompra').value),
                floPrecioUnitario: parseFloat(document.getElementById('floPrecioUnitario').value),
                intStock: parseInt(document.getElementById('intStock').value) || 0,
                intid_Categoria: parseInt(selectCat.value),
                intid_Marca: parseInt(selectMarca.value),
                vchImagen: imagenUrl 
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
                    alert("✅ Producto registrado correctamente");
                    window.location.href = 'menuAdministrador.html';
                } else {
                    alert("❌ Error: " + (result.mensaje || "No se pudo registrar"));
                }
            } catch (error) {
                alert("⚠️ Error de conexión con el servidor.");
            }
        });
    }

    cargarSelectores();
});