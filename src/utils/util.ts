export function convertSymbolToId(symbol: string){
    const crypto = {
        "btc" : "bitcoin",
        "eth" : "ethereum",
        "ltc" : "litecoin",
        "xmr" : "monero"
    }

    return crypto[symbol];
}


export function getCryptos(symbol? : string){
    const cryptos = {
        "btc": "bitcoin",
        "eth": "ethereum",
        "ltc": "litecoin",
        "xmr": "monero"
    };
    if(symbol) return cryptos[symbol];
    return cryptos;
}

export function getCurrencies(){
    return [ "usd", "eur", "afn", "amd", "bgn" ];
}

export function roundNumber(num){
    return Math.round((num + Number.EPSILON) * 100) / 100
}