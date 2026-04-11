document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const API_URL = 'https://sistemaventasback.vercel.app/api/usuarios/perfil';

    if (!token) {
        window.location.href = '../login.html';
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al obtener perfil');
        }

        const user = await response.json();

        const paterno = user.vchApellido_Paterno || "";
        const materno = user.vchApellido_Materno || "";
        const nombre = user.vchNombre || "";
        const apellidos = `${paterno} ${materno}`.trim();

        const menuName = document.getElementById('menu-user-name');
        if (menuName) {
            menuName.innerHTML = `${nombre} ${apellidos}<br><small>${user.vchCorreo}</small>`;
        }

        const campos = {
            'info-nombre': nombre,
            'info-apellidos': apellidos,
            'info-correo': user.vchCorreo
        };

        for (const [id, valor] of Object.entries(campos)) {
            const el = document.getElementById(id);
            if (el) el.textContent = valor;
        }

    } catch (error) {
        console.error("Error en perfil:", error.message);
        alert('Tu sesión ha expirado o hubo un error de conexión.');
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        window.location.href = '../login.html';
    }

    const btnLogout = document.getElementById('btn-logout-perfil');
    if (btnLogout) {
        btnLogout.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');
            window.location.href = '../index.html';
        });
    }
});