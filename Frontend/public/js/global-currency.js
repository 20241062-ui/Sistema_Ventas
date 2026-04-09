const GlobalCurrency = {
    rate: 1,
    currencyCode: 'MXN',
    symbol: '$',
    isLoaded: false,
    
    format(amount) {
        try {
            const valor = parseFloat(amount);
            if (isNaN(valor)) return "$0.00 MXN";
            const converted = (valor * this.rate).toFixed(2);
            return `${this.symbol}${parseFloat(converted).toLocaleString()} ${this.currencyCode}`;
        } catch (e) {
            return `$${amount} MXN`;
        }
    }
};

async function iniciarGlobalizacion() {
    try {
        const geoRes = await fetch('https://ipapi.co/json/').catch(() => null);
        
        if (geoRes && geoRes.ok) {
            const geoData = await geoRes.json();
            GlobalCurrency.currencyCode = geoData.currency || 'MXN';
            GlobalCurrency.symbol = (GlobalCurrency.currencyCode === 'USD') ? '$' : '$';

            const apiKey = '71098f7428e3c5c09e430a12'; 
            const exRes = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/pair/MXN/${GlobalCurrency.currencyCode}`).catch(() => null);
            
            if (exRes && exRes.ok) {
                const exData = await exRes.json();
                GlobalCurrency.rate = exData.conversion_rate || 1;
            }
        }
    } catch (error) {
        console.warn("Usando configuración de moneda local por fallo de red.");
    } finally {
        GlobalCurrency.isLoaded = true;
        document.dispatchEvent(new CustomEvent('currencyReady'));
    }
}

iniciarGlobalizacion();