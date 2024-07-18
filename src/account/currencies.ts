export const CURRENCIES = {
    UAH: 'UAH',
    USD: 'USD',
    EUR: 'EUR',
    PLN: 'PLN',
    GBP: 'GBP',
}

type ObjectValues<T> = T[keyof T];

export type Currency = ObjectValues<typeof CURRENCIES>;

export function validateCurrency(currency: any): currency is Currency {
    return Object.values(CURRENCIES).includes(currency);
}