document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const API_URL = 'https://sistemaventasback.vercel.app/api/user/perfil';

    if (!token) {
        window.location.href = '../login.html';
        return;
    }

    try {
        const response = await fetch(API_URL, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('No se pudo obtener la información');

        const user = await response.json();
        const apellidos = `${user.vchApellido_Paterno} ${user.vchApellido_Materno}`;

        document.getElementById('menu-user-name').innerHTML = `${user.vchNombre} ${apellidos}<br><small>${user.vchCorreo}</small>`;

        document.getElementById('info-nombre').textContent = user.vchNombre;
        document.getElementById('info-apellidos').textContent = apellidos;
        document.getElementById('info-correo').textContent = user.vchCorreo;

    } catch (error) {
        console.error(error);
        alert('Sesión expirada o error de conexión. Por favor, inicia sesión de nuevo.');
        localStorage.removeItem('token');
        window.location.href = '../login.html';
    }

    document.getElementById('btn-logout-perfil').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        window.location.href = '../index.html';
    });
});