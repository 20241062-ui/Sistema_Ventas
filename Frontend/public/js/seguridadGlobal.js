document.addEventListener('DOMContentLoaded', () => {
    const usuarioLocal = JSON.parse(localStorage.getItem('usuario') || '{}');
    const rolActual = usuarioLocal.rol || 'Invitado';

    const matrizPermisos = {
        'Administrador':   { modulos: ['ALL'], puedeEscribir: true },
        'DBA':             { modulos: ['ALL'], puedeEscribir: true },
        'Encargado':       { modulos: ['ALL'], puedeEscribir: true },
        'Programador':     { modulos: ['ALL'], puedeEscribir: false },
        'Auditor':         { modulos: ['ALL'], puedeEscribir: false },
        'Vendedor':        { modulos: ['ventas', 'productos', 'clientes'], puedeEscribir: true },
        'Auxiliar':        { modulos: ['ventas', 'productos', 'clientes'], puedeEscribir: false },
        'Soporte Técnico': { modulos: ['clientes', 'ventas', 'productos'], puedeEscribir: false }
    };

    const misPermisos = matrizPermisos[rolActual] || { modulos: [], puedeEscribir: false };
    const paginaActual = window.location.pathname.toLowerCase();

    if (!misPermisos.modulos.includes('ALL')) {
        const enlacesMenu = document.querySelectorAll('.nav-admin a');
        
        enlacesMenu.forEach(enlace => {
            const href = enlace.getAttribute('href').toLowerCase();
            const tieneAcceso = misPermisos.modulos.some(mod => href.includes(mod));
            
            if (!tieneAcceso && !href.includes('perfil')) {
                enlace.style.display = 'none';
            }
        });

        const accesoAutorizado = misPermisos.modulos.some(mod => paginaActual.includes(mod)) || paginaActual.includes('perfil');
        if (!accesoAutorizado && paginaActual.includes('.html')) {
            alert('Acceso restringido: Tu rol no tiene permisos para este módulo.');
            window.location.href = 'menuAdministrador.html';
            return; 
        }
    }

    if (!misPermisos.puedeEscribir) {
        const bloquearAcciones = (contenedor) => {
            const elementosMutacion = contenedor.querySelectorAll('button, input[type="submit"], input, select, textarea');
            
            elementosMutacion.forEach(el => {
                const texto = el.innerText || el.value || '';
                const id = el.id || '';
                const esBuscador = el.classList.contains('buscar') && !texto.includes('🗑️') && !texto.includes('Baja');
                
                if (esBuscador || id === 'inputBuscar' || id === 'btnBuscar' || id === 'link-logout-global') {
                    return; 
                }

                if (el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA') {
                    el.setAttribute('readonly', true);
                    el.setAttribute('disabled', true);
                } else {
                    el.style.opacity = '0.4';
                    el.style.cursor = 'not-allowed';
                    el.setAttribute('disabled', 'true');
                    el.removeAttribute('onclick');
                    el.title = "Acción bloqueada por permisos de tu rol";
                }
            });
        };

        bloquearAcciones(document.body);

        const observador = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) { 
                            bloquearAcciones(node);
                        }
                    });
                }
            });
        });

        const contenedorPrincipal = document.querySelector('.main') || document.body;
        observador.observe(contenedorPrincipal, { childList: true, subtree: true });
    }
});