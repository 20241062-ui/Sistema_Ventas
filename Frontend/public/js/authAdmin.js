document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const API_URL = 'https://sistemaventasback.vercel.app/api/usuarios';

    if (!token) {
        window.location.href = '../login.html';
        return;
    }

    if (window.location.pathname.includes('perfilAdmin.html')) {
        try {
            const res = await fetch(`${API_URL}/perfil-admin`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();

            if (res.ok) {
                const menuP = document.querySelector('.perfil-menu p');
                if (menuP) menuP.innerHTML = `${data.vchNombre}<br>${data.vchCorreo}`;
                
                const infoDiv = document.querySelector('.perfil-info');
                if (infoDiv) {
                    infoDiv.innerHTML = `
                        <h3>Información del administrador</h3>
                        <p><strong>Nombre:</strong> ${data.vchNombre}</p>
                        <p><strong>Apellido Paterno:</strong> ${data.vchApellidoP}</p>
                        <p><strong>Apellido Materno:</strong> ${data.vchApellidoM}</p>
                        <p><strong>Correo:</strong> ${data.vchCorreo}</p>
                        <button class="btn-editar" onclick="window.location.href='actualizarPerfilA.html'">Editar perfil</button>
                    `;
                }
            }
        } catch (error) {
            console.error("Error cargando perfil:", error);
        }
    }

    const form = document.querySelector('form');
    if (form && window.location.pathname.includes('actualizarPerfilA.html')) {
        try {
            const res = await fetch(`${API_URL}/perfil-admin`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            
            if (form.querySelector('input[name="vchnombre"]')) 
                form.querySelector('input[name="vchnombre"]').value = data.vchNombre;
            if (form.querySelector('input[name="vchapellidoP"]')) 
                form.querySelector('input[name="vchapellidoP"]').value = data.vchApellidoP;
            if (form.querySelector('input[name="vchapellidoM"]')) 
                form.querySelector('input[name="vchapellidoM"]').value = data.vchApellidoM;

            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const body = {
                    vchnombre: form.vchnombre.value,
                    vchapellidoP: form.vchapellidoP.value,
                    vchapellidoM: form.vchapellidoM.value,
                    vchpassword: form.vchpassword.value || null
                };

                const updateRes = await fetch(`${API_URL}/actualizar-admin`, {
                    method: 'PUT',
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json' 
                    },
                    body: JSON.stringify(body)
                });

                if (updateRes.ok) {
                    alert("✅ ¡Datos actualizados con éxito!");
                    window.location.href = 'perfilAdmin.html';
                } else {
                    const error = await updateRes.json();
                    alert("❌ Error: " + error.message);
                }
            });
        } catch (error) {
            console.error("Error al preparar edición:", error);
        }
    }
});