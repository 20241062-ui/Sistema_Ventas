document.addEventListener('DOMContentLoaded', async () => {
    const galeria = document.querySelector('.galeria-productos');
    const heroTexto = document.querySelector('.textohero');
    const heroForm = document.querySelector('.hero-div form');

    // Elementos del menú de usuario
    const linkAdmin = document.getElementById('link-admin');
    const linkLogin = document.getElementById('link-login');
    const linkLogout = document.getElementById('link-logout');

    // 1. GESTIÓN DE INTERFAZ DE USUARIO (Login/Logout)
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    if (usuario) {
        // Si hay sesión iniciada
        linkLogin.style.display = 'none'; // Ocultar "Iniciar Sesión"
        linkLogout.style.display = 'block'; // Mostrar "Cerrar Sesión"
        
        // Si es Admin, mostrar el Panel de Administración
        if (usuario.rol === 'Administrador') {
            linkAdmin.style.display = 'block';
        }
    }

    // Lógica para Cerrar Sesión
    linkLogout.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        alert('Sesión cerrada correctamente');
        window.location.reload(); // Recargar para actualizar el menú
    });

    // 2. CARGA DE PRODUCTOS DESDE EL BACKEND
    const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:3000/api'
        : 'https://sistema-ventas-omega.vercel.app/api';
    try {
        const response = await fetch(`${API_URL}/productos/home`);
        const data = await response.json();

        // --- Cargar Producto Hero ---
        if (data.hero) {
            heroTexto.innerHTML = `
                <h1>${data.hero.vchNombre} por menos de $${Math.floor(data.hero.floPrecioUnitario).toLocaleString()}</h1>
                <h3>Sólo en Comercializadora Doble L</h3>
            `;
            const inputHero = heroForm.querySelector('input[name="producto_id"]');
            if (inputHero) inputHero.value = data.hero.vchNo_Serie;
        }

        // --- Cargar Galería de Productos ---
        if (data.productos && data.productos.length > 0) {
            galeria.innerHTML = ''; 

            data.productos.forEach(prod => {
                const imgUrl = prod.vchImagen 
                    ? `https://comercializadorall.grupoctic.com/ComercializadoraLL/img/${prod.vchImagen}`
                    : 'https://comercializadorall.grupoctic.com/ComercializadoraLL/img/sin-imagen.png';

                galeria.innerHTML += `
                    <div class="producto"> <img src="${imgUrl}" alt="${prod.vchNombre}" class="imagenproducto">
                        <div class="recuadro"> <div class="producto-detalle"> <div class="texto-producto">
                                    <h2>${prod.vchNombre}</h2>
                                    <h3>$${parseFloat(prod.floPrecioUnitario).toFixed(2)}</h3>
                                </div>
                                <form action="views/publico/productoDetalle.html" method="GET">
                                    <input type="hidden" name="producto_id" value="${prod.vchNo_Serie}">
                                    <button type="submit" class="comprarproducto">Comprar</button>
                                </form>
                            </div>
                        </div>
                    </div>`;
            });
        }
    } catch (error) {
        console.error("Error cargando productos:", error);
        galeria.innerHTML = '<p>Error al conectar con el servidor.</p>';
    }
});