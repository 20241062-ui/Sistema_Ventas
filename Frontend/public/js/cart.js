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
        alert(`¡${producto.nombre} agregado al carrito!`);
    },

    updateUI() {
        const count = this.get().reduce((acc, item) => acc + item.cantidad, 0);
        const el = document.getElementById('cart-count');
        if (el) el.textContent = count;
    }
};

document.addEventListener('DOMContentLoaded', () => Cart.updateUI());