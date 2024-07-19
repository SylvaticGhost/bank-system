import {OperationType} from "../../../buisness-info/operation-types";
import {Currency} from "../../../buisness-info/currencies";

export class Transaction {
    readonly transactionId: string;
    readonly accountId: string;
    readonly partnerId: string;
    readonly amount: number;
    readonly currency: Currency;
    readonly time: Date;
    readonly type: OperationType;
    readonly comment: string;
}