document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const API_URL = 'https://sistemaventasback.vercel.app/api';
    const form = document.getElementById('form-actualizar-perfil');

    if (!token) { window.location.href = '../login.html'; return; }

    try {
        const response = await fetch(`${API_URL}/usuarios/perfil`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const user = await response.json();

        document.getElementById('menu-user-info').innerHTML = `<strong>${user.vchNombre}</strong><br>${user.vchCorreo}`;
        document.getElementById('input-nombre').value = user.vchNombre;
        document.getElementById('input-paterno').value = user.vchApellido_Paterno;
        document.getElementById('input-materno').value = user.vchApellido_Materno || '';
        document.getElementById('input-correo').value = user.vchCorreo;
        document.getElementById('vchTelefono').value = user.vchTelefono || '';
    } catch (e) { console.error("Error cargando datos:", e); }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const telefono = document.getElementById('vchTelefono').value;
        if (telefono && !/^[0-9]{10}$/.test(telefono)) {
            alert('El teléfono debe tener 10 dígitos.');
            return;
        }

        const formData = new FormData(form);
        const datos = Object.fromEntries(formData.entries());

        if (!datos.vchpassword) delete datos.vchpassword;

        try {
            const response = await fetch(`${API_URL}/usuarios/actualizar`, {
                method: 'PUT',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(datos)
            });

            if (response.ok) {
                alert('¡Datos actualizados con éxito!');
                window.location.href = 'perfil.html';
            } else {
                const res = await response.json();
                alert('Error al actualizar: ' + (res.mensaje || res.message || 'Error desconocido'));
            }
        } catch (err) { 
            alert('Error de conexión con el servidor'); 
        }
    });

    const telInput = document.getElementById('vchTelefono');
    if(telInput){
        telInput.onkeypress = (e) => {
            if (e.which < 48 || e.which > 57) e.preventDefault();
        };
    }
});