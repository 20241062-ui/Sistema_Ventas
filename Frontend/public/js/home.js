document.addEventListener('currencyReady', async () => {
    const galeria = document.getElementById('contenedor-galeria');
    const heroTexto = document.querySelector('.textohero');
    const heroForm = document.querySelector('.hero form');
    const contenedorPaginacion = document.getElementById('contenedor-paginacion');

    const menuUsuario = document.getElementById('menu-usuario');
    const linkLogin = document.getElementById('link-login');
    const linkLogout = document.getElementById('link-logout');
    const linkPerfil = document.getElementById('link-perfil') || document.querySelector('a[href*="perfil.html"]');

    const API_URL = 'https://sistemaventasback.vercel.app/api';

    const esSubcarpeta = window.location.pathname.includes('/publico/');
    const rutaDetalle = esSubcarpeta ? "productoDetalle.html" : "publico/productoDetalle.html";
    const rutaAdmin = esSubcarpeta ? "../admin/menuAdministrador.html" : "admin/menuAdministrador.html";
    const rutaLogin = esSubcarpeta ? "../login.html" : "login.html";

    const params = new URLSearchParams(window.location.search);
    const idUrl = params.get('id');
    let categoriaActual = idUrl || 'todas';

    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    const token = localStorage.getItem('token');

    if (token && usuario.nombre) {
        if (linkLogin) linkLogin.style.display = 'none';
        if (linkLogout) linkLogout.style.display = 'block';
        if (linkPerfil) linkPerfil.style.display = 'block';

        if (menuUsuario && !document.getElementById('user-greeting')) {
            const saludo = document.createElement('span');
            saludo.id = 'user-greeting';
            saludo.style = 'display:block; padding:10px; font-weight:bold; color:#333;';
            saludo.textContent = `Hola, ${usuario.nombre}`;
            menuUsuario.prepend(saludo);
        }

        const rolesAdmin = ['Administrador', 'Vendedor', 'Encargado'];
        if (rolesAdmin.includes(usuario.rol) && !document.getElementById('link-admin-panel')) {
            const adminLink = document.createElement('a');
            adminLink.id = 'link-admin-panel';
            adminLink.href = rutaAdmin;
            adminLink.textContent = 'Panel Admin';
            adminLink.style.color = 'red';
            if (linkLogout) linkLogout.before(adminLink);
        }
    }

    async function cargarCatalogo(pagina = 1, categoria = 'todas') {
        if (!galeria) return;

        galeria.innerHTML = '<p style="text-align:center; width:100%; color:white;">Cargando catálogo localizado...</p>';

        try {
            const url = `${API_URL}/productos/home?pagina=${pagina}&categoria=${categoria}`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.hero && heroTexto && heroForm && pagina === 1) {
                heroTexto.innerHTML = `
                    <h1>${data.hero.vchNombre} por solo ${GlobalCurrency.format(data.hero.floPrecioUnitario)}</h1>
                    <h3>Sólo en Comercializadora Doble L</h3>
                `;
                const inputId = heroForm.querySelector('input[name="producto_id"]');
                if (inputId) inputId.value = data.hero.vchNo_Serie;
                heroForm.action = rutaDetalle;
            }

            galeria.innerHTML = '';
            if (data.productos && data.productos.length > 0) {
                data.productos.forEach(prod => {
                    const imgUrl = prod.vchImagen
                        ? prod.vchImagen
                        : 'https://res.cloudinary.com/dnu57rgek/image/upload/v1774479182/sin-imagen.png';

                    galeria.innerHTML += `
                        <div class="producto">
                            <img src="${imgUrl}" alt="${prod.vchNombre}" class="imagenproducto">
                            <div class="recuadro">
                                <div class="texto-producto">
                                    <h2>${prod.vchNombre}</h2>
                                    <h3>${GlobalCurrency.format(prod.floPrecioUnitario)}</h3>
                                </div>
                                <div style="display:flex; gap:10px; width:100%; margin-top:10px;">
                                    <button onclick="Cart.add({
                                        id: '${prod.vchNo_Serie}', 
                                        nombre: '${prod.vchNombre}', 
                                        precio: ${prod.floPrecioUnitario}, 
                                        img: '${imgUrl}'
                                    })" class="btn-pag" style="flex:1;">🛒</button>
                                    
                                    <form action="${rutaDetalle}" method="GET" style="flex:2;">
                                        <input type="hidden" name="producto_id" value="${prod.vchNo_Serie}">
                                        <button type="submit" class="comprarproducto" style="width:100%; padding:10px;">Detalles</button>
                                    </form>
                                </div>
                            </div>
                        </div>`;
                });
            } else {
                galeria.innerHTML = '<p style="text-align:center; width:100%; color:white;">No hay productos disponibles en esta categoría.</p>';
            }

            if (data.pagination) {
                renderizarPaginacion(data.pagination);
            }

        } catch (error) {
            console.error("Error cargando productos:", error);
            galeria.innerHTML = '<p style="text-align:center; width:100%; color:white;">Error al conectar con el servidor.</p>';
        }
    }

    function renderizarPaginacion(pagination) {
        if (!contenedorPaginacion) return;
        contenedorPaginacion.innerHTML = '';

        for (let i = 1; i <= pagination.totalPages; i++) {
            const btn = document.createElement('button');
            btn.innerText = i;
            btn.className = (i === pagination.currentPage) ? 'btn-pag activa' : 'btn-pag';
            btn.onclick = () => {
                cargarCatalogo(i, categoriaActual);
                window.scrollTo({ top: 400, behavior: 'smooth' });
            };
            contenedorPaginacion.appendChild(btn);
        }
    }

    window.aplicarFiltro = (idCat) => {
        categoriaActual = idCat;
        const nuevaUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?id=' + idCat;
        window.history.pushState({ path: nuevaUrl }, '', nuevaUrl);

        cargarCatalogo(1, idCat);
    };

    document.addEventListener('click', (e) => {
        if (e.target.id === 'link-logout' || e.target.id === 'btn-logout') {
            e.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');
            alert('Sesión finalizada.');
            window.location.href = rutaLogin;
        }
    });

    cargarCatalogo(1, categoriaActual);
});