const GlobalCurrency = {
    rate: 1,
    currencyCode: 'MXN',
    symbol: '$',
    isLoaded: false,

    async init() {
        try {
            const apiKeyRegistry = 'ira_uXQ52bfBzInLCdkfRm4EneLbngkj8L1IrlbC'; 
            
            const res = await fetch(`https://api.ipregistry.co/?key=${apiKeyRegistry}`);
            if (!res.ok) throw new Error("Fallo en la conexión con IPRegistry");
            
            const data = await res.json();

            if (data && data.currency) {
                this.currencyCode = data.currency.code;
                this.symbol = data.currency.symbol;
            }

            if (this.currencyCode !== 'MXN') {
                const apiKeyExchange = '71098f7428e3c5c09e430a12';
                const exRes = await fetch(`https://v6.exchangerate-api.com/v6/${apiKeyExchange}/pair/MXN/${this.currencyCode}`);
                
                if (exRes.ok) {
                    const exData = await exRes.json();
                    this.rate = exData.conversion_rate || 1;
                }
            }

            console.log(`✅ IPRegistry: Localizado en ${this.currencyCode} (Tasa: ${this.rate})`);
        } catch (error) {
            console.warn("⚠️ Usando moneda base (MXN) por error de API:", error.message);
        } finally {
            this.isLoaded = true;
            document.dispatchEvent(new CustomEvent('currencyReady'));
        }
    },

    format(amount) {
        try {
            const valor = parseFloat(amount) || 0;
            const total = (valor * this.rate).toFixed(2);
            return `${this.symbol}${parseFloat(total).toLocaleString('es-MX', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })} ${this.currencyCode}`;
        } catch (e) {
            return `$${amount} MXN`;
        }
    }
};

GlobalCurrency.init();