document.addEventListener('DOMContentLoaded', () => {
    renderCarrito();

    const btnCheckout = document.getElementById('btn-checkout');
    if (btnCheckout) {
        btnCheckout.addEventListener('click', procesarPago);
    }
});

function renderCarrito() {
    const contenedor = document.getElementById('lista-carrito');
    const totalElemento = document.getElementById('cart-total');
    const items = Cart.get();
    let totalAcumulado = 0;

    if (!contenedor) return;

    if (items.length === 0) {
        contenedor.innerHTML = `
            <div style="text-align:center; padding:50px;">
                <p>Tu carrito está vacío</p>
                <a href="../index.html" class="comprarproducto" style="display:inline-block; margin-top:20px; text-decoration:none;">Volver al catálogo</a>
            </div>`;
        if (totalElemento) totalElemento.textContent = GlobalCurrency.format(0);
        const btn = document.getElementById('btn-checkout');
        if (btn) btn.disabled = true;
        return;
    }

    contenedor.innerHTML = '';

    items.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        totalAcumulado += subtotal;

        const itemHTML = `
            <div class="cart-item" style="display: flex; align-items: center; justify-content: space-between; padding: 15px; border-bottom: 1px solid #eee;">
                <img src="${item.img}" alt="${item.nombre}" style="width: 70px; height: 70px; object-fit: contain;">
                <div style="flex: 1; margin-left: 20px;">
                    <h4 style="margin:0;">${item.nombre}</h4>
                    <p style="margin:5px 0; color: #666;">Precio: ${GlobalCurrency.format(item.precio)}</p>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <button onclick="cambiarCantidad('${item.id}', -1)" style="cursor:pointer; padding:2px 8px;">-</button>
                        <span>${item.cantidad}</span>
                        <button onclick="cambiarCantidad('${item.id}', 1)" style="cursor:pointer; padding:2px 8px;">+</button>
                    </div>
                </div>
                <div style="text-align: right;">
                    <p style="font-weight: bold; margin:0;">${GlobalCurrency.format(subtotal)}</p>
                    <button onclick="eliminarDelCarrito('${item.id}')" style="color:red; background:none; border:none; cursor:pointer; font-size: 0.8rem; margin-top:10px;">Eliminar</button>
                </div>
            </div>
        `;
        contenedor.innerHTML += itemHTML;
    });

    if (totalElemento) totalElemento.textContent = GlobalCurrency.format(totalAcumulado);
    const btn = document.getElementById('btn-checkout');
    if (btn) btn.disabled = false;
}

window.cambiarCantidad = (id, delta) => {
    let items = Cart.get();
    const item = items.find(i => i.id === id);
    if (item) {
        item.cantidad += delta;
        if (item.cantidad <= 0) {
            items = items.filter(i => i.id !== id);
        }
        localStorage.setItem(Cart.key, JSON.stringify(items));
        Cart.updateUI();
        renderCarrito();
    }
};

window.eliminarDelCarrito = (id) => {
    let items = Cart.get().filter(i => i.id !== id);
    localStorage.setItem(Cart.key, JSON.stringify(items));
    Cart.updateUI();
    renderCarrito();
};

async function procesarPago() {
    const token = localStorage.getItem('token');
    const items = Cart.get();
    const total = items.reduce((acc, i) => acc + (i.precio * i.cantidad), 0);

    if (!token) {
        const msg = document.getElementById('msg-login');
        if (msg) msg.style.display = 'block';
        alert("Debes iniciar sesión para finalizar la compra.");
        window.location.href = "../login.html?redirect=carrito";
        return;
    }

    try {
        const response = await fetch('https://sistemaventasback.vercel.app/api/pedidos/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ total, items })
        });

        const data = await response.json();

        if (response.ok) {
            alert("¡Compra realizada con éxito! Pedido #" + data.pedidoId);
            localStorage.removeItem(Cart.key);
            window.location.href = "../index.html";
        } else {
            throw new Error(data.message || "Error al procesar pedido");
        }
    } catch (error) {
        console.error(error);
        alert("Hubo un error al procesar tu compra.");
    }
}