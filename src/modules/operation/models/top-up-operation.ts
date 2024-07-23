export class TopUpOperation {
    readonly transactionId: string;
    readonly accountId: string;
    readonly amount: number;
    readonly currency: string;
    readonly time: Date;
}