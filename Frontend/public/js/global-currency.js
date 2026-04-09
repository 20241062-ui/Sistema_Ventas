const GlobalCurrency = {
    rate: 1,
    currencyCode: 'MXN',
    symbol: '$',
    isLoaded: false,

    async init() {
        try {
            const geoRes = await fetch('https://ipapi.co/json/');
            
            if (!geoRes.ok) throw new Error("Fallo de red");
            
            const geoData = await geoRes.json();
            
            if (geoData && geoData.currency) {
                this.currencyCode = geoData.currency;
                const symbols = { 'USD': '$', 'EUR': '€', 'MXN': '$', 'COP': '$', 'ARS': '$' };
                this.symbol = symbols[this.currencyCode] || '$';
            }

            const apiKey = '71098f7428e3c5c09e430a12';
            const exRes = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/pair/MXN/${this.currencyCode}`);
            
            if (exRes.ok) {
                const exData = await exRes.json();
                this.rate = exData.conversion_rate || 1;
            }

            console.log(`✅ Geolocalización exitosa: ${this.currencyCode}`);
        } catch (error) {
            console.warn("⚠️ Usando moneda base (MXN) por bloqueo de API o CORS.");
        } finally {
            this.isLoaded = true;
            document.dispatchEvent(new CustomEvent('currencyReady'));
        }
    },

    format(amount) {
        const valor = parseFloat(amount) || 0;
        const convertido = (valor * this.rate).toFixed(2);
        return `${this.symbol}${parseFloat(converted).toLocaleString()} ${this.currencyCode}`;
    }
};

GlobalCurrency.init();