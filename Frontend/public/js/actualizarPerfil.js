document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const API_URL = 'https://sistema-ventas-omega.vercel.app/api/user';
    const form = document.getElementById('form-actualizar-perfil');

    if (!token) { window.location.href = '../login.html'; return; }

    // 1. Cargar datos actuales en el formulario
    try {
        const response = await fetch(`${API_URL}/perfil`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const user = await response.json();

        document.getElementById('menu-user-info').innerHTML = `${user.vchNombre} ${user.vchApellido_Paterno}<br>${user.vchCorreo}`;
        document.getElementById('input-nombre').value = user.vchNombre;
        document.getElementById('input-paterno').value = user.vchApellido_Paterno;
        document.getElementById('input-materno').value = user.vchApellido_Materno;
        document.getElementById('input-correo').value = user.vchCorreo;
        document.getElementById('vchTelefono').value = user.vchTelefono || '';
    } catch (e) { console.error(e); }

    // 2. Manejar el envío de cambios
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const telefono = document.getElementById('vchTelefono').value;
        if (telefono && !/^[0-9]{10}$/.test(telefono)) {
            alert('El teléfono debe tener 10 dígitos.');
            return;
        }

        const datos = Object.fromEntries(new FormData(form));

        try {
            const response = await fetch(`${API_URL}/actualizar`, {
                method: 'PUT',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(datos)
            });
            const res = await response.json();

            if (res.success) {
                alert('¡Datos actualizados!');
                window.location.href = 'perfil.html';
            } else {
                alert('Error al actualizar: ' + res.message);
            }
        } catch (err) { alert('Error de conexión'); }
    });

    // Validación de solo números para teléfono
    document.getElementById('vchTelefono').onkeypress = (e) => {
        if (e.which < 48 || e.which > 57) e.preventDefault();
    };
});