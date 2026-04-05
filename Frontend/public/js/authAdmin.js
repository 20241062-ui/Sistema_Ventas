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
                <div id="nombre-usuario-nav" style="font-weight: 600; color: #333; font-size: 14px;">${usuarioLocal.nombre}</div>
            </div>
            <a href="perfilAdmin.html" style="display: block; padding: 10px 15px; text-decoration: none; color: #444; font-size: 14px;">👤 Mi cuenta</a>
            <a href="#" id="link-logout-global" style="display: block; padding: 10px 15px; text-decoration: none; color: #e74c3c; font-weight: bold; font-size: 14px; border-top: 1px solid #eee;">🚫 Cerrar Sesión</a>
        `;

        document.getElementById('link-logout-global').addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm("¿Estás seguro de que deseas salir?")) {
                localStorage.clear();
                window.location.href = '../login.html';
            }
        });
    }

    if (currentPath.includes('perfilAdmin.html')) {
        try {
            const res = await fetch(`${API_URL}/perfil-admin`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();

            if (res.ok) {
                const menuP = document.querySelector('.perfil-menu p');
                if (menuP) menuP.innerHTML = `<strong>${data.vchNombre}</strong><br>${data.vchCorreo}`;
                
                const infoDiv = document.querySelector('.perfil-info');
                if (infoDiv) {
                    infoDiv.innerHTML = `
                        <h3>Información del administrador</h3>
                        <p><strong>Nombre:</strong> ${data.vchNombre}</p>
                        <p><strong>Apellido:</strong> ${data.vchApellidoP}</p>
                        <p><strong>Correo Electrónico:</strong> ${data.vchCorreo}</p>
                        <button class="btn-editar" onclick="window.location.href='actualizarPerfilA.html'">Editar perfil</button>
                    `;
                }
            }
        } catch (error) {
            console.error("Error al obtener perfil:", error);
        }
    }

    const formPerfil = document.querySelector('form');
    if (formPerfil && currentPath.includes('actualizarPerfilA.html')) {
        try {
            const res = await fetch(`${API_URL}/perfil-admin`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            
            if (res.ok) {
                if (formPerfil.vchnombre) formPerfil.vchnombre.value = data.vchNombre;
                if (formPerfil.vchapellidoP) formPerfil.vchapellidoP.value = data.vchApellidoP;
                const correoDisplay = document.querySelector('input[type="email"]');
                if (correoDisplay) correoDisplay.value = data.vchCorreo;
            }

            formPerfil.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const datosActualizados = {
                    vchnombre: formPerfil.vchnombre.value,
                    vchapellidoP: formPerfil.vchapellidoP.value,
                    vchpassword: formPerfil.vchpassword.value || null
                };

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
                    alert("❌ Error al guardar los cambios.");
                }
            });
        } catch (error) {
            console.error("Error en la edición:", error);
        }
    }
});