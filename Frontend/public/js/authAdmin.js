document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const usuarioLocal = JSON.parse(localStorage.getItem('usuario'));
    const API_URL = 'https://sistemaventasback.vercel.app/api/usuarios';
    const currentPath = window.location.pathname;

    if (!token || !usuarioLocal || usuarioLocal.rol !== 'Administrador') {
        localStorage.clear();
        window.location.href = '../login.html'; 
        return;
    }

    const menuUsuarioContainer = document.getElementById('menu-usuario-admin');
    if (menuUsuarioContainer) {
        menuUsuarioContainer.innerHTML = `
            <div style="padding: 12px; border-bottom: 1px solid #eee; background-color: #f9f9f9;">
                <small style="color: #8737d1ff; font-weight: bold; font-size: 10px; text-transform: uppercase; display: block;">Administrador</small>
                <div style="font-weight: 600; color: #333; font-size: 14px;">${usuarioLocal.nombre}</div>
            </div>
            <a href="perfilAdmin.html" style="display: block; padding: 10px 15px; text-decoration: none; color: #444; font-size: 14px;">👤 Mi cuenta</a>
            <a href="#" id="link-logout-global" style="display: block; padding: 10px 15px; text-decoration: none; color: #e74c3c; font-weight: bold; font-size: 14px; border-top: 1px solid #eee;">🚫 Cerrar Sesión</a>
        `;
        document.getElementById('link-logout-global').addEventListener('click', () => {
            if (confirm("¿Deseas salir?")) { localStorage.clear(); window.location.href = '../login.html'; }
        });
    }

    if (currentPath.includes('perfilAdmin.html') || currentPath.includes('actualizarPerfilA.html')) {
        try {
            const res = await fetch(`${API_URL}/perfil-admin`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();

            if (res.ok) {
                const lateral = document.getElementById('lateral-info') || document.getElementById('lateral-info-edit');
                if (lateral) lateral.innerHTML = `<strong>${data.vchNombre}</strong><br>${data.vchCorreo}`;

                const datosAdmin = document.getElementById('datos-admin');
                if (datosAdmin) {
                    datosAdmin.innerHTML = `
                        <p><strong>Nombre:</strong> ${data.vchNombre}</p>
                        <p><strong>Apellido:</strong> ${data.vchApellidoP}</p>
                        <p><strong>Correo Electrónico:</strong> ${data.vchCorreo}</p>
                    `;
                }

                if (currentPath.includes('actualizarPerfilA.html')) {
                    if (document.getElementById('vchnombre')) document.getElementById('vchnombre').value = data.vchNombre;
                    if (document.getElementById('vchapellidoP')) document.getElementById('vchapellidoP').value = data.vchApellidoP;
                    if (document.getElementById('vchcorreo-display')) document.getElementById('vchcorreo-display').value = data.vchCorreo;
                }
            }
        } catch (error) {
            console.error("Error al cargar perfil:", error);
        }
    }

    const formActualizar = document.getElementById('form-actualizar-perfil');
    if (formActualizar) {
        formActualizar.addEventListener('submit', async (e) => {
            e.preventDefault();
            const datos = {
                vchnombre: document.getElementById('vchnombre').value,
                vchapellidoP: document.getElementById('vchapellidoP').value,
                vchpassword: document.getElementById('vchpassword').value || null
            };

            const updateRes = await fetch(`${API_URL}/actualizar-admin`, {
                method: 'PUT',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(datos)
            });

            if (updateRes.ok) {
                usuarioLocal.nombre = datos.vchnombre;
                localStorage.setItem('usuario', JSON.stringify(usuarioLocal));
                alert("✅ Perfil actualizado.");
                window.location.href = 'perfilAdmin.html';
            } else {
                alert("❌ Error al actualizar.");
            }
        });
    }
});