const Cart = {
    key: 'comercializadora_cart',

    get() {
        return JSON.parse(localStorage.getItem(this.key) || '[]');
    },

    add(producto) {
        let items = this.get();
        const existe = items.find(i => i.id === producto.id);
        
        if (existe) {
            existe.cantidad += 1;
        } else {
            items.push({ ...producto, cantidad: 1 });
        }
        
        localStorage.setItem(this.key, JSON.stringify(items));
        this.updateUI();
        alert(`¡${producto.nombre} añadido al carrito!`);
    },

    updateUI() {
        const items = this.get();
        const totalItems = items.reduce((acc, item) => acc + item.cantidad, 0);
        const badge = document.getElementById('cart-count');
        if (badge) badge.textContent = totalItems;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    if (typeof Cart !== 'undefined') {
        Cart.updateUI();
    }
});