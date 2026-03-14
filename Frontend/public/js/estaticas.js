document.addEventListener('DOMContentLoaded', () => {
    const linkAdmin = document.getElementById('link-admin');
    const linkLogin = document.getElementById('link-login');
    const linkLogout = document.getElementById('link-logout');
    const usuarioMenu = document.getElementById('menu-usuario');

    const usuario = JSON.parse(localStorage.getItem('usuario'));

    if (usuario) {
        if (linkLogin) linkLogin.style.display = 'none';
        if (linkLogout) linkLogout.style.display = 'block';
        
        if (usuarioMenu) {
        }

        if (usuario.rol === 'Administrador' && linkAdmin) {
            linkAdmin.style.display = 'block';
        }
    }

    if (linkLogout) {
        linkLogout.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');
            window.location.href = '../../views/index.html';
        });
    }
});
const cerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    alert('Has cerrado sesión correctamente.');

    window.location.href = 'login.html'; 
};

document.addEventListener('click', (e) => {
    if (e.target && (e.target.id === 'btn-logout' || e.target.classList.contains('logout-link'))) {
        e.preventDefault();
        cerrarSesion();
    }
});