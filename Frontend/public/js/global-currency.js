const GlobalCurrency = {
    rate: 1,
    currencyCode: 'MXN',
    symbol: '$',
    isLoaded: false,

    async init() {
        try {
            const geoRes = await fetch('https://ipapi.co/json/');
            
            if (!geoRes.ok) throw new Error("Fallo al obtener localización");
            
            const geoData = await geoRes.json();
            
            this.currencyCode = geoData.currency || 'MXN';
            this.symbol = (this.currencyCode === 'USD') ? '$' : 
                        (this.currencyCode === 'EUR') ? '€' : '$';

            const apiKey = '71098f7428e3c5c09e430a12'; 
            const exRes = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/pair/MXN/${this.currencyCode}`);
            
            if (exRes.ok) {
                const exData = await exRes.json();
                if (exData && exData.conversion_rate) {
                    this.rate = exData.conversion_rate;
                }
            }
            
            console.log(`Sistema localizado: ${this.currencyCode} (Tasa: ${this.rate})`);
        } catch (error) {
            console.error("Error controlado en globalización (CORS evitado):", error.message);
            this.currencyCode = 'MXN';
            this.rate = 1;
            this.symbol = '$';
        } finally {
            this.isLoaded = true;
            document.dispatchEvent(new CustomEvent('currencyReady'));
        }
    },

    format(amount) {
        const valor = parseFloat(amount) || 0;
        const converted = (valor * this.rate).toFixed(2);
        return `${this.symbol}${parseFloat(converted).toLocaleString()} ${this.currencyCode}`;
    }
};

GlobalCurrency.init();