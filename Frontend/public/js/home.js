document.addEventListener('DOMContentLoaded', async () => {
    const galeria = document.getElementById('contenedor-galeria');
    const heroTexto = document.querySelector('.textohero');
    const heroForm = document.querySelector('.hero form');

    // Selectores del menú
    const menuUsuario = document.getElementById('menu-usuario');
    const linkLogin = document.getElementById('link-login');
    const linkLogout = document.getElementById('link-logout');
    const linkPerfil = document.querySelector('a[href*="perfil.html"]'); // Selector flexible para Mi Cuenta
    
    const API_URL = 'https://sistema-ventas-omega.vercel.app/api';
    const rutaDetalle = "publico/productoDetalle.html";

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
            adminLink.href = 'admin/menuAdministrador.html';
            adminLink.textContent = 'Panel Admin';
            adminLink.style.color = 'red';
            if (linkLogout) linkLogout.before(adminLink);
        }
    } else {
        // --- ESTADO: SIN SESIÓN ---
        if (linkLogin) linkLogin.style.display = 'block';
        if (linkLogout) linkLogout.style.display = 'none';
        if (linkPerfil) linkPerfil.style.display = 'none'; // OCULTA MI CUENTA
    }

    // Evento único de Cerrar Sesión (Delegado)
    document.addEventListener('click', (e) => {
        if (e.target.id === 'link-logout' || e.target.id === 'btn-logout') {
            e.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');
            alert('Sesión finalizada.');
            
            // Redirección inteligente según la carpeta actual
            const path = window.location.pathname;
            if (path.includes('publico/') || path.includes('admin/')) {
                window.location.href = '../index.html';
            } else {
                window.location.reload();
            }
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
                                    <button type="submit" class="comprarproducto">Comprar</button>
                                </form>
                            </div>
                        </div>
                    </div>`;
            });
        }
    } catch (error) {
        console.error("Error cargando home:", error);
        if (galeria) galeria.innerHTML = '<p style="text-align:center;">Error al cargar los productos.</p>';
    }
});