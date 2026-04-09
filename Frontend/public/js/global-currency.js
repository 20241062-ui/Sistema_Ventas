const GlobalCurrency = {
    rate: 1,
    currencyCode: 'MXN',
    symbol: '$',
    isLoaded: false,

    async init() {
        try {
            const geoRes = await fetch('https://ssl.geoplugin.net/json.gp');
            
            if (!geoRes.ok) throw new Error("Fallo en GeoPlugin");
            
            const geoData = await geoRes.json();
            
            if (geoData) {
                this.currencyCode = geoData.geoplugin_currencyCode || 'MXN';
                this.symbol = geoData.geoplugin_currencySymbol_UTF8 || '$';
            }

            const apiKey = '71098f7428e3c5c09e430a12'; 
            const exRes = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/pair/MXN/${this.currencyCode}`);
            
            if (exRes.ok) {
                const exData = await exRes.json();
                if (exData && exData.conversion_rate) {
                    this.rate = exData.conversion_rate;
                }
            }
            
        } catch (error) {
            console.error("Error controlado en globalización:", error.message);
        } finally {
            this.isLoaded = true;
            document.dispatchEvent(new CustomEvent('currencyReady'));
        }
    },

    format(amount) {
        const valorBase = amount ? parseFloat(amount) : 0;
        const converted = (valorBase * this.rate).toFixed(2);
        return `${this.symbol}${parseFloat(converted).toLocaleString()} ${this.currencyCode}`;
    }
};

GlobalCurrency.init();