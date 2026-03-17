const API_URL = 'https://sistemaventasback.vercel.app/api/admin';
const token = localStorage.getItem('token');

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    // Si hay un ID en la URL, estamos en modo ACTUALIZAR
    if (id && document.getElementById('formActualizarMarca')) {
        document.getElementById('intid_Marca').value = id;
        await cargarDatosMarca(id);
    }

    // Manejar el envío del formulario de NUEVA
    const formNueva = document.getElementById('formNuevaMarca');
    if (formNueva) {
        formNueva.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nombre = document.getElementById('vchNombre').value;
            await enviarMarca(null, nombre, 'POST');
        });
    }

    // Manejar el envío del formulario de ACTUALIZAR
    const formActualizar = document.getElementById('formActualizarMarca');
    if (formActualizar) {
        formActualizar.addEventListener('submit', async (e) => {
            e.preventDefault();
            const idMarca = document.getElementById('intid_Marca').value;
            const nombre = document.getElementById('vchNombre').value;
            await enviarMarca(idMarca, nombre, 'PUT');
        });
    }
});

async function cargarDatosMarca(id) {
    try {
        const response = await fetch(`${API_URL}/marcas/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const marca = await response.json();
        if (marca) {
            document.getElementById('vchNombre').value = marca.vchNombre;
        }
    } catch (error) {
        console.error("Error al cargar datos de la marca:", error);
    }
}

async function enviarMarca(id, nombre, metodo) {
    const url = id ? `${API_URL}/marcas/${id}` : `${API_URL}/marcas`;
    
    try {
        const response = await fetch(url, {
            method: metodo,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ vchNombre: nombre })
        });

        const result = await response.json();
        if (result.status === "success") {
            alert(result.mensaje);
            window.location.href = 'marcas.html';
        } else {
            alert("Error: " + result.mensaje);
        }
    } catch (error) {
        alert("Error de conexión con el servidor");
    }
}