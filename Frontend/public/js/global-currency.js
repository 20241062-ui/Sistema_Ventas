// public/js/global-currency.js
const GlobalCurrency = {
    rate: 1,
    currencyCode: 'MXN',
    symbol: '$',
    isLoaded: false,

    async init() {
        try {
            // 1. Intentar obtener localización (HTTPS obligatorio para GitHub Pages)
            const geoRes = await fetch('https://ipapi.co/json/');
            
            if (geoRes.ok) {
                const geoData = await geoRes.json();
                if (geoData && geoData.currency) {
                    this.currencyCode = geoData.currency;
                    // Mapeo rápido de símbolos
                    const symbols = { 'USD': '$', 'EUR': '€', 'MXN': '$', 'COP': '$', 'ARS': '$' };
                    this.symbol = symbols[this.currencyCode] || '$';
                }
            }

            // 2. Obtener tasa de cambio solo si la moneda cambió
            if (this.currencyCode !== 'MXN') {
                const apiKey = '71098f7428e3c5c09e430a12';
                const exRes = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/pair/MXN/${this.currencyCode}`);
                
                if (exRes.ok) {
                    const exData = await exRes.json();
                    this.rate = exData.conversion_rate || 1;
                }
            }

            console.log(`✅ Localización: ${this.currencyCode} (Tasa: ${this.rate})`);
        } catch (error) {
            console.warn("⚠️ Modo seguro: Usando MXN por bloqueo de red o CORS.");
            // No hacemos nada, ya tenemos los valores por defecto arriba
        } finally {
            this.isLoaded = true;
            // IMPORTANTE: Disparar el evento para que home.js y productos.js despierten
            document.dispatchEvent(new CustomEvent('currencyReady'));
        }
    },

    format(amount) {
        try {
            const valorBase = parseFloat(amount) || 0;
            const calculo = (valorBase * this.rate).toFixed(2);
            // Retornamos el precio con formato limpio
            return `${this.symbol}${parseFloat(calculo).toLocaleString('es-MX', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })} ${this.currencyCode}`;
        } catch (e) {
            console.error("Error al formatear moneda:", e);
            return `$${amount} MXN`;
        }
    }
};

GlobalCurrency.init();