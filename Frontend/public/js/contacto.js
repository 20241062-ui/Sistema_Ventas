document.addEventListener('DOMContentLoaded', async () => {
    const API_URL = 'https://sistema-ventas-omega.vercel.app/api/public';

    // 1. Cargar Información de Contacto
    try {
        const response = await fetch(`${API_URL}/contacto-info`);
        const info = await response.json();

        document.getElementById('info-tel').textContent = info.telefono || info.teléfono || 'No disponible';
        document.getElementById('info-correo').textContent = info.correo || 'No disponible';
        
        if(info.facebook) document.getElementById('link-fb').href = info.facebook;
        if(info.instagram) document.getElementById('link-ig').href = info.instagram;
        if(info.x) document.getElementById('link-x').href = info.x;
    } catch (error) {
        console.error('Error al cargar info de contacto:', error);
    }

    // 2. Manejar envío del formulario
    const form = document.getElementById('form-contacto');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            nombre: form.nombre.value,
            correo: form.correo.value,
            mensaje: form.mensaje.value
        };

        try {
            const response = await fetch(`${API_URL}/enviar-mensaje`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const result = await response.json();

            if(result.success) {
                alert(result.message);
                form.reset();
            } else {
                alert('Error: ' + result.message);
            }
        } catch (error) {
            alert('Error de conexión al enviar el mensaje.');
        }
    });
});