const API_URL = 'https://sistemaventasback.vercel.app/api/admin/categorias';
const token = localStorage.getItem('token');

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Detectar si venimos de "Editar" buscando el ID en la URL (?id=X)
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    // 2. Referencias a los elementos (buscamos ambos IDs para que funcione en cualquier HTML)
    const form = document.getElementById('form-actualizar-categoria') || document.getElementById('form-nueva-categoria');
    const inputNombre = document.getElementById('vchNombre');

    // 3. Si hay ID, estamos editando: Cargamos los datos actuales
    if (id) {
        await cargarDatosCategoria(id);
    }

    // 4. Manejo del envío del formulario
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nombre = inputNombre.value.trim();
            // Si hay ID usamos PUT (actualizar), si no POST (crear)
            const metodo = id ? 'PUT' : 'POST';
            const urlFinal = id ? `${API_URL}/${id}` : API_URL;

            try {
                const response = await fetch(urlFinal, {
                    method: metodo,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ vchNombre: nombre })
                });

                const result = await response.json();

                if (response.ok) {
                    alert(result.mensaje || "Operación exitosa");
                    window.location.href = 'categorias.html';
                } else {
                    alert("Error: " + result.mensaje);
                }
            } catch (error) {
                alert("Error de conexión con el servidor");
            }
        });
    }
});

async function cargarDatosCategoria(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("No se encontró la categoría");
        
        const categoria = await response.json();
        // Llenamos el input con el nombre que viene de la BD
        document.getElementById('vchNombre').value = categoria.vchNombre;
    } catch (error) {
        console.error("Error al cargar datos:", error);
    }
}