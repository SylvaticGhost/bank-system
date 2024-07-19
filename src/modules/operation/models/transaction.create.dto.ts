export type TransactionCreateDto = {
    readonly accountId: string;
    readonly partnerId: string;
    readonly amount: number;
    readonly currency: string;
    readonly time: Date;
    readonly type: string;
    readonly comment: string;
}