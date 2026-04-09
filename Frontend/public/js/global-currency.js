const GlobalCurrency = {
    rate: 1,
    currencyCode: 'MXN',
    symbol: '$',
    isLoaded: false,

    async init() {
        try {
            const geoRes = await fetch('https://ssl.geoplugin.net/json.gp');
            const geoData = await geoRes.json();
            
            this.currencyCode = geoData.geoplugin_currencyCode || 'MXN';
            this.symbol = geoData.geoplugin_currencySymbol_UTF8 || '$';

            const apiKey = '71098f7428e3c5c09e430a12'; 
            const exRes = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/pair/MXN/${this.currencyCode}`);
            const exData = await exRes.json();

            if (exData.result === "success") {
                this.rate = exData.conversion_rate;
            }
            
            console.log(`Localización exitosa: ${this.currencyCode} (Tasa: ${this.rate})`);
        } catch (error) {
            console.error("Error en globalización, usando valores por defecto:", error);
        } finally {
            this.isLoaded = true;
            document.dispatchEvent(new CustomEvent('currencyReady'));
        }
    },

    format(amount) {
        const converted = (parseFloat(amount) * this.rate).toFixed(2);
        return `${this.symbol}${parseFloat(converted).toLocaleString()} ${this.currencyCode}`;
    }
};

GlobalCurrency.init();