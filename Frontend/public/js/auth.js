document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const API_URL = 'https://sistema-ventas-omega.vercel.app/api';

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
                    // Guardamos sesión
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('usuario', JSON.stringify(data.user));

                    alert('¡Bienvenido, ' + data.user.nombre + '!');

                    // --- REDIRECCIÓN DESDE views/ ---
                    if (data.user.rol === 'Administrador') {
                        // views/admin/menuAdministrador.html
                        window.location.href = 'admin/menuAdministrador.html';
                    } else {
                        // views/index.html (está en la misma carpeta que login.html)
                        window.location.href = 'index.html';
                    }
                } else {
                    alert(data.message || 'Credenciales incorrectas');
                }

            } catch (error) {
                console.error('Error:', error);
                alert('No se pudo conectar con el servidor.');
            }
        });
    }
});