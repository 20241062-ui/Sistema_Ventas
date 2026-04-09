const API_URL = "https://sistemaventasback.vercel.app/api/proveedores";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formProveedor");
    const tablaBody = document.getElementById("tablaProveedoresBody");
    const params = new URLSearchParams(window.location.search);
    const editRFC = params.get("id");

    const btnBuscar = document.getElementById('btn-buscar');
    const inputBuscar = document.getElementById('input-buscar');

    if (editRFC && form) {
        document.getElementById("tituloFormulario").innerText = "Actualizar proveedor";
        document.getElementById("btnGuardar").innerText = "Actualizar";

        fetch(`${API_URL}/${editRFC}`)
            .then(res => res.json())
            .then(data => {
                Object.keys(data).forEach(key => {
                    const input = document.getElementsByName(key)[0];
                    if (input) input.value = data[key];
                });
                document.getElementById("vchRFC").readOnly = true;
                document.getElementById("vchRFC").style.backgroundColor = "#e9ecef";
            })
            .catch(err => console.error("Error al cargar proveedor:", err));
    }

    if (tablaBody) {
        cargarProveedores();
    }

    if (btnBuscar) {
        btnBuscar.addEventListener('click', () => {
            const valor = inputBuscar.value.trim();
            cargarProveedores(valor);
        });
    }

    
    if (inputBuscar) {
        inputBuscar.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                cargarProveedores(inputBuscar.value.trim());
            }
        });
    }

    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            try {
                const res = await fetch(API_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                });

                if (res.ok) {
                    alert("¡Operación realizada con éxito!");
                    window.location.href = "proveedores.html";
                } else {
                    const errorData = await res.json();
                    alert("Error: " + (errorData.error || "No se pudo guardar"));
                }
            } catch (error) {
                console.error("Error en la petición:", error);
                alert("Error crítico al conectar con el servidor");
            }
        });
    }
    
});

async function cargarProveedores(buscar = "") {
    try {
        const url = buscar ? `${API_URL}?buscar=${encodeURIComponent(buscar)}` : API_URL;
        const res = await fetch(url);
        const proveedores = await res.json();
        
        const tablaBody = document.getElementById("tablaProveedoresBody");
        if (!tablaBody) return;

        tablaBody.innerHTML = proveedores.map(p => `
            <tr class="${p.intEstado === 0 ? 'inactivo' : ''}">
                <td>${p.vchRFC}</td>
                <td>${p.vchNombre} ${p.vchApellido_Paterno || ''} ${p.vchApellido_Materno || ''}</td>
                <td>${p.vchTelefono || 'N/A'}</td>
                <td>${p.vchCorreo || 'N/A'}</td>
                <td>${p.vchRazon_Social || 'N/A'}</td>
                <td>
                    <button class="guardar" onclick="window.location.href='proveedor_formulario.html?id=${p.vchRFC}'">Editar</button>
                    
                    ${p.intEstado === 1 
                        ? `<button class="cancelar" onclick="gestionarEstadoProveedor('${p.vchRFC}', 0)">Baja</button>`
                        : `<button class="activar" onclick="gestionarEstadoProveedor('${p.vchRFC}', 1)" style="background-color: #28a745; color: white;">Activar</button>`
                    }
                </td>
            </tr>
        `).join("");
    } catch (error) {
        console.error("Error al cargar tabla:", error);
    }
}

window.gestionarEstadoProveedor = async (rfc, nuevoEstado) => {
    const accion = nuevoEstado === 1 ? "reactivar" : "dar de baja";
    if (confirm(`¿Seguro que desea ${accion} a este proveedor?`)) {
        try {
            const url = nuevoEstado === 1 ? `${API_URL}/${rfc}/activar` : `${API_URL}/${rfc}`;
            const metodo = nuevoEstado === 1 ? "PATCH" : "DELETE";

            const res = await fetch(url, { method: metodo });
            if (res.ok) {
                alert(`Proveedor ${nuevoEstado === 1 ? 'reactivado' : 'dado de baja'}`);
                cargarProveedores();
            }
        } catch (error) {
            alert("Error al procesar la solicitud");
        }
    }
};

