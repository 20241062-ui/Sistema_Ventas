const API_URL = 'https://sistemaventasback.vercel.app/api/contacto';
const urlParams = new URLSearchParams(window.location.search);
const contactoId = urlParams.get('id');

document.addEventListener('DOMContentLoaded', async () => {
    if (contactoId) {
        // MODO EDICIÓN
        document.getElementById('tituloFormulario').textContent = 'Editar Contacto';
        try {
            const res = await fetch(`${API_URL}/${contactoId}`);
            const data = await res.json();
            
            if (res.ok) {
                document.getElementById('intid').value = data.intid;
                document.getElementById('vchcampo').value = data.vchcampo;
                document.getElementById('vchvalor').value = data.vchvalor;
            }
        } catch (error) {
            console.error("Error al obtener contacto:", error);
        }
    }
});

document.getElementById('formContacto').addEventListener('submit', async (e) => {
    e.preventDefault();

    const datos = {
        intid: document.getElementById('intid').value || null,
        vchcampo: document.getElementById('vchcampo').value,
        vchvalor: document.getElementById('vchvalor').value
    };

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        if (res.ok) {
            alert('Información de contacto guardada');
            window.location.href = 'contactoLista.html';
        }
    } catch (error) {
        alert('Error al guardar');
    }
});