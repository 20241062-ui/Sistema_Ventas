const API_URL = 'https://sistemaventasback.vercel.app/api/contacto';
const tablaBody = document.getElementById('tablaContactoBody');
const formBuscar = document.getElementById('formBuscarContacto');

async function cargarContactos(busqueda = "") {
    try {
        const res = await fetch(`${API_URL}?buscar=${busqueda}`);
        const contactos = await res.json();

        tablaBody.innerHTML = '';

        if (contactos.length === 0) {
            tablaBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No se encontró información.</td></tr>';
            return;
        }

        contactos.forEach(c => {
            tablaBody.innerHTML += `
                <tr>
                    <td>${c.intid}</td>
                    <td><strong>${c.vchcampo}</strong></td>
                    <td>${c.vchvalor}</td>
                    <td>
                        <button class="guardar" onclick="editarContacto(${c.intid})">Editar</button>
                        <button class="cancelar" onclick="eliminarContacto(${c.intid})">Eliminar</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        tablaBody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:red;">Error al conectar con el servidor.</td></tr>';
    }
}

window.editarContacto = (id) => {
    window.location.href = `contacto_formulario.html?id=${id}`;
};

window.eliminarContacto = async (id) => {
    if (confirm('¿Estás seguro de eliminar este dato de contacto?')) {
        try {
            const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            if (res.ok) {
                cargarContactos();
            }
        } catch (error) {
            alert('No se pudo eliminar');
        }
    }
};

formBuscar.addEventListener('submit', (e) => {
    e.preventDefault();
    cargarContactos(document.getElementById('inputBuscar').value);
});

document.addEventListener('DOMContentLoaded', () => cargarContactos());