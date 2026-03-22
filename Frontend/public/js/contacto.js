const API_URL = "https://sistemaventasback.vercel.app/api/contacto";

document.addEventListener("DOMContentLoaded", () => {
    const tablaBody = document.getElementById("tablaContactoBody");
    const form = document.getElementById("formContacto");
    const params = new URLSearchParams(window.location.search);
    const editId = params.get("id");

    if (editId && form) {
        document.getElementById("tituloFormulario").innerText = "Actualizar Contacto";
        fetch(`${API_URL}/${editId}`)
            .then(res => res.json())
            .then(data => {
                document.getElementById("intid").value = data.intid;
                document.getElementById("vchcampo").value = data.vchcampo;
                document.getElementById("vchvalor").value = data.vchvalor;
            });
    }

    if (tablaBody) {
        cargarContactos();
        document.getElementById("formBuscarContacto").addEventListener("submit", (e) => {
            e.preventDefault();
            cargarContactos(document.getElementById("inputBuscar").value);
        });
    }

    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(form).entries());
            const res = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            if (res.ok) window.location.href = "contacto.html";
        });
    }
});

async function cargarContactos(buscar = "") {
    const url = buscar ? `${API_URL}?buscar=${buscar}` : API_URL;
    const res = await fetch(url);
    const datos = await res.json();
    const tabla = document.getElementById("tablaContactoBody");
    if (!tabla) return;

    tabla.innerHTML = datos.map(c => `
        <tr>
            <td>${c.intid}</td>
            <td>${c.vchcampo}</td>
            <td>${c.vchvalor}</td>
            <td>
                <button class="guardar" onclick="window.location.href='contacto_formulario.html?id=${c.intid}'">Editar</button>
                <button class="cancelar" onclick="eliminarContacto(${c.intid})">Eliminar</button>
            </td>
        </tr>
    `).join("");
}

async function eliminarContacto(id) {
    if (confirm("¿Seguro que deseas eliminar este contacto permanentemente?")) {
        const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (res.ok) cargarContactos();
    }
}