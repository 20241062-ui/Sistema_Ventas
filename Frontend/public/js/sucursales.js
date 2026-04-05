// Configuración de la URL de tu API en Vercel
const API_URL = "https://sistemaventasback.vercel.app/api/sucursales";

document.addEventListener("DOMContentLoaded", () => {
    const tablaBody = document.getElementById("tablaSucursalesBody");
    const form = document.getElementById("formSucursal");
    
    const params = new URLSearchParams(window.location.search);
    const editId = params.get("id");

    if (editId && form) {
        document.getElementById("tituloFormulario").innerText = "Actualizar Sucursal";
        document.getElementById("btnGuardar").innerText = "Actualizar Cambios";

        fetch(`${API_URL}/${editId}`)
            .then(res => {
                if (!res.ok) throw new Error("Error al obtener datos");
                return res.json();
            })
            .then(data => {
                if (data) {
                    document.getElementById("intid").value = data.intid || "";
                    document.getElementById("vchnombre").value = data.vchnombre || "";
                    document.getElementById("vchdireccion").value = data.vchdireccion || "";
                    document.getElementById("vchciudad").value = data.vchciudad || "";
                    document.getElementById("vchtelefono").value = data.vchtelefono || "";
                    document.getElementById("vchhorario").value = data.vchhorario || "";
                    document.getElementById("vchlink_mapa").value = data.vchlink_mapa || "";
                }
            })
            .catch(err => {
                console.error("Error al cargar sucursal:", err);
                alert("No se pudieron cargar los datos de la sucursal.");
            });
    }

    if (tablaBody) {
        cargarSucursales();
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
                    alert("¡Sucursal guardada correctamente!");
                    window.location.href = "listaSucursales.html";
                } else {
                    const errorMsg = await res.json();
                    alert("Error al guardar: " + (errorMsg.error || "Intente de nuevo"));
                }
            } catch (error) {
                console.error("Error en la petición:", error);
                alert("Error crítico al conectar con el servidor.");
            }
        });
    }
});

async function cargarSucursales() {
    try {
        const res = await fetch(API_URL);
        const sucursales = await res.json();
        
        const tablaBody = document.getElementById("tablaSucursalesBody");
        if (!tablaBody) return;

        if (sucursales.length === 0) {
            tablaBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No hay sucursales registradas</td></tr>`;
            return;
        }

        const html = sucursales.map(s => `
            <tr>
                <td>${s.vchnombre}</td>
                <td>${s.vchdireccion}</td>
                <td>${s.vchciudad}</td>
                <td>${s.vchtelefono || 'N/A'}</td>
                <td>${s.vchhorario || 'N/A'}</td>
                <td>
                    <button class="guardar" onclick="window.location.href='sucursal_formulario.html?id=${s.intid}'">Editar</button>
                    <button class="cancelar" onclick="eliminarSucursal(${s.intid})">Baja</button>
                </td>
            </tr>
        `).join("");
        
        tablaBody.innerHTML = html;
    } catch (error) {
        console.error("Error al cargar la tabla:", error);
        document.getElementById("tablaSucursalesBody").innerHTML = `<tr><td colspan="6" style="color:red; text-align:center;">Error al conectar con la base de datos</td></tr>`;
    }
}

async function eliminarSucursal(id) {
    if (confirm("¿Seguro que desea dar de baja esta sucursal?")) {
        try {
            const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            if (res.ok) {
                alert("Sucursal dada de baja.");
                cargarSucursales(); 
            } else {
                alert("No se pudo dar de baja la sucursal.");
            }
        } catch (error) {
            console.error("Error al dar de baja:", error);
        }
    }
}