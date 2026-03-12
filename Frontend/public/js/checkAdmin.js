// Este script se debe incluir en el <head> de todas las páginas de la carpeta admin/
(function() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const token = localStorage.getItem('token');

    // Si no hay token o no es administrador, lo mandamos al login de inmediato
    if (!token || !usuario || usuario.rol !== 'Administrador') {
        alert("Acceso restringido. Por favor, inicia sesión como administrador.");
        // Como estamos en admin/, subimos un nivel para encontrar login.html en views/
        window.location.href = '../login.html';
    }
})();