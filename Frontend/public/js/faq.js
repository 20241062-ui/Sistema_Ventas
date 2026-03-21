const API_URL = "https://sistemaventasback.vercel.app/api/faq";

document.addEventListener("DOMContentLoaded", () => {
    const tablaBody = document.getElementById("tablaFAQBody");
    const form = document.getElementById("formFAQ");
    const params = new URLSearchParams(window.location.search);
    const editId = params.get("id");

    if (form) {
        if (editId) {
            document.getElementById("tituloFormulario").innerText = "Actualizar Pregunta";
            fetch(`${API_URL}/${editId}`)
                .then(res => res.json())
                .then(data => {
                    document.getElementById("intid").value = data.intid;
                    document.getElementById("vchpregunta").value = data.vchpregunta;
                    document.getElementById("vchrespuesta").value = data.vchrespuesta;
                });
        }

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(form).entries());
            const res = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            if (res.ok) window.location.href = "preguntasFrecuentes.html";
        });
    }

    if (tablaBody) {
        cargarFAQs();
        const formBuscar = document.getElementById("formBuscarFAQ");
        if (formBuscar) {
            formBuscar.addEventListener("submit", (e) => {
                e.preventDefault();
                cargarFAQs(document.getElementById("inputBuscar").value);
            });
        }
    }
});

async function cargarFAQs(buscar = "") {
    const url = buscar ? `${API_URL}?buscar=${buscar}` : API_URL;
    const res = await fetch(url);
    const faqs = await res.json();
    const tabla = document.getElementById("tablaFAQBody");
    if (!tabla) return;

    tabla.innerHTML = faqs.map(f => `
        <tr class="${f.estado == 0 ? 'inactivo' : ''}">
            <td>${f.intid}</td>
            <td>${f.vchpregunta}</td>
            <td class="descripcion">${f.vchrespuesta}</td>
            <td>${f.estado == 1 ? 'Activo' : 'Inactivo'}</td>
            <td>${new Date(f.fecha).toLocaleDateString()}</td>
            <td>
                <button class="guardar" onclick="window.location.href='preguntaFormulario.html?id=${f.intid}'">Editar</button>
                <button class="${f.estado == 1 ? 'cancelar' : 'activar'}" onclick="cambiarEstado(${f.intid}, ${f.estado == 1 ? 0 : 1})">
                    ${f.estado == 1 ? 'Baja' : 'Activar'}
                </button>
            </td>
        </tr>
    `).join("");
}

async function cambiarEstado(id, nuevoEstado) {
    if (confirm("¿Confirmar cambio de estado?")) {
        await fetch(`${API_URL}/${id}/estado`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ estado: nuevoEstado })
        });
        cargarFAQs();
    }
}