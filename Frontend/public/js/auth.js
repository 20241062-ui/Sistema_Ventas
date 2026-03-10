document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    // CONFIGURACIÓN DE URL: Detecta si usas localhost o Vercel
    const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:3000/api'
        : 'https://sistema-ventas-omega.vercel.app/api';

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // 1. Capturar datos del HTML
            const user = document.getElementById('user').value;
            const password = document.getElementById('password').value;

            try {
                // 2. Enviar petición al Backend (URL dinámica)
                const response = await fetch(`${API_URL}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ user, password })
                });

                const data = await response.json();

                if (response.ok) {
                    // 3. Éxito: Guardamos el JWT y datos del usuario
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('usuario', JSON.stringify(data.user));

                    alert('¡Bienvenido, ' + data.user.nombre + '!');

                    // 4. Redirección inteligente
                    // Como el login.html está en views/, index.html está al mismo nivel
                    // y admin/ está dentro de views/
                    if (data.user.rol === 'Administrador') {
                        window.location.href = 'admin/menuAdministrador.html';
                    } else {
                        window.location.href = 'index.html';
                    }
                } else {
                    // 5. Errores de credenciales (401 o 404)
                    alert(data.message || 'Error al iniciar sesión');
                }

            } catch (error) {
                console.error('Error de conexión:', error);
                alert('Error de conexión con el servidor. Verifica que el Backend en Vercel esté activo.');
            }
        });
    }
});