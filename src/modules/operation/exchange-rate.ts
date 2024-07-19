import * as process from "node:process";
import {Currency} from "../../buisness-info/currencies";

const apiUrl = 'https://api.currencybeacon.com/v1';
const apiKey = process.env.CURRENCY_API_KEY;

async function fetchExchangeRate(path: string, baseCurrency: Currency, targetCurrency: Currency, date?: Date) {
    const url = `${apiUrl}/${path}?api_key=${apiKey}&base=${baseCurrency}&symbols=${targetCurrency}`
        + (date ? `&date=${date.toISOString()}` : '');
    const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    return Number(data.response.rates[targetCurrency]);
}

export const getExchangeRateLatest = (baseCurrency: Currency, targetCurrency: Currency) =>
    fetchExchangeRate('latest', baseCurrency, targetCurrency);

export const getExchangeRateHistorical = (baseCurrency: Currency, targetCurrency: Currency, date: Date) => 
    fetchExchangeRate('historical', baseCurrency, targetCurrency, date);