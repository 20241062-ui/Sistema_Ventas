const API_URL = "https://sistemaventasback.vercel.app/api/faq";
const urlParams = new URLSearchParams(window.location.search);
const faqId = urlParams.get('id');

document.addEventListener('DOMContentLoaded', async () => {
    if (faqId) {
        document.getElementById('tituloFormulario').textContent = "Editar Pregunta Frecuente";
        try {
            const res = await fetch(`${API_URL}/${faqId}`);
            const data = await res.json();
            
            if (res.ok) {
                document.getElementById('intid').value = data.intid;
                document.getElementById('vchpregunta').value = data.vchpregunta;
                document.getElementById('vchrespuesta').value = data.vchrespuesta;
            }
        } catch (error) { console.error(error); }
    }
});

document.getElementById('formFAQ').addEventListener('submit', async (e) => {
    e.preventDefault();
    const datos = {
        intid: document.getElementById('intid').value || null,
        vchpregunta: document.getElementById('vchpregunta').value,
        vchrespuesta: document.getElementById('vchrespuesta').value
    };

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        if (res.ok) {
            alert("FAQ guardada correctamente.");
            window.location.href = 'preguntasFrecuentes.html';
        }
    } catch (error) { alert("Error al guardar."); }
});