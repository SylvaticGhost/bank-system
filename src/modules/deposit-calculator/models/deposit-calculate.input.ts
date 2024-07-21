import {Currency} from "../../../buisness-info/currencies";
import {IsCurrencyValid} from "../../../decorators/isCurrencyValid.decorator";
import {Min} from "class-validator";

export class DepositCalculateInput {
    @IsCurrencyValid()
    readonly currency: Currency;
    
    @Min(1, {message: 'Amount must be greater than 0'})
    readonly amount: number;
    
    @Min(1, {message: 'Years must be greater than 0'})
    readonly years: number;
}