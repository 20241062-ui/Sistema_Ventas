document.addEventListener('DOMContentLoaded', () => {
    const usuarioLocal = JSON.parse(localStorage.getItem('usuario') || '{}');
    const rolActual = usuarioLocal.rol || 'Invitado';

    const matrizPermisos = {
        'Administrador':   { modulos: ['ALL'], puedeEscribir: true },
        'DBA':             { modulos: ['ALL'], puedeEscribir: true },
        'Encargado':       { modulos: ['ALL'], puedeEscribir: true },
        'Programador':     { modulos: ['ALL'], puedeEscribir: false },
        'Auditor':         { modulos: ['ALL'], puedeEscribir: false },
        'Vendedor':        { modulos: ['ventas', 'clientes', 'productos'], puedeEscribir: true }, 
        'Auxiliar':        { modulos: ['clientes', 'productos'], puedeEscribir: false },
        'Soporte Técnico': { modulos: ['clientes', 'ventas', 'productos'], puedeEscribir: false }
    };

    const misPermisos = matrizPermisos[rolActual] || { modulos: [], puedeEscribir: false };
    const pathCompleto = window.location.pathname.toLowerCase();

    if (pathCompleto.includes('menuadministrador.html') && !misPermisos.modulos.includes('ALL')) {
        const primerModulo = misPermisos.modulos[0]; 
        if (primerModulo) {
            window.location.href = `${primerModulo}.html`;
            return;
        }
    }

    if (!misPermisos.modulos.includes('ALL')) {
        const enlacesMenu = document.querySelectorAll('.nav-admin a');
        
        enlacesMenu.forEach(enlace => {
            const href = enlace.getAttribute('href').toLowerCase();
            const tieneAcceso = misPermisos.modulos.some(mod => href.includes(mod));
            
            if (!tieneAcceso && !href.includes('perfil')) {
                enlace.style.display = 'none';
            }
        });

        const esPaginaAdmin = pathCompleto.includes('.html');
        const esPerfil = pathCompleto.includes('perfil');
        const tienePermisoRuta = misPermisos.modulos.some(mod => pathCompleto.includes(mod));

        if (esPaginaAdmin && !esPerfil && !tienePermisoRuta && !pathCompleto.includes('menuadministrador')) {
            alert('Acceso restringido para el rol: ' + rolActual);
            window.location.href = 'menuAdministrador.html'; 
            return;
        }
    }

    if (!misPermisos.puedeEscribir) {
        const bloquearElementos = (padre) => {
            const selectores = [
                'button:not(.buscar)', 
                'input[type="submit"]',
                '.guardar', '.cancelar', '.activar',
                'input:not([type="search"]):not(#input-buscar)',
                'select', 'textarea'
            ];

            padre.querySelectorAll(selectores.join(',')).forEach(el => {
                if (el.innerText.toLowerCase().includes('editar') || 
                    el.innerText.toLowerCase().includes('baja') || 
                    el.innerText.toLowerCase().includes('activar')) {
                    
                    el.style.display = 'none';
                } else {
                    el.disabled = true;
                    el.style.opacity = '0.5';
                    el.style.cursor = 'not-allowed';
                }
            });
        };

        bloquearElementos(document);

        const observer = new MutationObserver((mutations) => {
            mutations.forEach(m => {
                m.addedNodes.forEach(nodo => {
                    if (nodo.nodeType === 1) bloquearElementos(nodo);
                });
            });
        });

        const mainContainer = document.querySelector('.main') || document.body;
        observer.observe(mainContainer, { childList: true, subtree: true });
    }
});