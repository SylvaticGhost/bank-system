export const CURRENCIES = {
    UAH: 'UAH',
    USD: 'USD',
    EUR: 'EUR',
    PLN: 'PLN',
    GBP: 'GBP',
}

type ObjectValues<T> = T[keyof T];

export type Currency = ObjectValues<typeof CURRENCIES>;