document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const API_BASE = 'https://sistemaventasback.vercel.app/api/admin';
    
    const selectMarca = document.getElementById('intid_Marca');
    const selectCat = document.getElementById('intid_Categoria');
    const form = document.getElementById('form-nuevo-producto');
    const API_KEY_EXCHANGE = '71098f7428e3c5c09e430a12'; 
    let tasaActual = 0;

    async function obtenerTasaDolar() {
        try {
            const res = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY_EXCHANGE}/pair/USD/MXN`);
            const data = await res.json();
            if (data.result === "success") {
                tasaActual = data.conversion_rate;
                tasaTexto.textContent = `Tasa de hoy: 1 USD = $${tasaActual.toFixed(2)} MXN`;
            } else {
                tasaTexto.textContent = "Tasa no disponible actualmente.";
            }
        } catch (error) {
            tasaTexto.textContent = "Error al conectar con la API de moneda.";
        }
    }

    document.getElementById('btn-convertir').addEventListener('click', () => {
        if (tasaActual === 0) {
            alert("Aún no tenemos la tasa de cambio. Intenta de nuevo en un momento.");
            return;
        }
        const usd = prompt("Ingrese el costo en Dólares (USD):");
        if (usd && !isNaN(usd)) {
            const mxn = (parseFloat(usd) * tasaActual).toFixed(2);
            document.getElementById('floPrecioCompra').value = mxn;
            alert(`Convertido: $${usd} USD -> $${mxn} MXN`);
        }
    });

    
    async function cargarSelectores() {
        try {
            
            const resMarcas = await fetch(`${API_BASE}/marcas`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const marcas = await resMarcas.json();
            
            selectMarca.innerHTML = '<option value="">-- Selecciona Marca --</option>';
            marcas.forEach(m => {
                selectMarca.innerHTML += `<option value="${m.intid_Marca}">${m.vchNombre}</option>`;
            });

            
            const resCat = await fetch(`${API_BASE}/categorias`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const categorias = await resCat.json();
            
            selectCat.innerHTML = '<option value="">-- Selecciona Categoría --</option>';
            categorias.forEach(c => {
                selectCat.innerHTML += `<option value="${c.intid_Categoria}">${c.vchNombre}</option>`;
            });

            console.log("Selectores cargados con éxito");
        } catch (error) {
            console.error("Error cargando selectores:", error);
            alert("Error al cargar marcas/categorías. Verifica tu conexión.");
        }
    }


    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            
            const imagenInput = document.getElementById('vchImagen');
            const nombreImagen = imagenInput.files[0] ? imagenInput.files[0].name : 'default.jpg';

            
            const producto = {
                vchNo_Serie: document.getElementById('vchNo_Serie').value.trim(),
                vchNombre: document.getElementById('vchNombre').value.trim(),
                vchDescripcion: document.getElementById('vchDescripcion').value.trim(),
                floPrecioCompra: parseFloat(document.getElementById('floPrecioCompra').value),
                floPrecioUnitario: parseFloat(document.getElementById('floPrecioUnitario').value),
                intStock: parseInt(document.getElementById('intStock').value) || 0,
                intid_Categoria: parseInt(selectCat.value),
                intid_Marca: parseInt(selectMarca.value),
                vchImagen: nombreImagen
            };

            try {
                const response = await fetch(`${API_BASE}/productos`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(producto)
                });

                const result = await response.json();

                if (response.ok) {
                    alert("✅ ¡Producto registrado con éxito!");
                    window.location.href = 'menuAdministrador.html';
                } else {
                    alert("❌ Error: " + (result.mensaje || "No se pudo guardar"));
                }
            } catch (error) {
                alert("⚠️ Error de conexión con el servidor.");
            }
        });
    }

    
    cargarSelectores();
    obtenerTasaDolar();
});