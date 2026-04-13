const API_URL = "https://sistemaventasback.vercel.app/api/clientes";

document.addEventListener("DOMContentLoaded", () => {
    const tablaBody = document.getElementById("tablaClientesBody");
    const btnBuscar = document.getElementById('btn-buscar');
    const inputBuscar = document.getElementById('input-buscar');


    if (tablaBody) cargarClientes();


    if (btnBuscar) {
        btnBuscar.addEventListener('click', () => {
            cargarClientes(inputBuscar.value.trim());
        });
    }


    if (inputBuscar) {
        inputBuscar.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                cargarClientes(inputBuscar.value.trim());
            }
        });
    }
});

async function cargarClientes(buscar = "") {
    try {
        const url = buscar ? `${API_URL}?buscar=${encodeURIComponent(buscar)}` : API_URL;
        const res = await fetch(url);
        const clientes = await res.json();
        const tabla = document.getElementById("tablaClientesBody");

        if (!tabla) return;


        const total = clientes.length;
        const activos = clientes.filter(c => c.Estado == 1).length;
        const inactivos = clientes.filter(c => c.Estado == 0).length;

        document.getElementById("countTotal").innerText = total;
        document.getElementById("countActivos").innerText = activos;
        document.getElementById("countInactivos").innerText = inactivos;

        if (total === 0) {
            tabla.innerHTML = `<tr><td colspan="6" style="text-align:center;">No se encontraron clientes</td></tr>`;
            return;
        }

        tabla.innerHTML = clientes.map(c => `
            <tr class="${c.Estado == 0 ? 'inactivo' : ''}">
                <td>${c.intid_Cliente}</td>
                <td>${c.vchNombre}</td>
                <td>${c.vchApellido_Paterno} ${c.vchApellido_Materno || ''}</td>
                <td>${c.vchCorreo}</td>
                <td>${c.Estado == 1 ? 'Activo' : 'Inactivo'}</td>
                <td>
                    <button class="guardar" onclick="window.location.href='cliente_actualizar.html?id=${c.intid_Cliente}'">Editar</button>
                    <button class="${c.Estado == 1 ? 'cancelar' : 'activar'}" onclick="cambiarEstado(${c.intid_Cliente}, ${c.Estado == 1 ? 0 : 1})">
                        ${c.Estado == 1 ? 'Baja' : 'Activar'}
                    </button>
                </td>
            </tr>
        `).join("");
    } catch (error) {
        console.error("Error:", error);
    }
}

async function cambiarEstado(id, nuevoEstado) {
    if (confirm("¿Confirmar cambio de estado?")) {
        try {
            const res = await fetch(`${API_URL}/${id}/estado`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ estado: nuevoEstado })
            });
            if (res.ok) cargarClientes();
        } catch (error) {
            alert("Error al cambiar estado");
        }
    }
}
const formCliente = document.getElementById("formCliente");

if (formCliente) {
    const urlParams = new URLSearchParams(window.location.search);
    const idCliente = urlParams.get("id");

    if (idCliente) {
        cargarDatosCliente(idCliente);
    }

    formCliente.addEventListener("submit", async (e) => {
        e.preventDefault();
        actualizarDatosCliente(idCliente);
    });
}

async function cargarDatosCliente(id) {
    try {
        const res = await fetch(`${API_URL}/${id}`);
        const c = await res.json();

        if (res.ok && c) {
            document.getElementById("intid_Cliente").value = c.intid_Cliente;
            document.getElementById("vchNombre").value = c.vchNombre;
            document.getElementById("vchApellido_Paterno").value = c.vchApellido_Paterno;
            document.getElementById("vchApellido_Materno").value = c.vchApellido_Materno || "";
            document.getElementById("vchCorreo").value = c.vchCorreo;
            document.getElementById("Estado").value = c.Estado;
        } else {
            alert("No se pudo cargar la información del cliente.");
        }
    } catch (error) {
        console.error("Error al cargar datos:", error);
    }
}

async function actualizarDatosCliente(id) {
    const datos = {
        vchNombre: document.getElementById("vchNombre").value,
        vchApellido_Paterno: document.getElementById("vchApellido_Paterno").value,
        vchApellido_Materno: document.getElementById("vchApellido_Materno").value,
        vchCorreo: document.getElementById("vchCorreo").value,
        Estado: document.getElementById("Estado").value
    };

    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        });

        if (res.ok) {
            alert("Cliente actualizado con éxito");
            window.location.href = "clientes.html";
        } else {
            const error = await res.json();
            alert("Error: " + error.error);
        }
    } catch (error) {
        console.error("Error al actualizar:", error);
        alert("Ocurrió un error al intentar actualizar.");
    }
}