document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtener datos y normalizar para evitar errores de mayúsculas
    const usuarioLocal = JSON.parse(localStorage.getItem('usuario') || '{}');
    const rolActual = (usuarioLocal.rol || 'Invitado').trim();
    
    // Extraemos solo el nombre del archivo (ej: "ventas.html")
    const pathFull = window.location.pathname.toLowerCase();
    const paginaActual = pathFull.split('/').pop() || 'index.html';

    // 2. MATRIZ DE PERMISOS (Asegúrate de que los nombres coincidan con tu DB)
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

    // ====================================================================
    // A. LÓGICA DE REDIRECCIÓN INICIAL (El Recepcionista)
    // ====================================================================
    
    // Si entras a la raíz del admin y no eres Admin total, te mandamos a tu primer módulo
    if (paginaActual === 'menuadministrador.html' && !misPermisos.modulos.includes('all')) {
        const destino = misPermisos.modulos[0]; // Ej: "ventas"
        if (destino) {
            window.location.replace(`${destino}.html`);
            return;
        }
    }

    // ====================================================================
    // B. CONTROL DE ACCESO (El Guardia)
    // ====================================================================
    
    if (!misPermisos.modulos.includes('all')) {
        // 1. Ocultar enlaces del menú lateral
        const enlacesMenu = document.querySelectorAll('.nav-admin a');
        enlacesMenu.forEach(enlace => {
            const href = enlace.getAttribute('href').toLowerCase();
            const tieneAcceso = misPermisos.modulos.some(mod => href.includes(mod));
            
            if (!tieneAcceso && !href.includes('perfil')) {
                enlace.style.display = 'none';
            }
        });

        // 2. Verificar si la página actual está permitida
        const esPaginaEspecial = paginaActual.includes('perfil') || paginaActual.includes('menuadministrador');
        const tienePermisoRuta = misPermisos.modulos.some(mod => paginaActual.includes(mod));

        // PROTECCIÓN CONTRA BUCLE: Solo alertamos si NO es una página especial y NO tiene permiso
        if (!esPaginaEspecial && !tienePermisoRuta && paginaActual.endsWith('.html')) {
            alert(`Acceso Restringido: El perfil ${rolActual} no tiene acceso a ${paginaActual}`);
            window.location.replace('menuAdministrador.html');
            return;
        }
    }

    // ====================================================================
    // C. BLOQUEO DE BOTONES (Solo Lectura)
    // ====================================================================
    if (!misPermisos.puedeEscribir) {
        const aplicarBloqueo = (nodo) => {
            // Seleccionamos botones de acción (excepto el de cerrar sesión)
            const botones = nodo.querySelectorAll('button:not(#link-logout-global), .guardar, .activar, .cancelar, input[type="submit"]');
            botones.forEach(btn => {
                // Ocultamos botones críticos en tablas
                const txt = btn.innerText.toLowerCase();
                if (txt.includes('editar') || txt.includes('baja') || txt.includes('eliminar') || txt.includes('actualizar')) {
                    btn.style.display = 'none';
                } else {
                    btn.disabled = true;
                    btn.style.opacity = '0.5';
                }
            });

            // Bloqueamos inputs de formularios
            nodo.querySelectorAll('input:not([type="search"]), select, textarea').forEach(input => {
                input.disabled = true;
                input.style.backgroundColor = '#f0f0f0';
            });
        };

        aplicarBloqueo(document);

        // Observador para contenido dinámico (tablas)
        const obs = new MutationObserver(muts => {
            muts.forEach(m => m.addedNodes.forEach(n => {
                if (n.nodeType === 1) aplicarBloqueo(n);
            }));
        });
        const target = document.querySelector('.main') || document.body;
        obs.observe(target, { childList: true, subtree: true });
    }
});