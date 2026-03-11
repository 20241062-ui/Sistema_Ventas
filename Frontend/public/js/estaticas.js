document.addEventListener('DOMContentLoaded', () => {
    // 1. Gestionar Menú de Usuario
    const linkAdmin = document.getElementById('link-admin');
    const linkLogin = document.getElementById('link-login');
    const linkLogout = document.getElementById('link-logout');
    const usuarioMenu = document.getElementById('menu-usuario');

    const usuario = JSON.parse(localStorage.getItem('usuario'));

    if (usuario) {
        if (linkLogin) linkLogin.style.display = 'none';
        if (linkLogout) linkLogout.style.display = 'block';
        
        // Si el contenedor existe, podemos poner un saludo
        if (usuarioMenu) {
            // Personaliza según necesites
        }

        if (usuario.rol === 'Administrador' && linkAdmin) {
            linkAdmin.style.display = 'block';
        }
    }

    // 2. Lógica de Logout
    if (linkLogout) {
        linkLogout.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');
            // Redirigir al inicio (subiendo niveles según corresponda)
            window.location.href = '../../views/index.html';
        });
    }
});