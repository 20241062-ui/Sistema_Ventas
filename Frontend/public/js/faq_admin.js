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
            const fecha = f.fecha ? new Date(f.fecha).toLocaleDateString() : 'N/A';
            const estaActivo = f.estado === 1; 

            tablaBody.innerHTML += `
        <tr>
            <td>${f.intid}</td>
            <td><strong>${f.vchpregunta}</strong></td>
            <td>${f.vchrespuesta.substring(0, 50)}...</td>
            <td>${estaActivo ? '✅ Activo' : '❌ Inactivo'}</td>
            <td>${fecha}</td>
            <td>
                <button class="btn-superior" onclick="editarFAQ(${f.intid})">✏️</button>
                <button class="${estaActivo ? 'btn-superior buscar' : 'btn-superior'}" 
                        onclick="cambiarEstadoFAQ(${f.intid}, ${estaActivo ? 0 : 1})">
                    ${estaActiva ? 'Baja' : 'Activar'}
                </button>
            </td>
        </tr>
    `;
        });

        window.cambiarEstadoFAQ = async (id, nuevoEstado) => {
            const accion = nuevoEstado === 0 ? 'dar de baja' : 'activar';
            if (!confirm(`¿Deseas ${accion} esta pregunta?`)) return;

            try {
                const res = await fetch(`${API_URL}/${id}/estado`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ estado: nuevoEstado })
                });

                if (res.ok) {
                    cargarFAQ();
                }
            } catch (error) {
                alert("Error en el servidor");
            }
        };
    } catch (error) {
        tablaBody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:red;">Error al cargar datos.</td></tr>';
    }
}

window.cambiarEstadoFAQ = async (id, nuevoEstado) => {
    const accion = nuevoEstado === 0 ? 'dar de baja' : 'activar';
    if (!confirm(`¿Deseas ${accion} esta pregunta?`)) return;

    try {
        const res = await fetch(`${API_URL}/${id}/estado`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: nuevoEstado })
        });

        if (res.ok) {
            cargarFAQ();
        }
    } catch (error) {
        alert("Error en el servidor");
    }
};
window.editarFAQ = (id) => {
    window.location.href = `preguntaFormulario.html?id=${id}`;
};

if (formBuscar) {
    formBuscar.addEventListener('submit', (e) => {
        e.preventDefault();
        cargarFAQ(document.getElementById('inputBuscar').value);
    });
}

document.addEventListener('DOMContentLoaded', () => cargarFAQ());