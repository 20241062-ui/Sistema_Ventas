document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const API_URL = 'https://sistemaventasback.vercel.app/api';

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const user = document.getElementById('user').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch(`${API_URL}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ user, password })
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('usuario', JSON.stringify(data.user));

                    alert('¡Bienvenido/a, ' + data.user.nombre + '!');

                    const rolesAdmin = ['Administrador', 'Vendedor', 'Encargado'];
                    
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
                alert('No se pudo establecer conexión con el servidor en Vercel. Revisa tu conexión a internet.');
            }
        });
    }
});