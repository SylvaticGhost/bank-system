import {Currency} from "../../buisness-info/currencies";
import {OperationType} from "../../buisness-info/operation-types";

export class Operation {
    readonly transactionId: string;
    readonly accountId: string;
    readonly partnerId: string;
    readonly amount: number;
    readonly currency: Currency;
    readonly time: Date;
    readonly type: OperationType;
    readonly comment: string;
}