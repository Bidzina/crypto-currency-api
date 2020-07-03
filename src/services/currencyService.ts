const axios = require('axios');

export class CurrencyService {
    async getCurrency(currencies: Array<String>){
        let url = `http://apilayer.net/api/live?access_key=${process.env.ACCESS_KEY}&currencies=${currencies.join()}&source=USD&format=1`;
        let response = await axios.get(url);
        return response.data.quotes;
    }
}