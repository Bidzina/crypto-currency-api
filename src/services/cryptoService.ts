const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();


export class CryptoService { 
    
    test(){
        return CoinGeckoClient.ping();
    }

    getCoins(){
        return CoinGeckoClient.coins.list();
    }

    fetchCoins(){
        //data.market_data.current_price
        return CoinGeckoClient.coins.fetch('bitcoin', {});
    }

    exchangeRate(){
        return CoinGeckoClient.exchangeRates.all();
    }

    getData(){
        return CoinGeckoClient.global();
    }

    market(){
        return CoinGeckoClient.coins.markets({
            ids: ['bitcoin', 'ethereum'],
            vs_currency: []
        });
    }

    async simplePrice(cryptos: Array<string>){
        let response = await CoinGeckoClient.simple.price({
            ids: cryptos,
            vs_currencies: [],
        });
        
        return response.data;

    }
}