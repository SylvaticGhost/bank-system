export const OPERATION_TYPES = {
    TRANSFER : 'TRANSFER',
    DEPOSIT : 'DEPOSIT',
}

type ObjectValues<T> = T[keyof T];

export type OperationType = ObjectValues<typeof OPERATION_TYPES>;