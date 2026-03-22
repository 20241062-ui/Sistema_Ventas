const API_URL = "https://sistemaventasback.vercel.app/api/clientes";

document.addEventListener("DOMContentLoaded", () => {
    const tablaBody = document.getElementById("tablaClientesBody");
    const form = document.getElementById("formCliente");
    const params = new URLSearchParams(window.location.search);
    const editId = params.get("id");

    // CARGAR DATOS EN EL FORMULARIO
    if (editId && form) {
        fetch(`${API_URL}/${editId}`)
            .then(res => res.json())
            .then(data => {
                form.intid_Cliente.value = data.intid_Cliente;
                form.vchNombre.value = data.vchNombre;
                form.vchApellido_Paterno.value = data.vchApellido_Paterno;
                form.vchApellido_Materno.value = data.vchApellido_Materno;
                form.vchCorreo.value = data.vchCorreo;
                form.Estado.value = data.Estado;
            });
    }

    // LISTAR EN TABLA
    if (tablaBody) cargarClientes();

    // GUARDAR CAMBIOS
    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(form).entries());
            const id = data.intid_Cliente;

            const res = await fetch(`${API_URL}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            if (res.ok) window.location.href = "clientes.html";
        });
    }
});

async function cargarClientes(buscar = "") {
    const url = buscar ? `${API_URL}?buscar=${buscar}` : API_URL;
    const res = await fetch(url);
    const clientes = await res.json();
    const tabla = document.getElementById("tablaClientesBody");
    if (!tabla) return;

    // Actualizar contadores
    document.getElementById("countTotal").innerText = clientes.length;
    document.getElementById("countActivos").innerText = clientes.filter(c => c.Estado == 1).length;
    document.getElementById("countInactivos").innerText = clientes.filter(c => c.Estado == 0).length;

    tabla.innerHTML = clientes.map(c => `
        <tr class="${c.Estado == 0 ? 'inactivo' : ''}">
            <td>${c.intid_Cliente}</td>
            <td>${c.vchNombre}</td>
            <td>${c.vchApellido_Paterno} ${c.vchApellido_Materno || ''}</td>
            <td>${c.vchCorreo}</td>
            <td>${c.Estado == 1 ? 'Activo' : 'Inactivo'}</td>
            <td>
                <button class="guardar" onclick="window.location.href='clienteActualizar.html?id=${c.intid_Cliente}'">Editar</button>
                <button class="${c.Estado == 1 ? 'cancelar' : 'activar'}" onclick="cambiarEstado(${c.intid_Cliente}, ${c.Estado == 1 ? 0 : 1})">
                    ${c.Estado == 1 ? 'Baja' : 'Activar'}
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
        cargarClientes();
    }
}