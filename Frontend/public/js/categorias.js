document.addEventListener('DOMContentLoaded', async () => {
    const galeria = document.getElementById('contenedor-galeria');
    const heroTexto = document.querySelector('.textohero');
    const heroForm = document.querySelector('.hero form');
    const catId = document.body.dataset.categoria;

    const linkAdmin = document.getElementById('link-admin');
    const linkLogin = document.getElementById('link-login');
    const linkLogout = document.getElementById('link-logout');

    const rutaDetalle = "productoDetalle.html";

    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (usuario) {
        if (linkLogin) linkLogin.style.display = 'none';
        if (linkLogout) linkLogout.style.display = 'block';
        if (usuario.rol === 'Administrador' && linkAdmin) {
            linkAdmin.style.display = 'block';
        }
    }

    if (linkLogout) {
        linkLogout.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');
            window.location.reload();
        });
    }

    const API_URL = 'https://sistemaventasback.vercel.app/api';

    try {
        const response = await fetch(`${API_URL}/productos/categoria/${catId}`);
        const data = await response.json();

        if (data.hero && heroTexto && heroForm) {
            heroTexto.innerHTML = `
                <h1>${data.hero.vchNombre} $${parseFloat(data.hero.floPrecioUnitario).toLocaleString('es-MX', {minimumFractionDigits: 2})}</h1>
                <h3>Sólo en Comercializadora Doble L</h3>
            `;
            heroForm.querySelector('input[name="producto_id"]').value = data.hero.vchNo_Serie;
            heroForm.action = rutaDetalle;
        }

        if (galeria) {
            if (data.productos && data.productos.length > 0) {
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
                        </div>
                    `;
                });
            } else {
                galeria.innerHTML = '<p style="color:white; text-align:center; width:100%;">No hay productos en esta categoría por ahora.</p>';
            }
        }
    } catch (error) {
        console.error("Error en categorias.js:", error);
    }
});