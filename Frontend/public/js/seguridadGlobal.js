document.addEventListener('DOMContentLoaded', () => {
    const usuarioLocal = JSON.parse(localStorage.getItem('usuario') || '{}');
    const rolActual = (localStorage.getItem('rol') || usuarioLocal.vchRol || usuarioLocal.rol || 'Invitado').trim();
    
    const pathFull = window.location.pathname.toLowerCase();
    const paginaActual = pathFull.split('/').pop() || 'index.html';

    const matrizPermisos = {
        'Administrador':   { modulos: ['all'], puedeEscribir: true },
        'DBA':             { modulos: ['all'], puedeEscribir: true },
        'Encargado':       { modulos: ['all'], puedeEscribir: true },
        'Programador':     { modulos: ['all'], puedeEscribir: false },
        'Auditor':         { modulos: ['all'], puedeEscribir: false },
        'Vendedor':        { modulos: ['ventas', 'clientes', 'productos'], puedeEscribir: true }, 
        'Auxiliar':        { modulos: ['clientes', 'productos'], puedeEscribir: false },
        'Soporte Técnico': { modulos: ['clientes', 'ventas', 'productos'], puedeEscribir: false }
    };

    const misPermisos = matrizPermisos[rolActual] || { modulos: [], puedeEscribir: false };

    const mapaRutas = {
        'menuadministrador.html': 'productos',
        'ventas.html': 'ventas',
        'compra.html': 'compras',
        'categorias.html': 'categorias',
        'marcas.html': 'marcas',
        'proveedores.html': 'proveedores',
        'listasucursales.html': 'sucursales',
        'informacionempresa.html': 'informacion',
        'clientes.html': 'clientes',
        'preguntasfrecuentes.html': 'faq',
        'contactolista.html': 'contacto',
        'usuarios.html': 'usuarios'
    };

    if (!misPermisos.modulos.includes('all')) {
        document.querySelectorAll('.nav-admin a').forEach(enlace => {
            const href = enlace.getAttribute('href').toLowerCase();
            const archivoEnlace = href.split('/').pop();
            const moduloDelEnlace = mapaRutas[archivoEnlace];

            if (moduloDelEnlace && !misPermisos.modulos.includes(moduloDelEnlace)) {
                enlace.style.display = 'none';
            }
        });
    }

    if (mapaRutas[paginaActual]) {
        const moduloRequerido = mapaRutas[paginaActual];
        const tieneAcceso = misPermisos.modulos.includes('all') || misPermisos.modulos.includes(moduloRequerido);

        if (!tieneAcceso) {
            const primerModuloPermitido = misPermisos.modulos[0];
            let paginaSegura = 'menuAdministrador.html';

            if (primerModuloPermitido && primerModuloPermitido !== 'all') {
                const rutaDestino = Object.keys(mapaRutas).find(key => mapaRutas[key] === primerModuloPermitido);
                if (rutaDestino) paginaSegura = rutaDestino;
            }

            alert(`Acceso Restringido: El rol [${rolActual}] no tiene acceso a esta sección.`);
            window.location.replace(paginaSegura);
            return;
        }
    }

    if (!misPermisos.puedeEscribir) {
        const aplicarBloqueo = (nodo) => {
            const botones = nodo.querySelectorAll('button:not(#link-logout-global), .guardar, .activar, .cancelar, input[type="submit"]');
            botones.forEach(btn => {
                const txt = btn.innerText.toLowerCase();
                if (txt.includes('editar') || txt.includes('baja') || txt.includes('eliminar') || txt.includes('actualizar') || txt.includes('nuevo')) {
                    btn.style.display = 'none';
                } else {
                    btn.disabled = true;
                    btn.style.opacity = '0.5';
                    btn.style.cursor = 'not-allowed';
                }
            });

            nodo.querySelectorAll('input:not([type="search"]), select, textarea').forEach(input => {
                input.disabled = true;
                input.style.backgroundColor = '#f0f0f0';
            });
        };

        aplicarBloqueo(document);

        const obs = new MutationObserver(muts => {
            muts.forEach(m => m.addedNodes.forEach(n => {
                if (n.nodeType === 1) aplicarBloqueo(n);
            }));
        });
        const target = document.querySelector('.main') || document.body;
        obs.observe(target, { childList: true, subtree: true });
    }
});