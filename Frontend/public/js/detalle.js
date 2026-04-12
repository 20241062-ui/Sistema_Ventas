const API_URL_DETALLE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api'
    : 'https://sistemaventasback.vercel.app/api';

document.addEventListener('currencyReady', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productoId = urlParams.get('producto_id');

    if (!productoId) {
        console.warn("No se proporcionó producto_id, redirigiendo...");
        window.location.href = '../index.html';
        return;
    }

    try {
        const response = await fetch(`${API_URL_DETALLE}/productos/detalle/${productoId}`);

        if (!response.ok) {
            throw new Error("Producto no encontrado en el servidor");
        }

        const prod = await response.json();

        if (document.getElementById('det-nombre')) {
            document.title = `${prod.vchNombre} - Doble L`;

            document.getElementById('det-marca').textContent = prod.vchMarca || prod.Marca || "Genérico";
            document.getElementById('det-nombre').textContent = prod.vchNombre;
            document.getElementById('det-descripcion').textContent = prod.vchDescripcion;

            const precioBase = parseFloat(prod.floPrecioUnitario);
            document.getElementById('det-precio').textContent = GlobalCurrency.format(precioBase);

            const inputId = document.getElementById('det-id');
            if (inputId) {
                inputId.value = prod.vchNo_Serie;
            }

            const imgContenedor = document.getElementById('contenedor-img');
            if (imgContenedor) {
                const imgUrl = prod.vchImagen
                    ? prod.vchImagen
                    : 'https://res.cloudinary.com/dnu57rgek/image/upload/v1774479182/sin-imagen.png';

                imgContenedor.innerHTML = `
                    <img src="${imgUrl}" 
                        alt="${prod.vchNombre}" 
                        class="imagen-detalle-principal">
                `;
            }
        }
        const btnAdd = document.getElementById('btn-add-detalle');
        if (btnAdd) {
            btnAdd.onclick = () => {
                Cart.add({
                    id: prod.vchNo_Serie,
                    nombre: prod.vchNombre,
                    precio: parseFloat(prod.floPrecioUnitario),
                    img: prod.vchImagen || 'https://res.cloudinary.com/dnu57rgek/image/upload/v1774479182/sin-imagen.png'
                });
            };
        }
        const btnAgregar = document.getElementById('btn-agregar-al-carrito');

        if (btnAgregar) {
            btnAgregar.addEventListener('click', () => {
                const producto = {
                    id: document.getElementById('det-id').value,
                    nombre: document.getElementById('det-nombre').textContent,
                    precio: parseFloat(document.getElementById('det-precio').textContent.replace(/[^0-9.-]+/g, "")),
                    img: document.querySelector('.imagen-detalle-principal').src
                };

                if (producto.id) {
                    Cart.add(producto);
                } else {
                    alert("Error: No se pudo cargar la información del producto.");
                }
            });
        }
    } catch (error) {
        console.error("Error al cargar el detalle del producto:", error);
        const contenedor = document.querySelector('.producto-detalle-contenedor');
        if (contenedor) {
            contenedor.innerHTML = `<p style="text-align:center; padding: 50px;">Error al cargar el producto. Inténtelo más tarde.</p>`;
        }
    }
});