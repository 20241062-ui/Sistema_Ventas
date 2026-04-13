document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const API_URL = 'https://sistemaventasback.vercel.app/api';

    // --- MEJORA: AUTO-LOGIN (PERSISTENCIA) ---
    const tokenExistente = localStorage.getItem('token');
    const usuarioExistente = JSON.parse(localStorage.getItem('usuario') || '{}');
    const rolesAdmin = ['Administrador', 'Vendedor', 'Encargado'];

    if (tokenExistente && usuarioExistente.rol) {
        if (rolesAdmin.includes(usuarioExistente.rol)) {
            window.location.href = 'admin/menuAdministrador.html';
            return;
        } else {
            window.location.href = 'index.html';
            return;
        }
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const user = document.getElementById('user').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch(`${API_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user, password })
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('usuario', JSON.stringify(data.user));
                    localStorage.setItem('rol', data.user.rol); 

                    alert(`¡Bienvenido/a, ${data.user.nombre}!`);

                    if (rolesAdmin.includes(data.user.rol)) {
                        window.location.href = 'admin/menuAdministrador.html';
                    } else {
                        window.location.href = 'index.html';
                    }
                } else {
                    alert(data.message || 'Credenciales incorrectas');
                }

            } catch (error) {
                console.error('Error de red o servidor:', error);
                alert('No se pudo conectar con el servidor en Vercel.');
            }
        });
    }
});