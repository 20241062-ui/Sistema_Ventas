(function() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const token = localStorage.getItem('token');

    if (!token || !usuario || usuario.rol !== 'Administrador') {
        alert("Acceso restringido. Por favor, inicia sesión como administrador.");
        window.location.href = '../login.html';
    }
})();