export const OPERATION_TYPES = {
    TRANSFER : 'TRANSFER',
    DEPOSIT : 'DEPOSIT',
    TOP_UP: 'TOP_UP'
}

type ObjectValues<T> = T[keyof T];

export type OperationType = ObjectValues<typeof OPERATION_TYPES>;