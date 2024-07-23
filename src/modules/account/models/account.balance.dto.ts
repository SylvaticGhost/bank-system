import { Currency } from '../../../buisness-info/currencies';

export type AccountBalanceDto = {
    accountId: string;
    balance: number;
    currency: Currency;
}