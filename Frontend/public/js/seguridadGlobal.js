(function() {
    const usuarioLocal = JSON.parse(localStorage.getItem('usuario') || '{}');
    const rolActual = (localStorage.getItem('rol') || usuarioLocal.vchRol || usuarioLocal.rol || 'invitado').trim().toLowerCase();
    const pathFull = window.location.pathname.toLowerCase();
    let paginaActual = pathFull.split('/').pop() || 'index.html';
    paginaActual = paginaActual.split('?')[0].split('#')[0];

    const matrizPermisos = {
        'administrador':   { modulos: ['all'], puedeEscribir: true },
        'dba':             { modulos: ['all'], puedeEscribir: true },
        'encargado':       { modulos: ['all'], puedeEscribir: true },
        'programador':     { modulos: ['all'], puedeEscribir: false },
        'auditor':         { modulos: ['all'], puedeEscribir: false },
        'vendedor':        { modulos: ['ventas', 'clientes', 'productos'], puedeEscribir: true }, 
        'auxiliar':        { modulos: ['clientes', 'productos'], puedeEscribir: false },
        'soporte técnico': { modulos: ['clientes', 'ventas', 'productos'], puedeEscribir: false }
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

    if (mapaRutas[paginaActual]) {
        const moduloRequerido = mapaRutas[paginaActual];
        const tieneAcceso = misPermisos.modulos.includes('all') || misPermisos.modulos.includes(moduloRequerido);

        if (!tieneAcceso) {
            alert(`Acceso Restringido: Tu rol no tiene acceso a esta sección.`);
            window.location.replace('menuAdministrador.html');
            return;
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        if (!misPermisos.modulos.includes('all')) {
            document.querySelectorAll('.nav-admin a').forEach(enlace => {
                let href = enlace.getAttribute('href').toLowerCase().split('?')[0].split('/').pop();
                const modulo = mapaRutas[href];
                if (modulo && !misPermisos.modulos.includes(modulo)) {
                    enlace.style.display = 'none';
                }
            });
        }

        if (!misPermisos.puedeEscribir) {
            const bloquear = (contexto) => {
                const selectores = 'button:not(#link-logout-global), .guardar, .cancelar, .activar, input[type="submit"], input:not([type="search"]), select, textarea';
                contexto.querySelectorAll(selectores).forEach(el => {
                    const txt = (el.innerText || el.value || "").toLowerCase();
                    if (txt.includes('editar') || txt.includes('baja') || txt.includes('eliminar') || txt.includes('nuevo')) {
                        el.style.display = 'none';
                    } else {
                        el.disabled = true;
                        el.style.opacity = '0.5';
                    }
                });
            };
            bloquear(document);
            new MutationObserver(m => m.forEach(r => r.addedNodes.forEach(n => n.nodeType === 1 && bloquear(n))))
                .observe(document.body, { childList: true, subtree: true });
        }
    });
})();