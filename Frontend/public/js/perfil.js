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

        if (!response.ok) throw new Error('Sesión inválida');

        const user = await response.json();
        const menuName = document.getElementById('menu-user-name');
        if (menuName) {
            menuName.innerHTML = `${user.vchNombre} ${user.vchApellido_Paterno} ${user.vchApellido_Materno || ''}<br><small>${user.vchCorreo}</small>`;
        }

        const avatar = document.getElementById('avatar-inicial');
        if (avatar && user.vchNombre) {
            avatar.textContent = user.vchNombre.charAt(0).toUpperCase();
        }
        const infoNombreCompleto = document.getElementById('info-full-name');
        if (infoNombreCompleto) {
            infoNombreCompleto.textContent = `${user.vchNombre} ${user.vchApellido_Paterno} ${user.vchApellido_Materno || ''}`;
        }

        const infoCorreo = document.getElementById('info-correo');
        if (infoCorreo) infoCorreo.textContent = user.vchCorreo;

        const infoTel = document.getElementById('info-tel');
        if (infoTel) infoTel.textContent = user.vchTelefono || "No registrado";

    } catch (error) {
        console.error("Error en perfil:", error.message);
        localStorage.removeItem('token');
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

window.abrirModal = () => {
    window.location.href = 'actualizarPerfil.html';
};