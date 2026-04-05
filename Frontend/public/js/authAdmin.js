document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const usuarioLocal = JSON.parse(localStorage.getItem('usuario'));
    const API_URL = 'https://sistemaventasback.vercel.app/api/usuarios';
    const currentPath = window.location.pathname;

    if (!token || !usuarioLocal || usuarioLocal.rol !== 'Administrador') {
        console.warn("Acceso denegado: Token ausente o permisos insuficientes.");
        localStorage.clear();
        window.location.href = '../login.html';
        return;
    }

    const menuUsuarioContainer = document.getElementById('menu-usuario-admin');
    if (menuUsuarioContainer) {
        menuUsuarioContainer.innerHTML = `
            <div style="padding: 12px; border-bottom: 1px solid #eee; background-color: #f9f9f9;">
                <small style="color: #8737d1ff; font-weight: bold; font-size: 10px; text-transform: uppercase; display: block;">Administrador</small>
                <div style="font-weight: 600; color: #333; font-size: 14px;">${usuarioLocal.nombre || 'Admin'}</div>
            </div>
            <a href="perfilAdmin.html" style="display: block; padding: 10px 15px; text-decoration: none; color: #444; font-size: 14px; transition: 0.3s;">
                👤 Mi cuenta
            </a>
            <a href="#" id="link-logout-global" style="display: block; padding: 10px 15px; text-decoration: none; color: #e74c3c; font-weight: bold; font-size: 14px; border-top: 1px solid #eee;">
                🚫 Cerrar Sesión
            </a>
        `;

        document.getElementById('link-logout-global').addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm("¿Estás seguro de que deseas salir del panel de control?")) {
                localStorage.clear();
                window.location.href = '../login.html';
            }
        });
    }

    if (currentPath.includes('perfilAdmin.html') || currentPath.includes('actualizarPerfilA.html')) {
        try {
            const res = await fetch(`${API_URL}/perfil-admin`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const data = await res.json();

            if (res.ok) {
                const nombre = data.vchNombre || data.vchnombre || "Admin";
                const apellido = data.vchApellidoP || data.vchapellido || "";
                const apellidoM = data.vchapellidoM || "";
                const correo = data.vchCorreo || data.vchcorreo || "Sin correo";

                const lateral = document.getElementById('lateral-info') || document.getElementById('lateral-info-edit');
                if (lateral) {
                    lateral.innerHTML = `<strong>${nombre}</strong><br>${correo}`;
                }

                const datosAdminContainer = document.getElementById('datos-admin');
                if (datosAdminContainer) {
                    datosAdminContainer.innerHTML = `
                        <p><strong>Nombre:</strong> ${nombre}</p>
                        <p><strong>Apellido:</strong> ${apellido}</p>
                        <p><strong>Apellido Materno:</strong> ${apellidoM}</p>
                        <p><strong>Correo Electrónico:</strong> ${correo}</p>
                    `;
                }

                if (currentPath.includes('actualizarPerfilA.html')) {
                    if (document.getElementById('vchnombre')) document.getElementById('vchnombre').value = nombre;
                    if (document.getElementById('vchapellidoP')) document.getElementById('vchapellidoP').value = apellido;
                    if (document.getElementById('vchapellidoM')) document.getElementById('vchapellidoM').value = data.vchapellidoM || "";
                    const displayCorreo = document.getElementById('vchcorreo-display');
                    if (displayCorreo) displayCorreo.value = correo;
                }

            } else {
                console.error("Error en la respuesta de la API:", data.mensaje);
                const lateral = document.getElementById('lateral-info') || document.getElementById('lateral-info-edit');
                if (lateral) lateral.innerText = "Error: " + (data.mensaje || "No se pudo cargar");
            }
        } catch (error) {
            console.error("Error de conexión al obtener perfil:", error);
        }
    }

    const formPerfil = document.getElementById('form-actualizar-perfil');
    if (formPerfil) {
        formPerfil.addEventListener('submit', async (e) => {
            e.preventDefault();

            const datosActualizados = {
                vchnombre: document.getElementById('vchnombre').value,
                vchapellidoP: document.getElementById('vchapellidoP').value,
                vchapellidoM: document.getElementById('vchapellidoM').value,
                vchpassword: document.getElementById('vchpassword').value || null
            };

            try {
                const updateRes = await fetch(`${API_URL}/actualizar-admin`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(datosActualizados)
                });

                if (updateRes.ok) {
                    usuarioLocal.nombre = datosActualizados.vchnombre;
                    localStorage.setItem('usuario', JSON.stringify(usuarioLocal));

                    alert("✅ ¡Perfil actualizado con éxito!");
                    window.location.href = 'perfilAdmin.html';
                } else {
                    const err = await updateRes.json();
                    alert("❌ Error: " + (err.mensaje || "No se pudo guardar."));
                }
            } catch (error) {
                alert("❌ Error de red al intentar actualizar.");
            }
        });
    }

    const logoutPerfil = document.getElementById('btn-logout-perfil') || document.getElementById('btn-logout-edit');
    if (logoutPerfil) {
        logoutPerfil.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
                localStorage.clear();
                window.location.href = '../login.html';
            }
        });
    }
});