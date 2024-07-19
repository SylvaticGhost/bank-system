export const ACCOUNT_TYPES = {
    CASH: 'CASH'
}

type ObjectValues<T> = T[keyof T];

export type AccountType = ObjectValues<typeof ACCOUNT_TYPES>;