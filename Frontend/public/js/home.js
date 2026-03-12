document.addEventListener('DOMContentLoaded', async () => {
    const galeria = document.getElementById('contenedor-galeria');
    const heroTexto = document.querySelector('.textohero');
    const heroForm = document.querySelector('.hero form');

    // Selectores del menú
    const menuUsuario = document.getElementById('menu-usuario');
    const linkLogin = document.getElementById('link-login');
    const linkLogout = document.getElementById('link-logout');
    // Ajuste: Buscamos por ID o por texto para asegurar que encuentre "Mi cuenta"
    const linkPerfil = document.getElementById('link-perfil') || document.querySelector('a[href*="perfil.html"]');
    
    const API_URL = 'https://sistema-ventas-omega.vercel.app/api';

    // --- LÓGICA DE RUTAS INTELIGENTES ---
    // Detectamos si estamos dentro de la carpeta 'publico' para ajustar las rutas
    const esSubcarpeta = window.location.pathname.includes('/publico/');
    const rutaDetalle = esSubcarpeta ? "productoDetalle.html" : "publico/productoDetalle.html";
    const rutaAdmin = esSubcarpeta ? "../admin/menuAdministrador.html" : "admin/menuAdministrador.html";
    const rutaLogin = esSubcarpeta ? "../login.html" : "login.html";

    // --- 1. LÓGICA DE INTERFAZ DE USUARIO (SESIÓN) ---
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const token = localStorage.getItem('token');

    if (token && usuario) {
        // --- ESTADO: SESIÓN INICIADA ---
        if (linkLogin) linkLogin.style.display = 'none';
        if (linkLogout) linkLogout.style.display = 'block';
        if (linkPerfil) linkPerfil.style.display = 'block';

        // Insertar saludo si no existe ya
        if (menuUsuario && !document.getElementById('user-greeting')) {
            const saludo = document.createElement('span');
            saludo.id = 'user-greeting';
            saludo.style.display = 'block';
            saludo.style.padding = '10px';
            saludo.style.fontWeight = 'bold';
            saludo.style.color = '#333';
            saludo.textContent = `Hola, ${usuario.nombre}`;
            menuUsuario.prepend(saludo);
        }

        // Si es Admin, agregamos el link al panel (solo si no existe)
        if (usuario.rol === 'Administrador' && !document.getElementById('link-admin-panel')) {
            const adminLink = document.createElement('a');
            adminLink.id = 'link-admin-panel';
            adminLink.href = rutaAdmin; // Usamos la ruta inteligente
            adminLink.textContent = 'Panel Admin';
            adminLink.style.color = 'red';
            if (linkLogout) linkLogout.before(adminLink);
        }
    } else {
        // --- ESTADO: SIN SESIÓN ---
        if (linkLogin) linkLogin.style.display = 'block';
        if (linkLogout) linkLogout.style.display = 'none';
        if (linkPerfil) linkPerfil.style.display = 'none'; 
    }

    // Evento de Cerrar Sesión
    document.addEventListener('click', (e) => {
        if (e.target.id === 'link-logout' || e.target.id === 'btn-logout') {
            e.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');
            alert('Sesión finalizada.');
            // Redirigir siempre al login usando la ruta inteligente
            window.location.href = rutaLogin;
        }
    });

    // --- 2. CARGA DE PRODUCTOS (API) ---
    if (galeria || (heroTexto && heroForm)) { // Solo ejecutamos si hay donde mostrar productos
        try {
            const response = await fetch(`${API_URL}/productos/home`);
            const data = await response.json();

            // Actualizar Hero
            if (data.hero && heroTexto && heroForm) {
                heroTexto.innerHTML = `
                    <h1>${data.hero.vchNombre} por menos de $${Math.floor(data.hero.floPrecioUnitario).toLocaleString()}</h1>
                    <h3>Sólo en Comercializadora Doble L</h3>
                `;
                const inputId = heroForm.querySelector('input[name="producto_id"]');
                if (inputId) inputId.value = data.hero.vchNo_Serie;
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
                                        <button type="submit" class="comprarproducto">Detalles</button>
                                    </form>
                                </div>
                            </div>
                        </div>`;
                });
            }
        } catch (error) {
            console.error("Error cargando productos:", error);
            if (galeria) galeria.innerHTML = '<p style="text-align:center;">Error al cargar los productos.</p>';
        }
    }
});