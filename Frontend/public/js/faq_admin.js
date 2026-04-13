const API_URL = "https://sistemaventasback.vercel.app/api/faq";
const tablaBody = document.getElementById('tablaFAQBody');
const formBuscar = document.getElementById('formBuscarFAQ');

async function cargarFAQ(busqueda = "") {
    if (!tablaBody) return;
    
    try {
        const url = busqueda ? `${API_URL}?buscar=${busqueda}` : API_URL;
        const res = await fetch(url);
        const faqs = await res.json();

        tablaBody.innerHTML = '';

        if (faqs.length === 0) {
            tablaBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No hay preguntas registradas.</td></tr>';
            return;
        }

        faqs.forEach(f => {
            const fecha = f.dtmFecha ? new Date(f.dtmFecha).toLocaleDateString() : 'N/A';
            tablaBody.innerHTML += `
                <tr>
                    <td>${f.intid}</td>
                    <td><strong>${f.vchpregunta}</strong></td>
                    <td>${f.vchrespuesta.substring(0, 50)}...</td>
                    <td>${f.intEstado === 1 ? 'Activo' : 'Inactivo'}</td>
                    <td>${fecha}</td>
                    <td>
                        <button class="btn-superior" onclick="editarFAQ(${f.intid})">Editar</button>
                        <button class="btn-superior buscar" onclick="eliminarFAQ(${f.intid})">Baja</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        tablaBody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:red;">Error al cargar datos.</td></tr>';
    }
}

window.editarFAQ = (id) => {
    window.location.href = `preguntaFormulario.html?id=${id}`;
};

window.eliminarFAQ = async (id) => {
    if (confirm('¿Deseas eliminar esta pregunta?')) {
        try {
            const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            if (res.ok) cargarFAQ();
        } catch (error) {
            alert("No se pudo eliminar.");
        }
    }
};

if (formBuscar) {
    formBuscar.addEventListener('submit', (e) => {
        e.preventDefault();
        cargarFAQ(document.getElementById('inputBuscar').value);
    });
}

document.addEventListener('DOMContentLoaded', () => cargarFAQ());