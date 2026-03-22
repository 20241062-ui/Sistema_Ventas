const API_URL = "https://sistemaventasback.vercel.app/api/informacion";

document.addEventListener("DOMContentLoaded", () => {
    const tablaBody = document.getElementById("tablaInformacionBody");
    const form = document.getElementById("formInformacion");
    const params = new URLSearchParams(window.location.search);
    const editId = params.get("id");

    if (form) {
        if (editId) {
            document.getElementById("tituloFormulario").innerText = "Actualizar Información";
            fetch(`${API_URL}/${editId}`)
                .then(res => res.json())
                .then(data => {
                    document.getElementById("intid").value = data.intid;
                    document.getElementById("vchtitulo").value = data.vchtitulo;
                    document.getElementById("vchcontenido").value = data.vchcontenido;
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
            if (res.ok) window.location.href = "informacionEmpresa.html";
        });
    }

    if (tablaBody) {
        cargarInformacion();
        const formBuscar = document.querySelector(".productos-buscar");
        if (formBuscar) {
            formBuscar.addEventListener("submit", (e) => {
                e.preventDefault();
                cargarInformacion(e.target.buscar.value);
            });
        }
    }
});

async function cargarInformacion(buscar = "") {
    const url = buscar ? `${API_URL}?buscar=${buscar}` : API_URL;
    const res = await fetch(url);
    const datos = await res.json();
    
    if (document.querySelector(".cards")) {
        document.querySelector(".card:nth-child(1) .big").innerText = datos.length;
        document.querySelector(".card.success .big").innerText = datos.filter(d => d.Estado == 1).length;
        document.querySelector(".card.warning .big").innerText = datos.filter(d => d.Estado == 0).length;
    }

    const html = datos.map(d => `
        <tr class="${d.Estado == 0 ? 'inactivo' : ''}">
            <td>${d.intid}</td>
            <td>${d.vchtitulo}</td>
            <td class="descripcion">${d.vchcontenido}</td>
            <td>${d.Estado == 1 ? 'Activo' : 'Inactivo'}</td>
            <td>${d.fecha_actualizacion || 'N/A'}</td>
            <td>
                <button class="guardar" onclick="window.location.href='informacionFormulario.html?id=${d.intid}'">Editar</button>
                <button class="${d.Estado == 1 ? 'cancelar' : 'activar'}" onclick="cambiarEstado(${d.intid}, ${d.Estado == 1 ? 0 : 1})">
                    ${d.Estado == 1 ? 'Baja' : 'Activar'}
                </button>
            </td>
        </tr>
    `).join("");
    document.getElementById("tablaInformacionBody").innerHTML = html;
}

async function cambiarEstado(id, nuevoEstado) {
    const msj = nuevoEstado === 1 ? "¿Activar esta información?" : "¿Dar de baja esta información?";
    if (confirm(msj)) {
        await fetch(`${API_URL}/${id}/estado`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ estado: nuevoEstado })
        });
        cargarInformacion();
    }
}