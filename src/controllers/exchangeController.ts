import { CryptoService } from '../services/cryptoService';
import { CurrencyService } from '../services/currencyService';
import { convertSymbolToId, getCryptos, getCurrencies, roundNumber } from '../utils/util';
import { Currency } from '../entity/Currency';
import { getConnection, getRepository } from 'typeorm';
import cryptoData from '../dummy/crypto';
import currencyData from '../dummy/currency';

const cryptoService   = new CryptoService();
const currencyService = new CurrencyService;

export class ExchangeController {

    async initialSync(){
        const cryptos      = getCryptos();
        const currencies   = getCurrencies();
        const cryptoData   = await cryptoService.simplePrice(Object.values(cryptos));  // { ethereum: { usd: 228.21 }, bitcoin: { usd: 9186.04 } }
        const currencyData = await currencyService.getCurrency(currencies);            // { "USDEUR": 0.88827, "USDAFN": 77.197331 }
        
        
        Object.keys(cryptoData).forEach((crypto) => {
            Object.keys(currencyData).forEach((currency) =>{
                let currencyKey   = currency.toLocaleLowerCase().replace('usd', '');               // API RETURNS USDEUR and we need only eur for key
                let currencyValue = roundNumber(cryptoData[crypto].usd * currencyData[currency]);
                Object.assign(cryptoData[crypto], { [currencyKey]: currencyValue} )
            })
        });
        return this.store(cryptoData);
    }

    async store(cryptoData){
        const repository    = getConnection().getRepository(Currency);
        const currency      = new Currency();
              currency.data = JSON.stringify(cryptoData);
        return repository.save(currency);
    }
    
    validateRequest(req, res, next){
        let { crypto, currency } = req.query;
        if (!crypto || !currency)  return res.status(409).json({error: 'BAD REQUEST'});
        const availableCryptos  = Object.keys(getCryptos());
        const availableCurrency = getCurrencies();
        if (!availableCryptos.includes(crypto) || !availableCurrency.includes(currency)){
            return res.status(404).json({ 
                error: 'Not available crypto-currency exchange rate',
                availableCryptos,
                availableCurrency
             });
        }
        return next();
    }


    async getCurrency(req, res){
        let { crypto, currency, sync} = req.query;
        if(sync) await this.initialSync();
        let   currencies     = await this.getLocalData(crypto, currency);
        const currenciesData = JSON.parse(currencies.data);
        return {
            crypto,
            currency,
            value      : currenciesData[getCryptos(crypto)][currency],
            last_update: currencies.last_update
        }
    }

    async getLocalData(crypto, currency){
        const repository = getConnection().getRepository(Currency);
        return repository.findOne({
            order: {
                id: "DESC"
            }
        });
    }

}