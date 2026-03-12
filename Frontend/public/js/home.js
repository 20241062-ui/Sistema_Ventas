document.addEventListener('DOMContentLoaded', async () => {
    const galeria = document.getElementById('contenedor-galeria');
    const heroTexto = document.querySelector('.textohero');
    const heroForm = document.querySelector('.hero form');

    // Selectores del menú
    const menuUsuario = document.getElementById('menu-usuario');
    const linkLogin = document.getElementById('link-login');
    const linkLogout = document.getElementById('link-logout');
    
    const API_URL = 'https://sistema-ventas-omega.vercel.app/api';
    const rutaDetalle = "publico/productoDetalle.html";

    // --- 1. LÓGICA DE INTERFAZ DE USUARIO (SESIÓN) ---
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    if (usuario) {
        // En lugar de borrar todo el menú, personalizamos lo que ya existe
        if (linkLogin) linkLogin.style.display = 'none';
        if (linkLogout) linkLogout.style.display = 'block';

        // Insertar saludo al inicio del menú sin borrar "Mi Cuenta"
        const saludo = document.createElement('span');
        saludo.style.display = 'block';
        saludo.style.padding = '10px';
        saludo.style.fontWeight = 'bold';
        saludo.style.color = '#333';
        saludo.textContent = `Hola, ${usuario.nombre}`;
        menuUsuario.prepend(saludo);

        // Si es Admin, agregamos el link al panel (si no existe)
        if (usuario.rol === 'Administrador') {
            const adminLink = document.createElement('a');
            adminLink.href = 'admin/menuAdministrador.html';
            adminLink.textContent = 'Panel Admin';
            adminLink.style.color = 'red'; // Para resaltarlo
            // Lo insertamos antes del botón de cerrar sesión
            linkLogout.before(adminLink);
        }
    }

    // Evento único de Cerrar Sesión
    document.addEventListener('click', (e) => {
        if (e.target.id === 'link-logout' || e.target.id === 'btn-logout') {
            e.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');
            alert('Sesión finalizada.');
            window.location.reload();
        }
    });

    // --- 2. CARGA DE PRODUCTOS (API) ---
    try {
        const response = await fetch(`${API_URL}/productos/home`);
        const data = await response.json();

        // Actualizar Hero
        if (data.hero && heroTexto && heroForm) {
            heroTexto.innerHTML = `
                <h1>${data.hero.vchNombre} por menos de $${Math.floor(data.hero.floPrecioUnitario).toLocaleString()}</h1>
                <h3>Sólo en Comercializadora Doble L</h3>
            `;
            heroForm.querySelector('input[name="producto_id"]').value = data.hero.vchNo_Serie;
            heroForm.action = rutaDetalle;
        }

        // Actualizar Galería
        if (galeria && data.productos) {
            galeria.innerHTML = ''; 
            data.productos.forEach(prod => {
                const imgUrl = prod.vchImagen 
                    ? `https://comercializadorall.grupoctic.com/ComercializadoraLL/img/${prod.vchImagen}`
                    : 'https://comercializadorall.grupoctic.com/ComercializadoraLL/img/sin-imagen.png';

                galeria.innerHTML += `
                    <div class="producto">
                        <img src="${imgUrl}" alt="${prod.vchNombre}" class="imagenproducto">
                        <div class="recuadro">
                            <div class="producto-detalle">
                                <div class="texto-producto">
                                    <h2>${prod.vchNombre}</h2>
                                    <h3>$${parseFloat(prod.floPrecioUnitario).toLocaleString('es-MX', {minimumFractionDigits: 2})}</h3>
                                </div>
                                <form action="${rutaDetalle}" method="GET">
                                    <input type="hidden" name="producto_id" value="${prod.vchNo_Serie}">
                                    <button type="submit" class="comprarproducto">Comprar</button>
                                </form>
                            </div>
                        </div>
                    </div>`;
            });
        }
    } catch (error) {
        console.error("Error cargando home:", error);
        if (galeria) galeria.innerHTML = '<p>Error al cargar los productos.</p>';
    }
});