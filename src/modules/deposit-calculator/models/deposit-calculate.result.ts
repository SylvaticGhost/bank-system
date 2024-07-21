import {Currency} from "../../../buisness-info/currencies";

export class DepositCalculateResult {
    readonly amount: number;
    readonly currency: Currency;
    readonly rate: number;
    readonly years: number;
    readonly resultSum: number;
    readonly benefit: number;
}