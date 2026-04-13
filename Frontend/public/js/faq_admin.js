const API_URL = "https://sistemaventasback.vercel.app/api/faq";
const tablaBody = document.getElementById('tablaFAQBody');
const formBuscar = document.getElementById('formBuscarFAQ');

async function cargarFAQ(busqueda = "") {
    if (!tablaBody) return;
    
    try {
        tablaBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Cargando...</td></tr>';

        const url = busqueda ? `${API_URL}?buscar=${encodeURIComponent(busqueda)}` : API_URL;
        const res = await fetch(url);
        
        if (!res.ok) throw new Error("Error en la respuesta del servidor");
        
        const faqs = await res.json();

        tablaBody.innerHTML = '';

        if (!faqs || faqs.length === 0) {
            tablaBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No hay preguntas registradas.</td></tr>';
            return;
        }

        faqs.forEach(f => {
            const fechaDato = f.fecha || f.dtmFecha;
            const fecha = fechaDato ? new Date(fechaDato).toLocaleDateString() : 'N/A';
            
            const estaActivo = f.estado === 1; 

            tablaBody.innerHTML += `
                <tr>
                    <td>${f.intid}</td>
                    <td><strong>${f.vchpregunta}</strong></td>
                    <td>${f.vchrespuesta ? f.vchrespuesta.substring(0, 50) + '...' : ''}</td>
                    <td>${estaActivo ? '✅ Activo' : '❌ Inactivo'}</td>
                    <td>${fecha}</td>
                    <td>
                        <button class="btn-superior" onclick="editarFAQ(${f.intid})">✏️</button>
                        <button class="${estaActivo ? 'btn-superior buscar' : 'btn-superior'}" 
                                onclick="cambiarEstadoFAQ(${f.intid}, ${estaActivo ? 0 : 1})">
                            ${estaActivo ? 'Baja' : 'Activar'}
                        </button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Detalle del error:", error);
        tablaBody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:red;">Error al cargar datos. Verifica la consola.</td></tr>';
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
            alert(`Pregunta ${accion === 'activar' ? 'activada' : 'dada de baja'} con éxito.`);
            cargarFAQ();
        } else {
            alert("No se pudo actualizar el estado.");
        }
    } catch (error) {
        console.error(error);
        alert("Error en el servidor");
    }
};

window.editarFAQ = (id) => {
    window.location.href = `preguntaFormulario.html?id=${id}`;
};

// Event Listeners
if (formBuscar) {
    formBuscar.addEventListener('submit', (e) => {
        e.preventDefault();
        const busqueda = document.getElementById('inputBuscar').value;
        cargarFAQ(busqueda.trim());
    });
}

document.addEventListener('DOMContentLoaded', () => cargarFAQ());