const API_URL = 'https://sistemaventasback.vercel.app/api/admin/marcas';
const token = localStorage.getItem('token');

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Intentamos obtener el ID de la URL (ej. ?id=5)
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    const form = document.getElementById('form-marca');
    const inputNombre = document.getElementById('vchNombre');
    const inputIdOculto = document.getElementById('intid_Marca');

    // 2. Si existe un ID, estamos en modo EDICIÓN
    if (id) {
        // Rellenamos el campo oculto si existe
        if (inputIdOculto) inputIdOculto.value = id;
        
        // Cambiamos el texto del título visualmente (opcional)
        const titulo = document.querySelector('h2');
        if (titulo) titulo.textContent = "Actualizar marca";

        await cargarDatosMarca(id);
    }

    // 3. Manejo único del envío (Submit)
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nombre = inputNombre.value.trim();
            // Si hay ID usamos PUT, si no usamos POST
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

                if (response.ok || result.status === "success") {
                    alert(result.mensaje || "Operación exitosa");
                    window.location.href = 'marcas.html';
                } else {
                    alert("Error: " + result.mensaje);
                }
            } catch (error) {
                alert("Error de conexión con el servidor");
            }
        });
    }
});

async function cargarDatosMarca(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("No se encontró la marca");
        
        const marca = await response.json();
        document.getElementById('vchNombre').value = marca.vchNombre;
    } catch (error) {
        console.error("Error al cargar datos:", error);
    }
}