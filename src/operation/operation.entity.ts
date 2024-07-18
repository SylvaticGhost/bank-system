import {OperationType} from "./operationTypes";

export class Operation {
    readonly transactionId: string;
    readonly accountId: string;
    readonly partnerId: string;
    readonly amount: number;
    readonly currency: string;
    readonly time: Date;
    readonly type: OperationType;
    readonly comment: string;
}