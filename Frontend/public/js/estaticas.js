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
// Función para cerrar sesión
const cerrarSesion = () => {
    // 1. Eliminamos los datos del almacenamiento local
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    // 2. Opcional: Limpiar cualquier otra variable de estado
    localStorage.clear(); // Esto borra TODO lo guardado

    alert('Has cerrado sesión correctamente.');

    // 3. Redirección al login
    // Como estaticas.js se usa en varias carpetas, usamos una ruta relativa inteligente
    // o una ruta absoluta si estás en GitHub Pages
    window.location.href = 'login.html'; 
};

// Escuchar el clic en el botón de cerrar sesión
// Asegúrate de que tus enlaces de "Cerrar sesión" tengan el ID o Clase 'btn-logout'
document.addEventListener('click', (e) => {
    if (e.target && (e.target.id === 'btn-logout' || e.target.classList.contains('logout-link'))) {
        e.preventDefault();
        cerrarSesion();
    }
});