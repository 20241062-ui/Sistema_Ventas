(function() {
    const gestionarSesionEstatica = () => {
        const linkLogin = document.getElementById('link-login');
        const linkLogout = document.getElementById('link-logout');
        const linkPerfil = document.getElementById('link-perfil');
        const usuario = JSON.parse(localStorage.getItem('usuario'));

        if (usuario) {
            if (linkLogin) linkLogin.style.display = 'none';
            if (linkLogout) linkLogout.style.display = 'block';
            if (linkPerfil) linkPerfil.style.display = 'block';
        }

        const cerrarSesion = (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');
            alert('Has cerrado sesión correctamente.');
            window.location.href = '../login.html'; 
        };

        if (linkLogout) {
            linkLogout.addEventListener('click', cerrarSesion);
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', gestionarSesionEstatica);
    } else {
        gestionarSesionEstatica();
    }
})();