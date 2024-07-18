import {OperationType} from "../operationTypes";
import {Currency} from "../../account/currencies";

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