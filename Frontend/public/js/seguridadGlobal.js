document.addEventListener('DOMContentLoaded', () => {
    // 1. EXTRACCIÓN A PRUEBA DE BALAS: Forzamos TODO a minúsculas y sin espacios
    const usuarioLocal = JSON.parse(localStorage.getItem('usuario') || '{}');
    const rolBruto = (localStorage.getItem('rol') || usuarioLocal.vchRol || usuarioLocal.rol || 'invitado');
    const rolNormalizado = rolBruto.trim().toLowerCase(); // ej: "vendedor"
    
    // Extraemos la ruta y eliminamos basuras como "?id=5" o "#ancla"
    const pathFull = window.location.pathname.toLowerCase();
    let paginaActual = pathFull.split('/').pop() || 'index.html';
    paginaActual = paginaActual.split('?')[0].split('#')[0]; // Limpieza total de URL

    // 2. MATRIZ EN MINÚSCULAS (Para que el emparejamiento sea infalible)
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

    // Si el rol no existe, le damos el perfil vacío (Invitado)
    const misPermisos = matrizPermisos[rolNormalizado] || { modulos: [], puedeEscribir: false };

    // 3. DICCIONARIO
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

    // ====================================================================
    // A. CONTROL DEL MENÚ LATERAL
    // ====================================================================
    if (!misPermisos.modulos.includes('all')) {
        document.querySelectorAll('.nav-admin a').forEach(enlace => {
            // Limpiamos el enlace de la misma forma que la página actual
            let href = enlace.getAttribute('href').toLowerCase();
            href = href.split('?')[0].split('#')[0].split('/').pop(); 
            
            const moduloDelEnlace = mapaRutas[href];

            // Si es un enlace de módulo y NO está en sus permisos, lo ocultamos
            if (moduloDelEnlace && !misPermisos.modulos.includes(moduloDelEnlace)) {
                enlace.style.display = 'none';
            }
        });
    }

    // ====================================================================
    // B. CONTROL DE ACCESO (Anti-Bucle)
    // ====================================================================
    if (mapaRutas[paginaActual]) {
        const moduloRequerido = mapaRutas[paginaActual];
        const tieneAcceso = misPermisos.modulos.includes('all') || misPermisos.modulos.includes(moduloRequerido);

        if (!tieneAcceso) {
            // SALIDA DE EMERGENCIA: Si no tiene NINGÚN módulo (Hubo error en el login)
            if (misPermisos.modulos.length === 0) {
                alert('Sesión inválida o rol no reconocido. Por favor, inicia sesión de nuevo.');
                window.location.replace('../login.html');
                return;
            }

            // Si sí tiene módulos, lo mandamos a su primera opción válida
            const primerModuloPermitido = misPermisos.modulos[0];
            const rutaDestino = Object.keys(mapaRutas).find(key => mapaRutas[key] === primerModuloPermitido);

            // PREVENCIÓN DE BUCLE: Evitamos redirigir a la misma página
            if (rutaDestino && rutaDestino !== paginaActual) {
                alert(`Acceso Restringido: Como ${rolBruto}, no tienes acceso al módulo de ${moduloRequerido}.`);
                window.location.replace(rutaDestino);
            } else {
                // Fallback de seguridad extrema
                window.location.replace('../index.html'); 
            }
            return; // Detenemos la ejecución
        }
    }

    // ====================================================================
    // C. BLOQUEO DE BOTONES Y FORMULARIOS
    // ====================================================================
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