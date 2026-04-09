// public/js/global-currency.js
const GlobalCurrency = {
    rate: 1,
    currencyCode: 'MXN',
    symbol: '$',
    isLoaded: false,

    async init() {
        try {
            // CAMBIO: Usamos ip-api.com que es excelente con CORS
            const geoRes = await fetch('http://ip-api.com/json/'); // Nota: Si falla por mixed content, usa https://ipapi.co/json/ nuevamente con el bloqueador de errores
            const geoData = await geoRes.json();
            
            // Si la API responde bien, intentamos obtener la moneda
            // Nota: ip-api gratuito a veces no da la moneda, así que usamos un pequeño truco:
            // Si detectamos que no es México (MX), ponemos USD por defecto para probar
            if (geoData && geoData.status === "success") {
                if (geoData.countryCode !== "MX") {
                    this.currencyCode = 'USD'; // Forzamos USD para extranjeros si la API falla en dar moneda
                    this.symbol = '$';
                }
            }

            // Tasa de cambio con tu API Key
            const apiKey = '71098f7428e3c5c09e430a12';
            const exRes = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/pair/MXN/${this.currencyCode}`);
            
            if (exRes.ok) {
                const exData = await exRes.json();
                this.rate = exData.conversion_rate || 1;
            }

            console.log(`✅ Geolocalización: ${this.currencyCode} (Tasa: ${this.rate})`);
        } catch (error) {
            console.warn("⚠️ Usando moneda base (MXN) por bloqueo de API o CORS.");
            this.currencyCode = 'MXN';
            this.rate = 1;
            this.symbol = '$';
        } finally {
            this.isLoaded = true;
            document.dispatchEvent(new CustomEvent('currencyReady'));
        }
    },

    // FUNCIÓN CORREGIDA (Sin errores de variable)
    format(amount) {
        try {
            const valorBase = parseFloat(amount) || 0;
            const resultado = (valorBase * this.rate).toFixed(2); // Usamos 'resultado'
            return `${this.symbol}${parseFloat(resultado).toLocaleString('es-MX', {minimumFractionDigits: 2})} ${this.currencyCode}`;
        } catch (e) {
            return `$${amount} MXN`;
        }
    }
};

GlobalCurrency.init();