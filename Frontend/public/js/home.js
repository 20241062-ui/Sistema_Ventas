document.addEventListener('DOMContentLoaded', async () => {
    const galeria = document.querySelector('.galeria-productos');
    const heroTexto = document.querySelector('.textohero');
    const heroForm = document.querySelector('.hero-div form');

    // Detectar URL de la API
    const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:3000/api'
        : 'https://sistema-ventas-omega.vercel.app/api';

    try {
        const response = await fetch(`${API_URL}/productos/home`);
        const data = await response.json();

        // --- 1. CARGAR PRODUCTO HERO (DESTACADO) ---
        if (data.hero) {
            heroTexto.innerHTML = `
                <h1>${data.hero.vchNombre} por menos de $${Math.floor(data.hero.floPrecioUnitario).toLocaleString()}</h1>
                <h3>Sólo en Comercializadora Doble L</h3>
            `;
            // Actualizar el ID en el botón de comprar del Hero
            const inputHero = heroForm.querySelector('input[name="producto_id"]');
            if (inputHero) inputHero.value = data.hero.vchNo_Serie;
        }

        // --- 2. CARGAR GALERÍA DE PRODUCTOS ---
        if (data.productos && data.productos.length > 0) {
            galeria.innerHTML = ''; // Limpiar las tarjetas estáticas que tenías

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
                                    <h3>$${parseFloat(prod.floPrecioUnitario).toFixed(2)}</h3>
                                </div>
                                <form action="publico/productoDetalle.html" method="GET">
                                    <input type="hidden" name="producto_id" value="${prod.vchNo_Serie}">
                                    <button type="submit" class="comprarproducto">Comprar</button>
                                </form>
                            </div>
                        </div>
                    </div>
                `;
            });
        }

    } catch (error) {
        console.error("Error cargando productos:", error);
    }
});