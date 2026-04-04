const API_URL = "https://sistemaventasback.vercel.app/api/usuarios";

document.addEventListener("DOMContentLoaded", () => {
    const tablaBody = document.getElementById("tablaUsuariosBody");
    const form = document.getElementById("formUsuario");
    const params = new URLSearchParams(window.location.search);
    const editId = params.get("id");

    if (editId && form) {
        document.getElementById("tituloFormulario").innerText = "Editar Datos de Usuario";
        document.getElementById("btnGuardar").innerText = "Actualizar Usuario";
        document.getElementById("passHelp").style.display = "block";
        document.getElementById("vchpassword").required = false;

        fetch(`${API_URL}/${editId}`)
            .then(res => res.json())
            .then(data => {
                document.getElementById("id_usuario").value = data.id_usuario;
                document.getElementById("vchnombre").value = data.vchnombre;
                document.getElementById("vchapellido").value = data.vchapellido;
                document.getElementById("vchcorreo").value = data.vchcorreo;
                document.getElementById("vchRol").value = data.vchRol;
            });
    }

    if (tablaBody) {
        cargarUsuarios();
        document.getElementById("formBuscarUsuario").addEventListener("submit", (e) => {
            e.preventDefault();
            cargarUsuarios(document.getElementById("inputBuscar").value);
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
            if (res.ok) window.location.href = "usuarios.html";
            else alert("Error al procesar usuario. El correo podría ya estar registrado.");
        });
    }
});

async function cargarUsuarios(buscar = "") {
    const url = buscar ? `${API_URL}?buscar=${buscar}` : API_URL;
    const res = await fetch(url);
    const usuarios = await res.json();
    const tabla = document.getElementById("tablaUsuariosBody");
    if (!tabla) return;

    document.getElementById("countTotal").innerText = usuarios.length;
    document.getElementById("countActivos").innerText = usuarios.filter(u => u.Estado == 1).length;
    document.getElementById("countInactivos").innerText = usuarios.filter(u => u.Estado == 0).length;

    tabla.innerHTML = usuarios.map(u => `
        <tr class="${u.Estado == 0 ? 'inactivo' : ''}">
            <td>${u.id_usuario}</td>
            <td>${u.vchnombre} ${u.vchapellido}</td>
            <td>${u.vchcorreo}</td>
            <td><strong>${u.vchRol}</strong></td>
            <td>${u.Estado == 1 ? 'Activo' : 'Inactivo'}</td>
            <td class="acciones-flex">
                <button class="guardar" onclick="window.location.href='usuario_formulario.html?id=${u.id_usuario}'">Editar</button>
                <button class="${u.Estado == 1 ? 'cancelar' : 'activar'}" onclick="cambiarEstado(${u.id_usuario}, ${u.Estado == 1 ? 0 : 1})">
                    ${u.Estado == 1 ? 'Baja' : 'Activar'}
                </button>
                <button class="btn-eliminar" onclick="eliminarPermanente(${u.id_usuario})">Baja</button>
            </td>
        </tr>
    `).join("");
}

async function cambiarEstado(id, nuevoEstado) {
    await fetch(`${API_URL}/${id}/estado`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: nuevoEstado })
    });
    cargarUsuarios();
}

async function eliminarPermanente(id) {
    if (confirm("¿Esta seguro de querer dar de baja a este usuario?")) {
        const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (res.ok) cargarUsuarios();
    }
}